// Enterprise Audit Logging types

import { RiskLevel } from './config.js';

export type AuditActionResult = 'SUCCESS' | 'FAILED' | 'REJECTED' | 'BLOCKED';

export interface AuditLogEntry {
  id: string;
  userId?: string;
  username?: string;
  deviceId?: string;
  deviceName?: string;
  action: string;
  command?: string; // Sanitized and masked
  riskLevel: RiskLevel;
  approvalStatus?: string;
  approvedBy?: string;
  result: AuditActionResult;
  errorDetails?: string;
  executionDurationMs?: number;
  clientIp?: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface AuditLogFilter {
  userId?: string;
  deviceId?: string;
  startDate?: string;
  endDate?: string;
  riskLevel?: RiskLevel;
  command?: string;
  result?: AuditActionResult;
  limit?: number;
  offset?: number;
}
