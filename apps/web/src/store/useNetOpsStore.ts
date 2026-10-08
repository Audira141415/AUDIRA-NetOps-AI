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
  | 'synthetic-sla'
  | 'packet-sniffer'
  | 'ipam'
  | 'configuration'
  | 'config-drift'
  | 'backups'
  | 'compliance'
  | 'alerts'
  | 'ai-copilot'
  | 'automation'
  | 'audit'
  | 'settings';

export type DeviceTab =
  | 'overview'
  | 'interfaces'
  | 'mrtg'
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

export interface OperatorUser {
  id: string;
  name: string;
  username: string;
  email: string;
  role: 'Super Admin' | 'NOC Engineer Tier-2' | 'Cybersecurity Operator';
  avatar?: string;
  lastLogin: string;
}

export const DEFAULT_OPERATOR: OperatorUser = {
  id: 'usr-admin-01',
  name: 'Pratama NOC Admin',
  username: 'admin',
  email: 'admin@noc.audira.net',
  role: 'Super Admin',
  lastLogin: 'Wed Oct 7 19:30 WIB',
};

export interface SerialPortConfig {
  portName: string; // e.g. COM1, COM3, /dev/ttyUSB0
  baudRate: number; // 9600, 115200, 57600, 38400
  dataBits: number; // 8 or 7
  stopBits: number; // 1 or 2
  parity: 'none' | 'even' | 'odd';
  flowControl: 'none' | 'hardware' | 'software';
  chipset?: string; // FTDI FT232R, CP2102, CH340, PL2303
}

export interface TerminalTabItem {
  id: string;
  deviceId: string;
  name: string;
  hostname?: string;
  ip: string;
  port?: number;
  username?: string;
  vendor?: string;
  status: 'ONLINE' | 'CONNECTING' | 'OFFLINE';
  latencyMs: number;
  connectionType?: 'SSH' | 'TELNET' | 'SERIAL' | 'CONSOLE_SERVER';
  serialConfig?: SerialPortConfig;
}

export type OperationMode = 'SUPERVISED' | 'AUTONOMOUS' | 'SAFE_MODE';

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export interface SavedConfiguration {
  id: string;
  deviceId: string;
  deviceName: string;
  filename: string;
  version: string;
  content: string;
  changeNote: string;
  author: string;
  savedAt: string;
}

const DEFAULT_ENTERPRISE_DEVICES: Device[] = [];

interface NetOpsState {
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;

  // Devices & CRUD
  devices: Device[];
  addDevice: (device: Device) => void;
  updateDevice: (id: string, updated: Partial<Device>) => void;
  removeDevice: (id: string) => void;
  resetDevicesToDefaults: () => void;
  clearAllPlatformData: () => void;

  selectedDevice: Device | null;
  setSelectedDevice: (device: Device | null) => void;
  activeDeviceTab: DeviceTab;
  setActiveDeviceTab: (tab: DeviceTab) => void;

  // System & Recommendation Modes
  operationMode: OperationMode;
  setOperationMode: (mode: OperationMode) => void;
  recommendationModeActive: boolean;
  setRecommendationModeActive: (active: boolean) => void;

  // Saved Configs
  savedConfigs: SavedConfiguration[];
  saveConfig: (config: Omit<SavedConfiguration, 'id' | 'savedAt'>) => void;
  deleteSavedConfig: (id: string) => void;

  // Toast System
  toast: ToastNotification | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  clearToast: () => void;

  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;

  isAiDrawerOpen: boolean;
  setAiDrawerOpen: (open: boolean) => void;

  isAddDeviceModalOpen: boolean;
  setAddDeviceModalOpen: (open: boolean) => void;

  // Authentication & Operator Session
  isAuthenticated: boolean;
  currentUser: OperatorUser | null;
  login: (username: string, role?: OperatorUser['role']) => void;
  logout: () => void;

  terminalTabs: TerminalTabItem[];
  activeTerminalTabId: string;
  addTerminalTab: (device: Device, options?: { id?: string; username?: string; port?: number; connectionType?: 'SSH' | 'TELNET' | 'SERIAL' }) => string;
  updateTerminalTabStatus: (tabId: string, status: 'ONLINE' | 'CONNECTING' | 'OFFLINE', latencyMs?: number) => void;
  addSerialTerminalTab: (device: Device | null, serialConfig: SerialPortConfig) => void;
  closeTerminalTab: (tabId: string) => void;
  setActiveTerminalTabId: (tabId: string) => void;

