# DEPLOYMENT — AUDIRA NetOps AI

> **System:** AUDIRA NetOps AI (Enterprise NOC Platform)  
> **Tagline:** "Network Management. Terminal. Automation. AI."  
> **Version:** v1.0.0  
> **Status:** Production-Ready Infrastructure & Release Guide  

---

## 1. Deployment Architecture

AUDIRA NetOps AI dirancang untuk deployment on-premise NOC maupun cloud VPC tertutup. Arsitektur terdistribusi berbasis container Docker dan desktop client:

```
                            [ Operators / NOC Engineers ]
                                   │              │
                           (HTTPS / 443)     (Native GUI)
                                   │              │
                            ┌──────▼──────┐   ┌───▼─────────┐
                            │ Nginx Proxy │   │   Tauri 2   │
                            │  (SSL/WSS)  │   │   Desktop   │
                            └──────┬──────┘   └───┬─────────┘
                                   │              │
                   ┌───────────────┼──────────────┘
                   │ (Reverse Proxy & API Stream)
                   ▼
       ┌────────────────────────┐         ┌────────────────────────┐
       │     apps/web (SPA)     │         │     apps/api (Node)    │
       │    Port: 5173 / Nginx  │◄───────►│    Port: 3000 (REST/WS)│
       └────────────────────────┘         └───────────┬────────────┘
                                                      │
                       ┌──────────────────────────────┼──────────────────────────────┐
                       │                              │                              │
                       ▼                              ▼                              ▼
          ┌────────────────────────┐    ┌────────────────────────┐     ┌────────────────────────┐
          │     PostgreSQL 16      │    │        Redis 7         │     │     Ollama LLM Host    │
          │   Port: 5432 (23 DDL)  │    │   Port: 6379 (PubSub)  │     │   Port: 11434 (Local)  │
          └────────────────────────┘    └────────────────────────┘     └────────────────────────┘
                       ▲
                       │
          ┌────────────┴───────────┐
          │   apps/worker (Node)   │
          │   Background Polling   │
          └────────────────────────┘
```

- **Frontend NOC (Web):** Single Page Application (React 18 + Vite) disajikan via Nginx dengan gzip/brotli compression dan caching header statis.
- **Desktop NOC:** Binary native Tauri 2 (`.exe` / `.msi` Windows, `.deb` Linux, `.dmg` macOS).
- **Backend API & Streaming Gateway:** Node.js 22 LTS (Express REST + WebSockets) pada port `3000`.
- **Background Worker Daemon:** Node.js 22 LTS yang menangani polling telemetri berkala (15 detik), evaluasi alert, dan automated snapshot backups.
- **Database:** PostgreSQL 16 dengan 23 relasi tabel, indexing b-tree, dan penyimpanan kredensial router terenkripsi AES-256-GCM.
- **Cache & Message Broker:** Redis 7 Alpine untuk pub/sub status real-time, terminal stream multiplexing, dan telemetry caching.
- **Local AI Engine:** Ollama instance (`qwen2.5:7b` atau `llama3.1:8b`) pada port `11434`, terisolasi di jaringan lokal tanpa ketergantungan internet publik.

---

## 2. Environment Variables Specification

File `.env` produksi wajib diamankan dengan permission `600` (`chmod 600 .env`).

```bash
# ==============================================================================
# AUDIRA NetOps AI — Production Environment Configuration
# ==============================================================================

# Server & Runtime
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
CORS_ORIGIN=https://noc.audira.internal,http://localhost:5173

# Database (PostgreSQL 16)
DATABASE_URL=postgresql://audira_admin:SECURE_PG_PASSWORD@postgres:5432/audira_netops?sslmode=disable
DB_POOL_MIN=5
DB_POOL_MAX=20

# Cache & PubSub (Redis 7)
REDIS_URL=redis://:SECURE_REDIS_PASSWORD@redis:6379/0

# Security & Cryptography
# Wajib 64 karakter hex (32 bytes) untuk AES-256-GCM
ENCRYPTION_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
JWT_SECRET=super_secret_production_jwt_signing_key_at_least_32_chars
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=super_secret_refresh_jwt_signing_key_at_least_32_chars
JWT_REFRESH_EXPIRES_IN=7d

# AI Engine Gateway
OLLAMA_BASE_URL=http://ollama:11434
AI_DEFAULT_PROVIDER=ollama
AI_DEFAULT_MODEL=qwen2.5:7b

# Cloud AI Fallback (Opsional - Diisi jika NOC memiliki koneksi egress internet)
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GEMINI_API_KEY=

# Telemetry & Polling Worker
POLLING_INTERVAL_SECONDS=15
METRIC_RETENTION_DAYS=30
ALERT_EVALUATION_INTERVAL_MS=5000

# Logging & Auditing
LOG_LEVEL=info
LOG_FORMAT=json
MASK_SECRETS=true
```

