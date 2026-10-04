-- AUDIRA NetOps AI - Seed Data
-- Roles, Granular Permissions, Admin User, and Mock Network Devices

-- 1. Insert Roles
INSERT INTO roles (id, name, description, is_system) VALUES
('10000000-0000-0000-0000-000000000001', 'SUPER_ADMIN', 'Full system access across all tenants and operations', true),
('10000000-0000-0000-0000-000000000002', 'NETWORK_ADMIN', 'Manage network topology, devices, credentials, and configurations', true),
('10000000-0000-0000-0000-000000000003', 'NETWORK_ENGINEER', 'Terminal access, config generation, backup, and live diagnostic tools', true),
('10000000-0000-0000-0000-000000000004', 'NOC_OPERATOR', 'Monitoring, alerts acknowledgment, read-only diagnostic inspection', true),
('10000000-0000-0000-0000-000000000005', 'AI_OPERATOR', 'Execute approved AI network optimization and diagnostics', true),
('10000000-0000-0000-0000-000000000006', 'AUDITOR', 'Access system audit logs, compliance reports, and configuration diffs', true),
('10000000-0000-0000-0000-000000000007', 'VIEWER', 'Read-only dashboard and telemetry observer', true)
ON CONFLICT (name) DO NOTHING;

-- 2. Insert Granular Permissions
INSERT INTO permissions (code, resource, action, description) VALUES
('device.read', 'device', 'read', 'View devices and operational states'),
('device.write', 'device', 'write', 'Create, update, or remove devices and credentials'),
('terminal.read', 'terminal', 'read', 'View terminal streaming output and session history'),
('terminal.write', 'terminal', 'write', 'Execute interactive shell commands via terminal'),
('config.read', 'config', 'read', 'View device configuration files and exports'),
('config.write', 'config', 'write', 'Create, draft, and modify device configurations'),
('config.execute', 'config', 'execute', 'Apply configuration changes to live hardware'),
('config.rollback', 'config', 'rollback', 'Restore prior configuration versions or backups'),
('ai.read', 'ai', 'read', 'Query AI Copilot for diagnostics and knowledge inspection'),
('ai.execute', 'ai', 'execute', 'Trigger AI-generated configuration and remediation plans'),
('audit.read', 'audit', 'read', 'View enterprise audit logs and execution records'),
('automation.execute', 'automation', 'execute', 'Create, enable, and execute automated network jobs')
ON CONFLICT (code) DO NOTHING;

-- Grant all permissions to SUPER_ADMIN
INSERT INTO role_permissions (role_id, permission_id)
SELECT '10000000-0000-0000-0000-000000000001', id FROM permissions
ON CONFLICT DO NOTHING;

