// Device abstractions & Connector interfaces

export type VendorType = 'MikroTik' | 'GenericSSH' | 'Cisco' | 'Huawei' | 'Juniper' | 'Linux';
export type DeviceType = 'ROUTER' | 'SWITCH' | 'ACCESS_POINT' | 'FIREWALL' | 'SERVER';
export type ConnectionType = 'ROUTEROS_API' | 'ROUTEROS_REST' | 'SSH';
export type DeviceStatus = 'ONLINE' | 'WARNING' | 'OFFLINE' | 'UNREACHABLE';

export interface Device {
  id: string;
  name: string;
  hostname: string;
  ipAddress: string;
  macAddress?: string;
  vendor: VendorType;
  platform?: string;
  osVersion?: string;
  deviceType: DeviceType;
  connectionType: ConnectionType;
  apiPort: number;
  sshPort: number;
  status: DeviceStatus;
  pollingIntervalSeconds?: number;
  lastSeen?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeviceCredential {
  id: string;
  deviceId: string;
  authType: 'PASSWORD' | 'SSH_KEY' | 'API_TOKEN' | 'CERTIFICATE';
  username: string;
  encryptedSecret?: string; // Always stripped when returned to client
  hasSecret: boolean;
  keyFingerprint?: string;
}

export interface SystemInfo {
  uptime: string;
  version: string;
  buildTime?: string;
  freeMemoryBytes: number;
  totalMemoryBytes: number;
  cpuModel?: string;
  cpuCount: number;
  cpuFrequencyMhz?: number;
  cpuLoadPercent: number;
  freeHddBytes: number;
  totalHddBytes: number;
  architecture: string;
  boardName: string;
  platform?: string;
  temperatureCelsius?: number;
  voltageVolts?: number;
}

export interface Interface {
  id?: string;
  deviceId?: string;
  name: string;
  type: string;
  macAddress?: string;
  ipAddresses: string[];
  isEnabled: boolean;
  isRunning: boolean;
  mtu: number;
  speed?: string;
  rxBytes: number;
  txBytes: number;
  rxPackets?: number;
  txPackets?: number;
  rxErrors?: number;
  txErrors?: number;
  rxDrops?: number;
  txDrops?: number;
  updatedAt?: string;
}

export interface Route {
  id?: string;
  deviceId?: string;
  destination: string;
  gateway?: string;
  interfaceName?: string;
  distance: number;
  scope?: number;
  routingTable?: string;
  isActive: boolean;
  isDynamic: boolean;
}

export interface LogEntry {
  time: string;
  topics: string[];
  message: string;
  severity?: 'info' | 'warning' | 'error';
}

export interface BackupResult {
  success: boolean;
  backupId: string;
  filename: string;
  hash: string;
  sizeBytes: number;
  timestamp: string;
  error?: string;
}

export interface CommandResult {
  success: boolean;
  command: string;
  output: string;
  executionDurationMs: number;
  error?: string;
}

export interface ValidationResult {
  isValid: boolean;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  warnings: string[];
  blockReasons: string[];
  suggestedAction?: string;
}

export interface DeviceConnector {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  execute(command: string): Promise<CommandResult>;
  getSystemInfo(): Promise<SystemInfo>;
  getInterfaces(): Promise<Interface[]>;
  getRoutes(): Promise<Route[]>;
  getLogs(): Promise<LogEntry[]>;
  backup(): Promise<BackupResult>;
  validate(command: string): Promise<ValidationResult>;
}
