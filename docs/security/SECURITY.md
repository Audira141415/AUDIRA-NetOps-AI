# AUDIRA NetOps AI — Enterprise Security Policy

## 1. Secret Protection & Cryptography
- **No Secret Leakage**: Passwords, private keys, API secrets, and tokens are NEVER exposed to frontend JavaScript or client state.
- **Hardware-Accelerated Encryption**: Credentials stored in PostgreSQL are encrypted using AES-256-GCM with a 32-byte secret key and unique 96-bit initialization vectors (IV).
- **Log Sanitization**: Structured logs are automatically parsed with regex pattern matchers that replace passwords, bearer tokens, and private key blocks with `********` before persistence.

## 2. Command Risk Matrix
Commands are inspected and categorized prior to execution:

| Risk Level | Definition | Examples | Permitted Actions |
|---|---|---|---|
| **LOW** | Read-only inspection | `/system resource print`, `ping`, `/interface print` | Auto-executed by operators |
| **MEDIUM** | Non-destructive modifications | Comment updates, description tags, NTP client | Executed with logging |
| **HIGH** | Routing, interface, firewall changes | `/ip route add`, `/ip firewall filter add`, `/interface vlan add` | Mandatory backup + Diff review |
| **CRITICAL** | Destructive / Service Disrupting | `/system reset-configuration`, `/system reboot`, `/user remove` | **STRICTLY BLOCKED** without 2-person signoff |

## 3. Role-Based Access Control (RBAC)
Granular permissions:
- `device.read`, `device.write`
- `terminal.read`, `terminal.write`
- `config.read`, `config.write`, `config.execute`, `config.rollback`
- `ai.read`, `ai.execute`
- `audit.read`
- `automation.execute`
