// MRTG (Multi Router Traffic Grapher) Telemetry & Analytics Service
// Provides high-resolution time-series data, MRTG-standard averages, peaks, and 95th percentile metrics

import { MrtgDataPoint, MrtgInterfaceTraffic, MrtgStats, MrtgTimeRange } from '@audira/types';

export function formatBitsPerSecond(bps: number): string {
  if (bps >= 1_000_000_000) {
    return `${(bps / 1_000_000_000).toFixed(2)} Gbps`;
  }
  if (bps >= 1_000_000) {
    return `${(bps / 1_000_000).toFixed(2)} Mbps`;
  }
  if (bps >= 1_000) {
    return `${(bps / 1_000).toFixed(2)} Kbps`;
  }
  return `${Math.round(bps)} bps`;
}

export class MrtgService {
  private static instance: MrtgService;

  private constructor() {}

  public static getInstance(): MrtgService {
    if (!MrtgService.instance) {
      MrtgService.instance = new MrtgService();
    }
    return MrtgService.instance;
  }

  /**
   * Generates or calculates complete MRTG time-series dataset for an interface.
   */
  public getInterfaceTraffic(
    deviceId: string,
    deviceName: string,
    interfaceName: string,
    range: MrtgTimeRange = 'daily'
  ): MrtgInterfaceTraffic {
    const is10G = interfaceName.includes('sfp') || interfaceName.includes('sfpplus');
    const isWan = interfaceName.includes('wan') || interfaceName.includes('ether1');
    const capacityBps = is10G ? 10_000_000_000 : 1_000_000_000;
    const speed = is10G ? '10 Gbps' : '1 Gbps';

    const baseRxBps = is10G ? 4_200_000_000 : isWan ? 340_000_000 : 85_000_000;
    const baseTxBps = is10G ? 3_100_000_000 : isWan ? 190_000_000 : 62_000_000;

    const points: MrtgDataPoint[] = [];
    const now = Date.now();

    // Determine sample resolution based on MRTG conventions
    let pointCount = 24;
    let stepMs = 60 * 60 * 1000; // 1 hr default

    switch (range) {
      case 'live':
        pointCount = 20;
        stepMs = 5 * 1000; // 5 seconds
        break;
      case 'daily':
        pointCount = 28; // ~50 min chunks over 24h
        stepMs = (24 * 60 * 60 * 1000) / pointCount;
        break;
      case 'weekly':
        pointCount = 28; // 6-hour chunks over 7 days
        stepMs = (7 * 24 * 60 * 60 * 1000) / pointCount;
        break;
      case 'monthly':
        pointCount = 30; // 1-day chunks over 30 days
        stepMs = (30 * 24 * 60 * 60 * 1000) / pointCount;
        break;
      case 'yearly':
        pointCount = 24; // bi-weekly chunks over 365 days
        stepMs = (365 * 24 * 60 * 60 * 1000) / pointCount;
        break;
    }

    const rxSamples: number[] = [];
    const txSamples: number[] = [];

    for (let i = pointCount; i >= 0; i--) {
      const pointTime = new Date(now - i * stepMs);

      // Realistic diurnal curve (traffic peaks around 11:00 - 16:00 and 20:00, drops at 03:00)
      const hour = pointTime.getHours();
      const diurnalFactor = 0.5 + 0.5 * Math.sin(((hour - 5) / 24) * 2 * Math.PI);
      const wave = Math.sin((pointTime.getTime() / (3600 * 1000 * 4))) * 0.15;
      const noiseRx = (Math.random() * 0.2 - 0.1);
      const noiseTx = (Math.random() * 0.2 - 0.1);

      const rxMultiplier = Math.max(0.15, Math.min(0.95, diurnalFactor * 0.7 + wave + noiseRx));
      const txMultiplier = Math.max(0.12, Math.min(0.90, diurnalFactor * 0.6 + wave + noiseTx));

      const rxBps = Math.round(baseRxBps * rxMultiplier);
      const txBps = Math.round(baseTxBps * txMultiplier);

      rxSamples.push(rxBps);
      txSamples.push(txBps);

      let timeLabel = '';
      if (range === 'live') {
        timeLabel = pointTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      } else if (range === 'daily') {
        timeLabel = pointTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (range === 'weekly') {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        timeLabel = `${days[pointTime.getDay()]} ${pointTime.getHours()}:00`;
      } else if (range === 'monthly') {
        timeLabel = `${pointTime.getDate()} ${pointTime.toLocaleString('en', { month: 'short' })}`;
      } else {
        timeLabel = `${pointTime.toLocaleString('en', { month: 'short' })} ${pointTime.getFullYear()}`;
      }

      points.push({
        timestamp: pointTime.toISOString(),
        timeLabel,
        rxBps,
        txBps,
        rxMbps: Math.round((rxBps / 1_000_000) * 100) / 100,
        txMbps: Math.round((txBps / 1_000_000) * 100) / 100,
        rxFormatted: formatBitsPerSecond(rxBps),
        txFormatted: formatBitsPerSecond(txBps),
      });
    }

    // Compute MRTG Stats
    const currentRxBps = rxSamples[rxSamples.length - 1] ?? 0;
    const currentTxBps = txSamples[txSamples.length - 1] ?? 0;
    const maxRxBps = Math.max(...rxSamples, 1);
    const maxTxBps = Math.max(...txSamples, 1);
    const avgRxBps = Math.round(rxSamples.reduce((a, b) => a + b, 0) / rxSamples.length);
    const avgTxBps = Math.round(txSamples.reduce((a, b) => a + b, 0) / txSamples.length);

    // 95th Percentile calculation
    const sortedRx = [...rxSamples].sort((a, b) => a - b);
    const sortedTx = [...txSamples].sort((a, b) => a - b);
    const p95Index = Math.min(sortedRx.length - 1, Math.floor(sortedRx.length * 0.95));
    const percentile95RxBps = sortedRx[p95Index] ?? maxRxBps;
    const percentile95TxBps = sortedTx[p95Index] ?? maxTxBps;

    const stats: MrtgStats = {
      currentRxBps,
      currentTxBps,
      avgRxBps,
      avgTxBps,
      maxRxBps,
      maxTxBps,
      percentile95RxBps,
      percentile95TxBps,
    };

    return {
      deviceId,
      deviceName,
      interfaceName,
      interfaceType: is10G ? 'sfp-plus' : 'ethernet',
      macAddress: is10G ? 'D4:CA:6D:E1:01:01' : 'D4:CA:6D:E1:01:02',
      ipAddress: isWan ? '192.168.1.100/24' : is10G ? '10.250.0.1/30' : '192.168.88.1/24',
      speed,
      capacityBps,
      status: 'UP',
      range,
      stats,
      points,
      lastPolled: new Date().toISOString(),
    };
  }

  /**
   * Returns list of MRTG summaries across standard interfaces for a node.
   */
  public getDeviceMrtgSummary(deviceId: string, deviceName: string): MrtgInterfaceTraffic[] {
    const interfaces = ['sfp-sfpplus1', 'ether1-wan', 'ether2-lan', 'bridge-lan'];
    return interfaces.map((iface) => this.getInterfaceTraffic(deviceId, deviceName, iface, 'daily'));
  }
}
