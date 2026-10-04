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
 * Validates command safety and generates actionable risk details.
 */
export function validateCommandSafety(command: string): ValidationResult {
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

  return {
    isValid: blockReasons.length === 0,
    riskLevel: risk,
    warnings,
    blockReasons,
    suggestedAction:
      risk === 'CRITICAL'
        ? 'Require 2-person signoff or manual console access'
        : risk === 'HIGH'
        ? 'Generate backup and request peer approval before applying'
        : 'Safe to proceed after validation',
  };
}
