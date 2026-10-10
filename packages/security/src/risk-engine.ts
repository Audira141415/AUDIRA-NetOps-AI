// Command Risk Evaluation Engine

import { RiskLevel, ValidationResult } from '@audira/types';

// Patterns categorized by severity
const CRITICAL_PATTERNS = [
  /system\s+reset-configuration/i,
  /system\s+reboot/i,
  /system\s+shutdown/i,
  /user\s+remove/i,
  /firewall\s+filter\s+remove\s+\[\s*find\s*\]/i,
  /ip\s+address\s+remove\s+\[\s*find\s*\]/i,
  /interface\s+bridge\s+port\s+remove\s+\[\s*find\s*\]/i,
  /file\s+remove/i,
  /format-drive/i,
  /flash\s+erase/i,
  /rm\s+-rf\s+\//i,
  /drop\s+database/i,
];

const HIGH_PATTERNS = [
  /ip\s+route\s+(add|remove|set)/i,
  /ip\s+firewall\s+(filter|nat|mangle|raw)\s+(add|remove|set)/i,
  /interface\s+(ethernet|bridge|vlan|bonding)\s+(set|disable|enable|remove)/i,
  /interface\s+wireguard/i,
  /routing\s+bgp/i,
  /routing\s+ospf/i,
  /ip\s+address\s+(add|remove|set)/i,
  /ip\s+pool\s+(add|remove|set)/i,
  /ip\s+dhcp-server/i,
];

const MEDIUM_PATTERNS = [
  /system\s+identity\s+set/i,
  /system\s+note\s+set/i,
  /system\s+ntp\s+client/i,
  /system\s+logging/i,
  /system\s+script/i,
  /system\s+scheduler/i,
  /comment\s*=/i,
  /interface\s+list\s+member\s+add/i,
];

/**
 * Evaluates the risk level of any command (RouterOS CLI, SSH, or Generic Shell).
 */
export function evaluateCommandRisk(command: string): RiskLevel {
  const normalized = command.trim();

  // Check CRITICAL first
  for (const pattern of CRITICAL_PATTERNS) {
    if (pattern.test(normalized)) {
      return 'CRITICAL';
    }
  }

  // Check HIGH next
  for (const pattern of HIGH_PATTERNS) {
    if (pattern.test(normalized)) {
      return 'HIGH';
    }
  }

  // Check MEDIUM next
  for (const pattern of MEDIUM_PATTERNS) {
    if (pattern.test(normalized)) {
      return 'MEDIUM';
    }
  }

  // Check if command is modifying state (e.g. contains add, set, remove, enable, disable)
  if (/\b(add|set|remove|edit|enable|disable|delete)\b/i.test(normalized)) {
    return 'MEDIUM';
  }

  // Otherwise, read-only
  return 'LOW';
}

/**
 * Returns true if the command performs critical/destructive actions requiring dual-operator signoff.
 */
export function requiresDualApproval(command: string): boolean {
  return evaluateCommandRisk(command) === 'CRITICAL';
}

/**
 * Returns true if the command modifies network state and mandates pre-flight RSC snapshot.
 */
export function requiresPreFlightBackup(command: string): boolean {
  const risk = evaluateCommandRisk(command);
  return risk === 'CRITICAL' || risk === 'HIGH';
}

/**
 * Types of Change Freeze Windows.
 */
export type ChangeFreezeWindowType =
  | 'PEAK_FREEZE'
  | 'MAINTENANCE_WINDOW'
  | 'OFF_PEAK'
  | 'HARD_FREEZE';

/**
 * Configuration options for Enterprise Change-Freeze Windows.
 */
export interface ChangeFreezeConfig {
  peakStartHour: number; // e.g. 8 (08:00 WIB)
  peakEndHour: number; // e.g. 22 (22:00 WIB)
  maintenanceStartHour: number; // e.g. 1 (01:00 WIB)
  maintenanceEndHour: number; // e.g. 5 (05:00 WIB)
  timezoneOffsetHours: number; // default: 7 (UTC+7 / WIB)
  hardFreezeDates?: string[]; // Array of YYYY-MM-DD
}

/**
 * Result of evaluating change freeze status against a given timestamp.
 */
export interface ChangeFreezeEvaluation {
  isFreezeActive: boolean;
  windowType: ChangeFreezeWindowType;
  currentLocalTime: string;
  reason: string;
  allowsModification: boolean;
}

/**
 * Options passed to validateCommandSafety for contextual enforcement.
 */
export interface ValidationOptions {
  bypassFreeze?: boolean;
  breakGlassTicket?: string;
  currentDate?: Date;
  freezeConfig?: Partial<ChangeFreezeConfig>;
}

/**
 * Evaluates whether the specified timestamp falls within an enterprise Change-Freeze window.
 * Default timezone is UTC+7 (WIB - Western Indonesian Time).
 */
