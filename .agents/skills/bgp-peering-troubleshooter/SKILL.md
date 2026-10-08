---
name: bgp-peering-troubleshooter
description: Standard Operating Procedure (SOP) for BGP session diagnostics, flap mitigation, prefix filter validation, route leak prevention, and multi-vendor peering triage across MikroTik RouterOS v7, Cisco IOS-XE, and Huawei VRP.
---

# BGP Peering Troubleshooter & Route Policy Audit Skill

This skill guides the AI Network Copilot through diagnosing BGP session failures, mitigating peering flaps, validating route filters, and preventing route leaks across Enterprise Core and ISP Edge routers.

---

## 1. BGP Finite State Machine (FSM) Triage Matrix

When a BGP session is not in the `Established` state, analyze according to this matrix:

| State | Typical Root Cause | Deterministic Diagnostic Step | Safe Remediation |
| :--- | :--- | :--- | :--- |
| **Idle** | • Admin shutdown<br>• Peer IP unroutable<br>• Local/Remote AS mismatch<br>• TCP 179 blocked | 1. Ping remote peer IP.<br>2. Check routing table for peer IP next-hop.<br>3. Verify input firewall / ACL rules for TCP port 179. | • Verify interface up.<br>• Add static route to peer IP if multihop.<br>• Allow TCP 179 from peer IP in firewall filter. |
| **Connect** | • Waiting for TCP connection<br>• SYN packet dropped by carrier<br>• eBGP Multihop TTL=1 expiry | 1. Execute traceroute to peer IP.<br>2. Inspect eBGP multihop TTL setting.<br>3. Check TCP handshake status (`tcpdump`/Torch port 179). | • Set eBGP multihop TTL >= 2 if peering across loopback or firewall.<br>• Check update-source interface IP. |
| **Active** | • TCP connection attempt failed<br>• Peer not listening on port 179<br>• NAT/Firewall altering port | 1. Test TCP port 179 reachability.<br>2. Verify peer router BGP process is running.<br>3. Inspect asymmetric routing between peers. | • Ensure peer router has matching `remote-as` and IP.<br>• Fix update-source / loopback binding. |
| **OpenSent** | • Local BGP OPEN sent, waiting for peer<br>• BGP version mismatch<br>• Autonomous System mismatch | 1. Inspect log for `BGP OPEN received with wrong AS`.<br>2. Check BGP 4-byte AS capability negotiation. | • Correct local/remote AS numbers.<br>• Ensure peer supports 32-bit AS if using AS > 65535. |
| **OpenConfirm** | • Waiting for peer KEEPALIVE<br>• Hold-timer mismatch<br>• Router-ID collision | 1. Check if both routers share identical Router-ID.<br>2. Verify hold-timer vs keepalive-timer ratio. | • Assign unique 32-bit Router-ID (`/routing/bgp/template` or `bgp router-id`).<br>• Align hold-time (recommended: 90s hold, 30s keepalive). |
| **Flapping from Established** | • MTU mismatch on large UPDATEs<br>• CPU exhaustion dropping keepalives<br>• Route flap damping triggered | 1. Compare interface MTU (e.g. 1500 vs 1492).<br>2. Inspect CPU utilization on peer routers.<br>3. Check BGP notification code (e.g., Hold Timer Expired). | • Match MTU or enable path MTU discovery.<br>• Tune keepalive/hold timer (e.g. 60s/180s on congested links). |

---

## 2. Multi-Vendor Diagnostic Commands

### A. MikroTik RouterOS v7
```routeros
# 1. Inspect BGP session state and uptime
/routing/bgp/session/print detail

# 2. Check connection parameters and timers
/routing/bgp/connection/print detail

# 3. View received and advertised prefix counts
/routing/bgp/session/print stats

# 4. View active routes learned from specific BGP peer
/routing/route/print where bgp and gateway="<PEER_IP>"

# 5. Check real-time BGP logs
/log/print where topics~"bgp"
```

