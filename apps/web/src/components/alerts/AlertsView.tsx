// Alerts Management Component

import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Bell,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { Alert } from '@audira/types';

const INITIAL_ALERTS: Alert[] = [
  {
    id: '40000000-0000-0000-0000-000000000001',
    deviceId: '30000000-0000-0000-0000-000000000005',
    deviceName: 'SW-JOGJA-02',
    severity: 'WARNING',
    category: 'INTERFACE',
    title: 'Interface drop rate elevated',
    message: 'Interface ether8 on SW-JOGJA-02 reports packet drops exceeding 1.8%',
    status: 'ACTIVE',
    createdAt: '18 minutes ago',
  },
  {
    id: '40000000-0000-0000-0000-000000000002',
    deviceId: '30000000-0000-0000-0000-000000000001',
    deviceName: 'CORE-JOGJA-01',
    severity: 'INFO',
    category: 'REACHABILITY',
    title: 'BGP Peer Established',
    message: 'BGP session with AS64512 (Telkom Transit) established via sfp-sfpplus1',
    status: 'ACKNOWLEDGED',
    acknowledgedBy: 'admin',
    createdAt: '1 hour ago',
  },
];

export const AlertsView: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);

  const handleAcknowledge = (id: string) => {
    setAlerts(prev =>
      prev.map(a => (a.id === id ? { ...a, status: 'ACKNOWLEDGED', acknowledgedBy: 'admin' } : a))
    );
  };

  const handleResolve = (id: string) => {
    setAlerts(prev =>
      prev.map(a => (a.id === id ? { ...a, status: 'RESOLVED' } : a))
    );
  };

  return (
    <div className="p-4 space-y-4">
      <div className="bg-noc-panel border border-noc-border rounded-lg p-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <div>
            <h1 className="text-sm font-semibold text-white">NOC Realtime Incident &amp; Alerts</h1>
            <p className="text-xs text-slate-400 font-mono">Automated threshold triggers, link state detections, and routing incidents</p>
          </div>
        </div>
      </div>

      <div className="space-y-3 font-mono">
        {alerts.map(alert => (
          <div
            key={alert.id}
            className={`p-4 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              alert.severity === 'WARNING'
                ? 'bg-amber-500/5 border-amber-500/30'
                : 'bg-noc-panel border-noc-border'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    alert.severity === 'WARNING'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                  }`}
                >
                  {alert.severity}
                </span>
                <span className="text-white font-semibold text-xs font-sans">{alert.title}</span>
                <span className="text-[10px] text-slate-500">· {alert.createdAt}</span>
              </div>

              <p className="text-xs text-slate-300 font-sans">{alert.message}</p>
              <div className="text-[10px] text-slate-500">Node: {alert.deviceName}</div>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              {alert.status === 'ACTIVE' && (
                <button
                  onClick={() => handleAcknowledge(alert.id)}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                >
                  Acknowledge
                </button>
              )}
              {alert.status !== 'RESOLVED' && (
                <button
                  onClick={() => handleResolve(alert.id)}
                  className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow glow-emerald"
                >
                  Resolve
                </button>
              )}
              {alert.status === 'RESOLVED' && (
                <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>RESOLVED</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
