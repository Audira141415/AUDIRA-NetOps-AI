---
name: noc-incident-triage
description: Standard Operating Procedure (SOP) for triage, root-cause analysis, and mitigation of NOC network degradation, link drops, BGP flaps, and high CPU events.
---

# NOC Incident Triage & Root Cause Analysis Skill

This skill guides the AI Network Copilot through rigorous, deterministic diagnostic procedures when network anomalies or threshold breaches are detected.

## Incident Workflows

### 1. High CPU Utilization (> 85%)
1. **Gather Profile**:
   - Query `/tool/profile` to determine which process subsystem is consuming cycles (e.g., `firewall`, `routing`, `queuing`, `management`).
2. **Examine Interface Drops & PPS**:
   - If `firewall` or `networking` is high, inspect interface packet-per-second (PPS) rates for DDoS or broadcast storms.
3. **Formulate Mitigation**:
   - Enable FastTrack for established connections if bypassed.
   - Quarantine attacking IPs to a temporary `drop-blacklist` address list with a timeout.

### 2. Uplink Packet Loss & Latency Spikes
1. **Hop-by-Hop Ping & Traceroute**:
   - Execute ping to upstream gateway, next-hop, and public authoritative DNS (`1.1.1.1`, `8.8.8.8`).
2. **Interface Error Counters**:
   - Inspect physical interface link stats (`rx-drop`, `rx-error`, `tx-drop`, `link-downs`).
   - If link-downs counter is incrementing, flag potential SFP module degradation or physical cable flap.
3. **Bandwidth Saturation Check**:
   - Correlate packet loss with queue drops or interface bandwidth hitting 100% committed information rate (CIR).

### 3. BGP / OSPF Peering Flap
1. **Session State Verification**:
   - Check connection uptime, received prefix count, and last state change.
2. **MTU Mismatch Inspection**:
   - Verify if MTU matches across peer interfaces (common cause of OSPF stuck in `ExStart` or BGP disconnects during full route exchange).
3. **Hold-Timer Expiry**:
   - Check keepalive vs hold-timer ratios and ensure CPU load on the peer router is not dropping keepalive packets.

## Response Formatting Protocol
- Always present findings in clear NOC structured format:
  1. **Severity Assessment**: `CRITICAL` | `WARNING` | `INFORMATIONAL`
  2. **Root Cause Hypothesis**: Backed by measured tool outputs.
  3. **Proposed Remediation**: Visual diff or exact command with rollback plan.
  4. **Risk Classification**: `LOW`, `MEDIUM`, or `HIGH`.
