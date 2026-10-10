<div align="center">

# 🌐 AUDIRA NetOps AI v1.0
### *"Network Management. Terminal. Automation. AI."*

**Platform Operasi Jaringan Modern dengan Live Terminal PuTTY-Style, Manajemen Node WinBox-Style, Observabilitas Telemetri Real-Time, dan AI Network Copilot dengan Guardrail Keamanan.**

[![License: Proprietary Commercial](https://img.shields.io/badge/License-Proprietary%20Commercial%20(Berbayar)-blue.svg?style=for-the-badge&logo=shield)](LICENSE)
[![Author: AUDIRA](https://img.shields.io/badge/Creator-AUDIRA%20(Agus%20Dwi%20R)-06B6D4.svg?style=for-the-badge&logo=github)](https://github.com/Audira141415)
[![Architecture: Monorepo Turborepo](https://img.shields.io/badge/Architecture-Turborepo%20Monorepo-purple.svg?style=for-the-badge&logo=turborepo)](https://turbo.build)
[![Frontend: React + Vite + Tailwind](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite%20%7C%20Tailwind-38BDF8.svg?style=for-the-badge&logo=react)](https://vitejs.dev)
[![Backend: TypeScript + WebSocket](https://img.shields.io/badge/Backend-Express%20%7C%20WebSocket%20%7C%20REST-34D399.svg?style=for-the-badge&logo=nodedotjs)](https://nodejs.org)
[![AI Engine: Ollama + Gemini](https://img.shields.io/badge/AI%20Engine-Ollama%20%7C%20Gemini%20%7C%20OpenAI-F59E0B.svg?style=for-the-badge&logo=openai)](https://ollama.com)

---

</div>

## 📌 Hak Cipta & Ketentuan Lisensi

> **HAK CIPTA (c) 2025-2026 AUDIRA (AGUS DWI R). SELURUH HAK CIPTA DILINDUNGI UNDANG-UNDANG.**
>
> Perangkat lunak ini dirilis di bawah **Lisensi Komersial / Proprietary (Berbayar)**.
> Dilarang keras menyalin, mendistribusikan ulang, menyewakan, mendekompilasi, merekayasa balik (*reverse engineer*), atau memanfaatkan kode sumber ini untuk keperluan komersial publik tanpa perjanjian lisensi resmi tertulis dari **AUDIRA (Agus Dwi R)**.
>
> 📄 Rincian ketentuan hukum tercantum lengkap pada file [LICENSE](LICENSE).  
> ✉️ Untuk pembelian lisensi, deployment on-premise, atau kemitraan komersial, silakan hubungi [Profil GitHub Audira141415](https://github.com/Audira141415).

---

## 📖 Ringkasan Platform (Platform Overview)

**AUDIRA NetOps AI** adalah platform operasi jaringan terpadu yang memadukan keandalan tool klasik teknisi jaringan dengan asistensi AI berpagar pengaman (*safety-guarded*):
* **PuTTY-Style Live Terminal**: Terminal SSH multi-sesi dengan streaming WebSocket real-time, pewarnaan ANSI native, clustering multi-tab, dan deteksi port konsol serial hardware.
* **WinBox-Style Node Management**: Inspeksi komprehensif perangkat MikroTik RouterOS v7 dan perangkat multi-vendor (Interface, IP, Route, Firewall, NAT, DHCP, DNS, VLAN, Bridge, VPN, Queues, System Resources).
* **NOC Observability & Theming**: Tata letak multi-kolom interaktif dengan visualisasi metrik live, grafik throughput Mbps ganda, ring status perangkat, dan dukungan 4 tema visual resmi (*Studio Dark, Holographic Cyber NOC, Obsidian Blue, Matrix Green*).
* **Interactive Network Topology**: Pemetaan hierarkis visual (ISP ➔ Core ➔ Distribution ➔ Access Devices) dengan deteksi link error otomatis (*pulsing red line*).
* **AI Network Copilot with Safety Pipeline**: Asisten AI teknisi jaringan bertenaga model lokal **Ollama (`qwen2.5:7b`)** atau model cloud (Gemini / OpenAI / Anthropic) yang terhubung ke 51 Registered Tools dan Model Context Protocol (MCP).
* **9-Step AI Safety Execution Pipeline**: Protokol keamanan bertingkat di mana AI tidak dapat mengeksekusi perubahan sembarangan; perintah berisiko tinggi (*reboot*, *system reset*, *mass delete*) wajib melalui persetujuan operator (*Human-in-the-Loop Gate* & Four-Eyes Quorum).
* **Disaster Recovery & Config Rollback**: Pembuatan snapshot backup otomatis sebelum perubahan diterapkan, perbandingan visual diff warna (Monaco Diff Editor), dan rekonsiliasi drift GitOps.

---

## 🛠️ Teknologi yang Digunakan (Full Technology Stack)

Aplikasi ini dibangun dari fondasi *production-ready* menggunakan standar industri monorepo modern:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           AUDIRA NETOPS AI                              │
├────────────────────┬────────────────────┬───────────────────────────────┤
│ FRONTEND LAYER     │ BACKEND & API      │ AI & AUTOMATION ENGINE        │
│ • React 18         │ • Express / Node   │ • Ollama (Local qwen2.5:7b)   │
│ • TypeScript 5.6   │ • WebSockets (ws)  │ • Google Gemini & OpenAI SDK  │
│ • Vite 5.4         │ • REST API V1      │ • 26 Registered Network Tools │
│ • Tailwind CSS 3.4 │ • JWT & RBAC       │ • 9-Step Safety Risk Pipeline │
│ • Recharts 2.12    │ • SSE Telemetry    │ • Automated Visual Diff Engine│
│ • Lucide Icons     │ • PostgreSQL 16    │ • RouterOS REST & SSL Client  │
│ • Zustand State    │ • Redis 7 Cache    │ • Generic SSH Client (ssh2)   │
│ • Xterm.js 5.5     │ • AES-256-GCM Enc  │ • Tauri 2 Ready Desktop Shell │
└────────────────────┴────────────────────┴───────────────────────────────┘
```

### 1. Frontend Web & Antarmuka NOC
* **React 18 & TypeScript (Strict Mode)**: Arsitektur komponen modular dengan type-checking ketat tanpa kompromi `any`.
* **Vite 5**: Bundler super cepat dengan Hot Module Replacement (HMR).
* **Tailwind CSS 3.4 (Custom Cyber Hologram Theme)**: Desain eksklusif NOC Obsidian Navy (`#070c18`, `#0f172a`) dengan aksen Electric Blue (`#3B82F6`), Neon Cyan (`#06B6D4`), Emerald Green (`#10B981`), dan efek glassmorphism hologram.
* **Xterm.js**: Mesin emulator terminal di browser yang terhubung ke router via WebSocket.
* **Recharts & SVG Donut**: Grafik live traffic throughput ganda (Download/Upload) dan ring breakdown status perangkat.
* **Lucide Icons**: Koleksi ikon enterprise bersih dan konsisten.
* **Zustand**: Manajemen state global reaktif untuk sinkronisasi perangkat, tab terminal, alert, dan panel AI.

### 2. Desktop Shell
* **Tauri 2 (Rust)**: Shell aplikasi desktop native berukuran sangat ringan, aman, dan hemat memori untuk Windows, macOS, dan Linux.

### 3. Backend Gateway & API Server
* **Node.js 20+ & Express / NestJS**: REST API Gateway berperforma tinggi pada port `3000`.
* **WebSocket Gateway (`/ws`)**: Protokol duplex streaming untuk sesi SSH live interaktif dan telemetri perangkat real-time.
* **Kriptografi Keamanan**: Enkripsi kredensial perangkat menggunakan algoritma **AES-256-GCM** dengan salt unik per perangkat.
* **Secret Auto-Masking**: Sistem logger JSON terstruktur yang secara otomatis menyensor password, token, dan private key menjadi `********`.

### 4. Database & Cache
* **PostgreSQL 16**: Penyimpanan relasional persisten dengan **23 tabel terindeks**, menggunakan UUID v4 primary keys dan foreign key cascade rules.
* **Redis 7**: Cache in-memory berkecepatan tinggi untuk antrean polling telemetri dan broadcast status live.

### 5. AI Intelligence & Safety Engine
* **Local LLM Engine**: Mendukung inferensi lokal 100% on-premise melalui **Ollama** dengan model default `qwen2.5:7b`.
* **Cloud AI Engine**: Kompatibel penuh dengan **Google Gemini** (`gemini-2.5-flash`), OpenAI GPT-4o, dan Anthropic Claude.
* **Multi-Provider Factory**: Kemampuan beralih provider AI secara instan hanya melalui konfigurasi file `.env`.

---

## ⚡ Fitur-Fitur Utama (Key Features Breakdown)

### 1. Holographic Cyber NOC Cockpit (3-Column Layout)
* **Kolom Kiri**: Navigasi 12 menu operasional (`Dashboard`, `Devices`, `Topology`, `Terminal`, `Monitoring`, `Alerts`, `Config`, `Backups`, `AI Copilot`, `Automation`, `Audit`, `Settings`) plus widget **System Status Daemon** permanen (AI Service, DB, RouterOS, Uptime).
* **Kolom Tengah**: Header observabilitas dengan tombol rentang waktu live (`Live`, `1H`, `6H`, `24H`, `7D`, `30D`), 4 Kartu KPI Utama (*Total Devices*, *Online*, *Warning*, *Offline*), kanvas topologi dinamis, serta 3 widget analitik berdampingan (*Recent Alerts*, *Device Status Donut*, *Network Traffic Graph*).
* **Kolom Kanan**: Workspace **AI Copilot** terintegrasi, bar progres horizontal **System Resources** (CPU, RAM, Disk), dan 6 tombol **Quick Actions** instan.

### 2. PuTTY-like Live Clustered Terminal
* Buka beberapa sesi terminal SSH secara bersamaan dalam tab terpisah.
* Streaming dua arah via WebSocket dengan dukungan penuh hotkeys terminal (`Ctrl+C`, `Ctrl+Z`, `Tab` auto-completion, panah riwayat perintah).
* Mode *Split Console* untuk memantau dua sesi switch/router secara berdampingan.
* Indikator latensi ping real-time di setiap tab sesi.

### 3. WinBox-like Management (17 Sub-Tab Spesialis)
Mengakomodasi seluruh workflow teknisi jaringan MikroTik tanpa perlu membuka aplikasi WinBox eksternal:
1. **Overview & System Resource**: CPU load, free RAM, uptime, temperature, board model, architecture.
2. **Interfaces**: Ethernet, SFP+, bridge, VLAN dengan counter byte RX/TX dan deteksi link drop.
3. **IP Addresses & Subnets**: Alokasi IP address, netmask, dan assignment interface.
4. **IP Routes**: Tabel routing statis, default gateway `0.0.0.0/0`, OSPF, dan status peering BGP.
5. **Firewall Filter**: Chain `input`, `forward`, `output` dengan drag-and-drop rule ordering.
6. **NAT Rules**: Konfigurasi `srcnat` (Masquerade) dan `dstnat` (Port Forwarding).
7. **DHCP Server & Leases**: Pool IP, lease table aktif, hostname binding, dan MAC reservations.
8. **DNS Cache & Static**: Pengaturan DNS resolver dan static record mapping.
9. **VLAN Table**: VLAN Filtering, PVID, tagged and untagged bridge port matrix.
10. **Bridge & Spanning Tree**: RSTP bridge status, bridge ports, dan loop protection.
11. **VPN & Tunnels**: WireGuard, L2TP/IPsec, SSTP, PPTP, dan OpenVPN status.
12. **Queues & QoS**: Simple queues, queue trees, token bucket limit, dan target interface bandwidth.
13. **Logs & Events**: Stream log sistem MikroTik dengan filter topik (`system`, `warning`, `error`, `firewall`).
14. **Integrated Terminal**: Konsol SSH khusus untuk node terpilih.
15. **Configuration Script**: Editor teks Monaco untuk melihat konfigurasi aktif.
16. **Backup Manager**: Snapshot `.backup` biner dan export script `.rsc`.
17. **AI Node Copilot**: Diagnosa khusus untuk node yang sedang diinspeksi.

### 4. Interactive Network Topology
* Pemetaan relasi node jaringan bertingkat secara otomatis (*ISP Cloud ➔ Core Routers ➔ Distribution Switches ➔ Access Points & Workstations*).
* **Link Degradation Visualizer**: Garis koneksi otomatis berubah menjadi merah berkedip (*pulsing dashed line*) jika terdeteksi packet loss, drop counter, atau timeout.
* Klik pada setiap node langsung membuka modal detail atau memicu investigasi AI Copilot.

### 5. 9-Step AI Safety Execution Pipeline
AI pada AUDIRA tidak memiliki akses langsung tanpa batas ke router Anda. Setiap tindakan AI wajib melewati 9 tahapan ketat:

```
[1. AI Proposal] ➔ [2. Tool Registry Check] ➔ [3. Syntax Validation] ➔ [4. Risk Analysis]
       ➔ [5. Pre-flight Backup] ➔ [6. Visual Diff] ➔ [7. Operator Approval Gate]
                               ➔ [8. Execution] ➔ [9. Verification & Audit]
```

* **CRITICAL BLOCKED**: Perintah destruktif seperti `/system reset`, `/system reboot`, dan penghapusan massal firewall otomatis diblokir oleh Risk Engine dan memerlukan konfirmasi ganda operator.
* **No Hallucinations**: AI diwajibkan menyertakan output tool valid dalam setiap pernyataannya.

---

## 🗂️ Struktur Monorepo Lengkap (Project Structure)

```
audira-netops-ai/
├── apps/
│   ├── web/                    # React 18 + Vite Frontend NOC Console
│   │   ├── src/
│   │   │   ├── components/     # UI Components (Dashboard, Terminal, Winbox, Topology, dll)
│   │   │   │   ├── ai/         # AI Copilot Workspace & Drawer
│   │   │   │   ├── alerts/     # Alerts & Incident Manager
│   │   │   │   ├── audit/      # Immutable Audit Log Viewer
│   │   │   │   ├── automation/ # Scheduled Network Scripts Runner
│   │   │   │   ├── backups/    # Disaster Recovery & .rsc Backup Manager
│   │   │   │   ├── config/     # Visual Diff & Config Manager
│   │   │   │   ├── dashboard/  # 3-Column Holographic NOC Dashboard
│   │   │   │   ├── devices/    # Device Inventory & WinBox 17-Tab Inspector
│   │   │   │   ├── layout/     # Topbar & Sidebar Navigation Components
│   │   │   │   ├── terminal/   # PuTTY-like WebSocket Clustered Terminal
│   │   │   │   └── topology/   # Interactive React Flow Topology Canvas
│   │   │   ├── store/          # Zustand Global State (Devices, Alerts, Terminal)
│   │   │   ├── App.tsx         # Main Layout Orchestrator
│   │   │   └── index.css       # Hologram Cyber NOC Design Tokens
│   │   └── package.json
│   ├── desktop/                # Tauri 2 Desktop Native Wrapper
│   │   ├── src-tauri/          # Rust Backend & Cargo Configuration
│   │   └── package.json
│   ├── api/                    # Express REST API & WebSocket Terminal Gateway
│   │   ├── src/
│   │   │   ├── modules/        # Backend Modules (Devices, Terminal, AI, Auth, dll)
│   │   │   └── index.ts        # API & WebSocket Entrypoint
│   │   └── package.json
│   └── worker/                 # Daemon Latar Belakang (Polling Telemetri & Scheduled Jobs)
│
├── packages/
│   ├── types/                  # TypeScript Types, DTOs, Enums, DeviceConnector Interface
│   ├── security/               # AES-256-GCM, Secret Masking, Policy & Risk Engine
│   ├── routeros/               # MikroTik RouterOS REST API, SSL API, dan Connector
│   ├── ssh/                    # Generic SSH Client & Terminal Session Streamer
│   ├── terminal/               # PuTTY ANSI Terminal Protocol & Parser Engine
│   ├── ai-agent/               # AI Gateway, 26 Network Tools, 9-Step Safety Pipeline
│   ├── monitoring/             # Engine Pengukur Telemetri & Evaluasi Threshold
│   ├── logger/                 # Structured JSON Logger dengan Sensor Masking Otomatis
│   ├── config/                 # Konfigurasi Global & Validasi Environment
│   └── ui/                     # Shared UI Tokens & Primitif Komponen
│
├── database/
│   ├── schema/                 # DDL PostgreSQL (23 Tabel berelasi lengkap)
│   └── seeds/                  # Seed User Role, Hak Akses, dan Data Default
│
├── docker/                     # Dockerfile untuk Nginx, Postgres, Redis, dan Ollama
├── docs/                       # Dokumentasi Teknis (Arsitektur, API, Keamanan, Runbooks)
├── .env.example                # Template Variabel Lingkungan
├── docker-compose.yml          # Konfigurasi Multi-Container Docker
├── package.json                # Root Monorepo Configuration
├── pnpm-workspace.yaml         # Turborepo Workspace Definition
├── turbo.json                  # Pipeline Eksekusi Turborepo
├── save.bat                    # Script 1-Klik Otomatis Git Save & Push ke GitHub
├── start.bat                   # Script 1-Klik Menjalankan Seluruh Aplikasi
└── LICENSE                     # Lisensi Komersial / Proprietary (Berbayar)
```

---

## 🧰 Daftar 26 AI Network Tools (Tool Registry)

AI Network Copilot di AUDIRA dilengkapi 26 tool terdaftar yang beroperasi di bawah prinsip *Least Privilege*:

| Kategori | Nama Tool | Deskripsi Fungsional |
| :--- | :--- | :--- |
| **Device & Meta** | `get_device` | Mengambil metadata perangkat, IP, vendor, dan firmware. |
| | `get_system_resource` | Memeriksa penggunaan CPU, RAM, disk, suhu, dan uptime. |
| **Interface** | `get_interfaces` | Menampilkan seluruh interface, MAC address, dan status link. |
| | `get_interface_status` | Memeriksa detail drop packet, error rate, dan kecepatan port. |
| | `set_interface` | Mengaktifkan/menonaktifkan interface (Risk: MEDIUM). |
| **Routing** | `get_routes` | Memeriksa tabel routing, gateway, dan metric. |
| | `add_route` | Menambahkan rute statis baru (Risk: HIGH). |
| | `get_bgp_peers` | Memeriksa sesi peering BGP dan status pertukaran prefix. |
| **Diagnostik** | `ping` | Menjalankan ICMP ping dari router ke target IP. |
| | `traceroute` | Melacak hop jaringan dan latency dari router. |
| | `dns_lookup` | Menguji resolusi domain dari router. |
| **Firewall & NAT** | `get_firewall_rules` | Memeriksa daftar filter rules, chain, dan action. |
| | `add_firewall_rule` | Menambahkan rule proteksi firewall baru (Risk: HIGH). |
| | `get_nat_rules` | Memeriksa aturan NAT masquerade dan port forwarding. |
| | `add_nat_rule` | Menambahkan port forwarding baru (Risk: HIGH). |
| **Alamat IP & Pool**| `get_ip_addresses` | Memeriksa daftar IP address yang terpasang di interface. |
| | `add_ip_address` | Menetapkan IP baru ke interface (Risk: MEDIUM). |
| | `get_ip_pools` | Memeriksa range alokasi IP pool. |
| **DHCP Server** | `get_dhcp_leases` | Menampilkan perangkat klien yang menerima IP dari DHCP. |
| | `make_dhcp_lease_static` | Mengubah lease dinamis menjadi reservasi IP statis. |
| **VLAN & Bridge** | `get_vlans` | Memeriksa konfigurasi VLAN ID dan interface binding. |
| | `add_vlan` | Menambahkan interface VLAN baru (Risk: HIGH). |
| | `get_bridge_ports` | Memeriksa keanggotaan port dalam bridge network. |
| **Bandwidth & QoS**| `get_queues` | Memeriksa alokasi bandwidth dan saturasi simple queue. |
| | `set_queue_limit` | Mengatur batas download/upload rate (Risk: MEDIUM). |
| **Disaster Recovery**| `create_backup` | Membuat snapshot backup `.rsc` otomatis sebelum eksekusi. |

---

## 🚀 Panduan Memulai Cepat (Quick Start Guide)

### 1. Prasyarat Sistem
* **Node.js**: Versi `>= 20.0.0`
* **pnpm**: Versi `>= 9.0.0`
* **Git for Windows**
* **Docker & Docker Compose** (Opsional untuk container database)

### 2. Instalasi Dependensi Monorepo
Clone repositori dan install seluruh dependensi paket:
```bash
git clone https://github.com/Audira141415/AUDIRA-NetOps-AI.git
cd AUDIRA-NetOps-AI
pnpm install
```

### 3. Konfigurasi Variabel Lingkungan
Salin file template `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```

Sesuaikan konfigurasi kunci:
```env
# Port Layanan
API_PORT=3000
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_WS_URL=ws://localhost:3000/ws

# AI Engine (Pilih Ollama Lokal atau Gemini)
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:7b
# GEMINI_API_KEY=AIzaSy...

# Mode Hardware (false = Menggunakan Hardware Asli)
USE_MOCK_DEVICES=false
SIMULATE_TELEMETRY=false
```

### 4. Menjalankan Aplikasi

#### A. Web Stack (Rekomendasi Utama)
Cukup jalankan file launcher Windows:
```cmd
start.bat
```
Atau melalui terminal:
```bash
pnpm dev
```
*Skrip `start.bat` secara otomatis membersihkan port lama (5180, 3000, 3001), memvalidasi status Docker, menjalankan Web + API + Worker, dan membuka browser Anda.*

Untuk menghentikan seluruh layanan secara bersih:
```cmd
stop.bat
```

#### B. Desktop Shell (Tauri 2 - Opsional)
AUDIRA NetOps AI menyertakan shell desktop native berbasis Rust (Tauri 2) di `apps/desktop`. Untuk menjalankannya secara terpisah:
```bash
pnpm dev:desktop
```
*(Memerlukan Rust & Cargo terpasang pada sistem operasi Windows Anda).*

* **NOC Web Console**: [http://localhost:5180](http://localhost:5180)
* **REST API Gateway**: [http://localhost:3000/api/v1](http://localhost:3000/api/v1)
* **WebSocket Live Gateway**: `ws://localhost:3000/ws`
* **Worker Daemon Health**: [http://localhost:3001/health](http://localhost:3001/health)

### 5. Menjalankan Database Container (PostgreSQL & Redis)
Jika ingin mengaktifkan persistensi database PostgreSQL 23 tabel dan cache Redis:
```bash
pnpm docker:dev
```
Kemudian terapkan skema dan seed data:
```bash
pnpm db:migrate
pnpm db:seed
```

---

## 💾 Panduan 1-Klik Git Save & Push (`save.bat`)

Untuk menyimpan seluruh modifikasi kode dan mengunggahnya ke repositori GitHub resmi secara otomatis:

1. Klik ganda file **`save.bat`** di root folder.
2. Skrip akan secara otomatis:
   * Menginisialisasi git repository jika belum aktif.
   * Menyelaraskan remote origin ke: `https://github.com/Audira141415/AUDIRA-NetOps-AI.git`.
   * Memastikan branch utama adalah `main`.
   * Melakukan staging semua file yang diubah (`git add -A`).
   * Menanyakan pesan commit (atau tekan Enter untuk pesan otomatis bertanggal).
   * Melakukan push aman ke GitHub (`git push -u origin main`).

---

## 🔒 Kebijakan Keamanan & Lisensi Komersial

```
================================================================================
                    AUDIRA NETOPS AI - LISENSI KOMERSIAL
================================================================================
Platform ini dilindungi undang-undang hak cipta Republik Indonesia dan traktat
internasional. Segala bentuk pembajakan, pendistribusian tanpa lisensi resmi,
atau penghapusan atribusi kepemilikan AUDIRA (Agus Dwi R) akan ditindaklanjuti
sesuai hukum yang berlaku.

Untuk permohonan sertifikat lisensi komersial dan penawaran enterprise, hubungi:
AUDIRA (Agus Dwi R) — https://github.com/Audira141415
================================================================================
```

---

<div align="center">
  <b>AUDIRA NetOps AI v1.0 Enterprise</b> &bull; Didesain dan Dibangun dengan Dedikasi untuk Keunggulan Operasional Jaringan.<br/>
  <i>Copyright &copy; 2025-2026 AUDIRA (Agus Dwi R). All Rights Reserved.</i>
</div>
