# AUDIRA NetOps AI — Enterprise Security & Governance Architecture

> **Security Posture**: Zero-Trust, Authenticated Encryption, Human-in-the-Loop Safeguards, Strict RBAC.

---

## 1. Cryptographic Storage & Encryption (AES-256-GCM)

All sensitive device credentials (SSH passwords, private keys, RouterOS API tokens, and SNMPv3 secrets) are encrypted before entering the PostgreSQL database:
- **Cipher**: AES-256 in Galois/Counter Mode (GCM).
- **Authentication**: 128-bit authentication tag guarantees ciphertext integrity against tampering.
- **Initialization Vector (IV)**: A cryptographically unique 12-byte IV is generated per encrypted record (`crypto.randomBytes(12)`).
- **Key Derivation**: Configured through `ENCRYPTION_KEY` (64-character hex string).

---

## 2. Zero Credential Leakage & Secret Redaction

The `@audira/security` engine enforces strict redaction across all log streams, terminal history, AI prompts, and HTTP responses:
- CLI password assignments (`password="********"`)
- RSA/ECDSA/OpenSSH PEM private keys (`-----BEGIN [MASKED PRIVATE KEY]-----`)
- Bearer tokens & API secrets (`Bearer [MASKED_TOKEN]`)
- RouterOS user hashes and WireGuard private keys (`[MASKED_SECRET]`)

---

## 3. Command Risk Classification Matrix

Every network operation proposed by operators or AI Copilots is evaluated by `CommandRiskEngine`:

| Risk Level | Characteristics | Examples | Required Safeguards |
| :--- | :--- | :--- | :--- |
| **CRITICAL** | Destructive, service-interrupting, unrecoverable | `system reset-configuration`, `reboot`, mass filter delete | Pre-flight backup, Four-Eyes dual approval, break-glass override |
| **HIGH** | Modifies routing topology, interfaces, or access control | `ip route add/remove`, `interface disable`, `firewall filter` | Pre-flight backup, visual Monaco diff review, operator approval |
| **MEDIUM** | Changes metadata, scripts, or non-disruptive settings | `system identity set`, `system script add`, interface comments | Pre-flight backup, single operator approval |
| **LOW** | Pure read-only queries, status monitoring, diagnostics | `/system resource print`, `ping`, `ip route print`, traceroute | Automatic execution, audit logged |

---

## 4. Dual-Operator "Four-Eyes" Quorum Engine

For all **CRITICAL** operations:
1. Initiator proposes the action with justification.
2. System produces a cryptographic HMAC challenge based on operation payload, target device, and expiration window.
3. A second, distinct operator with `SUPER_ADMIN` or `NETWORK_ADMIN` privileges must countersign the request.
4. If a quorum is not established within 15 minutes, the action automatically expires and is permanently logged in the audit ledger.

---

## 5. Change-Freeze Window Policy

To protect peak operational traffic, state-modifying network changes are locked during configured hours:
- **Peak Freeze Window**: 08:00 – 22:00 WIB (Read-only mode).
- **Maintenance Window**: 01:00 – 05:00 WIB (Modifications allowed).
- **Emergency Break-Glass Protocol**: Bypasses the freeze window only when accompanied by an authorized Incident Ticket (`INC-XXXXXX`) and recorded for security review.
