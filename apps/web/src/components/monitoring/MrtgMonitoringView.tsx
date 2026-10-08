// MRTG (Multi Router Traffic Grapher) Monitoring Component
// Enterprise NOC High-Resolution Traffic Graphing & 95th Percentile Analytics

import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  ArrowDownCircle,
  ArrowUpCircle,
  BarChart2,
  Clock,
  Download,
  ExternalLink,
  Layers,
  Network,
  RefreshCw,
  Server,
  Sliders,
  Terminal as TerminalIcon,
  Bot,
  Zap,
  Info,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Device, MrtgInterfaceTraffic, MrtgTimeRange } from '@audira/types';
import { MrtgService, formatBitsPerSecond } from '@audira/monitoring';
import { useNetOpsStore } from '../../store/useNetOpsStore';

interface MrtgMonitoringViewProps {
  device?: Device;
}

export const MrtgMonitoringView: React.FC<MrtgMonitoringViewProps> = ({ device: initialDevice }) => {
  const {
    devices,
    selectedDevice: storeSelectedDevice,
    setSelectedDevice,
    addTerminalTab,
    setAiDrawerOpen,
    setCurrentTab,
  } = useNetOpsStore();

  const mrtgService = useMemo(() => MrtgService.getInstance(), []);

  // Determine active target device
  const activeDevice: Device | null = useMemo(() => {
    if (initialDevice) return initialDevice;
    if (storeSelectedDevice) return storeSelectedDevice;
    if (devices.length > 0) return devices[0] as Device;
    return null;
  }, [initialDevice, storeSelectedDevice, devices]);

  // Available interfaces on the active device
  const interfaceList = useMemo(() => [
    { name: 'sfp-sfpplus1', type: 'SFP+ 10G', desc: 'Core MLAG Uplink' },
    { name: 'ether1-wan', type: '1 Gbps', desc: 'ISP Transit (Telkom)' },
    { name: 'ether2-lan', type: '1 Gbps', desc: 'LAN Distribution' },
    { name: 'bridge-lan', type: '10 Gbps', desc: 'Main Bridge VLAN 10' },
    { name: 'ether8-mgmt', type: '1 Gbps', desc: 'Out-of-band Mgmt' },
  ], []);

  const [selectedInterface, setSelectedInterface] = useState<string>('sfp-sfpplus1');
  const [selectedRange, setSelectedRange] = useState<MrtgTimeRange>('daily');
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'single' | 'classic-quad'>('single');
  const [showP95Line, setShowP95Line] = useState<boolean>(true);
  const [trafficData, setTrafficData] = useState<MrtgInterfaceTraffic>(() =>
    mrtgService.getInterfaceTraffic(
      activeDevice?.id || 'none',
      activeDevice?.name || 'No Device',
      selectedInterface,
      selectedRange
    )
  );

  // Refresh or generate fresh traffic data
  const refreshTraffic = () => {
    if (!activeDevice) return;
    setTrafficData(
      mrtgService.getInterfaceTraffic(activeDevice.id, activeDevice.name, selectedInterface, selectedRange)
    );
  };

  useEffect(() => {
    if (activeDevice) {
      refreshTraffic();
    }
  }, [activeDevice?.id, activeDevice?.name, selectedInterface, selectedRange]);

  // Live streaming interval
  useEffect(() => {
    if (!isLiveStreaming || !activeDevice) return;
    const intervalMs = selectedRange === 'live' ? 3000 : 8000;
    const timer = setInterval(() => {
      refreshTraffic();
    }, intervalMs);
    return () => clearInterval(timer);
  }, [isLiveStreaming, selectedRange, selectedInterface, activeDevice?.id]);

  // Helper for export to CSV
  const handleExportCsv = () => {
    const headers = 'Timestamp,TimeLabel,Rx_Bps,Tx_Bps,Rx_Formatted,Tx_Formatted\n';
    const rows = trafficData.points
      .map(
        (p) =>
          `"${p.timestamp}","${p.timeLabel}",${p.rxBps},${p.txBps},"${p.rxFormatted}","${p.txFormatted}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `MRTG_${activeDevice?.name || 'TRAFFIC'}_${selectedInterface}_${selectedRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pre-generate 4 classic graphs for the Classic MRTG Quad view
  const quadData = useMemo(() => {
    if (viewMode !== 'classic-quad' || !activeDevice) return null;
    return {
      daily: mrtgService.getInterfaceTraffic(activeDevice.id, activeDevice.name, selectedInterface, 'daily'),
      weekly: mrtgService.getInterfaceTraffic(activeDevice.id, activeDevice.name, selectedInterface, 'weekly'),
      monthly: mrtgService.getInterfaceTraffic(activeDevice.id, activeDevice.name, selectedInterface, 'monthly'),
      yearly: mrtgService.getInterfaceTraffic(activeDevice.id, activeDevice.name, selectedInterface, 'yearly'),
    };
  }, [viewMode, activeDevice, selectedInterface, mrtgService]);

  // All interface summaries for quick matrix
  const allInterfacesSummary = useMemo(() => {
    if (!activeDevice) return [];
    return interfaceList.map((iface) => ({
      ...iface,
      data: mrtgService.getInterfaceTraffic(activeDevice.id, activeDevice.name, iface.name, 'daily'),
    }));
  }, [activeDevice, interfaceList, mrtgService]);

  const p95RxMbps = Math.round((trafficData.stats.percentile95RxBps / 1_000_000) * 100) / 100;
  const p95TxMbps = Math.round((trafficData.stats.percentile95TxBps / 1_000_000) * 100) / 100;

  if (!activeDevice) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] bg-noc-bg select-none items-center justify-center p-8 bg-grid-pattern">
        <div className="max-w-md w-full bg-[#0b1329]/90 border border-cyan-500/30 rounded-2xl p-8 text-center shadow-[0_0_50px_rgba(6,182,212,0.15)] space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mx-auto shadow-[0_0_25px_rgba(6,182,212,0.3)]">
            <BarChart2 className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-mono">Telemetri MRTG Memerlukan Perangkat</h2>
            <p className="text-xs text-slate-400 font-sans mt-1.5 leading-relaxed">
              Semua node demo telah dibersihkan. Daftarkan router fisik Anda di menu Manajemen Perangkat agar MRTG dapat memonitor bandwidth antarmuka (Rx/Tx) secara real-time.
            </p>
          </div>
          <div className="pt-2 flex items-center justify-center space-x-3">
            <button
              onClick={() => setCurrentTab('devices')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md transition inline-flex items-center space-x-2 font-mono"
            >
              <Server className="w-4 h-4" />
              <span>Daftarkan Perangkat Pertama</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-[#070c18] text-slate-100 p-4 space-y-4 select-none">
      {/* ======================================================== */}
      {/* 1. TOP HEADER & OPERATIONAL CONTROL BAR                 */}
      {/* ======================================================== */}
      <div className="glass-cyber-card rounded-2xl p-4 border border-cyan-500/20 shadow-xl flex flex-wrap items-center justify-between gap-4">
        {/* Device & Title Info */}
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <BarChart2 className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-extrabold text-white tracking-wide font-sans">
                MRTG Traffic Grapher
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse" />
                <span>SNMP/REST Live Stream</span>
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
              <span>Target Node:</span>
              <span className="text-cyan-300 font-semibold">{activeDevice.name}</span>
              <span className="text-white font-medium">• {activeDevice.hostname}</span>
              <span className="text-slate-500">({activeDevice.ipAddress})</span>
              <span className="text-slate-500">·</span>
              <span className="text-cyan-400 bg-cyan-950/60 px-1.5 py-0.2 rounded border border-cyan-500/20 text-[10px]">
                snmp://{activeDevice.hostname}:161
              </span>
            </div>
          </div>
        </div>

        {/* Global Controls & Actions */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          {/* Switch View Mode */}
          <div className="flex items-center bg-[#0b1329] p-0.5 rounded-xl border border-cyan-500/20 text-xs font-mono">
            <button
              onClick={() => setViewMode('single')}
              className={`px-3 py-1.5 rounded-lg transition ${
                viewMode === 'single'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              HD Single View
            </button>
            <button
              onClick={() => setViewMode('classic-quad')}
              className={`px-3 py-1.5 rounded-lg transition ${
                viewMode === 'classic-quad'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Classic 4-Graph MRTG
            </button>
          </div>

          {/* Live Auto-Refresh Toggle */}
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-mono border transition ${
              isLiveStreaming
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-slate-800/60 border-slate-700 text-slate-400'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLiveStreaming ? 'animate-spin' : ''}`} />
            <span>{isLiveStreaming ? 'Live Polling (3s)' : 'Paused'}</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={handleExportCsv}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-mono bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
            <span>CSV</span>
          </button>

          {/* Terminal Launch */}
          <button
            onClick={() => addTerminalTab(activeDevice)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-mono bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-emerald-400 transition"
          >
            <TerminalIcon className="w-3.5 h-3.5" />
            <span>PuTTY CLI</span>
          </button>

          {/* AI Copilot Audit */}
          <button
            onClick={() => {
              setAiDrawerOpen(true);
              setCurrentTab('ai-copilot');
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-mono bg-cyan-600 hover:bg-cyan-500 text-white font-semibold shadow glow-cyan transition"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI Congestion Audit</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. INTERFACE SELECTOR & TIME-RANGE SELECTOR TABS         */}
      {/* ======================================================== */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#0a1024]/80 p-2 rounded-2xl border border-cyan-500/20">
        {/* Interface Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto text-xs font-mono pb-1 md:pb-0">
          <span className="text-slate-500 text-[11px] font-semibold px-2 uppercase tracking-wider flex items-center space-x-1">
            <Layers className="w-3 h-3 text-cyan-400" />
            <span>Port:</span>
          </span>
          {interfaceList.map((iface) => {
            const isSelected = selectedInterface === iface.name;
            return (
              <button
                key={iface.name}
                onClick={() => setSelectedInterface(iface.name)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-blue-600 text-white font-bold shadow-[0_0_15px_rgba(37,99,235,0.5)] border border-cyan-400/40'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <span>{iface.name}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded ${
                    isSelected ? 'bg-black/30 text-cyan-200' : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {iface.type}
                </span>
              </button>
            );
          })}
        </div>

        {/* Time-Range Resolution Pills */}
        <div className="flex items-center space-x-1 bg-[#060a17] p-1 rounded-xl border border-cyan-500/20 text-xs font-mono">
          {(
            [
              { id: 'live', label: 'Live (5s)' },
              { id: 'daily', label: 'Daily (5m)' },
              { id: 'weekly', label: 'Weekly (30m)' },
              { id: 'monthly', label: 'Monthly (2h)' },
              { id: 'yearly', label: 'Yearly (1d)' },
            ] as { id: MrtgTimeRange; label: string }[]
          ).map((range) => {
            const isSelected = selectedRange === range.id;
            return (
              <button
                key={range.id}
                onClick={() => setSelectedRange(range.id)}
                className={`px-2.5 py-1 rounded-lg transition ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/50 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {range.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. CLASSIC MRTG KPI LEGEND & INTERFACE IDENTITY CARD    */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Incoming Traffic (RX / Green) */}
        <div className="glass-cyber-card rounded-2xl p-3.5 border border-emerald-500/30 bg-[#061715]/60 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20 font-mono">
            <span className="flex items-center space-x-1.5 text-emerald-400 font-bold text-xs tracking-wider">
              <ArrowDownCircle className="w-4 h-4 text-emerald-400" />
              <span>INCOMING (RX / DOWNLOAD)</span>
            </span>
            <span className="text-[10px] text-emerald-400/80 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
              MRTG GREEN
            </span>
          </div>

          <div className="mt-2.5">
            <div className="text-2xl font-black font-mono text-emerald-300 tracking-tight">
              {formatBitsPerSecond(trafficData.stats.currentRxBps)}
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
              Current Utilization:{' '}
              <span className="text-emerald-400 font-semibold">
                {((trafficData.stats.currentRxBps / trafficData.capacityBps) * 100).toFixed(1)}%
              </span>{' '}
              of {trafficData.speed}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-emerald-500/20 text-[10px] font-mono">
            <div>
              <div className="text-slate-500">MAX PEAK</div>
              <div className="text-emerald-300 font-semibold mt-0.5">
                {formatBitsPerSecond(trafficData.stats.maxRxBps)}
              </div>
            </div>
            <div>
              <div className="text-slate-500">AVERAGE</div>
              <div className="text-slate-300 font-semibold mt-0.5">
                {formatBitsPerSecond(trafficData.stats.avgRxBps)}
              </div>
            </div>
            <div>
              <div className="text-amber-400">95th %ILE</div>
              <div className="text-amber-300 font-semibold mt-0.5">
                {formatBitsPerSecond(trafficData.stats.percentile95RxBps)}
              </div>
            </div>
          </div>
        </div>

        {/* Outgoing Traffic (TX / Cyan & Blue) */}
        <div className="glass-cyber-card rounded-2xl p-3.5 border border-cyan-500/30 bg-[#061224]/60 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20 font-mono">
            <span className="flex items-center space-x-1.5 text-cyan-400 font-bold text-xs tracking-wider">
              <ArrowUpCircle className="w-4 h-4 text-cyan-400" />
              <span>OUTGOING (TX / UPLOAD)</span>
            </span>
            <span className="text-[10px] text-cyan-400/80 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
              MRTG BLUE
            </span>
          </div>

          <div className="mt-2.5">
            <div className="text-2xl font-black font-mono text-cyan-300 tracking-tight">
              {formatBitsPerSecond(trafficData.stats.currentTxBps)}
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
              Current Utilization:{' '}
              <span className="text-cyan-400 font-semibold">
                {((trafficData.stats.currentTxBps / trafficData.capacityBps) * 100).toFixed(1)}%
              </span>{' '}
              of {trafficData.speed}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-cyan-500/20 text-[10px] font-mono">
            <div>
              <div className="text-slate-500">MAX PEAK</div>
              <div className="text-cyan-300 font-semibold mt-0.5">
                {formatBitsPerSecond(trafficData.stats.maxTxBps)}
              </div>
            </div>
            <div>
              <div className="text-slate-500">AVERAGE</div>
              <div className="text-slate-300 font-semibold mt-0.5">
                {formatBitsPerSecond(trafficData.stats.avgTxBps)}
              </div>
            </div>
            <div>
              <div className="text-amber-400">95th %ILE</div>
              <div className="text-amber-300 font-semibold mt-0.5">
                {formatBitsPerSecond(trafficData.stats.percentile95TxBps)}
              </div>
            </div>
          </div>
        </div>

        {/* Interface Hardware Profile */}
        <div className="glass-cyber-card rounded-2xl p-3.5 border border-cyan-500/20 bg-[#080e1c]/60 shadow-lg">
          <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20 font-mono">
            <span className="text-slate-300 font-bold text-xs tracking-wider flex items-center space-x-1.5">
              <Network className="w-4 h-4 text-cyan-400" />
              <span>PORT SPECIFICATION</span>
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              LINK UP
            </span>
          </div>

          <div className="mt-2.5 space-y-1.5 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-slate-500 text-[11px]">INTERFACE:</span>
              <span className="text-white font-semibold">{trafficData.interfaceName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 text-[11px]">BANDWIDTH:</span>
              <span className="text-cyan-300 font-semibold">{trafficData.speed} Full Duplex</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 text-[11px]">IP BINDING:</span>
              <span className="text-slate-300">{trafficData.ipAddress || '10.250.0.1/30'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 text-[11px]">HARDWARE MAC:</span>
              <span className="text-slate-400">{trafficData.macAddress || 'D4:CA:6D:E1:01:01'}</span>
            </div>
          </div>
        </div>

        {/* ISP Transit & 95th Billing Card */}
        <div className="glass-cyber-card rounded-2xl p-3.5 border border-amber-500/30 bg-[#141208]/60 shadow-lg">
          <div className="flex items-center justify-between pb-2 border-b border-amber-500/20 font-mono">
            <span className="text-amber-400 font-bold text-xs tracking-wider flex items-center space-x-1.5">
              <Info className="w-4 h-4 text-amber-400" />
              <span>TRANSIT BILLING (95TH)</span>
            </span>
            <button
              onClick={() => setShowP95Line(!showP95Line)}
              className={`text-[9px] px-2 py-0.5 rounded font-mono border transition ${
                showP95Line
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 text-slate-500 border-slate-700'
              }`}
            >
              {showP95Line ? 'Line ON' : 'Line OFF'}
            </button>
          </div>

          <div className="mt-2.5">
            <div className="text-2xl font-black font-mono text-amber-300 tracking-tight">
              {formatBitsPerSecond(Math.max(trafficData.stats.percentile95RxBps, trafficData.stats.percentile95TxBps))}
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
              Billable Peak: <span className="text-white font-semibold">Max(In 95%, Out 95%)</span>
            </div>
          </div>

          <div className="mt-2 text-[10px] text-slate-400 font-mono leading-relaxed">
            Eliminates top 5% anomalous traffic bursts in accordance with standard Tier-1 carrier transit agreements.
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. MAIN CHART STAGE (SINGLE OR QUAD VIEW)                */}
      {/* ======================================================== */}
      {viewMode === 'single' ? (
        /* SINGLE HD GRAPH */
        <div className="glass-cyber-card rounded-2xl p-4 border border-cyan-500/20 shadow-2xl flex flex-col space-y-3">
          <div className="flex flex-wrap items-center justify-between pb-2 border-b border-cyan-500/20 font-mono text-xs">
            <div className="flex items-center space-x-3">
              <span className="text-white font-bold flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
                <span>
                  High-Resolution Traffic Graph — {trafficData.interfaceName} ({selectedRange.toUpperCase()})
                </span>
              </span>
              <span className="text-slate-500 text-[11px]">
                Updated: {new Date(trafficData.lastPolled).toLocaleTimeString()}
              </span>
            </div>

            <div className="flex items-center space-x-4 text-[11px]">
              <span className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
                <span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-400" />
                <span>In (Rx Bits/s)</span>
              </span>
              <span className="flex items-center space-x-1.5 text-cyan-400 font-semibold">
                <span className="w-3 h-0.5 bg-cyan-400" />
                <span>Out (Tx Bits/s)</span>
              </span>
              {showP95Line && (
                <span className="flex items-center space-x-1.5 text-amber-400 font-semibold">
                  <span className="w-3 h-0.5 bg-amber-400 border-dashed" />
                  <span>95th %ile Rx ({p95RxMbps} Mbps)</span>
                </span>
              )}
            </div>
          </div>

          {/* Recharts Container */}
          <div className="h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData.points} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                <defs>
                  {/* MRTG Green Gradient for Inbound */}
                  <linearGradient id="mrtgInGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.65} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                  </linearGradient>
                  {/* Cyan line for Outbound */}
                  <linearGradient id="mrtgOutGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />

                <XAxis
                  dataKey="timeLabel"
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
                  tickLine={{ stroke: '#334155' }}
                />

                <YAxis
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
                  tickLine={{ stroke: '#334155' }}
                  tickFormatter={(val: number) => {
                    if (val >= 1000) return `${(val / 1000).toFixed(1)} Gbps`;
                    return `${Math.round(val)} Mbps`;
                  }}
                  domain={[0, 'auto']}
                />

                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload || !payload.length) return null;
                    const rxVal = payload.find((p) => p.dataKey === 'rxMbps')?.value as number;
                    const txVal = payload.find((p) => p.dataKey === 'txMbps')?.value as number;

                    return (
                      <div className="bg-[#0b1224]/95 border border-cyan-500/40 rounded-xl p-3 shadow-2xl backdrop-blur-xl font-mono text-xs space-y-1.5 min-w-[200px]">
                        <div className="text-slate-300 text-[11px] pb-1 border-b border-cyan-500/20 font-bold">
                          Time: {label}
                        </div>
                        <div className="flex items-center justify-between text-emerald-400">
                          <span className="flex items-center space-x-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            <span>Incoming (RX):</span>
                          </span>
                          <span className="font-bold">{formatBitsPerSecond((rxVal || 0) * 1_000_000)}</span>
                        </div>
                        <div className="flex items-center justify-between text-cyan-400">
                          <span className="flex items-center space-x-1.5">
                            <span className="w-2 h-2 rounded-full bg-cyan-400" />
                            <span>Outgoing (TX):</span>
                          </span>
                          <span className="font-bold">{formatBitsPerSecond((txVal || 0) * 1_000_000)}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                          Total Bandwidth: {formatBitsPerSecond(((rxVal || 0) + (txVal || 0)) * 1_000_000)}
                        </div>
                      </div>
                    );
                  }}
                />

                {showP95Line && (
                  <ReferenceLine
                    y={p95RxMbps}
                    stroke="#f59e0b"
                    strokeDasharray="4 4"
                    label={{
                      value: `95th %ile Rx: ${p95RxMbps} Mbps`,
                      fill: '#fbbf24',
                      fontSize: 10,
                      position: 'top',
                      fontFamily: 'monospace',
                    }}
                  />
                )}

                {/* Shaded Area for Incoming Traffic */}
                <Area
                  type="monotone"
                  dataKey="rxMbps"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#mrtgInGradient)"
                  name="In Traffic (Mbps)"
                  isAnimationActive={false}
                />

                {/* Sharp Blue Line for Outgoing Traffic */}
                <Line
                  type="monotone"
                  dataKey="txMbps"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  dot={false}
                  name="Out Traffic (Mbps)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        /* CLASSIC 4-GRAPH QUAD MRTG VIEW */
        quadData && (
          <div className="space-y-4">
            <div className="text-xs font-mono text-cyan-400 font-bold tracking-wider px-1">
              CLASSIC 4-PANEL MRTG ARCHIVE (DAILY · WEEKLY · MONTHLY · YEARLY)
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(
                [
                  { title: '`Daily` Graph (5 Minute Average)', data: quadData.daily },
                  { title: '`Weekly` Graph (30 Minute Average)', data: quadData.weekly },
                  { title: '`Monthly` Graph (2 Hour Average)', data: quadData.monthly },
                  { title: '`Yearly` Graph (1 Day Average)', data: quadData.yearly },
                ] as const
              ).map((panel, idx) => (
                <div
                  key={idx}
                  className="glass-cyber-card rounded-2xl p-3 border border-cyan-500/20 bg-[#080f20]/70 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between pb-1.5 border-b border-cyan-500/20 text-xs font-mono">
                    <span className="font-bold text-white">{panel.title}</span>
                    <span className="text-[10px] text-slate-400">{panel.data.speed}</span>
                  </div>

                  <div className="h-44 w-full my-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={panel.data.points} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="2 2" stroke="#1e293b" opacity={0.5} />
                        <XAxis dataKey="timeLabel" stroke="#475569" tick={{ fontSize: 9, fill: '#94a3b8' }} />
                        <YAxis stroke="#475569" tick={{ fontSize: 9, fill: '#94a3b8' }} domain={[0, 'auto']} />
                        <Area
                          type="monotone"
                          dataKey="rxMbps"
                          stroke="#10b981"
                          strokeWidth={1.5}
                          fill="#10b981"
                          fillOpacity={0.3}
                          isAnimationActive={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="txMbps"
                          stroke="#06b6d4"
                          strokeWidth={1.8}
                          dot={false}
                          isAnimationActive={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Classic MRTG Mini Summary Table */}
                  <div className="grid grid-cols-4 gap-1 text-[9px] font-mono border-t border-cyan-500/10 pt-2 text-center">
                    <div>
                      <div className="text-emerald-400 font-semibold">Max In</div>
                      <div className="text-slate-300 mt-0.5">{formatBitsPerSecond(panel.data.stats.maxRxBps)}</div>
                    </div>
                    <div>
                      <div className="text-emerald-400 font-semibold">Avg In</div>
                      <div className="text-slate-300 mt-0.5">{formatBitsPerSecond(panel.data.stats.avgRxBps)}</div>
                    </div>
                    <div>
                      <div className="text-cyan-400 font-semibold">Max Out</div>
                      <div className="text-slate-300 mt-0.5">{formatBitsPerSecond(panel.data.stats.maxTxBps)}</div>
                    </div>
                    <div>
                      <div className="text-cyan-400 font-semibold">Avg Out</div>
                      <div className="text-slate-300 mt-0.5">{formatBitsPerSecond(panel.data.stats.avgTxBps)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}

      {/* ======================================================== */}
      {/* 5. ALL INTERFACES REAL-TIME TRAFFIC MATRIX (SPARKLINES)  */}
      {/* ======================================================== */}
      <div className="glass-cyber-card rounded-2xl p-4 border border-cyan-500/20 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20 font-mono text-xs">
          <div className="flex items-center space-x-2 text-white font-bold">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Device Interface Traffic Matrix & Quick Switch</span>
          </div>
          <span className="text-[11px] text-slate-400">
            Monitoring {allInterfacesSummary.length} Interfaces on {activeDevice.name}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {allInterfacesSummary.map((item) => {
            const isCurrent = selectedInterface === item.name;
            const rxRate = formatBitsPerSecond(item.data.stats.currentRxBps);
            const txRate = formatBitsPerSecond(item.data.stats.currentTxBps);

            return (
              <div
                key={item.name}
                onClick={() => setSelectedInterface(item.name)}
                className={`p-3 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-blue-950/40 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'bg-[#080d1d] border-cyan-500/10 hover:border-cyan-500/30 hover:bg-[#0b1227]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-white">{item.name}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                      UP
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">{item.desc}</div>
                </div>

                <div className="my-2 h-10 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={item.data.points.slice(-12)}>
                      <Area
                        type="monotone"
                        dataKey="rxMbps"
                        stroke="#10b981"
                        strokeWidth={1}
                        fill="#10b981"
                        fillOpacity={0.25}
                        isAnimationActive={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[10px] font-mono space-y-0.5">
                  <div className="flex justify-between text-emerald-400">
                    <span>In:</span>
                    <span className="font-semibold">{rxRate}</span>
                  </div>
                  <div className="flex justify-between text-cyan-400">
                    <span>Out:</span>
                    <span className="font-semibold">{txRate}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default MrtgMonitoringView;
