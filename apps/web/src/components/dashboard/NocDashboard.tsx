// Enterprise NOC Dashboard Component
// Designed according to AUDIRA NetOps AI Layout: Network Health + Topology Tree + Incidents + Integrated AI Copilot

import React, { useState } from 'react';
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
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  Network,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
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

export const NocDashboard: React.FC = () => {
  const { setCurrentTab, setAiDrawerOpen } = useNetOpsStore();
  const [copilotExpanded, setCopilotExpanded] = useState(true);
  const [activeQuery, setActiveQuery] = useState('Kenapa CORE-02 mengalami packet loss?');
  const [isDiagnosing, setIsDiagnosing] = useState(false);

  const runDiagnosis = (query: string) => {
    setActiveQuery(query);
    setIsDiagnosing(true);
    setTimeout(() => {
      setIsDiagnosing(false);
    }, 600);
  };

  return (
    <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-3.5rem)] select-none">
      {/* SECTION 1: NETWORK HEALTH STATUS BAR (Matching User ASCII) */}
      <div className="bg-noc-panel border border-noc-border rounded-lg p-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-noc-border pb-3 mb-3">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-semibold">
              ENTERPRISE OBSERVABILITY
            </div>
            <h1 className="text-base font-bold text-white font-mono flex items-center space-x-2">
              <span>NETWORK HEALTH</span>
              <span className="text-slate-500 font-normal">|</span>
              <span className="text-xs font-normal text-slate-300">42 Monitored Devices</span>
            </h1>
          </div>

          {/* 39 ONLINE   2 WARNING   1 OFFLINE (ASCII Match) */}
          <div className="flex items-center space-x-2 font-mono text-xs">
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-bold">39 ONLINE</span>
            </div>
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-bold">2 WARNING</span>
            </div>
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span className="font-bold">1 OFFLINE</span>
            </div>
          </div>
        </div>

        {/* Dense Telemetry KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs font-mono">
          <div className="p-2.5 rounded bg-noc-surface border border-noc-border">
            <span className="text-slate-400 text-[10px] block">AVG CPU LOAD</span>
            <span className="text-lg font-bold text-emerald-400">22.4%</span>
            <span className="text-[10px] text-slate-500 block">Peak: SW-07 (74%)</span>
          </div>

          <div className="p-2.5 rounded bg-noc-surface border border-noc-border">
            <span className="text-slate-400 text-[10px] block">AVG MEMORY</span>
            <span className="text-lg font-bold text-cyan-400">44.8%</span>
            <span className="text-[10px] text-slate-500 block">3.2 GB Free</span>
          </div>

          <div className="p-2.5 rounded bg-noc-surface border border-noc-border">
            <span className="text-slate-400 text-[10px] block">TRANSIT RX RATE</span>
            <span className="text-lg font-bold text-emerald-400">842 Mbps</span>
            <span className="text-[10px] text-slate-500 block">SFP+ 10G Link</span>
          </div>

          <div className="p-2.5 rounded bg-noc-surface border border-noc-border">
            <span className="text-slate-400 text-[10px] block">TRANSIT TX RATE</span>
            <span className="text-lg font-bold text-cyan-400">712 Mbps</span>
            <span className="text-[10px] text-slate-500 block">Telkom Transit</span>
          </div>

          <div className="p-2.5 rounded bg-noc-surface border border-noc-border">
            <span className="text-slate-400 text-[10px] block">CORE LATENCY</span>
            <span className="text-lg font-bold text-white">2.1 ms</span>
            <span className="text-[10px] text-slate-500 block">Jitter: 0.4ms</span>
          </div>

          <div className="p-2.5 rounded bg-noc-surface border border-amber-500/30 text-amber-400">
            <span className="text-amber-400/80 text-[10px] block">PACKET LOSS</span>
            <span className="text-lg font-bold text-amber-400">1.4%</span>
            <span className="text-[10px] text-amber-400/70 block">On CORE-02 / SW02</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: TOPOLOGY TREE + ACTIVE INCIDENTS (ASCII Match) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Topology ASCII/Tree Visualizer */}
        <div className="lg:col-span-2 bg-noc-panel border border-noc-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3 border-b border-noc-border pb-2">
            <div className="flex items-center space-x-2">
              <Network className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                Active Topology Map
              </h2>
            </div>
            <button
              onClick={() => setCurrentTab('topology')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center space-x-1"
            >
              <span>Open React Flow Canvas</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* ASCII / Graphical Node Tree */}
          <div className="bg-[#050810] border border-noc-border rounded-lg p-4 font-mono text-xs flex flex-col items-center justify-center relative min-h-[200px]">
            {/* ISP Node */}
            <div className="px-3 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold shadow">
              🌐 ISP Transit (AS64512)
            </div>

            {/* Downlink Line */}
            <div className="w-0.5 h-6 bg-emerald-500" />

            {/* Core Routers MLAG */}
            <div className="flex items-center space-x-10">
              <div
                onClick={() => setCurrentTab('devices')}
                className="px-3 py-1.5 rounded bg-noc-panel border border-emerald-500/50 text-emerald-400 cursor-pointer hover:border-emerald-400 shadow glow-emerald"
              >
                CORE-01 <span className="text-[10px] text-slate-400">(192.168.10.1)</span>
              </div>

              <div className="text-slate-600 text-[10px]">◄ 10G MLAG ►</div>

              <div
                onClick={() => setCurrentTab('devices')}
                className="px-3 py-1.5 rounded bg-noc-panel border border-amber-500 text-amber-400 cursor-pointer hover:border-amber-300 shadow glow-amber animate-pulse"
              >
                CORE-02 <span className="text-[10px] text-slate-400">(Loss 1.4%)</span>
              </div>
            </div>

            {/* Branching down to switches */}
            <div className="flex items-center space-x-32 my-1 text-slate-600">
              <div>│</div>
              <div>│</div>
            </div>

            {/* Access Switches */}
            <div className="flex items-center space-x-16">
              <div className="px-3 py-1.5 rounded bg-noc-panel border border-cyan-500/50 text-cyan-300 text-xs">
                SW01 <span className="text-[10px] text-slate-400">(Dist)</span>
              </div>

              <div className="px-3 py-1.5 rounded bg-noc-panel border border-amber-500/50 text-amber-300 text-xs">
                SW02 <span className="text-[10px] text-slate-400">(Drops)</span>
              </div>

              <div className="px-3 py-1.5 rounded bg-noc-panel border border-slate-700 text-slate-400 text-xs">
                SW07 <span className="text-[10px] text-amber-400">(CPU 74%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Alerts (Matching User ASCII: 🔴 Packet loss CORE-02, 🟡 CPU SW-07) */}
        <div className="bg-noc-panel border border-noc-border rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-noc-border pb-2">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h2 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                  Active Alerts &amp; Incidents
                </h2>
              </div>
              <button
                onClick={() => setCurrentTab('alerts')}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono"
              >
                View All
              </button>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              {/* Alert 1: Packet loss CORE-02 (RED) */}
              <div
                onClick={() => runDiagnosis('Kenapa CORE-02 mengalami packet loss?')}
                className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/40 text-rose-300 cursor-pointer hover:bg-rose-500/15 transition"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    <span>🔴 Packet loss CORE-02</span>
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800">
                    1.4% LOSS
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-sans mt-1">
                  Downlink interface queue drops on interconnect to SW02 port ether8.
                </p>
                <div className="mt-2 text-[10px] text-cyan-400 flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Click to diagnose with AI Copilot</span>
                </div>
              </div>

              {/* Alert 2: CPU SW-07 (YELLOW) */}
              <div
                onClick={() => runDiagnosis('Analisis kenapa CPU switch SW-07 tinggi?')}
                className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/40 text-amber-300 cursor-pointer hover:bg-amber-500/15 transition"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>🟡 CPU SW-07</span>
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800">
                    74% LOAD
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-sans mt-1">
                  Spanning Tree RSTP convergence recalculation causing temporary spike.
                </p>
                <div className="mt-2 text-[10px] text-cyan-400 flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Click to diagnose with AI Copilot</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-noc-border text-[10px] text-slate-500 font-mono flex items-center justify-between">
            <span>Detection: SNMP + ICMP Streamer</span>
            <span>Policy: Auto-Triage Active</span>
          </div>
        </div>
      </div>

      {/* SECTION 3: INTEGRATED 🤖 AI COPILOT WORKSPACE (Matching User ASCII) */}
      <div className="bg-noc-panel border border-cyan-500/30 rounded-lg p-4 shadow-lg glow-cyan">
        <div className="flex items-center justify-between border-b border-noc-border pb-3 mb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded bg-cyan-950 border border-cyan-700 flex items-center justify-center text-cyan-300">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-sm text-white font-mono flex items-center space-x-2">
                <span>🤖 AI COPILOT WORKSPACE</span>
                <span className="text-[10px] font-normal px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-300">
                  Ollama: qwen2.5:7b
                </span>
                <span className="text-[10px] font-normal px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300">
                  Tool-Governed Safety Pipeline
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setAiDrawerOpen(true)}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center space-x-1"
          >
            <span>Expand Full Chat Drawer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Active Diagnostic Case (Matching User ASCII) */}
        <div className="space-y-3 font-mono text-xs">
          {/* Operator Question */}
          <div className="p-3 rounded-lg bg-noc-surface border border-noc-border flex items-start space-x-3">
            <span className="text-cyan-400 font-bold uppercase text-[10px] mt-0.5">QUESTION:</span>
            <div className="text-white text-xs font-sans font-medium flex-1">
              "{activeQuery}"
            </div>
            <button
              onClick={() => runDiagnosis(activeQuery)}
              className="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-mono transition"
            >
              Re-run Checks
            </button>
          </div>

          {/* 4 Tool Verification Checks (Matching User ASCII) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {/* Check 1 */}
            <div className="p-2.5 rounded bg-[#050810] border border-noc-border">
              <div className="flex items-center space-x-1.5 text-emerald-400 font-bold mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>✓ Interface check</span>
              </div>
              <div className="text-[11px] text-slate-300">
                ether8 link up (1Gbps Full Duplex). RX drop counter elevated: 1.4%.
              </div>
            </div>

            {/* Check 2 */}
            <div className="p-2.5 rounded bg-[#050810] border border-noc-border">
              <div className="flex items-center space-x-1.5 text-emerald-400 font-bold mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>✓ Route check</span>
              </div>
              <div className="text-[11px] text-slate-300">
                Default 0.0.0.0/0 valid. BGP peering with AS64512 active &amp; synced.
              </div>
            </div>

            {/* Check 3 */}
            <div className="p-2.5 rounded bg-[#050810] border border-noc-border">
              <div className="flex items-center space-x-1.5 text-emerald-400 font-bold mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>✓ Ping test</span>
              </div>
              <div className="text-[11px] text-slate-300">
                ISP gateway RTT 1.2ms (0% loss). Downlink SW02 port drops packets.
              </div>
            </div>

            {/* Check 4 */}
            <div className="p-2.5 rounded bg-[#050810] border border-noc-border">
              <div className="flex items-center space-x-1.5 text-emerald-400 font-bold mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>✓ Log analysis</span>
              </div>
              <div className="text-[11px] text-slate-300">
                Buffer saturation in simple queue during peak hour traffic burst.
              </div>
            </div>
          </div>

          {/* AI Synthesis & Action Recommendation */}
          <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-slate-200">
            <div className="flex items-center justify-between mb-1 text-[11px]">
              <span className="text-cyan-400 font-bold flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>AI ROOT CAUSE CONCLUSION:</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/40 font-bold text-[10px]">
                ACTION RISK: HIGH
              </span>
            </div>
            <p className="text-xs font-sans text-slate-300 leading-relaxed">
              CORE-02 is dropping traffic destined for SW02 because the interface buffer on port <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">ether8</code> has reached its default queue limit. Upstream transit connectivity is completely normal.
            </p>

            <div className="mt-2.5 pt-2 border-t border-cyan-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="text-[11px] text-slate-400 font-mono">
                Proposed Command: <code className="text-emerald-400 font-mono">/queue interface set ether8 queue=ethernet-default</code>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => alert('Change safety pipeline: Creating snapshot backup -> Generating visual diff -> Requesting operator confirmation.')}
                  className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow glow-emerald transition"
                >
                  Remediate with Safety Pipeline
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
