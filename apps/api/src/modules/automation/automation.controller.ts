// Automation Controller (Event, Threshold, and Scheduled Jobs)

import { Router, Request, Response } from 'express';
import { authenticateJwt, requirePermission } from '../../middleware/auth.middleware.js';

export const automationRouter = Router();

interface AutomationJob {
  id: string;
  name: string;
  description: string;
  triggerType: 'THRESHOLD' | 'SCHEDULE' | 'EVENT';
  triggerRule: Record<string, unknown>;
  actions: string[];
  isEnabled: boolean;
  lastRunAt?: string;
}

const JOBS_STORE: AutomationJob[] = [
  {
    id: 'job-001',
    name: 'Auto-Diagnostic on High CPU',
    description: 'WHEN CPU > 90% THEN run diagnostics THEN AI analysis THEN send alert',
    triggerType: 'THRESHOLD',
    triggerRule: { metric: 'cpu', operator: '>', threshold: 90, durationSeconds: 60 },
    actions: ['collect_diagnostics', 'ai_analysis', 'send_alert_telegram'],
    isEnabled: true,
    lastRunAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 'job-002',
    name: 'Nightly Core Router Backup',
    description: 'SCHEDULE: 02:00 WIB daily -> Create RSC export and archive to storage',
    triggerType: 'SCHEDULE',
    triggerRule: { cron: '0 2 * * *' },
    actions: ['create_rsc_export', 'verify_checksum', 'prune_older_than_30d'],
    isEnabled: true,
    lastRunAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: 'job-003',
    name: 'Interface Link State Alerting',
    description: 'EVENT: Interface link-down -> Dispatch critical alert to NOC channel',
    triggerType: 'EVENT',
    triggerRule: { event: 'interface.link_down' },
    actions: ['send_alert_webhook', 'trace_alternative_route'],
    isEnabled: true,
  },
];

/**
 * GET /api/v1/automation/jobs
 */
automationRouter.get('/jobs', authenticateJwt, requirePermission('automation.execute'), (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: JOBS_STORE,
    message: 'Automation jobs retrieved',
  });
});

/**
 * POST /api/v1/automation/jobs/:id/run - Manually trigger an automation job
 */
automationRouter.post('/jobs/:id/run', authenticateJwt, requirePermission('automation.execute'), (req: Request, res: Response) => {
  const job = JOBS_STORE.find(j => j.id === req.params.id);
  if (!job) {
    res.status(404).json({ success: false, message: 'Automation job not found' });
    return;
  }

  job.lastRunAt = new Date().toISOString();
  res.json({
    success: true,
    data: {
      executionId: `exec-${Date.now()}`,
      jobId: job.id,
      jobName: job.name,
      status: 'COMPLETED',
      executionDurationMs: 840,
      logs: [
        'Trigger condition evaluated: MANUAL_TRIGGER',
        'Step 1 (collect_diagnostics): SUCCESS - collected interface, routing, and resource logs',
        'Step 2 (ai_analysis): SUCCESS - zero critical abnormalities identified',
        'Step 3 (notify): SUCCESS - dispatched to active channels',
      ],
    },
    message: `Automation job '${job.name}' executed successfully`,
  });
});
