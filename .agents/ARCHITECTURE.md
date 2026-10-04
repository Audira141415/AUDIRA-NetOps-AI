# ARCHITECTURE — AUDIRA NetOps AI

> **Version:** v1.0.0
> **Target:** Enterprise Network Operations, PuTTY Clustering, WinBox Management, Automation & AI

---

## 1. System Overview & Convergence Flow
Semua subsistem (Device Manager, Terminal Engine, dan AI Agent) WAJIB melewati **Security Layer (Policy + Risk Engine)** sebelum diteruskan ke **Connector Layer**. AI tidak pernah memiliki akses langsung yang tidak terkendali ke jaringan.

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

## 2. Architecture Layers
- **Presentation Layer**: React 18, Vite, Tailwind CSS, Lucide Icons, Zustand, React Flow, Recharts.
- **Terminal Engine**: PuTTY-like live clustering over WebSockets with ANSI parsing and streaming buffers.
- **Application & API Layer**: REST API + WebSocket Server (`/ws`) with JWT auth, RBAC guards, and request logging.
- **AI Agent Service**: 26 registered network tools with Ollama local LLM integration and 9-step safety pipeline.
- **Device Connector Layer**: `DeviceConnector` interface implemented for MikroTik RouterOS API-SSL, REST, and Generic SSH.
- **Data & Telemetry Layer**: PostgreSQL relational store with 23 tables, Redis for cache/realtime streams, AES-256-GCM encrypted credential vault.

## 3. Safety Pipeline Flow
```
AI Proposal ──► Tool Call ──► Syntax Check ──► Risk Engine ──► Snapshot Backup ──► Visual Diff ──► Operator Gate ──► Apply ──► Verify & Audit
```