### B. Cisco IOS & IOS-XE
```cisco
# 1. Summary of all BGP neighbors and prefix counts
show ip bgp summary
show bgp ipv4 unicast summary

# 2. Detailed neighbor inspection and state change history
show ip bgp neighbors <PEER_IP>

# 3. Inspect received and advertised routes (requires soft-reconfig)
show ip bgp neighbors <PEER_IP> routes
show ip bgp neighbors <PEER_IP> advertised-routes

# 4. Check route-map and prefix-list filters
show route-map
show ip prefix-list
```

### C. Huawei VRP
```huawei
# 1. Summary of BGP peers and states
display bgp peer
display bgp ipv4-unicast peer

# 2. Detailed neighbor diagnostic
display bgp peer <PEER_IP> verbose

# 3. View learned and advertised routes
display bgp routing-table peer <PEER_IP> received-routes
display bgp routing-table peer <PEER_IP> advertised-routes

# 4. Check routing policies and filters
display route-policy
display ip ip-prefix
```

---

## 3. Route Leak & Hijack Defense Guidelines

1. **Strict Maximum Prefix Limits**:
   - Always enforce `max-prefix` to prevent upstream/downstream memory exhaustion (a full internet table is ~950,000+ routes).
   - Set warning threshold at 80% and auto-restart at 15 minutes.
   - **RouterOS v7**: `/routing/bgp/connection set [find name=peer1] input.max-prefix=1000`
   - **Cisco**: `neighbor <PEER_IP> maximum-prefix 1000 80 restart 15`
   - **Huawei**: `peer <PEER_IP> route-limit 1000 80 alert-only`

2. **Bogon & Private IP Filtering (Martians)**:
   - Reject the following destination prefixes on eBGP transit and peer sessions:
     - `0.0.0.0/8` (This network)
     - `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16` (RFC 1918 Private)
     - `127.0.0.0/8` (Loopback)
     - `169.254.0.0/16` (Link-Local)
     - `224.0.0.0/4` (Multicast)
     - `240.0.0.0/4` (Reserved)
     - Prefixes longer than `/24` for IPv4 or longer than `/48` for IPv6.

3. **RPKI Origin Validation (Route Origin Authorization - ROA)**:
   - When RPKI cache server (e.g. Routinator, StayRTR) is connected:
     - State `Valid`: Accept with normal local-preference.
     - State `NotFound`: Accept with lower local-preference (e.g. 90).
     - State `Invalid`: **STRICT DROP** (Drop invalid routes to eliminate prefix hijacking).

---

## 4. Remediation & Operational Procedures

### Flapping Peer Damping
When a BGP neighbor flaps more than 3 times within 10 minutes:
1. Temporarily dampen or demote peer local-preference:
   - Inbound: Set `local-preference 50` so traffic shifts gracefully to redundant transit upstream.
   - Outbound: Prepend local AS 3 times (`set as-path-prepend <MY_ASN> <MY_ASN> <MY_ASN>`) to steer return traffic away.
2. Verify if memory and CPU on the router can handle routing churn.
3. Once link stability is confirmed for 30 minutes, restore default local-preference.

### Safe Route Refresh (Zero Downtime)
- **NEVER** issue hard reset (`clear ip bgp *` or disable/enable connection) on production core routers.
- Always perform soft reconfiguration:
  - **RouterOS v7**: `/routing/bgp/session/refresh`
  - **Cisco**: `clear ip bgp <PEER_IP> soft in`
  - **Huawei**: `refresh bgp <PEER_IP> import`

---

## 5. Risk Assessment Classification
- **LOW**: Diagnostic queries (`show ip bgp summary`, `/routing/bgp/session/print`).
- **MEDIUM**: Soft-reconfiguration in/out, adjusting routing filter rules, updating prefix-list.
- **CRITICAL**: Hard BGP session reset (`clear ip bgp`), disabling BGP connection, modifying local-AS or router-id. Requires dual-operator sign-off.
