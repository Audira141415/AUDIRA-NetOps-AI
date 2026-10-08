# Dual-Operator "Four-Eyes" Quorum Governance Rule

## 1. Principle & Operational Purpose

The **Four-Eyes Principle (Dual-Operator Quorum)** is a mandatory security and operational governance policy enforcing that no single individual or automated system can autonomously execute high-consequence, irreversible, or service-disrupting changes on AUDIRA NetOps AI managed network infrastructure.

Every operation classified under **CRITICAL** risk or involving multi-device core topology teardowns requires two distinct, authenticated engineering pairs of eyes:
1. **Initiator / Proposer**: Prepares, validates, and simulates the configuration change or remediation proposal.
2. **Reviewer / Approver**: An independent senior peer who inspects the visual diff, verifies pre-flight snapshots, and signs off on the live execution.

---

## 2. Operations Mandating Dual-Operator Quorum

The Four-Eyes Gate is strictly enforced for:

| Operation Category | Command Patterns & Examples | Governance Mandate |
| :--- | :--- | :--- |
| **System Termination** | `/system/reboot`, `request system reboot`, `reload`, `shutdown` | **STRICT DUAL QUORUM**.<br>Auto-execution blocked. |
| **Factory Reset & Wipe** | `/system/reset-configuration`, `request system zeroize`, `write erase` | **STRICT DUAL QUORUM**.<br>Requires physical/out-of-band audit trail. |
| **Bulk Table Flushes** | `/ip firewall filter remove [find]`, `delete interfaces`, bulk ACL purge | **STRICT DUAL QUORUM**.<br>Visual diff mandatory. |
| **Global Routing Teardowns**| Removing default gateway (`0.0.0.0/0`), terminating BGP AS sessions | **STRICT DUAL QUORUM**.<br>Rollback pre-loaded in memory. |
| **Core Break-Glass Overrides** | Emergency Break-Glass on Core/Backbone tier during peak freeze | Dual Sign-off within 5-min window. |
| **Fleet Multi-Device Changes** | Mass automated firmware/config rollout across > 5 devices | Automated pre-check + 2 Approvers. |

---

## 3. Strict Segregation of Duties (Anti-Self-Approval)

To eliminate collusion or accidental single-person blunders:
1. **Identity Segregation**: The `initiator.userId` MUST NEVER equal the `approver.userId`. Self-approval attempts are intercepted and rejected with an explicit security violation error.
2. **Role Qualifications**: The second approver must possess `SUPER_ADMIN` or `NETWORK_ADMIN` credentials.
3. **Cryptographic Signing**: Approvals generate an HMAC-SHA256 signature binding the `requestId`, `approverId`, `timestamp`, and `commandsHash`.
4. **Time-To-Live (TTL)**: Unapproved Four-Eyes requests expire automatically after **15 minutes** (900 seconds) to prevent stale authorization attacks.

---

## 4. Quorum Sign-off Workflow & State Transitions

```
[Operator 1 / AI Copilot]
       │
       ▼ Generates Proposal + Visual Diff
[FourEyesEngine: createFourEyesRequest]
       │
       ▼ (Status: PENDING_SECOND_APPROVAL)
       ├── Broadcasts to Telegram & Discord NOC Bot Channels
       └── Pops Interactive Modal in Web NOC Interface
              │
              ├── [Operator 1 attempts sign-off] ──> 🛑 REJECTED: Self-approval forbidden
              ├── [15 minutes elapse without approval] ──> ⏳ EXPIRED
              │
              └── [Operator 2 (Lead/Admin) inspects Diff & signs off]
                     │
                     ▼
              [FourEyesEngine: evaluateFourEyesSignoff]
                     │
                     ├── Verifies Role & Non-Identity
                     ├── Takes Automatic Pre-Flight Backup Snapshot
                     ├── Emits Indelible Audit Record to PostgreSQL
                     │
                     ▼ (Status: APPROVED)
              [Live Device Dispatch & Post-Check Verification]
```

---

## 5. Indelible Audit Logging Mandate

Every Four-Eyes transaction produces a tamper-evident audit record in the database:
- `request_id`: UUIDv4
- `initiator_id` & `initiator_username`
- `approver_id` & `approver_username`
- `device_id` & `device_name`
- `risk_level`: `CRITICAL`
- `commands_hash`: SHA256 of normalized command list
- `preflight_snapshot_id`: Reference to compact config backup
- `approval_signature`: Cryptographic HMAC token
- `status`: `APPROVED` | `REJECTED` | `EXPIRED`
- `completed_at`: ISO 8601 UTC timestamp