export function evaluateChangeFreezeWindow(
  date: Date = new Date(),
  config?: Partial<ChangeFreezeConfig>
): ChangeFreezeEvaluation {
  const cfg: ChangeFreezeConfig = {
    peakStartHour: 8,
    peakEndHour: 22,
    maintenanceStartHour: 1,
    maintenanceEndHour: 5,
    timezoneOffsetHours: 7,
    hardFreezeDates: [],
    ...config,
  };

  const utcTime = date.getTime() + date.getTimezoneOffset() * 60000;
  const localTarget = new Date(utcTime + 3600000 * cfg.timezoneOffsetHours);

  const hour = localTarget.getHours();
  const minutes = localTarget.getMinutes();
  const year = localTarget.getFullYear();
  const month = String(localTarget.getMonth() + 1).padStart(2, '0');
  const day = String(localTarget.getDate()).padStart(2, '0');
  const dateString = `${year}-${month}-${day}`;
  const timeString = `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  const formattedLocalTime = `${dateString} ${timeString} WIB`;

  // 1. Check Hard Freeze Dates
  if (cfg.hardFreezeDates && cfg.hardFreezeDates.includes(dateString)) {
    return {
      isFreezeActive: true,
      windowType: 'HARD_FREEZE',
      currentLocalTime: formattedLocalTime,
      reason: `Date ${dateString} is under an enterprise HARD CHANGE FREEZE (national holiday or critical business event).`,
      allowsModification: false,
    };
  }

  // 2. Check Peak Freeze (08:00 - 22:00)
  if (hour >= cfg.peakStartHour && hour < cfg.peakEndHour) {
    return {
      isFreezeActive: true,
      windowType: 'PEAK_FREEZE',
      currentLocalTime: formattedLocalTime,
      reason: `Current time ${timeString} WIB is within PEAK CHANGE FREEZE (${cfg.peakStartHour}:00 - ${cfg.peakEndHour}:00 WIB). All state-modifying operations are restricted to protect peak customer traffic.`,
      allowsModification: false,
    };
  }

  // 3. Check Standard Maintenance Window (01:00 - 05:00)
  if (hour >= cfg.maintenanceStartHour && hour < cfg.maintenanceEndHour) {
    return {
      isFreezeActive: false,
      windowType: 'MAINTENANCE_WINDOW',
      currentLocalTime: formattedLocalTime,
      reason: `Current time ${timeString} WIB is within STANDARD MAINTENANCE WINDOW (${cfg.maintenanceStartHour}:00 - ${cfg.maintenanceEndHour}:00 WIB). Scheduled changes permitted with standard approvals.`,
      allowsModification: true,
    };
  }

  // 4. Off-Peak Transition Window (22:00 - 01:00 & 05:00 - 08:00)
  return {
    isFreezeActive: false,
    windowType: 'OFF_PEAK',
    currentLocalTime: formattedLocalTime,
    reason: `Current time ${timeString} WIB is in OFF-PEAK TRANSITION window. Low/Medium changes permitted.`,
    allowsModification: true,
  };
}

/**
 * Convenience helper to check if a change freeze is active.
 */
export function isChangeFreezeActive(
  date?: Date,
  config?: Partial<ChangeFreezeConfig>
): boolean {
  return evaluateChangeFreezeWindow(date, config).isFreezeActive;
}

/**
 * Validates command safety and generates actionable risk details.
 * Incorporates Change-Freeze Window policy and Emergency Break-Glass validation.
 */
export function validateCommandSafety(
  command: string,
  options?: ValidationOptions
): ValidationResult {
  const risk = evaluateCommandRisk(command);
  const warnings: string[] = [];
  const blockReasons: string[] = [];

  if (risk === 'CRITICAL') {
    blockReasons.push('Command performs destructive operations (reset, mass removal, or service shutdown).');
    blockReasons.push('Automated or unconfirmed execution of CRITICAL commands is strictly prohibited.');
  } else if (risk === 'HIGH') {
    warnings.push('Command modifies routing, firewall, or interfaces. Connectivity disruption may occur.');
    warnings.push('Pre-execution backup and visual diff review is mandatory.');
  } else if (risk === 'MEDIUM') {
    warnings.push('Command alters device state or metadata.');
  }

  // Change Freeze Window Governance for state-modifying operations
  if (risk !== 'LOW') {
    const freezeEval = evaluateChangeFreezeWindow(options?.currentDate, options?.freezeConfig);
    if (freezeEval.isFreezeActive) {
      const hasBreakGlassTicket = Boolean(
        options?.breakGlassTicket &&
        /^(INC|CHG|EMRG)-[0-9a-zA-Z_-]+/i.test(options.breakGlassTicket.trim())
      );
      const isBypassed = Boolean(options?.bypassFreeze || hasBreakGlassTicket);

      if (isBypassed) {
        warnings.push(
          `[CHANGE FREEZE BREAK-GLASS OVERRIDE] Modification permitted during ${freezeEval.windowType} (${freezeEval.currentLocalTime}) under ticket ${options?.breakGlassTicket || 'MANUAL-OVERRIDE'}. Immediate snapshot and NOC broadcast mandatory.`
        );
      } else {
        blockReasons.push(
          `[CHANGE FREEZE ACTIVE] ${freezeEval.reason} State-modifying operations require an Emergency Break-Glass Ticket (e.g. INC-XXXXX).`
        );
      }
    }
  }

  const isFreezeBlocked = blockReasons.some((r) => r.includes('CHANGE FREEZE ACTIVE'));

  return {
    isValid: blockReasons.length === 0,
    riskLevel: risk,
    warnings,
    blockReasons,
    suggestedAction:
      risk === 'CRITICAL'
        ? 'Require 2-person signoff or manual console access'
        : isFreezeBlocked
        ? 'Wait for Maintenance Window (01:00 - 05:00 WIB) or submit Emergency Break-Glass Ticket (INC-XXXXX)'
        : risk === 'HIGH'
        ? 'Generate backup and request peer approval before applying'
        : 'Safe to proceed after validation',
  };
}
