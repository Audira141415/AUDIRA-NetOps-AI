-- AUDIRA NetOps AI - PostgreSQL Database Schema
-- Version: 1.0.0

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Roles & Permissions (RBAC)
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(100) UNIQUE NOT NULL, -- e.g. 'device.read', 'terminal.write'
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS role_permissions (
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- 2. Users & Authentication
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- 3. Device Groups
CREATE TABLE IF NOT EXISTS device_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Devices
CREATE TABLE IF NOT EXISTS devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    hostname VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    mac_address VARCHAR(17),
    vendor VARCHAR(50) NOT NULL DEFAULT 'MikroTik', -- MikroTik, Cisco, Huawei, Juniper, Linux, Generic
    platform VARCHAR(100),
    os_version VARCHAR(50),
    device_type VARCHAR(50) NOT NULL DEFAULT 'ROUTER', -- ROUTER, SWITCH, ACCESS_POINT, FIREWALL, SERVER
    connection_type VARCHAR(50) NOT NULL DEFAULT 'ROUTEROS_API', -- ROUTEROS_API, ROUTEROS_REST, SSH
    api_port INTEGER DEFAULT 8728,
    ssh_port INTEGER DEFAULT 22,
    status VARCHAR(20) NOT NULL DEFAULT 'OFFLINE', -- ONLINE, WARNING, OFFLINE, UNREACHABLE
    polling_interval_seconds INTEGER DEFAULT 15,
    last_seen TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_devices_ip ON devices(ip_address);
CREATE INDEX idx_devices_status ON devices(status);
CREATE INDEX idx_devices_vendor ON devices(vendor);

CREATE TABLE IF NOT EXISTS device_group_members (
    device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    group_id UUID NOT NULL REFERENCES device_groups(id) ON DELETE CASCADE,
    PRIMARY KEY (device_id, group_id)
);

-- 5. Device Credentials (Encrypted Secrets - AES-256-GCM)
CREATE TABLE IF NOT EXISTS device_credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    auth_type VARCHAR(30) NOT NULL DEFAULT 'PASSWORD', -- PASSWORD, SSH_KEY, API_TOKEN, CERTIFICATE
    username VARCHAR(100) NOT NULL,
    encrypted_secret TEXT NOT NULL, -- Never plain text
    secret_iv VARCHAR(64) NOT NULL,
    secret_tag VARCHAR(64) NOT NULL,
    key_fingerprint VARCHAR(128),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_device_credential UNIQUE (device_id, username)
);

-- 6. Network Interfaces
CREATE TABLE IF NOT EXISTS interfaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'ethernet',
    mac_address VARCHAR(17),
    ip_addresses JSONB DEFAULT '[]'::jsonb,
    is_enabled BOOLEAN DEFAULT true,
    is_running BOOLEAN DEFAULT false,
    mtu INTEGER DEFAULT 1500,
    speed VARCHAR(20),
    rx_bytes BIGINT DEFAULT 0,
    tx_bytes BIGINT DEFAULT 0,
    rx_packets BIGINT DEFAULT 0,
    tx_packets BIGINT DEFAULT 0,
    rx_errors BIGINT DEFAULT 0,
    tx_errors BIGINT DEFAULT 0,
    rx_drops BIGINT DEFAULT 0,
    tx_drops BIGINT DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_device_interface UNIQUE (device_id, name)
);

CREATE INDEX idx_interfaces_device ON interfaces(device_id);

-- 7. Network Routes
CREATE TABLE IF NOT EXISTS routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    destination VARCHAR(50) NOT NULL,
    gateway VARCHAR(50),
    interface_name VARCHAR(100),
    distance INTEGER DEFAULT 1,
    scope INTEGER DEFAULT 30,
    routing_table VARCHAR(50) DEFAULT 'main',
    is_active BOOLEAN DEFAULT true,
    is_dynamic BOOLEAN DEFAULT false,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_routes_device ON routes(device_id);

-- 8. Metrics (Telemetry Time-Series)
CREATE TABLE IF NOT EXISTS metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    cpu_percent NUMERIC(5,2),
    memory_percent NUMERIC(5,2),
    disk_percent NUMERIC(5,2),
    temperature_celsius NUMERIC(5,2),
    latency_ms NUMERIC(7,2),
    packet_loss_percent NUMERIC(5,2),
    uptime_seconds BIGINT,
    rx_rate_kbps NUMERIC(12,2),
    tx_rate_kbps NUMERIC(12,2),
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_metrics_device_time ON metrics(device_id, recorded_at DESC);