---

## 3. Deployment Steps

### A. Prerequisites
1. Docker Engine v24.0+ & Docker Compose v2.20+
2. Node.js v22.x LTS & pnpm v9.x (untuk build native)
3. Minimal resource server NOC: 4 vCPU, 8 GB RAM, 50 GB SSD (disarankan 16 GB RAM jika menjalankan model LLM lokal Ollama di node yang sama).

### B. Quick Launch via Docker Compose (Recommended)
```bash
# 1. Masuk ke root direktori
cd f:/AUDIRA-NetOps-AI

# 2. Salin dan sesuaikan konfigurasi environment
cp .env.example .env

# 3. Jalankan full containerized stack
docker compose -f docker/docker-compose.yml up -d --build

# 4. Verifikasi status container
docker compose -f docker/docker-compose.yml ps

# 5. Unduh model AI lokal ke container Ollama
docker exec -it audira-ollama ollama pull qwen2.5:7b
```

### C. Manual Monorepo Production Build
```bash
# 1. Install seluruh dependensi monorepo
pnpm install --frozen-lockfile

# 2. Verifikasi strict TypeScript checking di seluruh 14 package
pnpm typecheck

# 3. Build bundle produksi untuk semua packages dan apps
pnpm build

# 4. Jalankan database migrations
pnpm run db:migrate

# 5. Jalankan backend API & worker daemon
node apps/api/dist/index.js &
node apps/worker/dist/index.js &
```

---

## 4. Database Migrations & Seeds

Struktur database mencakup 23 tabel relational berintegritas tinggi. Prosedur inisialisasi:

```bash
# Inisialisasi skema tabel lengkap
psql $DATABASE_URL -f database/schema/init.sql

# Inisialisasi data seed (Default Roles, Permissions, & 7 Mock Nodes Demo Network)
psql $DATABASE_URL -f database/seeds/seed.sql
```

**Verifikasi Data Inisial:**
- User default: `admin` / `admin123` (Wajib diubah saat instalasi produksi perdana).
- Role default: `SUPER_ADMIN`, `NOC_MANAGER`, `SENIOR_NETWORK_ENGINEER`, `NETWORK_ENGINEER`, `NOC_OPERATOR`, `READ_ONLY_AUDITOR`, `AI_COPILOT_AGENT`.
- Mock Network: 7 perangkat pre-configured (`ISP-GW`, `CORE-01`, `CORE-02`, `AGG-01`, `SW-01`, `SW-02`, `SW-07`).

---

## 5. Health Checks & Observability

Endpoint kesehatan sistem dapat dimonitor oleh Prometheus atau orchestrator internal:

| Endpoint | Method | Fungsi | Respon Normal |
|---|---|---|---|
| `/api/v1/health` | `GET` | Cek status API, Database, Redis, Ollama | `{"status":"ok","db":true,"redis":true,"ai":true}` |
| `/api/v1/metrics` | `GET` | Metrik throughput, latency, pool koneksi | Prometheus compatible text format |
| `/ws` | `WSS` | WebSocket handshake untuk terminal & telemetry | Status HTTP `101 Switching Protocols` |

---

## 6. Instant Rollback Procedure

Jika rilis baru mengalami anomali atau degradasi layanan:

```bash
# 1. Rollback image container ke versi tag stabil sebelumnya
docker compose -f docker/docker-compose.yml down
sed -i 's/:v1.0.1/:v1.0.0/g' docker/docker-compose.yml
docker compose -f docker/docker-compose.yml up -d

# 2. Rollback konfigurasi jaringan router (Disaster Recovery)
# Menggunakan snapshot backup otomatis yang dibuat oleh AUDIRA sebelum eksekusi AI:
curl -X POST http://localhost:3000/api/v1/backups/{backup_id}/restore \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# 3. Verifikasi pemulihan audit log
docker logs audira-api --tail 100
```
