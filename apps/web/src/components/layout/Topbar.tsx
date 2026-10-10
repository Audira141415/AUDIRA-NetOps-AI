// Topbar Component - Minimalist Dark Studio (Vercel / Apple Developer Style)
// Compact desktop height, crisp typography, clean micro-borders, semantic status indicators

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
  Server,
  Terminal,
  Palette,
  Check,
} from 'lucide-react';
import { useNetOpsStore, OperationMode, NocTheme, NOC_THEMES } from '../../store/useNetOpsStore';

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
    theme,
    setTheme,
  } = useNetOpsStore();

  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
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
    <header className="h-12 bg-[#09090b]/95 backdrop-blur-md border-b border-zinc-800 px-3.5 flex items-center justify-between select-none z-30 shrink-0">
      {/* Left: Brand Identity & Workspace URI */}
      <div className="flex items-center space-x-3.5">
        {/* Brand App Mark */}
        <a
          href="#/dashboard"
          className="flex items-center space-x-2.5 cursor-pointer group"
          onClick={(e) => {
            e.preventDefault();
            setCurrentTab('dashboard');
            window.location.hash = '#/dashboard';
          }}
        >
          <div className="w-6 h-6 rounded-md bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-white font-mono font-bold text-xs shadow-sm group-hover:bg-zinc-700 transition-colors">
            <span>A</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="font-semibold text-xs text-white tracking-tight">AUDIRA</span>
            <span className="font-medium text-xs text-zinc-400">NetOps</span>
            <span className="text-[10px] font-mono text-zinc-500 px-1 py-0.2 rounded bg-zinc-900 border border-zinc-800">
              v1.0
            </span>
          </div>
        </a>

        {/* Subtle Workspace URI Chip */}
        <div className="hidden xl:flex items-center space-x-1.5 px-2 py-0.5 bg-zinc-900/80 border border-zinc-800 rounded-md font-mono text-[11px] text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="max-w-[220px] truncate text-zinc-300 font-medium" title={canonicalUri}>
            {canonicalUri}
          </span>
          <button
            onClick={handleCopyUri}
            className="p-0.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="Salin URI"
          >
            {hasCopiedUri ? (
              <span className="text-[9px] text-emerald-400 font-bold">OK</span>
            ) : (
              <Share2 className="w-2.5 h-2.5" />
            )}
          </button>
        </div>
      </div>

      {/* Center: Command Palette Trigger (Spotlight / Linear Style) */}
      <div className="flex items-center justify-center flex-1 max-w-sm px-4">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-2.5 py-1 bg-zinc-900/90 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 transition-colors shadow-sm group"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
            <span className="text-zinc-400 group-hover:text-zinc-300 transition-colors text-[11px] truncate">
              Search devices, IPs, commands...
            </span>
          </div>
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700/60 text-[10px] font-mono text-zinc-400">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right Controls: Change Window, Mode, AI, Alerts, Profile */}
      <div className="flex items-center space-x-2 font-mono text-xs">
        {/* Change Freeze & Four-Eyes Governance Status Badge */}
        <button
          onClick={() => setIsFreezeModalOpen(true)}
          className={`flex items-center space-x-1.5 px-2 py-1 rounded-md border text-[11px] transition-colors ${
            breakGlassActive
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 font-semibold'
              : isPeakFreeze
              ? 'bg-rose-500/10 border-rose-500/25 text-rose-400 hover:bg-rose-500/15'
              : isMaintenance
              ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/15'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
          }`}
          title="Klik untuk membuka Kontrol Kebijakan Change Freeze & Four-Eyes Governance"
        >
          {breakGlassActive ? (
            <Unlock className="w-3 h-3 text-amber-400 shrink-0" />
          ) : isPeakFreeze ? (
            <Lock className="w-3 h-3 text-rose-400 shrink-0" />
          ) : (
            <Clock className="w-3 h-3 text-emerald-400 shrink-0" />
          )}
          <span className="hidden lg:inline text-[10.5px] font-medium tracking-tight">
            {breakGlassActive
              ? 'Break-Glass'
              : isPeakFreeze
              ? 'Freeze'
              : isMaintenance
              ? 'Maintenance'
              : 'Off-Peak'}
          </span>
          <span className="text-[10px] text-zinc-400">{wibTime.slice(0, 5)} WIB</span>
        </button>

        {/* System Operation Mode Selector */}
        <div className="relative">
          <button
            onClick={() => setIsModeDropdownOpen(!isModeDropdownOpen)}
            className="flex items-center space-x-1.5 px-2 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-[11px] transition-colors"
            title="Mode Operasi Sistem"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                operationMode === 'SUPERVISED'
                  ? 'bg-emerald-500'
                  : operationMode === 'AUTONOMOUS'
                  ? 'bg-blue-500'
                  : 'bg-amber-500'
              }`}
            />
            <span className="hidden md:inline font-medium text-[10.5px]">
              {operationMode === 'SUPERVISED'
                ? 'Supervised'
                : operationMode === 'AUTONOMOUS'
                ? 'Autonomous'
                : 'Safe Mode'}
            </span>
            <ChevronDown className="w-3 h-3 text-zinc-500" />
          </button>

          {isModeDropdownOpen && (
            <div className="absolute top-9 right-0 w-56 bg-[#121215] border border-zinc-800 rounded-lg shadow-xl p-1.5 z-50 text-xs font-sans space-y-0.5">
              <div className="text-[10px] font-mono text-zinc-500 px-2 py-1 uppercase tracking-wider">
                Operation Mode
              </div>
              <button
                onClick={() => {
                  setOperationMode('SUPERVISED');
                  setIsModeDropdownOpen(false);
                }}
                className={`w-full text-left px-2 py-1.5 rounded-md flex items-center space-x-2 transition-colors ${
                  operationMode === 'SUPERVISED' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <div>
                  <div className="font-medium text-[11px]">Supervised</div>
                  <div className="text-[10px] text-zinc-500">Perubahan butuh approval operator.</div>
                </div>
              </button>
              <button
                onClick={() => {
                  setOperationMode('AUTONOMOUS');
                  setIsModeDropdownOpen(false);
                }}
                className={`w-full text-left px-2 py-1.5 rounded-md flex items-center space-x-2 transition-colors ${
                  operationMode === 'AUTONOMOUS' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                <div>
                  <div className="font-medium text-[11px]">Autonomous</div>
                  <div className="text-[10px] text-zinc-500">Self-healing untuk risiko rendah.</div>
                </div>
              </button>
              <button
                onClick={() => {
                  setOperationMode('SAFE_MODE');
                  setIsModeDropdownOpen(false);
                }}
                className={`w-full text-left px-2 py-1.5 rounded-md flex items-center space-x-2 transition-colors ${
                  operationMode === 'SAFE_MODE' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <div>
                  <div className="font-medium text-[11px]">Safe Mode</div>
                  <div className="text-[10px] text-zinc-500">Simulasi tanpa menyentuh router.</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Registered Devices Counter */}
        <button
          onClick={() => (devices.length === 0 ? setAddDeviceModalOpen(true) : setCurrentTab('devices'))}
          className="hidden sm:flex items-center space-x-1.5 px-2 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 text-[11px] transition-colors"
          title={`${devices.length} registered devices`}
        >
          <Server className="w-3 h-3 text-zinc-400" />
          <span className="font-mono text-zinc-300 font-medium">{devices.length}</span>
        </button>

        {/* AI Copilot Drawer Trigger */}
        <button
          onClick={() => setAiDrawerOpen(!isAiDrawerOpen)}
          className={`flex items-center space-x-1.5 px-2 py-1 rounded-md border text-[11px] transition-colors ${
            isAiDrawerOpen
              ? 'bg-zinc-800 text-white border-zinc-700'
              : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
          }`}
          title="Toggle AI Network Copilot"
        >
          <Bot className="w-3.5 h-3.5 text-zinc-300" />
          <span className="hidden md:inline font-medium text-[10.5px]">Copilot</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        </button>

        {/* Notification Alerts Bell */}
        <button
          onClick={() => setCurrentTab('alerts')}
          className="relative p-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          title={`${activeAlerts.length} Active Alerts`}
        >
          <Bell className="w-3.5 h-3.5" />
          {activeAlerts.length > 0 && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-white font-bold text-[8.5px] flex items-center justify-center">
              {activeAlerts.length}
            </span>
          )}
        </button>

        {/* NOC Theme Switcher */}
        <div className="relative">
          <button
            onClick={() => {
              setIsThemeDropdownOpen(!isThemeDropdownOpen);
              setIsUserDropdownOpen(false);
              setIsModeDropdownOpen(false);
            }}
            className="flex items-center space-x-1.5 px-2 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-[11px] transition-colors"
            title={`Tema NOC: ${NOC_THEMES[theme]?.name || theme}`}
          >
            <Palette className="w-3.5 h-3.5 text-zinc-400" />
            <span
              className="w-2 h-2 rounded-full ring-1 ring-white/20"
              style={{ backgroundColor: NOC_THEMES[theme]?.previewDot || '#10b981' }}
            />
            <span className="hidden xl:inline text-[10.5px] font-medium text-zinc-300">
              {NOC_THEMES[theme]?.name.split(' ')[0]}
            </span>
            <ChevronDown className="w-2.5 h-2.5 text-zinc-500" />
          </button>

          {isThemeDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[#121215] border border-zinc-800 rounded-xl shadow-2xl p-2 z-50 text-xs font-sans space-y-1 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2 py-1.5 border-b border-zinc-800/80 flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center space-x-1.5">
                  <Palette className="w-3 h-3 text-zinc-400" />
                  <span>Preset Tema NOC</span>
                </span>
                <span className="text-[9px] font-mono px-1 rounded bg-zinc-800 text-zinc-400">4 Presets</span>
              </div>

              <div className="space-y-1 pt-1">
                {(Object.keys(NOC_THEMES) as NocTheme[]).map((themeKey) => {
                  const item = NOC_THEMES[themeKey];
                  const isSelected = theme === themeKey;
                  return (
                    <button
                      key={themeKey}
                      onClick={() => {
                        setTheme(themeKey);
                        setIsThemeDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-all ${
                        isSelected
                          ? 'bg-zinc-800/90 text-white border border-zinc-700/80 shadow-sm'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/80 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <div
                          className="w-5 h-5 rounded-md border flex items-center justify-center shrink-0 shadow-inner"
                          style={{
                            backgroundColor: item.previewBg,
                            borderColor: item.previewBorder,
                          }}
                        >
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: item.previewDot }}
                          />
                        </div>
                        <div>
                          <div className={`text-[11px] font-semibold leading-tight ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                            {item.name}
                          </div>
                          <div className="text-[9.5px] text-zinc-500 font-sans leading-tight mt-0.5">
                            {item.tagline}
                          </div>
                        </div>
                      </div>

                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative pl-1 border-l border-zinc-800">
          <button
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            className="flex items-center space-x-1.5 p-1 rounded-md hover:bg-zinc-800/80 transition-colors"
            title="User Profile"
          >
            <div className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 text-[10px] font-bold">
              <UserIcon className="w-3 h-3 text-zinc-400" />
            </div>
            <span className="hidden xl:inline text-[11px] font-sans font-medium text-zinc-300">
              {currentUser?.name || 'admin'}
            </span>
            <ChevronDown className="w-2.5 h-2.5 text-zinc-500 hidden xl:block" />
          </button>

          {isUserDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#121215] border border-zinc-800 rounded-lg shadow-xl p-2 z-50 text-xs font-sans space-y-1">
              <div className="px-2 py-1.5 border-b border-zinc-800">
                <div className="text-white font-medium text-[11px]">{currentUser?.name || 'Operator'}</div>
                <div className="text-[10px] text-zinc-500 font-mono">{currentUser?.email || 'admin@noc.audira.net'}</div>
                <div className="mt-1 text-[9.5px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 border border-zinc-700 text-zinc-400 inline-block">
                  {currentUser?.role || 'Super Admin'}
                </div>
              </div>

              <div className="px-2 py-1 text-[10.5px] font-mono text-zinc-400 space-y-0.5">
                <div className="flex justify-between">
                  <span>IP:</span>
                  <span className="text-zinc-200">192.168.10.50</span>
                </div>
                <div className="flex justify-between">
                  <span>TLS:</span>
                  <span className="text-emerald-400">1.3 Active</span>
                </div>
              </div>

              <div className="pt-1 border-t border-zinc-800">
                <button
                  onClick={() => {
                    setIsUserDropdownOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-2 py-1.5 rounded text-rose-400 hover:bg-rose-500/10 text-[11px] font-medium transition-colors"
                >
                  Keluar / Switch Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Change Freeze & Four-Eyes Governance Modal (Studio Clean Style) */}
      {isFreezeModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121215] border border-zinc-800 rounded-xl max-w-lg w-full p-5 shadow-2xl space-y-4 font-sans text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div
                  className={`p-2 rounded-lg border ${
                    breakGlassActive
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      : isPeakFreeze
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  }`}
                >
                  {breakGlassActive ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white tracking-tight">
                    Change Freeze &amp; Four-Eyes Governance
                  </h3>
                  <div className="text-[10px] text-zinc-500 font-mono">
                    WIB Local Time: {wibTime}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsFreezeModalOpen(false)}
                className="text-zinc-500 hover:text-white p-1 rounded-md hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Policy Status Overview */}
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Jendela Aktif:</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                      isPeakFreeze
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/25'
                        : isMaintenance
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                        : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                    }`}
                  >
                    {isPeakFreeze
                      ? 'PEAK FREEZE (08:00–22:00 WIB)'
                      : isMaintenance
                      ? 'MAINTENANCE (01:00–05:00 WIB)'
                      : 'OFF-PEAK SUPERVISED'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Akses Mutasi:</span>
                  <span className="text-white font-medium">
                    {breakGlassActive
                      ? 'OVERRIDE GRANTED (Audit Logged)'
                      : isPeakFreeze
                      ? 'READ-ONLY (Changes Blocked)'
                      : 'ALLOWED (Supervised)'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Four-Eyes Quorum:</span>
                  <span className="text-emerald-400 font-medium">ENFORCED (Dual-Signoff)</span>
                </div>
              </div>

              <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                Sesuai SOP <code className="text-zinc-300 font-mono">change-freeze-window-policy.md</code>, perubahan konfigurasi pada jam kerja sibuk memerlukan mitigasi darurat bersertifikat (Break-Glass) atau otorisasi dua operator.
              </p>
            </div>

            {/* Break Glass Controls */}
            {breakGlassActive ? (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/25 space-y-2.5">
                <div className="flex items-center space-x-1.5 text-amber-400 text-xs font-semibold">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>EMERGENCY BREAK-GLASS SEDANG AKTIF</span>
                </div>
                <div className="text-[11px] text-zinc-300 font-mono space-y-0.5">
                  <div>Ticket: <span className="text-white font-medium">{breakGlassTicket}</span></div>
                  <div>Alasan: <span className="text-zinc-200">{breakGlassReason || 'Mitigasi insiden'}</span></div>
                  <div>Approver 2: <span className="text-zinc-300">{breakGlassApprover}</span></div>
                </div>
                <button
                  onClick={() => {
                    setBreakGlassActive(false);
                    setBreakGlassReason('');
                    showToast('Emergency Break-Glass dicabut. Kebijakan Freeze kembali aktif.', 'info');
                  }}
                  className="w-full py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-md text-xs font-medium transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Cabut Break-Glass &amp; Kunci Kembali</span>
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2.5">
                <div className="text-xs font-medium text-white flex items-center space-x-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Aktivasi Emergency Break-Glass</span>
                </div>
                <div className="space-y-2 font-sans">
                  <div>
                    <label className="text-[10px] text-zinc-400 font-mono">Incident Ticket / JIRA ID</label>
                    <input
                      type="text"
                      value={breakGlassTicket}
                      onChange={(e) => setBreakGlassTicket(e.target.value)}
                      placeholder="INC-2026-9042"
                      className="w-full mt-1 px-2.5 py-1.5 bg-[#09090b] border border-zinc-700 rounded-md text-xs text-white font-mono focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 font-mono">Alasan Tindakan Darurat</label>
                    <input
                      type="text"
                      value={breakGlassReason}
                      onChange={(e) => setBreakGlassReason(e.target.value)}
                      placeholder="e.g. Fiber cut BGP peer rerouting traffic"
                      className="w-full mt-1 px-2.5 py-1.5 bg-[#09090b] border border-zinc-700 rounded-md text-xs text-white focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 font-mono">Second Operator Signer</label>
                    <input
                      type="text"
                      value={breakGlassApprover}
                      onChange={(e) => setBreakGlassApprover(e.target.value)}
                      placeholder="lead_netops_sec"
                      className="w-full mt-1 px-2.5 py-1.5 bg-[#09090b] border border-zinc-700 rounded-md text-xs text-white font-mono focus:outline-none focus:border-zinc-500"
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
                  className="w-full py-1.5 bg-zinc-100 hover:bg-white text-zinc-950 font-medium rounded-md text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <Unlock className="w-3.5 h-3.5 text-zinc-950" />
                  <span>Otorisasi Emergency Break-Glass</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
