---
name: juniper-junos-syntax
description: Standardized syntax guidelines, CLI hierarchy, candidate-commit workflow, and safety rules for Juniper Junos OS devices.
---

# Juniper Junos OS Syntax & Candidate Configuration Guidelines

This skill guides the AI Network Copilot in generating, analyzing, and validating configuration commands for Juniper Networks Junos OS devices (MX routers, QFX switches, EX switches, and SRX firewalls).

---

## 1. Junos CLI Hierarchy & Modes

Unlike line-by-line applied CLIs (such as Cisco IOS), Junos uses a hierarchical, transactional database architecture with distinct modes:

1. **Operational Mode** (`user@device>`):
   - Used for monitoring, telemetry, troubleshooting, and issuing operational requests.
   - Enter configuration mode by typing `configure` or `edit`.
2. **Configuration Mode** (`user@device#`):
   - Modifies the **Candidate Configuration** database.
   - Changes do NOT take effect on active data planes until committed (`commit`).
3. **Hierarchy Navigation**:
   - `edit <path>`: Moves deeper into hierarchy level (e.g. `edit protocols bgp group PEER-A`).
   - `up [n]`: Moves up *n* hierarchy levels.
   - `top`: Jumps back to root configuration level.
   - `exit`: Leaves current level or exits configuration mode.

---

## 2. Common CLI Patterns (Set vs Hierarchical)

AUDIRA NetOps AI prefers `set` format for explicit, deterministic automation pipelines:

### A. Interface Management
```junos
set interfaces ge-0/0/0 description "UPLINK-TO-CORE-01 [10G-LR]"
set interfaces ge-0/0/0 unit 0 family inet address 10.50.1.2/30
set interfaces ge-0/0/0 unit 0 family inet mtu 1500
delete interfaces ge-0/0/0 disable
```

### B. Static Routing & Routing Options
```junos
set routing-options static route 0.0.0.0/0 next-hop 10.50.1.1
set routing-options router-id 10.50.1.2
set routing-options autonomous-system 65100
```

### C. BGP Peering & Policy Options
```junos
set protocols bgp group UPSTREAM-TRANSIT type external
set protocols bgp group UPSTREAM-TRANSIT peer-as 64512
set protocols bgp group UPSTREAM-TRANSIT neighbor 10.50.1.1 description "TIER1-TRANSIT"
set protocols bgp group UPSTREAM-TRANSIT neighbor 10.50.1.1 import BGP-IN-POLICY
set protocols bgp group UPSTREAM-TRANSIT neighbor 10.50.1.1 export BGP-OUT-POLICY
set protocols bgp group UPSTREAM-TRANSIT neighbor 10.50.1.1 bfd-liveness-detection minimum-interval 350
```

### D. Stateless Firewall Filters (ACL)
```junos
set firewall family inet filter EDGE-PROTECT term PERMIT-BGP from source-port bgp
set firewall family inet filter EDGE-PROTECT term PERMIT-BGP then accept
set firewall family inet filter EDGE-PROTECT term DROP-UNAUTHORIZED-SSH from destination-port ssh
set firewall family inet filter EDGE-PROTECT term DROP-UNAUTHORIZED-SSH then log
set firewall family inet filter EDGE-PROTECT term DROP-UNAUTHORIZED-SSH then discard
set firewall family inet filter EDGE-PROTECT term DEFAULT-ACCEPT then accept
```

---

## 3. Transactional Candidate Commit & Safety Mandates

The transactional model of Junos provides unmatched configuration safety when used properly:

### 1. Mandatory Pre-Flight Syntax Check
Before committing, the agent MUST run syntactic verification:
```junos
commit check
```

### 2. Mandatory `commit confirmed` for Remote Changes
When modifying routing, BGP, firewall filters, or management interfaces over SSH, the agent MUST use confirmed commit:
```junos
commit confirmed 5 comment "AUDIRA-AI: BGP re-peering under TICKET-10492"
```
*If connection to the router drops or the operator fails to issue `commit` within 5 minutes, Junos will automatically roll back the candidate configuration to the previous working state.*

### 3. Visual Diff Before Commit
To evaluate proposed candidate changes against running configuration:
```junos
show | compare
show | compare rollback 1
```

### 4. Reverting Changes (Rollback)
```junos
rollback 0    # Discard uncommitted candidate changes
rollback 1    # Revert candidate to previous committed state
show | compare
commit comment "Reverted by AUDIRA Operator"
```

---

## 4. Inspection & Telemetry Commands

| Objective | Junos Operational Command |
| :--- | :--- |
| **System Info & Version** | `show version` |
| **System Uptime & RE Load** | `show system uptime`, `show chassis routing-engine` |
| **Interface Status** | `show interfaces terse` |
| **Extensive Interface Counters** | `show interfaces ge-0/0/0 extensive` |
| **Optical SFP/DDM Power** | `show interfaces diagnostics optics ge-0/0/0` |
| **Routing Table** | `show route exact 0.0.0.0/0`, `show route summary` |
| **BGP Peer Status** | `show bgp summary`, `show bgp neighbor 10.50.1.1` |
| **Commit History & Log** | `show system commit` |
| **Running Config Export** | `show configuration | display set` |

---

## 5. Absolute Safety Guardrails & Blacklist

### CRITICAL - STRICTLY FORBIDDEN FROM AUTONOMOUS EXECUTION:
1. `request system reboot` / `request system halt` / `request system power-off`
2. `request system zeroize` (clears all storage and restores factory state)
3. `load factory-default`
4. `delete interfaces` or `deactivate interfaces` at top hierarchy without filter
5. `delete routing-options` or `delete protocols` (wipes entire routing domain)

### Automation Session Protocol:
Non-interactive SSH terminal sessions must issue:
```junos
set cli screen-length 0
set cli screen-width 0
```
to prevent output pagination from blocking API streams.
