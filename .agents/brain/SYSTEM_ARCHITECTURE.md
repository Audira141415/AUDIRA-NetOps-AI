# SYSTEM ARCHITECTURE — AUDIRA NetOps AI
> Arsitektur Monorepo, Pola Komunikasi Layanan, dan Komposisi Infrastruktur.

---

## 1. Monorepo Topology (Turborepo)

Monorepo diatur menggunakan **pnpm workspaces** yang dikoordinasikan oleh **Turborepo** (`turbo.json`):

```
audira-netops-ai/
├── apps/
│   ├── web/          # React 18 + Vite NOC Studio Interface (Port 5180)
│   ├── desktop/      # Tauri 2 Desktop Shell Native (Rust/Cargo Wrapper)
│   ├── api/          # Express/NestJS REST & WebSocket Gateway (Port 3000)
│   └── worker/       # Daemon polling background & telemetry discovery
├── packages/
│   ├── types/        # Global TypeScript interfaces, DTOs, dan Enums
│   ├── security/     # AES-256-GCM, Secret Redaction, Risk Engine, Four-Eyes, Bot Approval
│   ├── routeros/     # MikroTik RouterOS API-SSL / REST connector & Mock Driver
│   ├── ssh/          # Generic SSH Client & Driver (Cisco, Huawei, Juniper, Linux)
│   ├── terminal/     # PuTTY Protocol Parser, ANSI Stream Multiplexer, Hardware Detector
│   ├── ai-agent/     # Multi-Provider AI Gateway, 26 Network Tools, 9-Step Pipeline
│   ├── monitoring/   # Telemetry Simulator, Alert Correlation Engine (RCA), MRTG, TWAMP
│   ├── logger/       # Structured JSON Logger dengan proteksi masking otomatis
│   ├── config/       # Skema konfigurasi environment (Zod) & Policy Constants
│   └── ui/           # Token desain Studio / Dark Minimalist UI & komponen atomik
├── database/
│   ├── schema/       # PostgreSQL DDL (init.sql - 23 tabel berelasi)
│   └── seeds/        # Inisialisasi peran RBAC, izin, dan mock topologi jaringan
└── docker/           # Nginx Reverse Proxy, PostgreSQL, Redis, dan Ollama
```

---

## 2. Rincian Aplikasi (`apps/`)

### 1. `apps/web` (NOC Operations Web Client)
- **Teknologi**: React 18, Vite 5, Tailwind CSS, Zustand, Monaco Editor, Lucide Icons, Recharts, React Flow.
- **Tampilan**: *Dark Precision / Studio UI* (Apple Developer & Vercel style) dengan kontras tinggi, aksen 1px hairline border, dan rendering tajam.
- **Fitur Utama**:
  - Live Dashboard Telemetry & Health KPI.
  - PuTTY-style Multi-Tab Clustered Terminal dengan ANSI stream.
  - WinBox Device Manager (Interfaces, IP Routes, Firewall, System Resources).
  - Multi-Vendor Configuration Manager & Diff Editor dengan Monaco.
  - Visual IPAM Subnet Tree Planner.
  - Visual Drag-and-Drop Workflow Automation Builder.
  - Real-time Packet Sniffer & Torch Threat Analyzer.
  - AI Copilot Drawer dengan streaming token dan 9-Step Verification gate.

### 2. `apps/desktop` (Tauri 2 Native App)
- **Framework**: Tauri 2 (`@tauri-apps/cli`), Rust runtime.
- **Konfigurasi**: `frontendDist: "../../web/dist"`, `devUrl: "http://localhost:5180"`.
- **Keunggulan**: Akses port serial langsung, konsumsi memori rendah (<60MB RAM), dan integrasi notifikasi sistem operasi native.

### 3. `apps/api` (Central Network Gateway & WebSocket Hub)
- **Server**: Express / NestJS framework pada Port 3000.
- **Protokol**:
  - REST API untuk manajemen perangkat, konfigurasi, backup, dan otentikasi.
  - WebSocket (`ws`) untuk:
    - `/terminal` (Streaming PTY interaktif secara bidirectional).
    - `/telemetry` (Streaming metrik CPU, memory, interface RX/TX secara real-time).
    - `/sniffer` (Streaming paket live Torch dan Sniffer).
    - `/ai-stream` (Streaming token AI reasoning dan visual diff progress).

