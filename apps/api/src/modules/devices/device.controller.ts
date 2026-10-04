// Device Management Controller & Service

import { Router, Request, Response } from 'express';
import { Device } from '@audira/types';
import { RouterOSConnector } from '@audira/routeros';
import { SSHConnector } from '@audira/ssh';
import { authenticateJwt, requirePermission } from '../../middleware/auth.middleware.js';

export const deviceRouter = Router();

// In-Memory store initialized with Demo Network seed data
let DEVICES_STORE: Device[] = [
  {
    id: '30000000-0000-0000-0000-000000000001',
    name: 'CORE-JOGJA-01',
    hostname: 'core-jogja-01.audira.net',
    ipAddress: '192.168.10.1',
    macAddress: 'D4:CA:6D:E1:01:01',
    vendor: 'MikroTik',
    platform: 'CCR2004-16G-2S+',
    osVersion: 'RouterOS v7.14.3',
    deviceType: 'ROUTER',
    connectionType: 'ROUTEROS_API',
    apiPort: 8728,
    sshPort: 22,
    status: 'ONLINE',
    pollingIntervalSeconds: 15,
    lastSeen: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '30000000-0000-0000-0000-000000000002',
    name: 'CORE-JOGJA-02',
    hostname: 'core-jogja-02.audira.net',
    ipAddress: '192.168.10.2',
    macAddress: 'D4:CA:6D:E1:01:02',
    vendor: 'MikroTik',
    platform: 'CCR2004-16G-2S+',
    osVersion: 'RouterOS v7.14.3',
    deviceType: 'ROUTER',
    connectionType: 'ROUTEROS_API',
    apiPort: 8728,
    sshPort: 22,
    status: 'ONLINE',
    pollingIntervalSeconds: 15,
    lastSeen: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '30000000-0000-0000-0000-000000000003',
    name: 'EDGE-JOGJA-01',
    hostname: 'edge-jogja-01.audira.net',
    ipAddress: '192.168.10.254',
    macAddress: 'D4:CA:6D:E1:02:01',
    vendor: 'MikroTik',
    platform: 'RB5009UG+S+IN',
    osVersion: 'RouterOS v7.14.3',
    deviceType: 'FIREWALL',
    connectionType: 'ROUTEROS_API',
    apiPort: 8728,
    sshPort: 22,
    status: 'ONLINE',
    pollingIntervalSeconds: 15,
    lastSeen: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '30000000-0000-0000-0000-000000000004',
    name: 'SW-JOGJA-01',
    hostname: 'sw-dist-01.audira.net',
    ipAddress: '192.168.10.11',
    macAddress: '48:8F:5A:22:01:10',
    vendor: 'MikroTik',
    platform: 'CRS326-24G-2S+RM',
    osVersion: 'SwitchOS / ROS v7',
    deviceType: 'SWITCH',
    connectionType: 'SSH',
    apiPort: 8728,
    sshPort: 22,
    status: 'ONLINE',
    pollingIntervalSeconds: 15,
    lastSeen: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '30000000-0000-0000-0000-000000000005',
    name: 'SW-JOGJA-02',
    hostname: 'sw-access-02.audira.net',
    ipAddress: '192.168.10.12',
    macAddress: '48:8F:5A:22:01:20',
    vendor: 'MikroTik',
    platform: 'CRS326-24G-2S+RM',
    osVersion: 'SwitchOS / ROS v7',
    deviceType: 'SWITCH',
    connectionType: 'SSH',
    apiPort: 8728,
    sshPort: 22,
    status: 'WARNING',
    pollingIntervalSeconds: 15,
    lastSeen: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '30000000-0000-0000-0000-000000000006',
    name: 'AP-01-NOC',
    hostname: 'ap-noc-floor2.audira.net',
    ipAddress: '192.168.20.5',
    macAddress: 'CC:2D:E0:11:22:33',
    vendor: 'MikroTik',
    platform: 'cAP ax',
    osVersion: 'RouterOS v7.12',
    deviceType: 'ACCESS_POINT',
    connectionType: 'ROUTEROS_API',
    apiPort: 8728,
    sshPort: 22,
    status: 'ONLINE',
    pollingIntervalSeconds: 30,
    lastSeen: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '30000000-0000-0000-0000-000000000007',
    name: 'SERVER-MGMT-01',
    hostname: 'srv-netops.audira.net',
    ipAddress: '192.168.10.200',
    macAddress: '00:15:5D:44:55:66',
    vendor: 'Linux',
    platform: 'Ubuntu 24.04 LTS',
    osVersion: 'Linux 6.8.0',
    deviceType: 'SERVER',
    connectionType: 'SSH',
    apiPort: 0,
    sshPort: 22,
    status: 'ONLINE',
    pollingIntervalSeconds: 30,
    lastSeen: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * GET /api/v1/devices - List devices with optional status/vendor filter
 */
deviceRouter.get('/', authenticateJwt, requirePermission('device.read'), (req: Request, res: Response) => {
  const { vendor, status, search } = req.query;

  let filtered = [...DEVICES_STORE];

  if (vendor) {
    filtered = filtered.filter(d => d.vendor.toLowerCase() === (vendor as string).toLowerCase());
  }

  if (status) {
    filtered = filtered.filter(d => d.status.toLowerCase() === (status as string).toLowerCase());
  }

  if (search) {
    const s = (search as string).toLowerCase();
    filtered = filtered.filter(
      d =>
        d.name.toLowerCase().includes(s) ||
        d.ipAddress.includes(s) ||
        d.hostname.toLowerCase().includes(s)
    );
  }

  res.json({
    success: true,
    data: filtered,
    total: filtered.length,
    message: 'Devices retrieved successfully',
  });
});

/**
 * GET /api/v1/devices/:id - Get device by ID
 */
deviceRouter.get('/:id', authenticateJwt, requirePermission('device.read'), (req: Request, res: Response) => {
  const device = DEVICES_STORE.find(d => d.id === req.params.id);
  if (!device) {
    res.status(404).json({ success: false, code: 'DEVICE_UNREACHABLE', message: 'Device not found' });
    return;
  }
  res.json({ success: true, data: device, message: 'Device found' });
});

/**
 * POST /api/v1/devices - Create new device
 */
deviceRouter.post('/', authenticateJwt, requirePermission('device.write'), (req: Request, res: Response) => {
  const body = req.body;
  const newDevice: Device = {
    id: `dev-${Date.now()}`,
    name: body.name || 'NEW-DEVICE',
    hostname: body.hostname || `${body.name || 'device'}.audira.local`,
    ipAddress: body.ipAddress,
    macAddress: body.macAddress,
    vendor: body.vendor || 'MikroTik',
    platform: body.platform,
    osVersion: body.osVersion,
    deviceType: body.deviceType || 'ROUTER',
    connectionType: body.connectionType || 'ROUTEROS_API',
    apiPort: body.apiPort || 8728,
    sshPort: body.sshPort || 22,
    status: 'ONLINE',
    pollingIntervalSeconds: body.pollingIntervalSeconds || 15,
    lastSeen: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  DEVICES_STORE.unshift(newDevice);
  res.status(201).json({ success: true, data: newDevice, message: 'Device created successfully' });
});

/**
 * PATCH /api/v1/devices/:id - Update device
 */
deviceRouter.patch('/:id', authenticateJwt, requirePermission('device.write'), (req: Request, res: Response) => {
  const index = DEVICES_STORE.findIndex(d => d.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ success: false, code: 'DEVICE_UNREACHABLE', message: 'Device not found' });
    return;
  }

  DEVICES_STORE[index] = {
    ...DEVICES_STORE[index]!,
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  res.json({ success: true, data: DEVICES_STORE[index], message: 'Device updated successfully' });
});

/**
 * DELETE /api/v1/devices/:id - Delete device
 */
deviceRouter.delete('/:id', authenticateJwt, requirePermission('device.write'), (req: Request, res: Response) => {
  const index = DEVICES_STORE.findIndex(d => d.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ success: false, code: 'DEVICE_UNREACHABLE', message: 'Device not found' });
    return;
  }

  const removed = DEVICES_STORE.splice(index, 1)[0];
  res.json({ success: true, data: removed, message: 'Device deleted successfully' });
});

