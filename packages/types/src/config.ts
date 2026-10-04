// Configuration management, diffing, and risk analysis

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type DiffLineType = 'ADDED' | 'REMOVED' | 'MODIFIED' | 'UNCHANGED';

export interface DiffLine {
  type: DiffLineType;
  lineNumberOld?: number;
  lineNumberNew?: number;
  content: string;
}

export interface ConfigDiff {
  id?: string;
  deviceId: string;
  baseVersion?: number;
  targetVersion?: number;
  addedLinesCount: number;
  removedLinesCount: number;
  modifiedLinesCount: number;
  diffLines: DiffLine[];
  rawDiffText: string;
}

export interface ConfigurationBackup {
  id: string;
  deviceId: string;
  backupType: 'BINARY_BACKUP' | 'RSC_EXPORT' | 'JSON_STATE';
  filename: string;
  hash: string;
  sizeBytes: number;
  content?: string;
  createdBy?: string;
  createdAt: string;
}

export interface ConfigApprovalRequest {
  id: string;
  deviceId: string;
  deviceName: string;
  command: string;
  riskLevel: RiskLevel;
  diff?: ConfigDiff;
  backupId?: string;
  reason: string;
  requestedBy: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXECUTED';
  approvedBy?: string;
  approvedAt?: string;
}

export interface ConfigApplyResult {
  success: boolean;
  backupCreated: boolean;
  backupId?: string;
  appliedCommands: string[];
  executionDurationMs: number;
  verificationPassed: boolean;
  rollbackTriggered: boolean;
  error?: string;
}
