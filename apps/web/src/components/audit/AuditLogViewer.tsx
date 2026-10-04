// Enterprise Audit Log Viewer Component

import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Download,
} from 'lucide-react';
import { AuditLogEntry, RiskLevel } from '@audira/types';

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-001',
    userId: '20000000-0000-0000-0000-000000000001',
    username: 'admin',
    deviceId: '30000000-0000-0000-0000-000000000001',
    deviceName: 'CORE-JOGJA-01',
    action: 'CONFIG_APPLY',
    command: '/ip address add address=10.100.0.1/24 interface=bridge-lan',
    riskLevel: 'HIGH',
    approvalStatus: 'APPROVED_BY_ADMIN',
    approvedBy: 'admin',
    result: 'SUCCESS',
    executionDurationMs: 145,
    clientIp: '192.168.10.50',
    createdAt: '2026-10-04T13:25:00Z',
  },
  {
    id: 'aud-002',
    userId: '20000000-0000-0000-0000-000000000001',
    username: 'admin',
    deviceId: '30000000-0000-0000-0000-000000000005',
    deviceName: 'SW-JOGJA-02',
    action: 'COMMAND_EXECUTION',
    command: '/system reboot',
    riskLevel: 'CRITICAL',
    approvalStatus: 'BLOCKED',
    result: 'BLOCKED',
    errorDetails: 'Execution of CRITICAL command blocked by Security Engine without dual sign-off',
    executionDurationMs: 12,
    clientIp: '192.168.10.50',
    createdAt: '2026-10-04T12:40:00Z',
  },
  {
    id: 'aud-003',
    userId: '20000000-0000-0000-0000-000000000002',
    username: 'noc_engineer',
    deviceId: '30000000-0000-0000-0000-000000000001',
    deviceName: 'CORE-JOGJA-01',
    action: 'BACKUP_CREATE',
    command: '/system backup save name=daily-snapshot',
    riskLevel: 'LOW',
    result: 'SUCCESS',
    executionDurationMs: 410,
    clientIp: '192.168.10.52',
    createdAt: '2026-10-04T11:00:00Z',
  },
  {
    id: 'aud-004',
    userId: '20000000-0000-0000-0000-000000000001',
    username: 'admin',
    deviceId: '30000000-0000-0000-0000-000000000003',
    deviceName: 'EDGE-JOGJA-01',
    action: 'AI_DIAGNOSE',
    command: 'get_active_connections',
    riskLevel: 'LOW',
    result: 'SUCCESS',
    executionDurationMs: 220,
    clientIp: '192.168.10.50',
    createdAt: '2026-10-04T09:00:00Z',
  },
];

export const AuditLogViewer: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [resultFilter, setResultFilter] = useState('ALL');

  const filtered = logs.filter(log => {
    const matchesSearch =
      log.username?.toLowerCase().includes(search.toLowerCase()) ||
      log.deviceName?.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      (log.command && log.command.toLowerCase().includes(search.toLowerCase()));

    const matchesRisk = riskFilter === 'ALL' || log.riskLevel === riskFilter;
    const matchesResult = resultFilter === 'ALL' || log.result === resultFilter;

    return matchesSearch && matchesRisk && matchesResult;
  });

  const getRiskBadge = (risk: RiskLevel) => {
    switch (risk) {
      case 'CRITICAL':
        return <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold animate-pulse">CRITICAL</span>;
      case 'HIGH':
        return <span className="px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/40 font-semibold">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">MEDIUM</span>;
      case 'LOW':
      default:
        return <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">LOW</span>;
    }
  };

  const getResultBadge = (result: string) => {
    switch (result) {
      case 'SUCCESS':
        return <span className="text-emerald-400 flex items-center space-x-1"><CheckCircle2 className="w-3 h-3" /><span>SUCCESS</span></span>;
      case 'BLOCKED':
        return <span className="text-rose-400 flex items-center space-x-1"><XCircle className="w-3 h-3" /><span>BLOCKED</span></span>;
      default:
        return <span className="text-amber-400">{result}</span>;
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-noc-panel border border-noc-border rounded-lg p-3">
        <div className="flex items-center space-x-3">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <div>
            <h1 className="text-sm font-semibold text-white">Enterprise Audit Logs</h1>
            <p className="text-xs text-slate-400 font-mono">Immutable audit trail of commands, risk evaluations, and operator approvals</p>
          </div>
        </div>

        <button
          onClick={() => alert('Exporting sanitized audit trail to CSV')}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-mono transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Trail</span>
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by user, node, command, action..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-noc-panel border border-noc-border rounded text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <select
          value={riskFilter}
          onChange={e => setRiskFilter(e.target.value)}
          className="bg-noc-panel border border-noc-border text-slate-300 text-xs font-mono rounded px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
        >
          <option value="ALL">All Risk Levels</option>
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
          <option value="CRITICAL">CRITICAL</option>
        </select>

        <select
          value={resultFilter}
          onChange={e => setResultFilter(e.target.value)}
          className="bg-noc-panel border border-noc-border text-slate-300 text-xs font-mono rounded px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
        >
          <option value="ALL">All Results</option>
          <option value="SUCCESS">SUCCESS</option>
          <option value="BLOCKED">BLOCKED</option>
        </select>
      </div>

      {/* Audit Table */}
      <div className="bg-noc-panel border border-noc-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-noc-surface text-slate-400 uppercase text-[10px] tracking-wider border-b border-noc-border">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Operator</th>
                <th className="px-4 py-3">Target Node</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Command (Sanitized)</th>
                <th className="px-4 py-3">Risk Level</th>
                <th className="px-4 py-3">Result</th>
                <th className="px-4 py-3">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-noc-border">
              {filtered.map(log => (
                <tr key={log.id} className="hover:bg-noc-surface/50 transition">
                  <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleTimeString()}
                  </td>
                  <td className="px-4 py-3 text-white font-semibold">{log.username}</td>
                  <td className="px-4 py-3 text-cyan-300">{log.deviceName}</td>
                  <td className="px-4 py-3 text-slate-300">{log.action}</td>
                  <td className="px-4 py-3 text-slate-400 max-w-xs truncate" title={log.command}>
                    {log.command || '-'}
                  </td>
                  <td className="px-4 py-3">{getRiskBadge(log.riskLevel)}</td>
                  <td className="px-4 py-3">{getResultBadge(log.result)}</td>
                  <td className="px-4 py-3 text-slate-400">{log.executionDurationMs}ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
