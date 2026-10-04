// WebSocket Live Terminal Gateway (PuTTY-like interactive session)

import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import jwt from 'jsonwebtoken';
import { AuthTokenPayload } from '@audira/types';
import { MockTerminalSession } from '@audira/terminal';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_at_least_32_characters_long_audira';

interface CustomWebSocket extends WebSocket {
  isAlive: boolean;
  user?: AuthTokenPayload;
  session?: MockTerminalSession;
}

export function setupTerminalGateway(wss: WebSocketServer): void {
  wss.on('connection', (ws: CustomWebSocket, req: IncomingMessage) => {
    const url = new URL(req.url || '', 'http://localhost');
    const token = url.searchParams.get('token');
    const deviceId = url.searchParams.get('deviceId') || '30000000-0000-0000-0000-000000000001';
    const deviceName = url.searchParams.get('deviceName') || 'CORE-JOGJA-01';

    // Verify token
    try {
      if (token) {
        ws.user = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
      } else {
        // Fallback for demo mode
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

    // Initialize terminal session handler
    ws.session = new MockTerminalSession(
      sessionId,
      deviceId,
      deviceName,
      ws.user.sub,
      (outputData: string) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'data', data: outputData }));
        }
      }
    );

    ws.on('message', (message: string) => {
      try {
        const payload = JSON.parse(message.toString());
        if (payload.type === 'data' && payload.data) {
          ws.session?.onInput(payload.data);
        } else if (payload.type === 'resize' && payload.cols && payload.rows) {
          ws.session?.resize(payload.cols, payload.rows);
        } else if (payload.type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
        }
      } catch {
        // Raw text input fallback
        ws.session?.onInput(message.toString());
      }
    });

    ws.on('close', () => {
      ws.session?.close();
    });
  });
}
