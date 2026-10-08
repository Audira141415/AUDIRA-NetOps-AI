# Change-Freeze Window Policy & Emergency Break-Glass Governance

## 1. Operational Rationale & Scope

To guarantee enterprise service uptime (99.99% SLA) and protect mission-critical data flows during high-traffic intervals, **AUDIRA NetOps AI** enforces an automated Change-Freeze policy across all managed network devices (Core, Aggregation, Distribution, Edge, and Data Center switches/routers).

Configuration errors during peak traffic periods pose catastrophic risks of service disruption, cascading BGP route flapping, and revenue loss. All automated tools, scheduled playbooks, and interactive AI Copilot modifications must adhere to strictly defined time windows.

---

## 2. Standard Operating Time Windows (Default: WIB / UTC+7)

| Window Name | Schedule (WIB / UTC+7) | Allowed Operations | Governance Policy |
| :--- | :--- | :--- | :--- |
| **PEAK CHANGE FREEZE** | **08:00 – 22:00** (Daily) | **READ-ONLY ONLY**<br>(Telemetries, Sniffers, DDM, Status) | **STRICTLY LOCKED**.<br>All state-modifying commands are blocked by the Risk Engine unless authorized via Emergency Break-Glass. |
| **OFF-PEAK TRANSITION** | **22:00 – 01:00** &<br>**05:00 – 08:00** (Daily) | Low to Medium Risk changes<br>(Tags, temporary address-lists, queue adjustments) | Single operator review required.<br>High/Critical changes deferred to MW. |
| **MAINTENANCE WINDOW (MW)** | **01:00 – 05:00** (Daily) | All validated changes<br>(Firmware, BGP re-peering, Core ACL, VLAN trunks) | Pre-flight backup mandatory.<br>Visual diff and standard peer approval gate. |
| **HARD FREEZE PERIODS** | National Holidays, Black Friday, Election, Year-End (Dec 24 – Jan 2) | **EMERGENCY RESTORATION ONLY** | All planned Maintenance Windows suspended.<br>Requires Director / NOC Lead signoff. |

---

## 3. Operations Classification During Change-Freeze

### A. Permitted Operations (Read-Only & Observability)
Autonomous agents and operators may execute without hindrance:
1. **Telemetry & Status Queries**: `/system/resource/print`, `/interface/print`, `/ip/route/print`.
2. **Diagnostic Probes**: `/ping`, `/tool/traceroute`, `/tool/torch`, `/tool/sniffer`.
3. **Hardware Health Checks**: SFP/SFP+ Optical DDM (`/interface/ethernet/monitor once`).
4. **BGP & OSPF State Inspection**: `/routing/bgp/session/print`, `/routing/ospf/neighbor/print`.
5. **Configuration Backups & Compact Exports**: `/export compact`, `/system/backup/save`.

### B. Restricted Operations (State-Modifying)
Blocked during **PEAK CHANGE FREEZE** and **HARD FREEZE**:
1. Adding, modifying, or disabling interfaces (`/interface set`, `/interface disable`).
2. Adding or modifying routing tables, default gateways, BGP/OSPF neighbors.
3. Firewall rule insertions or modifications (`/ip/firewall/filter`, `nat`, `mangle`).
4. Bandwidth queue alterations or dynamic shaping reconfiguration.
5. System package updates, RouterBOOT upgrades, and device reboots.

---

## 4. Emergency Break-Glass Override Protocol

When a network emergency (P1/P2 outage, active volumetric DDoS attack, link failure requiring traffic detour) occurs during a change-freeze window, the **Emergency Break-Glass Protocol** permits expedited modification under strict governance:

### Mandatory Requirements:
1. **Active Incident Ticket ID**: Must provide an authorized ticket reference matching `INC-XXXXX`, `CHG-XXXXX`, or `EMRG-XXXXX`.
2. **Technical Justification**: Explicit explanation of why remediation cannot wait until the 01:00 WIB Maintenance Window.
3. **Mandatory Pre-Flight Snapshot**: The platform automatically triggers `/export compact` and saves a SHA256 checksummed snapshot before applying any change.
4. **Real-time Incident Notification**: The `BotApprovalService` immediately broadcasts the break-glass invocation to the designated NOC Telegram/Discord channel with:
   - Operator username and IP.
   - Target device name and IP.
   - Incident Ticket ID and justification.
   - Full command payload and visual diff.
5. **Dual-Operator Sign-off for CRITICAL Actions**: Even during Break-Glass, actions categorized as `CRITICAL` (reboot, factory reset, mass rule purge) cannot execute without a second verified operator approval.
6. **Post-Incident Review (PIR)**: Every break-glass event generates an indelible entry in the PostgreSQL `audit_logs` table requiring NOC Lead sign-off within 24 hours.

---

## 5. Technical Enforcement Pipeline

```
Operator / AI Command
         │
         ▼
[Risk Engine: evaluateCommandRisk]
         │
         ├── LOW (Read-Only) ──> Permitted anytime ──> Execute & Log
         │
         └── MEDIUM / HIGH / CRITICAL (State Modifying)
                     │
                     ▼
         [evaluateChangeFreezeWindow]
                     │
                     ├── Outside Freeze Window (MW: 01:00-05:00 WIB)
                     │         └── Standard Approval Gate ──> Execute
                     │
                     └── Inside Peak / Hard Freeze Window (08:00-22:00 WIB)
                               │
                               ├── No Break-Glass Ticket ──> 🛑 BLOCKED (Policy Rejection)
                               │
                               └── Valid Break-Glass (INC-XXXXX)
                                         ├── Auto Pre-flight Backup
                                         ├── Real-time Bot Broadcast
                                         └── Expedited Operator Gate ──> Execute & Audit
```
