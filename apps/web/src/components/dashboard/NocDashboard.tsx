// Enterprise NOC Dashboard Component

import React, { useEffect, useState } from 'react';
import {
  Server,
  Activity,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  Bot,
  Zap,
  TrendingUp,
  Cpu,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { useNetOpsStore } from '../../store/useNetOpsStore';

const MOCK_TRAFFIC_DATA = [
  { time: '13:00', rx: 420, tx: 380 },
  { time: '13:10', rx: 460, tx: 395 },
  { time: '13:20', rx: 510, tx: 430 },
  { time: '13:30', rx: 490, tx: 410 },
  { time: '13:40', rx: 620, tx: 540 },
  { time: '13:50', rx: 780, tx: 680 },
  { time: '14:00', rx: 842, tx: 712 },
];

const MOCK_DEVICE_HEALTH = [
  { name: 'CORE-01', cpu: 16.5, mem: 42 },
  { name: 'CORE-02', cpu: 14.2, mem: 40 },
  { name: 'EDGE-01', cpu: 28.0, mem: 55 },
  { name: 'SW-01', cpu: 32.1, mem: 48 },
  { name: 'SW-02', cpu: 38.5, mem: 62 },
  { name: 'AP-01', cpu: 9.5, mem: 25 },
  { name: 'SRV-01', cpu: 11.0, mem: 34 },
];

export const NocDashboard: React.FC = () => {
  const { setCurrentTab, setAiDrawerOpen } = useNetOpsStore();

  return (
    <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-3.5rem)]">
      {/* Top NOC Telemetry KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Devices */}
        <div className="bg-noc-panel border border-noc-border rounded-lg p-3">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>TOTAL NODES</span>
            <Server className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="mt-1 flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-white">7</span>
            <span className="text-[10px] text-emerald-400 font-mono">6 ONLINE</span>
          </div>
          <div className="text-[10px] text-amber-400 font-mono mt-0.5">1 WARNING · 0 OFFLINE</div>
        </div>

        {/* CPU Average */}
        <div className="bg-noc-panel border border-noc-border rounded-lg p-3">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>AVG CPU LOAD</span>
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="mt-1 flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">22.4%</span>
            <span className="text-[10px] text-slate-400 font-mono">Peak 38%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '22.4%' }} />
          </div>
        </div>

        {/* Memory Average */}
        <div className="bg-noc-panel border border-noc-border rounded-lg p-3">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>AVG MEMORY</span>
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="mt-1 flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-cyan-400">44.8%</span>
            <span className="text-[10px] text-slate-400 font-mono">Healthy</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-cyan-500 h-full rounded-full" style={{ width: '44.8%' }} />
          </div>
        </div>

        {/* Traffic Throughput */}
        <div className="bg-noc-panel border border-noc-border rounded-lg p-3">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>AGGREGATE RX/TX</span>
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="mt-1 flex items-center space-x-3 text-xs font-mono">
            <div className="flex items-center text-emerald-400">
              <ArrowDownLeft className="w-3.5 h-3.5 mr-0.5" />
              <span>842M</span>
            </div>
            <div className="flex items-center text-cyan-400">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              <span>712M</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-1">Transit 10G SFP+</div>
        </div>

        {/* Latency & Packet Loss */}
        <div className="bg-noc-panel border border-noc-border rounded-lg p-3">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>LATENCY / LOSS</span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="mt-1 flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-white">2.1<span className="text-sm">ms</span></span>
            <span className="text-[10px] text-amber-400 font-mono">0.2% LOSS</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">Jitter: 0.4ms</div>
        </div>

        {/* Active Alerts */}
        <div className="bg-noc-panel border border-amber-500/30 rounded-lg p-3 bg-amber-500/5 cursor-pointer" onClick={() => setCurrentTab('alerts')}>
          <div className="flex items-center justify-between text-amber-400 text-xs font-mono">
            <span>ACTIVE ALERTS</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          </div>
          <div className="mt-1 flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-amber-400">2</span>
            <span className="text-[10px] text-amber-300 font-mono">1 WARNING · 1 INFO</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5 hover:text-white flex items-center">
            <span>Review incidents</span>
            <ChevronRight className="w-3 h-3 ml-0.5" />
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Realtime Traffic Chart */}
        <div className="lg:col-span-2 bg-noc-panel border border-noc-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold text-white">Network Traffic Throughput (RX / TX)</h2>
              <p className="text-xs text-slate-400 font-mono">Live bandwidth rate sampled across Core Interfaces</p>
            </div>
            <div className="flex items-center space-x-4 text-xs font-mono">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-300">RX (Mbps)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                <span className="text-slate-300">TX (Mbps)</span>
              </div>
            </div>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_TRAFFIC_DATA}>
                <defs>
                  <linearGradient id="colorRx" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorTx" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#475569" fontSize={11} fontStyle="JetBrains Mono" />
                <YAxis stroke="#475569" fontSize={11} fontStyle="JetBrains Mono" />
                <Tooltip contentStyle={{ backgroundColor: '#0e1422', borderColor: '#1e293b', fontSize: '11px', fontFamily: 'JetBrains Mono' }} />
                <Area type="monotone" dataKey="rx" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorRx)" />
                <Area type="monotone" dataKey="tx" stroke="#06B6D4" strokeWidth={2} fillOpacity={1} fill="url(#colorTx)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device Health CPU/Mem Distribution */}
        <div className="bg-noc-panel border border-noc-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold text-white">Node Health Distribution</h2>
              <p className="text-xs text-slate-400 font-mono">CPU Load % per active node</p>
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_DEVICE_HEALTH} layout="vertical">
                <XAxis type="number" domain={[0, 100]} stroke="#475569" fontSize={10} />
                <YAxis dataKey="name" type="category" stroke="#475569" fontSize={10} width={65} />
                <Tooltip contentStyle={{ backgroundColor: '#0e1422', borderColor: '#1e293b', fontSize: '11px', fontFamily: 'JetBrains Mono' }} />
                <Bar dataKey="cpu" fill="#06B6D4" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row: Topology Mini-Map, AI Recommendations, Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Topology Mini-Map Preview */}
        <div className="bg-noc-panel border border-noc-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-white">Topology Mini-Map</h2>
            <button
              onClick={() => setCurrentTab('topology')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center"
            >
              <span>Full Graph</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          <div
            onClick={() => setCurrentTab('topology')}
            className="h-44 bg-noc-surface rounded border border-noc-border flex items-center justify-center cursor-pointer relative overflow-hidden group"
          >
            {/* SVG Visual preview */}
            <div className="absolute inset-0 bg-grid-pattern opacity-30" />
            <div className="z-10 flex flex-col items-center">
              <div className="flex items-center space-x-8 mb-4">
                <div className="px-2 py-1 rounded bg-slate-800 border border-emerald-500/50 text-[10px] font-mono text-emerald-400">
                  CORE-01
                </div>
                <div className="px-2 py-1 rounded bg-slate-800 border border-emerald-500/50 text-[10px] font-mono text-emerald-400">
                  CORE-02
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="px-2 py-1 rounded bg-slate-800 border border-cyan-500/50 text-[10px] font-mono text-cyan-400">
                  SW-01
                </div>
                <div className="px-2 py-1 rounded bg-slate-800 border border-amber-500/50 text-[10px] font-mono text-amber-400">
                  SW-02 (Loss)
                </div>
              </div>
            </div>
            <div className="absolute bottom-2 right-2 text-[10px] font-mono text-slate-400 bg-black/60 px-2 py-0.5 rounded">
              Click to Open Interactive Map
            </div>
          </div>
        </div>

        {/* AI Copilot Recommendations */}
        <div className="bg-noc-panel border border-noc-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5">
              <Bot className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-semibold text-white">AI Copilot Insights</h2>
            </div>
            <button
              onClick={() => {
                setAiDrawerOpen(true);
                setCurrentTab('ai-copilot');
              }}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-mono"
            >
              Open Copilot
            </button>
          </div>

          <div className="space-y-2.5">
            <div className="p-2.5 rounded bg-noc-surface border border-noc-border text-xs">
              <div className="flex items-center justify-between text-amber-400 font-mono text-[11px] mb-1">
                <span>SW-JOGJA-02 · Interface ether8</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">RISK: MEDIUM</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Elevated packet loss (1.4%) detected. Recommend checking interface queue limits or verifying cable link negotiation.
              </p>
            </div>

            <div className="p-2.5 rounded bg-noc-surface border border-noc-border text-xs">
              <div className="flex items-center justify-between text-cyan-400 font-mono text-[11px] mb-1">
                <span>BGP Peer Optimization</span>
                <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">PROPOSAL</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                AS64512 transit peer latency is optimal at 1.2ms. Route reflectors are synchronized across CORE-JOGJA-01/02.
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activities & Audit Trail */}
        <div className="bg-noc-panel border border-noc-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-white">Recent NOC Operations</h2>
            <button
              onClick={() => setCurrentTab('audit')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-mono"
            >
              All Logs
            </button>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-2 rounded bg-noc-surface/60 border border-noc-border flex items-start justify-between">
              <div>
                <div className="text-slate-200">CONFIG_APPLY · CORE-JOGJA-01</div>
                <div className="text-[10px] text-slate-500">by admin · 35 min ago</div>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                SUCCESS
              </span>
            </div>

            <div className="p-2 rounded bg-noc-surface/60 border border-noc-border flex items-start justify-between">
              <div>
                <div className="text-slate-200">REBOOT_BLOCKED · SW-JOGJA-02</div>
                <div className="text-[10px] text-slate-500">Risk Engine Dual Signoff · 1h ago</div>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">
                BLOCKED
              </span>
            </div>

            <div className="p-2 rounded bg-noc-surface/60 border border-noc-border flex items-start justify-between">
              <div>
                <div className="text-slate-200">BACKUP_CREATE · Nightly</div>
                <div className="text-[10px] text-slate-500">Auto RSC snapshot · 4h ago</div>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                SAVED
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
