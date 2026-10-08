// Dual-Operator "Four-Eyes" Quorum Engine
// Enforces Segregation of Duties (SoD) and 2-person signoff for CRITICAL network operations

import * as crypto from 'crypto';
import { User, SystemRole, RiskLevel } from '@audira/types';

export type FourEyesStatus =
  | 'PENDING_SECOND_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'EXPIRED';

export interface FourEyesApprovalRequest {
  requestId: string;
  deviceId: string;
  deviceName: string;
  proposedCommands: string[];
  riskLevel: RiskLevel;
  reason: string;
  initiator: {
    userId: string;
    username: string;
    role: SystemRole;
  };
  approver?: {
    userId: string;
    username: string;
    role: SystemRole;
    approvedAt: string;
    signature: string;
  };
  rejectedBy?: {
    userId: string;
    username: string;
    rejectedAt: string;
    rejectionReason: string;
  };
  status: FourEyesStatus;
  commandsHash: string;
  createdAt: string;
  expiresAt: string;
}

export interface FourEyesSignoffResult {
  success: boolean;
  request: FourEyesApprovalRequest;
  error?: string;
}

export class FourEyesEngine {
  private static readonly DEFAULT_TTL_MINUTES = 15;

  /**
   * Generates a deterministic SHA256 digest of normalized commands
   */
  public static hashCommands(commands: string[]): string {
    const payload = commands.map((c) => c.trim()).join('\n');
    return crypto.createHash('sha256').update(payload).digest('hex');
  }

  /**
   * Initiates a Four-Eyes approval request for CRITICAL or high-impact actions
   */
  public static createRequest(params: {
    requestId?: string;
    deviceId: string;
    deviceName: string;
    proposedCommands: string[];
    riskLevel?: RiskLevel;
    reason: string;
    initiator: User;
    ttlMinutes?: number;
  }): FourEyesApprovalRequest {
    const ttl = params.ttlMinutes ?? this.DEFAULT_TTL_MINUTES;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + ttl * 60 * 1000).toISOString();
    const primaryRole = params.initiator.roles[0] || 'NOC_OPERATOR';

    return {
      requestId: params.requestId || `4eyes-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
      deviceId: params.deviceId,
      deviceName: params.deviceName,
      proposedCommands: params.proposedCommands,
      riskLevel: params.riskLevel || 'CRITICAL',
      reason: params.reason,
      initiator: {
        userId: params.initiator.id,
        username: params.initiator.username,
        role: primaryRole,
      },
      status: 'PENDING_SECOND_APPROVAL',
      commandsHash: this.hashCommands(params.proposedCommands),
      createdAt: now.toISOString(),
      expiresAt,
    };
  }

  /**
   * Evaluates the second reviewer's sign-off under strict Segregation of Duties (SoD)
   */
  public static evaluateSignoff(
    request: FourEyesApprovalRequest,
    reviewer: User,
    signingSecret = 'AUDIRA_QUORUM_SECRET'
  ): FourEyesSignoffResult {
    const now = new Date();

    // 1. Check expiration
    if (now > new Date(request.expiresAt)) {
      request.status = 'EXPIRED';
      return {
        success: false,
        request,
        error: 'Approval request expired (15-minute TTL exceeded). A fresh proposal must be submitted.',
      };
    }

    // 2. Strict Segregation of Duties (Anti-Self-Approval)
    if (reviewer.id === request.initiator.userId) {
      return {
        success: false,
        request,
        error: 'Segregation of Duties Violation: Initiator cannot approve their own Four-Eyes proposal.',
      };
    }

    // 3. Authorization check: Reviewer must possess senior engineering role
    const allowedRoles: SystemRole[] = ['SUPER_ADMIN', 'NETWORK_ADMIN', 'NETWORK_ENGINEER'];
    const hasAuthorizedRole = reviewer.roles.some((r) => allowedRoles.includes(r));
    if (!hasAuthorizedRole) {
      return {
        success: false,
        request,
        error: `Reviewer role '${reviewer.roles.join(', ')}' is insufficient. Requires NETWORK_ADMIN or SUPER_ADMIN.`,
      };
    }

    // 4. Generate cryptographic HMAC signature
    const signaturePayload = `${request.requestId}:${reviewer.id}:${request.commandsHash}:${now.toISOString()}`;
    const signature = crypto
      .createHmac('sha256', signingSecret)
      .update(signaturePayload)
      .digest('hex');

    const reviewerPrimaryRole = reviewer.roles[0] || 'NETWORK_ADMIN';

    request.status = 'APPROVED';
    request.approver = {
      userId: reviewer.id,
      username: reviewer.username,
      role: reviewerPrimaryRole,
      approvedAt: now.toISOString(),
      signature,
    };

    return {
      success: true,
      request,
    };
  }

  /**
   * Rejects a pending Four-Eyes proposal
   */
  public static rejectRequest(
    request: FourEyesApprovalRequest,
    reviewer: User,
    rejectionReason: string
  ): FourEyesSignoffResult {
    request.status = 'REJECTED';
    request.rejectedBy = {
      userId: reviewer.id,
      username: reviewer.username,
      rejectedAt: new Date().toISOString(),
      rejectionReason: rejectionReason || 'Rejected by peer review',
    };

    return {
      success: true,
      request,
    };
  }

  /**
   * Returns true if request is fully authorized with dual signatures
   */
  public static isApprovalAuthorized(request: FourEyesApprovalRequest): boolean {
    return (
      request.status === 'APPROVED' &&
      Boolean(request.approver?.userId) &&
      request.approver?.userId !== request.initiator.userId &&
      new Date() <= new Date(request.expiresAt)
    );
  }
}
