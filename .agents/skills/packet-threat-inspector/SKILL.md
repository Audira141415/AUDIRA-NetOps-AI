---
name: packet-threat-inspector
description: Real-time traffic inspection using RouterOS Torch and Packet Sniffer streams to detect anomalies, volumetric attacks, port scans, and DDoS floods.
---

# Packet Threat Inspector Skill

This skill guides the AI Network Copilot in analyzing live packet streams, stream counters, protocol ratios, and network sniffing metadata to detect cyber threats.

## Threat Signatures & Detection Logic

### 1. TCP SYN Flood
- **Signature**: High ratio of TCP packets destined to a single IP/port with SYN flag set and negligible corresponding ACK/FIN traffic.
- **Metrics**: PPS > 5,000 on destination port with short packet sizes (40-64 bytes).
- **Mitigation Action**:
  - Implement TCP SYN Cookies: `/ip/settings set tcp-syncookies=yes`
  - Deploy dynamic firewall raw drop rule for repetitive SYN sources.

### 2. DNS Amplification / Reflection Attack
- **Signature**: Inbound or outbound UDP port 53 traffic with packet size > 1024 bytes and disproportionate bandwidth usage.
- **Mitigation Action**:
  - Drop inbound WAN response packets where query was not originated locally.

### 3. Port Scanning & Reconnaissance
- **Signature**: Single source IP sending packets sequentially across multiple destination ports (e.g., 21, 22, 23, 80, 443, 8291, 3389) within seconds.
- **Mitigation Action**:
  - Auto-quarantine the source IP into `port-scanners` address list with `timeout=24h`:
  ```routeros
  /ip/firewall/filter add chain=input protocol=tcp psd=21,3s,3,1 action=add-src-to-address-list address-list=port-scanners address-list-timeout=1d
  /ip/firewall/filter add chain=input src-address-list=port-scanners action=drop
  ```

### 4. Bandwidth Hogger & Torrent / P2P Abusers
- **Signature**: Thousands of concurrent UDP/TCP connection states originating from a single internal client IP.
- **Mitigation Action**:
  - Apply connection limit or queue restriction:
  ```routeros
  /ip/firewall/filter add chain=forward protocol=tcp connection-limit=200,32 action=drop
  ```