-- 9. Alerts
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID REFERENCES devices(id) ON DELETE SET NULL,
    severity VARCHAR(20) NOT NULL, -- INFO, WARNING, CRITICAL
    category VARCHAR(50) NOT NULL, -- CPU, MEMORY, INTERFACE, REACHABILITY, SECURITY, BGP, OSPF
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, ACKNOWLEDGED, RESOLVED
    acknowledged_by UUID REFERENCES users(id),
    acknowledged_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_alerts_device_severity ON alerts(device_id, severity, status);

-- 10. Configurations & Backups
CREATE TABLE IF NOT EXISTS configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL DEFAULT 1,
    content TEXT NOT NULL,
    checksum VARCHAR(64) NOT NULL,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS backups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    backup_type VARCHAR(30) NOT NULL DEFAULT 'RSC_EXPORT', -- BINARY_BACKUP, RSC_EXPORT, JSON_STATE
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500),
    content TEXT,
    hash VARCHAR(64) NOT NULL,
    size_bytes BIGINT NOT NULL DEFAULT 0,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_backups_device ON backups(device_id, created_at DESC);

CREATE TABLE IF NOT EXISTS config_diffs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    base_config_id UUID REFERENCES configs(id),
    target_config_id UUID REFERENCES configs(id),
    diff_text TEXT NOT NULL,
    added_lines INTEGER DEFAULT 0,
    removed_lines INTEGER DEFAULT 0,
    modified_lines INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 11. Terminal Sessions & Commands
CREATE TABLE IF NOT EXISTS terminal_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(128) NOT NULL,
    client_ip VARCHAR(45),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, CLOSED, TERMINATED
    started_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS terminal_commands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES terminal_sessions(id) ON DELETE CASCADE,
    command_text TEXT NOT NULL,
    risk_level VARCHAR(20) NOT NULL DEFAULT 'LOW', -- LOW, MEDIUM, HIGH, CRITICAL
    executed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 12. AI Conversations, Messages, & Tool Calls
CREATE TABLE IF NOT EXISTS ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_id UUID REFERENCES devices(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL DEFAULT 'New Conversation',
    provider VARCHAR(50) NOT NULL DEFAULT 'ollama',
    model VARCHAR(100) NOT NULL,
    mode VARCHAR(20) NOT NULL DEFAULT 'READ_ONLY', -- READ_ONLY, PLAN, EXECUTE
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL, -- user, assistant, system, tool
    content TEXT NOT NULL,
    tool_calls JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_tool_calls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
    tool_name VARCHAR(100) NOT NULL,
    input_payload JSONB NOT NULL,
    output_payload JSONB,
    risk_level VARCHAR(20) NOT NULL DEFAULT 'LOW',
    approval_status VARCHAR(20) NOT NULL DEFAULT 'APPROVED', -- PENDING, APPROVED, REJECTED, AUTO_PERMITTED
    approved_by UUID REFERENCES users(id),
    execution_status VARCHAR(20) NOT NULL DEFAULT 'SUCCESS', -- SUCCESS, FAILED, BLOCKED
    error_message TEXT,
    execution_duration_ms INTEGER,
    executed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 13. Automation Jobs & Executions
CREATE TABLE IF NOT EXISTS automation_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    trigger_type VARCHAR(50) NOT NULL, -- SCHEDULE, EVENT, THRESHOLD
    trigger_rule JSONB NOT NULL, -- e.g. {"metric": "cpu", "operator": ">", "threshold": 90}
    actions JSONB NOT NULL, -- list of pipeline steps
    is_enabled BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS automation_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES automation_jobs(id) ON DELETE CASCADE,
    trigger_context JSONB,
    status VARCHAR(20) NOT NULL DEFAULT 'RUNNING', -- RUNNING, COMPLETED, FAILED
    result_log JSONB,
    started_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ
);

-- 14. Enterprise Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    username VARCHAR(100),
    device_id UUID REFERENCES devices(id) ON DELETE SET NULL,
    device_name VARCHAR(100),
    action VARCHAR(100) NOT NULL,
    command TEXT,
    risk_level VARCHAR(20) NOT NULL DEFAULT 'LOW',
    approval_status VARCHAR(20) DEFAULT 'NONE',
    approval_by UUID REFERENCES users(id),
    result VARCHAR(20) NOT NULL, -- SUCCESS, FAILED, REJECTED, BLOCKED
    error_details TEXT,
    execution_duration_ms INTEGER,
    client_ip VARCHAR(45),
    session_id UUID,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_device ON audit_logs(device_id);
CREATE INDEX idx_audit_risk ON audit_logs(risk_level);
