// Real-Time Network Telemetry Simulator for Zero-Hardware NOC Operations

import { MetricSnapshot, NetworkHealthSummary, Alert } from '@audira/types';

export class TelemetrySimulator {
  private static instance: TelemetrySimulator;

  private constructor() {}

  public static getInstance(): TelemetrySimulator {
    if (!TelemetrySimulator.instance) {
      TelemetrySimulator.instance = new TelemetrySimulator();
    }
    return TelemetrySimulator.instance;
  }

  /**
   * Generates dynamic, realistic telemetry for any device.
   */
  public getDeviceTelemetry(deviceId: string, deviceName: string): MetricSnapshot {
    const isCore = deviceName.includes('CORE');
    const isSwitch = deviceName.includes('SW');
    const now = new Date().toISOString();

    // Base fluctuations
    const jitter = Math.sin(Date.now() / 10000) * 8;
    const baseCpu = isCore ? 18 : isSwitch ? 32 : 12;
    const cpu = Math.min(99, Math.max(5, Math.round((baseCpu + jitter + (Math.random() * 4 - 2)) * 10) / 10));

    const baseMem = isCore ? 42 : isSwitch ? 55 : 28;
    const memory = Math.min(95, Math.max(10, Math.round((baseMem + Math.random() * 2) * 10) / 10));

    const latencyBase = isCore ? 1.2 : 2.8;
    const latency = Math.round((latencyBase + Math.random() * 0.8) * 100) / 100;

    const isSw02 = deviceName.includes('SW-JOGJA-02') || deviceName.includes('SW-02');
    const packetLoss = isSw02 ? 1.4 : 0.0;

    const rxBase = isCore ? 450000 : isSwitch ? 120000 : 25000;
    const txBase = isCore ? 380000 : isSwitch ? 95000 : 32000;

    return {
      deviceId,
      cpuPercent: cpu,
      memoryPercent: memory,
      diskPercent: 24.5,
      temperatureCelsius: isCore ? 41.2 : 36.8,
      latencyMs: latency,
      packetLossPercent: packetLoss,
      uptimeSeconds: 3680200,
      rxRateKbps: Math.round(rxBase + (Math.random() * 50000 - 25000)),
      txRateKbps: Math.round(txBase + (Math.random() * 40000 - 20000)),
      recordedAt: now,
    };
  }

  /**
   * Aggregates global NOC health metrics across all monitored nodes.
   */
  public getNetworkHealthSummary(): NetworkHealthSummary {
    const jitter = Math.sin(Date.now() / 15000) * 4;

    return {
      totalDevices: 7,
      onlineDevices: 6,
      warningDevices: 1,
      offlineDevices: 0,
      cpuAverage: Math.round((22.4 + jitter) * 10) / 10,
      memoryAverage: 44.8,
      networkRxKbps: 842910,
      networkTxKbps: 712040,
      packetLossAverage: 0.2,
      latencyAverageMs: 2.1,
      activeAlerts: 2,
    };
  }

  /**
   * Returns active demo alerts.
   */
  public getActiveAlerts(): Alert[] {
    return [
      {
        id: '40000000-0000-0000-0000-000000000001',
        deviceId: '30000000-0000-0000-0000-000000000005',
        deviceName: 'SW-JOGJA-02',
        severity: 'WARNING',
        category: 'INTERFACE',
        title: 'Interface drop rate elevated',
        message: 'Interface ether8 on SW-JOGJA-02 reports packet drops exceeding 1.8%',
        status: 'ACTIVE',
        createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
      },
      {
        id: '40000000-0000-0000-0000-000000000002',
        deviceId: '30000000-0000-0000-0000-000000000001',
        deviceName: 'CORE-JOGJA-01',
        severity: 'INFO',
        category: 'REACHABILITY',
        title: 'BGP Peer Established',
        message: 'BGP session with AS64512 (Telkom Transit) established via sfp-sfpplus1',
        status: 'ACKNOWLEDGED',
        createdAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
      },
    ];
  }
}
