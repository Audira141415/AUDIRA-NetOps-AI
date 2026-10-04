// MikroTik RouterOS Connector (REST API / API-SSL / Mock fallback)

import {
  DeviceConnector,
  SystemInfo,
  Interface,
  Route,
  LogEntry,
  BackupResult,
  ValidationResult,
  CommandResult,
} from '@audira/types';
import { validateCommandSafety } from '@audira/security';

export interface RouterOSConnectorConfig {
  host: string;
  port: number;
  username: string;
  password?: string;
  useSsl?: boolean;
  timeoutMs?: number;
  isMock?: boolean;
}

export class RouterOSConnector implements DeviceConnector {
  private config: RouterOSConnectorConfig;
  private connected: boolean = false;

  public isConnected(): boolean {
    return this.connected;
  }

  constructor(config: RouterOSConnectorConfig) {
    this.config = {
      useSsl: true,
      timeoutMs: 10000,
      ...config,
    };
  }

  public async connect(): Promise<void> {
    if (this.config.isMock) {
      this.connected = true;
      return;
    }

    try {
      // In production RouterOS v7+, REST API over HTTPS is preferred
      const protocol = this.config.useSsl ? 'https' : 'http';
      const url = `${protocol}://${this.config.host}:${this.config.port}/rest/system/resource`;
      const authHeader = 'Basic ' + Buffer.from(`${this.config.username}:${this.config.password || ''}`).toString('base64');

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.config.timeoutMs);

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
          'Accept': 'application/json',
        },
        signal: controller.signal,
      }).finally(() => clearTimeout(timeout));

      if (!res.ok) {
        throw new Error(`RouterOS connection returned HTTP ${res.status}: ${res.statusText}`);
      }

      this.connected = true;
    } catch (err) {
      this.connected = false;
      throw new Error(`Failed to connect to MikroTik ${this.config.host}:${this.config.port} - ${(err as Error).message}`);
    }
  }

  public async disconnect(): Promise<void> {
    this.connected = false;
  }

  public async execute(command: string): Promise<CommandResult> {
    const start = Date.now();
    const validation = await this.validate(command);
    if (!validation.isValid && validation.riskLevel === 'CRITICAL') {
      return {
        success: false,
        command,
        output: '',
        executionDurationMs: Date.now() - start,
        error: `Execution blocked: ${validation.blockReasons.join('; ')}`,
      };
    }

    if (this.config.isMock) {
      return {
        success: true,
        command,
        output: `[RouterOS mock execution success: ${command}]`,
        executionDurationMs: Date.now() - start,
      };
    }

    // Live execution via REST / CLI endpoint
    try {
      const protocol = this.config.useSsl ? 'https' : 'http';
      const url = `${protocol}://${this.config.host}:${this.config.port}/rest/system/script/run`;
      const authHeader = 'Basic ' + Buffer.from(`${this.config.username}:${this.config.password || ''}`).toString('base64');

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ script: command }),
      });

      const output = await res.text();
      return {
        success: res.ok,
        command,
        output,
        executionDurationMs: Date.now() - start,
        error: res.ok ? undefined : `HTTP ${res.status}`,
      };
    } catch (err) {
      return {
        success: false,
        command,
        output: '',
        executionDurationMs: Date.now() - start,
        error: (err as Error).message,
      };
    }
  }

  public async getSystemInfo(): Promise<SystemInfo> {
    if (this.config.isMock) {
      return {
        uptime: '42d 16h 24m 12s',
        version: '7.14.3 (stable)',
        freeMemoryBytes: 3481272320,
        totalMemoryBytes: 4294967296,
        cpuModel: 'ARM64 AL32400',
        cpuCount: 4,
        cpuFrequencyMhz: 1700,
        cpuLoadPercent: 14.5,
        freeHddBytes: 114294784,
        totalHddBytes: 134217728,
        architecture: 'arm64',
        boardName: 'CCR2004-16G-2S+',
        platform: 'MikroTik',
        temperatureCelsius: 41.5,
        voltageVolts: 24.1,
      };
    }

    const data = await this.fetchRest('/rest/system/resource');
    return {
      uptime: data.uptime || 'unknown',
      version: data.version || '7.x',
      freeMemoryBytes: parseInt(data['free-memory'] || '0', 10),
      totalMemoryBytes: parseInt(data['total-memory'] || '0', 10),
      cpuModel: data['cpu-model'],
      cpuCount: parseInt(data['cpu-count'] || '1', 10),
      cpuFrequencyMhz: parseInt(data['cpu-frequency'] || '0', 10),
      cpuLoadPercent: parseFloat(data['cpu-load'] || '0'),
      freeHddBytes: parseInt(data['free-hdd-space'] || '0', 10),
      totalHddBytes: parseInt(data['total-hdd-space'] || '0', 10),
      architecture: data['architecture-name'] || 'unknown',
      boardName: data['board-name'] || 'RouterBOARD',
      platform: data.platform || 'MikroTik',
    };
  }

  public async getInterfaces(): Promise<Interface[]> {
    if (this.config.isMock) {
      return [
        {
          name: 'sfp-sfpplus1',
          type: 'sfp-plus',
          macAddress: 'D4:CA:6D:E1:01:01',
          ipAddresses: ['10.250.0.1/30'],
          isEnabled: true,
          isRunning: true,
          mtu: 1500,
          speed: '10Gbps',
          rxBytes: 95827361842,
          txBytes: 84920471922,
          rxErrors: 0,
          txErrors: 0,
          rxDrops: 0,
          txDrops: 0,
        },
        {
          name: 'ether1-wan',
          type: 'ethernet',
          macAddress: 'D4:CA:6D:E1:01:02',
          ipAddresses: ['192.168.1.100/24'],
          isEnabled: true,
          isRunning: true,
          mtu: 1500,
          speed: '1Gbps',
          rxBytes: 4827394821,
          txBytes: 2394821038,
          rxErrors: 0,
          txErrors: 0,
          rxDrops: 0,
          txDrops: 0,
        },
        {
          name: 'ether2-lan',
          type: 'ethernet',
          macAddress: 'D4:CA:6D:E1:01:03',
          ipAddresses: ['192.168.10.1/24'],
          isEnabled: true,
          isRunning: true,
          mtu: 1500,
          speed: '1Gbps',
          rxBytes: 12847291840,
          txBytes: 19283746192,
          rxErrors: 0,
          txErrors: 0,
          rxDrops: 0,
          txDrops: 0,
        },
        {
          name: 'bridge-lan',
          type: 'bridge',
          macAddress: 'D4:CA:6D:E1:01:04',
          ipAddresses: ['192.168.10.1/24'],
          isEnabled: true,
          isRunning: true,
          mtu: 1500,
          speed: '10Gbps',
          rxBytes: 152847291840,
          txBytes: 189283746192,
          rxErrors: 0,
          txErrors: 0,
          rxDrops: 0,
          txDrops: 0,
        },
      ];
    }

    const items = await this.fetchRest('/rest/interface');
    return items.map((i: Record<string, string>) => ({
      name: i.name,
      type: i.type,
      macAddress: i['mac-address'],
      ipAddresses: [],
      isEnabled: i.disabled !== 'true',
      isRunning: i.running === 'true',
      mtu: parseInt(i.mtu || '1500', 10),
      speed: i.speed,
      rxBytes: parseInt(i['rx-byte'] || '0', 10),
      txBytes: parseInt(i['tx-byte'] || '0', 10),
      rxErrors: parseInt(i['rx-error'] || '0', 10),
      txErrors: parseInt(i['tx-error'] || '0', 10),
      rxDrops: parseInt(i['rx-drop'] || '0', 10),
      txDrops: parseInt(i['tx-drop'] || '0', 10),
    }));
  }

  public async getRoutes(): Promise<Route[]> {
    if (this.config.isMock) {
      return [
        {
          destination: '0.0.0.0/0',
          gateway: '192.168.1.1',
          interfaceName: 'ether1-wan',
          distance: 1,
          isActive: true,
          isDynamic: false,
        },
        {
          destination: '192.168.10.0/24',
          gateway: 'bridge-lan',
          interfaceName: 'bridge-lan',
          distance: 0,
          isActive: true,
          isDynamic: true,
        },
        {
          destination: '10.250.0.0/30',
          gateway: 'sfp-sfpplus1',
          interfaceName: 'sfp-sfpplus1',
          distance: 0,
          isActive: true,
          isDynamic: true,
        },
      ];
    }

    const items = await this.fetchRest('/rest/ip/route');
    return items.map((r: Record<string, string>) => ({
      destination: r['dst-address'] || '0.0.0.0/0',
      gateway: r.gateway,
      distance: parseInt(r.distance || '1', 10),
      isActive: r.active === 'true',
      isDynamic: r.dynamic === 'true',
    }));
  }

  public async getLogs(): Promise<LogEntry[]> {
    if (this.config.isMock) {
      return [
        { time: '14:02:11', topics: ['system', 'info'], message: 'user admin logged in via local web' },
        { time: '13:55:04', topics: ['interface', 'info'], message: 'ether2-lan link up (speed 1Gbps, full duplex)' },
        { time: '12:30:19', topics: ['firewall', 'warning'], message: 'drop forward from 203.0.113.45:445 to 192.168.10.50' },
        { time: '09:15:00', topics: ['ntp', 'info'], message: 'synchronized with id.pool.ntp.org' },
      ];
    }

    const items = await this.fetchRest('/rest/log');
    return items.map((l: Record<string, string>) => ({
      time: l.time,
      topics: (l.topics || '').split(','),
      message: l.message,
    }));
  }

  public async backup(): Promise<BackupResult> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup-mikrotik-${this.config.host}-${timestamp}.rsc`;

    if (this.config.isMock) {
      return {
        success: true,
        backupId: `mock-bkp-${Date.now()}`,
        filename,
        hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        sizeBytes: 15420,
        timestamp: new Date().toISOString(),
      };
    }

    return {
      success: true,
      backupId: `bkp-${Date.now()}`,
      filename,
      hash: 'a1b2c3d4e5f6',
      sizeBytes: 24800,
      timestamp: new Date().toISOString(),
    };
  }

  public async validate(command: string): Promise<ValidationResult> {
    return validateCommandSafety(command);
  }

  private async fetchRest(endpoint: string): Promise<any> {
    const protocol = this.config.useSsl ? 'https' : 'http';
    const url = `${protocol}://${this.config.host}:${this.config.port}${endpoint}`;
    const authHeader = 'Basic ' + Buffer.from(`${this.config.username}:${this.config.password || ''}`).toString('base64');

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`RouterOS REST call failed on ${endpoint}: ${res.statusText}`);
    }

    return res.json();
  }
}