/**
 * GET /api/v1/devices/:id/system-info - Retrieve live system information
 */
deviceRouter.get('/:id/system-info', authenticateJwt, requirePermission('device.read'), async (req: Request, res: Response) => {
  const device = DEVICES_STORE.find(d => d.id === req.params.id);
  if (!device) {
    res.status(404).json({ success: false, code: 'DEVICE_UNREACHABLE', message: 'Device not found' });
    return;
  }

  const connector = device.vendor === 'MikroTik'
    ? new RouterOSConnector({ host: device.ipAddress, port: device.apiPort, username: 'admin', isMock: true })
    : new SSHConnector({ host: device.ipAddress, port: device.sshPort, username: 'admin', isMock: true });

  const info = await connector.getSystemInfo();
  res.json({ success: true, data: info, message: 'System information retrieved' });
});

/**
 * GET /api/v1/devices/:id/interfaces - List live interfaces
 */
deviceRouter.get('/:id/interfaces', authenticateJwt, requirePermission('device.read'), async (req: Request, res: Response) => {
  const device = DEVICES_STORE.find(d => d.id === req.params.id);
  if (!device) {
    res.status(404).json({ success: false, code: 'DEVICE_UNREACHABLE', message: 'Device not found' });
    return;
  }

  const connector = new RouterOSConnector({ host: device.ipAddress, port: device.apiPort, username: 'admin', isMock: true });
  const interfaces = await connector.getInterfaces();
  res.json({ success: true, data: interfaces, message: 'Interfaces retrieved' });
});

/**
 * GET /api/v1/devices/:id/routes - List live routes
 */
deviceRouter.get('/:id/routes', authenticateJwt, requirePermission('device.read'), async (req: Request, res: Response) => {
  const device = DEVICES_STORE.find(d => d.id === req.params.id);
  if (!device) {
    res.status(404).json({ success: false, code: 'DEVICE_UNREACHABLE', message: 'Device not found' });
    return;
  }

  const connector = new RouterOSConnector({ host: device.ipAddress, port: device.apiPort, username: 'admin', isMock: true });
  const routes = await connector.getRoutes();
  res.json({ success: true, data: routes, message: 'Routes retrieved' });
});

/**
 * GET /api/v1/devices/:id/logs - List device logs
 */
deviceRouter.get('/:id/logs', authenticateJwt, requirePermission('device.read'), async (req: Request, res: Response) => {
  const device = DEVICES_STORE.find(d => d.id === req.params.id);
  if (!device) {
    res.status(404).json({ success: false, code: 'DEVICE_UNREACHABLE', message: 'Device not found' });
    return;
  }

  const connector = new RouterOSConnector({ host: device.ipAddress, port: device.apiPort, username: 'admin', isMock: true });
  const logs = await connector.getLogs();
  res.json({ success: true, data: logs, message: 'Device logs retrieved' });
});
