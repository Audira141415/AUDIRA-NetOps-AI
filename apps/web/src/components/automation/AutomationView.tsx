// Automation Workflow & Visual Pipeline Engine Component
// Visual Flow, Trigger-Condition-Action Graph, Live Simulator & Approval Gates

import React, { useState } from 'react';
import {
  Zap,
  Play,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  Bot,
  Bell,
  Cpu,
  Layers,
  Sparkles,
  Terminal,
  Activity,
  Send,
  RotateCcw,
  Sliders,
  Check,
  ChevronRight,
} from 'lucide-react';

export type NodeType = 'trigger' | 'ai_analysis' | 'guardrail' | 'action' | 'notify';

export interface WorkflowNode {
  id: string;
  type: NodeType;
  title: string;
  subtitle: string;
  detail: string;
  risk?: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'IDLE' | 'RUNNING' | 'SUCCESS' | 'FAILED';
}

export interface WorkflowItem {
  id: string;
  name: string;
  category: string;
  description: string;
  triggerEvent: string;
  lastRun: string;
  status: 'ACTIVE' | 'IDLE';
  nodes: WorkflowNode[];
}

const INITIAL_WORKFLOWS: WorkflowItem[] = [
  {
    id: 'wf-1',
    name: 'High CPU Incident Auto-Triage & FastTrack',
    category: 'Incident Remediation',
    description: 'Detects sustained CPU spikes on core routers, runs AI process inspection, and enforces FastTrack if needed.',
    triggerEvent: 'WHEN CPU > 85% for 60s on Core Routers',
    lastRun: '15 mins ago',
    status: 'ACTIVE',
    nodes: [
      {
        id: 'node-1',
        type: 'trigger',
        title: 'Metric Breach Trigger',
        subtitle: 'CPU Usage > 85% sustained',
        detail: 'Event detected from Telemetry Poller on CORE-JOGJA-01',
        status: 'IDLE',
      },
      {
        id: 'node-2',
        type: 'ai_analysis',
        title: 'AI Diagnostic Copilot',
        subtitle: 'Run /tool/profile & identify hot threads',
        detail: 'Analyzing whether spike is caused by firewall, crypto, or routing',
        status: 'IDLE',
      },
      {
        id: 'node-3',
        type: 'guardrail',
        title: 'Safety Pre-flight Snapshot',
        subtitle: 'Generate compact RSC export',
        detail: 'Risk Level: MEDIUM. Automatic rollback checkpoint created.',
        risk: 'MEDIUM',
        status: 'IDLE',
      },
      {
        id: 'node-4',
        type: 'action',
        title: 'Remediation: FastTrack Optimization',
        subtitle: 'Enable FastTrack rule & isolate hogging IP',
        detail: '/ip/firewall/filter add chain=forward action=fasttrack-connection',
        risk: 'MEDIUM',
        status: 'IDLE',
      },
      {
        id: 'node-5',
        type: 'notify',
        title: 'NOC Dispatch Notification',
        subtitle: 'Send summary to Telegram / Slack NOC channel',
        detail: 'Alert payload contains pre/post CPU metrics and visual diff',
        status: 'IDLE',
      },
    ],
  },
  {
    id: 'wf-2',
    name: 'Port Scanner Detection & Dynamic Blacklist',
    category: 'Cyber Security',
    description: 'Identifies sequential TCP SYN port scans and pushes attacker IP to firewall blacklist with a 24-hour timeout.',
    triggerEvent: 'WHEN PSD port scan hit counter > 10 in 5s',
    lastRun: '2 hours ago',
    status: 'ACTIVE',
    nodes: [
      {
        id: 'node-1',
        type: 'trigger',
        title: 'Port Scan Heuristic',
        subtitle: 'PSD counter threshold exceeded',
        detail: 'Inbound hits on ports 21, 22, 23, 8291 from single WAN IP',
        status: 'IDLE',
      },
      {
        id: 'node-2',
        type: 'ai_analysis',
        title: 'AI Threat Reputation Check',
        subtitle: 'Verify IP against known benign ASN / CDN',
        detail: 'Prevents blacklisting legitimate search bots or DNS relays',
        status: 'IDLE',
      },
      {
        id: 'node-3',
        type: 'guardrail',
        title: 'Risk Engine Gate',
        subtitle: 'Low Risk: Automated address-list quarantine',
        detail: 'Risk Level: LOW (Read-only + temporary dynamic address-list)',
        risk: 'LOW',
        status: 'IDLE',
      },
      {
        id: 'node-4',
        type: 'action',
        title: 'Firewall Blacklist Execution',
        subtitle: 'Add to address-list "port-scanners" (24h)',
        detail: '/ip/firewall/address-list add list=port-scanners timeout=1d',
        risk: 'LOW',
        status: 'IDLE',
      },
      {
        id: 'node-5',
        type: 'notify',
        title: 'Security Audit Log',
        subtitle: 'Append entry to PostgreSQL audit table',
        detail: 'Masked event recorded with attacker IP and rule ID',
        status: 'IDLE',
      },
    ],
  },
  {
    id: 'wf-3',
    name: 'Nightly Core Router Safe Backup Archival',
    category: 'Disaster Recovery',
    description: 'Automated nightly configuration snapshot with MD5 checksum verification and cloud sync.',
    triggerEvent: 'SCHEDULE: Every night at 02:00 WIB',
    lastRun: '6 hours ago',
    status: 'ACTIVE',
    nodes: [
      {
        id: 'node-1',
        type: 'trigger',
        title: 'Cron Scheduler',
        subtitle: 'Nightly trigger at 02:00 WIB',
        detail: 'Scheduled maintenance window for all 7 network nodes',
        status: 'IDLE',
      },
      {
        id: 'node-2',
        type: 'action',
        title: 'Export RSC & Binary Backup',
        subtitle: 'Trigger /export and /system/backup',
        detail: 'Generates audited configuration script with secrets masked',
        risk: 'LOW',
        status: 'IDLE',
      },
      {
        id: 'node-3',
        type: 'guardrail',
        title: 'Integrity Verification',
        subtitle: 'Compute SHA256 checksum & test syntax',
        detail: 'Ensures snapshot is not corrupt before archiving',
        risk: 'LOW',
        status: 'IDLE',
      },
      {
        id: 'node-4',
        type: 'notify',
        title: 'Backup Report Dispatch',
        subtitle: 'NOC Morning Digest notification',
        detail: 'Confirms 7 of 7 nodes successfully snapshotted',
        status: 'IDLE',
      },
    ],
  },
];

