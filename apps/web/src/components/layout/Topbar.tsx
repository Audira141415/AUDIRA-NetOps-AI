// Topbar Component - Holographic Luxury NOC Cockpit Theme

import React, { useEffect } from 'react';
import {
  Search,
  Bell,
  Bot,
  User as UserIcon,
  Moon,
  Share2,
  Globe,
} from 'lucide-react';
import { useNetOpsStore } from '../../store/useNetOpsStore';

export const Topbar: React.FC = () => {
  const {
    setCommandPaletteOpen,
    isAiDrawerOpen,
    setAiDrawerOpen,
    activeAlerts,
    setCurrentTab,
    devices,
    setAddDeviceModalOpen,
  } = useNetOpsStore();

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
      <div className="flex items-center space-x-6 flex-1 max-w-2xl">
        {/* Brand Logo & Subtitle */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-[0_0_18px_rgba(56,189,248,0.5)] border border-cyan-300/40">
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
        </div>

        {/* Global Search Button */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex-1 max-w-md flex items-center justify-between px-3.5 py-1.5 bg-[#131d38]/80 hover:bg-[#1a2647] border border-cyan-500/25 hover:border-cyan-400/50 rounded-lg text-xs text-slate-300 transition shadow-[0_0_15px_rgba(6,182,212,0.1)] group"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-cyan-400 group-hover:text-cyan-300 transition" />
            <span className="text-slate-400 group-hover:text-slate-200 transition text-[11px]">
              Search devices, IP, or type a command...
            </span>
          </div>
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded bg-[#0b1020] border border-cyan-500/30 text-[10px] font-mono text-cyan-300 shadow-inner">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right Controls: Real Device Count, AI Online, Alerts, Dark Mode, Profile */}
      <div className="flex items-center space-x-3 font-mono">
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

        {/* User Profile: avatar + admin + Network Admin */}
        <div className="flex items-center space-x-2.5 pl-2 border-l border-cyan-500/20">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 border border-cyan-300/40 flex items-center justify-center text-white text-xs font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]">
            <UserIcon className="w-4 h-4 text-white" />
          </div>
          <div className="hidden xl:block text-left text-xs font-sans">
            <div className="text-white font-bold leading-none">admin</div>
            <div className="text-[10px] text-slate-400 font-normal mt-0.5">Network Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
};
