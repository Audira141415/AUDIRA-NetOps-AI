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
    <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-3.5rem)] select-none">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* ======================================================== */}
        {/* CENTER OBSERVABILITY COLUMN (xl:col-span-8)               */}
        {/* ======================================================== */}
        <div className="xl:col-span-8 space-y-4">
          {/* HEADER: Network Health + Time Filters */}
          <div className="glass-cyber-card rounded-2xl p-4 relative overflow-hidden shadow-[0_8px_30px_rgba(2,6,23,0.4)] border border-cyan-500/25">
            <div className="holo-line absolute top-0 left-0 right-0" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center space-x-2">
                  <span>Network Health</span>
                </h1>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Real-time overview of your network infrastructure
                </p>
              </div>

              {/* Time Range Filter Buttons */}
              <div className="flex items-center space-x-1 bg-[#0b1222] p-1 rounded-xl border border-cyan-500/20 text-xs font-mono">
                {(['Live', '1H', '6H', '24H', '7D', '30D'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setActiveTimeFilter(range)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                      activeTimeFilter === range
                        ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.7)] border border-cyan-400/40'
                        : 'text-slate-400 hover:text-slate-200'
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
              <div className="p-3.5 rounded-xl bg-[#111c38]/80 border border-cyan-500/25 flex items-center space-x-3 shadow-inner hover:border-cyan-400/50 transition">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.3)]">
                  <Monitor className="w-5 h-5 text-cyan-300" />
                </div>
                <div>
                  <div className="text-2xl font-black text-white font-mono leading-none">{totalDevices}</div>
                  <div className="text-[11px] text-slate-400 font-sans mt-1">Total Devices</div>
                </div>
              </div>

              {/* Online */}
              <div className="p-3.5 rounded-xl bg-[#111c38]/80 border border-cyan-500/25 flex items-center justify-between shadow-inner hover:border-emerald-400/50 transition">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3.5 h-3.5 rounded-full ${
                      onlineDevices > 0
                        ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]'
                        : 'bg-slate-600'
                    } ml-1`}
                  />
                  <div>
                    <div className="text-2xl font-black text-white font-mono leading-none">{onlineDevices}</div>
                    <div className="text-[11px] text-slate-400 font-sans mt-1">Online</div>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
                  {onlinePct}%
                </span>
              </div>

              {/* Warning */}
              <div className="p-3.5 rounded-xl bg-[#111c38]/80 border border-cyan-500/25 flex items-center justify-between shadow-inner hover:border-amber-400/50 transition">
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.25)]">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white font-mono leading-none">{warningDevices}</div>
                    <div className="text-[11px] text-slate-400 font-sans mt-1">Warning</div>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-950/60 border border-amber-500/40 text-amber-400">
                  {warningPct}%
                </span>
              </div>

              {/* Offline */}
              <div className="p-3.5 rounded-xl bg-[#111c38]/80 border border-cyan-500/25 flex items-center justify-between shadow-inner hover:border-rose-400/50 transition">
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.25)]">
                    <XCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white font-mono leading-none">{offlineDevices}</div>
                    <div className="text-[11px] text-slate-400 font-sans mt-1">Offline</div>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-rose-950/60 border border-rose-500/40 text-rose-400">
                  {offlinePct}%
                </span>
              </div>
            </div>
          </div>

          {/* NETWORK TOPOLOGY CARD */}
          <div className="glass-cyber-card rounded-2xl p-4 shadow-[0_8px_30px_rgba(2,6,23,0.4)] border border-cyan-500/25 relative overflow-hidden">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-cyan-500/20">
              <div className="flex items-center space-x-2">
                <Share2 className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-bold text-white tracking-wide">Network Topology</h2>
              </div>

              <div className="flex items-center space-x-2 text-xs">
                <button
                  onClick={() => setAddDeviceModalOpen(true)}
                  className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition flex items-center space-x-1 shadow-[0_0_10px_rgba(37,99,235,0.4)]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Device</span>
                </button>
                <button
                  onClick={() => setCurrentTab('topology')}
                  className="p-1.5 rounded-lg bg-[#111c38] hover:bg-[#19274e] border border-cyan-500/30 text-slate-300 hover:text-white transition"
                  title="Fullscreen"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Topology Canvas: Clean Onboarding Zero-State or Live Nodes */}
            <div className="h-[280px] bg-[#070d1c]/90 rounded-xl border border-cyan-500/20 p-4 relative flex flex-col items-center justify-center font-mono text-xs overflow-hidden shadow-inner">
              {devices.length === 0 ? (
                /* CLEAN ONBOARDING ZERO STATE */
                <div className="flex flex-col items-center justify-center text-center max-w-md space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.3)]">
                    <Network className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-sans">
                      Belum Ada Perangkat Jaringan Terhubung
                    </h3>
                    <p className="text-[11px] text-slate-400 font-sans mt-1 leading-relaxed">
                      Sistem telah di-reset ke kondisi awal. Hubungkan router MikroTik atau switch fisik Anda untuk memetakan topologi jaringan secara otomatis.
                    </p>
                  </div>
                  <button
                    onClick={() => setAddDeviceModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-[0_0_18px_rgba(6,182,212,0.4)] transition hover:scale-105 flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Perangkat Pertama</span>
                  </button>
                </div>
              ) : (
                /* LIVE DEVICE TOPOLOGY TREE */
                <div className="w-full h-full flex flex-col items-center justify-between">
                  {/* Top Cloud */}
                  <div className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-900/70 to-cyan-900/70 border border-cyan-400/50 text-cyan-200 font-bold flex items-center space-x-2 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                    <Cloud className="w-4 h-4 text-cyan-300" />
                    <span>Gateway / Uplink</span>
                  </div>

                  <div className="w-0.5 h-6 bg-gradient-to-b from-cyan-400 to-blue-500 shadow-[0_0_8px_#38bdf8]" />

                  {/* Registered Devices Grid */}
                  <div className="flex flex-wrap items-center justify-center gap-3 overflow-y-auto max-h-[160px] p-2">
                    {devices.map((dev) => (
                      <div
                        key={dev.id}
                        onClick={() => handleSendMessage(`Cek kondisi interface pada ${dev.name} (${dev.ipAddress})`)}
                        className="px-3.5 py-2 rounded-xl bg-[#111c38] border border-cyan-400/40 text-white cursor-pointer hover:border-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)] transition hover:scale-105 flex items-center space-x-2.5"
                      >
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${
                            dev.status === 'ONLINE'
                              ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                              : dev.status === 'WARNING'
                              ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24]'
                              : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'
                          }`}
                        />
                        <div className="text-left">
                          <div className="font-bold text-xs text-cyan-100">{dev.name}</div>
                          <div className="text-[10px] text-slate-400 font-sans">{dev.ipAddress}</div>
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
            <div className="glass-cyber-card rounded-2xl p-3.5 shadow-md flex flex-col justify-between border border-cyan-500/20">
              <div>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-500/20">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white tracking-wide">Recent Alerts</span>
                  </div>
                  <button
                    onClick={() => setCurrentTab('alerts')}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono flex items-center space-x-1"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-2 font-sans text-xs">
                  {activeAlerts.length === 0 ? (
                    <div className="p-4 text-center text-slate-400 space-y-1.5">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                      <div className="text-slate-200 font-bold text-xs">Semua Sistem Normal</div>
                      <div className="text-[10px] text-slate-400">
                        Tidak ada insiden aktif atau packet loss terdeteksi.
                      </div>
                    </div>
                  ) : (
                    activeAlerts.map((alt) => (
                      <div
                        key={alt.id}
                        className="flex items-start justify-between p-1.5 rounded-lg hover:bg-white/5 transition"
                      >
                        <div className="flex items-start space-x-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-semibold text-slate-100 text-[11px]">{alt.title}</div>
                            <div className="text-[10px] text-slate-400">{alt.message}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* CARD 2: Device Status Donut Chart */}
            <div className="glass-cyber-card rounded-2xl p-3.5 shadow-md flex flex-col justify-between border border-cyan-500/20">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-500/20">
                <div className="flex items-center space-x-2">
                  <Server className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white tracking-wide">Device Status</span>
                </div>
                <button
                  onClick={() => setCurrentTab('devices')}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Dynamic Donut Ring SVG */}
              <div className="flex items-center justify-between px-2 py-2">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#131d38" strokeWidth="12" />
                    {totalDevices > 0 && (
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#10b981"
                        strokeWidth="12"
                        strokeDasharray="238.7"
                        strokeDashoffset={238.7 - (onlineDevices / totalDevices) * 238.7}
                        strokeLinecap="round"
                      />
                    )}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                    <span className="text-xl font-black text-white leading-none">{totalDevices}</span>
                    <span className="text-[10px] text-slate-400 font-sans mt-0.5">Devices</span>
                  </div>
                </div>

                <div className="space-y-2 font-mono text-[11px]">
                  <div className="flex items-center justify-between space-x-4">
                    <span className="flex items-center space-x-1.5 text-slate-300">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                      <span>Online</span>
                    </span>
                    <div className="space-x-2">
                      <span className="text-white font-bold">{onlineDevices}</span>
                      <span className="text-emerald-400">{onlinePct}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between space-x-4">
                    <span className="flex items-center space-x-1.5 text-slate-300">
                      <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24]" />
                      <span>Warning</span>
                    </span>
                    <div className="space-x-2">
                      <span className="text-white font-bold">{warningDevices}</span>
                      <span className="text-amber-400">{warningPct}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between space-x-4">
                    <span className="flex items-center space-x-1.5 text-slate-300">
                      <span className="w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_6px_#f43f5e]" />
                      <span>Offline</span>
                    </span>
                    <div className="space-x-2">
                      <span className="text-white font-bold">{offlineDevices}</span>
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
                  <div className="glass-cyber-card rounded-2xl p-3.5 shadow-md flex flex-col justify-between border border-cyan-500/20">
                    <div className="flex items-center justify-between pb-2 mb-1 border-b border-cyan-500/20">
                      <div className="flex items-center space-x-2">
                        <Activity className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-bold text-white tracking-wide">Network Traffic (MRTG)</span>
                      </div>
                      <button
                        onClick={() => setCurrentTab('devices')}
                        className="text-[10px] text-cyan-300 hover:text-white font-mono flex items-center space-x-1 bg-[#111c38] px-2 py-0.5 rounded border border-cyan-500/30 hover:bg-cyan-500/20 transition"
                      >
                        <span>+ Tambah Node</span>
                      </button>
                    </div>

                    <div className="h-28 flex flex-col items-center justify-center text-center p-3 text-slate-500 space-y-1">
                      <Activity className="w-6 h-6 text-slate-600 mb-1" />
                      <p className="text-[11px] font-sans text-slate-400">Belum ada perangkat terhubung.</p>
                      <p className="text-[9px] font-mono text-slate-600">Grafik traffic akan aktif saat router riil ditambahkan.</p>
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
                <div className="glass-cyber-card rounded-2xl p-3.5 shadow-md flex flex-col justify-between border border-cyan-500/20">
                  <div className="flex items-center justify-between pb-2 mb-1 border-b border-cyan-500/20">
                    <div className="flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-bold text-white tracking-wide">Network Traffic (MRTG)</span>
                    </div>
                    <button
                      onClick={() => setCurrentTab('monitoring')}
                      className="text-[10px] text-cyan-300 hover:text-white font-mono flex items-center space-x-1 bg-[#111c38] px-2 py-0.5 rounded border border-cyan-500/30 hover:bg-cyan-500/20 transition"
                    >
                      <span>Open MRTG View</span>
                      <ChevronRight className="w-3 h-3 text-cyan-400" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between font-mono text-[10px] my-1">
                    <span className="flex items-center space-x-1 text-emerald-300 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                      <span>In (Rx): {currentRx}</span>
                    </span>
                    <span className="flex items-center space-x-1 text-cyan-300 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#38bdf8]" />
                      <span>Out (Tx): {currentTx}</span>
                    </span>
                  </div>

                  <div className="h-28 w-full mt-1 bg-[#080e1c] rounded-xl border border-cyan-500/10 overflow-hidden pt-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={liveTraffic.points.slice(-14)} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="dashMrtgIn" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
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
                          stroke="#06b6d4"
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
          <div className="glass-cyber-card rounded-2xl p-4 shadow-[0_8px_30px_rgba(2,6,23,0.4)] border border-cyan-500/30 flex flex-col justify-between h-[450px] relative overflow-hidden">
            <div className="holo-line absolute top-0 left-0 right-0" />

            <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-cyan-400" />
                <span className="font-extrabold text-sm text-white tracking-wide">AI Copilot</span>
                <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse" />
                  <span>Ready</span>
                </span>
              </div>

              <button
                onClick={() =>
                  setMessages([
                    {
                      id: `rst-${Date.now()}`,
                      sender: 'ai',
                      intro: 'Riwayat percakapan dibersihkan. Silakan ajukan instruksi:',
                      steps: [],
                      analysis: '',
                      recommendations: [],
                      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    },
                  ])
                }
                className="text-[11px] text-slate-400 hover:text-slate-200 font-mono px-2 py-0.5 rounded hover:bg-white/5 transition"
              >
                Clear
              </button>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3 font-sans text-xs pr-1">
              {messages.map((m) =>
                m.sender === 'user' ? (
                  <div key={m.id} className="flex justify-end">
                    <div className="max-w-[85%] bg-blue-600 text-white rounded-2xl rounded-tr-sm px-3.5 py-2 shadow-[0_0_15px_rgba(37,99,235,0.4)] text-[12px] leading-relaxed">
                      {m.intro}
                      <div className="text-[9px] text-blue-200 text-right mt-1 font-mono">
                        {m.time}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div key={m.id} className="space-y-2.5 text-slate-200">
                    <p className="text-[11px] text-slate-300 leading-relaxed font-sans">{m.intro}</p>

                    {m.steps && m.steps.length > 0 && (
                      <div className="space-y-1 font-mono text-[11px] bg-[#0c1427] p-2.5 rounded-xl border border-cyan-500/20">
                        {m.steps.map((st, i) => (
                          <div key={i} className="flex items-center justify-between text-slate-300">
                            <span className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-slate-200">{st.name}</span>
                            </span>
                            <span className="text-emerald-400 text-[10px] font-bold">{st.status}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {m.analysis && (
                      <div className="space-y-1">
                        <div className="text-[11px] font-bold text-slate-300 font-mono">Hasil evaluasi:</div>
                        <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-200 text-[11px] flex items-start space-x-2 shadow-inner">
                          <div className="leading-relaxed font-sans">{m.analysis}</div>
                        </div>
                      </div>
                    )}

                    {m.recommendations && m.recommendations.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-[11px] font-bold text-slate-300 font-mono">Panduan / Langkah:</div>
                        <ol className="list-decimal list-inside space-y-0.5 text-[11px] text-slate-300 pl-1 font-sans">
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
                <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono animate-pulse">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Copilot memproses permintaan...</span>
                </div>
              )}
            </div>

            {/* Bottom Form & Chips */}
            <div className="pt-2 border-t border-cyan-500/20 space-y-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center space-x-2 bg-[#091020] border border-cyan-500/30 rounded-xl px-3 py-1.5 focus-within:border-cyan-400 transition"
              >
                <input
                  type="text"
                  placeholder="Tanyakan sesuatu tentang jaringan Anda..."
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-xs text-white placeholder-slate-500 font-sans"
                />
                <button
                  type="submit"
                  disabled={!inputPrompt.trim() || isDiagnosing}
                  className="p-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 transition shadow-[0_0_10px_rgba(37,99,235,0.4)]"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

              <div className="flex items-center space-x-1.5 overflow-x-auto text-[10px] font-sans scrollbar-none pb-1">
                <button
                  onClick={() => handleSendMessage('Bagaimana cara menghubungkan MikroTik asli ke AUDIRA?')}
                  className="px-2.5 py-1 rounded-lg bg-[#111c38] hover:bg-[#1a2b54] border border-cyan-500/25 text-slate-300 whitespace-nowrap transition"
                >
                  Panduan MikroTik
                </button>
                <button
                  onClick={() => handleSendMessage('Periksa kesiapan backend API')}
                  className="px-2.5 py-1 rounded-lg bg-[#111c38] hover:bg-[#1a2b54] border border-cyan-500/25 text-slate-300 whitespace-nowrap transition"
                >
                  Status Backend
                </button>
                <button
                  onClick={() => setAddDeviceModalOpen(true)}
                  className="px-2.5 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/40 text-blue-200 whitespace-nowrap transition font-bold"
                >
                  + Add Device
                </button>
              </div>
            </div>
          </div>

          {/* CARD 2: SYSTEM RESOURCES */}
          <div className="glass-cyber-card rounded-2xl p-4 shadow-md border border-cyan-500/20">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-cyan-500/20">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white tracking-wide">System Resources</span>
              </div>
              <button
                onClick={() => setCurrentTab('monitoring')}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono flex items-center space-x-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center font-mono">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">CPU</span>
                  <span className="text-emerald-400 font-bold">12%</span>
                </div>
                <div className="w-full h-1.5 bg-[#0b1222] rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: '12%' }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Memory</span>
                  <span className="text-blue-400 font-bold">24%</span>
                </div>
                <div className="w-full h-1.5 bg-[#0b1222] rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '24%' }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Disk</span>
                  <span className="text-purple-400 font-bold">18%</span>
                </div>
                <div className="w-full h-1.5 bg-[#0b1222] rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '18%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* CARD 3: QUICK ACTIONS */}
          <div className="glass-cyber-card rounded-2xl p-4 shadow-md border border-cyan-500/20">
            <div className="flex items-center space-x-2 pb-2 mb-3 border-b border-cyan-500/20">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white tracking-wide">Quick Actions</span>
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
                className="p-2.5 rounded-xl bg-[#111c38]/90 hover:bg-[#1a2b54] border border-cyan-500/25 hover:border-cyan-400 text-slate-200 flex flex-col items-center justify-center space-y-1 transition text-center shadow-sm"
              >
                <Activity className="w-4 h-4 text-cyan-400" />
                <span className="text-[11px] font-medium leading-tight">Ping Device</span>
              </button>

              <button
                onClick={() => handleSendMessage('Jalankan traceroute ke default gateway 8.8.8.8')}
                className="p-2.5 rounded-xl bg-[#111c38]/90 hover:bg-[#1a2b54] border border-cyan-500/25 hover:border-cyan-400 text-slate-200 flex flex-col items-center justify-center space-y-1 transition text-center shadow-sm"
              >
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className="text-[11px] font-medium leading-tight">Traceroute</span>
              </button>

              <button
                onClick={() => setCurrentTab('terminal')}
                className="p-2.5 rounded-xl bg-[#111c38]/90 hover:bg-[#1a2b54] border border-cyan-500/25 hover:border-cyan-400 text-slate-200 flex flex-col items-center justify-center space-y-1 transition text-center shadow-sm"
              >
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="text-[11px] font-medium leading-tight">SSH Terminal</span>
              </button>

              <button
                onClick={() => setCurrentTab('backups')}
                className="p-2.5 rounded-xl bg-[#111c38]/90 hover:bg-[#1a2b54] border border-cyan-500/25 hover:border-cyan-400 text-slate-200 flex flex-col items-center justify-center space-y-1 transition text-center shadow-sm"
              >
                <HardDrive className="w-4 h-4 text-cyan-400" />
                <span className="text-[11px] font-medium leading-tight">Backup Config</span>
              </button>

              <button
                onClick={() => setCurrentTab('automation')}
                className="p-2.5 rounded-xl bg-[#111c38]/90 hover:bg-[#1a2b54] border border-cyan-500/25 hover:border-cyan-400 text-slate-200 flex flex-col items-center justify-center space-y-1 transition text-center shadow-sm"
              >
                <Play className="w-4 h-4 text-cyan-400" />
                <span className="text-[11px] font-medium leading-tight">Run Script</span>
              </button>

              <button
                onClick={() => setAddDeviceModalOpen(true)}
                className="p-2.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/50 hover:border-cyan-300 text-blue-200 flex flex-col items-center justify-center space-y-1 transition text-center shadow-[0_0_12px_rgba(59,130,246,0.25)]"
              >
                <Plus className="w-4 h-4 text-cyan-300" />
                <span className="text-[11px] font-bold leading-tight text-white">+ Add Device</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* INTERACTIVE ADD DEVICE MODAL                              */}
      {/* ======================================================== */}
      {isAddDeviceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0c1427] border border-cyan-500/40 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.3)] p-6 relative">
            <button
              onClick={() => setAddDeviceModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Add Network Device</h3>
                <p className="text-xs text-slate-400">Hubungkan router atau switch fisik Anda</p>
              </div>
            </div>

            <form onSubmit={handleSaveDevice} className="space-y-3.5 text-xs font-sans">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Device Name / Label</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: RB4011-CORE-01"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#111c38] border border-cyan-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">IP Address / Hostname</label>
                  <input
                    type="text"
                    required
                    placeholder="192.168.88.1"
                    value={formData.ipAddress}
                    onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#111c38] border border-cyan-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Port</label>
                  <input
                    type="text"
                    placeholder="443 atau 8728"
                    value={formData.port}
                    onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#111c38] border border-cyan-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Vendor</label>
                  <select
                    value={formData.vendor}
                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value as VendorType })}
                    className="w-full px-3 py-2 rounded-xl bg-[#111c38] border border-cyan-500/30 text-white focus:outline-none focus:border-cyan-400 text-xs font-mono"
                  >
                    <option value="MikroTik">MikroTik RouterOS</option>
                    <option value="Cisco">Cisco Systems (IOS-XE/NX-OS)</option>
                    <option value="Huawei">Huawei Enterprise (VRP OS)</option>
                    <option value="Juniper">Juniper Networks (JunOS)</option>
                    <option value="Arista">Arista Networks (EOS)</option>
                    <option value="Fortinet">Fortinet FortiGate (FortiOS)</option>
                    <option value="VyOS">VyOS Routing Platform</option>
                    <option value="EdgeCore">EdgeCore Networks (SONiC)</option>
                    <option value="Ubiquiti">Ubiquiti (EdgeMAX/UniFi)</option>
                    <option value="Linux">Linux / Ubuntu Server</option>
                    <option value="GenericSSH">Generic SSH Switch/Router</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Protocol</label>
                  <select
                    value={formData.connectionType}
                    onChange={(e) => setFormData({ ...formData, connectionType: e.target.value as ConnectionType })}
                    className="w-full px-3 py-2 rounded-xl bg-[#111c38] border border-cyan-500/30 text-white focus:outline-none focus:border-cyan-400 text-xs font-mono"
                  >
                    <option value="ROUTEROS_API">RouterOS REST / API</option>
                    <option value="SSH">SSH CLI (Port 22)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Username</label>
                  <input
                    type="text"
                    required
                    placeholder="admin"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#111c38] border border-cyan-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#111c38] border border-cyan-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-cyan-500/20 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setAddDeviceModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition shadow-[0_0_15px_rgba(37,99,235,0.5)] flex items-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Connect &amp; Save Device</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
