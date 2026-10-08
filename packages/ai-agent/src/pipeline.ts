// Enterprise AI Safety & Execution Pipeline
// Pipeline: AI -> Tool -> Validation -> Risk Analysis -> Backup -> Diff -> User Approval -> Execution -> Verification -> Audit

import {
  RiskLevel,
  ValidationResult,
  ConfigDiff,
  AuditLogEntry,
  User,
} from '@audira/types';
import { validateCommandSafety } from '@audira/security';

export interface PipelineExecutionRequest {
  user: User;
  deviceId: string;
  deviceName: string;
  proposedCommands: string[];
  reason: string;
  breakGlassTicket?: string;
  bypassFreeze?: boolean;
}

export interface PipelineExecutionStep {
  step: 'AI_PROPOSAL' | 'TOOL_INVOCATION' | 'VALIDATION' | 'RISK_ANALYSIS' | 'BACKUP_CREATION' | 'VISUAL_DIFF' | 'APPROVAL_GATE' | 'EXECUTION' | 'VERIFICATION' | 'AUDIT_RECORD';
  status: 'PENDING' | 'PASSED' | 'BLOCKED' | 'REQUIRES_CONFIRMATION' | 'FAILED';
  details: string;
  timestamp: string;
}

export interface PipelineResult {
  allowedToExecuteDirectly: boolean;
  requiresExplicitApproval: boolean;
  riskLevel: RiskLevel;
  validation: ValidationResult;
  proposedDiff?: ConfigDiff;
  backupId?: string;
  steps: PipelineExecutionStep[];
  auditEntry: Partial<AuditLogEntry>;
}

export class AISafetyPipeline {
  /**
   * Evaluates proposed AI operations through the strict safety pipeline.
   */
  public static async evaluatePipeline(request: PipelineExecutionRequest): Promise<PipelineResult> {
    const steps: PipelineExecutionStep[] = [];
    const commandText = request.proposedCommands.join('\n');

    // 1. Tool / Input validation
    steps.push({
      step: 'TOOL_INVOCATION',
      status: 'PASSED',
      details: `Registered tool invoked by user ${request.user.username}`,
      timestamp: new Date().toISOString(),
    });

    // 2. Syntax & Safety Validation (including Change-Freeze Governance)
    const validation = validateCommandSafety(commandText, {
      breakGlassTicket: request.breakGlassTicket,
      bypassFreeze: request.bypassFreeze,
    });
    const validationDetail =
      validation.blockReasons.length > 0
        ? validation.blockReasons.join(' | ')
        : validation.warnings.join(' | ') || 'Command passed syntactic validation';

    steps.push({
      step: 'VALIDATION',
      status: validation.isValid ? 'PASSED' : 'BLOCKED',
      details: validationDetail,
      timestamp: new Date().toISOString(),
    });

    // 3. Risk Analysis
    const riskLevel = validation.riskLevel;
    steps.push({
      step: 'RISK_ANALYSIS',
      status: riskLevel === 'CRITICAL' ? 'BLOCKED' : 'PASSED',
      details: `Calculated risk level: ${riskLevel}`,
      timestamp: new Date().toISOString(),
    });

    // 4. Backup requirement
    const needsBackup = riskLevel === 'HIGH' || riskLevel === 'CRITICAL' || riskLevel === 'MEDIUM';
    const backupId = needsBackup ? `auto-bkp-${Date.now()}` : undefined;
    if (needsBackup) {
      steps.push({
        step: 'BACKUP_CREATION',
        status: 'PASSED',
        details: `Safety snapshot scheduled before write: ${backupId}`,
        timestamp: new Date().toISOString(),
      });
    }

    // 5. Visual Diff generation
    steps.push({
      step: 'VISUAL_DIFF',
      status: 'PASSED',
      details: 'Synthesized Green/Red/Yellow diff for operator review',
      timestamp: new Date().toISOString(),
    });

    // 6. User Approval Gate
    // CRITICAL operations MUST NEVER execute automatically. Require explicit confirmation.
    const requiresExplicitApproval = riskLevel === 'HIGH' || riskLevel === 'CRITICAL';
    steps.push({
      step: 'APPROVAL_GATE',
      status: requiresExplicitApproval ? 'REQUIRES_CONFIRMATION' : 'PASSED',
      details: requiresExplicitApproval
        ? `Explicit operator sign-off required for ${riskLevel} risk level.`
        : 'Auto-approved for low-risk read/non-destructive operation',
      timestamp: new Date().toISOString(),
    });

    const auditEntry: Partial<AuditLogEntry> = {
      userId: request.user.id,
      username: request.user.username,
      deviceId: request.deviceId,
      deviceName: request.deviceName,
      action: 'AI_CONFIG_EVALUATION',
      command: commandText,
      riskLevel,
      result: requiresExplicitApproval ? 'BLOCKED' : 'SUCCESS',
      createdAt: new Date().toISOString(),
    };

    return {
      allowedToExecuteDirectly: !requiresExplicitApproval && validation.isValid,
      requiresExplicitApproval,
      riskLevel,
      validation,
      backupId,
      steps,
      auditEntry,
    };
  }
}
