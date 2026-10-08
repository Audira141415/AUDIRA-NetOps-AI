# Secret Redaction & Zero-Credential Exposure Policy

## 1. Zero Frontend Exposure
1. Device passwords, SSH private keys, API-SSL tokens, and preshared keys (WireGuard, IPsec) must NEVER be transmitted to frontend React state or client JavaScript.
2. The REST API must only return obfuscated hashes or `hasPassword: true` indicators in DTOs.

---

## 2. Automatic Log Masking
All logging layers ([packages/logger](file:///f:/AUDIRA-NetOps-AI/packages/logger)) and WebSocket terminal streams must intercept and mask sensitive patterns before storage or broadcast:

### Target Patterns:
- Passwords in command lines: `password="([^"]+)"` ➔ `password="********"`
- WireGuard private keys: `private-key="([^"]+)"` ➔ `private-key="********"`
- IPsec secrets: `secret="([^"]+)"` ➔ `secret="********"`
- Bearer tokens: `Bearer\s+[A-Za-z0-9\-\._~\+\/]+=*` ➔ `Bearer ********`
- SNMP Community strings: `security-name="([^"]+)"` ➔ `security-name="********"`

---

## 3. Database Encryption
1. All credentials stored in PostgreSQL `devices` and `credentials` tables must be encrypted with AES-256-GCM.
2. The encryption IV and authentication tag must be stored alongside the ciphertext.
3. Master encryption keys must be sourced from environment variables (`ENCRYPTION_MASTER_KEY`) and never committed to source control.
