# Router Safety Guardrails & Risk Classification Rules

## 1. Absolute Blacklist (CRITICAL - FORBIDDEN AUTO-EXECUTION)
Under NO circumstances may an AI agent or automated trigger execute the following commands autonomously:
- `/system/reset-configuration` (or any variant with `keep-users` or `no-defaults`)
- `/system/reboot` / `/system/shutdown`
- Bulk deletion of firewall rules (`/ip/firewall/filter remove [find]`)
- Bulk interface disabling (`/interface disable [find]`)
- Overwriting or flushing default gateway route (`/ip/route remove [find dst-address=0.0.0.0/0]`)

**Requirement**: These commands must be intercepted by the Risk Engine and require a minimum of Two-Operator Approval Gate with clear justification.

---

## 2. Risk Classification Matrix

| Risk Level | Typical Commands | Automation Policy |
| :--- | :--- | :--- |
| **LOW** | `/system/resource/print`, `/interface/print`, `/ip/address/print`, `/ping`, `/tool/torch` | Auto-execution allowed. Output logged to audit table. |
| **MEDIUM** | Setting queue bandwidth limits, adding comment/tag, adding IP to temporary address-list | Allowed with automated audit log and pre-flight snapshot. |
| **HIGH** | Adding/modifying static routes, altering BGP peers, adding firewall filter rules, changing interface MTU | Pre-flight backup MANDATORY. Visual diff generated. Single operator approval required. |
| **CRITICAL** | Device reboot, factory reset, partition wipe, deleting upstream trunk bridges | **BLOCKED FROM AUTOMATION**. Dual operator confirmation gate required. |

---

## 3. Rollback & Pre-Flight Snapshot Mandate
Every modifying command (Risk Level `MEDIUM`, `HIGH`, or `CRITICAL`) MUST be preceded by:
1. Snapshot generation: `/export compact file=preflight-<timestamp>.rsc`
2. Stored MD5/SHA256 checksum verification.
3. Rollback command prepared in memory before dispatching the modification.