-- 3. Insert Admin User (Password: Admin@123# hashed with bcrypt)
INSERT INTO users (id, username, email, password_hash, full_name, is_active) VALUES
('20000000-0000-0000-0000-000000000001', 'admin', 'admin@audira.local', '$2b$10$wT282Wp1Fz3q4u7D8t5q3O.VjE5f6Kx1qPZ4wK6Y7Z3q5v7Y9nB4m', 'NetOps Super Administrator', true),
('20000000-0000-0000-0000-000000000002', 'noc_engineer', 'noc@audira.local', '$2b$10$wT282Wp1Fz3q4u7D8t5q3O.VjE5f6Kx1qPZ4wK6Y7Z3q5v7Y9nB4m', 'Yogyakarta NOC Lead', true)
ON CONFLICT (username) DO NOTHING;

-- Assign SUPER_ADMIN role to admin
INSERT INTO user_roles (user_id, role_id) VALUES
('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001'),
('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000003')
ON CONFLICT DO NOTHING;

-- 4. Insert Demo Network Devices (CORE, EDGE, SWITCH, AP, SERVER)
INSERT INTO devices (id, name, hostname, ip_address, mac_address, vendor, platform, os_version, device_type, connection_type, api_port, ssh_port, status, last_seen) VALUES
('30000000-0000-0000-0000-000000000001', 'CORE-JOGJA-01', 'core-jogja-01.audira.net', '192.168.10.1', 'D4:CA:6D:E1:01:01', 'MikroTik', 'CCR2004-16G-2S+', 'RouterOS v7.14.3', 'ROUTER', 'ROUTEROS_API', 8728, 22, 'ONLINE', NOW()),
('30000000-0000-0000-0000-000000000002', 'CORE-JOGJA-02', 'core-jogja-02.audira.net', '192.168.10.2', 'D4:CA:6D:E1:01:02', 'MikroTik', 'CCR2004-16G-2S+', 'RouterOS v7.14.3', 'ROUTER', 'ROUTEROS_API', 8728, 22, 'ONLINE', NOW()),
('30000000-0000-0000-0000-000000000003', 'EDGE-JOGJA-01', 'edge-jogja-01.audira.net', '192.168.10.254', 'D4:CA:6D:E1:02:01', 'MikroTik', 'RB5009UG+S+IN', 'RouterOS v7.14.3', 'FIREWALL', 'ROUTEROS_API', 8728, 22, 'ONLINE', NOW()),
('30000000-0000-0000-0000-000000000004', 'SW-JOGJA-01', 'sw-dist-01.audira.net', '192.168.10.11', '48:8F:5A:22:01:10', 'MikroTik', 'CRS326-24G-2S+RM', 'SwitchOS / ROS v7', 'SWITCH', 'SSH', 8728, 22, 'ONLINE', NOW()),
('30000000-0000-0000-0000-000000000005', 'SW-JOGJA-02', 'sw-access-02.audira.net', '192.168.10.12', '48:8F:5A:22:01:20', 'MikroTik', 'CRS326-24G-2S+RM', 'SwitchOS / ROS v7', 'SWITCH', 'SSH', 8728, 22, 'WARNING', NOW()),
('30000000-0000-0000-0000-000000000006', 'AP-01-NOC', 'ap-noc-floor2.audira.net', '192.168.20.5', 'CC:2D:E0:11:22:33', 'MikroTik', 'cAP ax', 'RouterOS v7.12', 'ACCESS_POINT', 'ROUTEROS_API', 8728, 22, 'ONLINE', NOW()),
('30000000-0000-0000-0000-000000000007', 'SERVER-MGMT-01', 'srv-netops.audira.net', '192.168.10.200', '00:15:5D:44:55:66', 'Linux', 'Ubuntu 24.04 LTS', 'Linux 6.8.0', 'SERVER', 'SSH', 0, 22, 'ONLINE', NOW())
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Core Interfaces for CORE-JOGJA-01
INSERT INTO interfaces (device_id, name, type, mac_address, ip_addresses, is_enabled, is_running, mtu, speed, rx_bytes, tx_bytes) VALUES
('30000000-0000-0000-0000-000000000001', 'sfp-sfpplus1', 'sfp-plus', 'D4:CA:6D:E1:01:01', '["10.250.0.1/30"]'::jsonb, true, true, 1500, '10Gbps', 95827361842, 84920471922),
('30000000-0000-0000-0000-000000000001', 'ether1-wan', 'ethernet', 'D4:CA:6D:E1:01:02', '["192.168.1.100/24"]'::jsonb, true, true, 1500, '1Gbps', 4827394821, 2394821038),
('30000000-0000-0000-0000-000000000001', 'ether2-lan', 'ethernet', 'D4:CA:6D:E1:01:03', '["192.168.10.1/24"]'::jsonb, true, true, 1500, '1Gbps', 12847291840, 19283746192),
('30000000-0000-0000-0000-000000000001', 'bridge-lan', 'bridge', 'D4:CA:6D:E1:01:04', '["192.168.10.1/24"]'::jsonb, true, true, 1500, '10Gbps', 152847291840, 189283746192)
ON CONFLICT (device_id, name) DO NOTHING;

-- 6. Insert Mock Alerts
INSERT INTO alerts (id, device_id, severity, category, title, message, status) VALUES
('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000005', 'WARNING', 'INTERFACE', 'Interface drop rate elevated', 'Interface ether8 on SW-JOGJA-02 reports packet drops exceeding 1.8%', 'ACTIVE'),
('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', 'INFO', 'REACHABILITY', 'BGP Peer Established', 'BGP session with AS64512 (Telkom Transit) established via sfp-sfpplus1', 'ACKNOWLEDGED')
ON CONFLICT (id) DO NOTHING;
