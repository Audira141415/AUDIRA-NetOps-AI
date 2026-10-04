# PRD — AUDIRA NetOps AI

> **Product:** AUDIRA NetOps AI  
> **Tagline:** "Network Management. Terminal. Automation. AI."  
> **Version:** v1.0.0  
> **Target Audience:** NOC Engineers, Network Administrators, SecOps, Infrastructure Operators  
> **Status:** Active Production Specification  

---

## 1. Problem Statement

Operator jaringan dan NOC saat ini terfragmentasi oleh puluhan alat kerja yang terpisah:
1. **Tool Fragmentasi:** PuTTY untuk terminal konsol teks, WinBox untuk GUI MikroTik, Prometheus/Zabbix untuk monitoring, dan notepad/git untuk backup konfigurasi manual.
2. **Resiko Human Error CLI:** Salah ketik 1 subnet route atau salah urutan rule firewall di terminal dapat memutus konektivitas ratusan client dalam sekejap.
3. **Keterbatasan AI Generik:** Chatbot AI publik (seperti ChatGPT web) tidak memiliki konteks live router, tidak bisa mengambil metrik real-time, dan rentan berhalusinasi saat menghasilkan sintaks RouterOS.
4. **Ketiadaan Safety Guardrails:** Tidak ada sistem yang otomatis melakukan snapshot backup pra-eksekusi, menganalisis level resiko perintah, dan menampilkan visual diff sebelum konfigurasi diterapkan.

---

## 2. Product Vision & Value Proposition

AUDIRA NetOps AI menggabungkan kekuatan **PuTTY (Terminal Konsol Live)**, **WinBox (GUI Manajemen Device Komprehensif)**, **Observability Real-time**, dan **Autonomous AI Copilot** ke dalam satu cockpit terpadu dengan arsitektur vendor-neutral dan pipeline keamanan 9 tahap.

---

## 3. Core Feature Specifications

### A. PuTTY-like Live Terminal Clustering
- **Multi-Tab Session:** Mengelola puluhan sesi SSH aktif dalam tab responsif (`[CORE-01 4ms] [CORE-02 28ms] [SW-01 1ms] [+]`).
- **Low Latency WebSocket:** Streaming input/output karakter tanpa delay dengan dukungan escape code ANSI dan parser warna konsol penuh.
- **Split Screen:** Membuka 2 hingga 4 jendela terminal berdampingan untuk perbandingan router utama dan backup.
- **Terminal Clustering (Broadcast Mode):** Mengirimkan satu baris perintah CLI secara simultan ke seluruh node terpilih dalam satu grup.
- **Session Recording & Audit:** Seluruh perintah yang diketik dicatat ke database untuk audit kepatuhan keamanan.

### B. WinBox-Style Network Management
Menyediakan GUI berbasis tabel berdensitas tinggi untuk MikroTik RouterOS (dan extensible ke vendor lain):
1. **Interfaces:** Status link, duplex, MTU, RX/TX bytes, packet counters, toggle disable/enable.
2. **IP Addresses:** Alamat IP/CIDR, interface binding, status dynamic/static.
3. **Routes:** Tabel routing IP, default gateway, routing mark, distance, status Active/Static/Dynamic/Connect.
4. **Firewall & NAT:** Filter rules, NAT masquerade/dst-nat, address lists, counters bytes/packets.
5. **DHCP Server & Leases:** IP pools, active client leases, MAC addresses, hostname, expiry timer.
6. **DNS:** DNS servers, cache size, static DNS entries.
7. **Bridges & VLANs:** Bridge ports, VLAN filtering, PVID management.
8. **Queues:** Simple queues, target subnet, bandwidth limit (max-limit), burst thresholds.
9. **System Resources & Logs:** Uptime, CPU load, memory usage, firmware version, live router log feed.

