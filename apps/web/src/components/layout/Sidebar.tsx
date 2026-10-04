// Sidebar Navigation Component

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
  { id: 'alerts', label: 'Alerts', icon: AlertTriangle, badge: '2', badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' },
  { id: 'configuration', label: 'Configuration', icon: FileCode2 },
  { id: 'backups', label: 'Backups', icon: HardDriveDownload },
  { id: 'ai-copilot', label: 'AI Copilot', icon: Bot, badge: 'AI', badgeColor: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' },
  { id: 'automation', label: 'Automation', icon: Zap },
  { id: 'audit', label: 'Audit Logs', icon: ShieldCheck },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { currentTab, setCurrentTab, setSelectedDevice } = useNetOpsStore();

  return (
    <aside className="w-56 bg-noc-panel border-r border-noc-border flex flex-col justify-between select-none z-20">
      {/* Navigation List */}
      <div className="py-3 px-2 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500">
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
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-noc-surface/60'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    item.badgeColor || 'bg-noc-surface text-slate-400 border border-noc-border'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer System Status */}
      <div className="p-3 border-t border-noc-border bg-noc-bg/50">
        <div className="text-[10px] text-slate-500 font-mono mb-1">AUD-NETOPS-NODE-01</div>
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">Core Telemetry:</span>
          <span className="text-emerald-400 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>ONLINE</span>
          </span>
        </div>
      </div>
    </aside>
  );
};
