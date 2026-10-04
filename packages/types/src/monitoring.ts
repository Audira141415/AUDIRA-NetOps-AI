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
