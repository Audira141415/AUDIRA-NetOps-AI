// Standardized Enterprise Error Codes

export type NetOpsErrorCode =
  | 'DEVICE_UNREACHABLE'
  | 'AUTH_FAILED'
  | 'COMMAND_FAILED'
  | 'PERMISSION_DENIED'
  | 'VALIDATION_FAILED'
  | 'RISK_BLOCKED'
  | 'APPROVAL_REQUIRED'
  | 'BACKUP_FAILED'
  | 'ROLLBACK_FAILED'
  | 'AI_PROVIDER_ERROR'
  | 'TERMINAL_CONNECTION_FAILED';

export class NetOpsError extends Error {
  public readonly code: NetOpsErrorCode;
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(code: NetOpsErrorCode, message: string, statusCode: number = 400, details?: unknown) {
    super(message);
    this.name = 'NetOpsError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, NetOpsError.prototype);
  }

  public toJSON() {
    return {
      success: false,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details ?? null,
      timestamp: new Date().toISOString(),
    };
  }
}
