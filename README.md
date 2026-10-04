# AUDIRA NetOps AI v1.0
> **"Network Management. Terminal. Automation. AI."**

AUDIRA NetOps AI is an enterprise network operations platform combining:
- **PuTTY-like Live Terminal**: Tabbed multi-session clustering, SSH streaming, session logging, and latency indicator.
- **WinBox-like Node Management**: Full MikroTik RouterOS & vendor-neutral hardware inspection (Interfaces, IP Addresses, Routes, Firewall, NAT, DHCP, DNS, VLAN, Bridge, VPN, Queues, Logs).
- **Network Observability**: Real-time CPU, RAM, disk, temperature, latency, and packet loss telemetry.
- **Interactive Topology**: Dynamic React Flow graph with live link traffic, degraded state warnings, and inspector.
- **Configuration & Rollback**: Visual diffing (Green/Red/Yellow), syntax validation, pre-flight snapshots, and instant rollback.
- **AI Network Copilot**: Integrated with local Ollama (`qwen2.5:7b`), OpenAI, Anthropic, Gemini, or custom endpoints.
- **9-Step Safety Execution Pipeline**: AI operates strictly through 26 registered tools; CRITICAL destructive commands are strictly blocked without dual signoff.
- **Zero-Hardware Demo Network**: Built-in simulator with 7 realistic nodes (CORE-JOGJA-01/02, EDGE, Switches, AP, Server) allowing immediate execution without physical routers.

---

## Architecture & Monorepo Structure

```
audira-netops-ai/
├── apps/
│   ├── web/          # React + Vite + Tailwind CSS + Lucide + Xterm.js + React Flow
│   ├── desktop/      # Tauri 2 Desktop Client Shell
│   ├── api/          # Express/NestJS REST API & WebSocket Live Terminal Gateway
│   └── worker/       # Background Telemetry & Scheduled Job Worker Daemon
├── packages/
│   ├── types/        # Shared TypeScript Interfaces, Enums, DTOs & DeviceConnector
│   ├── security/     # AES-256-GCM Crypto, Secret Masking, Risk Engine & RBAC
│   ├── routeros/     # MikroTik RouterOS API-SSL / REST / Mock Connector
│   ├── ssh/          # Generic SSH Client & Terminal Session Streamer
│   ├── terminal/     # PuTTY Protocol, ANSI Parsers & Multiplexing
│   ├── ai-agent/     # Multi-Provider AI Gateway, 26 Network Tools, Safety Pipeline
│   ├── monitoring/   # Telemetry Simulator & Threshold Evaluation
│   ├── logger/       # Structured JSON Logger with Auto-Masking
│   ├── config/       # Global Constants & Environment Schemas
│   └── ui/           # Shared NOC Cyber Design Tokens
├── database/
│   ├── schema/       # PostgreSQL DDL with 23 tables, UUIDs, and indexes
│   └── seeds/        # Initial Roles, Granular Permissions, and Demo Network
└── docker/           # Nginx, PostgreSQL, Redis, and Ollama definitions
```

---

## Quick Start (Local Development)

### 1. Prerequisites
- Node.js >= 20.0.0
- pnpm >= 9.0.0
- Docker & Docker Compose (Optional for containerized DB/Redis/Ollama)

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Configure Environment
```bash
cp .env.example .env
```

### 4. Start Development Servers
```bash
# Starts both frontend (http://localhost:5173) and backend API (http://localhost:3000)
pnpm dev
```

### 5. Access the Platform
- **NOC Web Console**: [http://localhost:5173](http://localhost:5173)
- **API Endpoint**: [http://localhost:3000/api/v1](http://localhost:3000/api/v1)
- **WebSocket Gateway**: `ws://localhost:3000/ws`

---

## Enterprise Commands

```bash
pnpm dev             # Start all services concurrently with Turborepo
pnpm dev:web         # Start only the React Vite frontend
pnpm dev:api         # Start only the backend API server
pnpm build           # Build all packages and applications for production
pnpm typecheck       # Run strict TypeScript compiler verification across all packages
pnpm lint            # Run code quality linting
pnpm docker:up       # Launch full containerized stack via Docker Compose
pnpm docker:down     # Stop containerized services
```

---

## Demo Network Credentials
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: `SUPER_ADMIN`
