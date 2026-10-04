// AUDIRA NetOps AI - Main Application Component

import React from 'react';
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
import { useNetOpsStore } from './store/useNetOpsStore';

export const App: React.FC = () => {
  const { currentTab, selectedDevice, isAiDrawerOpen } = useNetOpsStore();

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
        return <NocDashboard />;
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
    <div className="h-screen w-screen flex flex-col bg-noc-bg text-slate-100 overflow-hidden">
      {/* Topbar */}
      <Topbar />

      {/* Main Workspace: Sidebar + Dynamic Content + Collapsible Right AI Panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Dynamic Center Stage */}
        <main className="flex-1 overflow-y-auto bg-noc-bg relative">
          {renderContent()}
        </main>

        {/* Right AI Drawer Panel when open and not already in full AI Copilot tab */}
        {isAiDrawerOpen && currentTab !== 'ai-copilot' && (
          <aside className="w-96 border-l border-noc-border shadow-2xl z-20">
            <AICopilotDrawer />
          </aside>
        )}
      </div>

      {/* Global Command Palette (Ctrl+Shift+P / Cmd+K) */}
      <CommandPalette />
    </div>
  );
};

export default App;
