# DESIGN — AUDIRA NetOps AI

> **System:** AUDIRA NetOps AI (Enterprise NOC Platform)  
> **Tagline:** "Network Management. Terminal. Automation. AI."  
> **Version:** v1.0.0  
> **Status:** Production-Ready UI/UX & Design System Specification  

---

## 1. Design Philosophy

AUDIRA NetOps AI dirancang untuk kebutuhan Command Center NOC (Network Operations Center) 24/7. Prinsip desain mengutamakan:
1. **High Information Density**: Menampilkan metrik kritis jaringan secara padat, jelas, dan tanpa whitespace yang mubazir.
2. **Cyber Dark First**: Palet warna gelap mendalam (`#080C14`) yang mencegah kelelahan mata operator pada sesi pemantauan panjang.
3. **Instant Situational Awareness**: Anomali (packet loss, router reboot, CPU spike) harus teridentifikasi secara visual dalam kurun < 1 detik melalui semantic color coding.
4. **Zero-Ambiguity Guardrails**: Perubahan konfigurasi dan eksekusi AI harus menyajikan visual diffing yang tegas (Hijau = Tambah, Merah = Hapus, Kuning = Modifikasi) dengan indikator tingkat risiko yang mencolok.

---

## 2. Color System & Palettes

Semua token warna didefinisikan secara modular dalam `@audira/ui` dan Tailwind CSS.

### A. Surface & Canvas Colors
| Token | Hex | Penggunaan |
|---|---|---|
| `bg-noc-canvas` | `#080C14` | Latar belakang dasar aplikasi |
| `bg-noc-surface` | `#0E1422` | Card, container panel, sidebar, dan header tab |
| `bg-noc-elevated` | `#161F33` | Modal dialog, popup menu, dropdown, drawer |
| `border-noc-subtle` | `#1A2338` | Garis pemisah panel, tabel border, divider |
| `border-noc-focus` | `#2E3D5C` | Active tab highlight, input focus ring |

### B. Brand & AI Accents
| Token | Hex | Penggunaan |
|---|---|---|
| `text-cyan-primary` | `#00F2FE` | Brand text, active navigation icons, primary buttons |
| `accent-ai-indigo` | `#6366F1` | AI Copilot badges, LLM reasoning flow, tool execution indicator |
| `accent-ai-purple` | `#8B5CF6` | AI suggestion bubbles, generative prompt inputs |

### C. Network Health Semantic Colors
| Status | Hex | Token Tailwind | Indikasi Jaringan |
|---|---|---|---|
| **ONLINE / NORMAL** | `#10B981` | `text-emerald-400 bg-emerald-950/60 border-emerald-800` | Node aktif, latency < 10ms, CPU normal |
| **WARNING / DEGRADED** | `#F59E0B` | `text-amber-400 bg-amber-950/60 border-amber-800` | Latency tinggi, packet loss 1-5%, CPU > 75% |
| **CRITICAL / OFFLINE** | `#EF4444` | `text-rose-400 bg-rose-950/60 border-rose-800` | Node unreachable, interface down, packet loss > 5% |
| **MUTED / ARCHIVED** | `#64748B` | `text-slate-400 bg-slate-900/60 border-slate-700` | Node disabled, backup snapshot arsip |

---

## 3. Visual Diffing System (Green / Red / Yellow)

Digunakan pada AI Execution Approval Gate, Riwayat Backup, dan Config Comparator:

```diff
+ /ip route add dst-address=192.168.100.0/24 gateway=10.0.0.1 distance=1 comment="AUDIRA-AI-ROUTE"
- /ip route remove [find comment="OLD-BACKUP-ROUTE"]
~ /ip firewall filter set [find comment="DROP-TELNET"] action=drop log=yes
```

- **Green Addition (`#10B981` / `bg-emerald-950/40 text-emerald-300 border-l-4 border-emerald-500`)**: Baris atau aturan baru yang akan ditambahkan.
- **Red Deletion (`#EF4444` / `bg-rose-950/40 text-rose-300 border-l-4 border-rose-500`)**: Baris konfigurasi atau rule firewall yang akan dihapus.
- **Yellow Modification (`#F59E0B` / `bg-amber-950/40 text-amber-300 border-l-4 border-amber-500`)**: Parameter yang mengalami perubahan nilai (misal: distance, timeout, action).

---

## 4. Risk Level Badges & Safety Coding

