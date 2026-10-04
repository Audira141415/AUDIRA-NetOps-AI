# AUDIRA NetOps AI — System Architecture Specification

## 1. Overview
AUDIRA NetOps AI is a production-ready enterprise network operations platform combining WinBox-like node management, PuTTY-like live terminal clustering, real-time telemetry observability, disaster recovery diffing, and an autonomous AI Network Copilot.

```
+-----------------------------------------------------------------------------------+
|                              AUDIRA WEB & DESKTOP (SPA)                           |
|       React + Vite + Tailwind CSS + Lucide + Xterm.js + React Flow + Recharts     |
+-----------------------------------------+-----------------------------------------+
                                          |
                               [REST / WebSocket /ws]
                                          |
+-----------------------------------------v-----------------------------------------+
|                               AUDIRA API GATEWAY                                  |
|               Express/NestJS + RBAC Guards + Structured Logger + JWT Auth         |
+-------------------+---------------------+--------------------+--------------------+
                    |                     |                    |
        +-----------v-----------+         |         +----------v-----------+
        |   AI COPILOT AGENT    |         |         |  TELEMETRY & METRICS |
        |  (Ollama / Qwen2.5)   |         |         |  (Redis Time Series) |
        +-----------+-----------+         |         +----------+-----------+
                    |                     |                    |
        +-----------v-----------+         |                    |
        |  SAFETY PIPELINE &    |         |                    |
        |  RISK ENGINE (9-Step) |         |                    |
        +-----------+-----------+         |                    |
                    |                     |                    |
                    +------------------+  |  +-----------------+
                                       |  |  |
                        +--------------v--v--v-------------+
                        |     DEVICE CONNECTOR LAYER       |
                        |   MikroTik API-SSL / REST / SSH  |
                        +--------------+-------------------+
                                       |
                   +-------------------+-------------------+
                   |                   |                   |
        +----------v--------+ +--------v-------+ +---------v--------+
        | MikroTik RouterOS | | Generic Linux  | | Cisco / Juniper  |
        | (CCR, RB5009, CRS)| | (Ubuntu Server)| | (Future Ext.)    |
        +-------------------+ +----------------+ +------------------+
```

## 2. 9-Step AI Execution Safety Pipeline
AI NEVER communicates directly with hardware. Every command follows:
1. **AI Proposal**: Generates structured function call intent.
2. **Tool Invocation**: Validates tool registration against capability registry.
3. **Validation**: Syntax and parameter consistency checks.
4. **Risk Analysis**: Engine computes risk level (LOW, MEDIUM, HIGH, CRITICAL).
5. **Pre-flight Backup**: Automatic RSC/binary snapshot created.
6. **Visual Diff**: Green/Red/Yellow diff rendered for operator.
7. **Approval Gate**: HIGH/CRITICAL commands require signed operator confirmation.
8. **Execution**: Atomic execution over authenticated connector.
9. **Verification & Audit**: Live telemetry check; immutable record in audit log.
