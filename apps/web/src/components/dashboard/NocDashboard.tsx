// Enterprise NOC Dashboard Component - Holographic Luxury Theme
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
  Radio,
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
      {/* SECTION 1: NETWORK HEALTH STATUS BAR (Holographic Luxury Glass) */}
      <div className="glass-holo rounded-xl p-4 shadow-[0_8px_32px_rgba(112,26,117,0.25)] relative overflow-hidden">
        {/* Subtle Holographic Prismatic Top Accent Line */}
        <div className="holo-line absolute top-0 left-0 right-0" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-purple-500/20 pb-3 mb-3">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-transparent bg-gradient-to-r from-fuchsia-400 via-purple-300 to-teal-300 bg-clip-text font-bold flex items-center space-x-1.5">
              <Sparkles className="w-3 h-3 text-fuchsia-400" />
              <span>ENTERPRISE HOLOGRAPHIC OBSERVABILITY</span>
            </div>
            <h1 className="text-base font-bold text-white font-mono flex items-center space-x-2 mt-0.5">
              <span className="text-holo-gradient text-lg font-extrabold tracking-wide">NETWORK HEALTH</span>
              <span className="text-purple-400/50 font-normal">|</span>
              <span className="text-xs font-normal text-purple-200/80">42 Monitored Devices</span>
            </h1>
          </div>

          {/* 39 ONLINE   2 WARNING   1 OFFLINE (Holographic Badges) */}
          <div className="flex items-center space-x-2.5 font-mono text-xs">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.3)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              <span className="font-bold">39 ONLINE</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-400/40 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.3)]">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#fbbf24]" />
              <span className="font-bold">2 WARNING</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-rose-500/15 border border-rose-400/40 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
              <span className="w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_8px_#f43f5e]" />
              <span className="font-bold">1 OFFLINE</span>
            </div>
          </div>
        </div>

        {/* Dense Telemetry KPIs with Holographic Sheen */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-[#1E1045]/70 border border-purple-500/25 shadow-sm">
            <span className="text-purple-300/70 text-[10px] block font-medium">AVG CPU LOAD</span>
            <span className="text-lg font-bold text-teal-300">22.4%</span>
            <span className="text-[10px] text-purple-400/60 block">Peak: SW-07 (74%)</span>
          </div>

          <div className="p-3 rounded-lg bg-[#1E1045]/70 border border-purple-500/25 shadow-sm">
            <span className="text-purple-300/70 text-[10px] block font-medium">AVG MEMORY</span>
            <span className="text-lg font-bold text-fuchsia-300">44.8%</span>
            <span className="text-[10px] text-purple-400/60 block">3.2 GB Free</span>
          </div>

          <div className="p-3 rounded-lg bg-[#1E1045]/70 border border-purple-500/25 shadow-sm">
            <span className="text-purple-300/70 text-[10px] block font-medium">TRANSIT RX RATE</span>
            <span className="text-lg font-bold text-emerald-300">842 Mbps</span>
            <span className="text-[10px] text-purple-400/60 block">SFP+ 10G Link</span>
          </div>

          <div className="p-3 rounded-lg bg-[#1E1045]/70 border border-purple-500/25 shadow-sm">
            <span className="text-purple-300/70 text-[10px] block font-medium">TRANSIT TX RATE</span>
            <span className="text-lg font-bold text-teal-300">712 Mbps</span>
            <span className="text-[10px] text-purple-400/60 block">Telkom Transit</span>
          </div>

          <div className="p-3 rounded-lg bg-[#1E1045]/70 border border-purple-500/25 shadow-sm">
            <span className="text-purple-300/70 text-[10px] block font-medium">CORE LATENCY</span>
            <span className="text-lg font-bold text-purple-100">2.1 ms</span>
            <span className="text-[10px] text-purple-400/60 block">Jitter: 0.4ms</span>
          </div>

          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-400/30 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.15)]">
            <span className="text-amber-300/80 text-[10px] block font-medium">PACKET LOSS</span>
            <span className="text-lg font-bold text-amber-400">1.4%</span>
            <span className="text-[10px] text-amber-300/70 block">On CORE-02 / SW02</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: TOPOLOGY TREE + ACTIVE INCIDENTS (Holographic Graph) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Topology Holographic Tree Visualizer */}
        <div className="lg:col-span-2 glass-holo rounded-xl p-4 shadow-[0_8px_32px_rgba(112,26,117,0.2)]">
          <div className="flex items-center justify-between mb-3 border-b border-purple-500/20 pb-2">
            <div className="flex items-center space-x-2">
              <Network className="w-4 h-4 text-fuchsia-400" />
              <h2 className="text-xs font-bold text-transparent bg-gradient-to-r from-purple-200 to-fuchsia-200 bg-clip-text font-mono uppercase tracking-wider">
                Active Topology Map
              </h2>
            </div>
            <button
              onClick={() => setCurrentTab('topology')}
              className="text-xs text-teal-300 hover:text-teal-200 font-mono flex items-center space-x-1"
            >
              <span>Open React Flow Canvas</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Holographic Graphical Node Tree */}
          <div className="bg-[#0B051D]/80 border border-purple-500/25 rounded-xl p-6 font-mono text-xs flex flex-col items-center justify-center relative min-h-[220px] shadow-inner">
            {/* ISP Node */}
            <div className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-900/60 to-fuchsia-900/60 border border-purple-400/50 text-purple-100 text-xs font-bold shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              🌐 ISP Transit (AS64512)
            </div>

            {/* Glowing Ethereal Downlink Light Ray */}
            <div className="w-0.5 h-6 bg-gradient-to-b from-teal-400 to-emerald-400 shadow-[0_0_8px_#2dd4bf]" />

            {/* Core Routers MLAG */}
            <div className="flex items-center space-x-10">
              <div
                onClick={() => setCurrentTab('devices')}
                className="px-3.5 py-1.5 rounded-lg bg-[#1E1045] border border-teal-400/50 text-teal-300 cursor-pointer hover:border-teal-300 shadow-[0_0_15px_rgba(45,212,191,0.25)] transition hover:scale-105"
              >
                CORE-01 <span className="text-[10px] text-purple-300/80">(192.168.10.1)</span>
              </div>

              <div className="text-purple-400/70 text-[10px] font-semibold tracking-wider">◄ 10G MLAG ►</div>

              <div
                onClick={() => setCurrentTab('devices')}
                className="px-3.5 py-1.5 rounded-lg bg-[#1E1045] border border-amber-400 text-amber-300 cursor-pointer hover:border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.35)] animate-pulse transition hover:scale-105"
              >
                CORE-02 <span className="text-[10px] text-rose-400 font-bold">(Loss 1.4%)</span>
              </div>
            </div>

            {/* Branching down to switches with glowing light rays */}
            <div className="flex items-center space-x-32 my-1 text-purple-500/50">
              <div className="w-0.5 h-4 bg-purple-500/40" />
              <div className="w-0.5 h-4 bg-purple-500/40" />
            </div>

            {/* Access Switches */}
            <div className="flex items-center space-x-12">
              <div className="px-3 py-1.5 rounded-lg bg-[#1E1045] border border-fuchsia-400/40 text-fuchsia-200 text-xs shadow-sm">
                SW01 <span className="text-[10px] text-purple-300/70">(Dist)</span>
              </div>

              <div className="px-3 py-1.5 rounded-lg bg-[#1E1045] border border-amber-400/40 text-amber-300 text-xs shadow-sm">
                SW02 <span className="text-[10px] text-purple-300/70">(Drops)</span>
              </div>

              <div className="px-3 py-1.5 rounded-lg bg-[#1E1045] border border-purple-500/40 text-purple-300 text-xs shadow-sm">
                SW07 <span className="text-[10px] text-amber-400 font-bold">(CPU 74%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Alerts (Matching User ASCII: 🔴 Packet loss CORE-02, 🟡 CPU SW-07) */}
        <div className="glass-holo rounded-xl p-4 flex flex-col justify-between shadow-[0_8px_32px_rgba(112,26,117,0.2)]">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-purple-500/20 pb-2">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h2 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                  Active Alerts &amp; Incidents
                </h2>
              </div>
              <button
                onClick={() => setCurrentTab('alerts')}
                className="text-[11px] text-teal-300 hover:text-teal-200 font-mono"
              >
                View All
              </button>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              {/* Alert 1: Packet loss CORE-02 (RED / FUCHSIA HOLOGRAPHIC) */}
              <div
                onClick={() => runDiagnosis('Kenapa CORE-02 mengalami packet loss?')}
                className="p-3 rounded-xl bg-rose-500/10 border border-rose-400/40 text-rose-200 cursor-pointer hover:bg-rose-500/15 shadow-[0_0_15px_rgba(244,63,94,0.2)] transition"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_8px_#f43f5e] animate-ping" />
                    <span>🔴 Packet loss CORE-02</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-700 font-bold">
                    1.4% LOSS
                  </span>
                </div>
                <p className="text-[11px] text-purple-200/90 font-sans mt-1">
                  Downlink interface queue drops on interconnect to SW02 port ether8.
                </p>
                <div className="mt-2 text-[10px] text-teal-300 flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-fuchsia-400" />
                  <span>Click to diagnose with AI Copilot</span>
                </div>
              </div>

              {/* Alert 2: CPU SW-07 (YELLOW / GOLD HOLOGRAPHIC) */}
              <div
                onClick={() => runDiagnosis('Analisis kenapa CPU switch SW-07 tinggi?')}
                className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/40 text-amber-200 cursor-pointer hover:bg-amber-500/15 shadow-[0_0_15px_rgba(251,191,36,0.2)] transition"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]" />
                    <span>🟡 CPU SW-07</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-700 font-bold">
                    74% LOAD
                  </span>
                </div>
                <p className="text-[11px] text-purple-200/90 font-sans mt-1">
                  Spanning Tree RSTP convergence recalculation causing temporary spike.
                </p>
                <div className="mt-2 text-[10px] text-teal-300 flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-fuchsia-400" />
                  <span>Click to diagnose with AI Copilot</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-purple-500/20 text-[10px] text-purple-400/60 font-mono flex items-center justify-between">
            <span>Detection: SNMP + ICMP Streamer</span>
            <span>Policy: Auto-Triage Active</span>
          </div>
        </div>
      </div>

      {/* SECTION 3: INTEGRATED 🤖 AI COPILOT WORKSPACE (Holographic Shimmer Card) */}
      <div className="rounded-xl p-5 shadow-[0_0_35px_rgba(168,85,247,0.25)] relative overflow-hidden bg-gradient-to-r from-purple-950/40 via-fuchsia-950/30 to-teal-950/40 backdrop-blur-xl border border-fuchsia-500/40">
        <div className="holo-line absolute top-0 left-0 right-0" />

        <div className="flex items-center justify-between border-b border-purple-500/25 pb-3 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-fuchsia-600 to-purple-600 border border-fuchsia-300/40 flex items-center justify-center text-white shadow-[0_0_15px_rgba(236,72,153,0.5)]">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-sm text-white font-mono flex items-center space-x-2">
                <span className="text-holo-gradient text-base font-extrabold">🤖 AI COPILOT WORKSPACE</span>
                <span className="text-[10px] font-normal px-2.5 py-0.5 rounded-full bg-purple-900/60 border border-purple-500/50 text-purple-200">
                  Ollama: qwen2.5:7b
                </span>
                <span className="text-[10px] font-normal px-2.5 py-0.5 rounded-full bg-teal-900/60 border border-teal-500/50 text-teal-300">
                  Tool-Governed Safety Pipeline
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setAiDrawerOpen(true)}
            className="text-xs text-fuchsia-300 hover:text-fuchsia-200 font-mono flex items-center space-x-1"
          >
            <span>Expand Full Chat Drawer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Active Diagnostic Case (Matching User ASCII) */}
        <div className="space-y-3 font-mono text-xs">
          {/* Operator Question */}
          <div className="p-3.5 rounded-xl bg-[#1E1045]/80 border border-purple-500/30 flex items-start space-x-3 shadow-inner">
            <span className="text-fuchsia-400 font-bold uppercase text-[10px] mt-0.5">QUESTION:</span>
            <div className="text-white text-xs font-sans font-medium flex-1">
              "{activeQuery}"
            </div>
            <button
              onClick={() => runDiagnosis(activeQuery)}
              className="text-[10px] px-3 py-1 rounded-lg bg-gradient-to-r from-purple-800 to-fuchsia-800 hover:from-purple-700 hover:to-fuchsia-700 text-white font-mono font-bold shadow-md transition"
            >
              Re-run Checks
            </button>
          </div>

          {/* 4 Tool Verification Checks (Matching User ASCII) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Check 1 */}
            <div className="p-3 rounded-xl bg-[#140A2E]/80 border border-purple-500/25 hover:border-teal-400/40 transition">
              <div className="flex items-center space-x-2 text-teal-300 font-bold mb-1">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>✓ Interface check</span>
              </div>
              <div className="text-[11px] text-purple-200/90 font-sans">
                ether8 link up (1Gbps Full Duplex). RX drop counter elevated: 1.4%.
              </div>
            </div>

            {/* Check 2 */}
            <div className="p-3 rounded-xl bg-[#140A2E]/80 border border-purple-500/25 hover:border-teal-400/40 transition">
              <div className="flex items-center space-x-2 text-teal-300 font-bold mb-1">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>✓ Route check</span>
              </div>
              <div className="text-[11px] text-purple-200/90 font-sans">
                Default 0.0.0.0/0 valid. BGP peering with AS64512 active &amp; synced.
              </div>
            </div>

            {/* Check 3 */}
            <div className="p-3 rounded-xl bg-[#140A2E]/80 border border-purple-500/25 hover:border-teal-400/40 transition">
              <div className="flex items-center space-x-2 text-teal-300 font-bold mb-1">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>✓ Ping test</span>
              </div>
              <div className="text-[11px] text-purple-200/90 font-sans">
                ISP gateway RTT 1.2ms (0% loss). Downlink SW02 port drops packets.
              </div>
            </div>

            {/* Check 4 */}
            <div className="p-3 rounded-xl bg-[#140A2E]/80 border border-purple-500/25 hover:border-teal-400/40 transition">
              <div className="flex items-center space-x-2 text-teal-300 font-bold mb-1">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>✓ Log analysis</span>
              </div>
              <div className="text-[11px] text-purple-200/90 font-sans">
                Buffer saturation in simple queue during peak hour traffic burst.
              </div>
            </div>
          </div>

          {/* AI Synthesis & Action Recommendation */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-purple-900/30 via-fuchsia-900/20 to-teal-900/25 border border-purple-500/35 text-slate-200 shadow-md">
            <div className="flex items-center justify-between mb-1.5 text-[11px]">
              <span className="text-fuchsia-300 font-bold flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
                <span>AI ROOT CAUSE CONCLUSION:</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 font-bold text-[10px]">
                ACTION RISK: HIGH
              </span>
            </div>
            <p className="text-xs font-sans text-purple-200/95 leading-relaxed">
              CORE-02 is dropping traffic destined for SW02 because the interface buffer on port <code className="text-fuchsia-300 bg-[#1E1045] px-1.5 py-0.5 rounded border border-purple-500/30">ether8</code> has reached its default queue limit. Upstream transit connectivity is completely normal.
            </p>

            <div className="mt-3 pt-2.5 border-t border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="text-[11px] text-purple-300/80 font-mono">
                Proposed Command: <code className="text-teal-300 font-mono font-bold bg-[#140A2E] px-2 py-0.5 rounded">/queue interface set ether8 queue=ethernet-default</code>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => alert('Change safety pipeline: Creating snapshot backup -> Generating visual diff -> Requesting operator confirmation.')}
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(52,211,153,0.4)] transition hover:scale-105"
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
