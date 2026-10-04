# PRD — AUDIRA NetOps AI

> **Product:** AUDIRA NetOps AI v1.0
> **Tagline:** "Network Management. Terminal. Automation. AI."

---

## 1. Problem Statement
Network engineers and NOC operators currently juggle multiple fragmented tools: PuTTY for SSH console, WinBox for MikroTik GUIs, separate monitoring systems, manual config backups, and disconnected AI chatbots that lack real-time network grounding and safety guardrails.

## 2. Solution & Core Capabilities
1. **Clustered Live Terminal**: Multi-tab live SSH sessions (`[CORE-01] [CORE-02] [SW-01] [+]`) with latency monitors and split screen.
2. **WinBox-Style Node Management**: Full inspection of Interfaces, IP Addresses, Routes, Firewall, NAT, DHCP, DNS, VLANs, Bridges, VPNs, Queues, and Logs.
3. **Telemetry & Observability**: Real-time CPU, RAM, disk, temperature, latency, and packet loss metrics.
4. **Interactive Topology Graph**: React Flow visualizer with live traffic flows and degraded link alarms.
5. **Configuration Lifecycle**: Visual diffing (Green/Red/Yellow), syntax validation, automated pre-change snapshots, and one-click rollback.
6. **Autonomous AI Copilot**: Grounded in 26 registered tools with local Ollama (`qwen2.5:7b`) and multi-cloud fallback.
7. **Enterprise Risk Matrix**: LOW, MEDIUM, HIGH, CRITICAL levels; CRITICAL commands are strictly forbidden from automated execution.