| Level | Badge Styling | Perilaku Eksekusi |
|---|---|---|
| `LOW` | `bg-cyan-950/80 text-cyan-300 border-cyan-800` | Read-only commands (print, ping, traceroute). Boleh auto-approve jika diizinkan policy. |
| `MEDIUM` | `bg-amber-950/80 text-amber-300 border-amber-800` | Penambahan konfigurasi non-destruktif (address-list add, comment update). Notifikasi ke operator. |
| `HIGH` | `bg-orange-950/80 text-orange-300 border-orange-800` | Perubahan routing BGP/OSPF, interface down/up, firewall re-ordering. **Wajib approval 1 operator.** |
| `CRITICAL` | `bg-rose-950 text-rose-300 border-rose-600 animate-pulse` | `system reset`, `reboot`, mass firewall delete. **DILARANG OTOMATIS.** Wajib konfirmasi 2 operator. |

---

## 5. Typography

- **UI & Dashboard Typography:** `Inter`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `sans-serif`.
  - Body: `text-sm (14px)` dengan leading `1.4`.
  - Headers: `text-base (16px)` untuk card titles, `text-xl (20px)` untuk main sections.
  - Badges/Tags: `text-xs (12px)` uppercase font-semibold dengan letter-spacing `0.05em`.
- **Terminal & Code Typography:** `JetBrains Mono`, `Fira Code`, `Cascadia Code`, `Consolas`, `monospace`.
  - PuTTY Console: `text-[13px]` dengan line-height `1.25`, rendering crisp font smoothing.
  - Config Diff: Monospace dengan syntax highlighting RouterOS CLI.

---

## 6. Layout Architecture & Key Components

### A. Top Navigation Bar (Height: 48px)
- **Kiri:** Logo AUDIRA NetOps AI + Status Badge Global (`● 42 DEVICES ONLINE: 39 | WARN: 2 | DOWN: 1`).
- **Tengah:** Quick Search Command Bar (`Ctrl + K`) untuk pencarian IP, nama router, MAC, atau tool AI.
- **Kanan:** AI Engine Status Indicator (`🤖 AI (qwen2.5:7b) [ONLINE]`), Sound toggle alarm, Profile avatar Operator.

### B. Navigation Sidebar (Width: 64px collapsed / 240px expanded)
Menu akses cepat:
1. `Dashboard` (Ikhtisar global & status node)
2. `Terminal` (PuTTY live cluster multi-tab)
3. `WinBox` (Manajemen tabular RouterOS)
4. `Topology` (Interactive React Flow network graph)
5. `Backups` (Config snapshots & visual diff engine)
6. `AI Copilot` (Autonomous chat & tool reasoning workspace)
7. `Audit Logs` (Immutable security audit trail)
8. `Settings` (RBAC, API keys, Model LLM configuration)

### C. PuTTY Live Terminal Tabs
Desain tab session menyerupai PuTTY & MobaXterm:
```
┌────────────────────────────────────────────────────────────────────────┐
│ [CORE-01 4ms]  [CORE-02 28ms ⚠️]  [SW-01 1ms]  [+]      [Split] [Max]  │
├────────────────────────────────────────────────────────────────────────┤
│ [admin@CORE-01] > /ip route print                                      │
│ #      DST-ADDRESS        PREF-SRC        GATEWAY            DISTANCE  │
│ 0 A S  0.0.0.0/0                          10.0.0.1           1         │
│ 1 ADC  10.0.0.0/24        10.0.0.2        ether1             0         │
└────────────────────────────────────────────────────────────────────────┘
```
- Setiap tab dilengkapi indikator RTT ping aktif (ms) dan status dot.
- Mendukung fitur *Terminal Clustering*: Kirim 1 perintah CLI secara paralel ke 10 router sekaligus.

### D. AI Copilot Workspace Drawer
- **Floating / Split Dock**: Dapat disematkan di sisi kanan layar saat operator bekerja di WinBox atau Terminal.
- **Progress Stepper**: Menampilkan status reasoning AI (e.g., `✓ Interface check`, `✓ Route check`, `✓ Ping test`, `✓ Log analysis`).
- **Approval Gate Modal**: Pop-up interaktif yang merangkum parameter eksekusi, level risiko, snapshot backup yang telah dibuat, dan preview visual diff sebelum tombol `[APPROVE & APPLY]` dapat diklik.
