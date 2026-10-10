# AUDIRA NetOps AI — REST & WebSocket API Specification

> **Base URL**: `http://localhost:3000/api/v1`  
> **WebSocket URL**: `ws://localhost:3000/ws`  
> **Authentication**: `Authorization: Bearer <JWT_ACCESS_TOKEN>`

---

## 1. Authentication Endpoints (`/auth`)

### 1.1 User Login
- **Endpoint**: `POST /auth/login`
- **Request Body**:
  ```json
  {
    "username": "noc_operator",
    "password": "OperatorSecretPassword123"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": "usr-88a7c2e0-2491-4e89",
      "username": "noc_operator",
      "roles": ["NOC_OPERATOR"],
      "permissions": ["device.read", "terminal.read", "config.read"]
    }
  }
  ```

### 1.2 Refresh Access Token
- **Endpoint**: `POST /auth/refresh`
- **Request Body**: `{ "refreshToken": "..." }`
- **Response `200 OK`**: `{ "accessToken": "..." }`

---

## 2. Device Management Endpoints (`/devices`)

### 2.1 List Devices
- **Endpoint**: `GET /devices`
- **Query Parameters**:
  - `vendor`: `MIKROTIK` | `CISCO` | `HUAWEI` | `JUNIPER` (optional)
  - `status`: `ONLINE` | `WARNING` | `OFFLINE` (optional)
  - `search`: string filter on name, IP, hostname (optional)
- **Response `200 OK`**:
  ```json
  [
    {
      "id": "dev-01",
      "name": "Core-CCR2004",
      "hostname": "core-router.netops.local",
      "ipAddress": "192.168.1.1",
      "vendor": "MIKROTIK",
      "model": "CCR2004-16G-2S+",
      "osVersion": "RouterOS v7.15.2",
      "status": "ONLINE",
      "cpuUsage": 14,
      "memoryUsage": 38,
      "portCount": 16,
      "portsUpCount": 14
    }
  ]
  ```

### 2.2 Onboard New Device
- **Endpoint**: `POST /devices`
- **Required Permission**: `device.write`
- **Request Body**:
  ```json
  {
    "name": "Distribution-SW02",
    "hostname": "dist-sw02.netops.local",
    "ipAddress": "192.168.1.25",
    "vendor": "CISCO",
    "model": "Catalyst 9300",
    "port": 22,
    "authType": "PASSWORD",
    "username": "admin",
    "password": "DeviceAdminPassword"
  }
  ```

---

## 3. Real-Time Telemetry & Monitoring (`/monitoring`)

### 3.1 Network Health KPI Summary
- **Endpoint**: `GET /monitoring/summary`
- **Response `200 OK`**:
  ```json
  {
    "totalDevices": 4,
    "onlineDevices": 3,
    "warningDevices": 1,
    "offlineDevices": 0,
    "cpuAverage": 24,
    "memoryAverage": 45,
    "activeAlertsCount": 2,
    "overallHealthPercent": 94
  }
  ```

---

## 4. AI Copilot & Tool Execution (`/ai`)

### 4.1 Interactive Copilot Chat
- **Endpoint**: `POST /ai/chat`
- **Required Permission**: `ai.read`
- **Request Body**:
  ```json
  {
    "message": "Cek throughput ether1 dan diagnosa apakah ada paket drop pada Core-CCR2004",
    "deviceId": "dev-01",
    "provider": "ollama",
    "model": "qwen2.5:7b"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "reply": "Pemeriksaan selesai. Interface ether1 menunjukkan throughput RX 124.5 Mbps / TX 45.2 Mbps dengan 0 packet drop.",
    "toolsExecuted": ["get_device_interfaces", "get_system_resources"],
    "riskLevel": "LOW"
  }
  ```

### 4.2 List Registered Network Tools
- **Endpoint**: `GET /ai/tools`
- **Response `200 OK`**: Array of 51 registered network tools with schemas, parameter definitions, and risk classifications.

### 4.3 Direct Tool Execution via Dispatcher
- **Endpoint**: `POST /ai/tools/execute`
- **Required Permission**: `ai.execute`
- **Request Body**:
  ```json
  {
    "toolName": "diagnose_ping",
    "parameters": {
      "host": "8.8.8.8",
      "count": 4
    }
  }
  ```

---

## 5. Live Terminal WebSocket (`/ws`)

### Connection Handshake
- **URL**: `ws://localhost:3000/ws`
- **Client Handshake Payload**:
  ```json
  {
    "type": "INIT_SESSION",
    "token": "JWT_TOKEN",
    "deviceId": "dev-01",
    "cols": 80,
    "rows": 24
  }
  ```
- **Server Stream Messages**:
  - `OUTPUT`: `{ "type": "OUTPUT", "data": "ANSI_STRING" }`
  - `ERROR`: `{ "type": "ERROR", "message": "Connection timed out" }`
  - `DISCONNECTED`: `{ "type": "DISCONNECTED" }`