### 4. `apps/worker` (Autonomous Polling & Scheduling Daemon)
- **Fungsi**:
  - Polling terjadwal (interval 15-60 detik) untuk memeriksa status kesehatan perangkat.
  - Eksekusi automated config backup (harian/mingguan).
  - Synthetic TWAMP / SLA probing dan evaluasi deviasi ambang batas (threshold alert).
  - Deteksi Golden Config Drift secara periodik melalui polling GitOps.

---

## 3. Komponen Paket Inti (`packages/`)

1. **`@audira/types`**:
   Mendefinisikan entitas utama: `Device`, `NetworkInterface`, `Route`, `FirewallRule`, `Alert`, `SavedConfiguration`, `DialectConversion`, `RiskAnalysis`, `IpamSubnet`, dan `SlaProbeResult`.

2. **`@audira/security`**:
   - `AES-256-GCM`: Enkripsi credential perangkat saat disimpan di database.
   - `SecretMasker`: Regex otomatis untuk menyamarkan kata sandi, token, dan private key menjadi `********`.
   - `RiskEngine`: Klasifikasi risiko otomatis (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`) dari setiap command/API call.
   - `FourEyesService`: Mekanisme persetujuan dua operator dengan tanda tangan HMAC.
   - `BotApprovalService`: Gateway persetujuan interaktif melalui Telegram Bot dan Discord Webhook.

3. **`@audira/ssh` & `@audira/routeros`**:
   - Abstraksi driver multi-vendor:
     - `RosApiConnector` (MikroTik RouterOS REST & SSL API).
     - `CiscoIOSConnector` (Cisco IOS & IOS-XE CLI).
     - `HuaweiVRPConnector` (Huawei VRP CloudEngine & S-Series switch).
     - `JuniperJunosConnector` (Juniper Junos candidate-commit driver).
     - `LinuxServerConnector` & `GenericSSHConnector`.

4. **`@audira/ai-agent`**:
   - Gateway multi-model AI (Ollama `qwen2.5:7b`, OpenAI GPT-4o, Claude 3.5 Sonnet, Gemini 1.5/2.0, Grok, dan 9Router `audira-combo`).
   - 26 Specialized Network Tools (CLI validator, routing analyzer, BGP flap inspector, DNS/ping resolver, CVE scanner).
   - 9-Step AI Execution Safety Pipeline.

5. **`@audira/monitoring`**:
   - Telemetry simulator & ingestion stream.
   - `CorrelationEngine`: AIOps deduplikasi badai alarm (*Alert Storm*) dan pelacakan Root Cause Analysis (RCA).
   - `SyntheticSlaService`: Pelacakan Jitter, Latency, Packet Loss, dan perhitungan VoIP Mean Opinion Score (MOS).
   - `MrtgService`: Agregasi traffic bandwidth (Max, In, Out, Average 5-min).

---

## 4. Alur Komunikasi & Topologi Data

```mermaid
graph TD
    User([NOC Operator / Engineer]) -->|HTTP / WS| Web[apps/web (Port 5180)]
    User -->|Native Desktop| Desktop[apps/desktop (Tauri 2)]
    Desktop --> Web
    Web -->|REST & WebSockets| API[apps/api Gateway (Port 3000)]
    Worker[apps/worker Daemon] -->|Cron Polling| API
    
    API -->|SQL Queries| DB[(PostgreSQL 16 - 23 Tables)]
    API -->|Pub/Sub & Cache| Redis[(Redis 7)]
    
    API -->|SSH2 / PTY Stream| SSHPkg[@audira/ssh Driver]
    API -->|RouterOS API-SSL| RosPkg[@audira/routeros Driver]
    API -->|9-Step Pipeline| AIAgent[@audira/ai-agent]
    
    SSHPkg -->|CLI / Port 22| CiscoRouter[Cisco IOS-XE / Huawei / Juniper]
    RosPkg -->|API / Port 8728/443| MikroTik[MikroTik RouterOS v7]
    AIAgent -->|LLM Inference| AIProvider[Ollama / 9Router / OpenAI / Claude]
    
    AIAgent -->|Approval Webhook| Telegram[Telegram Bot / Discord Gate]
```
