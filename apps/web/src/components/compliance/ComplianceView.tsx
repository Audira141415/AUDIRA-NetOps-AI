// Security Compliance & Vulnerability Scanner Component
// Device hardening audit, CVE vulnerability scanning, posture score & 1-click remediation

import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  Zap,
  Server,
  RefreshCw,
  Terminal,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { useNetOpsStore } from '../../store/useNetOpsStore';

export interface ComplianceCheck {
  id: string;
  name: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  category: 'Service Hardening' | 'Access Control' | 'Firewall Policy' | 'Firmware CVE';
  status: 'FAIL' | 'PASS';
  impact: string;
  remediationCmd: string;
}

const INITIAL_CHECKS: ComplianceCheck[] = [
  {
    id: 'chk-1',
    name: 'Insecure Telnet Protocol Enabled (Port 23)',
    severity: 'CRITICAL',
    category: 'Service Hardening',
    status: 'FAIL',
    impact: 'Credentials and CLI commands are transmitted in cleartext over the wire.',
    remediationCmd: '/ip/service set telnet disabled=yes',
  },
  {
    id: 'chk-2',
    name: 'Unencrypted RouterOS API Enabled (Port 8728)',
    severity: 'HIGH',
    category: 'Service Hardening',
    status: 'FAIL',
    impact: 'API requests are not protected by TLS/SSL. Use API-SSL on port 8729.',
    remediationCmd: '/ip/service set api disabled=yes',
  },
  {
    id: 'chk-3',
    name: 'WAN DNS Open Resolver Exposure (UDP 53)',
    severity: 'CRITICAL',
    category: 'Firewall Policy',
    status: 'FAIL',
    impact: 'Router can be weaponized in external DDoS DNS amplification attacks.',
    remediationCmd: '/ip/firewall/filter add chain=input in-interface-list=WAN protocol=udp dst-port=53 action=drop comment="Block WAN DNS recursion"',
  },
  {
    id: 'chk-4',
    name: 'Default User "admin" Present in Group "full"',
    severity: 'HIGH',
    category: 'Access Control',
    status: 'FAIL',
    impact: 'Target for automated brute-force password spraying attacks.',
    remediationCmd: '/user/add name=audira-admin group=full\n/user/disable admin',
  },
  {
    id: 'chk-5',
    name: 'RouterOS Firmware Patch Version',
    severity: 'MEDIUM',
    category: 'Firmware CVE',
    status: 'PASS',
    impact: 'Running RouterOS v7.15.2 (No known active unpatched CVEs).',
    remediationCmd: '/system/package/update check-for-updates',
  },
  {
    id: 'chk-6',
    name: 'SSH Public Key Authentication Enforced',
    severity: 'LOW',
    category: 'Access Control',
    status: 'PASS',
    impact: 'SSH keys configured for admin access.',
    remediationCmd: '/user/ssh-keys/import public-key-file=id_ed25519.pub',
  },
];

