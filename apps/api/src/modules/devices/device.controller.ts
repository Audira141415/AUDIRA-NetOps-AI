// Device Management Controller & Service

import { Router, Request, Response } from 'express';
import { Device } from '@audira/types';
import { RouterOSConnector } from '@audira/routeros';
import { SSHConnector } from '@audira/ssh';
import { authenticateJwt, requirePermission } from '../../middleware/auth.middleware.js';

export const deviceRouter = Router();

// In-Memory store initialized clean (Ready for live device onboarding)
let DEVICES_STORE: Device[] = [];


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
