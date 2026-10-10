# DATABASE & DATA FLOW — AUDIRA NetOps AI
> Skema Relasional PostgreSQL, Redis Realtime Caching, dan Zustand Client Store.

---

## 1. PostgreSQL Schema (23 Tabel Berelasi)

Skema database diinisialisasi melalui [`init.sql`](file:///f:/AUDIRA-NetOps-AI/database/schema/init.sql) dengan ekstensi `uuid-ossp` dan `pgcrypto`.

### 1.1 RBAC & Autentikasi
1. `roles`: Definisi peran (e.g. `Super Admin`, `NOC Lead`, `Security Auditor`, `Operator`).
2. `permissions`: Hak akses terperinci (e.g. `device.read`, `terminal.write`, `config.push`).
3. `role_permissions`: Pemetaan banyak-ke-banyak antara peran dan izin.
4. `users`: Akun operator dengan password hash argon2/bcrypt dan status aktif.
5. `user_roles`: Pemetaan peran pengguna.

### 1.2 Inventaris & Topologi Perangkat
6. `device_groups`: Pengelompokan logis (Data Center, Core, Distribution, Edge Branch).
7. `devices`: Entitas node jaringan (Hostname, IP, Vendor, Model, Versi OS, Status).
8. `device_credentials`: Penyimpanan kredensial terenkripsi AES-256-GCM.
9. `interfaces`: Port fisik/virtual, MTU, MAC, kecepatan link, dan status operasional.
10. `ip_addresses`: Alokasi IP dan netmask yang terikat pada interface.
11. `routes`: Entri tabel routing IPv4/IPv6, gateway, dan nilai distance.
12. `network_topology_nodes`: Node untuk rendering graf visual topologi jaringan.
13. `network_topology_links`: Hubungan kabel/koneksi antar node (bandwidth, latency).

### 1.3 Telemetri, Logging & Sesi
14. `device_metrics`: Time-series data utilisasi CPU, memori, disk, dan bandwidth per interface.
15. `terminal_sessions`: Metadata sesi terminal aktif (ID operator, target device, PTY ID).
16. `terminal_logs`: Catatan keystroke dan output sesi terminal untuk audit keamanan.
17. `ai_audit_logs`: Audit lengkap proposal AI, hasil validasi, skor risiko, dan penandatangan persetujuan.

### 1.4 Konfigurasi, Disaster Recovery & IPAM
18. `configuration_backups`: Snapshot running config, backup biner (`.backup`), dan teks (`.rsc`/`.cfg`).
19. `alert_rules`: Konfigurasi ambang batas alarm (CPU > 85%, Link Down, BGP Flap).
20. `alerts`: Riwayat insiden alarm, tingkat keparahan (`CRITICAL`, `WARNING`, `INFO`), dan status ACK.
21. `scheduled_tasks`: Antrean tugas otomatisasi (Polling, Probing TWAMP, Auto-backup).
22. `ipam_subnets`: Hierarki subnet IP enterprise (CIDR, VLAN ID, deskripsi, utilisasi).
23. `ipam_ip_allocations`: Detail alokasi host IP per subnet dan status lease DHCP.

---

## 2. Redis Caching & Pub/Sub Channels

Redis dimanfaatkan untuk komunikasi berkecepatan tinggi tanpa membebani database relasional:

- **Cache Keys**:
  - `cache:device:{id}:status` -> Status heartbeat terakhir (TTL: 30 detik).
  - `cache:device:{id}:metrics` -> Snapshot utilisasi CPU/Memory terkini.
  - `cache:config:drift:{id}` -> Hasil analisis drift template terakhir.
- **Pub/Sub Channels**:
  - `channel:telemetry:stream` -> Distribusi metrik dari worker ke WebSocket gateway.
  - `channel:terminal:{sessionId}` -> Pipa I/O antara SSH connector dan browser frontend.
  - `channel:alerts:broadcast` -> Siaran instan saat terjadi degradasi atau link down.
  - `channel:bot:approvals` -> Penyaluran status approval dari Telegram/Discord.

---

## 3. Zustand Client Store (`useNetOpsStore.ts`)

State frontend dikelola secara terpusat oleh [`useNetOpsStore.ts`](file:///f:/AUDIRA-NetOps-AI/apps/web/src/store/useNetOpsStore.ts):

- **Slices State**:
  - `devices`: Array perangkat aktif, fungsi `addDevice`, `updateDevice`, `deleteDevice`.
  - `selectedDevice`: Perangkat yang sedang dibuka di WinBox atau Config Manager.
  - `terminalTabs`: Tab terminal yang terbuka, active tab ID, layout splitting.
  - `alerts`: Daftar notifikasi alarm NOC live dan fungsi acknowledge/clear.
  - `savedConfigs`: Koleksi konfigurasi tersimpan, fungsi komparasi visual diff.
  - `aiMessages`: Riwayat dialog AI Copilot, status streaming, dan proposal tool.
  - `breakGlass`: State darurat (tiket incident, nama approver ke-2, timestamp aktif).
  - `toast`: Notifikasi global banner.
