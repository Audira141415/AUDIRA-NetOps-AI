# TESTING — AUDIRA NetOps AI

> **System:** AUDIRA NetOps AI (Enterprise NOC Platform)  
> **Tagline:** "Network Management. Terminal. Automation. AI."  
> **Version:** v1.0.0  
> **Status:** Production-Ready QA & Testing Standards  

---

## 1. Testing Philosophy & Strategy

AUDIRA NetOps AI mengendalikan infrastruktur jaringan kritis. Kesalahan satu baris kode dapat berdampak pada blackout jaringan operasional. Oleh karena itu, strategi pengujian menerapkan piramida kualitas berlapis:

```
                      ┌──────────────────────┐
                      │  Security Guardrail  │ (Leakage, Risk Engine, Four-Eyes)
                      ├──────────────────────┤
                      │  E2E / Demo Flow     │ (PuTTY, WinBox, Topology, AI)
                      ├──────────────────────┤
                      │  Integration Tests   │ (API Endpoints & WebSockets)
                      ├──────────────────────┤
                      │  Unit Tests (Vitest) │ (Security, Connectors, AI Tools)
                      ├──────────────────────┤
                      │  Strict TypeScript   │ (Zero 'any', 23 Turbo Tasks)
                      └──────────────────────┘
```

---

## 2. Static Type Verification (`pnpm typecheck`)

Sebelum setiap merge atau commit, seluruh workspace monorepo wajib lulus verifikasi tipe ketat TypeScript tanpa error:

```bash
# Menjalankan typecheck di seluruh 14 package secara paralel via Turbo
pnpm typecheck
```

**Standar Type Checking:**
- Parameter `noImplicitAny: true` aktif.
- Seluruh fungsi domain memiliki return type eksplisit.
- Dilarang menggunakan `// @ts-ignore` kecuali disertai alasan teknis terdokumentasi dan persetujuan lead engineer.

---

## 3. Unit & Component Testing (Vitest)

Unit test ditempatkan bersebelahan dengan file target dengan ekstensi `*.test.ts`.

### A. `@audira/security` Test Suite
Wajib menguji:
1. **AES-256-GCM Roundtrip:** String password yang dienkripsi menghasilkan `iv`, `authTag`, dan `encryptedData` terpisah, serta terdekripsi secara identik.
2. **`maskSecrets()` Sanitization:** Memverifikasi bahwa token, kata sandi, dan private key di dalam string log tersanitasi menjadi `********`.
3. **Command Risk Classifier:**
   - `/system resource print` ➔ `LOW`
   - `/ip firewall address-list add ...` ➔ `MEDIUM`
   - `/ip route set ...` ➔ `HIGH`
   - `/system reset-configuration` ➔ `CRITICAL`
   - `/system reboot` ➔ `CRITICAL`
4. **RBAC Guard Matrix:** Memverifikasi bahwa role `NOC_OPERATOR` tidak dapat memicu aksi `config:write`.

### B. `@audira/ai-agent` Test Suite
Wajib menguji:
1. **Tool Invocation Schema:** Parameter tool input tervalidasi terhadap skema Zod.
2. **Safety Pipeline Interception:** Memverifikasi bahwa proposal AI dengan tingkat risiko `HIGH` atau `CRITICAL` tidak langsung dieksekusi tanpa objek `approvalTicket`.
3. **Visual Diff Generator:** Memverifikasi kalkulasi penambahan baris (hijau), penghapusan (merah), dan modifikasi (kuning).

### C. `@audira/routeros` Test Suite
Wajib menguji:
1. Serialisasi kata perintah API RouterOS (`/ip/address/print` ➔ format word stream).
2. Mock Connector fallback ketika socket fisik tidak dapat dijangkau.

---

## 4. Security Verification Test Suite (Wajib Lulus)

Suite pengujian khusus untuk memastikan tidak ada celah keamanan jaringan:

| Test Case | Tujuan Pengujian | Kriteria Lulus |
|---|---|---|
| `SEC-001: Credential Leakage` | Panggil `GET /api/v1/devices` | Field `password`, `private_key`, dan `secret` **TIDAK PERNAH** muncul dalam respons JSON. |
| `SEC-002: CRITICAL Auto-Block` | AI Copilot menerima prompt reset router | Risk Engine mengembalikan level `CRITICAL` dan secara tegas menolak eksekusi otomatis. |
| `SEC-003: Log Sanitization` | Eksekusi login yang gagal dengan password | Log output hanya mencantumkan `password=********`. |
| `SEC-004: Direct Socket Bypass` | Modul AI mencoba membuka socket TCP mentah | Permintaan ditolak karena tidak memiliki token enkripsi dari Security Layer. |

---

## 5. Frontend Production Bundle Test

Memastikan bundle web terkompilasi bersih tanpa dependensi bermasalah:

```bash
# Build aplikasi web NOC
pnpm --filter @audira/web run build
```
Target ukuran bundle produksi: `< 500 kB (gzipped)` untuk initial chunk.

---

## 6. Manual E2E Validation Runbook (Zero-Hardware Demo)

Langkah pengujian alur operasional menyeluruh tanpa perangkat keras fisik:

1. **Jalankan Aplikasi:**
   ```bash
   pnpm dev
   ```
2. **Buka Browser ke `http://localhost:5173`:**
   - Verifikasi Topbar menampilkan: `● 42 DEVICES` dan `🤖 AI (qwen2.5:7b) [ONLINE]`.
   - Verifikasi Health Status Cards: `39 ONLINE`, `2 WARNING`, `1 OFFLINE`.
3. **Pengujian PuTTY Live Terminal:**
   - Klik menu **Terminal**.
   - Pindah antar tab: `[CORE-01 4ms]`, `[CORE-02 28ms]`, `[SW-01 1ms]`.
   - Ketik perintah `/ip route print` dan tekan Enter; pastikan output konsol termuat dengan pewarnaan ANSI yang tepat.
4. **Pengujian WinBox Device Manager:**
   - Klik menu **WinBox**.
   - Telusuri tab **Interfaces**, **IP Addresses**, **Routes**, dan **Firewall**.
   - Pastikan metrik RX/TX bytes bergerak secara dinamis sesuai telemetry feed.
5. **Pengujian AI Copilot Safety Flow:**
   - Ajukan pertanyaan diagnostik: `"Kenapa CORE-02 mengalami packet loss?"`.
   - Pastikan AI menyajikan 4 checklist:
     - `✓ Interface check (ether1 error counters)`
     - `✓ Route check (BGP flapping)`
     - `✓ Ping test (RTT spike 28ms)`
     - `✓ Log analysis`
   - Saat AI menyarankan perbaikan rute atau firewall, pastikan **Approval Gate Modal** muncul menampilkan badge risiko dan **Visual Diff (Hijau/Merah/Kuning)** sebelum ada eksekusi.
