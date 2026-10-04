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
import { useNetOpsStore } from '../../store/useNetOpsStore';

export const AlertsView: React.FC = () => {
  const { activeAlerts, setActiveAlerts } = useNetOpsStore();

  const handleAcknowledge = (id: string) => {
    setActiveAlerts(
      activeAlerts.map((a) => (a.id === id ? { ...a, status: 'ACKNOWLEDGED', acknowledgedBy: 'admin' } : a))
    );
  };

  const handleResolve = (id: string) => {
    setActiveAlerts(activeAlerts.filter((a) => a.id !== id));
  };

  return (
    <div className="p-4 space-y-4">
      <div className="glass-cyber-card border border-cyan-500/20 rounded-2xl p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.3)]">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white">NOC Realtime Incidents &amp; Alerts</h1>
            <p className="text-xs text-slate-400 font-sans">
              Automated threshold triggers, link state detections, and routing incidents
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 font-mono">
        {activeAlerts.length === 0 ? (
          <div className="p-12 text-center glass-cyber-card rounded-2xl border border-cyan-500/20 space-y-3 shadow-md">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto drop-shadow-[0_0_12px_rgba(52,211,153,0.5)]" />
            <h3 className="text-base font-bold text-white font-sans">Tidak Ada Alert Aktif</h3>
            <p className="text-xs text-slate-400 font-sans max-w-sm mx-auto">
              Seluruh node dan interface jaringan dalam status normal tanpa insiden atau degradasi performa.
            </p>
          </div>
        ) : (
          activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                alert.severity === 'WARNING'
                  ? 'bg-amber-500/10 border-amber-500/30'
                  : 'bg-[#111c38] border-cyan-500/25'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold ${
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
                <div className="text-[10px] text-slate-400">Node: {alert.deviceName}</div>
              </div>

              <div className="flex items-center space-x-2 text-xs">
                {alert.status === 'ACTIVE' && (
                  <button
                    onClick={() => handleAcknowledge(alert.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                  >
                    Acknowledge
                  </button>
                )}
                {alert.status !== 'RESOLVED' && (
                  <button
                    onClick={() => handleResolve(alert.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm transition"
                  >
                    Resolve
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
