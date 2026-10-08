// AI Tool Registry & Safety Definitions

import { ToolDefinition } from '@audira/types';

export const AI_TOOL_DEFINITIONS: Record<string, ToolDefinition> = {
  get_device: {
    name: 'get_device',
    description: 'Retrieve device metadata, vendor, IP, OS version, and operational status.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID or name' },
      },
      required: ['deviceId'],
    },
  },
  get_system_resource: {
    name: 'get_system_resource',
    description: 'Fetch real-time CPU, RAM, disk, board architecture, uptime, and temperature.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
      },
      required: ['deviceId'],
    },
  },
  get_interfaces: {
    name: 'get_interfaces',
    description: 'List all network interfaces with status, MTU, MAC, and byte counters.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
      },
      required: ['deviceId'],
    },
  },
  get_interface_status: {
    name: 'get_interface_status',
    description: 'Inspect specific interface metrics: link state, speed, drops, errors, RX/TX rate.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
        interfaceName: { type: 'string', description: 'Interface identifier (e.g. ether1, sfp-sfpplus1)' },
      },
      required: ['deviceId', 'interfaceName'],
    },
  },
  get_mrtg_traffic: {
    name: 'get_mrtg_traffic',
    description: 'Retrieve MRTG multi-router traffic graph time-series data, average/max throughput, and 95th percentile billing metrics for an interface.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
        interfaceName: { type: 'string', description: 'Interface identifier (e.g. ether1-wan, sfp-sfpplus1)' },
        range: {
          type: 'string',
          enum: ['live', 'daily', 'weekly', 'monthly', 'yearly'],
          description: 'MRTG time resolution window (default: daily)',
        },
      },
      required: ['deviceId', 'interfaceName'],
    },
  },
  get_ip_addresses: {
    name: 'get_ip_addresses',
    description: 'List configured IP addresses, subnet masks, and associated interfaces.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
      },
      required: ['deviceId'],
    },
  },
  get_routes: {
    name: 'get_routes',
    description: 'Fetch routing table entries including default gateway, static, and dynamic routes.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
      },
      required: ['deviceId'],
    },
  },
  get_firewall: {
    name: 'get_firewall',
    description: 'Inspect firewall filter rules, chain (input/forward/output), and hit counters.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
      },
      required: ['deviceId'],
    },
  },
  get_nat: {
    name: 'get_nat',
    description: 'List NAT rules (srcnat/masquerade and dstnat/port-forwarding).',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
      },
      required: ['deviceId'],
    },
  },
  get_dhcp: {
    name: 'get_dhcp',
    description: 'Inspect DHCP servers, IP pools, and active client lease assignments.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
      },
      required: ['deviceId'],
    },
  },
  get_dns: {
    name: 'get_dns',
    description: 'Check DNS resolver settings, upstream DNS servers, and static DNS cache.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
      },
      required: ['deviceId'],
    },
  },
  get_vlan: {
    name: 'get_vlan',
    description: 'List configured VLAN interfaces, bridge VLAN filtering, and tagged/untagged ports.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
      },
      required: ['deviceId'],
    },
  },
  get_bridge: {
    name: 'get_bridge',
    description: 'Inspect bridge domains, member ports, STP/RSTP state, and fast-forward status.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
      },
      required: ['deviceId'],
    },
  },
  get_vpn: {
    name: 'get_vpn',
    description: 'Check active VPN tunnels: WireGuard peers, IPsec SAs, OpenVPN, SSTP, or PPTP.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
      },
      required: ['deviceId'],
    },
  },
  get_queues: {
    name: 'get_queues',
    description: 'Inspect simple queues, queue trees, bandwidth limits, and current packet rates.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
      },
      required: ['deviceId'],
    },
  },
  get_logs: {
    name: 'get_logs',
    description: 'Fetch recent system event logs, authentication attempts, and interface state changes.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
        lines: { type: 'number', description: 'Number of recent log lines to retrieve (default: 50)' },
      },
      required: ['deviceId'],
    },
  },
  get_active_connections: {
    name: 'get_active_connections',
    description: 'Examine firewall connection tracking table for high bandwidth or suspect IPs.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
      },
      required: ['deviceId'],
    },
  },
  get_bgp_summary: {
    name: 'get_bgp_summary',
    description: 'Retrieve BGP neighbor states, local/remote AS numbers, uptime, and received/advertised prefix counts.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
      },
      required: ['deviceId'],
    },
  },
  diagnose_bgp_peer: {
    name: 'diagnose_bgp_peer',
    description: 'Perform deterministic root cause analysis of a BGP peering session (state machine, hold timer, MTU, RPKI ROA).',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
        peerIp: { type: 'string', description: 'BGP Peer IP address to diagnose' },
      },
      required: ['deviceId', 'peerIp'],
    },
  },
  get_optical_transceiver_status: {
    name: 'get_optical_transceiver_status',
    description: 'Retrieve DDM/DOM optical transceiver telemetry (RX/TX dBm, laser bias current, temperature, voltage) for SFP/SFP+ fiber interfaces.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
        interfaceName: { type: 'string', description: 'Optical interface name (e.g. sfp-sfpplus1, TenGigabitEthernet1/1/1)' },
      },
      required: ['deviceId', 'interfaceName'],
    },
  },
  diagnose_fiber_link: {
    name: 'diagnose_fiber_link',
    description: 'Evaluate optical power budget, detect fiber attenuation, micro-bends, laser aging, and receiver overload.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
        interfaceName: { type: 'string', description: 'Optical interface identifier' },
      },
      required: ['deviceId', 'interfaceName'],
    },
  },
  get_queue_metrics: {
    name: 'get_queue_metrics',
    description: 'Retrieve real-time bandwidth queue statistics, packet drop counters, queue depth, and CIR/MIR rates.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
        queueName: { type: 'string', description: 'Queue name or identifier (optional: omit to list all active queues)' },
      },
      required: ['deviceId'],
    },
  },
  evaluate_bufferbloat: {
    name: 'evaluate_bufferbloat',
    description: 'Analyze latency degradation under saturated load and recommend AQM tuning (FQ-CoDel / CAKE / PCQ).',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
        interfaceName: { type: 'string', description: 'Uplink or customer interface to evaluate' },
      },
      required: ['deviceId', 'interfaceName'],
    },
  },
  ping: {
    name: 'ping',
    description: 'Send ICMP echo requests from the router to evaluate target latency and packet loss.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Device to run ping from' },
        targetIp: { type: 'string', description: 'Destination IP address or hostname' },
        count: { type: 'number', description: 'Number of pings (default: 5)' },
      },
      required: ['deviceId', 'targetIp'],
    },
  },
  traceroute: {
    name: 'traceroute',
    description: 'Trace hop-by-hop network path and identify upstream latency bottlenecks.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Device to run traceroute from' },
        targetIp: { type: 'string', description: 'Target destination IP' },
      },
      required: ['deviceId', 'targetIp'],
    },
  },
  interface_monitor: {
    name: 'interface_monitor',
    description: 'Monitor real-time RX/TX throughput rate and packet drop counters over an interval.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
        interfaceName: { type: 'string', description: 'Interface to monitor' },
      },
      required: ['deviceId', 'interfaceName'],
    },
  },
  backup_device: {
    name: 'backup_device',
    description: 'Create an immediate snapshot backup or RSC export before changes.',
    permission: 'config.write',
    riskLevel: 'LOW',
    readOnly: false,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
        backupType: { type: 'string', enum: ['RSC_EXPORT', 'BINARY_BACKUP'], description: 'Backup format' },
      },
      required: ['deviceId'],
    },
  },
  get_config: {
    name: 'get_config',
    description: 'Retrieve current running configuration script / export.',
    permission: 'config.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
      },
      required: ['deviceId'],
    },
  },
  compare_config: {
    name: 'compare_config',
    description: 'Compare current running config against a baseline or previous backup version.',
    permission: 'config.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
        backupId: { type: 'string', description: 'Backup ID to compare with' },
      },
      required: ['deviceId', 'backupId'],
    },
  },
  generate_config: {
    name: 'generate_config',
    description: 'Generate standardized syntax-validated configuration snippet for proposed changes.',
    permission: 'config.write',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
        intentDescription: { type: 'string', description: 'Plain English intent (e.g. Create VLAN 100 with DHCP pool)' },
      },
      required: ['deviceId', 'intentDescription'],
    },
  },
  validate_config: {
    name: 'validate_config',
    description: 'Check command syntax, detect conflicts, and determine risk level (LOW/MED/HIGH/CRITICAL).',
    permission: 'config.write',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
        configScript: { type: 'string', description: 'Configuration commands to evaluate' },
      },
      required: ['deviceId', 'configScript'],
    },
  },
  apply_config: {
    name: 'apply_config',
    description: 'Apply approved configuration commands to the live device after backup and risk check.',
    permission: 'config.execute',
    riskLevel: 'HIGH',
    readOnly: false,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
        approvalId: { type: 'string', description: 'Approved change request ticket UUID' },
        configScript: { type: 'string', description: 'Exact approved configuration commands' },
      },
      required: ['deviceId', 'approvalId', 'configScript'],
    },
  },
  rollback_config: {
    name: 'rollback_config',
    description: 'Revert device configuration to a known healthy backup state if verification fails.',
    permission: 'config.rollback',
    riskLevel: 'HIGH',
    readOnly: false,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
        backupId: { type: 'string', description: 'Target backup UUID to restore' },
      },
      required: ['deviceId', 'backupId'],
    },
  },
  get_change_freeze_status: {
    name: 'get_change_freeze_status',
    description: 'Evaluate whether the network is currently in Peak Change Freeze (08:00-22:00 WIB), Standard Maintenance Window (01:00-05:00 WIB), or Hard Freeze.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        targetTimezoneOffset: { type: 'number', description: 'UTC timezone offset in hours (default: 7 for WIB)' },
      },
      required: [],
    },
  },
  evaluate_break_glass_ticket: {
    name: 'evaluate_break_glass_ticket',
    description: 'Verify if an emergency ticket ID (INC/CHG/EMRG) is valid to authorize break-glass modification during change freeze.',
    permission: 'config.write',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        ticketId: { type: 'string', description: 'Incident or change ticket identifier (e.g. INC-10492)' },
        justification: { type: 'string', description: 'Operational reason for break-glass emergency modification' },
      },
      required: ['ticketId', 'justification'],
    },
  },
  get_junos_commit_history: {
    name: 'get_junos_commit_history',
    description: 'Retrieve Junos system commit history, sequence numbers, timestamps, operators, and commit comments.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target Juniper device UUID' },
        limit: { type: 'number', description: 'Number of recent commits to inspect (default: 10)' },
      },
      required: ['deviceId'],
    },
  },
  validate_junos_candidate_config: {
    name: 'validate_junos_candidate_config',
    description: 'Validate Junos candidate configuration syntax using commit check and generate visual diff against running state (show | compare).',
    permission: 'config.write',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target Juniper device UUID' },
        candidateCommands: { type: 'string', description: 'Junos set/delete statements to validate in candidate db' },
      },
      required: ['deviceId', 'candidateCommands'],
    },
  },
  request_four_eyes_approval: {
    name: 'request_four_eyes_approval',
    description: 'Submit a proposed CRITICAL network operation to the Dual-Operator Four-Eyes Quorum Gate requiring a second distinct engineer sign-off.',
    permission: 'config.write',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
        commands: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of high-impact/critical commands requiring dual sign-off',
        },
        reason: { type: 'string', description: 'Operational justification for the critical operation' },
      },
      required: ['deviceId', 'commands', 'reason'],
    },
  },
  verify_four_eyes_signoff: {
    name: 'verify_four_eyes_signoff',
    description: 'Verify if a pending Four-Eyes approval request has satisfied dual-operator sign-off and valid HMAC signature.',
    permission: 'config.execute',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        requestId: { type: 'string', description: 'Four-Eyes Approval Request UUID' },
      },
      required: ['requestId'],
    },
  },
  get_mpls_ldp_status: {
    name: 'get_mpls_ldp_status',
    description: 'Inspect MPLS LDP sessions, transport addresses, neighbor states, and label forwarding table across Core routers.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target router UUID' },
      },
      required: ['deviceId'],
    },
  },
  diagnose_vpls_pseudowire: {
    name: 'diagnose_vpls_pseudowire',
    description: 'Diagnose VPLS pseudowire operational state, VC-ID, signaled MTU, and verify for MTU mismatch or control-word discrepancies.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target PE router UUID' },
        pseudowireId: { type: 'string', description: 'Optional specific VPLS interface name or VC-ID' },
      },
      required: ['deviceId'],
    },
  },
  audit_subnet_capacity: {
    name: 'audit_subnet_capacity',
    description: 'Analyze IP address allocation, calculate subnet utilization percentage, and detect address space exhaustion risk across managed subnets.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        cidr: { type: 'string', description: 'Target CIDR block to audit (e.g. 10.100.0.0/22)' },
      },
      required: ['cidr'],
    },
  },
  detect_ip_conflicts: {
    name: 'detect_ip_conflicts',
    description: 'Scan and detect overlapping CIDR blocks, duplicate IP assignments, gateway collisions, and rogue DHCP servers across network devices.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        proposedCidr: { type: 'string', description: 'Proposed CIDR block to evaluate for collisions against existing plan' },
      },
      required: ['proposedCidr'],
    },
  },
  run_compliance_audit: {
    name: 'run_compliance_audit',
    description: 'Execute comprehensive security compliance audit against CIS Benchmark, identifying cleartext services, weak ciphers, and unpatched CVEs on target device.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID to audit' },
      },
      required: ['deviceId'],
    },
  },
  generate_hardening_remediation: {
    name: 'generate_hardening_remediation',
    description: 'Generate vendor-specific 1-click remediation scripts to fix security compliance audit failures after pre-flight safety snapshot.',
    permission: 'config.write',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
        failedCheckIds: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of compliance check IDs to remediate (e.g. ["chk-1", "chk-2", "chk-3"])',
        },
      },
      required: ['deviceId', 'failedCheckIds'],
    },
  },
  correlate_alert_storm: {
    name: 'correlate_alert_storm',
    description: 'Analyze an active flood of network alarms (alert storm), deduce the single upstream root-cause failure, and suppress dependent downstream symptoms.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        timeWindowSeconds: { type: 'number', description: 'Correlation sliding window in seconds (default: 45)' },
      },
      required: [],
    },
  },
  calculate_incident_impact_radius: {
    name: 'calculate_incident_impact_radius',
    description: 'Calculate the blast radius, affected downstream POPs, subscriber counts, and circuit IDs for a specified primary network failure.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        primaryAlertId: { type: 'string', description: 'Primary root cause alert UUID' },
      },
      required: ['primaryAlertId'],
    },
  },
  detect_config_drift: {
    name: 'detect_config_drift',
    description: 'Compare live device configuration against authorized Golden Template, calculating drift score and identifying unauthorized shadow changes.',
    permission: 'config.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
        goldenConfigText: { type: 'string', description: 'Declared Golden Baseline template to compare against' },
      },
      required: ['deviceId', 'goldenConfigText'],
    },
  },
  reconcile_config_drift: {
    name: 'reconcile_config_drift',
    description: 'Generate safe, pre-flight snapshotted reconciliation commands to realign drifted router configuration with Golden IaC baseline.',
    permission: 'config.write',
    riskLevel: 'HIGH',
    readOnly: false,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'Target device UUID' },
        goldenConfigText: { type: 'string', description: 'Golden template to restore on device' },
      },
      required: ['deviceId', 'goldenConfigText'],
    },
  },
  get_synthetic_sla_metrics: {
    name: 'get_synthetic_sla_metrics',
    description: 'Inspect active TWAMP, IP SLA, and jitter synthetic probe telemetry, including latency RTT, packet loss, and VoIP MOS score across transit paths.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        targetHost: { type: 'string', description: 'Optional specific target host (e.g. 1.1.1.1, 8.8.8.8)' },
      },
      required: [],
    },
  },
  evaluate_voip_quality_mos: {
    name: 'evaluate_voip_quality_mos',
    description: 'Calculate ITU-T G.107 Mean Opinion Score (MOS) and R-factor voice quality rating from measured latency, jitter, and packet loss metrics.',
    permission: 'device.read',
    riskLevel: 'LOW',
    readOnly: true,
    inputSchema: {
      type: 'object',
      properties: {
        latencyMs: { type: 'number', description: 'One-way or round-trip delay in milliseconds' },
        jitterMs: { type: 'number', description: 'Packet delay variation (jitter) in milliseconds' },
        packetLossPercent: { type: 'number', description: 'Packet loss percentage (0.0 to 100.0)' },
      },
      required: ['latencyMs', 'jitterMs', 'packetLossPercent'],
    },
  },
};









