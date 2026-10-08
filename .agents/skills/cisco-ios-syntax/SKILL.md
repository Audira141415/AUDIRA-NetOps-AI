---
name: cisco-ios-syntax
description: Standardized syntax guidelines, CLI command structure, and safety rules for Cisco IOS and IOS-XE network devices.
---

# Cisco IOS & IOS-XE Syntax Guidelines

This skill guides the AI Network Copilot in generating, analyzing, and validating configuration commands for Cisco IOS and IOS-XE routers and switches.

## Common CLI Patterns

### 1. Interface Management
```cisco
interface GigabitEthernet1/0/1
 description UPLINK-TO-CORE-02
 ip address 10.100.1.2 255.255.255.252
 no shutdown
```

### 2. Static Routing & BGP
```cisco
ip route 0.0.0.0 0.0.0.0 10.100.1.1
router bgp 65001
 neighbor 10.100.1.1 remote-as 64512
 neighbor 10.100.1.1 description UPSTREAM-ISP
```

### 3. Inspection & Verification
- System version: `show version`
- Interface summary: `show ip interface brief`
- Routing table: `show ip route`
- Active running config: `show running-config`

## Safety Directives
- **Blacklist**: Under no circumstance issue `reload` or `write erase` autonomously.
- Always use `terminal length 0` in non-interactive SSH sessions to avoid pager freeze.
