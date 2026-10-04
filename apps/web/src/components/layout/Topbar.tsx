// Topbar Component

import React, { useEffect } from 'react';
import {
  Search,
  Bell,
  Cpu,
  Wifi,
  Bot,
  User as UserIcon,
  Command,
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
    <header className="h-14 bg-noc-panel border-b border-noc-border px-4 flex items-center justify-between select-none z-30">
      {/* Brand & Global Search */}
      <div className="flex items-center space-x-4 flex-1 max-w-2xl">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center font-mono font-bold text-white shadow glow-cyan">
            A
          </div>
          <div>
            <div className="font-semibold text-sm tracking-tight text-white flex items-center space-x-1.5">
              <span>AUDIRA</span>
              <span className="text-cyan-400 font-mono text-xs px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60">
                NETOPS AI
              </span>
            </div>
          </div>
        </div>

        {/* Global Search Button */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex-1 flex items-center justify-between px-3 py-1.5 bg-noc-surface/80 hover:bg-noc-surface border border-noc-border hover:border-noc-borderHover rounded-md text-xs text-slate-400 transition"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search devices, interfaces, commands, topology...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center space-x-1 px-1.5 py-0.5 rounded bg-noc-panel border border-noc-border text-[10px] font-mono text-slate-400">
            <Command className="w-3 h-3 mr-0.5" />
            <span>Shift+P</span>
          </kbd>
        </button>
      </div>

      {/* Right Controls: Device count, AI status, Connection status, Alerts, User */}
      <div className="flex items-center space-x-3">
        {/* Device Status Pill matching User ASCII: ● 42 DEVICES */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-noc-surface border border-noc-border text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-200 font-bold">42 DEVICES</span>
        </div>

        {/* AI Status Pill: 🤖 AI */}
        <button
          onClick={() => setAiDrawerOpen(!isAiDrawerOpen)}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded border text-xs font-mono font-medium transition ${
            isAiDrawerOpen
              ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow glow-cyan'
              : 'bg-noc-surface hover:bg-noc-surface/80 border-noc-border text-slate-300'
          }`}
        >
          <Bot className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold text-cyan-300">AI</span>
          <span className="text-[10px] text-slate-400 hidden lg:inline">(qwen2.5:7b)</span>
        </button>

        {/* Connection status */}
        <div className="hidden md:flex items-center space-x-2 px-2.5 py-1 rounded bg-noc-surface/60 border border-noc-border text-xs font-mono">
          <Wifi className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-400">1.8ms</span>
        </div>

        {/* AI Copilot Drawer Toggle */}
        <button
          onClick={() => setAiDrawerOpen(!isAiDrawerOpen)}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded border text-xs font-medium transition ${
            isAiDrawerOpen
              ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow glow-cyan'
              : 'bg-noc-surface hover:bg-noc-surface/80 border-noc-border text-slate-300'
          }`}
        >
          <Bot className="w-3.5 h-3.5 text-cyan-400" />
          <span>AI Copilot</span>
        </button>

        {/* Notifications / Alerts badge */}
        <button
          onClick={() => setCurrentTab('alerts')}
          className="relative p-1.5 rounded hover:bg-noc-surface text-slate-400 hover:text-slate-200 transition"
          title="Active Alerts"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
        </button>

        {/* User profile */}
        <div className="flex items-center space-x-2 pl-2 border-l border-noc-border">
          <div className="w-7 h-7 rounded bg-slate-800 border border-noc-border flex items-center justify-center text-slate-300">
            <UserIcon className="w-3.5 h-3.5" />
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-medium text-slate-200 leading-none">admin</div>
            <div className="text-[10px] text-cyan-400 font-mono leading-tight">SUPER_ADMIN</div>
          </div>
        </div>
      </div>
    </header>
  );
};
