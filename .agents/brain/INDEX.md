# BRAIN MANIFEST — AUDIRA NetOps AI
> **Central Knowledge Repository & Persistent Project Intelligence**  
> *Single Source of Truth (SSOT) for Architecture, Features, Multi-Vendor Drivers, Security Guardrails, and System Evolution.*

---

## 1. Executive Overview

**AUDIRA NetOps AI** adalah platform *Enterprise Network Operations Center (NOC)* modern generasi baru yang mengombinasikan:
- **Terminal Akses Langsung Clustered** dengan emulasi PuTTY dan WebSocket ANSI streamer.
- **WinBox-like Web Management** untuk konfigurasi cepat perangkat jaringan multi-vendor.
- **Observabilitas Real-Time** (MRTG Bandwidth, Optical DDM/DOM, TWAMP SLA, Packet Sniffer/Torch).
- **GitOps Config Diffing & Drift Detection** dengan transpiler konfigurasi lintas vendor.
- **Autonomous AI Copilot** dengan 9-Step Safety Execution Pipeline, 26 Network Tools, dan Human-in-the-Loop Gateway.

Proyek ini dibangun menggunakan arsitektur monorepo **Turborepo** dengan standar TypeScript *strict mode* (tanpa `any`), antarmuka desktop **Tauri 2**, dan backend **Express/NestJS** dengan PostgreSQL & Redis.

---

## 2. Peta Dokumen Brain (Brain Knowledge Map)

Brain ini diorganisir secara modular agar dapat dibaca, dipahami, dan diperbarui dengan cepat oleh AI Agent maupun tim teknis:

| Modul Brain | Lokasi File | Deskripsi & Fokus Konten |
| :--- | :--- | :--- |
| **01. Arsitektur Sistem** | [SYSTEM_ARCHITECTURE.md](file:///f:/AUDIRA-NetOps-AI/.agents/brain/SYSTEM_ARCHITECTURE.md) | Struktur monorepo (apps & packages), alur komunikasi REST/WebSocket, container Docker, dan layout data. |
| **02. Katalog Fitur Lengkap** | [FEATURE_CATALOG.md](file:///f:/AUDIRA-NetOps-AI/.agents/brain/FEATURE_CATALOG.md) | Rincian 24+ modul NOC (Dashboard, WinBox, Terminal, IPAM, Config Manager, AI Copilot, MRTG, TWAMP, dll). |
| **03. Keamanan & Governance** | [SECURITY_AND_GOVERNANCE.md](file:///f:/AUDIRA-NetOps-AI/.agents/brain/SECURITY_AND_GOVERNANCE.md) | 9-Step AI Safety Pipeline, Risk Classification, Four-Eyes Quorum, Break-Glass, dan Secret Redaction. |
| **04. Matriks Multi-Vendor** | [MULTI_VENDOR_MATRIX.md](file:///f:/AUDIRA-NetOps-AI/.agents/brain/MULTI_VENDOR_MATRIX.md) | Kompatibilitas MikroTik RouterOS v7, Cisco IOS-XE, Huawei VRP, Juniper Junos, driver SSH, dan transpiler dialek. |
| **05. Database & Alur Data** | [DATABASE_AND_DATA_FLOW.md](file:///f:/AUDIRA-NetOps-AI/.agents/brain/DATABASE_AND_DATA_FLOW.md) | Skema 23 tabel PostgreSQL, Redis pub/sub & cache, dan Zustand Store State Client (`useNetOpsStore`). |
| **06. Log & Roadmap** | [UPDATE_HISTORY_AND_ROADMAP.md](file:///f:/AUDIRA-NetOps-AI/.agents/brain/UPDATE_HISTORY_AND_ROADMAP.md) | Catatan histori rilis, status implementasi terkini, dan panduan sinkronisasi saat fitur baru ditambahkan. |

---

## 3. Protokol Pembaruan Brain Otomatis (Brain Synchronization Protocol)

> **MANDATORY DIRECTIVE FOR ALL AI AGENTS & DEVELOPERS:**  
> Setiap kali terjadi penambahan fitur baru, perubahan skema database, modifikasi endpoint API, atau perombakan arsitektur:
> 1. **Dilarang keras membiarkan Brain menjadi usang (stale).**
> 2. Buka dan perbarui file terkait di [`.agents/brain/`](file:///f:/AUDIRA-NetOps-AI/.agents/brain).
> 3. Catat entri perubahan pada [UPDATE_HISTORY_AND_ROADMAP.md](file:///f:/AUDIRA-NetOps-AI/.agents/brain/UPDATE_HISTORY_AND_ROADMAP.md).
> 4. Pastikan `pnpm typecheck` dan `pnpm build` tetap lulus 100%.

Protokol ini diabadikan secara formal dalam aturan agen di [`.agents/rules/brain-sync-protocol.md`](file:///f:/AUDIRA-NetOps-AI/.agents/rules/brain-sync-protocol.md).
