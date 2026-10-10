// Sidebar Navigation Component - Minimalist Dark Studio (Vercel / Apple Developer Style)
// Clean typography, high information density, 1px micro-borders, zero neon glow

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
  Cpu,
} from 'lucide-react';
import { useNetOpsStore, NavigationTab } from '../../store/useNetOpsStore';

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeVariant?: 'neutral' | 'accent' | 'warning' | 'danger';
}

interface NavGroup {
  id: string;
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    id: 'operations',
    title: 'Operations',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'monitoring', label: 'Telemetry', icon: Activity },
      { id: 'synthetic-sla', label: 'Synthetic SLA', icon: Radio, badge: 'TWAMP', badgeVariant: 'accent' },
      { id: 'topology', label: 'Topology', icon: Network },
      { id: 'alerts', label: 'Alerts', icon: Bell },
    ],
  },
  {
    id: 'infrastructure',
    title: 'Network & Devices',
    items: [
      { id: 'devices', label: 'Devices', icon: Server },
      { id: 'terminal', label: 'Terminal / Serial', icon: Terminal, badge: 'COM', badgeVariant: 'neutral' },
      { id: 'ipam', label: 'Visual IPAM', icon: Binary },
      { id: 'config-drift', label: 'Golden Drift', icon: GitBranch, badge: 'GitOps', badgeVariant: 'warning' },
      { id: 'configuration', label: 'Config Studio', icon: FileText },
      { id: 'backups', label: 'Backups', icon: HardDrive },
    ],
  },
  {
    id: 'security',
    title: 'Security & Posture',
    items: [
      { id: 'packet-sniffer', label: 'Packet Sniffer', icon: Radio },
      { id: 'compliance', label: 'Compliance & CVE', icon: ShieldAlert },
      { id: 'audit', label: 'Audit Logs', icon: ShieldCheck },
    ],
  },
  {
    id: 'intelligence',
    title: 'Automation & AI',
    items: [
      { id: 'ai-copilot', label: 'AI Copilot', icon: Bot },
      { id: 'mcp-hub', label: 'AI & MCP Hub', icon: Cpu, badge: '51 Tools', badgeVariant: 'accent' },
      { id: 'automation', label: 'Workflows', icon: Zap },
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
  'mcp-hub': '#/mcp-hub',
  automation: '#/automation',
  audit: '#/audit',
  settings: '#/settings',
};

export const Sidebar: React.FC = () => {
  const { currentTab, setCurrentTab, setSelectedDevice, activeAlerts } = useNetOpsStore();

  const getBadgeClass = (variant?: 'neutral' | 'accent' | 'warning' | 'danger') => {
    switch (variant) {
      case 'accent':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'warning':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'danger':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      case 'neutral':
      default:
        return 'bg-zinc-800 text-zinc-400 border border-zinc-700/60';
    }
  };

  return (
    <aside className="w-56 bg-[#09090b] border-r border-zinc-800 flex flex-col justify-between select-none z-20 shrink-0">
      {/* Scrollable Navigation Groups */}
      <div className="py-2.5 px-2 space-y-3.5 overflow-y-auto max-h-[calc(100vh-165px)]">
        {NAV_GROUPS.map((group, groupIdx) => (
          <div key={group.id} className="space-y-0.5">
            {/* Functional Category Header */}
            <div
              className={`px-2.5 pb-1 flex items-center justify-between text-[10px] font-medium tracking-wider text-zinc-500 uppercase ${
                groupIdx > 0 ? 'pt-2.5 border-t border-zinc-800/60' : 'pt-0.5'
              }`}
            >
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
                const badgeVariant =
                  item.id === 'alerts' && activeAlerts.length > 0
                    ? 'danger'
                    : item.badgeVariant;
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
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors group ${
                      isActive
                        ? 'bg-zinc-800 text-white border border-zinc-700/60 shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon
                        className={`w-3.5 h-3.5 transition-colors ${
                          isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'
                        }`}
                      />
                      <span className="tracking-tight text-xs">{item.label}</span>
                    </div>

                    {badge && (
                      <span
                        className={`text-[9.5px] font-mono font-medium px-1.5 py-0.2 rounded ${getBadgeClass(
                          badgeVariant
                        )}`}
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

      {/* Studio Desktop System Status Card */}
      <div className="p-2.5 border-t border-zinc-800 bg-[#0d0d10] font-mono text-[11px] space-y-2 shrink-0">
        <div className="flex items-center justify-between text-zinc-300 text-[10.5px] font-sans font-medium">
          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Platform Status</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono font-semibold">Ready</span>
        </div>

        <div className="space-y-1 text-[10px] text-zinc-400">
          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <span className="w-1 h-1 rounded-full bg-zinc-500" />
              <span>AI Gateway</span>
            </span>
            <span className="text-zinc-300 font-mono">audira-combo</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <Database className="w-3 h-3 text-zinc-500" />
              <span>Database</span>
            </span>
            <span className="text-zinc-300 font-mono">PostgreSQL</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <Network className="w-3 h-3 text-zinc-500" />
              <span>RouterOS</span>
            </span>
            <span className="text-zinc-300 font-mono">REST / SSL</span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-zinc-800/80">
            <span className="flex items-center space-x-1.5">
              <Clock className="w-3 h-3 text-zinc-500" />
              <span>Uptime</span>
            </span>
            <span className="text-zinc-300 font-mono">5d 12h 33m</span>
          </div>
        </div>

        <button
          onClick={() => setCurrentTab('landing')}
          className="w-full pt-1 text-[9.5px] text-zinc-500 hover:text-zinc-300 text-center font-sans tracking-tight transition-colors cursor-pointer"
          title="Buka Landing Page & Info Lisensi Komersial AUDIRA"
        >
          AUDIRA NetOps AI v1.0.0
        </button>
      </div>
    </aside>
  );
};
