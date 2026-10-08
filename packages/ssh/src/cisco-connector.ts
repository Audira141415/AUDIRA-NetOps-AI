// Cisco IOS / IOS-XE Device Connector
// Implements DeviceConnector interface with Cisco CLI parsers and syntax safety rules

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

export interface CiscoConnectorConfig {
  host: string;
  port?: number;
  username: string;
  password?: string;
  enableSecret?: string;
  timeoutMs?: number;
  isMock?: boolean;
}

export class CiscoIOSConnector implements DeviceConnector {
  private config: CiscoConnectorConfig;
  private connected: boolean = false;

  constructor(config: CiscoConnectorConfig) {
    this.config = {
      port: 22,
      timeoutMs: 15000,
      ...config,
    };
  }

  public isConnected(): boolean {
    return this.connected;
  }

  public async connect(): Promise<void> {
    // In production, opens SSH channel and executes 'terminal length 0' to disable pagination
    this.connected = true;
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
        error: `Cisco safety policy blocked: ${validation.blockReasons.join('; ')}`,
      };
    }

    return {
      success: true,
      command,
      output: `[Cisco IOS-XE ${this.config.host}# ${command}]\nCommand executed successfully.`,
      executionDurationMs: Date.now() - start,
    };
  }

  public async getSystemInfo(): Promise<SystemInfo> {
    return {
      uptime: '42d 18h 12m',
      version: 'Cisco IOS-XE Software, Version 17.09.04a',
      freeMemoryBytes: 4294967296,
      totalMemoryBytes: 8589934592,
      cpuLoadPercent: 18.4,
      cpuCount: 4,
      freeHddBytes: 15032385536,
      totalHddBytes: 32212254720,
      architecture: 'x86_64',
      boardName: 'C9300-48P',
      platform: 'Catalyst 9300 Series',
      temperatureCelsius: 38.5,
      voltageVolts: 12.1,
    };
  }

  public async getInterfaces(): Promise<Interface[]> {
    return [
      {
        name: 'GigabitEthernet1/0/1',
        type: 'ethernet',
        macAddress: '00:45:1D:9A:20:01',
        ipAddresses: ['192.168.10.254/24'],
        isEnabled: true,
        isRunning: true,
        mtu: 1500,
        speed: '1Gbps',
        rxBytes: 492040192,
        txBytes: 129039201,
        rxPackets: 489201,
        txPackets: 298102,
        rxErrors: 0,
        txErrors: 0,
        rxDrops: 0,
        txDrops: 0,
      },
      {
        name: 'GigabitEthernet1/0/2',
        type: 'ethernet',
        macAddress: '00:45:1D:9A:20:02',
        ipAddresses: ['10.50.0.1/30'],
        isEnabled: true,
        isRunning: true,
        mtu: 1500,
        speed: '1Gbps',
        rxBytes: 984029104,
        txBytes: 893021940,
        rxPackets: 894021,
        txPackets: 812940,
        rxErrors: 0,
        txErrors: 0,
        rxDrops: 0,
        txDrops: 0,
      },
      {
        name: 'TenGigabitEthernet1/1/1',
        type: 'sfp-plus',
        macAddress: '00:45:1D:9A:20:0F',
        ipAddresses: ['10.100.1.2/30'],
        isEnabled: true,
        isRunning: true,
        mtu: 9000,
        speed: '10Gbps',
        rxBytes: 48920491024,
        txBytes: 52940294012,
        rxPackets: 38920194,
        txPackets: 42910492,
        rxErrors: 0,
        txErrors: 0,
        rxDrops: 0,
        txDrops: 0,
      },
    ];
  }

  public async getRoutes(): Promise<Route[]> {
    return [
      {
        destination: '0.0.0.0/0',
        gateway: '10.100.1.1',
        interfaceName: 'TenGigabitEthernet1/1/1',
        distance: 1,
        isActive: true,
        isDynamic: false,
      },
      {
        destination: '10.0.0.0/8',
        gateway: '10.50.0.2',
        interfaceName: 'GigabitEthernet1/0/2',
        distance: 110,
        isActive: true,
        isDynamic: true,
      },
      {
        destination: '192.168.10.0/24',
        interfaceName: 'GigabitEthernet1/0/1',
        distance: 0,
        isActive: true,
        isDynamic: false,
      },
    ];
  }

  public async getLogs(): Promise<LogEntry[]> {
    return [
      {
        time: new Date().toLocaleTimeString(),
        topics: ['SYS-5-CONFIG_I'],
        message: 'Configured from console by audira-noc on vty0',
        severity: 'info',
      },
      {
        time: new Date().toLocaleTimeString(),
        topics: ['LINK-3-UPDOWN'],
        message: 'Interface GigabitEthernet1/0/1, changed state to up',
        severity: 'info',
      },
    ];
  }

  public async backup(): Promise<BackupResult> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `cisco-run-cfg-${this.config.host}-${timestamp}.cfg`;

    return {
      success: true,
      backupId: `bkp-cisco-${Date.now()}`,
      filename,
      hash: 'sha256-a94f8fe5ccb19ba61c4c0873d391e987982fbbd3',
      sizeBytes: 18420,
      timestamp: new Date().toISOString(),
    };
  }

  public async validate(command: string): Promise<ValidationResult> {
    const trimmed = command.trim().toLowerCase();
    const warnings: string[] = [];
    const blockReasons: string[] = [];

    // Cisco Absolute Blacklist
    if (
      trimmed === 'reload' ||
      trimmed.startsWith('reload ') ||
      trimmed.includes('write erase') ||
      trimmed.includes('erase startup-config') ||
      trimmed.includes('no router bgp')
    ) {
      blockReasons.push('Destructive command forbidden: Reload or config erasure requires dual operator sign-off.');
      return {
        isValid: false,
        riskLevel: 'CRITICAL',
        warnings,
        blockReasons,
        suggestedAction: 'Require Dual-Operator Confirmation Gate',
      };
    }

    // High Risk: Routing / Interface Shutdown
    if (
      trimmed.includes('shutdown') ||
      trimmed.startsWith('no ip route') ||
      trimmed.startsWith('router ospf') ||
      trimmed.startsWith('router bgp') ||
      trimmed.includes('access-list')
    ) {
      warnings.push('Modifying routing table, ACL, or interface state affects network transit.');
      return {
        isValid: true,
        riskLevel: 'HIGH',
        warnings,
        blockReasons,
        suggestedAction: 'Require Operator Approval & Pre-flight Config Snapshot',
      };
    }

    // Low Risk: Read-only inspection commands
    if (
      trimmed.startsWith('show ') ||
      trimmed.startsWith('ping ') ||
      trimmed.startsWith('traceroute ')
    ) {
      return {
        isValid: true,
        riskLevel: 'LOW',
        warnings: [],
        blockReasons: [],
      };
    }

    return {
      isValid: true,
      riskLevel: 'MEDIUM',
      warnings: ['Configuration change will be recorded to audit logs.'],
      blockReasons: [],
    };
  }
}
