# FEATURE CATALOG — AUDIRA NetOps AI
> Katalog Lengkap 24+ Fitur Enterprise NOC, Lokasi Kode Sumber, State Store, dan Cara Kerja.

---

## 1. Modul Inti NOC & Observabilitas

### 1.1 NOC Live Health Dashboard
- **File**: [`NocDashboard.tsx`](file:///f:/AUDIRA-NetOps-AI/apps/web/src/components/dashboard/NocDashboard.tsx)
- **Fungsi**: Panel utama pemantauan metrik jaringan real-time.
- **Kemampuan**:
  - 4 Dynamic KPI Cards: Total Devices, Online Nodes, Warning Devices, dan Active Alerts.
  - Filter rentang waktu: `Live`, `1H`, `6H`, `24H`, `7D`, `30D`.
  - Health Ring Gauges untuk agregasi kesehatan perangkat dan latensi rata-rata.
  - Quick action registrasi perangkat baru melalui modal interaktif.

### 1.2 WinBox Web Management Interface
- **File**: [`WinboxDetail.tsx`](file:///f:/AUDIRA-NetOps-AI/apps/web/src/components/devices/WinboxDetail.tsx)
- **Fungsi**: Replika antarmuka grafis MikroTik WinBox di web browser.
- **Sub-Tab**:
  - `Interfaces`: Status port (Ethernet, SFP, Bridge, VLAN, WireGuard), negosiasi speed/duplex, byte counter live.
  - `IP Addresses`: Konfigurasi CIDR, interface binding, status dynamic/static.
  - `Routes`: Tabel routing IPv4/IPv6, active gateway, metric distance, routing table lookup.
  - `Firewall`: Aturan filter (`input`, `forward`, `output`), NAT masquerade/dstnat, mangle rules, hit counters.
  - `System Resources`: Uptime, arsitektur CPU, RAM bebas, disk usage, firmware version.

### 1.3 PuTTY-Style Clustered Terminal
- **File**: [`PuTTYTerminal.tsx`](file:///f:/AUDIRA-NetOps-AI/apps/web/src/components/terminal/PuTTYTerminal.tsx), [`XtermView.tsx`](file:///f:/AUDIRA-NetOps-AI/apps/web/src/components/terminal/XtermView.tsx), [`real-ssh.session.ts`](file:///f:/AUDIRA-NetOps-AI/apps/api/src/modules/terminal/real-ssh.session.ts)
- **Fungsi**: Terminal SSH multi-tab dengan performa tinggi dan rendering PuTTY klasik.
- **Kemampuan**:
  - Multi-tab clustering (buka banyak router sekaligus dalam 1 window).
  - Skema warna otentik: *PuTTY Classic Dark*, *Solarized Dark*, *Cyberpunk*, dan *Monochrome Matrix*.
  - Dukungan shortcut keyboard, copy-on-select, right-click paste.
  - Pengecekan hardware serial via [`ConsoleHardwareDetector.tsx`](file:///f:/AUDIRA-NetOps-AI/apps/web/src/components/terminal/ConsoleHardwareDetector.tsx) untuk kabel konsol USB-to-Serial (CH340, FTDI, CP2102).

---

## 2. Manajemen Konfigurasi & GitOps

### 2.1 Multi-Vendor Configuration Manager & Transpiler
- **File**: [`ConfigManager.tsx`](file:///f:/AUDIRA-NetOps-AI/apps/web/src/components/config/ConfigManager.tsx)
- **Fungsi**: Engine konfigurasi multi-vendor (1.516 baris) dengan Monaco Diff Editor.
- **Kemampuan**:
  - Dialek vendor yang didukung: MikroTik (`.rsc`), Cisco IOS (`.cfg`), Huawei VRP (`.cfg`), Juniper Junos (`.conf`).
  - Cross-Vendor Dialect Transpiler: Menerjemahkan konfigurasi Cisco ke MikroTik atau sebaliknya secara otomatis.
  - Monaco Side-by-Side Diff Editor dengan penyorotan baris penambahan (hijau), penghapusan (merah), dan modifikasi (kuning).
  - Push Configuration Modal dengan autentikasi terenkripsi langsung ke router target.

### 2.2 Golden Configuration Drift & GitOps Reconciliation
- **File**: [`ConfigDriftView.tsx`](file:///f:/AUDIRA-NetOps-AI/apps/web/src/components/config/ConfigDriftView.tsx), [`config-drift.ts`](file:///f:/AUDIRA-NetOps-AI/packages/security/src/config-drift.ts)
- **Fungsi**: Membandingkan running configuration aktif di router dengan *Golden Template* deklaratif di Git repository.
- **Kemampuan**:
  - Deteksi perubahan liar (*Shadow Changes*) tanpa otorisasi tiket.
  - Klasifikasi drift (Security Critical, Performance Degrade, Minor Formatting).
  - 1-Click GitOps Rollback & Reconciliation untuk mengembalikan konfigurasi ke status standar.

---

## 3. Analisis Telemetri Lanjutan & AIOps

### 3.1 Visual IPAM & Subnet Tree Planner
- **File**: [`IpamView.tsx`](file:///f:/AUDIRA-NetOps-AI/apps/web/src/components/ipam/IpamView.tsx)
- **Fungsi**: Perencanaan dan visualisasi hierarki alamat IP VLSM enterprise.
- **Kemampuan**:
  - Tree visualizer untuk subnetting `/8` hingga `/32` (dan IPv6 `/48` ke `/64`).
  - Deteksi instan tumpang tindih alamat (*CIDR Overlap Detection*).
  - Peringatan dini habisnya kapasitas lease pool DHCP (*DHCP Exhaustion Early Warning*).

### 3.2 AIOps Alert Storm Correlation & Root Cause Analysis (RCA)
- **File**: [`AlertsView.tsx`](file:///f:/AUDIRA-NetOps-AI/apps/web/src/components/alerts/AlertsView.tsx), [`correlation-engine.ts`](file:///f:/AUDIRA-NetOps-AI/packages/monitoring/src/correlation-engine.ts)
- **Fungsi**: Mereduksi kepanikan NOC dengan mengelompokkan ribuan alert sekunder menjadi satu Root Cause.
- **Kemampuan**:
  - Topology-aware grouping: Jika interface core down, ratusan alert downstream BGP/OSPF/Ping secara otomatis ditekan (*suppressed*).
  - Rekomendasi RCA berbasis graf topologi dan log historis insiden.

### 3.3 Optical Transceiver DDM/DOM Inspector
- **File**: [`optical-transceiver-dom-inspector`](file:///f:/AUDIRA-NetOps-AI/.agents/skills/optical-transceiver-dom-inspector/SKILL.md)
- **Fungsi**: Pemantauan kesehatan modul fiber optik SFP/SFP+/QSFP.
- **Kemampuan**:
  - Telemetri daya RX/TX (dBm), tegangan laser, temperatur modul, dan bias current.
  - Deteksi degradasi kabel fiber optik sebelum terjadi *link flap* atau putus total.

### 3.4 Bandwidth & QoS Queue Tuner
- **File**: [`bandwidth-qos-queue-tuner`](file:///f:/AUDIRA-NetOps-AI/.agents/skills/bandwidth-qos-queue-tuner/SKILL.md)
- **Fungsi**: Optimasi antrean bandwidth ISP dan mitigasi Bufferbloat.
- **Kemampuan**:
  - Analisis antrean MikroTik Simple Queue, PCQ (Per Connection Queue), dan Queue Tree.
  - Implementasi algoritma modern Active Queue Management: FQ-CoDel dan CAKE.

### 3.5 Synthetic SLA & TWAMP Prober
- **File**: [`SlaSyntheticView.tsx`](file:///f:/AUDIRA-NetOps-AI/apps/web/src/components/monitoring/SlaSyntheticView.tsx), [`synthetic-sla.ts`](file:///f:/AUDIRA-NetOps-AI/packages/monitoring/src/synthetic-sla.ts)
- **Fungsi**: Probing berkala dua arah menggunakan protokol Two-Way Active Measurement Protocol (TWAMP).
- **Kemampuan**:
  - Pelacakan Round-Trip Time (RTT), Jitter dua arah (TX/RX), dan packet loss.
  - Perhitungan otomatis Mean Opinion Score (MOS) 1.0–5.0 untuk kualitas VoIP dan video conferencing.

### 3.6 Live Packet Sniffer & Torch Threat Analyzer
- **File**: [`PacketSnifferView.tsx`](file:///f:/AUDIRA-NetOps-AI/apps/web/src/components/packet-sniffer/PacketSnifferView.tsx)
- **Fungsi**: Streaming packet sniffer interaktif langsung dari interface router.
- **Kemampuan**:
  - Analisis protokol L3/L4 (TCP, UDP, ICMP, GRE) secara real-time.
  - Deteksi serangan volumetrik (SYN Flood, UDP Amplification, Port Scanning).
  - Tombol aksi 1-klik untuk memasang rule *Firewall Drop Blacklist* instan.

### 3.7 Vulnerability & Compliance Security Scanner
- **File**: [`ComplianceView.tsx`](file:///f:/AUDIRA-NetOps-AI/apps/web/src/components/compliance/ComplianceView.tsx)
- **Fungsi**: Audit keamanan router sesuai benchmark CIS Network Devices.
- **Kemampuan**:
  - Pengecekan layanan tidak aman (Telnet aktif, HTTP plain text, default admin/password, DNS open resolver).
  - Evaluasi migrasi SNMPv1/v2c ke SNMPv3 USM terenkripsi.
  - Tombol 1-klik untuk *Automated Hardening Remediation*.

---

## 4. Otomasi & AI Copilot

### 4.1 Visual Drag-and-Drop Automation Workflow Builder
- **File**: [`AutomationView.tsx`](file:///f:/AUDIRA-NetOps-AI/apps/web/src/components/automation/AutomationView.tsx)
- **Fungsi**: Canvas grafis (React Flow) untuk merancang alur otomatisasi berbasis Trigger-Condition-Action.
- **Kemampuan**:
  - Node Trigger (Webhook, Link Down, High CPU, Schedule Cron).
  - Node Condition (If BGP Peer Down, If Time in Freeze Window).
  - Node Action (Execute CLI, Send Telegram Alert, Isolate Port, Trigger Backup).
  - Fitur simulasi alur kerja sebelum diterapkan secara live.

### 4.2 Autonomous AI Copilot Drawer, Dispatcher & Pipeline
- **File**: [`AICopilotDrawer.tsx`](file:///f:/AUDIRA-NetOps-AI/apps/web/src/components/ai/AICopilotDrawer.tsx), [`pipeline.ts`](file:///f:/AUDIRA-NetOps-AI/packages/ai-agent/src/pipeline.ts), [`tools.ts`](file:///f:/AUDIRA-NetOps-AI/packages/ai-agent/src/tools.ts), [`dispatcher.ts`](file:///f:/AUDIRA-NetOps-AI/packages/ai-agent/src/dispatcher.ts), [`ai.controller.ts`](file:///f:/AUDIRA-NetOps-AI/apps/api/src/modules/ai/ai.controller.ts)
- **Fungsi**: Asisten AI teknis jaringan dengan akses ke 51 Registered Network Tools dan live execution dispatcher.
- **Kemampuan**:
  - Eksekusi aman melalui **9-Step Safety Execution Pipeline**.
  - `AIToolDispatcher`: Eksekusi tool langsung ke driver multi-vendor (MikroTik, Cisco, Huawei, Juniper) dan telemetri SLA/BGP/QoS/DOM.
  - Markdown renderer kaya untuk tabel, blok kode sintaks router, dan diff.
  - Integrasi multi-tier: Lokal Ollama, OpenAI, Anthropic, Gemini, Grok, dan 9Router `audira-combo`.

### 4.3 Telegram & Discord Human-in-the-Loop Gate
- **File**: [`bot-approval.ts`](file:///f:/AUDIRA-NetOps-AI/packages/security/src/bot-approval.ts)
- **Fungsi**: Mengirimkan kartu persetujuan interaktif ke channel NOC di Telegram atau Discord saat ada tindakan berisiko tinggi.
- **Kemampuan**:
  - Tombol inline keyboard `[ Approve (Otorisasi) ]` dan `[ Reject (Tolak) ]`.
  - Tanda tangan kriptografis HMAC untuk memverifikasi identitas approver.

### 4.4 Change Freeze Window & Emergency Break-Glass
- **File**: [`Topbar.tsx`](file:///f:/AUDIRA-NetOps-AI/apps/web/src/components/layout/Topbar.tsx), [`change-freeze-window-policy.md`](file:///f:/AUDIRA-NetOps-AI/.agents/rules/change-freeze-window-policy.md)
- **Fungsi**: Kebijakan otomatis mengunci perubahan konfigurasi selama jam kerja sibuk (08:00–22:00 WIB).
- **Kemampuan**:
  - Visual status badge di topbar (FREEZE ACTIVE vs WINDOW OPEN).
  - Otorisasi Emergency Break-Glass dengan input Incident Ticket ID, alasan darurat, dan quorum dua operator.

### 4.5 Model Context Protocol (MCP) & AI Agent Hub Interface
- **File**: [`McpAgentHubView.tsx`](file:///f:/AUDIRA-NetOps-AI/apps/web/src/components/mcp/McpAgentHubView.tsx), [`.agents/mcp_config.json`](file:///f:/AUDIRA-NetOps-AI/.agents/mcp_config.json), [`mcp-server.ts`](file:///f:/AUDIRA-NetOps-AI/packages/routeros/src/mcp-server.ts), [`mcp-diag.ts`](file:///f:/AUDIRA-NetOps-AI/packages/ssh/src/mcp-diag.ts)
- **Fungsi**: Antarmuka kontrol terpadu untuk monitoring MCP Servers, pengujian 51 tools real-time via `AIToolDispatcher`, eksekusi skrip SOP CLI, dan penelusuran `MEMORY.md`.
- **Kemampuan**:
  - `routeros-gateway`: Inspeksi system resources, interfaces, routing table, firewall, ping, dan RSC pre-flight backup.
  - `network-diagnostics`: ICMP low-latency ping, traceroute hop-by-hop, DNS multi-record lookup, TCP port probe, dan TWAMP synthetic SLA probe.
  - Interactive Live Tool Runner dengan filter kategori dan rendering JSON respons real-time.
  - Interactive SOP CLI Runner untuk `bgp-triage.ts`, `cis-audit.ts`, dan `twamp-sla-probe.ts`.
  - Portal visual `MEMORY.md` dan checklist kepatuhan Brain-Sync 100%.

---

## 5. Enterprise Multi-Theme Switcher & Design System

### 5.1 Dynamic Theme Switcher Hub
- **File**: [`Topbar.tsx`](file:///f:/AUDIRA-NetOps-AI/apps/web/src/components/layout/Topbar.tsx), [`SettingsView.tsx`](file:///f:/AUDIRA-NetOps-AI/apps/web/src/components/settings/SettingsView.tsx), [`useNetOpsStore.ts`](file:///f:/AUDIRA-NetOps-AI/apps/web/src/store/useNetOpsStore.ts), [`index.css`](file:///f:/AUDIRA-NetOps-AI/apps/web/src/index.css), [`noc-theme-design-system`](file:///f:/AUDIRA-NetOps-AI/.agents/skills/noc-theme-design-system/SKILL.md)
- **Fungsi**: Penggantian tema real-time di seluruh antarmuka NOC dengan persistensi ke `localStorage`.
- **4 Preset Tema Resmi**:
  1. **Studio Dark Precision** (`theme-studio-dark` — Default): Minimalis, presisi tinggi Vercel & Apple Developer dengan border hairline halus `#27272a`.
  2. **Holographic Cyber NOC** (`theme-cyber-hologram`): Futuristik, neon cyan aurora `#2dd4bf` & fuchsia `#ec4899`, glassmorphism komando sci-fi.
  3. **Obsidian Blue NOC** (`theme-obsidian-blue`): Kontras tinggi video-wall ala Datadog & Bloomberg Terminal (`#070c18` midnight navy & electric cyan).
  4. **Matrix Phosphor Green** (`theme-matrix-green`): Retro-hacker VT100 / PuTTY green terminal (`#050d08` & `#22c55e`).