  healthSummary: NetworkHealthSummary | null;
  setHealthSummary: (summary: NetworkHealthSummary) => void;

  activeAlerts: Alert[];
  setActiveAlerts: (alerts: Alert[]) => void;
}

const getInitialNavigationTab = (): NavigationTab => {
  if (typeof window !== 'undefined' && window.location.hash) {
    const h = window.location.hash;
    const tabMap: Record<string, NavigationTab> = {
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
    if (tabMap[h]) return tabMap[h];
  }
  return 'landing';
};

export const useNetOpsStore = create<NetOpsState>((set, get) => ({
  currentTab: getInitialNavigationTab(),
  setCurrentTab: (tab) => set({ currentTab: tab }),

  // Pre-seeded with 4 multi-vendor realistic enterprise nodes
  devices: DEFAULT_ENTERPRISE_DEVICES,
  addDevice: (device) => {
    set((state) => ({ devices: [device, ...state.devices] }));
    get().showToast(`Perangkat "${device.name}" berhasil ditambahkan.`, 'success');
  },
  updateDevice: (id, updated) => {
    set((state) => ({
      devices: state.devices.map((d) => (d.id === id ? { ...d, ...updated, updatedAt: new Date().toISOString() } : d)),
      selectedDevice:
        state.selectedDevice?.id === id
          ? { ...state.selectedDevice, ...updated, updatedAt: new Date().toISOString() }
          : state.selectedDevice,
    }));
    get().showToast(`Konfigurasi perangkat berhasil diperbarui.`, 'success');
  },
  removeDevice: (id) => {
    const dev = get().devices.find((d) => d.id === id);
    set((state) => ({
      devices: state.devices.filter((d) => d.id !== id),
      selectedDevice: state.selectedDevice?.id === id ? null : state.selectedDevice,
    }));
    if (dev) {
      get().showToast(`Perangkat "${dev.name}" telah dihapus.`, 'info');
    }
  },
  resetDevicesToDefaults: () => {
    set({ devices: [], selectedDevice: null });
    get().showToast('Daftar seluruh perangkat telah dibersihkan (Clean State).', 'info');
  },
  clearAllPlatformData: () => {
    set({
      devices: [],
      selectedDevice: null,
      savedConfigs: [],
      terminalTabs: [],
      activeTerminalTabId: '',
      activeAlerts: [],
      healthSummary: null,
    });
    get().showToast('Seluruh data platform berhasil dibersihkan untuk data riil.', 'info');
  },

  selectedDevice: null,
  setSelectedDevice: (device) =>
    set({ selectedDevice: device, currentTab: device ? 'device-detail' : get().currentTab }),
  activeDeviceTab: 'overview',
  setActiveDeviceTab: (activeDeviceTab) => set({ activeDeviceTab }),

  // Operation & Recommendation Modes
  operationMode: 'SUPERVISED',
  setOperationMode: (operationMode) => {
    set({ operationMode });
    const label =
      operationMode === 'SUPERVISED'
        ? 'Supervised Mode (Operator Approval Gate Aktif)'
        : operationMode === 'AUTONOMOUS'
        ? 'Autonomous Copilot Mode (Auto-Remediasi Aktif)'
        : 'Safe Mode / Dry Run (Simulasi Aman)';
    get().showToast(`Mode Operasi beralih ke: ${label}`, 'info');
  },
  recommendationModeActive: true,
  setRecommendationModeActive: (recommendationModeActive) => {
    set({ recommendationModeActive });
    get().showToast(
      recommendationModeActive
        ? 'AI Recommendation Mode diaktifkan: Rekomendasi optimasi & hardening ditampilkan.'
        : 'AI Recommendation Mode dinonaktifkan.',
      'info'
    );
  },

  // Saved Configs
  savedConfigs: [],
  saveConfig: (config) => {
    const newCfg: SavedConfiguration = {
      ...config,
      id: `cfg-${Date.now()}`,
      savedAt: new Date().toISOString(),
    };
    set((state) => ({ savedConfigs: [newCfg, ...state.savedConfigs] }));
    get().showToast(`Konfigurasi "${newCfg.filename}" berhasil disimpan.`, 'success');
  },
  deleteSavedConfig: (id) => {
    set((state) => ({ savedConfigs: state.savedConfigs.filter((c) => c.id !== id) }));
    get().showToast('Konfigurasi berhasil dihapus dari arsip.', 'info');
  },

  // Toast Notification
  toast: null,
  showToast: (message, type = 'success') => {
    set({ toast: { id: `toast-${Date.now()}`, message, type } });
    setTimeout(() => {
      set((state) => (state.toast?.message === message ? { toast: null } : {}));
    }, 4000);
  },
  clearToast: () => set({ toast: null }),

  isCommandPaletteOpen: false,
  setCommandPaletteOpen: (isCommandPaletteOpen) => set({ isCommandPaletteOpen }),

  isAiDrawerOpen: false,
  setAiDrawerOpen: (isAiDrawerOpen) => set({ isAiDrawerOpen }),

  isAddDeviceModalOpen: false,
  setAddDeviceModalOpen: (isAddDeviceModalOpen) => set({ isAddDeviceModalOpen }),

  // Authentication & Operator Session
  isAuthenticated: true,
  currentUser: {
    id: 'usr-admin-01',
    name: 'Pratama NOC Admin',
    username: 'admin',
    email: 'admin@noc.audira.net',
    role: 'Super Admin',
    lastLogin: 'Session Active',
  },
  login: (username, role = 'Super Admin') => {
    const user: OperatorUser = {
      id: `usr-${Date.now()}`,
      name: username === 'admin' ? 'Pratama NOC Admin' : username,
      username,
      email: `${username}@noc.audira.net`,
      role,
      lastLogin: new Date().toLocaleTimeString(),
    };
    set({ isAuthenticated: true, currentUser: user });
    get().showToast(`Selamat datang kembali, ${user.name} (${user.role})!`, 'success');
  },
  logout: () => {
    set({ isAuthenticated: false, currentUser: null, terminalTabs: [], activeTerminalTabId: '' });
    get().showToast('Sesi operator berhasil diakhiri.', 'info');
  },

  // Clean terminal tabs
  terminalTabs: [],
  activeTerminalTabId: '',

  addTerminalTab: (device: Device, options?: { id?: string; username?: string; port?: number; connectionType?: 'SSH' | 'TELNET' | 'SERIAL' }) => {
    const existing = get().terminalTabs.find((t) => t.deviceId === device.id);
    if (existing) {
      set({ activeTerminalTabId: existing.id, currentTab: 'terminal' });
      return existing.id;
    }
    const newTab: TerminalTabItem = {
      id: options?.id || `tab-${Date.now()}`,
      deviceId: device.id,
      name: device.name,
      hostname: device.hostname,
      ip: device.ipAddress,
      port: options?.port || device.sshPort || 22,
      username: options?.username || 'admin',
      vendor: device.vendor,
      status: 'CONNECTING',
      latencyMs: 1.8,
      connectionType: options?.connectionType || 'SSH',
    };
    set((state) => ({
      terminalTabs: [...state.terminalTabs, newTab],
      activeTerminalTabId: newTab.id,
      currentTab: 'terminal',
    }));
    return newTab.id;
  },

  updateTerminalTabStatus: (tabId: string, status: 'ONLINE' | 'CONNECTING' | 'OFFLINE', latencyMs?: number) => {
    set((state) => ({
      terminalTabs: state.terminalTabs.map((t) =>
        t.id === tabId ? { ...t, status, ...(latencyMs !== undefined ? { latencyMs } : {}) } : t
      ),
    }));
  },

  addSerialTerminalTab: (device, serialConfig) => {
    const tabId = `tab-serial-${Date.now()}`;
    const newTab: TerminalTabItem = {
      id: tabId,
      deviceId: device ? device.id : `serial-${serialConfig.portName.toLowerCase()}`,
      name: device ? `${device.name} (Console)` : `Console [${serialConfig.portName}]`,
      hostname: device?.hostname || `console.${serialConfig.portName.toLowerCase()}.local`,
      ip: `SERIAL://${serialConfig.portName}`,
      port: serialConfig.baudRate,
      username: 'console',
      vendor: device?.vendor || 'MikroTik',
      status: 'ONLINE',
      latencyMs: 0.2,
      connectionType: 'SERIAL',
      serialConfig,
    };
    set((state) => ({
      terminalTabs: [...state.terminalTabs, newTab],
      activeTerminalTabId: newTab.id,
      currentTab: 'terminal',
    }));
    get().showToast(
      `Sesi Serial Console terhubung pada ${serialConfig.portName} (${serialConfig.baudRate} 8N1).`,
      'success'
    );
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
