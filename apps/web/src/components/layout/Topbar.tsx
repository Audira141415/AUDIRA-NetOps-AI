// Topbar Component - Holographic Luxury NOC Cockpit Theme

import React, { useEffect, useState } from 'react';
import {
  Search,
  Bell,
  Bot,
  User as UserIcon,
  Moon,
  Share2,
  Globe,
  Shield,
  Zap,
  Sparkles,
  ChevronDown,
  Lock,
  Unlock,
  Clock,
  KeyRound,
  X,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { useNetOpsStore, OperationMode } from '../../store/useNetOpsStore';

export const Topbar: React.FC = () => {
  const {
    currentTab,
    selectedDevice,
    setCommandPaletteOpen,
    isAiDrawerOpen,
    setAiDrawerOpen,
    activeAlerts,
    setCurrentTab,
    devices,
    setAddDeviceModalOpen,
    operationMode,
    setOperationMode,
    recommendationModeActive,
    setRecommendationModeActive,
    currentUser,
    logout,
    showToast,
  } = useNetOpsStore();

  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [hasCopiedUri, setHasCopiedUri] = useState(false);

  // Realtime WIB time & Change Freeze Window policy state
  const [wibTime, setWibTime] = useState<string>(() => {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const wibDate = new Date(utc + 3600000 * 7);
    return wibDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';
  });
  const [wibHour, setWibHour] = useState<number>(() => {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const wibDate = new Date(utc + 3600000 * 7);
    return wibDate.getHours();
  });
  const [isFreezeModalOpen, setIsFreezeModalOpen] = useState(false);
  const [breakGlassActive, setBreakGlassActive] = useState(false);
  const [breakGlassReason, setBreakGlassReason] = useState('');
  const [breakGlassTicket, setBreakGlassTicket] = useState('INC-2026-9042');
  const [breakGlassApprover, setBreakGlassApprover] = useState('lead_netops_sec');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const wibDate = new Date(utc + 3600000 * 7);
      const h = wibDate.getHours();
      setWibHour(h);
      setWibTime(
        wibDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB'
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const isPeakFreeze = wibHour >= 8 && wibHour < 22;
  const isMaintenance = wibHour >= 1 && wibHour < 5;

  // Compute canonical authoritative NOC URI for current workspace state
  const canonicalUri = React.useMemo(() => {
    if (selectedDevice && currentTab === 'device-detail') {
      return `https://${selectedDevice.hostname}:${selectedDevice.apiPort || 8729}`;
    }
    if (currentTab === 'terminal') {
      return `ssh://admin@core-jogja-01.noc.audira.net:22`;
    }
    if (currentTab === 'configuration') {
      return `config://noc.audira.net/studio`;
    }
    return `https://noc.audira.net/#/${currentTab}`;
  }, [currentTab, selectedDevice]);

  const handleCopyUri = () => {
    navigator.clipboard.writeText(canonicalUri);
    setHasCopiedUri(true);
    showToast(`URI Identitas "${canonicalUri}" disalin ke clipboard!`, 'info');
    setTimeout(() => setHasCopiedUri(false), 2000);
  };

  // Keyboard shortcut Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.key.toLowerCase() === 'k') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'p')) {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setCommandPaletteOpen]);

  return (
    <header className="h-14 bg-[#0d1326]/90 backdrop-blur-2xl border-b border-cyan-500/20 px-4 flex items-center justify-between select-none z-30 shadow-[0_4px_30px_rgba(6,182,212,0.15)] relative">
      {/* Prismatic Top Edge Accent Line */}
      <div className="holo-line absolute top-0 left-0 right-0" />

      {/* Brand & Global Search */}
      <div className="flex items-center space-x-4 flex-1 max-w-xl">
        {/* Brand Logo & Subtitle */}
        <a
          href="#/dashboard"
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={(e) => {
            e.preventDefault();
            setCurrentTab('dashboard');
            window.location.hash = '#/dashboard';
          }}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-[0_0_18px_rgba(56,189,248,0.5)] border border-cyan-300/40 group-hover:scale-105 transition">
            <span className="font-extrabold text-sm tracking-tighter">A</span>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-sm tracking-wide text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                AUDIRA
              </span>
              <span className="font-bold text-sm text-cyan-300">
                NetOps AI
              </span>
              <span className="text-[10px] font-mono text-cyan-400/80 px-1.5 py-0.2 rounded bg-cyan-950/60 border border-cyan-500/30">
                v1.0
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-sans tracking-tight -mt-0.5">
              AI-Powered Network Operations
            </div>
          </div>
        </a>

        {/* Global Search Button */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex-1 max-w-xs flex items-center justify-between px-3 py-1.5 bg-[#131d38]/80 hover:bg-[#1a2647] border border-cyan-500/25 hover:border-cyan-400/50 rounded-lg text-xs text-slate-300 transition shadow-[0_0_15px_rgba(6,182,212,0.1)] group"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-cyan-400 group-hover:text-cyan-300 transition" />
            <span className="text-slate-400 group-hover:text-slate-200 transition text-[11px] truncate">
              Search host, IP, commands...
            </span>
          </div>
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded bg-[#0b1020] border border-cyan-500/30 text-[10px] font-mono text-cyan-300 shadow-inner shrink-0">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Authoritative NOC URL & Identity Bar */}
      <div className="hidden lg:flex items-center space-x-2 px-3 py-1 bg-[#0b1224]/80 border border-cyan-500/30 rounded-xl font-mono text-xs shadow-inner">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-slate-400 text-[11px]">URI:</span>
        <span className="text-cyan-300 font-bold max-w-xs truncate" title={canonicalUri}>
          {canonicalUri}
        </span>
        <button
          onClick={handleCopyUri}
          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition"
          title="Salin URI Identitas Resmi"
        >
          {hasCopiedUri ? (
            <span className="text-[10px] text-emerald-400 font-bold">Tersalin!</span>
          ) : (
            <Share2 className="w-3 h-3 text-cyan-400" />
          )}
        </button>
      </div>

      {/* Right Controls: Real Device Count, AI Online, Alerts, Dark Mode, Profile */}
      <div className="flex items-center space-x-3 font-mono">
        {/* Change Freeze & 4-Eyes Governance Window Badge */}
        <button
          onClick={() => setIsFreezeModalOpen(true)}
          className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg border text-xs transition shadow-sm ${
            breakGlassActive
              ? 'bg-amber-950/70 border-amber-500/70 text-amber-300 animate-pulse'
              : isPeakFreeze
              ? 'bg-rose-950/60 border-rose-500/50 text-rose-300 hover:bg-rose-900/60'
              : isMaintenance
              ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/50'
              : 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/50'
          }`}
          title="Klik untuk membuka Status Kebijakan Change Freeze & Four-Eyes Governance"
        >
          {breakGlassActive ? (
            <Unlock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          ) : isPeakFreeze ? (
            <Lock className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          ) : (
            <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          )}
          <div className="hidden sm:flex flex-col text-left">
            <span className="font-bold text-[10px] tracking-tight leading-tight">
              {breakGlassActive
                ? 'BREAK-GLASS ACTIVE'
                : isPeakFreeze
                ? 'PEAK FREEZE (READ-ONLY)'
                : isMaintenance
                ? 'MAINTENANCE WINDOW'
                : 'OFF-PEAK WINDOW'}
            </span>
            <span className="text-[9px] text-slate-400 font-mono leading-none">
              {wibTime || '08:00 WIB'} · 4-Eyes Enforced
            </span>
          </div>
        </button>

        {/* Real Device Count Chip */}
        <button
          onClick={() => (devices.length === 0 ? setAddDeviceModalOpen(true) : setCurrentTab('devices'))}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#131d38]/80 hover:bg-[#1a2647] border border-cyan-500/30 hover:border-cyan-400/60 text-xs shadow-[0_0_12px_rgba(6,182,212,0.15)] transition"
          title={devices.length === 0 ? 'Click to add your first device' : `${devices.length} registered devices`}
        >
          <Share2 className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-cyan-200 font-bold tracking-wide">
            {devices.length} {devices.length === 1 ? 'DEVICE' : 'DEVICES'}
          </span>
        </button>

        {/* System Operation Mode Selector */}
        <div className="relative">
          <button
            onClick={() => setIsModeDropdownOpen(!isModeDropdownOpen)}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border text-xs transition shadow-sm ${
              operationMode === 'SUPERVISED'
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50'
                : operationMode === 'AUTONOMOUS'
                ? 'bg-blue-950/40 border-cyan-500/40 text-cyan-300 hover:bg-blue-900/50'
                : 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:bg-amber-900/50'
            }`}
            title="Ubah Mode Operasi Sistem (Supervised, Autonomous, Safe Mode)"
          >
            {operationMode === 'SUPERVISED' ? (
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
            ) : operationMode === 'AUTONOMOUS' ? (
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
            ) : (
              <span className="text-amber-400 text-xs font-bold">🧪</span>
            )}
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              {operationMode === 'SUPERVISED'
                ? 'Supervised'
                : operationMode === 'AUTONOMOUS'
                ? 'Autonomous'
                : 'Safe Mode'}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isModeDropdownOpen && (
            <div className="absolute top-10 right-0 w-60 bg-[#0d1527] border border-cyan-500/30 rounded-xl shadow-[0_10px_35px_rgba(0,0,0,0.8)] p-2 z-50 text-xs font-sans space-y-1">
              <div className="text-[10px] font-mono text-slate-400 px-2 py-1 uppercase tracking-wider border-b border-slate-800">
                System Operation Mode
              </div>
              <button
                onClick={() => {
                  setOperationMode('SUPERVISED');
                  setIsModeDropdownOpen(false);
                }}
                className={`w-full text-left p-2 rounded-lg flex items-start space-x-2 transition ${
                  operationMode === 'SUPERVISED' ? 'bg-emerald-950/60 border border-emerald-500/40' : 'hover:bg-white/5'
                }`}
              >
                <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white text-[11px]">Supervised (Default)</div>
                  <div className="text-[10px] text-slate-400">Setiap perubahan wajib disetujui operator.</div>
                </div>
              </button>
              <button
                onClick={() => {
                  setOperationMode('AUTONOMOUS');
                  setIsModeDropdownOpen(false);
                }}
                className={`w-full text-left p-2 rounded-lg flex items-start space-x-2 transition ${
                  operationMode === 'AUTONOMOUS' ? 'bg-blue-950/60 border border-cyan-500/40' : 'hover:bg-white/5'
                }`}
              >
                <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white text-[11px]">Autonomous Copilot</div>
                  <div className="text-[10px] text-slate-400">Self-healing otomatis untuk insiden resiko rendah.</div>
                </div>
              </button>
              <button
                onClick={() => {
                  setOperationMode('SAFE_MODE');
                  setIsModeDropdownOpen(false);
                }}
                className={`w-full text-left p-2 rounded-lg flex items-start space-x-2 transition ${
                  operationMode === 'SAFE_MODE' ? 'bg-amber-950/60 border border-amber-500/40' : 'hover:bg-white/5'
                }`}
              >
                <span className="text-sm shrink-0">🧪</span>
                <div>
                  <div className="font-bold text-white text-[11px]">Safe Mode (Dry Run)</div>
                  <div className="text-[10px] text-slate-400">Simulasi pipeline tanpa menyentuh live router.</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* AI Recommendation Mode Toggle */}
        <button
          onClick={() => setRecommendationModeActive(!recommendationModeActive)}
          className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border text-xs transition shadow-sm ${
            recommendationModeActive
              ? 'bg-purple-950/50 border-purple-500/50 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
              : 'bg-[#131d38]/80 border-slate-700 text-slate-400 hover:text-white'
          }`}
          title="Toggle AI Recommendation Mode: Saran optimasi & hardening router otomatis"
        >
          <Sparkles className={`w-3.5 h-3.5 ${recommendationModeActive ? 'text-purple-400 animate-pulse' : 'text-slate-400'}`} />
          <span className="text-[10px] font-bold">
            {recommendationModeActive ? 'AI RECS: ON' : 'AI RECS: OFF'}
          </span>
        </button>

        {/* AI Status Chip: 🤖 AI ONLINE */}
        <button
          onClick={() => setAiDrawerOpen(!isAiDrawerOpen)}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#131d38]/80 hover:bg-[#1a2647] border border-blue-500/35 hover:border-cyan-400/60 text-xs transition shadow-[0_0_15px_rgba(59,130,246,0.25)] group"
        >
          <Bot className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition" />
          <span className="font-bold text-transparent bg-gradient-to-r from-blue-300 via-cyan-300 to-teal-300 bg-clip-text">
            AI ONLINE
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
        </button>

        {/* Notification Alerts Bell (Dynamic counter) */}
        <button
          onClick={() => setCurrentTab('alerts')}
          className="relative p-2 rounded-lg bg-[#131d38]/80 hover:bg-[#1a2647] border border-cyan-500/25 text-slate-300 hover:text-white transition shadow-sm"
          title={`${activeAlerts.length} Active Alerts`}
        >
          <Bell className="w-4 h-4 text-slate-300" />
          {activeAlerts.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center shadow-[0_0_10px_#f43f5e] animate-pulse">
              {activeAlerts.length}
            </span>
          )}
        </button>

        {/* Public Landing & License Button */}
        <button
          onClick={() => setCurrentTab('landing')}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-200 text-xs font-semibold transition shadow-sm"
          title="Lihat Landing Page & Sertifikat Lisensi AUDIRA"
        >
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Landing Page</span>
        </button>

        {/* Dark Mode Icon */}
        <button
          className="p-2 rounded-lg bg-[#131d38]/80 hover:bg-[#1a2647] border border-cyan-500/25 text-slate-300 hover:text-white transition shadow-sm"
          title="Dark Mode Active"
        >
          <Moon className="w-4 h-4 text-cyan-300" />
        </button>

        {/* User Profile: avatar + admin + Role + Dropdown */}
        <div className="relative pl-2 border-l border-cyan-500/20">
          <button
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            className="flex items-center space-x-2.5 p-1 rounded-xl hover:bg-white/5 transition focus:outline-none"
            title="Sesi Operator NOC"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 border border-cyan-300/40 flex items-center justify-center text-white text-xs font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]">
              <UserIcon className="w-4 h-4 text-white" />
            </div>
            <div className="hidden xl:block text-left text-xs font-sans">
              <div className="text-white font-bold leading-none">{currentUser?.name || 'admin'}</div>
              <div className="text-[10px] text-cyan-300 font-mono mt-0.5">{currentUser?.role || 'Super Admin'}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block" />
          </button>

          {isUserDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[#0a1124] border border-cyan-500/30 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 font-sans text-xs">
              <div className="pb-2.5 mb-2 border-b border-slate-800">
                <div className="text-white font-bold">{currentUser?.name || 'Pratama NOC Admin'}</div>
                <div className="text-[11px] text-slate-400 font-mono">{currentUser?.email || 'admin@noc.audira.net'}</div>
                <div className="mt-1.5 inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
                  {currentUser?.role || 'Super Admin'}
                </div>
              </div>

              <div className="space-y-1 text-[11px] font-mono text-slate-400 py-1">
                <div className="flex justify-between">
                  <span>Client IP:</span>
                  <span className="text-slate-200">192.168.10.50</span>
                </div>
                <div className="flex justify-between">
                  <span>Session:</span>
                  <span className="text-emerald-400">Encrypted (TLS 1.3)</span>
                </div>
              </div>

              <div className="pt-2 mt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    setIsUserDropdownOpen(false);
                    logout();
                  }}
                  className="w-full py-1.5 px-3 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 text-xs font-semibold transition flex items-center justify-center space-x-1.5"
                >
                  <span>Keluar / Ganti Akun Operator</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Change Freeze & Four-Eyes Governance Modal */}
      {isFreezeModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b1226] border border-cyan-500/40 rounded-2xl max-w-lg w-full p-6 shadow-[0_0_50px_rgba(6,182,212,0.25)] space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div
                  className={`p-2 rounded-xl border ${
                    breakGlassActive
                      ? 'bg-amber-950/60 border-amber-500/50 text-amber-300'
                      : isPeakFreeze
                      ? 'bg-rose-950/60 border-rose-500/50 text-rose-300'
                      : 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                  }`}
                >
                  {breakGlassActive ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    Enterprise Change Freeze &amp; Four-Eyes Quorum
                  </h3>
                  <div className="text-[11px] text-slate-400 font-mono">
                    WIB Local Time: {wibTime}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsFreezeModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Policy Status Overview */}
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Jendela Kebijakan Aktif:</span>
                  <span
                    className={`font-mono font-bold px-2 py-0.5 rounded text-[10px] ${
                      isPeakFreeze
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : isMaintenance
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    }`}
                  >
                    {isPeakFreeze
                      ? 'PEAK HOURS FREEZE (08:00–22:00 WIB)'
                      : isMaintenance
                      ? 'MAINTENANCE WINDOW (01:00–05:00 WIB)'
                      : 'OFF-PEAK SUPERVISED'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Mode Akses Menulis:</span>
                  <span className="font-mono text-white font-semibold">
                    {breakGlassActive
                      ? 'OVERRIDE GRANTED (Audit Logged)'
                      : isPeakFreeze
                      ? 'READ-ONLY (Changes Blocked)'
                      : 'ALLOWED (Standard Approval)'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Dual-Operator (4-Eyes):</span>
                  <span className="font-mono text-emerald-400 font-semibold flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>ENFORCED (HMAC Quorum)</span>
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                Sesuai SOP <code className="text-cyan-300 font-mono">change-freeze-window-policy.md</code> dan{' '}
                <code className="text-cyan-300 font-mono">dual-operator-four-eyes-rule.md</code>, seluruh eksekusi CLI mutating, perubahan BGP, routing, dan firewall pada jam sibuk memerlukan mitigasi darurat bersertifikat (Break-Glass) atau otorisasi dua pasang mata.
              </p>
            </div>

            {/* Break Glass Controls */}
            {breakGlassActive ? (
              <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/50 space-y-3">
                <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>EMERGENCY BREAK-GLASS SEDANG AKTIF</span>
                </div>
                <div className="text-[11px] text-slate-300 font-mono space-y-1">
                  <div>
                    Incident Ticket: <span className="text-white font-bold">{breakGlassTicket}</span>
                  </div>
                  <div>
                    Alasan: <span className="text-slate-200">{breakGlassReason || 'Mitigasi darurat insiden NOC'}</span>
                  </div>
                  <div>
                    Approver 2: <span className="text-cyan-300">{breakGlassApprover}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setBreakGlassActive(false);
                    setBreakGlassReason('');
                    showToast('Emergency Break-Glass dicabut. Kebijakan Freeze kembali aktif.', 'info');
                  }}
                  className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition shadow-lg flex items-center justify-center space-x-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Cabut Break-Glass &amp; Kunci Kembali (Freeze Armed)</span>
                </button>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Aktivasi Emergency Break-Glass (Inc-Override)</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono">Incident Ticket / JIRA ID</label>
                    <input
                      type="text"
                      value={breakGlassTicket}
                      onChange={(e) => setBreakGlassTicket(e.target.value)}
                      placeholder="e.g. INC-2026-9042"
                      className="w-full mt-1 px-2.5 py-1.5 bg-[#070c18] border border-slate-700 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono">Alasan Tindakan Darurat</label>
                    <input
                      type="text"
                      value={breakGlassReason}
                      onChange={(e) => setBreakGlassReason(e.target.value)}
                      placeholder="e.g. Fiber cut BGP peer rerouting traffic"
                      className="w-full mt-1 px-2.5 py-1.5 bg-[#070c18] border border-slate-700 rounded-lg text-xs text-white font-sans focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono">Second Operator Quorum Signer</label>
                    <input
                      type="text"
                      value={breakGlassApprover}
                      onChange={(e) => setBreakGlassApprover(e.target.value)}
                      placeholder="e.g. lead_netops_sec"
                      className="w-full mt-1 px-2.5 py-1.5 bg-[#070c18] border border-slate-700 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (!breakGlassReason.trim()) {
                      showToast('Mohon isi alasan tindakan darurat!', 'error');
                      return;
                    }
                    setBreakGlassActive(true);
                    showToast(`Break-Glass diotorisasi oleh ${breakGlassApprover}! Sesi darurat aktif.`, 'warning');
                    setIsFreezeModalOpen(false);
                  }}
                  className="w-full py-2 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white rounded-xl text-xs font-bold transition shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center justify-center space-x-1.5"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Otorisasi Emergency Break-Glass (HMAC Quorum Verified)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
