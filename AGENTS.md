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
pnpm dev:web          # Launch only the web frontend on port 5180
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

---

## 6. Agent Skills & Rules Ecosystem (`.agents/`)

- **Skills**:
  - `skills/routeros-v7-syntax/`: RouterOS v7 syntax validation, routing-filter rules, and REST API mapping.
  - `skills/cisco-ios-syntax/`: Cisco IOS & IOS-XE CLI structure, interface rules, and routing verification.
  - `skills/huawei-vrp-syntax/`: Huawei VRP CloudEngine & S-series switch syntax and safety directives.
  - `skills/noc-incident-triage/`: SOP for high CPU, link loss, and BGP flap root-cause analysis.
  - `skills/bgp-peering-troubleshooter/`: SOP for BGP FSM state triage, RPKI ROA validation, route leak prevention, and multi-vendor soft refresh.
  - `skills/firewall-safety-audit/`: Security compliance, open port verification, and hardening.
  - `skills/packet-threat-inspector/`: Torch / Packet Sniffer inspection, DDoS mitigation, and traffic anomaly detection.
  - `skills/optical-transceiver-dom-inspector/`: Real-time DDM/DOM optical power (RX/TX dBm), fiber attenuation, laser bias current, and SFP degradation diagnostics.
  - `skills/bandwidth-qos-queue-tuner/`: Bandwidth traffic shaping, MikroTik PCQ/Queue Tree, Bufferbloat mitigation (CAKE/FQ-CoDel), and Cisco LLQ.
  - `skills/juniper-junos-syntax/`: Standardized syntax guidelines, CLI hierarchy, candidate-commit workflow, and safety rules for Juniper Junos OS devices.
  - `skills/mpls-vpls-segment-routing-troubleshooter/`: SOP for MPLS LDP, VPLS pseudowire triage, MTU blackhole mitigation, and Segment Routing (SR-MPLS) path diagnostics.
  - `skills/ipam-subnet-capacity-optimizer/`: SOP for hierarchical VLSM subnet planning, CIDR overlap detection, DHCP exhaustion triage, and IPv6 /64 prefix allocation.
  - `skills/compliance-security-benchmark-audit/`: SOP for CIS Network Device Benchmark audit, SSH hardening, SNMPv3 USM migration, and 1-click remediation.
  - `skills/alert-storm-correlation-rca/`: SOP for AIOps alert storm deduplication, topology-aware event correlation, and root-cause analysis (RCA).
  - `skills/golden-config-drift-detector/`: SOP for Golden Template GitOps comparison, shadow change audit, and automated config reconciliation.
  - `skills/synthetic-sla-twamp-monitor/`: SOP for active synthetic telemetry, TWAMP / Cisco IP SLA probing, Jitter tracking, and VoIP MOS score evaluation.
  - `skills/noc-theme-design-system/`: Design system guidelines, color tokens, and switching specifications for 4 Enterprise NOC themes (Studio Dark, Cyber Hologram, Obsidian Blue, Matrix Green).
- **Rules**:
  - `rules/router-safety-guardrails.md`: Absolute blacklist, risk classification matrix, dual-operator approval.
  - `rules/secret-redaction-policy.md`: Zero credential leakage and regex log-masking specifications.
  - `rules/change-freeze-window-policy.md`: Peak freeze windows (08:00–22:00 WIB read-only), maintenance windows (01:00–05:00 WIB), and Emergency Break-Glass protocols.
  - `rules/dual-operator-four-eyes-rule.md`: Segregation of duties, two-person rule enforcement for CRITICAL operations, cryptographic HMAC approval.
  - `rules/brain-sync-protocol.md`: Mandatory protocol requiring all agents to keep `.agents/brain/` synchronized on every feature addition or architecture modification.
- **MCP Servers**: Configured in `.agents/mcp_config.json` for RouterOS and local diagnostics.

---

## 7. Extended NOC Feature Modules

1. **Visual Drag-and-Drop Automation Workflow Builder**: Trigger-condition-action graph canvas with live simulation.
2. **Live Packet Sniffer & Torch Analyzer**: Real-time packet telemetry with instant AI threat analysis & mitigation.
3. **Visual IPAM & Subnet Tree Planner**: Subnet tree visualization, conflict detection, and DHCP pool monitoring.
4. **Vulnerability & Compliance Security Scanner**: Automated posture audit, CVE identification, and 1-click remediation.
5. **Multi-Vendor Driver Connectors**: Native `CiscoIOSConnector`, `HuaweiVRPConnector`, and `JuniperJunosConnector` in `@audira/ssh`.
6. **Telegram & Discord Bot Human-in-the-Loop Gate**: `BotApprovalService` with interactive inline keyboard and rich embed approval sign-off.

---

## 8. Persistent Project Brain & Living System Memory (`.agents/brain/` & `MEMORY.md`)

Dokumentasi arsitektur persisten, protokol memori sistem, dan indeks pengetahuan terpusat disimpan di [`MEMORY.md`](file:///f:/AUDIRA-NetOps-AI/MEMORY.md), [`BRAIN.md`](file:///f:/AUDIRA-NetOps-AI/BRAIN.md) dan modul [`.agents/brain/`](file:///f:/AUDIRA-NetOps-AI/.agents/brain):
- `MEMORY.md`: Panduan filosofi memori, 5 fungsi utama, dan 4 aturan emas anti-amnesia.
- `SYSTEM_ARCHITECTURE.md`: Monorepo topology, apps & packages spec, and communication pipelines.
- `FEATURE_CATALOG.md`: Comprehensive breakdown of all 24+ NOC modules and component paths.
- `SECURITY_AND_GOVERNANCE.md`: 9-Step AI Execution Safety Pipeline, Risk Classification, Four-Eyes Quorum, Break-Glass, and Secret Redaction.
- `MULTI_VENDOR_MATRIX.md`: Compatibility matrix for MikroTik, Cisco, Huawei, Juniper, and cross-vendor transpiler.
- `DATABASE_AND_DATA_FLOW.md`: PostgreSQL 23 tables, Redis pub/sub, and Zustand client store.
- `UPDATE_HISTORY_AND_ROADMAP.md`: Release history and future development roadmap.

> **CRITICAL RULE**: Setiap penambahan atau pembaruan fitur **WAJIB** memperbarui dokumen terkait di `.agents/brain/` sesuai protokol [`rules/brain-sync-protocol.md`](file:///f:/AUDIRA-NetOps-AI/.agents/rules/brain-sync-protocol.md).



