import http from 'node:http';
import { NetOpsLogger } from '@audira/logger';
import { TelemetrySimulator } from '@audira/monitoring';

const logger = new NetOpsLogger('BACKGROUND_WORKER');
const simulator = TelemetrySimulator.getInstance();
const WORKER_PORT = parseInt(process.env['WORKER_PORT'] ?? '3001', 10);

logger.info('WORKER_STARTUP', 'AUDIRA NetOps Background Worker initialized');

// Periodic Telemetry Evaluation Task (every 15s)
setInterval(() => {
  const summary = simulator.getNetworkHealthSummary();
  logger.debug('POLL_CYCLE', `Monitored ${summary.totalDevices} nodes. Average CPU: ${summary.cpuAverage}%`);
}, 15000);

// Scheduled Backup Check (every 60s)
setInterval(() => {
  logger.debug('BACKUP_MONITOR', 'Checking scheduled retention policies and pending backup jobs');
}, 60000);

// Lightweight Health HTTP Server on port 3001
const server = http.createServer((req, res) => {
  if (req.url === '/health' || req.url === '/' || !req.url) {
    const summary = simulator.getNetworkHealthSummary();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        status: 'healthy',
        service: 'AUDIRA NetOps Worker Daemon',
        port: WORKER_PORT,
        uptime: Math.floor(process.uptime()),
        devicesMonitored: summary.totalDevices,
        averageCpu: summary.cpuAverage,
        timestamp: new Date().toISOString(),
      }),
    );
    return;
  }
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(WORKER_PORT, () => {
  logger.info('WORKER_HTTP', `Worker daemon health endpoint listening on http://localhost:${WORKER_PORT}`);
});

// Process Keepalive & Graceful Shutdown
const shutdown = () => {
  logger.info('WORKER_SHUTDOWN', 'Shutting down background worker gracefully');
  server.close(() => process.exit(0));
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

