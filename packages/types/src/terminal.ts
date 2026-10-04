// Terminal types & WebSocket streaming protocols

export type TerminalSessionStatus = 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'ERROR';

export interface TerminalTab {
  id: string;
  deviceId: string;
  deviceName: string;
  deviceIp: string;
  status: TerminalSessionStatus;
  latencyMs: number;
  buffer: string;
}

export interface TerminalResizePayload {
  cols: number;
  rows: number;
}

export interface TerminalMessagePayload {
  type: 'data' | 'resize' | 'ping' | 'pong' | 'status' | 'error';
  data?: string;
  cols?: number;
  rows?: number;
  latencyMs?: number;
  message?: string;
}

export interface TerminalSessionRecord {
  id: string;
  deviceId: string;
  userId: string;
  clientIp?: string;
  status: 'ACTIVE' | 'CLOSED' | 'TERMINATED';
  startedAt: string;
  endedAt?: string;
}

export interface TerminalCommandLog {
  id: string;
  sessionId: string;
  commandText: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  executedAt: string;
}
