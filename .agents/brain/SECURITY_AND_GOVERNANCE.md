# SECURITY & GOVERNANCE — AUDIRA NetOps AI
> Kebijakan Mutlak Pengendalian Risiko, Standar Keselamatan AI, dan Audit Operasional.

---

## 1. 9-Step AI Execution Safety Pipeline

Seluruh proposal perubahan konfigurasi, pemanggilan API mutating, atau eksekusi perintah CLI oleh AI Network Copilot **wajib** melalui 9 tahapan berurutan tanpa pengecualian:

```
[1. AI Proposal] 
       ↓
[2. Tool Registry Check] (Verifikasi otorisasi tool)
       ↓
[3. Syntax & Schema Validation] (Pengecekan sintaks vendor)
       ↓
[4. Risk Scoring Engine] (Klasifikasi LOW / MEDIUM / HIGH / CRITICAL)
       ↓
[5. Automated Pre-Flight Backup] (Snapshot konfigurasi saat ini)
       ↓
[6. Visual Diff Generator] (Generasi diff Hijau / Merah / Kuning)
       ↓
[7. Operator Approval Gate] (Human-in-the-Loop Web / Telegram / Quorum)
       ↓
[8. Live Execution] (Menggunakan Safe-Mode atau Candidate-Commit)
       ↓
[9. Post-Verification & Audit Log] (Pengecekan link & pencatatan permanen)
```

---

## 2. Risk Classification Matrix

| Level Risiko | Definisi & Contoh Perintah | Persyaratan Otorisasi |
| :--- | :--- | :--- |
| **LOW (1–25)** | Operasi inspeksi read-only: `ping`, `traceroute`, `/ip route print`, `show ip int brief`. | Eksekusi otomatis diperbolehkan. |
| **MEDIUM (26–55)** | Penambahan konfigurasi non-destruktif: Tambah deskripsi port, DNS static entry, tambah address list firewall. | Konfirmasi tunggal dari operator di UI. |
| **HIGH (56–80)** | Perubahan routing dan kebijakan keamanan: Modifikasi rule BGP, penambahan firewall drop, perubahan IP interface core. | Konfirmasi operator + Ringkasan Visual Diff + Backup otomatis. |
| **CRITICAL (81–100)** | Tindakan berisiko memutus konektivitas: Perubahan default gateway, reset BGP peer, modifikasi interface trunk management. | **Dual-Operator Four-Eyes Approval (2 Orang)** + Tiket Darurat Break-Glass. |

---

## 3. Absolute Blacklist Commands (Dilarang Mutlak)

Perintah-perintah berikut berada dalam daftar hitam mutlak (**Hard Blacklist**) dan **tidak akan pernah dieksekusi** secara otomatis oleh sistem AI:

1. `/system reset-configuration` (MikroTik RouterOS)
2. `/system reboot` atau `reload` tanpa konfirmasi fisik
3. `/ip firewall filter remove [find]` (Mass deletion tanpa spesifikasi ID)
4. `write erase` / `format flash:` (Cisco IOS)
5. `reset saved-configuration` (Huawei VRP)
6. `request system zeroize` (Juniper Junos)
7. Perintah yang menghapus akun admin aktif secara tunggal.

---

## 4. Dual-Operator "Four-Eyes" Rule

- **Prinsip**: Tidak ada satu operator tunggal pun yang dapat mengeksekusi operasi bertaraf `CRITICAL` sendirian.
- **Implementasi**: Disertifikasi oleh [`four-eyes.ts`](file:///f:/AUDIRA-NetOps-AI/packages/security/src/four-eyes.ts).
- **Mekanisme**:
  - Operator 1 (Inisiator) mengajukan *Request for Change (RFC)*.
  - Sistem membuat token tantangan dengan masa berlaku 15 menit.
  - Operator 2 (Verifikator dengan wewenang setingkat Lead NOC / Cyber Sec) meninjau visual diff dan menandatangani otorisasi menggunakan secret HMAC.
  - Keduanya dicatat dalam tabel `ai_audit_logs`.

---

## 5. Kebijakan Change Freeze Window & Break-Glass

- **Jam Kerja Sibuk (Peak Freeze Window)**:
  - **Pukul 08:00 – 22:00 WIB (Senin – Jumat)**: Jaringan berada dalam status **READ-ONLY**.
  - Segala bentuk perubahan konfigurasi diblokir oleh sistem demi menjamin stabilitas trafik bisnis.
- **Maintenance Window**:
  - **Pukul 01:00 – 05:00 WIB**: Jendela waktu resmi untuk pemeliharaan terjadwal dan upgrade firmware.
- **Emergency Break-Glass Protocol**:
  - Jika terjadi insiden kritis (misal: kabel fiber optik utama putus dan lalu lintas harus segera dialihkan via BGP), operator dapat mengaktifkan **Break-Glass**.
  - Mewajibkan:
    1. Incident Ticket ID resmi (e.g. `INC-2026-9042`).
    2. Justifikasi teknis darurat.
    3. Tanda tangan operator kedua.

---

## 6. Secret Redaction Policy (Zero Credential Leakage)

- **Aturan Emas**: Kredensial tidak boleh bocor ke client-side JavaScript, log terminal publik, atau response payload AI.
- **Implementasi**: [`secret-redaction-policy.md`](file:///f:/AUDIRA-NetOps-AI/.agents/rules/secret-redaction-policy.md) dan regex masker di [`logger`](file:///f:/AUDIRA-NetOps-AI/packages/logger).
- **Pola Penyamaran**:
  - Password, password-hash, community-string SNMP, private key WireGuard/SSH, API token, dan bot token secara instan disamarkan menjadi `********`.
