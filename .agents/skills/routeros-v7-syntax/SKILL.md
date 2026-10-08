---
name: routeros-v7-syntax
description: Standardized syntax guidelines, API endpoints, and validation rules for MikroTik RouterOS v7 configurations and CLI commands.
---

# RouterOS v7 Syntax & Validation Skill

This skill defines the technical rules, command changes, and best practices for generating and validating MikroTik RouterOS v7 CLI commands and REST/SSL API payloads.

## Key Changes in RouterOS v7 vs v6

### 1. Routing Filters
- **v6**: `/routing filter add chain=ospf-in action=accept`
- **v7**: Routing filters now use a distinct scripting syntax:
  ```routeros
  /routing/filter/rule
  add chain=ospf-in rule="if (dst in 10.0.0.0/8) { accept; } else { reject; }"
  ```

### 2. BGP Configuration
- **v6**: `/routing bgp peer`
- **v7**: Uses templates and connections:
  ```routeros
  /routing/bgp/template
  add name=tmpl-isp as=65001 router-id=10.0.0.1
  /routing/bgp/connection
  add name=bgp-upstream template=tmpl-isp remote.address=198.51.100.1 .as=64512
  ```

### 3. WireGuard Native VPN
- RouterOS v7 introduces native WireGuard interfaces and peers:
  ```routeros
  /interface/wireguard add name=wg0 listen-port=13231
  /interface/wireguard/peers add interface=wg0 public-key="<KEY>" allowed-address=10.10.0.2/32
  ```

### 4. REST API Endpoints
- RouterOS v7 provides native JSON REST API:
  - Base: `https://<router-ip>/rest/`
  - Get interfaces: `GET /rest/interface`
  - Add IP: `PUT /rest/ip/address` with JSON body `{"address": "192.168.1.1/24", "interface": "ether1"}`

## Safe Command Generation Rules
1. Always specify `disabled=no` or `comment="Managed by AUDIRA NetOps AI"` for traceability.
2. In RouterOS v7, use forward-slash path notation (e.g., `/ip/address`, `/routing/bgp/connection`).
3. Never issue `/system/reset-configuration` or `/system/reboot` without explicit operator sign-off.
