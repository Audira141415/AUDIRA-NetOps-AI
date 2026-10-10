import React, { useEffect } from 'react';
import { Topbar } from './components/layout/Topbar';
import { Sidebar } from './components/layout/Sidebar';
import { CommandPalette } from './components/command-palette/CommandPalette';
import { NocDashboard } from './components/dashboard/NocDashboard';
import { DeviceList } from './components/devices/DeviceList';
import { WinboxDetail } from './components/devices/WinboxDetail';
import { PuTTYTerminal } from './components/terminal/PuTTYTerminal';
import { NetworkTopology } from './components/topology/NetworkTopology';
import { ConfigManager } from './components/config/ConfigManager';
import { BackupManager } from './components/backups/BackupManager';
import { AuditLogViewer } from './components/audit/AuditLogViewer';
import { AlertsView } from './components/alerts/AlertsView';
import { AutomationView } from './components/automation/AutomationView';
import { SettingsView } from './components/settings/SettingsView';
import { AICopilotDrawer } from './components/ai/AICopilotDrawer';
import { LandingPage } from './components/landing/LandingPage';
import { MrtgMonitoringView } from './components/monitoring/MrtgMonitoringView';
import { PacketSnifferView } from './components/packet-sniffer/PacketSnifferView';
import { IpamView } from './components/ipam/IpamView';
import { ComplianceView } from './components/compliance/ComplianceView';
import { LoginView } from './components/auth/LoginView';
import { SlaSyntheticView } from './components/monitoring/SlaSyntheticView';
import { ConfigDriftView } from './components/config/ConfigDriftView';
import { McpAgentHubView } from './components/mcp/McpAgentHubView';
import { useNetOpsStore, NavigationTab } from './store/useNetOpsStore';

const TAB_CONFIG: Record<NavigationTab, { hash: string; title: string }> = {
  landing: { hash: '#/landing', title: 'AUDIRA NetOps AI — Official Enterprise License' },
  dashboard: { hash: '#/dashboard', title: 'Dashboard NOC — AUDIRA NetOps AI' },
  devices: { hash: '#/devices', title: 'Device Inventory & WinBox — AUDIRA NetOps AI' },
  'device-detail': { hash: '#/devices/detail', title: 'WinBox Management — AUDIRA NetOps AI' },
  topology: { hash: '#/topology', title: 'Network Topology Graph — AUDIRA NetOps AI' },
  terminal: { hash: '#/terminal', title: 'PuTTY Clustered Terminal — AUDIRA NetOps AI' },
  monitoring: { hash: '#/monitoring', title: 'MRTG & Telemetry — AUDIRA NetOps AI' },
  'synthetic-sla': { hash: '#/sla', title: 'Synthetic SLA & TWAMP Probes — AUDIRA NetOps AI' },
  'packet-sniffer': { hash: '#/packet-sniffer', title: 'Packet Sniffer & Torch — AUDIRA NetOps AI' },
  ipam: { hash: '#/ipam', title: 'Visual IPAM & Subnet Planner — AUDIRA NetOps AI' },
  'config-drift': { hash: '#/drift', title: 'Golden Config Drift Auditor — AUDIRA NetOps AI' },
  compliance: { hash: '#/compliance', title: 'Security Compliance Audit — AUDIRA NetOps AI' },
  alerts: { hash: '#/alerts', title: 'Realtime Incidents & Alerts — AUDIRA NetOps AI' },
  configuration: { hash: '#/config', title: 'Multi-Vendor Config Studio — AUDIRA NetOps AI' },
  backups: { hash: '#/backups', title: 'Disaster Recovery & Snapshots — AUDIRA NetOps AI' },
  'ai-copilot': { hash: '#/copilot', title: 'AI Network Copilot — AUDIRA NetOps AI' },
  'mcp-hub': { hash: '#/mcp-hub', title: 'AI & MCP Hub — AUDIRA NetOps AI' },
  automation: { hash: '#/automation', title: 'Visual Automation Workflows — AUDIRA NetOps AI' },
  audit: { hash: '#/audit', title: 'Enterprise Audit Logs — AUDIRA NetOps AI' },
  settings: { hash: '#/settings', title: 'Platform Settings — AUDIRA NetOps AI' },
};

const HASH_TO_TAB: Record<string, NavigationTab> = {
  '#/landing': 'landing',
  '#/dashboard': 'dashboard',
  '#/devices': 'devices',
  '#/devices/detail': 'device-detail',
  '#/topology': 'topology',
  '#/terminal': 'terminal',
  '#/monitoring': 'monitoring',
  '#/sla': 'synthetic-sla',
  '#/packet-sniffer': 'packet-sniffer',
  '#/ipam': 'ipam',
  '#/drift': 'config-drift',
  '#/compliance': 'compliance',
  '#/alerts': 'alerts',
  '#/config': 'configuration',
  '#/backups': 'backups',
  '#/copilot': 'ai-copilot',
  '#/mcp-hub': 'mcp-hub',
  '#/automation': 'automation',
  '#/audit': 'audit',
  '#/settings': 'settings',
};

