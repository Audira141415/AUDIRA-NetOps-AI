# ARCHITECTURE — AUDIRA NetOps AI

> **System:** AUDIRA NetOps AI (Enterprise NOC Platform)  
> **Tagline:** "Network Management. Terminal. Automation. AI."  
> **Version:** v1.0.0  
> **Status:** Production-Ready Modular Monorepo  

---

## 1. System Overview & Convergence Flow

AUDIRA NetOps AI dirancang dengan arsitektur monorepo modular yang memisahkan presentation layer, API & WebSocket streaming gateway, background worker daemon, dan paket domain independen.

Prinsip utama: **AI Agent, Terminal Engine, dan Device Manager TIDAK PERNAH memiliki akses langsung ke router fisik.** Seluruh subsistem wajib melalui **Security Layer (Policy & Risk Engine)** sebelum diteruskan ke **Connector Layer**.

```
                      AUDIRA NETOPS AI
                              │
                        React / Tauri
                              │
                         API Gateway
                              │
                 ┌────────────┼────────────┐
                 │            │            │
              Device       Terminal       AI
              Manager        Engine       Agent
                 │            │            │
                 └────────────┼────────────┘
                              │
                       Security Layer
                              │
                     Policy + Risk Engine
                              │
                        Connector Layer
                              │
           ┌──────────────────┼───────────────────┐
           │                  │                   │
       RouterOS API         REST                SSH
           │                  │                   │
           └──────────────────┼───────────────────┘
                              │
                           NETWORK
```

---

## 2. Architecture Layers

### A. Presentation Layer (`apps/web` & `apps/desktop`)
- **React 18 + Vite + Tailwind CSS**: Dark-mode first, enterprise NOC cyber aesthetic.
- **Xterm.js**: PuTTY-like live terminal clustering dengan multi-tab (`[CORE-01] [CORE-02] [SW-01] [+]`).
- **React Flow**: Topologi graf interaktif dengan visualisasi throughput link dan packet loss.
- **Recharts**: Grafik telemetri real-time untuk RX/TX throughput, CPU load, dan distribusi node.
- **Zustand**: State management global untuk tab aktif, status terminal, modal approval, dan alert.
- **Tauri 2**: Shell desktop native dengan integrasi credential locker OS.

### B. Application & Streaming Layer (`apps/api` & `apps/worker`)
- **Express / NestJS Gateway**: REST API terstruktur di `/api/v1` dan WebSocket di `/ws`.
- **JWT Auth & RBAC Middleware**: Autentikasi access token (1 jam) + refresh token (7 hari) dengan 7 level role dan 12 izin granular.
- **WebSocket Streaming Gateway**: Streaming I/O bidirectional untuk PuTTY terminal, realtime metrics, dan AI stream.
- **Background Worker Daemon**: Polling telemetri interval periodik (15 detik), automated backup job, dan scanner discovery jaringan.

### C. Domain Packages (`packages/*`)
- `@audira/types`: Kontrak data global, DTO, Enums, dan abstraksi `DeviceConnector`.
- `@audira/security`: Kriptografi AES-256-GCM, masking rahasia otomatis, policy engine, dan RBAC guards.
- `@audira/routeros`: MikroTik RouterOS API-SSL, REST over HTTPS, dan Mock fallback connector.
- `@audira/ssh`: Generic SSH Client dan terminal session streamer.
- `@audira/terminal`: Protokol PuTTY, parser escape code ANSI, multiplexer session.
- `@audira/ai-agent`: Multi-Provider AI Gateway (Ollama, OpenAI, Anthropic, Gemini) + 26 Network Tools.
- `@audira/monitoring`: Telemetry simulator (7 Mock Nodes demo network) dan threshold evaluator.
- `@audira/logger`: Structured JSON logger dengan auto-sanitization token/password.
- `@audira/config`: Konstanta global, port default, dan ambang batas peringatan/kritis.
- `@audira/ui`: Design tokens tema cyber dark NOC dan status badge styles.

---

## 3. Directory Structure

```text
f:/AUDIRA-NetOps-AI/
├── apps/
│   ├── web/          # React + Vite NOC frontend interface
│   ├── desktop/      # Tauri 2 native desktop wrapper
│   ├── api/          # Express REST & WebSocket live gateway
│   └── worker/       # Background polling and job scheduler
├── packages/
│   ├── types/        # Global TypeScript interfaces & DeviceConnector
│   ├── security/     # AES-256-GCM, Secret Masking, Risk Engine, RBAC
│   ├── routeros/     # MikroTik RouterOS API / REST / Mock Connector
│   ├── ssh/          # Generic SSH Client & Streamer
│   ├── terminal/     # PuTTY Protocol & Session Multiplexing
│   ├── ai-agent/     # AI Gateway, 26 Network Tools, Safety Pipeline
│   ├── monitoring/   # Telemetry Simulator & Metrics Engine
│   ├── logger/       # Structured JSON Logger with Auto-Masking
│   ├── config/       # Global Constants & Thresholds
│   └── ui/           # Cyber NOC Design Tokens & Styles
├── database/
│   ├── schema/       # PostgreSQL DDL (23 tables, UUIDs, Indexes)
│   └── seeds/        # RBAC Roles, Permissions, & Demo Network
├── docker/           # Nginx, PostgreSQL, Redis, and Ollama definitions
└── docs/             # Technical architecture, API, and security runbooks
```

---

## 4. 9-Step AI Execution Safety Pipeline

AI tidak pernah diizinkan mengeksekusi konfigurasi secara langsung:
```
AI Proposal ──► Tool Call ──► Syntax Check ──► Risk Engine ──► Snapshot Backup ──► Visual Diff ──► Operator Gate ──► Apply ──► Verify & Audit
```

1. **AI Proposal**: AI Copilot menghasilkan intent terstruktur (bukan plaintext yang tidak terkendali).
2. **Tool Invocation**: Pemanggilan dieksekusi melalui registry 26 tools resmi.
3. **Syntax Check**: Validasi sintaksis perintah konsol RouterOS.
4. **Risk Analysis**: Pengujian tingkat bahaya (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).
5. **Snapshot Backup**: Pembuatan snapshot konfigurasi (RSC export) otomatis sebelum penulisan.
6. **Visual Diff**: Sintesis visual diff (Hijau = Tambah, Merah = Hapus, Kuning = Modifikasi).
7. **Operator Gate**: Perintah `HIGH` dan `CRITICAL` mewajibkan persetujuan eksplisit operator.
8. **Execution**: Eksekusi melalui `RouterOSConnector` terautentikasi.
9. **Verification & Audit**: Pengecekan status telemetri baru dan pencatatan riwayat di `audit_logs`.

---

## 5. Database Schema (23 Tables)
1. `roles` & `permissions` & `role_permissions`
2. `users` & `user_roles`
3. `device_groups` & `device_group_members`
4. `devices` & `device_credentials` (AES-256-GCM encrypted)
5. `interfaces` & `routes`
6. `metrics` (telemetry time-series)
7. `alerts` (INFO, WARNING, CRITICAL)
8. `configs`, `backups`, & `config_diffs`
9. `terminal_sessions` & `terminal_commands`
10. `ai_conversations`, `ai_messages`, & `ai_tool_calls`
11. `automation_jobs` & `automation_executions`
12. `audit_logs` (immutable event trail)
