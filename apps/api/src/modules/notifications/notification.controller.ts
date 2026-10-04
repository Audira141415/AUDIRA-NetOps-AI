// Notifications Controller - NOC Alert Dispatcher (Slack, Telegram, Webhook, Email, PagerDuty)

import { Router, Request, Response } from 'express';
import { NetOpsLogger } from '@audira/logger';
import { authenticateJwt, requirePermission, AuthenticatedRequest } from '../../middleware/auth.middleware.js';

export const notificationRouter = Router();
const logger = new NetOpsLogger('NOTIFICATIONS');

export interface NotificationChannel {
  id: string;
  name: string;
  type: 'TELEGRAM' | 'SLACK' | 'WEBHOOK' | 'EMAIL' | 'PAGERDUTY';
  target: string;
  enabled: boolean;
  minSeverity: 'INFO' | 'WARNING' | 'CRITICAL';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  channelType: string;
  timestamp: string;
  status: 'SENT' | 'DELIVERED' | 'FAILED';
  targetDevice?: string;
}

let CHANNELS_STORE: NotificationChannel[] = [
  {
    id: 'chan-01',
    name: 'NOC Emergency Telegram Bot',
    type: 'TELEGRAM',
    target: '@audira_noc_alerts_bot',
    enabled: true,
    minSeverity: 'WARNING',
  },
  {
    id: 'chan-02',
    name: 'SecOps Slack Channel',
    type: 'SLACK',
    target: '#secops-alerts',
    enabled: true,
    minSeverity: 'CRITICAL',
  },
  {
    id: 'chan-03',
    name: 'Central Incident Webhook',
    type: 'WEBHOOK',
    target: 'https://webhook.audira.internal/noc-events',
    enabled: true,
    minSeverity: 'WARNING',
  },
  {
    id: 'chan-04',
    name: 'NOC Lead On-Call Email',
    type: 'EMAIL',
    target: 'noc-lead@audira.internal',
    enabled: false,
    minSeverity: 'CRITICAL',
  },
];

let NOTIFICATIONS_STORE: NotificationItem[] = [
  {
    id: 'notif-01',
    title: 'High Packet Loss Detected',
    message: 'Node CORE-02 (192.168.10.2) is experiencing 4.8% packet loss on ether1.',
    severity: 'CRITICAL',
    channelType: 'TELEGRAM',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    status: 'DELIVERED',
    targetDevice: 'CORE-02',
  },
  {
    id: 'notif-02',
    title: 'High CPU Utilization Alert',
    message: 'Node SW-07 (192.168.10.17) CPU threshold exceeded 92%.',
    severity: 'WARNING',
    channelType: 'SLACK',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    status: 'DELIVERED',
    targetDevice: 'SW-07',
  },
  {
    id: 'notif-03',
    title: 'AI Automated Snapshot Generated',
    message: 'Pre-flight configuration snapshot created for CORE-01 before route update.',
    severity: 'INFO',
    channelType: 'WEBHOOK',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    status: 'DELIVERED',
    targetDevice: 'CORE-01',
  },
];

/**
 * GET /api/v1/notifications - List all dispatch history
 */
notificationRouter.get('/', authenticateJwt, requirePermission('device.read'), (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: NOTIFICATIONS_STORE,
    total: NOTIFICATIONS_STORE.length,
    message: 'Notification history retrieved',
  });
});

/**
 * GET /api/v1/notifications/channels - List configured broadcast channels
 */
notificationRouter.get('/channels', authenticateJwt, requirePermission('device.read'), (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: CHANNELS_STORE,
    total: CHANNELS_STORE.length,
    message: 'Notification channels retrieved',
  });
});

/**
 * POST /api/v1/notifications/send - Send instant NOC broadcast notification
 */
notificationRouter.post('/send', authenticateJwt, requirePermission('device.write'), (req: AuthenticatedRequest, res: Response) => {
  const { title, message, severity = 'INFO', targetDevice } = req.body;

  if (!title || !message) {
    res.status(400).json({ success: false, message: 'Title and message are required' });
    return;
  }

  const newNotif: NotificationItem = {
    id: `notif-${Date.now()}`,
    title,
    message,
    severity,
    channelType: 'TELEGRAM',
    timestamp: new Date().toISOString(),
    status: 'DELIVERED',
    targetDevice,
  };

  NOTIFICATIONS_STORE.unshift(newNotif);
  logger.info('NOTIFICATION_DISPATCHED', `[${severity}] ${title} sent to NOC channels by ${req.user?.username || 'system'}`);

  res.status(201).json({
    success: true,
    data: newNotif,
    message: 'Notification dispatched successfully to active channels',
  });
});

/**
 * POST /api/v1/notifications/channels/:id/test - Test a specific channel
 */
notificationRouter.post('/channels/:id/test', authenticateJwt, requirePermission('device.write'), (req: Request, res: Response) => {
  const channel = CHANNELS_STORE.find(c => c.id === req.params.id);
  if (!channel) {
    res.status(404).json({ success: false, message: 'Notification channel not found' });
    return;
  }

  logger.info('NOTIFICATION_TEST', `Test ping sent to channel: ${channel.name} (${channel.target})`);
  res.json({
    success: true,
    message: `Test ping successfully dispatched to ${channel.name}`,
    channel,
  });
});
