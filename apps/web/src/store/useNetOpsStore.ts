import { create } from 'zustand';
import { Device, Alert, NetworkHealthSummary } from '@audira/types';

export type { Device, Alert, NetworkHealthSummary };

export type NavigationTab =
  | 'dashboard'
  | 'devices'
  | 'device-detail'
  | 'topology'
  | 'terminal'
  | 'monitoring'
  | 'alerts'
  | 'configuration'
  | 'backups'
  | 'ai-copilot'
  | 'automation'
  | 'audit'
  | 'settings';

export type DeviceTab =
  | 'overview'
  | 'interfaces'
  | 'ip-addresses'
  | 'routes'
  | 'firewall'
  | 'nat'
  | 'dhcp'
  | 'dns'
  | 'vlan'
  | 'bridge'
  | 'vpn'
  | 'queues'
  | 'logs'
  | 'terminal'
  | 'configuration'
  | 'backups'
  | 'ai';

export interface TerminalTabItem {
  id: string;
  deviceId: string;
  name: string;
  ip: string;
  status: 'ONLINE' | 'CONNECTING' | 'OFFLINE';
  latencyMs: number;
}

interface NetOpsState {
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;

  selectedDevice: Device | null;
  setSelectedDevice: (device: Device | null) => void;
  activeDeviceTab: DeviceTab;
  setActiveDeviceTab: (tab: DeviceTab) => void;

  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;

  isAiDrawerOpen: boolean;
  setAiDrawerOpen: (open: boolean) => void;

  terminalTabs: TerminalTabItem[];
  activeTerminalTabId: string;
  addTerminalTab: (device: Device) => void;
  closeTerminalTab: (tabId: string) => void;
  setActiveTerminalTabId: (tabId: string) => void;

  healthSummary: NetworkHealthSummary | null;
  setHealthSummary: (summary: NetworkHealthSummary) => void;

  activeAlerts: Alert[];
  setActiveAlerts: (alerts: Alert[]) => void;
}

export const useNetOpsStore = create<NetOpsState>((set, get) => ({
  currentTab: 'dashboard',
  setCurrentTab: (tab) => set({ currentTab: tab }),

  selectedDevice: null,
  setSelectedDevice: (device) => set({ selectedDevice: device, currentTab: device ? 'device-detail' : get().currentTab }),
  activeDeviceTab: 'overview',
  setActiveDeviceTab: (activeDeviceTab) => set({ activeDeviceTab }),

  isCommandPaletteOpen: false,
  setCommandPaletteOpen: (isCommandPaletteOpen) => set({ isCommandPaletteOpen }),

  isAiDrawerOpen: false,
  setAiDrawerOpen: (isAiDrawerOpen) => set({ isAiDrawerOpen }),

  terminalTabs: [
    {
      id: 'tab-core-01',
      deviceId: '30000000-0000-0000-0000-000000000001',
      name: 'CORE-JOGJA-01',
      ip: '192.168.10.1',
      status: 'ONLINE',
      latencyMs: 1.2,
    },
    {
      id: 'tab-core-02',
      deviceId: '30000000-0000-0000-0000-000000000002',
      name: 'CORE-JOGJA-02',
      ip: '192.168.10.2',
      status: 'ONLINE',
      latencyMs: 1.4,
    },
    {
      id: 'tab-sw-01',
      deviceId: '30000000-0000-0000-0000-000000000004',
      name: 'SW-JOGJA-01',
      ip: '192.168.10.11',
      status: 'ONLINE',
      latencyMs: 2.5,
    },
  ],
  activeTerminalTabId: 'tab-core-01',

  addTerminalTab: (device: Device) => {
    const existing = get().terminalTabs.find(t => t.deviceId === device.id);
    if (existing) {
      set({ activeTerminalTabId: existing.id, currentTab: 'terminal' });
      return;
    }
    const newTab: TerminalTabItem = {
      id: `tab-${Date.now()}`,
      deviceId: device.id,
      name: device.name,
      ip: device.ipAddress,
      status: 'ONLINE',
      latencyMs: 1.8,
    };
    set(state => ({
      terminalTabs: [...state.terminalTabs, newTab],
      activeTerminalTabId: newTab.id,
      currentTab: 'terminal',
    }));
  },

  closeTerminalTab: (tabId: string) => {
    set(state => {
      const filtered = state.terminalTabs.filter(t => t.id !== tabId);
      const newActive = filtered.length > 0 ? filtered[0]!.id : '';
      return {
        terminalTabs: filtered,
        activeTerminalTabId: newActive,
      };
    });
  },

  setActiveTerminalTabId: (activeTerminalTabId) => set({ activeTerminalTabId }),

  healthSummary: null,
  setHealthSummary: (healthSummary) => set({ healthSummary }),

  activeAlerts: [],
  setActiveAlerts: (activeAlerts) => set({ activeAlerts }),
}));
