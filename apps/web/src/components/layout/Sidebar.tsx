// Sidebar Navigation Component - Holographic Cyber NOC Cockpit
// Grouped by Functional Domain (Operations, Infrastructure, Security, AI & Automation, System)

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
  Clock,
  Radio,
  Binary,
  ShieldAlert,
  GitBranch,
} from 'lucide-react';
import { useNetOpsStore, NavigationTab } from '../../store/useNetOpsStore';

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

interface NavGroup {
  id: string;
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    id: 'operations',
    title: 'Operations & Telemetry',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'monitoring', label: 'Monitoring', icon: Activity },
      { id: 'synthetic-sla', label: 'Synthetic SLA', icon: Radio, badge: 'TWAMP', badgeColor: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' },
      { id: 'topology', label: 'Topology', icon: Network },
      { id: 'alerts', label: 'Alerts', icon: Bell },
    ],
  },
  {
    id: 'infrastructure',
    title: 'Network & Devices',
    items: [
      { id: 'devices', label: 'Devices', icon: Server },
      { id: 'terminal', label: 'Terminal / Serial', icon: Terminal, badge: 'COM', badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30' },
      { id: 'ipam', label: 'Visual IPAM', icon: Binary },
      { id: 'config-drift', label: 'Golden Drift', icon: GitBranch, badge: 'GitOps', badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30' },
      { id: 'configuration', label: 'Config', icon: FileText },
      { id: 'backups', label: 'Backups', icon: HardDrive },
    ],
  },
  {
    id: 'security',
    title: 'Security & Inspection',
    items: [
      { id: 'packet-sniffer', label: 'Packet Sniffer', icon: Radio },
      { id: 'compliance', label: 'Compliance & CVE', icon: ShieldAlert },
      { id: 'audit', label: 'Audit Logs', icon: ShieldCheck },
    ],
  },
  {
    id: 'intelligence',
    title: 'AI & Automation',
    items: [
      { id: 'ai-copilot', label: 'AI Copilot', icon: Bot },
      { id: 'automation', label: 'Automation', icon: Zap },
    ],
  },
  {
    id: 'system',
    title: 'System',
    items: [
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
  },
];

const TAB_HASH: Record<NavigationTab, string> = {
  landing: '#/landing',
  dashboard: '#/dashboard',
  devices: '#/devices',
  'device-detail': '#/devices',
  topology: '#/topology',
  terminal: '#/terminal',
  monitoring: '#/monitoring',
  'synthetic-sla': '#/sla',
  'packet-sniffer': '#/packet-sniffer',
  ipam: '#/ipam',
  'config-drift': '#/drift',
  compliance: '#/compliance',
  alerts: '#/alerts',
  configuration: '#/config',
  backups: '#/backups',
  'ai-copilot': '#/copilot',
  automation: '#/automation',
  audit: '#/audit',
  settings: '#/settings',
};

export const Sidebar: React.FC = () => {
  const { currentTab, setCurrentTab, setSelectedDevice, activeAlerts } = useNetOpsStore();

  return (
    <aside className="w-56 bg-[#0a0f1d]/95 backdrop-blur-2xl border-r border-cyan-500/20 flex flex-col justify-between select-none z-20 shadow-[4px_0_30px_rgba(6,182,212,0.1)]">
      {/* Scrollable Navigation Groups */}
      <div className="py-2 px-2 space-y-3 overflow-y-auto max-h-[calc(100vh-175px)]">
        {NAV_GROUPS.map((group, groupIdx) => (
          <div key={group.id} className="space-y-0.5">
            {/* Functional Category Header */}
            <div className={`px-2.5 pb-1 flex items-center justify-between text-[9px] font-mono font-bold tracking-wider text-slate-500 uppercase ${groupIdx > 0 ? 'pt-2 border-t border-slate-800/60' : 'pt-0.5'}`}>
              <span>{group.title}</span>
            </div>

            {/* Group Navigation Items */}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  currentTab === item.id || (item.id === 'devices' && currentTab === 'device-detail');
                const badge =
                  item.id === 'alerts' && activeAlerts.length > 0
                    ? String(activeAlerts.length)
                    : item.badge;
                const itemHref = TAB_HASH[item.id] || '#/dashboard';

                return (
                  <a
                    key={item.id}
                    href={itemHref}
                    onClick={(e) => {
                      e.preventDefault();
                      if (item.id === 'devices') {
                        setSelectedDevice(null);
                      }
                      setCurrentTab(item.id);
                      window.location.hash = itemHref;
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 group ${
                      isActive
                        ? 'bg-blue-600 text-white font-bold shadow-[0_0_18px_rgba(37,99,235,0.6)] border border-cyan-400/50'
                        : 'text-slate-400 hover:text-white hover:bg-[#131d38]/70 hover:translate-x-0.5'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon
                        className={`w-3.5 h-3.5 transition ${
                          isActive
                            ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                            : 'text-slate-400 group-hover:text-cyan-300'
                        }`}
                      />
                      <span className="tracking-wide text-xs">{item.label}</span>
                    </div>

                    {badge && (
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full flex items-center justify-center ${
                          item.badgeColor || 'bg-rose-500 text-white shadow-[0_0_8px_#f43f5e]'
                        }`}
                      >
                        {badge}
                      </span>
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Persistent Holographic System Status Card */}
      <div className="p-2.5 border-t border-cyan-500/20 bg-[#070b16]/95 font-mono text-[11px] space-y-1.5 shrink-0">
        <div className="flex items-center space-x-2 text-slate-200 font-bold tracking-wider text-[10.5px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
          <span>System Status</span>
        </div>

        <div className="space-y-1 text-[10px]">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>AI Service</span>
            </span>
            <span className="text-emerald-400 font-bold">Online</span>
          </div>

          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center space-x-1.5">
              <Database className="w-3 h-3 text-cyan-400" />
              <span>Database</span>
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

        <button
          onClick={() => setCurrentTab('landing')}
          className="w-full pt-1 text-[9.5px] text-cyan-400/80 hover:text-cyan-300 text-center font-sans tracking-tight hover:underline cursor-pointer"
          title="Buka Landing Page & Info Lisensi Komersial AUDIRA"
        >
          AUDIRA NetOps AI v1.0 <br />
          <span className="text-[8.5px] text-slate-500">© 2025-2026 Agus Dwi R (Proprietary)</span>
        </button>
      </div>
    </aside>
  );
};
