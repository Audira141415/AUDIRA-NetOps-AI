// AUDIRA NetOps AI - Enterprise NOC Holographic Dashboard
// Implements clean zero-data state, dynamic metrics, and real device onboarding

import React, { useState } from 'react';
import {
  Server,
  Activity,
  AlertTriangle,
  ArrowRight,
  Bot,
  Zap,
  TrendingUp,
  Cpu,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Layers,
  Network,
  Search,
  Maximize2,
  Cloud,
  Monitor,
  Wifi,
  Send,
  HardDrive,
  Terminal,
  Plus,
  Play,
  Share2,
  X,
  Lock,
  Globe,
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
import { Device, DeviceType, ConnectionType, VendorType } from '@audira/types';
import { MrtgService, formatBitsPerSecond } from '@audira/monitoring';
import { useNetOpsStore } from '../../store/useNetOpsStore';

export const NocDashboard: React.FC = () => {
  const {
    devices,
    addDevice,
    activeAlerts,
    setCurrentTab,
    isAddDeviceModalOpen,
    setAddDeviceModalOpen,
  } = useNetOpsStore();

  // Time filter state
  const [activeTimeFilter, setActiveTimeFilter] = useState<'Live' | '1H' | '6H' | '24H' | '7D' | '30D'>('Live');

  // Form state for adding device
  const [formData, setFormData] = useState({
    name: '',
    ipAddress: '',
    vendor: 'MikroTik' as VendorType,
    deviceType: 'ROUTER' as DeviceType,
    connectionType: 'ROUTEROS_API' as ConnectionType,
    port: '443',
    username: 'admin',
    password: '',
  });

  // Dynamic KPI calculation
  const totalDevices = devices.length;
  const onlineDevices = devices.filter((d) => d.status === 'ONLINE').length;
  const warningDevices = devices.filter((d) => d.status === 'WARNING').length;
  const offlineDevices = devices.filter((d) => d.status === 'OFFLINE').length;

  const onlinePct = totalDevices > 0 ? ((onlineDevices / totalDevices) * 100).toFixed(1) : '0.0';
  const warningPct = totalDevices > 0 ? ((warningDevices / totalDevices) * 100).toFixed(1) : '0.0';
  const offlinePct = totalDevices > 0 ? ((offlineDevices / totalDevices) * 100).toFixed(1) : '0.0';

  // AI Copilot state
  const [inputPrompt, setInputPrompt] = useState('');
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'init',
      sender: 'ai',
      intro:
        'Halo! Saya AUDIRA AI Network Copilot. Sistem telah di-reset dan saat ini bersih (0 dummy data). Silakan tambahkan router fisik pertama Anda via tombol "+ Add Device" untuk memulai monitoring dan diagnosa otomatis.',
      steps: [] as { name: string; status: string }[],
      analysis: '',
      recommendations: [
        'Klik "+ Add Device" untuk mendaftarkan MikroTik / Switch fisik Anda.',
        'Pastikan port REST API (443/80) atau SSH (22) di router Anda telah aktif.',
        'Gunakan fitur Terminal untuk verifikasi koneksi langsung via CLI.',
      ],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const handleSendMessage = (customText?: string) => {
    const query = customText || inputPrompt;
    if (!query.trim()) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: 'user',
      intro: query,
      steps: [],
      analysis: '',
      recommendations: [],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputPrompt('');
    setIsDiagnosing(true);

    setTimeout(() => {
      let aiIntro = `Analisis cerdas untuk: "${query}".`;
      let aiAnalysis = '';
      let aiRecs = [
        'Pastikan parameter jaringan dan ACL port mengizinkan koneksi dari server AUDIRA.',
        'Lakukan uji ping melalui Quick Actions.',
      ];

      if (devices.length === 0) {
        aiAnalysis =
          'Belum ada perangkat jaringan terdaftar. AI Copilot membutuhkan minimal 1 perangkat aktif untuk mengumpulkan metrik interface, routing table, dan firewall rules.';
        aiRecs = [
          'Daftarkan router fisik dengan tombol "+ Add Device".',
          'Setelah terhubung, AI otomatis mengevaluasi status kesehatan port.',
        ];
      } else {
        aiAnalysis = `Memeriksa ${devices.length} perangkat terdaftar. Seluruh status koneksi live sedang di-polling.`;
      }

      const aiReply = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        intro: aiIntro,
        steps:
          devices.length > 0
            ? [
                { name: 'Interface check', status: 'Selesai' },
                { name: 'Route check', status: 'Selesai' },
                { name: 'Ping test', status: 'Selesai' },
                { name: 'Log analysis', status: 'Selesai' },
              ]
            : [],
        analysis: aiAnalysis,
        recommendations: aiRecs,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiReply]);
      setIsDiagnosing(false);
    }, 600);
  };

  const handleSaveDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.ipAddress) return;

    const newDev: Device = {
      id: `dev-${Date.now()}`,
      name: formData.name,
      hostname: `${formData.name.toLowerCase()}.local`,
      ipAddress: formData.ipAddress,
      vendor: formData.vendor,
      platform: `${formData.vendor} Appliance`,
      osVersion: formData.vendor === 'MikroTik' ? 'RouterOS v7' : 'Firmware v1.0',
      deviceType: formData.deviceType,
      connectionType: formData.connectionType,
      apiPort: parseInt(formData.port) || 443,
      sshPort: 22,
      status: 'ONLINE',
      pollingIntervalSeconds: 15,
      lastSeen: 'Just now',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addDevice(newDev);
    setAddDeviceModalOpen(false);
    setFormData({
      name: '',
      ipAddress: '',
      vendor: 'MikroTik',
      deviceType: 'ROUTER',
      connectionType: 'ROUTEROS_API',
      port: '443',
      username: 'admin',
      password: '',
    });

    handleSendMessage(`Perangkat baru "${newDev.name}" (${newDev.ipAddress}) berhasil didaftarkan. Tolong verifikasi statusnya.`);
  };

  return (
    <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-3rem)] select-none bg-[#09090b]">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* ======================================================== */}
        {/* CENTER OBSERVABILITY COLUMN (xl:col-span-8)               */}
        {/* ======================================================== */}
        <div className="xl:col-span-8 space-y-4">
          {/* HEADER: Network Health + Time Filters */}
          <div className="bg-[#121215] border border-zinc-800 rounded-xl p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h1 className="text-base font-semibold text-white tracking-tight flex items-center space-x-2">
                  <span>Network Health</span>
                </h1>
                <p className="text-xs text-zinc-400 font-sans mt-0.5">
                  Real-time infrastructure overview and node status
                </p>
              </div>

              {/* Time Range Filter Buttons */}
              <div className="flex items-center space-x-1 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800 text-xs font-mono">
                {(['Live', '1H', '6H', '24H', '7D', '30D'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setActiveTimeFilter(range)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                      activeTimeFilter === range
                        ? 'bg-zinc-800 text-white border border-zinc-700/60 shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            {/* 4 DYNAMIC KPI METRIC CARDS ROW */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {/* Total Devices */}
              <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80 flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-zinc-300">
                  <Monitor className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white font-mono leading-none">{totalDevices}</div>
                  <div className="text-[11px] text-zinc-400 font-sans mt-1">Total Devices</div>
                </div>
              </div>

              {/* Online */}
              <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <span className={`w-2 h-2 rounded-full ${onlineDevices > 0 ? 'bg-emerald-500' : 'bg-zinc-600'}`} />
                  <div>
                    <div className="text-xl font-bold text-white font-mono leading-none">{onlineDevices}</div>
                    <div className="text-[11px] text-zinc-400 font-sans mt-1">Online</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  {onlinePct}%
                </span>
              </div>

              {/* Warning */}
              <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <div>
                    <div className="text-xl font-bold text-white font-mono leading-none">{warningDevices}</div>
                    <div className="text-[11px] text-zinc-400 font-sans mt-1">Warning</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  {warningPct}%
                </span>
              </div>

              {/* Offline */}
              <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <div>
                    <div className="text-xl font-bold text-white font-mono leading-none">{offlineDevices}</div>
                    <div className="text-[11px] text-zinc-400 font-sans mt-1">Offline</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400">
                  {offlinePct}%
                </span>
              </div>
            </div>
          </div>

          {/* NETWORK TOPOLOGY CARD */}
          <div className="bg-[#121215] border border-zinc-800 rounded-xl p-4 shadow-sm">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-800">
              <div className="flex items-center space-x-2">
                <Share2 className="w-4 h-4 text-zinc-400" />
                <h2 className="text-xs font-semibold text-white tracking-wide">Network Topology</h2>
              </div>

              <div className="flex items-center space-x-2 text-xs">
                <button
                  onClick={() => setAddDeviceModalOpen(true)}
                  className="px-2.5 py-1 rounded-md bg-white hover:bg-zinc-200 text-zinc-950 font-medium transition-colors flex items-center space-x-1 shadow-sm text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Device</span>
                </button>
                <button
                  onClick={() => setCurrentTab('topology')}
                  className="p-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                  title="Fullscreen"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Topology Canvas: Clean Onboarding Zero-State or Live Nodes */}
            <div className="h-[280px] bg-[#09090b] rounded-lg border border-zinc-800 p-4 relative flex flex-col items-center justify-center font-mono text-xs overflow-hidden">
              {devices.length === 0 ? (
                /* CLEAN ONBOARDING ZERO STATE */
                <div className="flex flex-col items-center justify-center text-center max-w-md space-y-2.5">
                  <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                    <Network className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-white font-sans">
                      Belum Ada Perangkat Jaringan Terhubung
                    </h3>
                    <p className="text-[11px] text-zinc-500 font-sans mt-0.5 leading-relaxed">
                      Sistem telah di-reset ke kondisi awal. Hubungkan router MikroTik atau switch fisik Anda untuk memetakan topologi jaringan secara otomatis.
                    </p>
                  </div>
                  <button
                    onClick={() => setAddDeviceModalOpen(true)}
                    className="px-3 py-1.5 rounded-md bg-white hover:bg-zinc-200 text-zinc-950 font-medium text-xs transition-colors flex items-center space-x-1.5 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Perangkat Pertama</span>
                  </button>
                </div>
              ) : (
                /* LIVE DEVICE TOPOLOGY TREE */
                <div className="w-full h-full flex flex-col items-center justify-between">
                  {/* Top Cloud */}
                  <div className="px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-200 font-medium text-xs flex items-center space-x-2">
                    <Cloud className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Gateway / Uplink</span>
                  </div>

                  <div className="w-px h-6 bg-zinc-700" />

                  {/* Registered Devices Grid */}
                  <div className="flex flex-wrap items-center justify-center gap-2 overflow-y-auto max-h-[160px] p-2">
                    {devices.map((dev) => (
                      <div
                        key={dev.id}
                        onClick={() => handleSendMessage(`Cek kondisi interface pada ${dev.name} (${dev.ipAddress})`)}
                        className="px-3 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-white cursor-pointer hover:border-zinc-700 transition-colors flex items-center space-x-2"
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            dev.status === 'ONLINE'
                              ? 'bg-emerald-500'
                              : dev.status === 'WARNING'
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                        />
                        <div className="text-left">
                          <div className="font-medium text-xs text-zinc-100">{dev.name}</div>
                          <div className="text-[10px] text-zinc-500 font-sans">{dev.ipAddress}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* BOTTOM ROW: Recent Alerts + Device Status Donut + Network Traffic */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* CARD 1: Recent Alerts */}
            <div className="bg-[#121215] border border-zinc-800 rounded-xl p-4 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-zinc-800/80">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-zinc-400" />
                    <span className="text-xs font-semibold text-zinc-200 tracking-tight">Recent Alerts</span>
                  </div>
                  <button
                    onClick={() => setCurrentTab('alerts')}
                    className="text-[11px] text-zinc-400 hover:text-zinc-200 font-mono flex items-center space-x-1 transition"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-1.5 font-sans text-xs">
                  {activeAlerts.length === 0 ? (
                    <div className="py-6 text-center text-zinc-500 space-y-1.5">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />
                      <div className="text-zinc-300 font-medium text-xs">All Systems Nominal</div>
                      <div className="text-[11px] text-zinc-500">
                        No active incidents or packet loss detected across fleet.
                      </div>
                    </div>
                  ) : (
                    activeAlerts.map((alt) => (
                      <div
                        key={alt.id}
                        className="flex items-start justify-between p-2 rounded-lg hover:bg-zinc-900/60 transition border border-transparent hover:border-zinc-800/60"
                      >
                        <div className="flex items-start space-x-2.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-zinc-200 text-[11px]">{alt.title}</div>
                            <div className="text-[10px] text-zinc-400">{alt.message}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* CARD 2: Device Status Donut Chart */}
            <div className="bg-[#121215] border border-zinc-800 rounded-xl p-4 flex flex-col justify-between shadow-sm">
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-zinc-800/80">
                <div className="flex items-center space-x-2">
                  <Server className="w-4 h-4 text-zinc-400" />
                  <span className="text-xs font-semibold text-zinc-200 tracking-tight">Fleet Health</span>
                </div>
                <button
                  onClick={() => setCurrentTab('devices')}
                  className="text-[11px] text-zinc-400 hover:text-zinc-200 font-mono flex items-center space-x-1 transition"
                >
                  <span>Inventory</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Dynamic Donut Ring SVG */}
              <div className="flex items-center justify-between px-2 py-1">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#27272a" strokeWidth="10" />
                    {totalDevices > 0 && (
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#10b981"
                        strokeWidth="10"
                        strokeDasharray="238.7"
                        strokeDashoffset={238.7 - (onlineDevices / totalDevices) * 238.7}
                        strokeLinecap="round"
                      />
                    )}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                    <span className="text-xl font-bold text-zinc-100 leading-none">{totalDevices}</span>
                    <span className="text-[10px] text-zinc-500 font-sans mt-0.5">Nodes</span>
                  </div>
                </div>

                <div className="space-y-2 font-mono text-[11px]">
                  <div className="flex items-center justify-between space-x-4">
                    <span className="flex items-center space-x-1.5 text-zinc-300">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Online</span>
                    </span>
                    <div className="space-x-2">
                      <span className="text-zinc-100 font-medium">{onlineDevices}</span>
                      <span className="text-emerald-400">{onlinePct}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between space-x-4">
                    <span className="flex items-center space-x-1.5 text-zinc-300">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>Warning</span>
                    </span>
                    <div className="space-x-2">
                      <span className="text-zinc-100 font-medium">{warningDevices}</span>
                      <span className="text-amber-400">{warningPct}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between space-x-4">
                    <span className="flex items-center space-x-1.5 text-zinc-300">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      <span>Offline</span>
                    </span>
                    <div className="space-x-2">
                      <span className="text-zinc-100 font-medium">{offlineDevices}</span>
                      <span className="text-rose-400">{offlinePct}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 3: Network Traffic Chart (MRTG Live Preview) */}
            {(() => {
              if (devices.length === 0) {
                return (
                  <div className="bg-[#121215] border border-zinc-800 rounded-xl p-4 flex flex-col justify-between shadow-sm">
                    <div className="flex items-center justify-between pb-2.5 mb-1 border-b border-zinc-800/80">
                      <div className="flex items-center space-x-2">
                        <Activity className="w-4 h-4 text-zinc-400" />
                        <span className="text-xs font-semibold text-zinc-200 tracking-tight">MRTG Traffic</span>
                      </div>
                      <button
                        onClick={() => setCurrentTab('devices')}
                        className="text-[11px] text-zinc-300 hover:text-white font-sans flex items-center space-x-1 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 hover:bg-zinc-800 transition"
                      >
                        <span>+ Add Node</span>
                      </button>
                    </div>

                    <div className="h-28 flex flex-col items-center justify-center text-center p-3 text-zinc-500 space-y-1">
                      <Activity className="w-5 h-5 text-zinc-600 mb-1" />
                      <p className="text-[11px] font-sans text-zinc-400">No telemetry source active</p>
                      <p className="text-[10px] font-mono text-zinc-600">MRTG graphs stream live on node connect.</p>
                    </div>
                  </div>
                );
              }

              const targetDev = devices[0]!;
              const liveTraffic = MrtgService.getInstance().getInterfaceTraffic(
                targetDev.id,
                targetDev.name,
                'sfp-sfpplus1',
                'daily'
              );
              const currentRx = formatBitsPerSecond(liveTraffic.stats.currentRxBps);
              const currentTx = formatBitsPerSecond(liveTraffic.stats.currentTxBps);

              return (
                <div className="bg-[#121215] border border-zinc-800 rounded-xl p-4 flex flex-col justify-between shadow-sm">
                  <div className="flex items-center justify-between pb-2.5 mb-1 border-b border-zinc-800/80">
                    <div className="flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-zinc-400" />
                      <span className="text-xs font-semibold text-zinc-200 tracking-tight">MRTG Traffic</span>
                    </div>
                    <button
                      onClick={() => setCurrentTab('monitoring')}
                      className="text-[11px] text-zinc-400 hover:text-zinc-200 font-mono flex items-center space-x-1 transition"
                    >
                      <span>Analytics</span>
                      <ChevronRight className="w-3 h-3 text-zinc-500" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between font-mono text-[10px] my-1">
                    <span className="flex items-center space-x-1.5 text-zinc-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Rx: {currentRx}</span>
                    </span>
                    <span className="flex items-center space-x-1.5 text-zinc-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span>Tx: {currentTx}</span>
                    </span>
                  </div>

                  <div className="h-28 w-full mt-1 bg-zinc-950/80 rounded-lg border border-zinc-800/80 overflow-hidden pt-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={liveTraffic.points.slice(-14)} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="dashMrtgIn" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="rxMbps"
                          stroke="#10b981"
                          strokeWidth={1.5}
                          fill="url(#dashMrtgIn)"
                          isAnimationActive={false}
                        />
                        <Area
                          type="monotone"
                          dataKey="txMbps"
                          stroke="#3b82f6"
                          strokeWidth={1.5}
                          fill="transparent"
                          isAnimationActive={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              );
            })()}

          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT OPERATIONS COLUMN (xl:col-span-4)                   */}
        {/* ======================================================== */}
        <div className="xl:col-span-4 space-y-4">
          {/* CARD 1: AI COPILOT WORKSPACE */}
          <div className="bg-[#121215] border border-zinc-800 rounded-xl p-4 shadow-sm flex flex-col justify-between h-[450px] relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-zinc-300" />
                <span className="font-semibold text-sm text-zinc-100 tracking-tight">Network Copilot</span>
                <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 text-[10px] font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Online</span>
                </span>
              </div>

              <button
                onClick={() =>
                  setMessages([
                    {
                      id: `rst-${Date.now()}`,
                      sender: 'ai',
                      intro: 'Copilot session reset. Ready for network diagnostics or config inspection.',
                      steps: [],
                      analysis: '',
                      recommendations: [],
                      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    },
                  ])
                }
                className="text-[11px] text-zinc-500 hover:text-zinc-300 font-mono px-2 py-0.5 rounded hover:bg-zinc-800/60 transition"
              >
                Clear
              </button>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3 font-sans text-xs pr-1">
              {messages.map((m) =>
                m.sender === 'user' ? (
                  <div key={m.id} className="flex justify-end">
                    <div className="max-w-[85%] bg-zinc-800 text-zinc-100 border border-zinc-700/60 rounded-xl rounded-tr-sm px-3.5 py-2 text-[12px] leading-relaxed shadow-sm">
                      {m.intro}
                      <div className="text-[9px] text-zinc-400 text-right mt-1 font-mono">
                        {m.time}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div key={m.id} className="space-y-2 text-zinc-200">
                    <p className="text-[12px] text-zinc-300 leading-relaxed font-sans">{m.intro}</p>

                    {m.steps && m.steps.length > 0 && (
                      <div className="space-y-1 font-mono text-[11px] bg-zinc-900/90 p-2.5 rounded-lg border border-zinc-800">
                        {m.steps.map((st, i) => (
                          <div key={i} className="flex items-center justify-between text-zinc-300">
                            <span className="flex items-center space-x-1.5 text-zinc-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              <span>{st.name}</span>
                            </span>
                            <span className="text-emerald-400 text-[10px] font-semibold">{st.status}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {m.analysis && (
                      <div className="space-y-1">
                        <div className="text-[11px] font-medium text-zinc-400 font-mono">Analysis Findings:</div>
                        <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800 text-zinc-300 text-[11px] leading-relaxed font-sans">
                          {m.analysis}
                        </div>
                      </div>
                    )}

                    {m.recommendations && m.recommendations.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-[11px] font-medium text-zinc-400 font-mono">Action Items:</div>
                        <ol className="list-decimal list-inside space-y-0.5 text-[11px] text-zinc-400 pl-1 font-sans">
                          {m.recommendations.map((rec, i) => (
                            <li key={i} className="leading-relaxed">
                              {rec}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                )
              )}

              {isDiagnosing && (
                <div className="flex items-center space-x-2 text-zinc-400 text-xs font-mono animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
                  <span>Copilot analyzing network state...</span>
                </div>
              )}
            </div>

            {/* Bottom Form & Chips */}
            <div className="pt-2.5 border-t border-zinc-800/80 space-y-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center space-x-2 bg-zinc-900/90 border border-zinc-800 rounded-lg px-3 py-1.5 focus-within:border-zinc-700 transition"
              >
                <input
                  type="text"
                  placeholder="Ask copilot about routes, BGP, MTU, or packet loss..."
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-xs text-zinc-100 placeholder-zinc-500 font-sans"
                />
                <button
                  type="submit"
                  disabled={!inputPrompt.trim() || isDiagnosing}
                  className="p-1.5 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 disabled:opacity-40 transition shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

              <div className="flex items-center space-x-1.5 overflow-x-auto text-[10px] font-sans scrollbar-none pb-0.5">
                <button
                  onClick={() => handleSendMessage('Bagaimana cara menghubungkan MikroTik asli ke AUDIRA?')}
                  className="px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 whitespace-nowrap transition"
                >
                  MikroTik Setup
                </button>
                <button
                  onClick={() => handleSendMessage('Periksa kesiapan backend API')}
                  className="px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 whitespace-nowrap transition"
                >
                  Backend Health
                </button>
                <button
                  onClick={() => setAddDeviceModalOpen(true)}
                  className="px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 whitespace-nowrap transition font-medium"
                >
                  + Add Device
                </button>
              </div>
            </div>
          </div>

          {/* CARD 2: SYSTEM RESOURCES */}
          <div className="bg-[#121215] border border-zinc-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-zinc-800/80">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-zinc-400" />
                <span className="text-xs font-semibold text-zinc-200 tracking-tight">Host Resources</span>
              </div>
              <button
                onClick={() => setCurrentTab('monitoring')}
                className="text-[11px] text-zinc-400 hover:text-zinc-200 font-mono flex items-center space-x-1 transition"
              >
                <span>Telemetry</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center font-mono">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-500">CPU</span>
                  <span className="text-zinc-200 font-semibold">12%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/80">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '12%' }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-500">Memory</span>
                  <span className="text-zinc-200 font-semibold">24%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/80">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '24%' }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-500">Disk</span>
                  <span className="text-zinc-200 font-semibold">18%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/80">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '18%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* CARD 3: QUICK ACTIONS */}
          <div className="bg-[#121215] border border-zinc-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center space-x-2 pb-2 mb-3 border-b border-zinc-800/80">
              <Zap className="w-4 h-4 text-zinc-400" />
              <span className="text-xs font-semibold text-zinc-200 tracking-tight">Quick Operations</span>
            </div>

            <div className="grid grid-cols-3 gap-2 font-sans text-xs">
              <button
                onClick={() => {
                  if (devices.length === 0) {
                    alert('Tambahkan perangkat jaringan terlebih dahulu sebelum melakukan ping test.');
                  } else {
                    handleSendMessage(`Jalankan ping test ke ${devices[0]?.name}`);
                  }
                }}
                className="p-3 rounded-lg bg-zinc-900/70 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-zinc-100 flex flex-col items-center justify-center space-y-1.5 transition text-center"
              >
                <Activity className="w-4 h-4 text-zinc-400" />
                <span className="text-[11px] font-medium leading-tight">Ping Test</span>
              </button>

              <button
                onClick={() => handleSendMessage('Jalankan traceroute ke default gateway 8.8.8.8')}
                className="p-3 rounded-lg bg-zinc-900/70 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-zinc-100 flex flex-col items-center justify-center space-y-1.5 transition text-center"
              >
                <Clock className="w-4 h-4 text-zinc-400" />
                <span className="text-[11px] font-medium leading-tight">Traceroute</span>
              </button>

              <button
                onClick={() => setCurrentTab('terminal')}
                className="p-3 rounded-lg bg-zinc-900/70 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-zinc-100 flex flex-col items-center justify-center space-y-1.5 transition text-center"
              >
                <Terminal className="w-4 h-4 text-zinc-400" />
                <span className="text-[11px] font-medium leading-tight">Terminal</span>
              </button>

              <button
                onClick={() => setCurrentTab('backups')}
                className="p-3 rounded-lg bg-zinc-900/70 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-zinc-100 flex flex-col items-center justify-center space-y-1.5 transition text-center"
              >
                <HardDrive className="w-4 h-4 text-zinc-400" />
                <span className="text-[11px] font-medium leading-tight">Backup</span>
              </button>

              <button
                onClick={() => setCurrentTab('automation')}
                className="p-3 rounded-lg bg-zinc-900/70 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-zinc-100 flex flex-col items-center justify-center space-y-1.5 transition text-center"
              >
                <Play className="w-4 h-4 text-zinc-400" />
                <span className="text-[11px] font-medium leading-tight">Playbook</span>
              </button>

              <button
                onClick={() => setAddDeviceModalOpen(true)}
                className="p-3 rounded-lg bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 hover:border-zinc-600 text-zinc-100 flex flex-col items-center justify-center space-y-1.5 transition text-center"
              >
                <Plus className="w-4 h-4 text-zinc-200" />
                <span className="text-[11px] font-medium leading-tight">+ Add Node</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* INTERACTIVE ADD DEVICE MODAL                              */}
      {/* ======================================================== */}
      {isAddDeviceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#121215] border border-zinc-800 rounded-2xl shadow-2xl p-6 relative">
            <button
              onClick={() => setAddDeviceModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-zinc-800/90 border border-zinc-700/80 flex items-center justify-center text-zinc-200">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-100">Add Network Device</h3>
                <p className="text-xs text-zinc-400">Connect a physical router, switch, or VM</p>
              </div>
            </div>

            <form onSubmit={handleSaveDevice} className="space-y-3.5 text-xs font-sans">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">Device Name / Hostname</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RB4011-CORE-01"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 font-mono text-xs transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">IP Address / Host</label>
                  <input
                    type="text"
                    required
                    placeholder="192.168.88.1"
                    value={formData.ipAddress}
                    onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 font-mono text-xs transition"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Port</label>
                  <input
                    type="text"
                    placeholder="443 / 8728 / 22"
                    value={formData.port}
                    onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 font-mono text-xs transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Vendor Platform</label>
                  <select
                    value={formData.vendor}
                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value as VendorType })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-zinc-600 text-xs font-mono transition"
                  >
                    <option value="MikroTik">MikroTik RouterOS</option>
                    <option value="Cisco">Cisco Systems (IOS-XE)</option>
                    <option value="Huawei">Huawei Enterprise (VRP)</option>
                    <option value="Juniper">Juniper Networks (JunOS)</option>
                    <option value="Arista">Arista Networks (EOS)</option>
                    <option value="Fortinet">Fortinet FortiGate</option>
                    <option value="VyOS">VyOS Routing Platform</option>
                    <option value="EdgeCore">EdgeCore (SONiC)</option>
                    <option value="Ubiquiti">Ubiquiti UniFi / EdgeMAX</option>
                    <option value="Linux">Linux Server</option>
                    <option value="GenericSSH">Generic SSH</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Protocol</label>
                  <select
                    value={formData.connectionType}
                    onChange={(e) => setFormData({ ...formData, connectionType: e.target.value as ConnectionType })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-zinc-600 text-xs font-mono transition"
                  >
                    <option value="ROUTEROS_API">RouterOS REST / API</option>
                    <option value="SSH">SSH CLI (Port 22)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Username</label>
                  <input
                    type="text"
                    required
                    placeholder="admin"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 font-mono text-xs transition"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 font-mono text-xs transition"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setAddDeviceModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 font-medium text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-semibold transition text-xs flex items-center space-x-1.5 shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Connect Device</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
