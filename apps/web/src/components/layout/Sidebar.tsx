// Sidebar Navigation Component - Holographic Luxury NOC Theme

import React from 'react';
import {
  LayoutDashboard,
  Server,
  Network,
  Terminal,
  Activity,
  AlertTriangle,
  FileCode2,
  HardDriveDownload,
  Bot,
  Zap,
  ShieldCheck,
  Settings,
} from 'lucide-react';
import { useNetOpsStore, NavigationTab } from '../../store/useNetOpsStore';

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'devices', label: 'Devices', icon: Server, badge: '7' },
  { id: 'topology', label: 'Topology', icon: Network },
  { id: 'terminal', label: 'Terminal', icon: Terminal, badge: 'PuTTY' },
  { id: 'monitoring', label: 'Monitoring', icon: Activity },
  { id: 'alerts', label: 'Alerts', icon: AlertTriangle, badge: '2', badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.3)]' },
  { id: 'configuration', label: 'Configuration', icon: FileCode2 },
  { id: 'backups', label: 'Backups', icon: HardDriveDownload },
  { id: 'ai-copilot', label: 'AI Copilot', icon: Bot, badge: 'AI', badgeColor: 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40 shadow-[0_0_8px_rgba(236,72,153,0.3)]' },
  { id: 'automation', label: 'Automation', icon: Zap },
  { id: 'audit', label: 'Audit Logs', icon: ShieldCheck },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { currentTab, setCurrentTab, setSelectedDevice } = useNetOpsStore();

  return (
    <aside className="w-56 bg-[#140A2E]/70 backdrop-blur-xl border-r border-purple-500/20 flex flex-col justify-between select-none z-20 shadow-[4px_0_25px_rgba(112,26,117,0.15)]">
      {/* Navigation List */}
      <div className="py-3 px-2 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-mono font-bold uppercase tracking-wider text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text">
          NOC Operations
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id || (item.id === 'devices' && currentTab === 'device-detail');

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'devices') {
                  setSelectedDevice(null);
                }
                setCurrentTab(item.id);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-fuchsia-600/25 via-purple-600/25 to-teal-400/10 text-white border-l-2 border-fuchsia-400 font-bold shadow-[0_0_15px_rgba(236,72,153,0.25)]'
                  : 'text-purple-300/70 hover:text-white hover:bg-[#1E1045]/60 hover:translate-x-0.5'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon className={`w-4 h-4 transition ${isActive ? 'text-fuchsia-400 drop-shadow-[0_0_6px_rgba(236,72,153,0.8)]' : 'text-purple-400/80'}`} />
                <span className="tracking-wide">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    item.badgeColor || 'bg-[#1E1045] text-purple-300 border border-purple-500/30'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer System Status with Holographic Pulse */}
      <div className="p-3 border-t border-purple-500/20 bg-[#0E0725]/60">
        <div className="text-[10px] text-purple-400/70 font-mono mb-1">AUD-NETOPS-NODE-01</div>
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-purple-300/80">Core Telemetry:</span>
          <span className="text-teal-300 font-bold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_8px_#2dd4bf] animate-pulse" />
            <span>ONLINE</span>
          </span>
        </div>
      </div>
    </aside>
  );
};