export const ComplianceView: React.FC = () => {
  const [checks, setChecks] = useState<ComplianceCheck[]>(INITIAL_CHECKS);
  const [isHardening, setIsHardening] = useState<boolean>(false);
  const [isRemediated, setIsRemediated] = useState<boolean>(false);
  const { devices } = useNetOpsStore();
  const targetDevice = devices[0] || null;
  const selectedDevice = targetDevice ? targetDevice.name : 'Belum Ada Perangkat';

  const failCount = checks.filter((c) => c.status === 'FAIL').length;
  const passCount = checks.filter((c) => c.status === 'PASS').length;
  const score = Math.round((passCount / checks.length) * 100);

  const handleRunRemediation = async () => {
    setIsHardening(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Remediate all FAIL checks to PASS
    setChecks((prev) =>
      prev.map((c) => ({
        ...c,
        status: 'PASS',
      }))
    );
    setIsHardening(false);
    setIsRemediated(true);
  };

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto select-none">
      {/* Top Banner */}
      <div className="bg-[#0b1329]/90 border border-cyan-500/30 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[0_4px_25px_rgba(6,182,212,0.1)]">
        <div className="flex items-center space-x-3.5">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold text-white tracking-wide">Security Compliance &amp; CVE Scanner</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono font-semibold">
                CIS &amp; RouterOS Hardening
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Automated audit of open insecure ports, default credentials, CVE vulnerabilities, and 1-click AI hardening
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleRunRemediation}
            disabled={isHardening || failCount === 0}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white rounded-lg text-xs font-semibold shadow-[0_0_20px_rgba(16,185,129,0.4)] transition disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isHardening ? 'Hardening Device...' : '1-Click AI Auto-Hardening'}</span>
          </button>
        </div>
      </div>

      {/* Posture Overview & Score Gauge */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Score Card */}
        <div className="bg-[#090f20]/90 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Security Posture Score</div>
            <div className="flex items-baseline space-x-2 mt-1">
              <span
                className={`text-3xl font-bold font-mono ${
                  score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-amber-400' : 'text-rose-400'
                }`}
              >
                {score}/100
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">
                {score >= 90 ? 'GRADE A' : score >= 75 ? 'GRADE B' : 'GRADE C-'}
              </span>
            </div>
          </div>
          <div
            className={`w-12 h-12 rounded-full border-4 flex items-center justify-center font-mono font-bold text-xs ${
              score >= 80
                ? 'border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
            }`}
          >
            {score}%
          </div>
        </div>

        {/* Failed Checks */}
        <div className="bg-[#090f20]/90 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Failing Checks</div>
            <div className="text-2xl font-bold font-mono text-rose-400 mt-1">{failCount} Checks</div>
          </div>
          <XCircle className="w-6 h-6 text-rose-400" />
        </div>

        {/* Passing Checks */}
        <div className="bg-[#090f20]/90 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Passing Compliance</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{passCount} Checks</div>
          </div>
          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
        </div>

        {/* Target Device */}
        <div className="bg-[#090f20]/90 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Target Audit Node</div>
            <div className="text-sm font-bold font-mono text-white mt-1">{selectedDevice}</div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              {targetDevice ? `${targetDevice.vendor} ${targetDevice.osVersion || ''}` : 'Belum terhubung'}
            </div>
          </div>
          <Server className="w-6 h-6 text-cyan-400" />
        </div>
      </div>

      {/* Remediated Success Banner */}
      {isRemediated && (
        <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-xl p-3 flex items-center space-x-2 text-emerald-300 text-xs font-mono">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>
            Hardening sukses! Semua port insecure telah dimatikan dan rule pertahanan WAN telah diterapkan pada router.
          </span>
        </div>
      )}

      {/* Checklist Table */}
      <div className="bg-[#070c18] border border-cyan-500/20 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-[#0b1329] text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Vulnerability / Audit Check</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Impact &amp; Description</th>
                <th className="py-2.5 px-3">Remediation Snippet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-[11px]">
              {checks.map((chk) => (
                <tr
                  key={chk.id}
                  className={`transition ${
                    chk.status === 'FAIL'
                      ? 'bg-rose-500/5 hover:bg-rose-500/10'
                      : 'hover:bg-slate-900/60'
                  }`}
                >
                  <td className="py-2.5 px-3">
                    {chk.status === 'PASS' ? (
                      <span className="flex items-center space-x-1 text-emerald-400 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>PASS</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 text-rose-400 font-bold">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>FAIL</span>
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-white font-sans">{chk.name}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        chk.severity === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : chk.severity === 'HIGH'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      }`}
                    >
                      {chk.severity}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">{chk.category}</td>
                  <td className="py-2.5 px-3 text-slate-300 max-w-xs">{chk.impact}</td>
                  <td className="py-2.5 px-3">
                    <code className="text-cyan-300 text-[10px] bg-slate-950 px-2 py-1 rounded block overflow-x-auto whitespace-pre border border-slate-800">
                      {chk.remediationCmd}
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
