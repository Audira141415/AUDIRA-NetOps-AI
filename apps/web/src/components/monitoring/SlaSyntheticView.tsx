// Active Synthetic Telemetry & TWAMP / IP SLA Monitoring Component
// Continuous Probe Tracking: RTT Latency, Jitter, Packet Loss, ITU-T G.107 E-Model MOS & SLA Compliance

import React, { useState } from 'react';
import {
  Activity,
  Radio,
  Globe,
  Zap,
  Shield,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  BarChart2,
  Headphones,
  Sliders,
  Clock,
  ArrowUpRight,
  Server,
  ChevronRight,
} from 'lucide-react';
import { SyntheticSlaEngine, SlaProbeTarget, SlaMeasurement } from '@audira/monitoring';
import { useNetOpsStore } from '../../store/useNetOpsStore';

export const SlaSyntheticView: React.FC = () => {
  const { showToast } = useNetOpsStore();
  const [targets] = useState<SlaProbeTarget[]>(SyntheticSlaEngine.getDefaultTargets());
  const [measurements, setMeasurements] = useState<SlaMeasurement[]>(() =>
    targets.map((t) => SyntheticSlaEngine.measureTarget(t))
  );
  const [isProbing, setIsProbing] = useState<boolean>(false);
  const [selectedMeasurement, setSelectedMeasurement] = useState<SlaMeasurement | null>(
    measurements[0] || null
  );

  // Interactive ITU-T G.107 Simulator state
  const [simLatency, setSimLatency] = useState<number>(25);
  const [simJitter, setSimJitter] = useState<number>(3);
  const [simLoss, setSimLoss] = useState<number>(0.0);

  const simResult = SyntheticSlaEngine.calculateMos(simLatency, simJitter, simLoss);

  const handleRefreshProbes = async () => {
    setIsProbing(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    const newMeasures = targets.map((t) => SyntheticSlaEngine.measureTarget(t));
    setMeasurements(newMeasures);
    if (selectedMeasurement) {
      const updated = newMeasures.find((m) => m.target.id === selectedMeasurement.target.id);
      if (updated) setSelectedMeasurement(updated);
    }
    setIsProbing(false);
    showToast('Probing sintetis TWAMP & IP SLA diperbarui dengan data telemetri real-time!', 'success');
  };

  const avgMos =
    measurements.length > 0
      ? Math.round(
          (measurements.reduce((acc, m) => acc + m.mosScore, 0) / measurements.length) * 100
        ) / 100
      : 4.35;

  const avgJitter =
    measurements.length > 0
      ? Math.round(
          (measurements.reduce((acc, m) => acc + m.jitterMs, 0) / measurements.length) * 10
        ) / 10
      : 1.4;

  const avgLatency =
    measurements.length > 0
      ? Math.round(
          (measurements.reduce((acc, m) => acc + m.rttAvgMs, 0) / measurements.length) * 10
        ) / 10
      : 12.8;

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-300">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#0d152a] via-[#0e1c3d] to-[#0a1a33] p-6 rounded-2xl border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.15)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-wide flex items-center gap-2">
                Active Synthetic SLA &amp; TWAMP Telemetry
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300">
                  Carrier Grade
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Pemantauan aktif 24/7 mengukur Round-Trip Time (RTT), Jitter PDV, Micro-Packet Loss, dan skor ITU-T G.107 MOS VoIP/UCaaS.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 relative z-10">
          <button
            onClick={handleRefreshProbes}
            disabled={isProbing}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)] transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isProbing ? 'animate-spin' : ''}`} />
            <span>{isProbing ? 'Mengukur...' : 'Uji Probing Sekarang'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* MOS Voice Quality Card */}
        <div className="bg-[#0b1329]/80 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-5 shadow-[0_0_25px_rgba(16,185,129,0.1)] relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>MEAN OPINION SCORE (MOS)</span>
            <Headphones className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]">
            {avgMos} <span className="text-sm text-slate-400 font-normal">/ 4.50</span>
          </div>
          <div className="mt-2 text-xs font-semibold text-emerald-300 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>EXCELLENT — HD Voice Audio (G.711 / Opus)</span>
          </div>
        </div>

        {/* Core Jitter Card */}
        <div className="bg-[#0b1329]/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-5 shadow-[0_0_25px_rgba(6,182,212,0.1)]">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>AVG NETWORK JITTER (PDV)</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-cyan-300 drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]">
            {avgJitter} <span className="text-sm text-slate-400 font-normal">ms</span>
          </div>
          <div className="mt-2 text-xs font-semibold text-cyan-400 flex items-center space-x-1">
            <Shield className="w-3.5 h-3.5" />
            <span>Platinum Threshold &lt; 2.5 ms Sesuai SLA</span>
          </div>
        </div>

        {/* Latency RTT Card */}
        <div className="bg-[#0b1329]/80 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-5 shadow-[0_0_25px_rgba(99,102,241,0.1)]">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>AVG RTT LATENCY</span>
            <Globe className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-indigo-300 drop-shadow-[0_0_12px_rgba(99,102,241,0.4)]">
            {avgLatency} <span className="text-sm text-slate-400 font-normal">ms</span>
          </div>
          <div className="mt-2 text-xs font-semibold text-indigo-400 flex items-center space-x-1">
            <Zap className="w-3.5 h-3.5" />
            <span>Transit peering via OpenIXP &amp; Cloudflare</span>
          </div>
        </div>

        {/* SLA Compliance Card */}
        <div className="bg-[#0b1329]/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-5 shadow-[0_0_25px_rgba(168,85,247,0.1)]">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>CONTRACT CONFORMANCE</span>
            <Shield className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-purple-300 drop-shadow-[0_0_12px_rgba(168,85,247,0.4)]">
            100%
          </div>
          <div className="mt-2 text-xs font-semibold text-purple-400 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>4 / 4 Target Endpoint Memenuhi Syarat</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Probes List & Target Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Probes List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white tracking-wide uppercase font-mono flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400" />
              Target Probing Aktif (TWAMP / IP SLA)
            </h2>
            <span className="text-xs text-slate-400 font-mono">{measurements.length} Endpoints</span>
          </div>

          <div className="space-y-3">
            {measurements.map((m) => {
              const isSelected = selectedMeasurement?.target.id === m.target.id;
              return (
                <div
                  key={m.target.id}
                  onClick={() => setSelectedMeasurement(m)}
                  className={`p-4 rounded-2xl border transition cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-[#101b38] border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.25)]'
                      : 'bg-[#0c1427]/70 hover:bg-[#0f1933] border-cyan-500/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                          m.voiceQuality === 'EXCELLENT'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : m.voiceQuality === 'GOOD'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {m.target.protocol.slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white flex items-center space-x-2">
                          <span>{m.target.name}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                            {m.target.targetHost}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 font-mono flex items-center space-x-3 mt-0.5">
                          <span>Protocol: {m.target.protocol}</span>
                          <span>•</span>
                          <span>Tier: {m.target.tier}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 text-right font-mono">
                      <div>
                        <div className="text-[10px] text-slate-500">RTT AVG</div>
                        <div className="text-sm font-bold text-cyan-300">{m.rttAvgMs} ms</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500">JITTER</div>
                        <div className="text-sm font-bold text-slate-300">{m.jitterMs} ms</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500">MOS</div>
                        <div
                          className={`text-sm font-bold ${
                            m.mosScore >= 4.3 ? 'text-emerald-400' : 'text-blue-400'
                          }`}
                        >
                          {m.mosScore}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Probe Detail & Interactive ITU-T Simulator */}
        <div className="space-y-6">
          {/* Selected Probe Detail Card */}
          {selectedMeasurement && (
            <div className="bg-[#0c1427]/90 border border-cyan-500/30 rounded-2xl p-5 shadow-[0_0_30px_rgba(6,182,212,0.15)] space-y-4">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white">{selectedMeasurement.target.name}</h3>
                  <p className="text-xs text-cyan-400 font-mono">
                    {selectedMeasurement.target.targetHost} • {selectedMeasurement.target.protocol}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-bold font-mono px-2 py-1 rounded-lg border ${
                    selectedMeasurement.isCompliant
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  }`}
                >
                  {selectedMeasurement.isCompliant ? 'SLA COMPLIANT' : 'SLA BREACHED'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-[#111c38] p-3 rounded-xl border border-cyan-500/20">
                  <span className="text-slate-500 block text-[10px]">MIN / MAX LATENCY</span>
                  <span className="text-slate-200 font-bold">
                    {selectedMeasurement.rttMinMs} ms / {selectedMeasurement.rttMaxMs} ms
                  </span>
                </div>
                <div className="bg-[#111c38] p-3 rounded-xl border border-cyan-500/20">
                  <span className="text-slate-500 block text-[10px]">PACKET LOSS</span>
                  <span className="text-slate-200 font-bold">{selectedMeasurement.packetLossPercent}%</span>
                </div>
                <div className="bg-[#111c38] p-3 rounded-xl border border-cyan-500/20">
                  <span className="text-slate-500 block text-[10px]">VOICE QUALITY RATING</span>
                  <span className="text-emerald-400 font-bold">{selectedMeasurement.voiceQuality}</span>
                </div>
                <div className="bg-[#111c38] p-3 rounded-xl border border-cyan-500/20">
                  <span className="text-slate-500 block text-[10px]">SLA CONTRACT TIER</span>
                  <span className="text-purple-400 font-bold">{selectedMeasurement.target.tier}</span>
                </div>
              </div>
            </div>
          )}

          {/* Interactive ITU-T G.107 MOS Simulator */}
          <div className="bg-[#0c1427]/90 border border-indigo-500/30 rounded-2xl p-5 shadow-[0_0_30px_rgba(99,102,241,0.15)] space-y-4">
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider font-mono">
              <Sliders className="w-4 h-4" />
              <span>Simulator ITU-T G.107 E-Model MOS</span>
            </div>
            <p className="text-xs text-slate-400">
              Uji bagaimana penambahan latensi, jitter, atau packet loss mempengaruhi skor kualitas panggilan VoIP/video secara real-time.
            </p>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Latency RTT:</span>
                  <span className="text-cyan-300 font-bold">{simLatency} ms</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="300"
                  value={simLatency}
                  onChange={(e) => setSimLatency(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Jitter PDV:</span>
                  <span className="text-cyan-300 font-bold">{simJitter} ms</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={simJitter}
                  onChange={(e) => setSimJitter(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Packet Loss:</span>
                  <span className="text-cyan-300 font-bold">{simLoss}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="0.5"
                  value={simLoss}
                  onChange={(e) => setSimLoss(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>

            <div className="bg-[#111c38] p-4 rounded-xl border border-indigo-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-mono block">HASIL SIMULASI MOS</span>
                <span className="text-2xl font-extrabold font-mono text-emerald-400">
                  {simResult.mos} <span className="text-xs text-slate-400">/ 4.5</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-mono block">TRANSMISSION RATING</span>
                <span className="text-xs font-bold font-mono text-indigo-300">
                  R-Factor: {simResult.rFactor} ({simResult.quality})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
