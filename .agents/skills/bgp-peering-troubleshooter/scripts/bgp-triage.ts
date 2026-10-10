#!/usr/bin/env node
// BGP Peering Troubleshooter & Flap Diagnostics CLI Helper
// Standard Operating Procedure: skills/bgp-peering-troubleshooter

import { AIToolDispatcher } from '../../../../packages/ai-agent/dist/index.js';

interface BgpTriageResult {
  targetDevice: string;
  timestamp: string;
  summary: unknown;
  peerDiagnosis: unknown;
  healthStatus: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
}

async function runBgpTriage(peerName = 'UPSTREAM-TELKOM'): Promise<void> {
  console.log(`[BGP-TRIAGE] Initializing SOP BGP Peering Diagnostics for peer: ${peerName}...`);

  const summaryResult = await AIToolDispatcher.execute('get_bgp_summary', {});
  const diagResult = await AIToolDispatcher.execute('diagnose_bgp_peer', { peerName });

  const triage: BgpTriageResult = {
    targetDevice: 'CORE-JOGJA-01 (192.168.10.1)',
    timestamp: new Date().toISOString(),
    summary: summaryResult.result,
    peerDiagnosis: diagResult.result,
    healthStatus: diagResult.success ? 'HEALTHY' : 'DEGRADED',
  };

  console.log('\n--- BGP TRIAGE REPORT ---');
  console.log(JSON.stringify(triage, null, 2));
  console.log('-------------------------\n');
}

const targetPeer = process.argv[2] || 'UPSTREAM-TELKOM';
runBgpTriage(targetPeer).catch((err) => {
  console.error('[BGP-TRIAGE] Error executing BGP triage:', err);
  process.exit(1);
});
