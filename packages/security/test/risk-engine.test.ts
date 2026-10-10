import { describe, it, expect } from 'vitest';
import {
  evaluateCommandRisk,
  validateCommandSafety,
  requiresDualApproval,
  requiresPreFlightBackup,
} from '../src/risk-engine.js';

describe('Risk Engine Security Evaluation', () => {
  it('should flag destructive system commands as CRITICAL', () => {
    const criticalCommands = [
      '/system reset-configuration no-defaults=yes',
      '/system reboot',
      'system shutdown',
      'rm -rf /',
    ];

    for (const cmd of criticalCommands) {
      const level = evaluateCommandRisk(cmd);
      expect(level).toBe('CRITICAL');
      expect(requiresDualApproval(cmd)).toBe(true);
      expect(requiresPreFlightBackup(cmd)).toBe(true);
    }
  });

  it('should flag interface and routing modifications as HIGH', () => {
    const highCommands = [
      '/ip route add dst-address=0.0.0.0/0 gateway=192.168.1.1',
      '/interface ethernet set ether1 disabled=yes',
      '/ip firewall filter add chain=forward action=drop',
    ];

    for (const cmd of highCommands) {
      const level = evaluateCommandRisk(cmd);
      expect(level).toBe('HIGH');
    }
  });

  it('should evaluate read-only inspection commands as LOW risk', () => {
    const safeCommands = [
      '/system resource print',
      '/interface print stats',
      '/ip route print',
      '/ping 8.8.8.8 count=4',
    ];

    for (const cmd of safeCommands) {
      const level = evaluateCommandRisk(cmd);
      expect(level).toBe('LOW');
      expect(requiresDualApproval(cmd)).toBe(false);
    }
  });

  it('should reject blacklisted dangerous commands in validation', () => {
    const result = validateCommandSafety('/system reset-configuration');
    expect(result.isValid).toBe(false);
    expect(result.blockReasons.length).toBeGreaterThan(0);
  });

  it('should approve valid commands without blacklisted keywords', () => {
    const result = validateCommandSafety('/interface monitor-traffic ether1');
    expect(result.isValid).toBe(true);
    expect(result.blockReasons).toHaveLength(0);
  });
});
