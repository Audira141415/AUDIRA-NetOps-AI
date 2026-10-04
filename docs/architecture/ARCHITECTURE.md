## 1. Core Architecture Flow

```
                      AUDIRA NETOPS AI
                              │
                        React / Tauri
                              │
                         API Gateway
                              │
                 ┌────────────┼────────────┐
                 │            │            │
              Device       Terminal       AI
              Manager        Engine       Agent
                 │            │            │
                 └────────────┼────────────┘
                              │
                       Security Layer
                              │
                     Policy + Risk Engine
                              │
                        Connector Layer
                              │
           ┌──────────────────┼───────────────────┐
           │                  │                   │
       RouterOS API         REST                SSH
           │                  │                   │
           └──────────────────┼───────────────────┘
                              │
                           NETWORK
```

### Critical Architecture Decision:
1. **No Direct Network Access for AI**: Subsystems (`Device Manager`, `Terminal Engine`, and `AI Agent`) NEVER have direct, unmediated access to physical routers or switches.
2. **Mandatory Security Layer Gate**: All command proposals and queries must traverse the **Security Layer (Policy + Risk Engine)** before reaching the **Connector Layer**.
3. **Unified RouterOS Connector Foundation**: Because the MikroTik RouterOS API mirrors console syntax and concepts, a single robust `RouterOSConnector` serves as the shared foundation for both device management and registered AI agent tools.

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
