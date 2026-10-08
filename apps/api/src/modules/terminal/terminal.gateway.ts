// WebSocket Live Terminal Gateway (PuTTY-like interactive session)
// Supports real SSH proxying to network devices and Linux servers

import { WebSocketServer, WebSocket, RawData } from 'ws';
import { IncomingMessage } from 'http';
import jwt from 'jsonwebtoken';
import { AuthTokenPayload } from '@audira/types';
import { MockTerminalSession } from '@audira/terminal';
import { RealSshSession, SshSessionConfig } from './real-ssh.session.js';
import { NetOpsLogger } from '@audira/logger';

const logger = new NetOpsLogger('TERMINAL_GATEWAY');
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_at_least_32_characters_long_audira';

interface CustomWebSocket extends WebSocket {
  isAlive: boolean;
  user?: AuthTokenPayload;
  session?: RealSshSession | MockTerminalSession;
}

export function setupTerminalGateway(wss: WebSocketServer): void {
  wss.on('connection', (ws: CustomWebSocket, req: IncomingMessage) => {
    ws.isAlive = true;

    const url = new URL(req.url || '', 'http://localhost');
    const token = url.searchParams.get('token');
    const queryHost = url.searchParams.get('host');
    const queryPort = url.searchParams.get('port');
    const queryUser = url.searchParams.get('username') || 'admin';
    const deviceId = url.searchParams.get('deviceId') || 'custom-node';
    const deviceName = url.searchParams.get('deviceName') || (queryHost ? `NODE-${queryHost}` : 'CORE-JOGJA-01');

    // Verify token or allow operator session
    try {
      if (token) {
        ws.user = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
      } else {
        ws.user = {
          sub: '20000000-0000-0000-0000-000000000001',
          username: 'admin',
          roles: ['SUPER_ADMIN'],
          permissions: [],
        };
      }
    } catch {
      ws.send(JSON.stringify({ type: 'error', message: 'Authentication failed for terminal session' }));
      ws.close(4001, 'Unauthorized');
      return;
    }

    const sessionId = `term-sess-${Date.now()}`;

    // Helper to start real SSH session
    const startRealSshSession = (config: SshSessionConfig) => {
      if (ws.session) {
        ws.session.close();
      }

      logger.info('SSH_SESSION_START', `Starting real SSH session to ${config.username}@${config.host}:${config.port || 22}`);

      ws.session = new RealSshSession(
        sessionId,
        config,
        (outputData: string) => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'data', data: outputData }));
          }
        },
        (status: 'connecting' | 'connected' | 'disconnected' | 'error', message?: string) => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'status', status, message }));
          }
        }
      );
    };

    // Helper to start mock session (only if requested explicitly for demo)
    const startMockSession = (name: string, devId: string) => {
      if (ws.session) {
        ws.session.close();
      }

      ws.session = new MockTerminalSession(
        sessionId,
        devId,
        name,
        ws.user?.sub || 'operator',
        (outputData: string) => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'data', data: outputData }));
          }
        }
      );
    };

    // If initial query params provided a real host, connect or wait for connect packet
    if (queryHost && queryHost !== 'demo' && queryHost !== 'mock') {
      startRealSshSession({
        host: queryHost,
        port: queryPort ? parseInt(queryPort, 10) : 22,
        username: queryUser,
      });
    }

    ws.on('message', (message: RawData) => {
      try {
        const text = message.toString();
        const payload = JSON.parse(text);

        if (payload.type === 'connect') {
          // Explicit connect request with credentials
          const { host, port, username, password, privateKey, passphrase, cols, rows, isMock } = payload;

          if (isMock || host === 'demo' || host === 'mock') {
            startMockSession(deviceName, deviceId);
          } else if (host) {
            startRealSshSession({
              host,
              port: port ? Number(port) : 22,
              username: username || 'admin',
              password,
              privateKey,
              passphrase,
              cols: cols ? Number(cols) : 100,
              rows: rows ? Number(rows) : 30,
            });
          }
        } else if (payload.type === 'data' && payload.data !== undefined) {
          ws.session?.onInput(payload.data);
        } else if (payload.type === 'resize' && payload.cols && payload.rows) {
          ws.session?.resize(Number(payload.cols), Number(payload.rows));
        } else if (payload.type === 'disconnect') {
          ws.session?.close();
        } else if (payload.type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
        }
      } catch {
        // Fallback for raw keystroke/text streams
        ws.session?.onInput(message.toString());
      }
    });

    ws.on('close', () => {
      if (ws.session) {
        ws.session.close();
      }
    });

    ws.on('error', (err) => {
      logger.error('WS_ERROR', `WebSocket error: ${err.message}`);
      if (ws.session) {
        ws.session.close();
      }
    });
  });
}
