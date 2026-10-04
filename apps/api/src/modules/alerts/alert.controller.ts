// Alerts Controller

import { Router, Request, Response } from 'express';
import { Alert } from '@audira/types';
import { TelemetrySimulator } from '@audira/monitoring';
import { authenticateJwt, requirePermission, AuthenticatedRequest } from '../../middleware/auth.middleware.js';

export const alertRouter = Router();

let ALERTS_STORE: Alert[] = TelemetrySimulator.getInstance().getActiveAlerts();

/**
 * GET /api/v1/alerts - Retrieve alerts with optional severity/status filter
 */
alertRouter.get('/', authenticateJwt, requirePermission('device.read'), (req: Request, res: Response) => {
  const { status, severity } = req.query;
  let list = [...ALERTS_STORE];

  if (status) {
    list = list.filter(a => a.status.toLowerCase() === (status as string).toLowerCase());
  }

  if (severity) {
    list = list.filter(a => a.severity.toLowerCase() === (severity as string).toLowerCase());
  }

  res.json({
    success: true,
    data: list,
    total: list.length,
    message: 'Alerts retrieved',
  });
});

/**
 * PATCH /api/v1/alerts/:id/acknowledge
 */
alertRouter.patch('/:id/acknowledge', authenticateJwt, requirePermission('device.read'), (req: AuthenticatedRequest, res: Response) => {
  const alert = ALERTS_STORE.find(a => a.id === req.params.id);
  if (!alert) {
    res.status(404).json({ success: false, message: 'Alert not found' });
    return;
  }

  alert.status = 'ACKNOWLEDGED';
  alert.acknowledgedBy = req.user?.username || 'admin';
  alert.acknowledgedAt = new Date().toISOString();

  res.json({ success: true, data: alert, message: 'Alert acknowledged' });
});

/**
 * PATCH /api/v1/alerts/:id/resolve
 */
alertRouter.patch('/:id/resolve', authenticateJwt, requirePermission('device.read'), (req: AuthenticatedRequest, res: Response) => {
  const alert = ALERTS_STORE.find(a => a.id === req.params.id);
  if (!alert) {
    res.status(404).json({ success: false, message: 'Alert not found' });
    return;
  }

  alert.status = 'RESOLVED';
  alert.resolvedAt = new Date().toISOString();

  res.json({ success: true, data: alert, message: 'Alert resolved' });
});
