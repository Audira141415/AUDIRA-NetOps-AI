// Structured JSON Logger with Secret Sanitization

import { maskSecrets, sanitizeObject } from '@audira/security';

export interface StructuredLogPayload {
  timestamp?: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  service: string;
  requestId?: string;
  userId?: string;
  deviceId?: string;
  action: string;
  result?: string;
  duration?: number;
  message: string;
  metadata?: Record<string, unknown>;
}

export class NetOpsLogger {
  private service: string;

  constructor(service: string) {
    this.service = service;
  }

  public info(action: string, message: string, payload?: Partial<StructuredLogPayload>): void {
    this.log('info', action, message, payload);
  }

  public warn(action: string, message: string, payload?: Partial<StructuredLogPayload>): void {
    this.log('warn', action, message, payload);
  }

  public error(action: string, message: string, payload?: Partial<StructuredLogPayload>): void {
    this.log('error', action, message, payload);
  }

  public debug(action: string, message: string, payload?: Partial<StructuredLogPayload>): void {
    this.log('debug', action, message, payload);
  }

  private log(
    level: 'info' | 'warn' | 'error' | 'debug',
    action: string,
    message: string,
    payload?: Partial<StructuredLogPayload>
  ): void {
    const sanitizedMsg = maskSecrets(message);
    const sanitizedMeta = payload?.metadata ? sanitizeObject(payload.metadata) : undefined;

    const entry: StructuredLogPayload = {
      timestamp: new Date().toISOString(),
      level,
      service: this.service,
      action,
      message: sanitizedMsg,
      requestId: payload?.requestId,
      userId: payload?.userId,
      deviceId: payload?.deviceId,
      result: payload?.result,
      duration: payload?.duration,
      metadata: sanitizedMeta,
    };

    const serialized = JSON.stringify(entry);
    if (level === 'error') {
      console.error(serialized);
    } else if (level === 'warn') {
      console.warn(serialized);
    } else {
      console.log(serialized);
    }
  }
}
