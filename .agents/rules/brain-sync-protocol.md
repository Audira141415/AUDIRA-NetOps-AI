# BRAIN SYNCHRONIZATION PROTOCOL
> **Rule ID**: `BRAIN-SYNC-01`  
> **Target**: Seluruh AI Agent, Pair Programmer, dan Pengembang di AUDIRA NetOps AI.  
> **Level**: MANDATORY (Wajib Dipatuhi Tanpa Pengecualian).

---

## 1. Tujuan Kebijakan

Dokumen [`.agents/brain/`](file:///f:/AUDIRA-NetOps-AI/.agents/brain) dan [`BRAIN.md`](file:///f:/AUDIRA-NetOps-AI/BRAIN.md) merupakan *Single Source of Truth (SSOT)* dan memori jangka panjang dari proyek AUDIRA NetOps AI. Dokumen ini mencegah timbulnya halusinasi arsitektur, duplikasi fitur, inkonsistensi tipe data, atau kode terputus/usang.

---

## 2. Aturan Sinkronisasi Saat Penambahan / Modifikasi Fitur

Setiap kali Anda (AI Agent) selesai mengimplementasikan fitur baru, memperbaiki bug arsitektural, atau menambah komponen, Anda **wajib** melakukan langkah-langkah sinkronisasi berikut sebelum mengakhiri sesi:

1. **Periksa Modul Terkait di Brain**:
   - Jika membuat komponen/view frontend baru di `apps/web`: Daftarkan nama file, rute, dan tujuannya di [`FEATURE_CATALOG.md`](file:///f:/AUDIRA-NetOps-AI/.agents/brain/FEATURE_CATALOG.md).
   - Jika membuat library/driver baru di `packages/`: Daftarkan perannya di [`SYSTEM_ARCHITECTURE.md`](file:///f:/AUDIRA-NetOps-AI/.agents/brain/SYSTEM_ARCHITECTURE.md).
   - Jika menambah dialek perangkat atau perintah vendor: Update tabel di [`MULTI_VENDOR_MATRIX.md`](file:///f:/AUDIRA-NetOps-AI/.agents/brain/MULTI_VENDOR_MATRIX.md).
   - Jika menambah tabel database: Update daftar tabel di [`DATABASE_AND_DATA_FLOW.md`](file:///f:/AUDIRA-NetOps-AI/.agents/brain/DATABASE_AND_DATA_FLOW.md).
   - Jika mengubah kebijakan keamanan/approval: Update [`SECURITY_AND_GOVERNANCE.md`](file:///f:/AUDIRA-NetOps-AI/.agents/brain/SECURITY_AND_GOVERNANCE.md).

2. **Perbarui Log Perubahan**:
   - Tambahkan deskripsi singkat tentang apa yang baru saja diselesaikan pada bab *Log Riwayat Rilis* di [`UPDATE_HISTORY_AND_ROADMAP.md`](file:///f:/AUDIRA-NetOps-AI/.agents/brain/UPDATE_HISTORY_AND_ROADMAP.md).

3. **Verifikasi Integritas Tipe & Build**:
   - Pastikan `pnpm typecheck` dan `pnpm build` tetap lulus 100% setelah pembaruan kode.

---

## 3. Peringatan Pelanggaran

Membiarkan Brain menjadi usang atau menambahkan fitur tanpa mencatatnya di Brain akan mengakibatkan agent pada sesi berikutnya kehilangan konteks arsitektur dan dapat menyebabkan konflik dependensi atau regresi kode.
