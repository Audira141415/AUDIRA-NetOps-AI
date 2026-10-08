---
name: firewall-safety-audit
description: Security posture verification, open port vulnerability auditing, and rule validation for router firewalls and access control lists.
---

# Firewall Safety & Compliance Audit Skill

This skill performs systematic security audits of network devices to identify misconfigurations, unauthenticated exposed services, and security compliance violations.

## Audit Checklist

### 1. Insecure Service Exposure
- **Vulnerabilities**:
  - Telnet (TCP 23) active without IP restriction.
  - FTP (TCP 21) enabled.
  - Web GUI (HTTP TCP 80) exposed to WAN instead of HTTPS (443) or management VLAN.
  - MikroTik API (TCP 8728) unencrypted instead of API-SSL (TCP 8729).
  - WinBox (TCP 8291) exposed to public internet without address-list whitelist.
- **Recommended Remediation**:
  ```routeros
  /ip/service set telnet disabled=yes
  /ip/service set ftp disabled=yes
  /ip/service set api disabled=yes
  /ip/service set winbox address=10.0.0.0/8,172.16.0.0/12,192.168.0.0/16
  ```

### 2. DNS Open Resolver Check
- Verify whether `allow-remote-requests=yes` is set on routers with public WAN IPs.
- If true, ensure WAN interface firewall rule explicitly blocks incoming UDP/TCP port 53:
  ```routeros
  /ip/firewall/filter add chain=input in-interface-list=WAN protocol=udp dst-port=53 action=drop comment="Block WAN DNS recursion"
  ```

### 3. Default Admin Credentials & User Hardening
- Audit for existence of default `admin` user without strong password.
- Enforce public-key SSH authentication or separate named operator accounts with limited group policies (`read`, `write`, `full`).

### 4. FastTrack vs Content Inspection
- Validate that FastTrack rule (`action=fasttrack-connection`) does not bypass critical inspection for sensitive or segregated guest subnets.
