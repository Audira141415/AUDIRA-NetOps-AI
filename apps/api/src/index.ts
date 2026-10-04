// AUDIRA NetOps AI - Backend Entrypoint
// Express REST API + WebSocket Server

import http from 'http';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { NetOpsLogger } from '@audira/logger';
import { NetOpsError } from '@audira/types';

import { authRouter } from './modules/auth/auth.controller.js';
import { deviceRouter } from './modules/devices/device.controller.js';
import { monitoringRouter } from './modules/monitoring/monitoring.controller.js';
import { configRouter } from './modules/config/config.controller.js';
import { backupRouter } from './modules/backups/backup.controller.js';
import { alertRouter } from './modules/alerts/alert.controller.js';
import { aiRouter } from './modules/ai/ai.controller.js';
import { automationRouter } from './modules/automation/automation.controller.js';
import { auditRouter } from './modules/audit/audit.controller.js';
import { notificationRouter } from './modules/notifications/notification.controller.js';
import { setupTerminalGateway } from './modules/terminal/terminal.gateway.js';

const logger = new NetOpsLogger('API_GATEWAY');
const app = express();
const server = http.createServer(app);

// WebSocket Server
const wss = new WebSocketServer({ server, path: '/ws' });
setupTerminalGateway(wss);

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '20mb' }));

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    logger.info('HTTP_REQUEST', `${req.method} ${req.originalUrl} [${res.statusCode}]`, {
      duration: Date.now() - start,
      result: res.statusCode < 400 ? 'SUCCESS' : 'ERROR',
    });
  });
  next();
});

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'AUDIRA NetOps AI Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// REST API V1 Routes
const API_PREFIX = '/api/v1';
app.use(`${API_PREFIX}/auth`, authRouter);
app.use(`${API_PREFIX}/devices`, deviceRouter);
app.use(`${API_PREFIX}/monitoring`, monitoringRouter);
app.use(`${API_PREFIX}/config`, configRouter);
app.use(`${API_PREFIX}/backups`, backupRouter);
app.use(`${API_PREFIX}/alerts`, alertRouter);
app.use(`${API_PREFIX}/ai`, aiRouter);
app.use(`${API_PREFIX}/automation`, automationRouter);
app.use(`${API_PREFIX}/audit`, auditRouter);
app.use(`${API_PREFIX}/audit-logs`, auditRouter); // Alias
app.use(`${API_PREFIX}/notifications`, notificationRouter);

// Centralized Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error('UNHANDLED_EXCEPTION', err.message, { metadata: { stack: err.stack } });

  if (err instanceof NetOpsError) {
    res.status(err.statusCode).json(err.toJSON());
    return;
  }

  res.status(500).json({
    success: false,
    code: 'COMMAND_FAILED',
    message: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  logger.info('SERVER_STARTUP', `AUDIRA NetOps AI Backend running on port ${PORT}`);
  console.log(`\n======================================================`);
  console.log(`🚀 AUDIRA NetOps AI Backend is live on http://localhost:${PORT}`);
  console.log(`📡 WebSocket endpoint ready at ws://localhost:${PORT}/ws`);
  console.log(`======================================================\n`);
});

export { app, server };