### C. Telemetry & Observability
- **Real-time Telemetry:** Polling berkala (15 detik) untuk metrik CPU, RAM, disk, suhu hardware, tegangan, latency ping, dan throughput RX/TX.
- **Health Indicators:** Status agregat node (`ONLINE`, `WARNING`, `CRITICAL`, `OFFLINE`).
- **Intelligent Alert Engine:** Pemicu alert berbasis ambang batas (contoh: CPU > 85%, packet loss > 3%, interface flapping).

### D. Interactive Network Topology Canvas
- **React Flow Visualizer:** Representasi grafis dinamis topologi jaringan (Core, Aggregation, Distribution, Access).
- **Live Link Status:** Ketebalan dan warna link menggambarkan utilisasi bandwidth; garis putus-putus merah beranimasi jika terjadi degradasi atau packet loss.
- **Interactive Node Drawer:** Klik node untuk membuka detail WinBox mini atau meluncurkan terminal PuTTY secara instan.

### E. Configuration Lifecycle & Disaster Recovery
- **Automated Pre-Flight Snapshot:** Sebelum konfigurasi baru diterapkan oleh AI atau operator, sistem otomatis mengekspor snapshot konfigurasi (RSC export).
- **Visual Diffing Engine:** Tampilan visual perbedaan konfigurasi (Hijau = Add, Merah = Remove, Kuning = Change).
- **One-Click Instant Rollback:** Mengembalikan router ke kondisi snapshot stabil sebelumnya dalam waktu < 3 detik jika terjadi kegagalan layanan.

### F. Autonomous AI Network Copilot
- **Local LLM First:** Terhubung langsung ke instance Ollama lokal (`qwen2.5:7b`), menjamin privasi topologi jaringan tanpa kebocoran data ke cloud publik.
- **Multi-Cloud Fallback:** Mendukung OpenAI, Anthropic Claude, dan Google Gemini jika diaktifkan oleh operator.
- **26 Registered Network Tools:** AI dilengkapi tool terverifikasi untuk inspeksi interfaces, routing, ping, traceroute, firewall, DNS, dan snapshot.
- **9-Step Execution Safety Pipeline:**
  ```
  Proposal -> Tool Registry -> Syntax Validation -> Risk Analysis -> Pre-Flight Snapshot -> Visual Diff -> Operator Gate -> Execution -> Post-Verify
  ```
- **Risk Classification:**
  - `LOW` (Read-only): Auto-execution diizinkan.
  - `MEDIUM` (Non-disruptive): Diizinkan dengan audit log.
  - `HIGH` (Routing / Interfaces): Memerlukan persetujuan operator.
  - `CRITICAL` (Reboot / Reset / Mass Delete): **DILARANG OTOMATIS**, wajib 2-person approval.

### G. Zero-Hardware Demo Network (Out-of-the-Box)
Menyertakan 7 simulated router nodes berstatus realistis:
1. `ISP-GW` (MikroTik CCR2004 - 10 Gbps Gateway)
2. `CORE-01` (MikroTik CCR2216 - 100G Core Router - Normal)
3. `CORE-02` (MikroTik CCR2216 - Mengalami Packet Loss & Latency Spike untuk skenario troubleshooting AI)
4. `AGG-01` (MikroTik CRS326 - Aggregation Switch)
5. `SW-01` (MikroTik CRS328 - Distribution Switch Lantai 1)
6. `SW-02` (MikroTik CRS328 - Distribution Switch Lantai 2)
7. `SW-07` (MikroTik CRS317 - Switch Akses Server dengan High CPU Load)

---

## 4. Non-Functional Requirements

- **Performance:** WebSocket latency < 50ms untuk PuTTY keystroke streaming; dashboard loading < 1.5 detik.
- **Security:** Seluruh kredensial perangkat tersimpan dalam enkripsi AES-256-GCM; token dan kata sandi otomatis dimasking `********` di log dan antarmuka.
- **Reliability:** Daemon worker mampu memulihkan koneksi socket secara otomatis (exponential backoff).
- **Extensibility:** Interface `DeviceConnector` modular memungkinkan penambahan driver vendor lain (Cisco IOS, Huawei VRP, Juniper JunOS, VyOS) tanpa mengubah kode core UI.
