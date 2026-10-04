# ARCHITECTURE — AUDIRA NetOps AI

> **Version:** v1.0.0
> **Target:** Enterprise Network Operations, PuTTY Clustering, WinBox Management, Automation & AI

---

## 1. System Overview
AUDIRA NetOps AI employs a modular monorepo architecture separating the presentation shell (Web/Desktop), high-performance API & WebSocket gateway, background worker daemon, and isolated reusable domain packages.

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
