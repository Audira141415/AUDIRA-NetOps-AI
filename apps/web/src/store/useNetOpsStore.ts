import { create } from 'zustand';
import { Device, Alert, NetworkHealthSummary } from '@audira/types';

export type { Device, Alert, NetworkHealthSummary };

export type NavigationTab =
  | 'landing'
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

  devices: Device[];
  addDevice: (device: Device) => void;
  removeDevice: (id: string) => void;

  selectedDevice: Device | null;
  setSelectedDevice: (device: Device | null) => void;
  activeDeviceTab: DeviceTab;
  setActiveDeviceTab: (tab: DeviceTab) => void;

  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;

  isAiDrawerOpen: boolean;
  setAiDrawerOpen: (open: boolean) => void;

  isAddDeviceModalOpen: boolean;
  setAddDeviceModalOpen: (open: boolean) => void;

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
  currentTab: 'landing',
  setCurrentTab: (tab) => set({ currentTab: tab }),

  // Clean empty state ready for real device onboarding
  devices: [],
  addDevice: (device) => set((state) => ({ devices: [device, ...state.devices] })),
  removeDevice: (id) =>
    set((state) => ({
      devices: state.devices.filter((d) => d.id !== id),
      selectedDevice: state.selectedDevice?.id === id ? null : state.selectedDevice,
    })),

  selectedDevice: null,
  setSelectedDevice: (device) =>
    set({ selectedDevice: device, currentTab: device ? 'device-detail' : get().currentTab }),
  activeDeviceTab: 'overview',
  setActiveDeviceTab: (activeDeviceTab) => set({ activeDeviceTab }),

  isCommandPaletteOpen: false,
  setCommandPaletteOpen: (isCommandPaletteOpen) => set({ isCommandPaletteOpen }),

  isAiDrawerOpen: false,
  setAiDrawerOpen: (isAiDrawerOpen) => set({ isAiDrawerOpen }),

  isAddDeviceModalOpen: false,
  setAddDeviceModalOpen: (isAddDeviceModalOpen) => set({ isAddDeviceModalOpen }),

  // Clean terminal tabs
  terminalTabs: [],
  activeTerminalTabId: '',

  addTerminalTab: (device: Device) => {
    const existing = get().terminalTabs.find((t) => t.deviceId === device.id);
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
    set((state) => ({
      terminalTabs: [...state.terminalTabs, newTab],
      activeTerminalTabId: newTab.id,
      currentTab: 'terminal',
    }));
  },

  closeTerminalTab: (tabId: string) => {
    set((state) => {
      const filtered = state.terminalTabs.filter((t) => t.id !== tabId);
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
