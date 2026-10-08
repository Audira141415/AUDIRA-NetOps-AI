---
name: mpls-vpls-segment-routing-troubleshooter
description: Standard Operating Procedure (SOP) for MPLS LDP peering, VPLS pseudowire triage, MTU blackhole mitigation, and Segment Routing (SR-MPLS) path diagnostics across MikroTik RouterOS v7, Cisco IOS-XE, Huawei VRP, and Juniper Junos.
---

# MPLS, VPLS & Segment Routing Troubleshooter

This skill guides the AI Network Copilot through diagnosing MPLS Label Distribution Protocol (LDP) adjacencies, troubleshooting Layer 2 VPLS/EVPN pseudowire down events, mitigating MPLS MTU fragmentation blackholes, and verifying Segment Routing (SR-MPLS) Label Switched Paths (LSP).

---

## 1. MPLS & VPLS Core Failure Triage Matrix

When an MPLS LSP or VPLS pseudowire degrades, execute root cause triage according to this matrix:

| Failure Signature | Probable Root Cause | Deterministic Diagnostic Step | Safe Remediation |
| :--- | :--- | :--- | :--- |
| **LDP Peer Down / Stuck in Non-Existent** | • UDP port 646 hello dropped by firewall<br>• LDP transport-address unroutable in IGP<br>• Loopback /32 missing in OSPF/IS-IS | 1. Ping remote LDP transport address.<br>2. Check IGP routing table for loopback reachability.<br>3. Inspect ACL/firewall for UDP & TCP port 646. | • Ensure loopback /32 is advertised in IGP (OSPF/IS-IS).<br>• Set LDP transport-address to local loopback0.<br>• Allow UDP/TCP 646 between PE routers. |
| **VPLS Pseudowire Down (VC Down / Stalled)** | • VC-ID mismatch between PEs<br>• Signaled MTU mismatch (PE1 != PE2)<br>• Missing Control Word negotiation<br>• Targeted LDP session down | 1. Compare signaled vs received MTU.<br>2. Verify VC-ID match on both PE endpoints.<br>3. Inspect tLDP session state.<br>4. Check control word parameter consistency. | • Align VC-ID and pseudowire ID.<br>• Set matching pseudowire MTU (or enable ignore MTU if supported).<br>• Synchronize control word (`control-word=yes/no`). |
| **MPLS MTU Blackhole (LDP UP, Traffic Dropped)** | • Core link MTU < 1530 bytes<br>• Carrier frame drop without ICMP reply<br>• Double label imposition exceeding physical MTU | 1. Ping with DF-bit set (`dont-fragment`) and size 1500 across MPLS path.<br>2. Inspect L2MTU and MPLS MTU on all transit P routers. | • Increase physical link MTU on core trunks to 9000 (Jumbo Frame) or minimum 1536.<br>• Match L2MTU across all switches and optical links. |
| **LDP-IGP Synchronization Flap** | • IGP reconverged before LDP label binding<br>• Traffic forwarded before LSP established | 1. Inspect LDP-IGP sync status on IGP interfaces.<br>2. Check for micro-loops during link restore. | • Enable `mpls ldp sync` in OSPF/IS-IS.<br>• Increase IGP hold-max-metric timer during boot. |
| **SR-MPLS SID Collision or Unresolved** | • Duplicate Prefix-SID assigned in SRGB<br>• SRGB range mismatch between vendors<br>• IS-IS/OSPF SR extensions disabled | 1. Inspect SRGB block bounds across vendors.<br>2. Check routing logs for `duplicate SID error`. | • Allocate non-overlapping SID index per router-id.<br>• Standardize SRGB range (e.g. 16000–23999). |

---

## 2. Multi-Vendor Diagnostic Commands

### A. MikroTik RouterOS v7
```routeros
# 1. Inspect LDP neighbor discovery and sessions
/mpls/ldp/neighbor/print detail
/mpls/ldp/session/print detail

# 2. Check label forwarding table (LFIB)
/mpls/forwarding-table/print

# 3. View VPLS pseudowire operational state & signaled MTU
/interface/vpls/print detail
/interface/vpls/monitor [find] once

# 4. MPLS Traceroute to verify label stack
/tool/traceroute <TARGET_IP> use-mpls=yes

# 5. Check MPLS MTU and physical interface L2MTU
/interface/print stats-detail where type~"ether"
```

### B. Cisco IOS & IOS-XE
```cisco
# 1. LDP Neighbor and session verification
show mpls ldp neighbor
show mpls ldp discovery

# 2. Label Forwarding Information Base (LFIB)
show mpls forwarding-table

# 3. L2VPN / VPLS Pseudowire detailed state
show xconnect all
show l2vpn atom vc detail
show mpls l2transport vc detail

# 4. Trace MPLS Label Switched Path
traceroute mpls ipv4 <TARGET_LOOPBACK>/32

# 5. Segment Routing MPLS Label Blocks & SIDs
show segment-routing mpls lb
show segment-routing mpls connected-prefix-sid-map
```

### C. Huawei VRP
```huawei
# 1. LDP peer and session state
display mpls ldp peer
display mpls ldp session verbose

# 2. MPLS Label Switched Path (LSP) table
display mpls lsp
display mpls lsp verbose

# 3. VPLS Connection and pseudowire details
display vpls connection
display l2vpn pw-info detail
display vpls mac-address

# 4. MPLS LSP Traceroute
tracert lsp ipv4 <TARGET_LOOPBACK> 32
```

### D. Juniper Junos OS
```junos
# 1. LDP neighbor and session status
show ldp neighbor
show ldp session detail

# 2. MPLS LSP and forwarding table (mpls.0)
show route table mpls.0
show mpls lsp detail

# 3. VPLS Connections & Pseudowire status
show vpls connections
show vpls connections extensive

# 4. MPLS Traceroute across LDP path
traceroute mpls ldp <TARGET_LOOPBACK>/32
```

---

## 3. MTU Calculation Formula for Core Trunks

To prevent silent packet drops and blackholes when encapsulating Layer 2 Ethernet payloads over MPLS/VPLS:

```
Total Minimum Core MTU = Customer Payload (1500)
                       + Ethernet Header (14)
                       + 802.1Q VLAN Tag (4)
                       + Control Word (4)
                       + MPLS Service Label (4)
                       + MPLS Transport Label (4)
                       = 1530 Bytes
```

> **NOC Golden Rule**: Configure `MTU >= 1536` (Recommended: **Jumbo Frames `9000`**) across all Provider (P) core trunks, switch VLANs, and optical muxes.

---

## 4. Safety Directives & Change Governance

1. **Change Freeze Compliance**: Restarting LDP processes or rebuilding VPLS mesh teardowns is classified as **HIGH / CRITICAL** risk and MUST NOT occur during Peak Freeze (08:00–22:00 WIB) without an Emergency Break-Glass ticket.
2. **Pre-flight Backup**: Always execute `/export compact` or `show configuration | display set` before modifying VPLS interface settings or LDP parameters.
3. **No Autonomous Core Flap**: Never execute `no mpls ldp` or `/mpls/ldp/set enabled=no` autonomously.
