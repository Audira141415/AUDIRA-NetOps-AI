---
name: golden-config-drift-detector
description: Standard Operating Procedure (SOP) for detecting unauthorized configuration drift (Shadow Changes), comparing running configs against declared Golden Templates, and executing automated GitOps reconciliation.
---

# Golden Configuration Drift Detection & Automated Reconciliation Skill

This skill guides the AI Network Copilot through auditing running router configurations against declared **Golden Configuration Baselines** (GitOps/IaC standards), detecting out-of-band "Shadow Changes" introduced via manual console access, and safely reconciling discrepancies.

---

## 1. The Configuration Drift Problem in Large Networks

In production networks with hundreds of active devices, configuration drift inevitably accumulates due to:
1. **Unauthorized Out-of-Band Changes (Shadow Changes)**: Technicians executing ad-hoc edits via console ports during outages without committing changes to source control.
2. **Emergency Break-Glass Leftovers**: Temporary troubleshooting ACLs or static routes that were never cleaned up post-incident.
3. **Partial Provisioning Errors**: Automation scripts failing mid-run on a subset of edge routers.

Over time, configuration drift leads to **State Inconsistency**, failed disaster recovery restorations, and compliance audit non-conformities.

---

## 2. Drift Severity Classification Matrix

When comparing live configurations against the Golden Template, AUDIRA NetOps AI categorizes discrepancies into 4 severity tiers:

| Severity Level | Discrepancy Patterns & Triggers | Operational Impact | Recommended Action |
| :--- | :--- | :--- | :--- |
| **CRITICAL** | • Firewall filter / ACL removed or bypassed<br>• Local admin account added outside directory<br>• SSH cipher downgrade (`strong-crypto=no`)<br>• Default gateway modified | High security vulnerability, unauthorized backdoors, traffic detour | **Immediate Alert**.<br>Force automated rollback to Golden Template after snapshot. |
| **HIGH** | • BGP peer AS or prefix-list filters modified<br>• OSPF metric altered affecting routing path<br>• VLAN trunk allowed-list changed | Sub-optimal routing, asymmetric traffic, carrier SLA breach | Single operator review.<br>Schedule reconciliation in Maintenance Window. |
| **MEDIUM** | • Bandwidth queue rate altered<br>• Interface MTU or description altered<br>• Logging server IP missing | Telemetry blind spots, QoS degradation | Include in nightly automated reconciliation batch. |
| **LOW** | • Non-semantic whitespace differences<br>• Script comments or timestamp metadata tags | No operational impact | Auto-sync metadata to Git repository. |

---

## 3. Drift Detection & Reconciliation Workflow

```
[Hourly Daemon / AI Auditor]
            │
            ▼
[Fetch Live Running Config from Router]
            │
            ▼
[GoldenConfigDriftEngine: detectDrift]
            │
            ├── Compare against Golden Baseline Template
            ├── Filter out volatile dynamic lines (e.g. dynamic ARP, DHCP leases)
            │
            ├── Discrepancy Found?
            │         │
            │         ├── NO  ──> Posture Status: 100% IN-SYNC
            │         │
            │         └── YES ──> Status: DRIFT_DETECTED
            │                     │
            │                     ├── Synthesize Monaco Visual Diff (Green/Red)
            │                     ├── Calculate Drift Score (0 - 100%)
            │                     └── Classify Severity (CRITICAL/HIGH/MED/LOW)
            │
            ▼
[Decision Gate: Operator / NOC Policy]
            │
            ├── Option A: Reconcile to Golden (Enforce Baseline)
            │     • Trigger Pre-flight snapshot (/export compact)
            │     • Apply inverse remediation script
            │     • Post-verification check
            │
            └── Option B: Adopt / Promote to Golden (Authorized Change)
                  • Commit live changes to Git Repository as Golden Version (v+1)
                  • Update audit changelog with Ticket ID
```

---

## 4. Multi-Vendor Audit & Rollback Commands

### A. MikroTik RouterOS v7
```routeros
# 1. Export clean compact configuration without sensitive credentials
/export compact show-sensitive=no file=running-audit.rsc

# 2. Check system script and scheduler drift
/system/script/print detail
/system/scheduler/print detail

# 3. Reconcile by applying golden config script in Safe Mode
/import golden-baseline.rsc verbose=yes
```

### B. Cisco IOS & IOS-XE
```cisco
# 1. Compare running config against golden file stored in bootflash
archive config-diff system:running-config bootflash:golden-baseline.cfg

# 2. View configuration change history and who made manual edits
show archive config log all

# 3. Reconcile running configuration back to golden template (Zero Downtime)
configure replace bootflash:golden-baseline.cfg force
```

### C. Huawei VRP
```huawei
# 1. Compare active current-configuration against saved baseline
compare configuration

# 2. View rollback checkpoints
display configuration rollback list

# 3. Rollback to golden baseline file
rollback configuration to file golden-baseline.cfg
```

### D. Juniper Junos OS
```junos
# 1. Compare running configuration against external golden set template
show | compare /var/tmp/golden-baseline.conf

# 2. Reconcile by loading replacement template
load replace /var/tmp/golden-baseline.conf
show | compare
commit confirmed 5 comment "AUDIRA: Reconciled to Golden Baseline"
```

---

## 5. Golden Template Hygiene Rules

1. **Parameterization**: Golden templates must separate invariant standards (e.g. CIS hardening rules, NTP servers, SNMPv3 USM) from node-specific variables (`{{HOSTNAME}}`, `{{ROUTER_ID}}`, `{{MANAGEMENT_IP}}`).
2. **Volatile Exclusion**: The drift detector MUST ignore volatile auto-generated tokens (e.g. uptime counters, DHCP dynamic leases, BGP dynamic peer states).
3. **Pre-flight Snapshot Mandate**: Reconciling drift is a state-modifying action. Always generate a SHA256-verified backup before issuing any `configure replace` or `load replace` command.
