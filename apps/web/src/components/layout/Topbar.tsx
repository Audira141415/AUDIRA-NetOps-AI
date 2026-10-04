// Topbar Component - Holographic Luxury NOC Theme

import React, { useEffect } from 'react';
import {
  Search,
  Bell,
  Cpu,
  Wifi,
  Bot,
  User as UserIcon,
  Command,
  Sparkles,
} from 'lucide-react';
import { useNetOpsStore } from '../../store/useNetOpsStore';

export const Topbar: React.FC = () => {
  const {
    setCommandPaletteOpen,
    isAiDrawerOpen,
    setAiDrawerOpen,
    activeAlerts,
    setCurrentTab,
  } = useNetOpsStore();

  // Keyboard shortcut Ctrl+Shift+P or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'p') || (e.ctrlKey && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setCommandPaletteOpen]);

  return (
    <header className="h-14 bg-[#140A2E]/80 backdrop-blur-xl border-b border-purple-500/20 px-4 flex items-center justify-between select-none z-30 shadow-[0_4px_25px_rgba(112,26,117,0.2)]">
      {/* Brand & Global Search */}
      <div className="flex items-center space-x-4 flex-1 max-w-2xl">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-fuchsia-600 via-purple-600 to-teal-400 flex items-center justify-center font-mono font-bold text-white shadow-[0_0_15px_rgba(236,72,153,0.5)] border border-white/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight flex items-center space-x-2">
              <span className="text-holo-gradient text-base font-extrabold tracking-wider">AUDIRA</span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-900/60 to-fuchsia-900/60 border border-fuchsia-500/40 text-fuchsia-200 shadow-[0_0_10px_rgba(236,72,153,0.3)]">
                NETOPS AI
              </span>
            </div>
          </div>
        </div>

        {/* Global Search Button with Holographic Sheen */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex-1 flex items-center justify-between px-3.5 py-1.5 bg-[#1E1045]/70 hover:bg-[#28155A]/80 border border-purple-500/30 hover:border-fuchsia-400/50 rounded-lg text-xs text-purple-200 transition shadow-[0_0_15px_rgba(168,85,247,0.15)] group"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-purple-400 group-hover:text-fuchsia-300 transition" />
            <span className="text-purple-300/80 group-hover:text-purple-100 transition">Search devices, interfaces, commands, topology...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center space-x-1 px-1.5 py-0.5 rounded bg-[#140A2E] border border-purple-500/40 text-[10px] font-mono text-purple-300 shadow-inner">
            <Command className="w-3 h-3 mr-0.5" />
            <span>Shift+P</span>
          </kbd>
        </button>
      </div>

      {/* Right Controls: Device count, AI status, Connection status, Alerts, User */}
      <div className="flex items-center space-x-3">
        {/* Device Status Pill matching User ASCII: ● 42 DEVICES */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#1E1045]/70 border border-purple-500/30 text-xs font-mono shadow-[0_0_12px_rgba(52,211,153,0.15)]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
          <span className="text-purple-100 font-bold tracking-wide">42 DEVICES</span>
        </div>

        {/* AI Status Pill: 🤖 AI */}
        <button
          onClick={() => setAiDrawerOpen(!isAiDrawerOpen)}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-mono font-medium transition ${
            isAiDrawerOpen
              ? 'bg-gradient-to-r from-fuchsia-600/30 to-purple-600/30 border-fuchsia-400 text-fuchsia-200 shadow-[0_0_20px_rgba(236,72,153,0.4)]'
              : 'bg-[#1E1045]/70 hover:bg-[#28155A] border-purple-500/30 hover:border-fuchsia-400/50 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.2)]'
          }`}
        >
          <Bot className="w-3.5 h-3.5 text-fuchsia-400 animate-bounce" />
          <span className="font-bold text-transparent bg-gradient-to-r from-fuchsia-300 to-teal-300 bg-clip-text">AI</span>
          <span className="text-[10px] text-purple-300/80 hidden lg:inline">(qwen2.5:7b)</span>
        </button>

        {/* Connection status */}
        <div className="hidden md:flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-[#1E1045]/60 border border-purple-500/30 text-xs font-mono">
          <Wifi className="w-3.5 h-3.5 text-teal-400" />
          <span className="text-teal-300 font-semibold">1.8ms</span>
        </div>

        {/* Alerts Bell */}
        <button
          onClick={() => setCurrentTab('alerts')}
          className="relative p-2 rounded-lg bg-[#1E1045]/70 hover:bg-[#28155A] border border-purple-500/30 text-purple-300 hover:text-white transition"
        >
          <Bell className="w-3.5 h-3.5" />
          {activeAlerts.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center shadow-[0_0_8px_#f43f5e] animate-pulse">
              {activeAlerts.length}
            </span>
          )}
        </button>

        {/* User profile */}
        <div className="flex items-center space-x-2 pl-2 border-l border-purple-500/20">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-700 to-fuchsia-600 border border-purple-300/30 flex items-center justify-center text-white text-xs font-bold shadow-md">
            AD
          </div>
          <div className="hidden xl:block text-left text-xs font-mono">
            <div className="text-purple-100 font-bold leading-none">admin</div>
            <div className="text-[10px] text-purple-400 font-normal mt-0.5">NOC Lead</div>
          </div>
        </div>
      </div>
    </header>
  );
};