export const App: React.FC = () => {
  const {
    currentTab,
    setCurrentTab,
    selectedDevice,
    setSelectedDevice,
    devices,
    isAiDrawerOpen,
    toast,
    clearToast,
    isAuthenticated,
    theme,
  } = useNetOpsStore();

  // Synchronize active theme with document element
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  // Listen to browser hash changes (Back / Forward button & direct URL loading with identity slugs)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#/dashboard';
      const state = useNetOpsStore.getState();

      // 1. Check for device-specific route: #/devices/:slug
      if (hash.startsWith('#/devices/')) {
        const slug = decodeURIComponent(hash.replace('#/devices/', '')).trim();
        if (slug && slug !== 'detail') {
          const matchedDev = state.devices.find(
            (d) =>
              d.name.toLowerCase() === slug.toLowerCase() ||
              d.id === slug ||
              d.hostname.toLowerCase().startsWith(slug.toLowerCase())
          );
          if (matchedDev) {
            if (state.selectedDevice?.id !== matchedDev.id) {
              setSelectedDevice(matchedDev);
            }
            if (state.currentTab !== 'device-detail') {
              setCurrentTab('device-detail');
            }
            return;
          }
        }
        if (state.selectedDevice !== null) {
          setSelectedDevice(null);
        }
        if (state.currentTab !== 'devices') {
          setCurrentTab('devices');
        }
        return;
      }

      // 2. Standard tab matching
      const matchedTab = HASH_TO_TAB[hash];
      if (matchedTab && matchedTab !== state.currentTab) {
        if (matchedTab !== 'device-detail' && state.selectedDevice !== null) {
          setSelectedDevice(null);
        }
        setCurrentTab(matchedTab);
      }
    };

    // On initial mount, sync from window.location.hash if present
    if (window.location.hash) {
      handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [setCurrentTab, setSelectedDevice]);

  // Sync window.location.hash and document.title when tab changes
  useEffect(() => {
    if (!isAuthenticated && currentTab !== 'landing') {
      document.title = 'Operator Authentication Gate — AUDIRA NetOps AI';
      return;
    }

    let targetHash = TAB_CONFIG[currentTab]?.hash || '#/dashboard';
    let targetTitle = TAB_CONFIG[currentTab]?.title || 'AUDIRA NetOps AI';

    if (currentTab === 'device-detail' && selectedDevice) {
      const devSlug = selectedDevice.name.toLowerCase();
      targetHash = `#/devices/${encodeURIComponent(devSlug)}`;
      targetTitle = `WinBox [${selectedDevice.name} · ${selectedDevice.hostname}] — AUDIRA NetOps AI`;
    }

    if (window.location.hash !== targetHash) {
      window.history.replaceState(null, '', targetHash);
    }
    document.title = targetTitle;
  }, [currentTab, selectedDevice, isAuthenticated]);

  // If on public landing page, render full viewport landing page
  if (currentTab === 'landing') {
    return (
      <div className="h-screen w-screen overflow-y-auto bg-[#060a16] text-slate-100 font-sans">
        <LandingPage />
        <CommandPalette />
      </div>
    );
  }

  // If operator is not authenticated, render Operator Login Portal
  if (!isAuthenticated) {
    return (
      <div className="h-screen w-screen overflow-y-auto bg-[#060a16] text-slate-100 font-sans">
        <LoginView />
      </div>
    );
  }

  const renderContent = () => {
    if (selectedDevice && currentTab === 'device-detail') {
      return <WinboxDetail device={selectedDevice} />;
    }

    switch (currentTab) {
      case 'dashboard':
        return <NocDashboard />;
      case 'devices':
        return <DeviceList />;
      case 'topology':
        return <NetworkTopology />;
      case 'terminal':
        return <PuTTYTerminal />;
      case 'monitoring':
        return <MrtgMonitoringView />;
      case 'synthetic-sla':
        return <SlaSyntheticView />;
      case 'packet-sniffer':
        return <PacketSnifferView />;
      case 'ipam':
        return <IpamView />;
      case 'config-drift':
        return <ConfigDriftView />;
      case 'compliance':
        return <ComplianceView />;
      case 'alerts':
        return <AlertsView />;
      case 'configuration':
        return <ConfigManager />;
      case 'backups':
        return <BackupManager />;
      case 'ai-copilot':
        return <AICopilotDrawer />;
      case 'mcp-hub':
        return <McpAgentHubView />;
      case 'automation':
        return <AutomationView />;
      case 'audit':
        return <AuditLogViewer />;
      case 'settings':
        return <SettingsView />;
      default:
        return <NocDashboard />;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#09090b] text-zinc-100 overflow-hidden font-sans">
      {/* Topbar */}
      <Topbar />

      {/* Main Workspace: Sidebar + Dynamic Content + Collapsible Right AI Panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Dynamic Center Stage */}
        <main className="flex-1 overflow-y-auto bg-[#09090b] relative">
          {renderContent()}
        </main>

        {/* Right AI Drawer Panel when open and not already in full AI Copilot tab or Dashboard */}
        {isAiDrawerOpen && currentTab !== 'ai-copilot' && currentTab !== 'dashboard' && (
          <aside className="w-96 border-l border-zinc-800 bg-[#0c0c0e] shadow-xl z-20">
            <AICopilotDrawer />
          </aside>
        )}
      </div>

      {/* Global Command Palette (Ctrl+K / Cmd+K / Ctrl+Shift+P) */}
      <CommandPalette />

      {/* Floating System Toast Notification (Studio Style) */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center space-x-2.5 px-3.5 py-2.5 rounded-lg bg-[#121215] border border-zinc-800 shadow-xl backdrop-blur-md animate-in slide-in-from-bottom-3 duration-150">
          <div
            className={`w-2 h-2 rounded-full ${
              toast.type === 'success'
                ? 'bg-emerald-500'
                : toast.type === 'error'
                ? 'bg-rose-500'
                : 'bg-blue-500'
            }`}
          />
          <span className="text-xs font-mono text-zinc-200 font-medium">
            {toast.message}
          </span>
          <button
            onClick={() => clearToast()}
            className="text-zinc-500 hover:text-zinc-200 text-xs ml-2 cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
