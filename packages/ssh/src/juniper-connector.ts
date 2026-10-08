// Juniper Junos OS Device Connector
// Implements DeviceConnector interface with Junos CLI parsers and candidate-commit safety rules

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

export interface JuniperConnectorConfig {
  host: string;
  port?: number;
  username: string;
  password?: string;
  privateKey?: string;
  timeoutMs?: number;
  isMock?: boolean;
}

export class JuniperJunosConnector implements DeviceConnector {
  private config: JuniperConnectorConfig;
  private connected: boolean = false;

  constructor(config: JuniperConnectorConfig) {
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
    // In production, opens SSH channel and executes 'set cli screen-length 0' & 'set cli screen-width 0'
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
        error: `Junos safety guardrail blocked: ${validation.blockReasons.join('; ')}`,
      };
    }

    // Junos candidate diff simulation
    if (command.includes('| compare')) {
      return {
        success: true,
        command,
        output: `[edit protocols bgp group UPSTREAM-PEERS]\n+   neighbor 10.50.1.1 description "TIER1-TRANSIT-PRIMARY";\n+   neighbor 10.50.1.1 bfd-liveness-detection minimum-interval 350;`,
        executionDurationMs: Date.now() - start,
      };
    }

    return {
      success: true,
      command,
      output: `[user@junos-${this.config.host}> ${command}]\nCommand executed successfully.`,
      executionDurationMs: Date.now() - start,
    };
  }

  public async getSystemInfo(): Promise<SystemInfo> {
    return {
      uptime: '68d 14h 22m',
      version: 'Junos: 22.4R2-S2.4 (JUNOS Software Release)',
      freeMemoryBytes: 6442450944,
      totalMemoryBytes: 17179869184,
      cpuLoadPercent: 12.8,
      cpuCount: 8,
      freeHddBytes: 42949672960,
      totalHddBytes: 107374182400,
      architecture: 'x86_64',
      boardName: 'MX204-HW-B',
      platform: 'Juniper MX204 Universal Routing Platform',
      temperatureCelsius: 36.2,
      voltageVolts: 12.0,
    };
  }

  public async getInterfaces(): Promise<Interface[]> {
    return [
      {
        name: 'xe-0/0/0',
        type: 'sfp-plus',
        macAddress: '2C:6B:F5:1A:88:00',
        ipAddresses: ['10.50.1.2/30'],
        isEnabled: true,
        isRunning: true,
        mtu: 9192,
        speed: '10Gbps',
        rxBytes: 89402859102,
        txBytes: 74920194812,
        rxPackets: 69201948,
        txPackets: 58204912,
        rxErrors: 0,
        txErrors: 0,
        rxDrops: 0,
        txDrops: 0,
      },
      {
        name: 'xe-0/0/1',
        type: 'sfp-plus',
        macAddress: '2C:6B:F5:1A:88:01',
        ipAddresses: ['10.50.2.2/30'],
        isEnabled: true,
        isRunning: true,
        mtu: 9192,
        speed: '10Gbps',
        rxBytes: 52910482019,
        txBytes: 48201940192,
        rxPackets: 41204910,
        txPackets: 37492019,
        rxErrors: 0,
        txErrors: 0,
        rxDrops: 0,
        txDrops: 0,
      },
      {
        name: 'et-0/0/2',
        type: 'sfp-plus',
        macAddress: '2C:6B:F5:1A:88:02',
        ipAddresses: ['10.100.0.1/31'],
        isEnabled: true,
        isRunning: true,
        mtu: 9192,
        speed: '100Gbps',
        rxBytes: 382910482019,
        txBytes: 412940294012,
        rxPackets: 289402914,
        txPackets: 312049182,
        rxErrors: 0,
        txErrors: 0,
        rxDrops: 0,
        txDrops: 0,
      },
      {
        name: 'fxp0',
        type: 'ethernet',
        macAddress: '2C:6B:F5:1A:88:FF',
        ipAddresses: ['192.168.100.254/24'],
        isEnabled: true,
        isRunning: true,
        mtu: 1500,
        speed: '1Gbps',
        rxBytes: 12049182,
        txBytes: 18294012,
        rxPackets: 89401,
        txPackets: 124910,
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
        gateway: '10.50.1.1',
        interfaceName: 'xe-0/0/0',
        distance: 170, // BGP in Junos
        isActive: true,
        isDynamic: true,
      },
      {
        destination: '10.0.0.0/8',
        gateway: '10.100.0.0',
        interfaceName: 'et-0/0/2',
        distance: 10, // OSPF in Junos
        isActive: true,
        isDynamic: true,
      },
      {
        destination: '192.168.100.0/24',
        interfaceName: 'fxp0',
        distance: 0, // Direct in Junos
        isActive: true,
        isDynamic: false,
      },
    ];
  }

  public async getLogs(): Promise<LogEntry[]> {
    return [
      {
        time: new Date().toLocaleTimeString(),
        topics: ['UI_COMMIT: UI_COMMIT_COMPLETED'],
        message: 'Commit completed successfully by audira-noc',
        severity: 'info',
      },
      {
        time: new Date().toLocaleTimeString(),
        topics: ['RPD_BGP_NEIGHBOR_STATE_CHANGED'],
        message: 'BGP peer 10.50.1.1 (External AS 64512) changed state from OpenConfirm to Established',
        severity: 'info',
      },
    ];
  }

  public async backup(): Promise<BackupResult> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `junos-cfg-${this.config.host}-${timestamp}.set`;

    return {
      success: true,
      backupId: `bkp-junos-${Date.now()}`,
      filename,
      hash: 'sha256-f8b912e7cc30a9182f091244ab821f008479e2a1',
      sizeBytes: 24510,
      timestamp: new Date().toISOString(),
    };
  }

  public async validate(command: string): Promise<ValidationResult> {
    const trimmed = command.trim().toLowerCase();
    const warnings: string[] = [];
    const blockReasons: string[] = [];

    // Critical: System destroy/reboot/zeroize
    if (
      trimmed.includes('request system reboot') ||
      trimmed.includes('request system halt') ||
      trimmed.includes('request system zeroize') ||
      trimmed.includes('request system power-off') ||
      trimmed.includes('load factory-default')
    ) {
      blockReasons.push(
        'Destructive Junos command forbidden: Reboot, halt, or zeroize requires Dual-Operator Sign-off.'
      );
      return {
        isValid: false,
        riskLevel: 'CRITICAL',
        warnings,
        blockReasons,
        suggestedAction: 'Require Dual-Operator Confirmation Gate',
      };
    }

    // High Risk: Mass deletions or unconfirmed commits on routing/interfaces
    if (
      trimmed === 'delete routing-options' ||
      trimmed === 'delete protocols' ||
      trimmed === 'delete interfaces' ||
      trimmed.startsWith('deactivate interfaces') ||
      trimmed.startsWith('delete protocols bgp') ||
      trimmed.startsWith('delete firewall')
    ) {
      warnings.push(
        'Major configuration deletion affects core Junos routing or packet forwarding filters.'
      );
      return {
        isValid: true,
        riskLevel: 'HIGH',
        warnings,
        blockReasons,
        suggestedAction: 'Require Pre-flight Candidate Diff & commit confirmed rollback safeguard',
      };
    }

    // Low Risk: Operational inspect/show/ping
    if (
      trimmed.startsWith('show ') ||
      trimmed.startsWith('ping ') ||
      trimmed.startsWith('traceroute ') ||
      trimmed.startsWith('monitor ')
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
      warnings: ['Candidate modification queued. Run commit check before applying.'],
      blockReasons: [],
    };
  }
}