export const AutomationView: React.FC = () => {
  const [workflows, setWorkflows] = useState<WorkflowItem[]>(INITIAL_WORKFLOWS);
  const [selectedWfId, setSelectedWfId] = useState<string>('wf-1');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const selectedWf = workflows.find((w) => w.id === selectedWfId) || workflows[0]!;

  const handleRunSimulation = async () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setExecutionLogs([]);

    const log = (msg: string) => {
      setExecutionLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    log(`🚀 Initiating workflow pipeline: "${selectedWf.name}"`);

    for (let i = 0; i < selectedWf.nodes.length; i++) {
      setActiveStepIndex(i);
      const node = selectedWf.nodes[i]!;

      // Update node state to RUNNING
      setWorkflows((prev) =>
        prev.map((w) => {
          if (w.id !== selectedWf.id) return w;
          const updatedNodes = [...w.nodes];
          updatedNodes[i] = { ...node, status: 'RUNNING' };
          return { ...w, nodes: updatedNodes };
        })
      );

      log(`▶ Executing step ${i + 1}/${selectedWf.nodes.length}: [${node.title}] - ${node.subtitle}`);
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Update node state to SUCCESS
      setWorkflows((prev) =>
        prev.map((w) => {
          if (w.id !== selectedWf.id) return w;
          const updatedNodes = [...w.nodes];
          updatedNodes[i] = { ...node, status: 'SUCCESS' };
          return { ...w, nodes: updatedNodes };
        })
      );
      log(`✔ Completed step ${i + 1}: ${node.detail}`);
    }

    log(`🏁 Pipeline executed successfully with 0 errors. All guardrails passed.`);
    setIsSimulating(false);
    setActiveStepIndex(-1);
  };

  const handleResetWorkflow = () => {
    setWorkflows((prev) =>
      prev.map((w) => {
        if (w.id !== selectedWf.id) return w;
        return {
          ...w,
          nodes: w.nodes.map((n) => ({ ...n, status: 'IDLE' })),
        };
      })
    );
    setExecutionLogs([]);
    setActiveStepIndex(-1);
  };

  const getNodeIcon = (type: NodeType) => {
    switch (type) {
      case 'trigger':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'ai_analysis':
        return <Bot className="w-4 h-4 text-cyan-400" />;
      case 'guardrail':
        return <Shield className="w-4 h-4 text-emerald-400" />;
      case 'action':
        return <Terminal className="w-4 h-4 text-blue-400" />;
      case 'notify':
        return <Bell className="w-4 h-4 text-purple-400" />;
    }
  };

  const getNodeColor = (type: NodeType) => {
    switch (type) {
      case 'trigger':
        return 'border-amber-500/40 bg-amber-500/5 shadow-[0_0_15px_rgba(245,158,11,0.15)]';
      case 'ai_analysis':
        return 'border-cyan-500/40 bg-cyan-500/5 shadow-[0_0_15px_rgba(6,182,212,0.15)]';
      case 'guardrail':
        return 'border-emerald-500/40 bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.15)]';
      case 'action':
        return 'border-blue-500/40 bg-blue-500/5 shadow-[0_0_15px_rgba(59,130,246,0.15)]';
      case 'notify':
        return 'border-purple-500/40 bg-purple-500/5 shadow-[0_0_15px_rgba(168,85,247,0.15)]';
    }
  };

  const categories = ['ALL', 'Incident Remediation', 'Cyber Security', 'Disaster Recovery'];
  const filteredWorkflows =
    filterCategory === 'ALL'
      ? workflows
      : workflows.filter((w) => w.category === filterCategory);

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto select-none">
      {/* Top Banner */}
      <div className="bg-[#0b1329]/90 border border-cyan-500/30 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[0_4px_25px_rgba(6,182,212,0.1)]">
        <div className="flex items-center space-x-3.5">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold text-white tracking-wide">Autonomous Network Automation Engine</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono font-semibold">
                v2.0 Visual Pipeline
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Event-driven trigger graphs, AI root-cause analysis, pre-flight safety snapshots, and auto-remediation
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => alert('Fitur Visual Workflow Builder Modal: Tambahkan Trigger & Action kustom!')}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold shadow-[0_0_15px_rgba(6,182,212,0.4)] transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Custom Workflow</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Workflow Selector + Right Visual Graph Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Workflow Selector */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`text-[11px] px-2.5 py-1 rounded-md transition font-mono whitespace-nowrap ${
                  filterCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                    : 'text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-2.5">
            {filteredWorkflows.map((wf) => {
              const isSelected = wf.id === selectedWf.id;
              return (
                <div
                  key={wf.id}
                  onClick={() => setSelectedWfId(wf.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#0f1b36] border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                      : 'bg-[#090f20]/80 border-slate-800 hover:border-slate-700 hover:bg-[#0c142b]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {wf.category}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>{wf.status}</span>
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-white mt-2 group-hover:text-cyan-300">
                    {wf.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {wf.description}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>⚡ {wf.nodes.length} Stages</span>
                    <span>Last: {wf.lastRun}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Visual Pipeline Canvas & Interactive Execution */}
        <div className="lg:col-span-8 space-y-3">
          {/* Canvas Controls Header */}
          <div className="bg-[#0b1329]/90 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold text-white">{selectedWf.name}</h2>
                <span className="text-[10px] font-mono text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                  {selectedWf.triggerEvent}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleResetWorkflow}
                disabled={isSimulating}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center space-x-1 border border-slate-700 transition disabled:opacity-50"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
              <button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold font-mono flex items-center space-x-1.5 shadow-[0_0_15px_rgba(6,182,212,0.4)] transition disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isSimulating ? 'Simulating Pipeline...' : 'Run Simulation'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Visual Graph Canvas */}
          <div className="bg-[#070c18] border border-cyan-500/20 rounded-xl p-5 relative overflow-hidden min-h-[340px] flex flex-col justify-center">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

            {/* Stages Pipeline Graph */}
            <div className="relative z-10 space-y-4">
              <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Execution Pipeline Sequence (Left ➔ Right Flow)</span>
              </div>

              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 overflow-x-auto pb-2">
                {selectedWf.nodes.map((node, index) => {
                  const isCurrent = activeStepIndex === index;
                  const isSuccess = node.status === 'SUCCESS';
                  const isRunning = node.status === 'RUNNING';

                  return (
                    <React.Fragment key={node.id}>
                      {/* Workflow Node Card */}
                      <div
                        className={`flex-1 min-w-[170px] p-3 rounded-xl border transition-all duration-300 relative ${getNodeColor(
                          node.type
                        )} ${
                          isRunning
                            ? 'ring-2 ring-cyan-400 scale-105 shadow-[0_0_25px_rgba(6,182,212,0.5)]'
                            : ''
                        } ${isSuccess ? 'border-emerald-500/50 bg-emerald-500/10' : ''}`}
                      >
                        {/* Status Indicator Badge */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-1.5">
                            {getNodeIcon(node.type)}
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300">
                              {node.type.replace('_', ' ')}
                            </span>
                          </div>

                          {isRunning && (
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                          )}
                          {isSuccess && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                        </div>

                        <div className="text-xs font-bold text-white mb-0.5">{node.title}</div>
                        <div className="text-[10.5px] text-slate-300 font-mono mb-2">
                          {node.subtitle}
                        </div>

                        <div className="text-[10px] text-slate-400 bg-slate-900/80 p-1.5 rounded border border-slate-800 line-clamp-2">
                          {node.detail}
                        </div>

                        {node.risk && (
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-[9px] font-mono text-slate-500">Risk Level:</span>
                            <span
                              className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                                node.risk === 'LOW'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              }`}
                            >
                              {node.risk}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Connecting Arrow */}
                      {index < selectedWf.nodes.length - 1 && (
                        <div className="hidden md:flex flex-col items-center justify-center text-slate-600">
                          <ArrowRight
                            className={`w-4 h-4 transition ${
                              isSuccess ? 'text-cyan-400 animate-pulse' : 'text-slate-600'
                            }`}
                          />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Real-time Execution Console Logs */}
          <div className="bg-[#050811] border border-cyan-500/20 rounded-xl p-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
              <div className="flex items-center space-x-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-bold text-slate-300">Live Automation Execution Trace</span>
              </div>
              <span className="text-[10px] text-slate-500">
                {executionLogs.length} events logged
              </span>
            </div>

            <div className="space-y-1 max-h-36 overflow-y-auto text-[11px] text-slate-300">
              {executionLogs.length === 0 ? (
                <div className="text-slate-600 py-3 text-center italic">
                  Tekan "Run Simulation" untuk menguji eksekusi alur otomatisasi dan validasi guardrail...
                </div>
              ) : (
                executionLogs.map((log, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <span className="text-cyan-500 select-none">❯</span>
                    <span>{log}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
