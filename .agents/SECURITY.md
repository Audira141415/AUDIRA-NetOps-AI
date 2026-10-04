# SECURITY — AUDIRA NetOps AI

> **System:** AUDIRA NetOps AI (Enterprise NOC Platform)  
> **Tagline:** "Network Management. Terminal. Automation. AI."  
> **Version:** v1.0.0  
> **Status:** Production-Ready Security Policy & Risk Architecture  

---

## 1. Security Architecture & Convergence Principle

Prinsip keamanan terpenting dalam AUDIRA NetOps AI:  
**Device Manager, Terminal Engine, dan AI Agent TIDAK PERNAH memiliki akses langsung ke router atau socket jaringan.**

Seluruh operasi wajib melalui **Security Layer (Policy & Risk Engine)** sebelum mencapai **Connector Layer**:

```
                  ┌────────────┬────────────┐
                  │   Device   │  Terminal  │  AI Agent  │
                  │  Manager   │   Engine   │ (Copilot)  │
                  └────────────┴────────────┘
                               │
                        [ SECURITY LAYER ]
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
      [ RBAC & Policy ]                   [ Risk Engine ]
      • Role validation                   • Syntax analysis
      • Granular permissions              • LOW / MED / HIGH / CRIT
      • IP whitelisting                   • Automated snapshot
                                          • Visual diff generation
                                          • Approval Gate blocker
                               │
                               ▼
                      [ CONNECTOR LAYER ]
                 (RouterOS API / REST / SSH)
                               │
                               ▼
                     [ PHYSICAL NETWORK ]
```

---

## 2. Kredensial & Kriptografi (AES-256-GCM)

1. **Enkripsi Kredensial di Rest:**
   - Semua password router, private key SSH, dan API token di database disimpan dalam format terenkripsi menggunakan algoritma terotentikasi **AES-256-GCM** via `@audira/security`.
   - Format penyimpanan: `iv:authTag:encryptedData` (hex-encoded).
   - Kunci enkripsi master diambil dari environment variable `ENCRYPTION_KEY` (32 bytes / 64 hex characters) dan tidak pernah di-commit ke Git.
2. **Kerahasiaan di Tingkat Memori:**
   - Kredensial plaintext hanya didekripsi sesaat saat connector melakukan handshake otentikasi ke router dan segera dibersihkan dari memori setelah koneksi terbentuk.
   - Frontend tidak pernah menerima password atau private key dalam respons JSON API (`device_credentials` tidak pernah dikembalikan ke client).

---

## 3. Masking Rahasia Otomatis (`maskSecrets`)

Sistem logger terstruktur (`@audira/logger`) secara otomatis menyaring dan mengganti string sensitif menjadi `********` sebelum ditulis ke log, database audit, terminal replay, atau konteks AI:

- Kata sandi router / user login
- Secret parameter pada command konsol (e.g., `password=...`, `secret=...`, `key=...`)
- Bearer tokens & JWT headers
- API keys cloud AI (OpenAI, Anthropic, Gemini)

---

## 4. Command Risk Classification Matrix

Sebelum perintah diteruskan ke connector, Risk Engine mengklasifikasikan perintah ke dalam 4 tingkatan:

| Level Risiko | Karakteristik Perintah | Contoh Perintah | Kebijakan Eksekusi |
|---|---|---|---|
| **`LOW`** | Operasi baca (read-only), inspeksi status, diagnostik jaringan. | `/system resource print`, `/ip address print`, `/interface print`, `ping`, `traceroute` | Eksekusi langsung diizinkan. Dicatat di audit log. |
| **`MEDIUM`** | Penambahan konfigurasi non-destruktif, entri telemetry, comment update. | `/ip firewall address-list add`, `/system logging add`, penambahan komentar interface | Eksekusi langsung untuk engineer terotorisasi; AI mencatat diff sebelum eksekusi. |
| **`HIGH`** | Perubahan rute, manipulasi port interface, reordering firewall rules, simple queue limits. | `/ip route set`, `/interface set ether1 disabled=yes`, `/ip firewall filter move` | **Wajib Approval Operator.** Snapshot konfigurasi dibuat otomatis; preview visual diff ditampilkan. |
| **`CRITICAL`** | Operasi destruktif yang dapat memutus akses jaringan atau menghapus data perangkat. | `/system reset-configuration`, `/system reboot`, `/ip firewall filter remove [find]`, `/user remove` | **DILARANG OTOMATIS.** Ditolak jika dipicu AI. Wajib konfirmasi 2 operator (Four-Eyes Principle). |

---

## 5. Role-Based Access Control (RBAC)

AUDIRA NetOps AI menerapkan 7 peran terdefinisi dengan 12 izin granular:

### A. Definisi Roles
1. `SUPER_ADMIN`: Akses penuh ke seluruh konfigurasi sistem, user management, dan bypass darurat.
2. `NOC_MANAGER`: Approval authority untuk perintah `HIGH` dan `CRITICAL`, konfigurasi alarm global.
3. `SENIOR_NETWORK_ENGINEER`: Akses terminal SSH read/write, authorizer AI tool execution, config rollback.
4. `NETWORK_ENGINEER`: Operasi harian WinBox, eksekusi perintah `LOW` dan `MEDIUM`, query AI copilot.
5. `NOC_OPERATOR`: Pemantauan status live, ack alerts, inspeksi tabel routing dan interfaces read-only.
6. `READ_ONLY_AUDITOR`: Hanya memiliki akses ke dashboard statistik dan laporan `audit_logs`.
7. `AI_COPILOT_AGENT`: Akun sistem internal yang dibatasi oleh permission `ai:query` dan `ai:execute` (terisolasi pada sandbox tools).

### B. Matrix Permissions (12 Permissions)
| Permission | SUPER_ADMIN | NOC_MGR | SR_ENG | ENG | OPERATOR | AUDITOR | AI_AGENT |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| `device:read` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `device:write` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `device:delete` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `terminal:access` | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `config:read` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `config:write` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `config:rollback`| ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `ai:query` | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| `ai:execute` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅* |
| `alert:manage` | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| `audit:read` | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| `user:manage` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

*\*Eksekusi AI tetap dibatasi oleh Operator Approval Gate untuk perintah beresiko HIGH dan CRITICAL.*

---

## 6. Audit Trail & Non-Repudiation

Seluruh aktivitas sistem dicatat ke tabel `audit_logs` yang bersifat append-only:
- `id` (UUIDv4)
- `timestamp` (UTC ISO-8601)
- `user_id` / `actor` (Nama operator atau AI Copilot)
- `action` (e.g., `TERMINAL_COMMAND`, `CONFIG_APPLY`, `AI_EXECUTION_APPROVE`, `ROLLBACK`)
- `target_device_id` (ID router yang dimanipulasi)
- `command` (Perintah yang dieksekusi dengan password termasking)
- `risk_level` (`LOW` / `MEDIUM` / `HIGH` / `CRITICAL`)
- `status` (`SUCCESS` / `FAILED` / `REJECTED`)
- `diff_id` (Referensi visual diff snapshot konfigurasi)
