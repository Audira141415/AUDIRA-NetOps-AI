// Enterprise Audit Logs Controller

import { Router, Request, Response } from 'express';
import { AuditLogEntry } from '@audira/types';
import { authenticateJwt, requirePermission } from '../../middleware/auth.middleware.js';

export const auditRouter = Router();

const AUDIT_STORE: AuditLogEntry[] = [
  {
    id: 'aud-001',
    userId: '20000000-0000-0000-0000-000000000001',
    username: 'admin',
    deviceId: '30000000-0000-0000-0000-000000000001',
    deviceName: 'CORE-JOGJA-01',
    action: 'CONFIG_APPLY',
    command: '/ip address add address=10.100.0.1/24 interface=bridge-lan',
    riskLevel: 'HIGH',
    approvalStatus: 'APPROVED_BY_ADMIN',
    approvedBy: 'admin',
    result: 'SUCCESS',
    executionDurationMs: 145,
    clientIp: '192.168.10.50',
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
  },
  {
    id: 'aud-002',
    userId: '20000000-0000-0000-0000-000000000001',
    username: 'admin',
    deviceId: '30000000-0000-0000-0000-000000000005',
    deviceName: 'SW-JOGJA-02',
    action: 'COMMAND_EXECUTION',
    command: '/system reboot',
    riskLevel: 'CRITICAL',
    approvalStatus: 'BLOCKED',
    result: 'BLOCKED',
    errorDetails: 'Execution of CRITICAL command blocked by Security Engine without dual sign-off',
    executionDurationMs: 12,
    clientIp: '192.168.10.50',
    createdAt: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
  },
  {
    id: 'aud-003',
    userId: '20000000-0000-0000-0000-000000000002',
    username: 'noc_engineer',
    deviceId: '30000000-0000-0000-0000-000000000001',
    deviceName: 'CORE-JOGJA-01',
    action: 'BACKUP_CREATE',
    command: '/system backup save name=daily-snapshot',
    riskLevel: 'LOW',
    result: 'SUCCESS',
    executionDurationMs: 410,
    clientIp: '192.168.10.52',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    id: 'aud-004',
    userId: '20000000-0000-0000-0000-000000000001',
    username: 'admin',
    deviceId: '30000000-0000-0000-0000-000000000003',
    deviceName: 'EDGE-JOGJA-01',
    action: 'AI_DIAGNOSE',
    command: 'get_active_connections',
    riskLevel: 'LOW',
    result: 'SUCCESS',
    executionDurationMs: 220,
    clientIp: '192.168.10.50',
    createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
  },
];

/**
 * GET /api/v1/audit - Filterable audit log entries
 * Filter by: user, device, date, risk, command, result
 */
auditRouter.get('/', authenticateJwt, requirePermission('audit.read'), (req: Request, res: Response) => {
  const { user, device, risk, result, search } = req.query;

  let list = [...AUDIT_STORE];

  if (user) {
    list = list.filter(e => e.username?.toLowerCase().includes((user as string).toLowerCase()));
  }

  if (device) {
    list = list.filter(e => e.deviceName?.toLowerCase().includes((device as string).toLowerCase()));
  }

  if (risk) {
    list = list.filter(e => e.riskLevel.toLowerCase() === (risk as string).toLowerCase());
  }

  if (result) {
    list = list.filter(e => e.result.toLowerCase() === (result as string).toLowerCase());
  }

  if (search) {
    const s = (search as string).toLowerCase();
    list = list.filter(
      e =>
        e.action.toLowerCase().includes(s) ||
        (e.command && e.command.toLowerCase().includes(s)) ||
        (e.deviceName && e.deviceName.toLowerCase().includes(s))
    );
  }

  res.json({
    success: true,
    data: list,
    total: list.length,
    message: 'Audit logs retrieved',
  });
});
