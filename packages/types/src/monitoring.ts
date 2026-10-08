// Telemetry, Monitoring, and Alerting types

export type AlertSeverity = 'INFO' | 'WARNING' | 'CRITICAL';
export type AlertCategory = 'CPU' | 'MEMORY' | 'INTERFACE' | 'REACHABILITY' | 'SECURITY' | 'BGP' | 'OSPF';
export type AlertStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';

export interface Alert {
  id: string;
  deviceId?: string;
  deviceName?: string;
  severity: AlertSeverity;
  category: AlertCategory;
  title: string;
  message: string;
  status: AlertStatus;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface MetricSnapshot {
  id?: string;
  deviceId: string;
  cpuPercent: number;
  memoryPercent: number;
  diskPercent: number;
  temperatureCelsius?: number;
  latencyMs: number;
  packetLossPercent: number;
  uptimeSeconds: number;
  rxRateKbps: number;
  txRateKbps: number;
  recordedAt: string;
}

export interface NetworkHealthSummary {
  totalDevices: number;
  onlineDevices: number;
  warningDevices: number;
  offlineDevices: number;
  cpuAverage: number;
  memoryAverage: number;
  networkRxKbps: number;
  networkTxKbps: number;
  packetLossAverage: number;
  latencyAverageMs: number;
  activeAlerts: number;
}

export interface TopologyNodeData {
  id: string;
  label: string;
  ip: string;
  vendor: string;
  deviceType: string;
  status: 'ONLINE' | 'WARNING' | 'OFFLINE';
  cpuLoad: number;
  latencyMs: number;
  packetLoss: number;
}

export interface TopologyEdgeData {
  source: string;
  target: string;
  interfaceSource?: string;
  interfaceTarget?: string;
  speed?: string;
  trafficKbps?: number;
  status: 'UP' | 'DEGRADED' | 'DOWN';
  latencyMs?: number;
}

// MRTG (Multi Router Traffic Grapher) Types
export type MrtgTimeRange = 'live' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface MrtgDataPoint {
  timestamp: string;
  timeLabel: string;
  rxBps: number;
  txBps: number;
  rxMbps: number;
  txMbps: number;
  rxFormatted: string;
  txFormatted: string;
}

export interface MrtgStats {
  currentRxBps: number;
  currentTxBps: number;
  avgRxBps: number;
  avgTxBps: number;
  maxRxBps: number;
  maxTxBps: number;
  percentile95RxBps: number;
  percentile95TxBps: number;
}

export interface MrtgInterfaceTraffic {
  deviceId: string;
  deviceName: string;
  interfaceName: string;
  interfaceType: string;
  macAddress?: string;
  ipAddress?: string;
  speed: string;
  capacityBps: number;
  status: 'UP' | 'DOWN';
  range: MrtgTimeRange;
  stats: MrtgStats;
  points: MrtgDataPoint[];
  lastPolled: string;
}

