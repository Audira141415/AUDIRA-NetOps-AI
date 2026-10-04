# AUDIRA NetOps AI — API Reference

Base Endpoint: `/api/v1`

## Authentication
- `POST /auth/login` - Authenticate operator and receive JWT Access + Refresh token
- `GET /auth/me` - Fetch current user roles and permissions

## Device Management
- `GET /devices` - List devices with optional `?vendor=` and `?status=` filters
- `POST /devices` - Register a new device node
- `GET /devices/:id` - Fetch single device metadata
- `PATCH /devices/:id` - Update device configuration parameters
- `DELETE /devices/:id` - Remove device node
- `GET /devices/:id/system-info` - Fetch live system information
- `GET /devices/:id/interfaces` - List live interfaces and bandwidth counters
- `GET /devices/:id/routes` - Query FIB / RIB routing entries
- `GET /devices/:id/logs` - Fetch device system logs

## Live Terminal & WebSockets
- `WS /ws?deviceId=<id>&token=<jwt>` - PuTTY-like interactive bidirectional terminal stream

## Monitoring & Topology
- `GET /monitoring/health` - Aggregate NOC health overview
- `GET /monitoring/telemetry/:deviceId` - Realtime CPU, RAM, and interface throughput
- `GET /monitoring/topology` - React Flow nodes and edges graph

## Configurations & Backups
- `GET /config/:deviceId` - Retrieve active running configuration
- `POST /config/compare` - Synthesize visual diff (Green/Red/Yellow)
- `POST /config/validate` - Evaluate command safety and risk score
- `POST /config/apply` - Execute verified configuration
- `POST /config/rollback` - Revert to prior baseline backup
- `GET /backups` - List stored snapshots
- `POST /backups` - Create immediate manual snapshot
- `GET /backups/:id/download` - Download backup stream

## AI Copilot
- `GET /ai/providers` - Get active LLM configuration
- `POST /ai/providers` - Switch between Ollama, OpenAI, Anthropic, Gemini
- `GET /ai/tools` - List all 26 registered network tools
- `POST /ai/chat` - Chat with Copilot
- `POST /ai/diagnose` - Diagnostic pipeline execution (e.g. WAN latency root cause)

## Audit Logs
- `GET /audit` - Query immutable audit logs with multi-field filtering
