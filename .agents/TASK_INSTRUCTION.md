# TASK INSTRUCTION — AUDIRA NetOps AI

> **System:** AUDIRA NetOps AI (Enterprise NOC Platform)  
> **Tagline:** "Network Management. Terminal. Automation. AI."  
> **Purpose:** Panduan implementasi bertahap untuk Developer & AI Coding Agent  
> **Version:** v1.0.0  

---

## 0. Prerequisite Reading (WAJIB BACA)

Sebelum memodifikasi atau menulis kode baru, seluruh developer dan AI agent **WAJIB** membaca dan mematuhi:
1. `AGENTS.md` — Aturan umum monorepo, stack teknologi, dan panduan keamanan.
2. `ARCHITECTURE.md` — Prinsip konvergensi Security Layer dan pembagian layer aplikasi.
3. `SECURITY.md` — Kriptografi AES-256-GCM, matriks risiko perintah, dan RBAC.
4. `PRD.md` — Spesifikasi fungsional PuTTY, WinBox, AI Copilot, dan 7 mock nodes.
5. `DESIGN.md` — Standar UI/UX Cyber NOC, visual diffing (Hijau/Merah/Kuning), dan tema gelap.

---

## 1. Golden Rules of Code Generation

1. **Strict TypeScript:** Tidak boleh menggunakan tipe `any`. Seluruh fungsi, method, dan API response wajib memiliki deklarasi tipe pengembalian eksplisit.
2. **Security Convergence Funnel:** AI Copilot, Terminal Engine, dan Device Manager TIDAK BOLEH mem-bypass Security Layer. Semua eksekusi wajib melalui Policy & Risk Engine.
3. **No Secret Leaks:** Dilarang me-return kredensial plaintext ke frontend. Seluruh token/password wajib disaring menggunakan helper `maskSecrets()`.
4. **Guardrail Perintah CRITICAL:** Perintah berisiko tinggi (`system reset`, `reboot`, mass firewall delete) DILARANG dieksekusi secara otomatis dan wajib memicu Operator Approval Gate.
5. **Atomic Git Commits:** Setiap task atau perbaikan bug harus diuji validitas tipe-nya (`pnpm typecheck`) sebelum membuat git commit bersih.

---

## 2. Phase-by-Phase Implementation Checklist

### Phase 1: Monorepo Foundation & Core Types
- [x] Task 1.1: Setup `pnpm-workspace.yaml` dan `turbo.json` dengan pipeline build/typecheck.
- [x] Task 1.2: Buat `@audira/types` yang mendefinisikan interface `Device`, `InterfaceInfo`, `RouteInfo`, `FirewallRule`, `TelemetryMetric`, `RiskLevel`, dan `DeviceConnector`.
- [x] Task 1.3: Buat `@audira/config` dengan default ports, ambang batas latency/CPU, dan environment schema.

### Phase 2: Security, Kriptografi & Risk Engine
- [x] Task 2.1: Buat modul enkripsi AES-256-GCM dengan authentication tag di `@audira/security`.
- [x] Task 2.2: Buat `maskSecrets()` utility di `@audira/logger` & `@audira/security`.
- [x] Task 2.3: Implementasikan `RiskEngine` untuk klasifikasi perintah ke dalam `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`.
- [x] Task 2.4: Buat RBAC Guard dan permission matrix untuk 7 role dan 12 permission.

### Phase 3: RouterOS & Terminal Engine
- [x] Task 3.1: Buat interface seragam `DeviceConnector` di `@audira/types`.
- [x] Task 3.2: Implementasikan `RouterOSConnector` di `@audira/routeros` (API-SSL, REST HTTPS, dan Mock fallback).
- [x] Task 3.3: Implementasikan generic SSH Client di `@audira/ssh` dengan auto-reconnect.
- [x] Task 3.4: Buat `@audira/terminal` untuk parser escape code ANSI dan PuTTY multiplexing.

### Phase 4: Autonomous AI Copilot & 26 Network Tools
- [x] Task 4.1: Buat `AIGateway` multi-provider di `@audira/ai-agent` (Ollama `qwen2.5:7b`, OpenAI, Anthropic, Gemini).
- [x] Task 4.2: Daftarkan 26 Tool Jaringan resmi (Interface inspection, Route print/add, Ping/Traceroute, Firewall filter, Snapshot backup).
- [x] Task 4.3: Implementasikan 9-Step AI Execution Safety Pipeline dengan snapshot generator dan visual diff synthesis.
- [x] Task 4.4: Sediakan pre-configured diagnostic checklist (e.g., investigasi packet loss CORE-02).

### Phase 5: Monitoring & Zero-Hardware Demo Network
- [x] Task 5.1: Buat telemetry simulator di `@audira/monitoring` yang memproduksi metrik CPU, RAM, bandwidth RX/TX, dan latency.
- [x] Task 5.2: Inisialisasi 7 Mock Nodes realistis (`ISP-GW`, `CORE-01`, `CORE-02`, `AGG-01`, `SW-01`, `SW-02`, `SW-07`).
- [x] Task 5.3: Simulasikan kondisi degradasi real-time (Packet loss pada `CORE-02` dan High CPU pada `SW-07`).

### Phase 6: REST API & WebSocket Streaming Gateway
- [x] Task 6.1: Setup Express server pada `apps/api` dengan endpoint `/api/v1/devices`, `/api/v1/terminal`, `/api/v1/ai`, `/api/v1/backups`, `/api/v1/alerts`.
- [x] Task 6.2: Implementasikan WebSocket streaming server pada path `/ws` untuk I/O terminal konsol dan live telemetry feed.
- [x] Task 6.3: Integrasikan middleware otentikasi JWT dan audit logger append-only.

### Phase 7: Web NOC Frontend (`apps/web`)
- [x] Task 7.1: Setup React 18 + Vite dengan Tailwind CSS dan tema Cyber NOC (`#080C14`).
- [x] Task 7.2: Bangun Topbar informatif (`● 42 DEVICES`, `🤖 AI (qwen2.5:7b) [ONLINE]`) dan Navigasi Sidebar responsif.
- [x] Task 7.3: Implementasikan Live Terminal PuTTY multi-tab (`[CORE-01 4ms] [CORE-02 28ms] [SW-01 1ms] [+]`).
- [x] Task 7.4: Implementasikan WinBox Device Manager dengan tab Interfaces, Routes, Firewall, NAT, DHCP, DNS, Queues, Logs.
- [x] Task 7.5: Implementasikan Topology Canvas interaktif menggunakan React Flow dengan visualisasi link traffic.
- [x] Task 7.6: Implementasikan AI Copilot Workspace Drawer dengan progress checklist 4 tahap dan Approval Modal visual diff.

### Phase 8: Verification & Quality Assurance
- [x] Task 8.1: Jalankan `pnpm typecheck` dan pastikan seluruh 23 task lulus tanpa kompromi tipe.
- [x] Task 8.2: Jalankan `pnpm --filter @audira/web run build` dan pastikan bundle SPA terkompilasi bersih.
- [x] Task 8.3: Verifikasi inisialisasi skema database PostgreSQL (`database/schema/init.sql`) dan seed data (`database/seeds/seed.sql`).
- [x] Task 8.4: Simpan seluruh progres ke Git commit dengan pesan yang jelas.
