---
name: alert-storm-correlation-rca
description: Standard Operating Procedure (SOP) for AIOps alert storm deduplication, topology-aware event correlation, derivative alert suppression, and root cause analysis (RCA).
---

# Alert Storm Deduplication & Topology-Aware Root Cause Analysis (RCA)

This skill guides the AI Network Copilot through suppressing alarm floods (Alert Storms), performing automated Root Cause Analysis (RCA), and calculating blast radiuses across carrier and enterprise network backbones.

---

## 1. The Alert Storm Challenge in Carrier NOCs

When a single fiber cut, core switch reboot, or optical laser failure occurs, a cascade of dependent alarms triggers within milliseconds across all monitoring layers:

```
[Underlying Incident: Core Fiber Cut on xe-0/0/0]
         │
         ├── (Layer 1) OPTICAL_LOS (Loss of Signal) ➔ Alert #1
         ├── (Layer 2) INTERFACE_DOWN (xe-0/0/0)    ➔ Alert #2
         │
         ├── (Layer 3) OSPF_NEIGHBOR_DOWN           ➔ Alert #3
         ├── (Layer 3) BGP_SESSION_DOWN (Transit-1) ➔ Alert #4
         ├── (Layer 3) BGP_SESSION_DOWN (Transit-2) ➔ Alert #5
         │
         ├── (Layer 4) VPLS_PW_DOWN (Customer-A)    ➔ Alert #6
         ├── (Layer 4) VPLS_PW_DOWN (Customer-B)    ➔ Alert #7
         └── (Layer 7) PING_PROBE_TIMEOUT (50 nodes)➔ Alerts #8..#58
```

Without automated correlation, NOC engineers face cognitive overload, misdiagnosing symptoms (e.g. attempting to troubleshoot BGP timers) instead of addressing the physical fiber cut.

---

## 2. The 4 Deduplication & Correlation Principles

AUDIRA NetOps AI applies a 4-tier correlation algorithm to collapse 100+ alarms into **1 Actionable Root Cause Incident**:

### Principle 1: Temporal Proximity Sliding Window
- Alerts arriving within a $\Delta t = 45\text{ seconds}$ sliding window on topologically adjacent devices are automatically grouped into a single correlation cluster.

### Principle 2: Strict OSI Layer Causality (Parent-Child Hierarchy)
Lower-layer failures are mathematically modeled as parents of upper-layer failures:
$$\text{Optical/Hardware (L1)} \succ \text{Interface/L2} \succ \text{IGP Routing (L3)} \succ \text{BGP/MPLS Overlays} \succ \text{SaaS/ICMP Reachability}$$
*If an `INTERFACE_DOWN` or `OPTICAL_LOS` alarm exists on interface $X$, all subsequent $L3/L4/L7$ alarms traversing interface $X$ are declared **Derivative Symptoms** and suppressed.*

### Principle 3: Topological Dependency Propagation
- If Core Router $R_1$ goes unreachable, do not alert for the 20 downstream Access Switches homed exclusively behind $R_1$. Mark them as `UNREACHABLE_DUE_TO_PARENT_OUTAGE`.

### Principle 4: Flap Dampening & Hysteresis
- If an interface flaps 3 times within 60 seconds, suppress individual UP/DOWN alarms and emit a single `CIRCUIT_FLAPPING_DAMPENED` alert with 180-second hold-down.

---

## 3. Incident Severity & Impact Radius Matrix

| Root Cause Category | Typical Primary Alarm | Suppressed Derivative Alarms | Blast Radius Metrics |
| :--- | :--- | :--- | :--- |
| **Fiber / Optical Cut** | `OPTICAL_POWER_LOSS` or `CARRIER_DETECT_LOST` | Interface down, OSPF neighbor down, BGP flap, VPLS drop | Downstream POPs, affected circuit IDs, aggregated traffic loss (Gbps) |
| **Core Node Power Loss** | `DEVICE_UNREACHABLE` (Core Switch/Router) | All connected downstream peer drops, SNMP timeouts | Entire regional campus or datacenter zone |
| **BGP Route Flap / Leak** | `BGP_PREFIX_COUNT_SPIKE` or `PREFIX_WITHDRAWN` | Latency spike, packet drops, asymmetry timeout | External customer transit prefixes, IXP peers |
| **DHCP Pool Saturation** | `DHCP_POOL_EXHAUSTED` (100% leased) | Client APIPA (169.254.x.x), ARP storm, Gateway timeouts | Connected end-user stations, VLAN ID |

---

## 4. Multi-Vendor Diagnostic Verification

### A. MikroTik RouterOS v7
```routeros
# 1. Verify if optical loss preceded interface drop
/interface/ethernet/monitor [find name="<IFACE>"] once

# 2. Check link state transition logs with microsecond timestamps
/log/print where topics~"interface" or topics~"link"

# 3. View routing adjacency failure timestamps
/log/print where topics~"bgp" or topics~"ospf"
```

### B. Cisco IOS & IOS-XE
```cisco
# 1. View chronologically ordered syslog buffer
show logging | include (LINK-3-UPDOWN|LINEPROTO-5-UPDOWN|BGP-5-ADJCHANGE)

# 2. Inspect optical transceiver alarm thresholds
show interfaces <IFACE> transceiver detail
```

### C. Huawei VRP
```huawei
# 1. View alarm buffer in chronological order
display alarm active
display logbuffer | include (IFNET|BGP|OSPF)

# 2. Check optical power and hardware status
display optical-information verbose
```

### D. Juniper Junos OS
```junos
# 1. View system messages for interface link state
show log messages | match "(SNMP_TRAP_LINK_DOWN|RPD_BGP_NEIGHBOR_STATE)"

# 2. Inspect optical DDM diagnostics
show interfaces diagnostics optics <IFACE>
```

---

## 5. Automated Triage Workflow for AI Copilot

```
Incoming Stream of Alerts (Alert Storm)
               │
               ▼
[AlertCorrelationEngine: correlateAlerts]
               │
               ├── 1. Slide window clustering (45s window)
               ├── 2. Topological parent-child tree mapping
               ├── 3. Determine lowest OSI layer failure
               │
               ▼
┌────────────────────────────────────────────────────────┐
│ 🎯 ROOT CAUSE INCIDENT IDENTIFIED                      │
│ Primary: [CRITICAL] Optical Signal Loss on xe-0/0/0    │
│ Suppressed Symptoms: 14 derivative BGP/VPLS/Ping drops │
│ Confidence Score: 96%                                  │
│ Impact Radius: 3 POPs, 4,200 estimated subscribers     │
└────────────────────────────────────────────────────────┘
               │
               ▼
[NOC Remediation Action]
1. Suppress derivative notifications to Slack/Discord.
2. Broadcast single consolidated ticket: INC-CORE-FIBER-CUT.
3. Automatically trigger alternate routing detour if available.
```
