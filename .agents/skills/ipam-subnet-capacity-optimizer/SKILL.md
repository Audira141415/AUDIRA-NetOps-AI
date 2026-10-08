---
name: ipam-subnet-capacity-optimizer
description: Standard Operating Procedure (SOP) for IP address management, VLSM hierarchical subnet planning, CIDR overlap detection, DHCP lease pool exhaustion triage, and IPv6 prefix (/64 & /48) allocation across enterprise networks.
---

# IPAM, Subnet Capacity & DHCP Pool Optimization Skill

This skill guides the AI Network Copilot through hierarchical IP Address Management (IPAM), Variable Length Subnet Mask (VLSM) allocation, CIDR overlap detection, and DHCP pool saturation remediation across enterprise core, distribution, and access tiers.

---

## 1. Enterprise IP Allocation Hierarchy

AUDIRA NetOps AI enforces structured hierarchical address partitioning to prevent routing table bloat, route leaks, and overlapping address collisions:

### A. IPv4 Hierarchy Standard (RFC 1918 & RFC 6598)
| Tier / Usage | Recommended CIDR | Usable Hosts | Application / Scope |
| :--- | :--- | :--- | :--- |
| **Tier-1 Regional Supernet** | `/16` – `/18` | 16,382 – 65,534 | Summary route for Datacenter / Regional Campus |
| **Tier-2 Distribution POP** | `/20` – `/22` | 1,022 – 4,094 | Aggregation switch cluster, Core VRF domain |
| **Tier-3 Access VLAN (Office)**| `/24` | 254 | Staff workstation VLAN, Corporate WiFi |
| **Tier-3 High Density WiFi** | `/22` – `/23` | 510 – 1,022 | Public WiFi, Auditorium, Convention event spaces |
| **Server DMZ / Critical Core**| `/27` – `/28` | 14 – 30 | Production DB, NMS, DNS/NTP infrastructure |
| **Point-to-Point Uplinks** | `/30` or `/31` | 2 | Router-to-router interconnection trunks (RFC 3021) |
| **Router Loopback / Router-ID**| `/32` | 1 | Unnumbered BGP peering, OSPF Router-ID, MPLS transport |
| **CGNAT Broadband (RFC 6598)**| `100.64.0.0/10` | 4,194,302 | Residential ISP customer CPE WAN termination |

### B. IPv6 Hierarchy Standard (RFC 4291)
- **`/32` or `/40`**: Global Carrier / ISP Allocation from RIR (APNIC/IDNIC).
- **`/48`**: Enterprise Site / Customer Organization allocation.
- **`/56`**: Small Business / Branch Office site.
- **`/64`**: Standard End-User Subnet (SLAAC auto-configuration & DHCPv6-PD).

---

## 2. CIDR Collision & Overlap Triage Matrix

When a new network or interface address is proposed, the agent must execute collision analysis:

| Anomaly Type | Symptom / Consequence | Root Cause | Deterministic Resolution |
| :--- | :--- | :--- | :--- |
| **Direct CIDR Overlap** | Packets routed to wrong interface, asymmetric drop | Two interfaces configured with identical or superset subnet | Re-index subnet using next available unallocated CIDR block. |
| **Secondary IP Mask Mismatch** | ARP broadcast storm, partial host unreachable | Primary IP has `/24`, secondary has `/26` overlapping | Align subnet masks or segregate into dedicated 802.1Q VLANs. |
| **Point-to-Point /30 Waste** | IP address space exhausted rapidly in large backbones | Using `/24` or `/28` for 2-router point-to-point links | Migrate P2P links to `/31` (RFC 3021) or unnumbered loopback. |
| **Default Gateway Split-Brain** | Hosts intermittently drop connectivity | Two routers advertising same VIP without VRRP/HSRP | Configure VRRP priority and virtual IP with unique master. |

---

## 3. DHCP Pool Exhaustion & Saturation SOP

When a DHCP server nears capacity, follow this deterministic escalation ladder:

### Saturation Thresholds:
1. **75% Used (Warning - Amber)**:
   - Calculate lease churn rate.
   - If lease duration is default (e.g. 24h–72h) on high-turnover guest WiFi, reduce lease time to `1h` or `2h`.
2. **90% Used (High Alert - Orange)**:
   - Purge abandoned and expired dynamic leases (`/ip/dhcp-server/lease remove [find status=expired]`).
   - Check for MAC spoofing floods or DHCP starvation attacks (rogue devices burning pool addresses).
3. **98%–100% Used (CRITICAL - Red)**:
   - New client associations fail; operating systems fall back to `169.254.x.x` (APIPA).
   - Expand subnet boundary (e.g., expand `/24` to `/23`) or assign a secondary non-overlapping pool range.
   - Activate DHCP Snooping to block rogue DHCP servers offering conflicting addresses.

---

## 4. Multi-Vendor Audit & Inspection Commands

### A. MikroTik RouterOS v7
```routeros
# 1. Inspect configured IP addresses across all interfaces
/ip/address/print detail

# 2. View DHCP pools and utilization
/ip/pool/print detail
/ip/pool/used/print

# 3. View active DHCP server status and lease statistics
/ip/dhcp-server/print detail
/ip/dhcp-server/lease/print count-only where dynamic and status=bound

# 4. Check for rogue DHCP servers detected on network
/ip/dhcp-server/alert/print
```

### B. Cisco IOS & IOS-XE
```cisco
# 1. Summary of IP addresses and interface states
show ip interface brief

# 2. Inspect DHCP pool utilization and free addresses
show ip dhcp pool
show ip dhcp binding count

# 3. View conflicting IP addresses detected by ping-probe
show ip dhcp conflict

# 4. Check DHCP Snooping database for trusted uplinks
show ip dhcp snooping binding
```

### C. Huawei VRP
```huawei
# 1. Display interface IP configuration
display ip interface brief

# 2. Inspect DHCP server IP pools and free host counts
display ip pool
display ip pool name <POOL_NAME>

# 3. View IP conflicts and expired leases
display dhcp server conflict all
display dhcp server statistics
```

### D. Juniper Junos OS
```junos
# 1. Interface IP addresses summary
show interfaces terse

# 2. DHCP server pool utilization
show system services dhcp pool
show dhcp server binding

# 3. DHCP server packet counters and drop statistics
show dhcp server statistics
```

---

## 5. High-Risk Safety Mandates for IP Alterations

1. **Management Interface Lockout Prevention**:
   - Modifying the IP address or subnet mask on the interface handling the current active SSH/API session drops connectivity immediately.
   - Never change management interface IP without:
     - Secondary console / out-of-band connectivity.
     - MikroTik: Wajib menggunakan **Safe Mode** (`Ctrl+X`).
     - Junos: Wajib menggunakan **`commit confirmed 5`**.
2. **Change-Freeze Compliance**:
   - Subnet re-addressing and gateway IP modifications are classified as **HIGH** risk.
   - Blocked during Peak Change-Freeze (08:00–22:00 WIB) unless an Emergency Break-Glass ticket is validated.
