---
name: huawei-vrp-syntax
description: Standardized syntax guidelines, CLI command structure, and safety rules for Huawei VRP (Versatile Routing Platform) devices.
---

# Huawei VRP Syntax Guidelines

This skill guides the AI Network Copilot in generating, analyzing, and validating configuration commands for Huawei VRP enterprise routers and switches (CloudEngine, NE routers, S-series switches).

## Common CLI Patterns

### 1. Interface Management
```huawei
system-view
interface GigabitEthernet0/0/1
 description UPLINK-TO-AGG-01
 ip address 10.200.1.2 255.255.255.252
 undo shutdown
quit
```

### 2. Static Routing & BGP
```huawei
system-view
ip route-static 0.0.0.0 0.0.0.0 10.200.1.1
bgp 65001
 peer 10.200.1.1 as-number 64512
 peer 10.200.1.1 description UPSTREAM-ISP
quit
```

### 3. Inspection & Verification
- System version: `display version`
- Interface summary: `display ip interface brief`
- Routing table: `display ip routing-table`
- Active current config: `display current-configuration`

## Safety Directives
- **Blacklist**: Under no circumstance issue `reboot` or `reset saved-configuration` autonomously.
- Always use `screen-length 0 temporary` in non-interactive SSH sessions to avoid pager freeze.
