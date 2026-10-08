---
name: compliance-security-benchmark-audit
description: Standard Operating Procedure (SOP) for enterprise router hardening, CIS Benchmark verification, CVE vulnerability assessment, SNMPv3 USM migration, legacy cipher deprecation, and automated remediation.
---

# Enterprise Security Compliance & Hardening Benchmark Skill

This skill guides the AI Network Copilot through executing automated security posture audits against the Center for Internet Security (CIS) Network Device Benchmark, identifying critical vulnerabilities, evaluating Common Vulnerabilities and Exposures (CVE), and generating verified hardening remediation scripts across multi-vendor fleets.

---

## 1. Compliance Audit Matrix & Severity Scoring

Every managed network device is scored across 4 foundational security domains:

| Check Item | Domain | Severity | Vulnerability Impact | Deterministic Remediation |
| :--- | :--- | :--- | :--- | :--- |
| **Insecure Telnet Protocol (TCP 23)** | Service Hardening | **CRITICAL** | Cleartext credential interception via packet sniffing | Disable Telnet service; enforce SSHv2 only. |
| **Cleartext HTTP Web Management (TCP 80)** | Service Hardening | **CRITICAL** | Session hijacking, CSRF, and plain credential leak | Disable HTTP; require HTTPS/API-SSL with valid TLS cert. |
| **WAN DNS Open Resolver Exposure (UDP 53)** | Firewall Policy | **CRITICAL** | Router weaponized in external UDP amplification DDoS | Drop DNS queries on WAN interfaces in firewall filter. |
| **Default Vendor Account ("admin" in full)** | Access Control | **HIGH** | Vulnerable to brute-force credential stuffing | Provision named admin accounts; disable default user. |
| **Unencrypted Management API (Port 8728)** | Service Hardening | **HIGH** | Unprotected automation API streams without TLS | Disable plain API; enforce API-SSL (Port 8729). |
| **Legacy Weak SSH Ciphers (3DES, CBC, arcfour)**| Access Control | **HIGH** | Susceptible to SWEET32 and cipher downgrade attacks | Enforce `strong-crypto` (AES-GCM, ChaCha20-Poly1305). |
| **SNMPv1 / SNMPv2c Plain Community Strings** | Access Control | **HIGH** | Read/write communities sniffed across transit links | Deprecate SNMPv1/v2c; migrate to SNMPv3 USM with SHA/AES. |
| **Firmware CVSS >= 7.5 Unpatched CVEs** | Firmware CVE | **MEDIUM** | Remote code execution or privilege escalation exploit | Check vendor patch bulletin; schedule OS upgrade in MW. |
| **Unsynchronized NTP / Time Drift** | Service Hardening | **MEDIUM** | Forensics failure; invalid TLS handshake certificates | Configure redundant authenticated NTP servers. |
| **Lack of Login Failure Brute-force Shield** | Access Control | **MEDIUM** | Dictionary attack saturation against management ports | Configure fail2ban / blackhole address-list on 3 retries. |

---

## 2. Multi-Vendor Hardening Commands

### A. MikroTik RouterOS v7
```routeros
# 1. Disable all unencrypted services (Telnet, FTP, HTTP, plain API)
/ip/service/set [find name=telnet] disabled=yes
/ip/service/set [find name=ftp] disabled=yes
/ip/service/set [find name=http] disabled=yes
/ip/service/set [find name=api] disabled=yes

# 2. Enable API-SSL on secure port 8729
/ip/service/set [find name=api-ssl] disabled=no port=8729

# 3. Enforce modern SSH cryptography (disables weak CBC and small DH groups)
/ip/ssh/set strong-crypto=yes forwarding-enabled=no

# 4. Block WAN DNS Recursion (Amplification DDoS prevention)
/ip/firewall/filter add chain=input in-interface-list=WAN protocol=udp dst-port=53 action=drop comment="CIS-01: Drop WAN DNS Recursion"
/ip/firewall/filter add chain=input in-interface-list=WAN protocol=tcp dst-port=53 action=drop comment="CIS-01: Drop WAN DNS TCP"

# 5. Restrict SSH access to trusted NOC management prefixes only
/ip/firewall/filter add chain=input protocol=tcp dst-port=22 connection-state=new src-address-list=!NOC_MANAGEMENT action=drop comment="CIS-02: Drop Untrusted SSH"

# 6. Deprecate SNMP v1/v2c and configure SNMPv3 USM
/snmp/community/remove [find name=public]
/snmp/set enabled=yes trap-version=3
```

### B. Cisco IOS & IOS-XE
```cisco
# 1. Disable cleartext Telnet and HTTP
no ip http server
ip http secure-server
line vty 0 15
 transport input ssh
 exit

# 2. Enforce SSHv2 and high-grade ciphers
ip ssh version 2
ip ssh server algorithm encryption aes256-gcm aes128-gcm
ip ssh dh min 2048

# 3. Control Plane Protection (CoPP) rate-limiting for ICMP and Telnet
class-map match-any CRITICAL-MGMT
 match access-group name MGMT-ACL
policy-map COPP-POLICY
 class CRITICAL-MGMT
  police 8000000 conform-action transmit exceed-action drop

# 4. Migrate to SNMPv3 USM with SHA-256 Authentication and AES-256 Encryption
snmp-server group NOC_ADMIN_GRP v3 priv
snmp-server user noc-operator NOC_ADMIN_GRP v3 auth sha AuthSecret2026 priv aes 256 PrivSecret2026
```

### C. Huawei VRP
```huawei
# 1. Disable insecure protocols
undo telnet server enable
undo http server enable
undo ftp server

# 2. Secure STelnet (SSH) configuration
stelnet server enable
ssh server cipher aes256_gcm
ssh server key-exchange dh_group14_sha256

# 3. SNMPv3 USM Configuration
undo snmp-agent sys-info version v1 v2c
snmp-agent sys-info version v3
snmp-agent group v3 NOC_GROUP privacy
```

### D. Juniper Junos OS
```junos
# 1. Disable cleartext management
delete system services telnet
delete system services web-management http

# 2. Modern SSH hardening
set system services ssh protocol-version v2
set system services ssh ciphers aes256-gcm@openssh.com
set system services ssh ciphers chacha20-poly1305@openssh.com
set system services ssh macs hmac-sha2-512

# 3. Protect Control Plane against DNS recursion & unauthorized access
set firewall family inet filter PROTECT-RE term BLOCK-WAN-DNS from destination-port domain
set firewall family inet filter PROTECT-RE term BLOCK-WAN-DNS then discard
set interfaces lo0 unit 0 family inet filter input PROTECT-RE
```

---

## 3. Posture Score Calculation Formula

$$\text{Security Posture Score (\%)} = \left(\frac{\text{Passed Checks}}{\text{Total Audit Checks}}\right) \times 100$$

- **Grade A (90% – 100%)**: Enterprise Compliant. Zero Critical/High vulnerabilities.
- **Grade B (75% – 89%)**: Acceptable. Minor medium-risk configurations present.
- **Grade C / D (< 75%)**: Non-Compliant. Immediate automated remediation required.

---

## 4. 1-Click Remediation & Safety Safeguards

1. **Pre-flight Snapshot Mandate**: Before applying any remediation script, the platform automatically generates `/export compact` with SHA256 verification.
2. **Management Access Protection**: NEVER disable Telnet without active verified SSH access.
3. **Change-Freeze Compliance**: Applying firewall rule additions or port shutdowns during peak hours (08:00–22:00 WIB) requires an authorized Emergency Break-Glass ticket.
