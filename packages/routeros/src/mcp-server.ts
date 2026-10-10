#!/usr/bin/env node
// Model Context Protocol (MCP) Server — MikroTik RouterOS Gateway
// Protocol: JSON-RPC 2.0 over standard I/O (stdio)
// Spec: https://modelcontextprotocol.io/specification

import * as readline from 'node:readline';
import { RouterOSConnector } from './routeros-connector.js';
import { validateCommandSafety } from '@audira/security';

interface JsonRpcRequest {
  jsonrpc: '2.0';
  id?: string | number | null;
  method: string;
  params?: Record<string, unknown>;
}

interface JsonRpcResponse {
  jsonrpc: '2.0';
  id: string | number | null;
  result?: unknown;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
}

const SERVER_NAME = 'routeros-gateway';
const SERVER_VERSION = '1.0.0';

// Default target connection config from environment or mock
const routerConnector = new RouterOSConnector({
  host: process.env.ROUTEROS_HOST || '192.168.10.1',
  port: parseInt(process.env.ROUTEROS_API_PORT || '8728', 10),
  username: process.env.ROUTEROS_USER || 'admin',
  password: process.env.ROUTEROS_PASSWORD || '',
  useSsl: process.env.ROUTEROS_USE_SSL === 'true',
  isMock: process.env.NODE_ENV !== 'production' || !process.env.ROUTEROS_HOST,
});

const MCP_TOOLS = [
  {
    name: 'routeros_get_resource',
    description: 'Fetch real-time CPU, RAM, disk, board architecture, uptime, and RouterOS version.',
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target router UUID or hostname' },
      },
    },
  },
  {
    name: 'routeros_get_interfaces',
    description: 'List all network interfaces with link status, MTU, MAC, and RX/TX counters.',
    inputSchema: {
      type: 'object',
      properties: {
        filter: { type: 'string', description: 'Optional interface type filter (ether, sfp, vlan, bridge)' },
      },
    },
  },
  {
    name: 'routeros_get_routes',
    description: 'Fetch IPv4 and IPv6 routing table entries, active gateways, and metric distance.',
    inputSchema: {
      type: 'object',
      properties: {
        destination: { type: 'string', description: 'Optional destination prefix filter (e.g. 0.0.0.0/0)' },
      },
    },
  },
  {
    name: 'routeros_get_firewall',
    description: 'Inspect firewall filter rules, NAT entries, and address lists.',
    inputSchema: {
      type: 'object',
      properties: {
        chain: { type: 'string', enum: ['input', 'forward', 'output', 'srcnat', 'dstnat'], description: 'Firewall chain' },
      },
    },
  },
  {
    name: 'routeros_ping',
    description: 'Execute ICMP ping test from the router to an IP address or hostname.',
    inputSchema: {
      type: 'object',
      properties: {
        target: { type: 'string', description: 'Destination IP or hostname' },
        count: { type: 'number', description: 'Number of probe packets (default: 4)' },
      },
      required: ['target'],
    },
  },
  {
    name: 'routeros_export_backup',
    description: 'Generate an RSC configuration export or pre-flight backup snapshot before making changes.',
    inputSchema: {
      type: 'object',
      properties: {
        backupType: { type: 'string', enum: ['RSC_EXPORT', 'BINARY_BACKUP'], description: 'Backup format' },
      },
    },
  },
  {
    name: 'routeros_validate_syntax',
    description: 'Validate RouterOS CLI command syntax and evaluate execution risk level (LOW/MED/HIGH/CRITICAL).',
    inputSchema: {
      type: 'object',
      properties: {
        command: { type: 'string', description: 'Proposed RouterOS CLI command' },
      },
      required: ['command'],
    },
  },
];

