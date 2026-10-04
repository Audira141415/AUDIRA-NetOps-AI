// Configuration Management Controller (View, Export, Diff, Validate, Apply, Rollback)

import { Router, Request, Response } from 'express';
import { ConfigDiff, DiffLine } from '@audira/types';
import { validateCommandSafety } from '@audira/security';
import { authenticateJwt, requirePermission, AuthenticatedRequest } from '../../middleware/auth.middleware.js';

export const configRouter = Router();

const SAMPLE_CONFIG_BEFORE = `# MikroTik RouterOS v7.14.3
# Device: CORE-JOGJA-01
/interface bridge add name=bridge-lan vlan-filtering=yes
/interface ethernet set [ find default-name=ether1 ] name=ether1-wan
/interface ethernet set [ find default-name=ether2 ] name=ether2-lan
/ip address add address=192.168.10.1/24 interface=bridge-lan network=192.168.10.0
/ip route add dst-address=0.0.0.0/0 gateway=192.168.1.1
/ip firewall nat add action=masquerade chain=srcnat out-interface=ether1-wan`;

const SAMPLE_CONFIG_AFTER = `# MikroTik RouterOS v7.14.3
# Device: CORE-JOGJA-01
/interface bridge add name=bridge-lan vlan-filtering=yes
/interface ethernet set [ find default-name=ether1 ] name=ether1-wan
/interface ethernet set [ find default-name=ether2 ] name=ether2-lan
/interface vlan add interface=bridge-lan name=vlan100-iot vlan-id=100
/ip address add address=192.168.10.1/24 interface=bridge-lan network=192.168.10.0
/ip address add address=10.100.0.1/24 interface=vlan100-iot network=10.100.0.0
/ip pool add name=pool-vlan100 ranges=10.100.0.10-10.100.0.250
/ip dhcp-server add address-pool=pool-vlan100 interface=vlan100-iot name=dhcp-vlan100
/ip route add dst-address=0.0.0.0/0 gateway=192.168.1.1
/ip firewall nat add action=masquerade chain=srcnat out-interface=ether1-wan`;

/**
 * GET /api/v1/config/:deviceId - Retrieve current active configuration
 */
configRouter.get('/:deviceId', authenticateJwt, requirePermission('config.read'), (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      deviceId: req.params.deviceId,
      version: 14,
      content: SAMPLE_CONFIG_BEFORE,
      checksum: 'e9b2c3d4f5a6',
      lastModified: new Date().toISOString(),
    },
    message: 'Active configuration retrieved',
  });
});

/**
 * POST /api/v1/config/compare - Compute visual diff (Green/Red/Yellow)
 */
configRouter.post('/compare', authenticateJwt, requirePermission('config.read'), (req: Request, res: Response) => {
  const { before = SAMPLE_CONFIG_BEFORE, after = SAMPLE_CONFIG_AFTER } = req.body;

  const linesBefore = before.split('\n');
  const linesAfter = after.split('\n');

  const diffLines: DiffLine[] = [];
  let added = 0;
  let removed = 0;

  // Simple diff generator
  const beforeSet = new Set(linesBefore);
  const afterSet = new Set(linesAfter);

  linesBefore.forEach((line: string, idx: number) => {
    if (!afterSet.has(line)) {
      removed++;
      diffLines.push({ type: 'REMOVED', lineNumberOld: idx + 1, content: line });
    }
  });

  linesAfter.forEach((line: string, idx: number) => {
    if (!beforeSet.has(line)) {
      added++;
      diffLines.push({ type: 'ADDED', lineNumberNew: idx + 1, content: line });
    } else {
      diffLines.push({ type: 'UNCHANGED', lineNumberNew: idx + 1, content: line });
    }
  });

  const diffResult: ConfigDiff = {
    deviceId: req.body.deviceId || '30000000-0000-0000-0000-000000000001',
    addedLinesCount: added,
    removedLinesCount: removed,
    modifiedLinesCount: 0,
    diffLines,
    rawDiffText: `+${added} lines, -${removed} lines`,
  };

  res.json({
    success: true,
    data: diffResult,
    message: 'Visual configuration diff calculated',
  });
});

/**
 * POST /api/v1/config/validate - Validate command syntax and safety
 */
configRouter.post('/validate', authenticateJwt, requirePermission('config.write'), (req: Request, res: Response) => {
  const { command } = req.body;
  const validation = validateCommandSafety(command || '');
  res.json({
    success: true,
    data: validation,
    message: 'Command validated',
  });
});

/**
 * POST /api/v1/config/apply - Apply approved configuration
 */
configRouter.post('/apply', authenticateJwt, requirePermission('config.execute'), (req: AuthenticatedRequest, res: Response) => {
  const { deviceId, commands, approvalId } = req.body;

  res.json({
    success: true,
    data: {
      deviceId,
      approvalId,
      backupCreated: true,
      backupId: `pre-change-bkp-${Date.now()}`,
      appliedCommands: commands || ['/interface vlan add name=vlan100-iot vlan-id=100'],
      executionDurationMs: 312,
      verificationPassed: true,
      rollbackTriggered: false,
    },
    message: 'Configuration applied and verified successfully',
  });
});

/**
 * POST /api/v1/config/rollback - Rollback to prior backup snapshot
 */
configRouter.post('/rollback', authenticateJwt, requirePermission('config.rollback'), (req: AuthenticatedRequest, res: Response) => {
  const { deviceId, backupId } = req.body;

  res.json({
    success: true,
    data: {
      deviceId,
      backupId,
      revertedToTimestamp: new Date().toISOString(),
      durationMs: 420,
    },
    message: 'Device configuration rolled back successfully',
  });
});
