// Automation Workflow & Scheduled Jobs Component

import React, { useState } from 'react';
import {
  Zap,
  Play,
  Plus,
  Clock,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

interface AutoJob {
  id: string;
  name: string;
  trigger: string;
  steps: string[];
  lastRun: string;
  status: 'ACTIVE' | 'IDLE';
}

const JOBS: AutoJob[] = [
  {
    id: 'job-1',
    name: 'High CPU Incident Auto-Triage',
    trigger: 'WHEN CPU > 90% for 60s',
    steps: ['Run Diagnostics', 'AI Diagnostic Analysis', 'Dispatch Alert to Telegram'],
    lastRun: '2 hours ago',
    status: 'ACTIVE',
  },
  {
    id: 'job-2',
    name: 'Nightly Core Router Backup Archival',
    trigger: 'SCHEDULE: Every night at 02:00 WIB',
    steps: ['Generate RSC Export', 'Verify Checksum', 'Prune snapshots > 30 days'],
    lastRun: '12 hours ago',
    status: 'ACTIVE',
  },
  {
    id: 'job-3',
    name: 'Link Degradation Packet Loss Watcher',
    trigger: 'WHEN Packet Loss > 2% on Core Uplinks',
    steps: ['Interface telemetry poll', 'Traceroute upstream', 'Notify NOC on-call'],
    lastRun: 'Never',
    status: 'IDLE',
  },
];

export const AutomationView: React.FC = () => {
  const [runningJobId, setRunningJobId] = useState<string | null>(null);

  const handleRunJob = (id: string) => {
    setRunningJobId(id);
    setTimeout(() => {
      setRunningJobId(null);
      alert('Automation job pipeline finished execution successfully.');
    }, 1200);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="bg-noc-panel border border-noc-border rounded-lg p-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Zap className="w-5 h-5 text-cyan-400" />
          <div>
            <h1 className="text-sm font-semibold text-white">Network Automation &amp; Workflows</h1>
            <p className="text-xs text-slate-400 font-mono">Event-driven workflows, threshold triggers, and scheduled maintenance</p>
          </div>
        </div>

        <button
          onClick={() => alert('Add Automation Workflow wizard')}
          className="flex items-center space-x-1 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-semibold shadow glow-cyan transition font-mono"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Workflow</span>
        </button>
      </div>

      <div className="space-y-3 font-mono">
        {JOBS.map(job => (
          <div key={job.id} className="bg-noc-panel border border-noc-border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-sm text-white font-sans">{job.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {job.status}
                </span>
              </div>

              <button
                disabled={runningJobId === job.id}
                onClick={() => handleRunJob(job.id)}
                className="flex items-center space-x-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs transition disabled:opacity-50"
              >
                <Play className="w-3 h-3 text-cyan-400" />
                <span>{runningJobId === job.id ? 'Running...' : 'Run Pipeline'}</span>
              </button>
            </div>

            <div className="p-2 rounded bg-noc-surface text-xs text-amber-300 font-mono">
              ⚡ Trigger: {job.trigger}
            </div>

            {/* Pipeline Flow Steps */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-500 text-[10px]">PIPELINE:</span>
              {job.steps.map((step, idx) => (
                <React.Fragment key={idx}>
                  <div className="px-2 py-1 rounded bg-noc-surface border border-noc-border text-slate-300 text-[11px]">
                    {step}
                  </div>
                  {idx < job.steps.length - 1 && <ArrowRight className="w-3 h-3 text-slate-600" />}
                </React.Fragment>
              ))}
            </div>

            <div className="text-[10px] text-slate-500">Last executed: {job.lastRun}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
