# AGENTS.md — AUDIRA NetOps AI

> Network Management. Terminal. Automation. AI.
> Enterprise NOC Platform with PuTTY-like Live Terminal, WinBox Management, Telemetry Observability, and Autonomous AI Copilot.

---

## 1. Project Overview

- **Name** : AUDIRA NetOps AI
- **Description** : Enterprise network operations platform combining live clustered terminals, WinBox-like device management, real-time telemetry, visual config diffing, disaster recovery, and an autonomous AI Network Copilot.
- **Goal** : Provide vendor-neutral network automation, diagnostics, and operations with strict safety guardrails and local LLM integration.
- **Target Users**: Network Administrators, NOC Engineers, Cybersecurity Operators, DevOps Engineers.
- **Version** : v1.0.0
- **Status** : Active development (Production-Ready Architecture)

---

## 2. Tech Stack

- **Language** : TypeScript (Strict mode enabled, no `any`, explicit return types)
- **Frontend** : React 18, Vite, Tailwind CSS, Lucide Icons, Zustand, TanStack Query, React Flow, Recharts
- **Terminal** : Xterm.js with WebSocket streaming and multi-tab clustering
- **Desktop** : Tauri 2 ready
- **Backend** : NestJS / Express, TypeScript, WebSockets (`ws`), REST API
- **Database** : PostgreSQL (23 tables, UUID primary keys, encrypted secrets, indexed)
- **Cache & Realtime**: Redis
- **AI Gateway** : Ollama (`qwen2.5:7b`), OpenAI, Anthropic, Google Gemini, Custom OpenAI-compatible endpoints
- **Package Manager** : pnpm (Turborepo monorepo)
- **Infrastructure** : Docker, Docker Compose, Nginx Reverse Proxy

---

## 3. Commands

```bash
pnpm install          # Install all monorepo workspace dependencies
pnpm dev              # Launch all applications concurrently with Turbo
pnpm dev:web          # Launch only the web frontend on port 5173
pnpm dev:api          # Launch only the API and WebSocket server on port 3000
pnpm build            # Production compilation
pnpm typecheck        # Strict TypeScript typechecking across all packages
pnpm lint             # Linter verification
pnpm docker:up        # Launch full containerized stack via Docker Compose
pnpm docker:down      # Tear down containers
```

---

## 4. Monorepo Project Structure

```
audira-netops-ai/
├── apps/
│   ├── web/          # React + Vite frontend NOC interface
│   ├── desktop/      # Tauri 2 native desktop wrapper
│   ├── api/          # Express/NestJS REST & WebSocket gateway
│   └── worker/       # Background polling and scheduled job daemon
├── packages/
│   ├── types/        # Global TypeScript interfaces, DTOs, DeviceConnector
│   ├── security/     # AES-256-GCM, Secret Masking, Risk Engine, RBAC
│   ├── routeros/     # MikroTik RouterOS API-SSL / REST / Mock Connector
│   ├── ssh/          # Generic SSH Client & Terminal Session Streamer
│   ├── terminal/     # PuTTY Protocol, ANSI Parsers & Multiplexing
│   ├── ai-agent/     # Multi-Provider AI Gateway, 26 Network Tools, Safety Pipeline
│   ├── monitoring/   # Telemetry Simulator & Threshold Evaluation
│   ├── logger/       # Structured JSON Logger with Auto-Masking
│   ├── config/       # Global Constants & Environment Schemas
│   └── ui/           # Shared NOC Cyber Design Tokens
├── database/
│   ├── schema/       # PostgreSQL DDL with 23 tables
│   └── seeds/        # Initial Roles, Permissions, and Demo Network Seed
└── docker/           # Nginx, PostgreSQL, Redis, and Ollama definitions
```

---

## 5. Security & Risk Engine Rules

1. **NEVER expose device credentials** to frontend JavaScript or client state.
2. **NEVER log secrets**: Passwords, private keys, API keys, and tokens MUST be masked as `********`.
3. **9-Step AI Execution Pipeline**:
   - AI Proposal -> Tool Registry -> Validation -> Risk Analysis -> Pre-flight Backup -> Visual Diff (Green/Red/Yellow) -> Operator Approval Gate -> Execution -> Verification & Audit.
4. **CRITICAL operations** (`system reset`, `reboot`, mass firewall deletion) MUST NEVER execute automatically and require explicit confirmation.
5. **No Hallucinations**: Every factual assertion about router state must originate from a tool result.
