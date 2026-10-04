// AI Tool Registry & Safety Definitions

import { ToolDefinition } from '@audira/types';

export const AI_TOOL_DEFINITIONS: Record<string, ToolDefinition> = {
  get_device: {
    name: 'get_device',
    description: 'Retrieve device metadata, vendor, IP, OS version, and operational status.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID or name' },
      },
      required: ['deviceId'],
    },
  },
  get_system_resource: {
    name: 'get_system_resource',
    description: 'Fetch real-time CPU, RAM, disk, board architecture, uptime, and temperature.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
      },
      required: ['deviceId'],
    },
  },
  get_interfaces: {
    name: 'get_interfaces',
    description: 'List all network interfaces with status, MTU, MAC, and byte counters.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
      },
      required: ['deviceId'],
    },
  },
  get_interface_status: {
    name: 'get_interface_status',
    description: 'Inspect specific interface metrics: link state, speed, drops, errors, RX/TX rate.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
        interfaceName: { type: 'string', description: 'Interface identifier (e.g. ether1, sfp-sfpplus1)' },
      },
      required: ['deviceId', 'interfaceName'],
    },
  },
  get_ip_addresses: {
    name: 'get_ip_addresses',
    description: 'List configured IP addresses, subnet masks, and associated interfaces.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
      },
      required: ['deviceId'],
    },
  },
  get_routes: {
    name: 'get_routes',
    description: 'Fetch routing table entries including default gateway, static, and dynamic routes.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
      },
      required: ['deviceId'],
    },
  },
  get_firewall: {
    name: 'get_firewall',
    description: 'Inspect firewall filter rules, chain (input/forward/output), and hit counters.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
      },
      required: ['deviceId'],
    },
  },
  get_nat: {
    name: 'get_nat',
    description: 'List NAT rules (srcnat/masquerade and dstnat/port-forwarding).',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
      },
      required: ['deviceId'],
    },
  },
  get_dhcp: {
    name: 'get_dhcp',
    description: 'Inspect DHCP servers, IP pools, and active client lease assignments.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
      },
      required: ['deviceId'],
    },
  },
  get_dns: {
    name: 'get_dns',
    description: 'Check DNS resolver settings, upstream DNS servers, and static DNS cache.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
      },
      required: ['deviceId'],
    },
  },
  get_vlan: {
    name: 'get_vlan',
    description: 'List configured VLAN interfaces, bridge VLAN filtering, and tagged/untagged ports.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
      },
      required: ['deviceId'],
    },
  },
  get_bridge: {
    name: 'get_bridge',
    description: 'Inspect bridge domains, member ports, STP/RSTP state, and fast-forward status.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
      },
      required: ['deviceId'],
    },
  },
  get_vpn: {
    name: 'get_vpn',
    description: 'Check active VPN tunnels: WireGuard peers, IPsec SAs, OpenVPN, SSTP, or PPTP.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
      },
      required: ['deviceId'],
    },
  },
  get_queues: {
    name: 'get_queues',
    description: 'Inspect simple queues, queue trees, bandwidth limits, and current packet rates.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
      },
      required: ['deviceId'],
    },
  },
  get_logs: {
    name: 'get_logs',
    description: 'Fetch recent system event logs, authentication attempts, and interface state changes.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
        lines: { type: 'number', description: 'Number of recent log lines to retrieve (default: 50)' },
      },
      required: ['deviceId'],
    },
  },
  get_active_connections: {
    name: 'get_active_connections',
    description: 'Examine firewall connection tracking table for high bandwidth or suspect IPs.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
      },
      required: ['deviceId'],
    },
  },
  ping: {
    name: 'ping',
    description: 'Send ICMP echo requests from the router to evaluate target latency and packet loss.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Device to run ping from' },
        targetIp: { type: 'string', description: 'Destination IP address or hostname' },
        count: { type: 'number', description: 'Number of pings (default: 5)' },
      },
      required: ['deviceId', 'targetIp'],
    },
  },
  traceroute: {
    name: 'traceroute',
    description: 'Trace hop-by-hop network path and identify upstream latency bottlenecks.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Device to run traceroute from' },
        targetIp: { type: 'string', description: 'Target destination IP' },
      },
      required: ['deviceId', 'targetIp'],
    },
  },
  interface_monitor: {
    name: 'interface_monitor',
    description: 'Monitor real-time RX/TX throughput rate and packet drop counters over an interval.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
        interfaceName: { type: 'string', description: 'Interface to monitor' },
      },
      required: ['deviceId', 'interfaceName'],
    },
  },
  backup_device: {
    name: 'backup_device',
    description: 'Create an immediate snapshot backup or RSC export before changes.',
    permission: 'config.write',
    riskLevel: 'LOW',
    readOnly: false,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
        backupType: { type: 'string', enum: ['RSC_EXPORT', 'BINARY_BACKUP'], description: 'Backup format' },
      },
      required: ['deviceId'],
    },
  },
  get_config: {
    name: 'get_config',
    description: 'Retrieve current running configuration script / export.',
    permission: 'config.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
      },
      required: ['deviceId'],
    },
  },
  compare_config: {
    name: 'compare_config',
    description: 'Compare current running config against a baseline or previous backup version.',
    permission: 'config.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
        backupId: { type: 'string', description: 'Backup ID to compare with' },
      },
      required: ['deviceId', 'backupId'],
    },
  },
  generate_config: {
    name: 'generate_config',
    description: 'Generate standardized syntax-validated configuration snippet for proposed changes.',
    permission: 'config.write',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
        intentDescription: { type: 'string', description: 'Plain English intent (e.g. Create VLAN 100 with DHCP pool)' },
      },
      required: ['deviceId', 'intentDescription'],
    },
  },
  validate_config: {
    name: 'validate_config',
    description: 'Check command syntax, detect conflicts, and determine risk level (LOW/MED/HIGH/CRITICAL).',
    permission: 'config.write',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
        configScript: { type: 'string', description: 'Configuration commands to evaluate' },
      },
      required: ['deviceId', 'configScript'],
    },
  },
  apply_config: {
    name: 'apply_config',
    description: 'Apply approved configuration commands to the live device after backup and risk check.',
    permission: 'config.execute',
    riskLevel: 'HIGH',
    readOnly: false,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
        approvalId: { type: 'string', description: 'Approved change request ticket UUID' },
        configScript: { type: 'string', description: 'Exact approved configuration commands' },
      },
      required: ['deviceId', 'approvalId', 'configScript'],
    },
  },
  rollback_config: {
    name: 'rollback_config',
    description: 'Revert device configuration to a known healthy backup state if verification fails.',
    permission: 'config.rollback',
    riskLevel: 'HIGH',
    readOnly: false,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
        backupId: { type: 'string', description: 'Target backup UUID to restore' },
      },
      required: ['deviceId', 'backupId'],
    },
  },
};
