# SECURITY — [Nama Project]

> File ini berisi protokol dan standar keamanan aplikasi.

> **Version:** [v1.0.0]
> **Last Updated:** [YYYY-MM-DD]

---

## 1. Security Architecture

[Penjelasan strategi pertahanan, misal: Defense-in-depth]

## 2. Authentication & Session

- **Auth Provider:** [Misal: NextAuth / Supabase Auth]
- **Session Strategy:** [JWT / Database Sessions, masa berlaku]
- **Password Rules:** [Aturan kerumitan password]

## 3. Authorization (RBAC)

- **Roles:** [Daftar peran, misal: Admin, User]
- **Enforcement:** [Bagaimana middleware atau API mengecek hak akses]

## 4. Input Validation

- **Client-side:** [Misal: Zod + React Hook Form]
- **Server-side:** [Validasi ulang di API routes]

## 5. Data Security

- **Environment Variables:** [Aturan penyimpanan secret key]
- **Database:** [Enkripsi, Row Level Security jika pakai Supabase]

## 6. API Security

- **Rate Limiting:** [Batas request per IP]
- **CORS:** [Aturan domain yang diizinkan]
