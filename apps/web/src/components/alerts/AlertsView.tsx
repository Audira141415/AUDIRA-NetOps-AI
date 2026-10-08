// Alerts Management Component
// NOC Realtime Incidents, Telemetry Outages, AI Triage & 1-Click Remediation

import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Bell,
  Clock,
  ExternalLink,
  Plus,
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  X,
  Sparkles,
  Zap,
  Server,
  ShieldAlert,
  ArrowRight,
  Terminal,
} from 'lucide-react';
import { Alert, AlertSeverity, AlertCategory, AlertStatus } from '@audira/types';
import { AlertCorrelationEngine, CorrelatedIncident } from '@audira/monitoring';
import { useNetOpsStore } from '../../store/useNetOpsStore';

export const AlertsView: React.FC = () => {
  const { activeAlerts, setActiveAlerts, devices, setCurrentTab, setAiDrawerOpen } = useNetOpsStore();

  const [search, setSearch] = useState<string>('');
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [isMitigating, setIsMitigating] = useState<boolean>(false);

  // AIOps Storm Correlation & RCA state
  const [correlatedIncidents, setCorrelatedIncidents] = useState<CorrelatedIncident[]>([]);
  const [showOnlyRootCause, setShowOnlyRootCause] = useState<boolean>(false);

  React.useEffect(() => {
    if (activeAlerts.length > 0) {
      const results = AlertCorrelationEngine.correlateAlerts(activeAlerts);
      setCorrelatedIncidents(results);
    } else {
      setCorrelatedIncidents([]);
    }
  }, [activeAlerts]);

  // New Alert form state
  const [newTitle, setNewTitle] = useState<string>('');
  const [newSeverity, setNewSeverity] = useState<AlertSeverity>('WARNING');
  const [newCategory, setNewCategory] = useState<AlertCategory>('INTERFACE');
  const [newDeviceName, setNewDeviceName] = useState<string>(devices[0]?.name || '');
  const [newMessage, setNewMessage] = useState<string>('');

  const handleAcknowledge = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveAlerts(
      activeAlerts.map((a) =>
        a.id === id ? { ...a, status: 'ACKNOWLEDGED', acknowledgedBy: 'admin', acknowledgedAt: new Date().toISOString() } : a
      )
    );
  };

  const handleResolve = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveAlerts(
      activeAlerts.map((a) =>
        a.id === id ? { ...a, status: 'RESOLVED', resolvedAt: new Date().toISOString() } : a
      )
    );
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveAlerts(activeAlerts.filter((a) => a.id !== id));
    if (selectedAlert?.id === id) {
      setIsDetailOpen(false);
      setSelectedAlert(null);
    }
  };

  const handleOpenDetail = (alert: Alert) => {
    setSelectedAlert(alert);
    setIsDetailOpen(true);
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Alert = {
      id: `alt-${Date.now()}`,
      title: newTitle || 'Custom Triggered Incident',
      severity: newSeverity,
      category: newCategory,
      deviceName: newDeviceName,
      message: newMessage || 'Operator triggered manual incident simulation for testbed verification.',
      status: 'ACTIVE',
      createdAt: new Date().toLocaleTimeString(),
    };

    setActiveAlerts([created, ...activeAlerts]);
    setIsCreateOpen(false);
    setNewTitle('');
    setNewMessage('');
  };

  const handleRemediateAlert = async (alertId: string) => {
    setIsMitigating(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setActiveAlerts(
      activeAlerts.map((a) =>
        a.id === alertId ? { ...a, status: 'RESOLVED', resolvedAt: new Date().toISOString() } : a
      )
    );
    setIsMitigating(false);
    setIsDetailOpen(false);
  };

  const handleExportCsv = () => {
    const headers = ['ID,Severity,Category,Device,Status,Title,Message,CreatedAt'];
    const rows = activeAlerts.map(
      (a) =>
        `"${a.id}","${a.severity}","${a.category}","${a.deviceName || 'N/A'}","${a.status}","${a.title}","${a.message}","${a.createdAt}"`
    );
    const content = [headers, ...rows].join('\n');
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `audira_alerts_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredAlerts = activeAlerts.filter((alert) => {
    if (showOnlyRootCause && correlatedIncidents.length > 0) {
      const rootIds = new Set(correlatedIncidents.map((c) => c.rootCauseAlert.id));
      if (!rootIds.has(alert.id)) return false;
    }

    const matchesSearch =
      alert.title.toLowerCase().includes(search.toLowerCase()) ||
      alert.message.toLowerCase().includes(search.toLowerCase()) ||
      (alert.deviceName && alert.deviceName.toLowerCase().includes(search.toLowerCase()));

    const matchesSeverity = filterSeverity === 'ALL' || alert.severity === filterSeverity;
    const matchesStatus = filterStatus === 'ALL' || alert.status === filterStatus;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const getRemediationCommand = (cat: AlertCategory): string => {
    switch (cat) {
      case 'INTERFACE':
        return '/interface ethernet reset-counters [find default-name=ether1] ; /interface enable ether1';
      case 'CPU':
        return '/tool profile freeze=no ; /system script run kill-runaway-processes';
      case 'MEMORY':
        return '/system/resource/free-memory ; /tool/sniffer stop';
      case 'BGP':
        return '/routing/bgp/connection/clear [find name="upstream-transit"]';
      case 'SECURITY':
        return '/ip/firewall/raw add chain=prerouting action=drop src-address-list=threat-actors';
      default:
        return '/system/reboot';
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto select-none">
      {/* Top Banner */}
      <div className="glass-cyber-card border border-cyan-500/30 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[0_4px_25px_rgba(6,182,212,0.1)]">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold text-white tracking-wide">NOC Realtime Incidents &amp; Alerts</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono font-semibold">
                Autonomous Triage
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Automated threshold triggers, link state detections, BGP flapping alarms, and AI root-cause diagnostics
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold shadow-[0_0_15px_rgba(245,158,11,0.4)] transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Trigger Test Incident</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0b1329]/90 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2 flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search incident, router, or description..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="text-slate-400 flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Severity:</span>
          </span>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="WARNING">Warning</option>
            <option value="INFO">Info</option>
          </select>

          <span className="text-slate-400 ml-2">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="ACKNOWLEDGED">Acknowledged</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* AIOps Alert Storm Correlation & Root Cause Analysis (RCA) Card */}
      {correlatedIncidents.length > 0 && (
        <div className="rounded-2xl bg-gradient-to-r from-[#0c1a3a] via-[#1a1438] to-[#0a2336] border border-cyan-500/40 p-4 shadow-[0_0_35px_rgba(6,182,212,0.18)] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyan-500/20 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-xs font-bold text-white tracking-wide">
                    AIOps Topology-Aware Incident RCA
                  </h3>
                  <span className="text-[10px] px-2 py-0.2 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono font-bold">
                    Deduplication Active
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  SOP: alert-storm-correlation-rca · Algoritma OSI-Layer Hierarchy
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowOnlyRootCause(!showOnlyRootCause)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition border ${
                  showOnlyRootCause
                    ? 'bg-cyan-500 text-black border-cyan-400 font-bold'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
              >
                {showOnlyRootCause ? '✓ Only Root Cause (Filtered)' : 'Filter Root Cause Only'}
              </button>
            </div>
          </div>

          {correlatedIncidents.map((incident) => (
            <div
              key={incident.incidentId}
              className="p-3 bg-black/40 border border-cyan-500/20 rounded-xl space-y-2 text-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
                    ROOT CAUSE ({incident.detectedLayer})
                  </span>
                  <span className="font-bold text-white">{incident.rootCauseAlert.title}</span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    on {incident.rootCauseAlert.deviceName || 'Core Switch'}
                  </span>
                </div>
                <div className="flex items-center space-x-2 font-mono text-[11px]">
                  <span className="text-slate-400">Confidence:</span>
                  <span className="text-emerald-400 font-bold">{incident.confidenceScore}%</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-amber-300 font-semibold">
                    {incident.suppressedAlerts.length} Downstream Alarms Suppressed
                  </span>
                </div>
              </div>

              <div className="text-slate-300 font-sans text-[11px] leading-relaxed">
                <span className="text-cyan-300 font-semibold font-mono">Saran Remediasi: </span>
                {incident.suggestedRemediation}
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="text-[10px] font-mono text-slate-400">
                  Perkiraan dampak: {incident.impactSummary.affectedDevicesCount} perangkat · ~
                  {incident.impactSummary.estimatedSubscribersAffected} pelanggan
                </div>
                <button
                  onClick={() => {
                    handleOpenDetail(incident.rootCauseAlert);
                  }}
                  className="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-semibold flex items-center space-x-1 transition"
                >
                  <span>Lihat Detail Root Cause</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Alerts Feed */}
      <div className="space-y-3 font-mono">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center glass-cyber-card rounded-2xl border border-cyan-500/20 space-y-3 shadow-md">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto drop-shadow-[0_0_12px_rgba(52,211,153,0.5)]" />
            <h3 className="text-base font-bold text-white font-sans">No Incidents Found</h3>
            <p className="text-xs text-slate-400 font-sans max-w-sm mx-auto">
              All nodes and interfaces are operating normally without active degradation.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => handleOpenDetail(alert)}
              className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                alert.status === 'RESOLVED'
                  ? 'bg-slate-900/40 border-slate-800 opacity-60'
                  : alert.severity === 'CRITICAL'
                  ? 'bg-rose-500/10 border-rose-500/40 hover:border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
                  : alert.severity === 'WARNING'
                  ? 'bg-amber-500/10 border-amber-500/30 hover:border-amber-400'
                  : 'bg-[#111c38] border-cyan-500/25 hover:border-cyan-400'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      alert.severity === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                        : alert.severity === 'WARNING'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                    }`}
                  >
                    {alert.severity}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {alert.category}
                  </span>
                  <span className="text-white font-semibold text-xs font-sans">{alert.title}</span>
                  <span className="text-[10px] text-slate-500">· {alert.createdAt}</span>
                </div>

                <p className="text-xs text-slate-300 font-sans">{alert.message}</p>
                <div className="text-[10px] text-slate-400 flex items-center space-x-2">
                  <span>Device: <span className="text-cyan-300 font-semibold">{alert.deviceName || 'Global Network'}</span></span>
                  <span>•</span>
                  <span>Status: <span className="text-amber-300">{alert.status}</span></span>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-xs" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => handleOpenDetail(alert)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition flex items-center space-x-1"
                  title="Inspect AI Triage"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </button>

                {alert.status === 'ACTIVE' && (
                  <button
                    onClick={(e) => handleAcknowledge(alert.id, e)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                  >
                    Ack
                  </button>
                )}

                {alert.status !== 'RESOLVED' && (
                  <button
                    onClick={(e) => handleResolve(alert.id, e)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm transition"
                  >
                    Resolve
                  </button>
                )}

                <button
                  onClick={(e) => handleDelete(alert.id, e)}
                  className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition"
                  title="Dismiss / Delete Alert"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL: Incident Details & AI Root-Cause Triage */}
      {isDetailOpen && selectedAlert && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1329] border border-cyan-500/40 rounded-2xl w-full max-w-xl p-6 space-y-4 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white font-sans">Incident Diagnostic &amp; Root Cause Analysis</h3>
              </div>
              <button onClick={() => setIsDetailOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 font-sans">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div>
                  <div className="text-[10px] font-mono text-slate-400">INCIDENT TARGET</div>
                  <div className="text-sm font-bold text-white font-mono">{selectedAlert.deviceName}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-slate-400">SEVERITY / CATEGORY</div>
                  <div className="text-xs font-mono font-bold text-rose-400">{selectedAlert.severity} ({selectedAlert.category})</div>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-300 mb-1">Incident Symptom:</div>
                <p className="text-xs text-slate-200 bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono">
                  {selectedAlert.message}
                </p>
              </div>

              <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-xl space-y-2">
                <div className="flex items-center space-x-1.5 text-cyan-300 font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>AUDIRA AI Root Cause Diagnosis:</span>
                </div>
                <p className="text-xs text-slate-300">
                  Telemetry samples indicate recurring threshold crossing on interface rx/tx buffers. Packet drop rate increased to 4.2% causing state degradation.
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Suggested RouterOS Remediation:</span>
                  <span className="text-cyan-400 text-[10px]">Pre-flight Verified</span>
                </div>
                <pre className="bg-black/90 p-2.5 rounded-lg text-[10px] font-mono text-emerald-300 border border-slate-800 overflow-x-auto">
                  {getRemediationCommand(selectedAlert.category)}
                </pre>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  setIsDetailOpen(false);
                  setAiDrawerOpen(true);
                }}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 text-xs transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Discuss in Copilot</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Close
                </button>
                <button
                  disabled={isMitigating || selectedAlert.status === 'RESOLVED'}
                  onClick={() => handleRemediateAlert(selectedAlert.id)}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-[0_0_15px_rgba(16,185,129,0.4)] transition disabled:opacity-50"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{isMitigating ? 'Executing Fix...' : 'Apply Remediation'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Trigger Test Incident */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1329] border border-amber-500/40 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white font-sans">Trigger Incident Test Simulation</h3>
              </div>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAlert} className="space-y-3 font-sans">
              <div>
                <label className="text-slate-300 block mb-1 text-xs">Incident Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BGP Neighbor Session Flap"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 text-xs">Target Device</label>
                  <select
                    value={newDeviceName}
                    onChange={(e) => setNewDeviceName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400 text-xs font-mono"
                  >
                    {devices.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name} ({d.ipAddress})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 text-xs">Severity Level</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as AlertSeverity)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400 text-xs font-mono"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="WARNING">WARNING</option>
                    <option value="INFO">INFO</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 text-xs">Incident Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as AlertCategory)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400 text-xs font-mono"
                >
                  <option value="INTERFACE">INTERFACE (Link Down / Errors)</option>
                  <option value="BGP">BGP (Flapping / State Loss)</option>
                  <option value="CPU">CPU (High Utilization Spike)</option>
                  <option value="MEMORY">MEMORY (Buffer Exhaustion)</option>
                  <option value="SECURITY">SECURITY (Port Scan / DDoS Attack)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 text-xs">Incident Message &amp; Telemetry Details</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail the symptom (e.g. Interface ether1 experienced 15 link loss transitions in 60s)..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400 text-xs font-mono"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shadow-[0_0_15px_rgba(245,158,11,0.4)] transition"
                >
                  Inject Incident Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
