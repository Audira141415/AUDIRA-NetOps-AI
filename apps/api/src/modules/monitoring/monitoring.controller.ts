// Network Monitoring & Telemetry Controller

import { Router, Request, Response } from 'express';
import { TelemetrySimulator } from '@audira/monitoring';
import { authenticateJwt, requirePermission } from '../../middleware/auth.middleware.js';

export const monitoringRouter = Router();
const telemetrySimulator = TelemetrySimulator.getInstance();

/**
 * GET /api/v1/monitoring/health - Global NOC health overview
 */
monitoringRouter.get('/health', authenticateJwt, requirePermission('device.read'), (_req: Request, res: Response) => {
  const summary = telemetrySimulator.getNetworkHealthSummary();
  res.json({
    success: true,
    data: summary,
    message: 'NOC Health Summary retrieved',
  });
});

/**
 * GET /api/v1/monitoring/telemetry/:deviceId - Realtime telemetry for a specific node
 */
monitoringRouter.get('/telemetry/:deviceId', authenticateJwt, requirePermission('device.read'), (req: Request, res: Response) => {
  const { deviceId } = req.params;
  const { deviceName } = req.query;
  const snapshot = telemetrySimulator.getDeviceTelemetry(deviceId || 'dev-1', (deviceName as string) || 'ROUTER');
  res.json({
    success: true,
    data: snapshot,
    message: 'Device telemetry retrieved',
  });
});

/**
 * GET /api/v1/monitoring/topology - Graph nodes and edges for React Flow
 */
monitoringRouter.get('/topology', authenticateJwt, requirePermission('device.read'), (_req: Request, res: Response) => {
  const nodes = [
    {
      id: '30000000-0000-0000-0000-000000000001',
      type: 'nocNode',
      position: { x: 250, y: 150 },
      data: {
        label: 'CORE-JOGJA-01',
        ip: '192.168.10.1',
        vendor: 'MikroTik CCR2004',
        deviceType: 'ROUTER',
        status: 'ONLINE',
        cpuLoad: 16.5,
        latencyMs: 1.2,
        packetLoss: 0,
      },
    },
    {
      id: '30000000-0000-0000-0000-000000000002',
      type: 'nocNode',
      position: { x: 600, y: 150 },
      data: {
        label: 'CORE-JOGJA-02',
        ip: '192.168.10.2',
        vendor: 'MikroTik CCR2004',
        deviceType: 'ROUTER',
        status: 'ONLINE',
        cpuLoad: 14.2,
        latencyMs: 1.4,
        packetLoss: 0,
      },
    },
    {
      id: '30000000-0000-0000-0000-000000000003',
      type: 'nocNode',
      position: { x: 425, y: 20 },
      data: {
        label: 'EDGE-JOGJA-01',
        ip: '192.168.10.254',
        vendor: 'MikroTik RB5009',
        deviceType: 'FIREWALL',
        status: 'ONLINE',
        cpuLoad: 28.0,
        latencyMs: 2.1,
        packetLoss: 0,
      },
    },
    {
      id: '30000000-0000-0000-0000-000000000004',
      type: 'nocNode',
      position: { x: 250, y: 320 },
      data: {
        label: 'SW-JOGJA-01',
        ip: '192.168.10.11',
        vendor: 'CRS326 Switch',
        deviceType: 'SWITCH',
        status: 'ONLINE',
        cpuLoad: 32.1,
        latencyMs: 2.5,
        packetLoss: 0,
      },
    },
    {
      id: '30000000-0000-0000-0000-000000000005',
      type: 'nocNode',
      position: { x: 600, y: 320 },
      data: {
        label: 'SW-JOGJA-02',
        ip: '192.168.10.12',
        vendor: 'CRS326 Switch',
        deviceType: 'SWITCH',
        status: 'WARNING',
        cpuLoad: 38.5,
        latencyMs: 3.8,
        packetLoss: 1.4,
      },
    },
    {
      id: '30000000-0000-0000-0000-000000000006',
      type: 'nocNode',
      position: { x: 150, y: 480 },
      data: {
        label: 'AP-01-NOC',
        ip: '192.168.20.5',
        vendor: 'cAP ax',
        deviceType: 'ACCESS_POINT',
        status: 'ONLINE',
        cpuLoad: 9.5,
        latencyMs: 4.2,
        packetLoss: 0,
      },
    },
    {
      id: '30000000-0000-0000-0000-000000000007',
      type: 'nocNode',
      position: { x: 700, y: 480 },
      data: {
        label: 'SERVER-MGMT-01',
        ip: '192.168.10.200',
        vendor: 'Ubuntu Linux',
        deviceType: 'SERVER',
        status: 'ONLINE',
        cpuLoad: 11.0,
        latencyMs: 1.8,
        packetLoss: 0,
      },
    },
  ];

  const edges = [
    { id: 'e1-2', source: '30000000-0000-0000-0000-000000000001', target: '30000000-0000-0000-0000-000000000002', label: '10G MLAG Link', animated: true },
    { id: 'e3-1', source: '30000000-0000-0000-0000-000000000003', target: '30000000-0000-0000-0000-000000000001', label: 'WAN Transit 1', animated: true },
    { id: 'e3-2', source: '30000000-0000-0000-0000-000000000003', target: '30000000-0000-0000-0000-000000000002', label: 'WAN Transit 2', animated: true },
    { id: 'e1-4', source: '30000000-0000-0000-0000-000000000001', target: '30000000-0000-0000-0000-000000000004', label: 'Trunk SFP+ 10G', animated: true },
    { id: 'e2-5', source: '30000000-0000-0000-0000-000000000002', target: '30000000-0000-0000-0000-000000000005', label: 'Trunk SFP+ 10G (Loss 1.4%)', animated: true, style: { stroke: '#F59E0B' } },
    { id: 'e4-6', source: '30000000-0000-0000-0000-000000000004', target: '30000000-0000-0000-0000-000000000006', label: 'PoE+ GigE' },
    { id: 'e5-7', source: '30000000-0000-0000-0000-000000000005', target: '30000000-0000-0000-0000-000000000007', label: 'VLAN 10 Mgmt' },
  ];

  res.json({
    success: true,
    data: { nodes, edges },
    message: 'Network topology graph fetched',
  });
});
