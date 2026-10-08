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
  } = useNetOpsStore();

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
    <div className="h-screen w-screen flex flex-col bg-[#070c18] text-slate-100 overflow-hidden font-sans">
      {/* Topbar */}
      <Topbar />

      {/* Main Workspace: Sidebar + Dynamic Content + Collapsible Right AI Panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Dynamic Center Stage */}
        <main className="flex-1 overflow-y-auto bg-[#070c18] relative">
          {renderContent()}
        </main>

        {/* Right AI Drawer Panel when open and not already in full AI Copilot tab or Dashboard */}
        {isAiDrawerOpen && currentTab !== 'ai-copilot' && currentTab !== 'dashboard' && (
          <aside className="w-96 border-l border-cyan-500/20 shadow-2xl z-20">
            <AICopilotDrawer />
          </aside>
        )}
      </div>

      {/* Global Command Palette (Ctrl+K / Cmd+K / Ctrl+Shift+P) */}
      <CommandPalette />

      {/* Floating System Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center space-x-3 px-4 py-3 rounded-xl bg-[#0d162a]/95 border border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.35)] backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-200">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              toast.type === 'success'
                ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                : toast.type === 'error'
                ? 'bg-rose-400 shadow-[0_0_8px_#f43f5e]'
                : 'bg-cyan-400 shadow-[0_0_8px_#38bdf8]'
            }`}
          />
          <span className="text-xs font-mono text-slate-100 font-semibold tracking-wide">
            {toast.message}
          </span>
          <button
            onClick={() => clearToast()}
            className="text-slate-400 hover:text-white text-xs ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
