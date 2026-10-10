# AUDIRA NetOps AI — System Architecture Specification

> **Version**: 1.1.1  
> **Status**: Production Architecture  
> **Platform**: Enterprise Network Operations, Terminal Multiplexing, Multi-Vendor Automation, and AI-Assisted Telemetry.

---

## 1. High-Level Architectural Overview

AUDIRA NetOps AI operates on a modern, decoupled **Turborepo Monorepo** topology designed for high availability, zero-trust network safety, and low-latency terminal interactions.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          PRESENTATION LAYER                            │
│  ┌──────────────────────────────┐    ┌──────────────────────────────┐  │
│  │   React 18 + Vite (Web)      │    │    Tauri 2 Native Desktop    │  │
│  │   (Tailwind, Zustand, Flow)  │    │      (Lightweight Rust Shell)│  │
│  └──────────────┬───────────────┘    └──────────────┬───────────────┘  │
└─────────────────┼───────────────────────────────────┼──────────────────┘
                  │ HTTP / WebSocket                  │
┌─────────────────▼───────────────────────────────────▼──────────────────┐
│                          API GATEWAY LAYER                             │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Express REST API Gateway + WebSocket Streaming Gateway (:3000)   │  │
│  │ • JWT Authentication & RBAC Guard                                │  │
│  │ • Real-time ANSI Terminal WebSocket (/ws)                        │  │
│  │ • AI Tool Dispatcher & MCP Gateway                               │  │
│  └──────────────────┬───────────────────────────────┬───────────────┘  │
└─────────────────────┼───────────────────────────────┼──────────────────┘
                      │                               │
┌─────────────────────▼────────┐             ┌────────▼──────────────────┐
│     BACKGROUND DAEMON        │             │    STATE & CACHE LAYER    │
│  ┌────────────────────────┐  │             │  ┌─────────────────────┐  │
│  │ Worker Polling Daemon  │  │             │  │ PostgreSQL 16 (23T) │  │
│  │ • 15s Health Polling   │  │             │  │ Redis 7 Pub/Sub     │  │
│  │ • HTTP /health (:3001) │  │             │  └─────────────────────┘  │
│  └────────────────────────┘  │             └───────────────────────────┘
└──────────────────────────────┘
```

---

## 2. Monorepo Package Topology

The monorepo strictly separates business logic, hardware drivers, safety engines, and UI components into granular packages:

### Applications (`apps/`)
- **`apps/web`**: Single-Page Application (SPA) built with React 18, Vite 5, Tailwind CSS, Lucide Icons, Recharts, and React Flow. Features 24+ views including WinBox Web, PuTTY Terminal, Config Diff, and MCP Agent Hub.
- **`apps/desktop`**: Optional native cross-platform desktop shell utilizing Tauri 2 (Rust).
- **`apps/api`**: REST API Gateway and WebSocket server built with Express and TypeScript.
- **`apps/worker`**: Autonomous background polling daemon for telemetry collection, snapshot retention, and health evaluations.

### Packages (`packages/`)
- **`@audira/types`**: Source of truth for TypeScript interfaces, enums, DTOs, and connector contracts.
- **`@audira/security`**: AES-256-GCM encryption, secret masking regex engine, 4-Eyes Quorum engine, and Command Risk Engine.
- **`@audira/routeros`**: MikroTik RouterOS v7 REST API and API-SSL client connector + stdio MCP Server.
- **`@audira/ssh`**: Generic SSH Client (`ssh2`), Cisco IOS, Huawei VRP, and Juniper Junos driver connectors + Network Diagnostics MCP Server.
- **`@audira/terminal`**: ANSI parsers, terminal multiplexing, and WebSocket stream adapters.
- **`@audira/ai-agent`**: AI gateway (Ollama, Gemini, OpenAI, Claude), 51 network tools registry, execution dispatcher, and safety pipeline.
- **`@audira/monitoring`**: Real-time network telemetry simulator, threshold evaluation engine, and device health aggregator.
- **`@audira/logger`**: Structured JSON logger with automated credential redaction.
- **`@audira/config`**: Environment variable schemas and global configuration constants.
- **`@audira/ui`**: Shared UI design tokens, theme color variables, and NOC theme presets.

---

## 3. Communication Pipelines

### 3.1 Terminal Streaming Pipeline
1. Frontend initializes an `Xterm.js` instance.
2. An authenticated WebSocket handshake is made to `ws://localhost:3000/ws?token=JWT&deviceId=UUID`.
3. Gateway spawns an authenticated SSH session via `@audira/ssh` directly to the device.
4. Input keystrokes and ANSI escape outputs are bidirectionally streamed with sub-5ms local latency.

### 3.2 AI Safety Pipeline (9-Step Gate)
```
Operator Prompt 
       ▼
AI Intent & Tool Proposal 
       ▼
Capability Registry Check (51 Registered Tools)
       ▼
Syntax & Schema Validation
       ▼
Command Risk Engine (CRITICAL / HIGH / MEDIUM / LOW)
       ▼
Pre-Flight Backup (Automated RSC Snapshot)
       ▼
Visual Diff Engine (Monaco Monaco Editor Green/Red/Yellow)
       ▼
Human-in-the-Loop Operator Gate (Dual-Operator Quorum for CRITICAL)
       ▼
Authenticated Connector Execution (RouterOS / SSH / REST)
       ▼
Post-Execution Verification & Audit Log
```

---

## 4. Multi-Vendor Driver Abstraction

All network device interactions implement the unified `DeviceConnector` contract:

```typescript
export interface DeviceConnector {
  connect(credentials: DeviceCredentials): Promise<void>;
  disconnect(): Promise<void>;
  execute(command: string): Promise<CommandResult>;
  getInterfaces(): Promise<InterfaceStatus[]>;
  getRoutingTable(): Promise<RouteEntry[]>;
  getSystemResources(): Promise<SystemResourceMetrics>;
  createBackup(): Promise<BackupSnapshot>;
}
```

Vendors natively supported:
- **MikroTik RouterOS v7**: Native REST API & API-SSL binary protocol.
- **Cisco IOS / IOS-XE**: SSH CLI with candidate configuration session handling.
- **Huawei VRP**: CloudEngine & S-series switch syntax.
- **Juniper Junos OS**: Junos CLI hierarchy and commit-confirm semantics.

---

## 5. Model Context Protocol (MCP) Integration

AUDIRA NetOps AI exposes two standalone stdio MCP servers conforming to the Model Context Protocol:
1. **`routeros-gateway`** (`packages/routeros/dist/mcp-server.js`): Exposes 7 tools for direct inspection, firewall manipulation, and backup creation.
2. **`network-diagnostics`** (`packages/ssh/dist/mcp-diag.js`): Exposes 5 tools for ICMP ping, traceroute, DNS lookups, TCP port probes, and synthetic TWAMP SLA probes.
