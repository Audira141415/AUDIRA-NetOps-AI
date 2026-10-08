// Live Packet Sniffer, RouterOS Torch Stream & AI Threat Inspector
// High-frequency packet streaming, protocol analytics, anomaly triage & automated mitigations

import React, { useState, useEffect } from 'react';
import {
  Activity,
  Play,
  Square,
  Filter,
  ShieldAlert,
  ShieldCheck,
  Bot,
  Terminal,
  Zap,
  ArrowDownUp,
  Search,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

export interface PacketEntry {
  id: string;
  time: string;
  srcIp: string;
  srcPort: number;
  dstIp: string;
  dstPort: number;
  protocol: 'TCP' | 'UDP' | 'ICMP';
  length: number;
  flags: string;
  rateKbps: number;
  isAnomaly?: boolean;
}

const SAMPLE_PACKETS: PacketEntry[] = [
  { id: 'pkt-1', time: '08:14:02.102', srcIp: '198.51.100.42', srcPort: 48921, dstIp: '192.168.10.1', dstPort: 80, protocol: 'TCP', length: 54, flags: '[SYN]', rateKbps: 4200, isAnomaly: true },
  { id: 'pkt-2', time: '08:14:02.105', srcIp: '198.51.100.42', srcPort: 48922, dstIp: '192.168.10.1', dstPort: 80, protocol: 'TCP', length: 54, flags: '[SYN]', rateKbps: 4180, isAnomaly: true },
  { id: 'pkt-3', time: '08:14:02.112', srcIp: '198.51.100.42', srcPort: 48923, dstIp: '192.168.10.1', dstPort: 80, protocol: 'TCP', length: 54, flags: '[SYN]', rateKbps: 4210, isAnomaly: true },
  { id: 'pkt-4', time: '08:14:02.120', srcIp: '10.20.0.15', srcPort: 53210, dstIp: '1.1.1.1', dstPort: 53, protocol: 'UDP', length: 78, flags: '-', rateKbps: 32 },
  { id: 'pkt-5', time: '08:14:02.135', srcIp: '192.168.10.200', srcPort: 443, dstIp: '172.16.5.88', dstPort: 56124, protocol: 'TCP', length: 1460, flags: '[ACK, PSH]', rateKbps: 28400 },
  { id: 'pkt-6', time: '08:14:02.148', srcIp: '203.0.113.8', srcPort: 33211, dstIp: '192.168.10.1', dstPort: 8291, protocol: 'TCP', length: 60, flags: '[SYN]', rateKbps: 18, isAnomaly: true },
  { id: 'pkt-7', time: '08:14:02.160', srcIp: '10.10.1.1', srcPort: 0, dstIp: '10.10.1.2', dstPort: 0, protocol: 'ICMP', length: 64, flags: 'Echo Req', rateKbps: 8 },
  { id: 'pkt-8', time: '08:14:02.175', srcIp: '192.168.10.1', srcPort: 443, dstIp: '192.168.10.50', dstPort: 51204, protocol: 'TCP', length: 1420, flags: '[ACK]', rateKbps: 14200 },
];

export const PacketSnifferView: React.FC = () => {
  const [isCapturing, setIsCapturing] = useState<boolean>(true);
  const [selectedInterface, setSelectedInterface] = useState<string>('ether1-wan');
  const [filterProtocol, setFilterProtocol] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [packets, setPackets] = useState<PacketEntry[]>(SAMPLE_PACKETS);
  const [packetCount, setPacketCount] = useState<number>(14820);
  const [aiReport, setAiReport] = useState<{
    severity: 'CRITICAL' | 'WARNING' | 'CLEAN';
    threatName: string;
    description: string;
    recommendation: string;
    suggestedRule: string;
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isMitigated, setIsMitigated] = useState<boolean>(false);

  // Live packet streaming simulation
  useEffect(() => {
    if (!isCapturing) return;

    const interval = setInterval(() => {
      setPacketCount((prev) => prev + Math.floor(Math.random() * 25) + 10);

      const rnd = Math.random();
      const newPacket: PacketEntry = {
        id: `pkt-${Date.now()}`,
        time: new Date().toISOString().substring(11, 23),
        srcIp: rnd > 0.6 ? '198.51.100.42' : `192.168.10.${Math.floor(Math.random() * 200) + 10}`,
        srcPort: Math.floor(Math.random() * 50000) + 1024,
        dstIp: rnd > 0.6 ? '192.168.10.1' : '1.1.1.1',
        dstPort: rnd > 0.6 ? 80 : 443,
        protocol: rnd > 0.8 ? 'UDP' : 'TCP',
        length: rnd > 0.6 ? 54 : 1420,
        flags: rnd > 0.6 ? '[SYN]' : '[ACK]',
        rateKbps: Math.floor(Math.random() * 8000) + 200,
        isAnomaly: rnd > 0.6,
      };

      setPackets((prev) => [newPacket, ...prev.slice(0, 49)]);
    }, 1200);

    return () => clearInterval(interval);
  }, [isCapturing]);

  const handleRunAiInspection = async () => {
    setIsAnalyzing(true);
    setAiReport(null);

    await new Promise((resolve) => setTimeout(resolve, 1400));

    setAiReport({
      severity: 'CRITICAL',
      threatName: 'TCP SYN Flood Volumetric Attack Detected',
      description:
        'AI Threat Inspector mendeteksi lonjakan paket TCP dengan SYN flag tunggal dari IP publik 198.51.100.42 menuju web gateway port 80. Rasio SYN/ACK mencapai 98.4% dengan ukuran paket seragam 54 bytes (PPS: 8,420 pps).',
      recommendation:
        'Terapkan MikroTik Raw Firewall Filter untuk memutus koneksi sebelum masuk ke Connection Tracking demi menghemat CPU.',
      suggestedRule:
        '/ip/firewall/raw add chain=prerouting src-address=198.51.100.42 action=drop comment="AI Auto-Quarantine: SYN Flood Mitigated"',
    });
    setIsAnalyzing(false);
  };

  const handleApplyMitigation = () => {
    setIsMitigated(true);
    alert('✔ Aturan firewall RouterOS berhasil diterapkan secara otomatis! Sumber penyerang telah diblokir di RAW prerouting.');
  };

  const filteredPackets = packets.filter((p) => {
    if (filterProtocol !== 'ALL' && p.protocol !== filterProtocol) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.srcIp.includes(q) ||
        p.dstIp.includes(q) ||
        String(p.srcPort).includes(q) ||
        String(p.dstPort).includes(q) ||
        p.flags.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto select-none">
      {/* Top Banner */}
      <div className="bg-[#0b1329]/90 border border-cyan-500/30 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[0_4px_25px_rgba(6,182,212,0.1)]">
        <div className="flex items-center space-x-3.5">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold text-white tracking-wide">Live Packet Sniffer &amp; Torch Analyzer</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono font-semibold">
                Wire-Speed Telemetry
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Live RouterOS /tool/torch streaming, deep packet inspection, AI threat triage, and instant firewall drops
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsCapturing(!isCapturing)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition shadow-lg ${
              isCapturing
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
            }`}
          >
            {isCapturing ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isCapturing ? 'Pause Capture' : 'Resume Capture'}</span>
          </button>

          <button
            onClick={handleRunAiInspection}
            disabled={isAnalyzing}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-lg text-xs font-semibold shadow-[0_0_20px_rgba(168,85,247,0.4)] transition disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAnalyzing ? 'Inspecting Packets...' : 'AI Threat Analysis'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-[#090f20]/90 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Packets Captured</div>
            <div className="text-xl font-bold font-mono text-white mt-1">{packetCount.toLocaleString()}</div>
          </div>
          <div className="p-2 rounded bg-cyan-500/10 text-cyan-400 font-mono text-xs">
            {isCapturing ? 'STREAMING' : 'PAUSED'}
          </div>
        </div>

        <div className="bg-[#090f20]/90 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Current Throughput</div>
            <div className="text-xl font-bold font-mono text-cyan-300 mt-1">42.8 Mbps</div>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">RX: 38M / TX: 4.8M</div>
        </div>

        <div className="bg-[#090f20]/90 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Anomaly Heuristic</div>
            <div className="text-xl font-bold font-mono text-amber-400 mt-1">High Volumetric</div>
          </div>
          <ShieldAlert className="w-5 h-5 text-amber-400 animate-pulse" />
        </div>

        <div className="bg-[#090f20]/90 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Active Interface</div>
            <div className="text-base font-bold font-mono text-emerald-400 mt-1">{selectedInterface}</div>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">10G SFP+ Link</div>
        </div>
      </div>

      {/* AI Threat Inspection Drawer / Alert (if generated) */}
      {aiReport && (
        <div className="bg-[#120e26] border border-purple-500/50 rounded-xl p-4 shadow-[0_0_30px_rgba(168,85,247,0.25)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-bold text-white font-sans">{aiReport.threatName}</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
                {aiReport.severity}
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Model: Qwen2.5-7B (Audira NetOps)</span>
          </div>

          <p className="text-xs text-slate-300">{aiReport.description}</p>

          <div className="bg-[#080516] p-3 rounded-lg border border-purple-500/30 font-mono text-xs space-y-1.5">
            <div className="text-[10px] text-cyan-400 uppercase font-bold">Recommended Mitigation Rule:</div>
            <code className="text-emerald-300 text-[11px] block overflow-x-auto whitespace-pre">
              {aiReport.suggestedRule}
            </code>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-1">
            <button
              onClick={handleApplyMitigation}
              disabled={isMitigated}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono flex items-center space-x-1.5 transition ${
                isMitigated
                  ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 cursor-default'
                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
              }`}
            >
              {isMitigated ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
              <span>{isMitigated ? 'Mitigation Active (Blocked)' : 'Deploy Raw Drop Rule'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Sniffer Toolbar Controls */}
      <div className="bg-[#0b1329]/90 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 text-[11px]">Interface:</span>
          {['ether1-wan', 'sfp-sfpplus1', 'bridge-lan'].map((iface) => (
            <button
              key={iface}
              onClick={() => setSelectedInterface(iface)}
              className={`px-2.5 py-1 rounded-md text-[11px] transition ${
                selectedInterface === iface
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {iface}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <span className="text-slate-400 text-[11px]">Proto:</span>
            {['ALL', 'TCP', 'UDP', 'ICMP'].map((proto) => (
              <button
                key={proto}
                onClick={() => setFilterProtocol(proto)}
                className={`px-2 py-0.5 rounded text-[10px] transition ${
                  filterProtocol === proto
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {proto}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search IP, Port, Flag..."
              className="pl-8 pr-3 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-44 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Packet Table Stream */}
      <div className="bg-[#070c18] border border-cyan-500/20 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto max-h-[460px]">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-[#0b1329] text-slate-400 border-b border-slate-800 text-[11px] sticky top-0 z-10 uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Source</th>
                <th className="py-2.5 px-3">Destination</th>
                <th className="py-2.5 px-3">Proto</th>
                <th className="py-2.5 px-3">Length</th>
                <th className="py-2.5 px-3">TCP Flags</th>
                <th className="py-2.5 px-3">Bandwidth</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-[11px]">
              {filteredPackets.map((pkt) => (
                <tr
                  key={pkt.id}
                  className={`transition ${
                    pkt.isAnomaly
                      ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-200'
                      : 'hover:bg-slate-900/60 text-slate-300'
                  }`}
                >
                  <td className="py-2 px-3 text-slate-400">{pkt.time}</td>
                  <td className="py-2 px-3 font-semibold text-white">
                    {pkt.srcIp}:{pkt.srcPort}
                  </td>
                  <td className="py-2 px-3 text-cyan-300">
                    {pkt.dstIp}:{pkt.dstPort}
                  </td>
                  <td className="py-2 px-3">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        pkt.protocol === 'TCP'
                          ? 'bg-blue-500/20 text-blue-300'
                          : pkt.protocol === 'UDP'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {pkt.protocol}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-slate-400">{pkt.length} B</td>
                  <td className="py-2 px-3 font-mono text-slate-300">{pkt.flags}</td>
                  <td className="py-2 px-3 text-slate-400">{pkt.rateKbps.toLocaleString()} kbps</td>
                  <td className="py-2 px-3 text-right">
                    {pkt.isAnomaly ? (
                      <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-rose-400 bg-rose-500/20 border border-rose-500/40 px-1.5 py-0.5 rounded">
                        <span>SUSPICIOUS</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-mono">NORMAL</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
