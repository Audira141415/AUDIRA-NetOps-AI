// Sidebar Navigation Component - Holographic Cyber NOC Cockpit

import React from 'react';
import {
  Home,
  Server,
  Network,
  Terminal,
  Activity,
  Bell,
  FileText,
  HardDrive,
  Bot,
  Zap,
  ShieldCheck,
  Settings,
  Database,
  Cpu,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { useNetOpsStore, NavigationTab } from '../../store/useNetOpsStore';

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

const NAV_ITEMS: Omit<NavItem, 'badge'>[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'devices', label: 'Devices', icon: Server },
  { id: 'topology', label: 'Topology', icon: Network },
  { id: 'terminal', label: 'Terminal', icon: Terminal },
  { id: 'monitoring', label: 'Monitoring', icon: Activity },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'configuration', label: 'Config', icon: FileText },
  { id: 'backups', label: 'Backups', icon: HardDrive },
  { id: 'ai-copilot', label: 'AI Copilot', icon: Bot },
  { id: 'automation', label: 'Automation', icon: Zap },
  { id: 'audit', label: 'Audit', icon: ShieldCheck },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { currentTab, setCurrentTab, setSelectedDevice, activeAlerts } = useNetOpsStore();

  return (
    <aside className="w-56 bg-[#0a0f1d]/90 backdrop-blur-2xl border-r border-cyan-500/20 flex flex-col justify-between select-none z-20 shadow-[4px_0_30px_rgba(6,182,212,0.1)]">
      {/* Navigation List */}
      <div className="py-3 px-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id || (item.id === 'devices' && currentTab === 'device-detail');
          const badge = item.id === 'alerts' && activeAlerts.length > 0 ? String(activeAlerts.length) : undefined;


          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'devices') {
                  setSelectedDevice(null);
                }
                setCurrentTab(item.id);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-blue-600 text-white font-bold shadow-[0_0_20px_rgba(37,99,235,0.6)] border border-cyan-400/50'
                  : 'text-slate-400 hover:text-white hover:bg-[#131d38]/70 hover:translate-x-0.5'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon
                  className={`w-4 h-4 transition ${
                    isActive
                      ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                      : 'text-slate-400 group-hover:text-cyan-300'
                  }`}
                />
                <span className="tracking-wide text-xs">{item.label}</span>
              </div>

              {badge && (
                <span
                  className="text-[9px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center bg-rose-500 text-white shadow-[0_0_8px_#f43f5e]"
                >
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Persistent Holographic System Status Card (Matching Reference Mockup) */}
      <div className="p-3 border-t border-cyan-500/20 bg-[#070b16]/90 font-mono text-[11px] space-y-2">
        <div className="flex items-center space-x-2 text-slate-200 font-bold tracking-wider text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
          <span>System Status</span>
        </div>

        <div className="space-y-1.5 text-[10px]">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center space-x-1.5">
              <Bot className="w-3 h-3 text-cyan-400" />
              <span>AI Service</span>
            </span>
            <span className="text-emerald-400 font-bold">Online</span>
          </div>

          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center space-x-1.5">
              <Database className="w-3 h-3 text-cyan-400" />
              <span>DB</span>
            </span>
            <span className="text-emerald-400 font-bold">Connected</span>
          </div>

          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center space-x-1.5">
              <Network className="w-3 h-3 text-cyan-400" />
              <span>RouterOS</span>
            </span>
            <span className="text-emerald-400 font-bold">Connected</span>
          </div>

          <div className="flex items-center justify-between text-slate-400 pt-0.5 border-t border-slate-800/80">
            <span className="flex items-center space-x-1.5">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>Uptime</span>
            </span>
            <span className="text-cyan-300 font-semibold">5d 12h 33m</span>
          </div>
        </div>

        <div className="pt-1.5 text-[9px] text-slate-500 text-center font-sans tracking-tight">
          AUDIRA NetOps AI v1.0 <br /> © 2025
        </div>
      </div>
    </aside>
  );
};