async function handleToolCall(name: string, args: Record<string, unknown>): Promise<{ content: Array<{ type: string; text: string }>; isError: boolean }> {
  try {
    switch (name) {
      case 'routeros_get_resource': {
        const sys = await routerConnector.getSystemInfo();
        return {
          content: [{ type: 'text', text: JSON.stringify(sys, null, 2) }],
          isError: false,
        };
      }
      case 'routeros_get_interfaces': {
        const ifaces = await routerConnector.getInterfaces();
        const filter = args.filter as string | undefined;
        const filtered = filter ? ifaces.filter((i) => i.type.toLowerCase().includes(filter.toLowerCase())) : ifaces;
        return {
          content: [{ type: 'text', text: JSON.stringify(filtered, null, 2) }],
          isError: false,
        };
      }
      case 'routeros_get_routes': {
        const routes = await routerConnector.getRoutes();
        return {
          content: [{ type: 'text', text: JSON.stringify(routes, null, 2) }],
          isError: false,
        };
      }
      case 'routeros_get_firewall': {
        const cmdRes = await routerConnector.execute('/ip/firewall/filter print detail');
        return {
          content: [{ type: 'text', text: cmdRes.output || 'No firewall rules configured.' }],
          isError: !cmdRes.success,
        };
      }
      case 'routeros_ping': {
        const target = (args.target as string) || '8.8.8.8';
        const count = typeof args.count === 'number' ? args.count : 4;
        const pingRes = await routerConnector.execute(`/ping count=${count} address=${target}`);
        return {
          content: [{ type: 'text', text: pingRes.output }],
          isError: !pingRes.success,
        };
      }
      case 'routeros_export_backup': {
        const res = await routerConnector.backup();
        return {
          content: [{ type: 'text', text: JSON.stringify(res, null, 2) }],
          isError: !res.success,
        };
      }
      case 'routeros_validate_syntax': {
        const command = (args.command as string) || '';
        const validation = validateCommandSafety(command);
        return {
          content: [{ type: 'text', text: JSON.stringify(validation, null, 2) }],
          isError: !validation.isValid,
        };
      }
      default:
        return {
          content: [{ type: 'text', text: `Unknown tool: ${name}` }],
          isError: true,
        };
    }
  } catch (error) {
    return {
      content: [{ type: 'text', text: `Error executing ${name}: ${(error as Error).message}` }],
      isError: true,
    };
  }
}

export function startRouterOSMcpServer(): void {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  const sendResponse = (response: JsonRpcResponse): void => {
    process.stdout.write(JSON.stringify(response) + '\n');
  };

  rl.on('line', async (line: string) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    let req: JsonRpcRequest;
    try {
      req = JSON.parse(trimmed) as JsonRpcRequest;
    } catch {
      sendResponse({
        jsonrpc: '2.0',
        id: null,
        error: { code: -32700, message: 'Parse error' },
      });
      return;
    }

    const { id = null, method, params = {} } = req;

    switch (method) {
      case 'initialize': {
        sendResponse({
          jsonrpc: '2.0',
          id,
          result: {
            protocolVersion: '2024-11-05',
            capabilities: {
              tools: { listChanged: false },
            },
            serverInfo: {
              name: SERVER_NAME,
              version: SERVER_VERSION,
            },
          },
        });
        break;
      }
      case 'notifications/initialized': {
        break;
      }
      case 'ping': {
        sendResponse({
          jsonrpc: '2.0',
          id,
          result: {},
        });
        break;
      }
      case 'tools/list': {
        sendResponse({
          jsonrpc: '2.0',
          id,
          result: {
            tools: MCP_TOOLS,
          },
        });
        break;
      }
      case 'tools/call': {
        const toolName = (params.name as string) || '';
        const toolArgs = (params.arguments as Record<string, unknown>) || {};
        const callResult = await handleToolCall(toolName, toolArgs);
        sendResponse({
          jsonrpc: '2.0',
          id,
          result: callResult,
        });
        break;
      }
      default: {
        sendResponse({
          jsonrpc: '2.0',
          id,
          error: {
            code: -32601,
            message: `Method not found: ${method}`,
          },
        });
        break;
      }
    }
  });

  process.stderr.write(`[routeros-gateway] MCP Server initialized and listening on stdio.\n`);
}

// Auto-start if invoked directly from CLI
if (typeof require !== 'undefined' && require.main === module) {
  startRouterOSMcpServer();
}
