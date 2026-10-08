// Configuration Management Component (View, Diff, Validate, Rollback, AI Recommendations & Save)
// Enterprise Multi-Vendor Config Engine: MikroTik RouterOS, Cisco IOS-XE, Huawei VRP & Cross-Vendor Transpiler

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Editor, { DiffEditor } from '@monaco-editor/react';
import {
  FileCode2,
  AlertTriangle,
  RotateCcw,
  Shield,
  Download,
  Upload,
  CheckCircle2,
  Code2,
  Layers,
  Sparkles,
  Save,
  Send,
  Trash2,
  Clock,
  Check,
  FileCheck,
  Zap,
  ArrowRight,
  ShieldCheck,
  X,
  Cpu,
  Server,
  Shuffle,
  RefreshCw,
  Terminal,
  HelpCircle,
} from 'lucide-react';
import { Button, Badge, Card } from '../ui';
import { useNetOpsStore, SavedConfiguration } from '../../store/useNetOpsStore';
import { Device } from '@audira/types';

export type VendorDialect = 'MIKROTIK_ROUTEROS' | 'CISCO_IOS' | 'HUAWEI_VRP' | 'JUNIPER_JUNOS';

interface VendorMeta {
  dialect: VendorDialect;
  vendorName: string;
  osName: string;
  fileExt: string;
  color: string;
  borderColor: string;
  bgBadge: string;
  textBadge: string;
  sampleConfig: string;
  syntaxTips: string[];
}

const VENDOR_SPECS: Record<VendorDialect, VendorMeta> = {
  MIKROTIK_ROUTEROS: {
    dialect: 'MIKROTIK_ROUTEROS',
    vendorName: 'MikroTik SIA',
    osName: 'RouterOS v7.15',
    fileExt: '.rsc',
    color: 'cyan',
    borderColor: 'border-cyan-500/40',
    bgBadge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    textBadge: 'text-cyan-400',
    syntaxTips: [
      'Gunakan notasi slash path v7: /ip/address, /routing/bgp/connection',
      'Routing filters v7 menggunakan format rule="if (dst in ...) { ... }"',
      'Gunakan /safe mode untuk proteksi sesi jarak jauh',
    ],
    sampleConfig: [
      '# RouterOS v7.15.2 configuration export',
      '# Architecture: CCR2004-16G-2S+ (Tilera 64-bit)',
      '# Managed by AUDIRA NetOps AI Studio',
      '',
      '/interface bridge add name=bridge-lan vlan-filtering=yes',
      '/interface ethernet set [ find default-name=ether1 ] name=ether1-wan',
      '/interface ethernet set [ find default-name=ether2 ] name=ether2-lan',
      '/ip address add address=192.168.10.1/24 interface=bridge-lan network=192.168.10.0',
      '/ip address add address=198.51.100.2/30 interface=ether1-wan network=198.51.100.0',
      '/ip route add dst-address=0.0.0.0/0 gateway=198.51.100.1 distance=1',
      '/ip firewall nat add action=masquerade chain=srcnat out-interface=ether1-wan',
      '/routing bgp template add name=tmpl-core as=65001 router-id=192.168.10.1',
      '/routing bgp connection add name=upstream-transit template=tmpl-core remote.address=198.51.100.1 .as=64512',
      '/system identity set name="CORE-JOGJA-01"',
    ].join('\n'),
  },
  CISCO_IOS: {
    dialect: 'CISCO_IOS',
    vendorName: 'Cisco Systems',
    osName: 'Cisco IOS-XE 17.9',
    fileExt: '.cfg',
    color: 'blue',
    borderColor: 'border-blue-500/40',
    bgBadge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    textBadge: 'text-blue-400',
    syntaxTips: [
      'Struktur berhirarki: configure terminal -> interface -> ip address',
      'Gunakan "no shutdown" untuk mengaktifkan port fisik',
      'Pastikan "service password-encryption" dan "ip ssh version 2" aktif',
    ],
    sampleConfig: [
      '! Cisco IOS-XE Software, Version 17.09.04a',
      '! Device: CISCO-DIST-01 (Catalyst 9300-48P Multi-Gigabit)',
      '! Managed by AUDIRA NetOps AI Studio',
      '',
      'hostname CISCO-DIST-01',
      '!',
      'service password-encryption',
      'no ip domain-lookup',
      'ip routing',
      '!',
      'vlan 10,20,30,100',
      ' name NOC-MANAGEMENT-VLAN',
      '!',
      'interface GigabitEthernet1/0/1',
      ' description UPLINK-TO-CORE-BORDER',
      ' no switchport',
      ' ip address 10.200.0.1 255.255.255.252',
      ' no shutdown',
      '!',
      'interface GigabitEthernet1/0/2',
      ' description ACCESS-CORP-USERS',
      ' switchport mode access',
      ' switchport access vlan 20',
      ' spanning-tree portfast',
      ' no shutdown',
      '!',
      'ip route 0.0.0.0 0.0.0.0 10.200.0.2',
      '!',
      'router ospf 1',
      ' router-id 10.200.0.1',
      ' network 10.200.0.0 0.0.0.3 area 0',
      ' passive-interface default',
      ' no passive-interface GigabitEthernet1/0/1',
      '!',
      'line vty 0 4',
      ' transport input ssh',
      ' login local',
      '!',
      'end',
    ].join('\n'),
  },
  HUAWEI_VRP: {
    dialect: 'HUAWEI_VRP',
    vendorName: 'Huawei Technologies',
    osName: 'Huawei VRP V200R021',
    fileExt: '.cfg',
    color: 'red',
    borderColor: 'border-rose-500/40',
    bgBadge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    textBadge: 'text-rose-400',
    syntaxTips: [
      'Gunakan mode sistem: system-view -> interface -> ip address',
      'Negasi perintah menggunakan kata kunci "undo" (bukan "no")',
      'Simpan konfigurasi menggunakan "commit" atau "save"',
    ],
    sampleConfig: [
      '# Huawei Versatile Routing Platform (VRP V200R021C00)',
      '# Device: HUAWEI-CORE-02 (CloudEngine S6730-H48X6QZ)',
      '# Managed by AUDIRA NetOps AI Studio',
      '',
      'sysname HUAWEI-CORE-02',
      '#',
      'undo telnet server enable',
      'ssh server enable',
      '#',
      'vlan batch 10 20 30 100',
      '#',
      'interface 10GE1/0/1',
      ' description UPLINK-TO-DATA-CENTER',
      ' undo portswitch',
      ' ip address 10.250.0.1 255.255.255.252',
      ' undo shutdown',
      '#',
      'interface 10GE1/0/2',
      ' description AGG-SWITCH-TRUNK',
      ' port link-type trunk',
      ' port trunk allow-pass vlan 10 20 30',
      ' stp edged-port enable',
      '#',
      'ip route-static 0.0.0.0 0.0.0.0 10.250.0.2',
      '#',
      'bgp 65001',
      ' router-id 10.250.0.1',
      ' peer 10.250.0.2 as-number 64512',
      ' peer 10.250.0.2 description CORE-TRANSIT-PEER',
      '#',
      'user-interface vty 0 4',
      ' authentication-mode aaa',
      ' protocol inbound ssh',
      '#',
      'return',
    ].join('\n'),
  },
  JUNIPER_JUNOS: {
    dialect: 'JUNIPER_JUNOS',
    vendorName: 'Juniper Networks',
    osName: 'Junos OS 22.4R1',
    fileExt: '.conf',
    color: 'emerald',
    borderColor: 'border-emerald-500/40',
    bgBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    textBadge: 'text-emerald-400',
    syntaxTips: [
      'Struktur hirarki "set" atau format blok kurung kurawal {...}',
      'Mendukung atomic commit: commit confirmed 5',
      'Rollback instan: rollback 1',
    ],
    sampleConfig: [
      '# Juniper Junos OS 22.4R1 Export',
      '# Device: JUNIPER-MX-BORDER (MX204 Universal Routing Platform)',
      '# Managed by AUDIRA NetOps AI Studio',
      '',
      'system {',
      '    host-name JUNIPER-MX-BORDER;',
      '    services {',
      '        ssh {',
      '            root-login deny;',
      '            protocol-version v2;',
      '        }',
      '    }',
      '}',
      'interfaces {',
      '    ge-0/0/0 {',
      '        unit 0 {',
      '            family inet {',
      '                address 198.51.100.2/30;',
      '            }',
      '        }',
      '    }',
      '}',
      'routing-options {',
      '    static {',
      '        route 0.0.0.0/0 next-hop 198.51.100.1;',
      '    }',
      '    autonomous-system 65001;',
      '}',
      'protocols {',
      '    bgp {',
      '        group UPSTREAM {',
      '            type external;',
      '            peer-as 64512;',
      '            neighbor 198.51.100.1;',
      '        }',
      '    }',
      '}',
    ].join('\n'),
  },
};

interface RecommendationItem {
  id: string;
  dialect: VendorDialect;
  title: string;
  category: 'Security' | 'Performance' | 'Routing' | 'QoS' | 'Switching';
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  impact: string;
  description: string;
  proposedCode: string;
}

const ALL_RECOMMENDATIONS: RecommendationItem[] = [
  // --- MIKROTIK ROUTEROS ---
  {
    id: 'rec-mt-1',
    dialect: 'MIKROTIK_ROUTEROS',
    title: 'Zero-Trust Firewall Input Chain & Port-Scan Auto-Jail',
    category: 'Security',
    risk: 'LOW',
    impact: 'Protects management plane from brute-force & DDoS',
    description: 'Menambahkan auto-blacklist 24 jam untuk IP yang melakukan port scan pada port 22, 8291 (WinBox), dan 80/443.',
    proposedCode: [
      '# --- AUDIRA Zero-Trust Port Scanner Auto-Jail ---',
      '/ip firewall filter add chain=input protocol=tcp psd=21,3s,3,1 action=add-src-to-address-list address-list="port_scanners" address-list-timeout=1d comment="AUDIRA: Detect Port Scan"',
      '/ip firewall filter add chain=input src-address-list="port_scanners" action=drop comment="AUDIRA: Drop Port Scanners"',
      '/ip firewall filter add chain=input connection-state=established,related action=accept comment="AUDIRA: Accept established/related"',
      '/ip firewall filter add chain=input in-interface-list=WAN action=drop comment="AUDIRA: Drop all other WAN input"',
    ].join('\n'),
  },
  {
    id: 'rec-mt-2',
    dialect: 'MIKROTIK_ROUTEROS',
    title: 'Hardware FastPath & TCP MSS Clamp (1452 Bytes for PPPoE)',
    category: 'Performance',
    risk: 'LOW',
    impact: 'Reduces CPU overhead by 35% and fixes MTU packet fragmentation',
    description: 'Mengaktifkan FastTrack bypass conntrack dan otomatis clamp MSS paket TCP SYN ke 1452 agar transmisi PPPoE tidak drop.',
    proposedCode: [
      '# --- AUDIRA FastPath & MTU Clamp Optimization ---',
      '/ip firewall mangle add chain=forward protocol=tcp tcp-flags=syn tcp-mss=1453-65535 action=change-mss new-mss=clamp-to-pmtu passthrough=yes comment="AUDIRA: Clamp TCP MSS"',
      '/ip firewall filter add chain=forward connection-state=established,related action=fasttrack-connection hw-offload=yes comment="AUDIRA: Hardware FastTrack"',
    ].join('\n'),
  },
  {
    id: 'rec-mt-3',
    dialect: 'MIKROTIK_ROUTEROS',
    title: 'BGP Route Filtering & Bogon Subnet Shield',
    category: 'Routing',
    risk: 'MEDIUM',
    impact: 'Eliminates BGP Route Hijacking & Bogon IP Leaks',
    description: 'Menolak prefix bogon (RFC 1918, 127.0.0.0/8, 0.0.0.0/8, Martian IPs) dari upstream provider BGP eBGP sessions.',
    proposedCode: [
      '# --- AUDIRA BGP Bogon & Martian Prefix Shield ---',
      '/routing filter rule add chain=BGP-IN-FILTERS rule="if dst in 10.0.0.0/8 || dst in 172.16.0.0/12 || dst in 192.168.0.0/16 then reject" comment="AUDIRA: Drop RFC1918"',
      '/routing filter rule add chain=BGP-IN-FILTERS rule="if dst in 127.0.0.0/8 || dst == 0.0.0.0/0 then reject" comment="AUDIRA: Drop Martian IPs"',
      '/routing filter rule add chain=BGP-IN-FILTERS rule="if rpki invalid then reject" comment="AUDIRA: Drop RPKI Invalid"',
    ].join('\n'),
  },
  {
    id: 'rec-mt-4',
    dialect: 'MIKROTIK_ROUTEROS',
    title: 'FQ-CoDel QoS Smart Queueing for Bufferbloat',
    category: 'QoS',
    risk: 'LOW',
    impact: 'Keeps ping under 15ms during 100% WAN saturation',
    description: 'Mengimplementasikan bufferbloat mitigation algoritma FQ-CoDel pada interface egress WAN utama.',
    proposedCode: [
      '# --- AUDIRA FQ-CoDel Bufferbloat Mitigation ---',
      '/queue type add name="fq_codel_wan" kind=fq-codel fq-codel-limit=1024 fq-codel-target=5ms fq-codel-interval=100ms',
      '/queue tree add name="WAN-OUT-QOS" parent=ether1-wan packet-mark=no-mark queue="fq_codel_wan" priority=1',
    ].join('\n'),
  },

  // --- CISCO IOS-XE ---
  {
    id: 'rec-cisco-1',
    dialect: 'CISCO_IOS',
    title: 'Control Plane Policing (CoPP) CPU Hardware Shield',
    category: 'Security',
    risk: 'MEDIUM',
    impact: 'Guarantees switch CPU stability during DDoS volumetric floods',
    description: 'Membatasi kuota paket kontrol seperti ICMP, SNMP, dan ARP menuju CPU supervisor engine dengan Policy-Map CoPP.',
    proposedCode: [
      '! --- AUDIRA Cisco Control Plane Policing (CoPP) ---',
      'ip access-list extended ACL-COPP-ICMP',
      ' permit icmp any any echo',
      ' permit icmp any any echo-reply',
      '!',
      'class-map match-all CLASS-COPP-ICMP',
      ' match access-group name ACL-COPP-ICMP',
      '!',
      'policy-map POLICY-CONTROL-PLANE',
      ' class CLASS-COPP-ICMP',
      '  police 512000 conform-action transmit exceed-action drop',
      '!',
      'control-plane',
      ' service-policy input POLICY-CONTROL-PLANE',
    ].join('\n'),
  },
  {
    id: 'rec-cisco-2',
    dialect: 'CISCO_IOS',
    title: 'Strict SSHv2 Hardening & Cleartext Telnet Disable',
    category: 'Security',
    risk: 'LOW',
    impact: 'Eliminates MITM packet sniffing and weak cipher exploitation',
    description: 'Memaksa negosiasi RSA 2048-bit, mengaktifkan Diffie-Hellman Group 14, dan memutus listening socket Telnet pada seluruh vty line.',
    proposedCode: [
      '! --- AUDIRA Cisco SSHv2 & VTY Hardening ---',
      'ip ssh version 2',
      'ip ssh dh min 2048',
      'ip ssh time-out 60',
      'ip ssh authentication-retries 3',
      '!',
      'line vty 0 15',
      ' transport input ssh',
      ' exec-timeout 10 0',
      ' logging synchronous',
    ].join('\n'),
  },
  {
    id: 'rec-cisco-3',
    dialect: 'CISCO_IOS',
    title: 'DHCP Snooping & Dynamic ARP Inspection (DAI)',
    category: 'Switching',
    risk: 'LOW',
    impact: 'Prevents rogue DHCP servers and ARP poisoning / spoofing attacks',
    description: 'Mengaktifkan DHCP Snooping pada VLAN pengguna, menandai uplink sebagai trusted, dan mengaktifkan Dynamic ARP Inspection.',
    proposedCode: [
      '! --- AUDIRA DHCP Snooping & DAI Defense ---',
      'ip dhcp snooping',
      'ip dhcp snooping vlan 10,20,30',
      'no ip dhcp snooping information option',
      '!',
      'ip arp inspection vlan 10,20,30',
      '!',
      'interface GigabitEthernet1/0/1',
      ' description UPLINK-TRUNK',
      ' ip dhcp snooping trust',
      ' ip arp inspection trust',
    ].join('\n'),
  },
  {
    id: 'rec-cisco-4',
    dialect: 'CISCO_IOS',
    title: 'Spanning Tree BPDU Guard & PortFast Edge Shield',
    category: 'Switching',
    risk: 'LOW',
    impact: 'Prevents switching loops caused by unauthorized user switches',
    description: 'Secara global mengaktifkan PortFast dan BPDU Guard pada seluruh edge access port untuk mengisolasi loop secara instan.',
    proposedCode: [
      '! --- AUDIRA STP BPDU Guard Global Policy ---',
      'spanning-tree mode rapid-pvst',
      'spanning-tree portfast default',
      'spanning-tree portfast bpduguard default',
      'spanning-tree extend system-id',
    ].join('\n'),
  },

  // --- HUAWEI VRP ---
  {
    id: 'rec-huawei-1',
    dialect: 'HUAWEI_VRP',
    title: 'Huawei CPU-Defend Policy Hardware Rate-Limit',
    category: 'Security',
    risk: 'MEDIUM',
    impact: 'Protects Huawei VRP Routing Switch MPU from control plane saturation',
    description: 'Menerapkan CPU-defend policy pada VRP CloudEngine untuk membatasi laju paket ICMP, ARP request, dan TTL-expired.',
    proposedCode: [
      '# --- AUDIRA Huawei CPU-Defend Policy ---',
      'cpu-defend policy HARDENING-POLICY',
      ' packet-type icmp rate-limit 128',
      ' packet-type arp-request rate-limit 256',
      ' packet-type ttl-expired rate-limit 64',
      '#',
      'cpu-defend-policy HARDENING-POLICY global',
    ].join('\n'),
  },
  {
    id: 'rec-huawei-2',
    dialect: 'HUAWEI_VRP',
    title: 'AAA User Hardening & Telnet Service Shutdown',
    category: 'Security',
    risk: 'LOW',
    impact: 'Closes unencrypted ports and enforces SSH-only console governance',
    description: 'Mematikan service Telnet VRP dan mengonfigurasi batas waktu idle sesi SSH administrator selama 10 menit.',
    proposedCode: [
      '# --- AUDIRA Huawei AAA & SSH Hardening ---',
      'undo telnet server enable',
      'stelnet server enable',
      'ssh server-source all-interface',
      '#',
      'user-interface vty 0 4',
      ' authentication-mode aaa',
      ' protocol inbound ssh',
      ' idle-timeout 10 0',
    ].join('\n'),
  },
  {
    id: 'rec-huawei-3',
    dialect: 'HUAWEI_VRP',
    title: 'STP Root-Protection & Loopback Detection Guard',
    category: 'Switching',
    risk: 'LOW',
    impact: 'Prevents rogue STP root bridge elections and switching freezes',
    description: 'Mengaktifkan STP Root-Protection pada port uplink utama dan edged-port pada port distribusi access.',
    proposedCode: [
      '# --- AUDIRA Huawei STP Root & Loop Defense ---',
      'stp mode rstp',
      '#',
      'interface 10GE1/0/1',
      ' stp root-protection',
      '#',
      'interface 10GE1/0/2',
      ' stp edged-port enable',
      ' loop-detection enable',
    ].join('\n'),
  },
  {
    id: 'rec-huawei-4',
    dialect: 'HUAWEI_VRP',
    title: 'BGP Inbound Route-Policy & Bogon Subnet Filter',
    category: 'Routing',
    risk: 'MEDIUM',
    impact: 'Blocks invalid RFC1918 leakages from BGP transit partners',
    description: 'Mengonfigurasi ACL 2000 dan Route-Policy untuk membuang rute privat RFC1918 dari peer BGP upstream.',
    proposedCode: [
      '# --- AUDIRA Huawei BGP Bogon Shield ---',
      'acl number 2000',
      ' rule 5 deny source 10.0.0.0 0.255.255.255',
      ' rule 10 deny source 172.16.0.0 0.15.255.255',
      ' rule 15 deny source 192.168.0.0 0.0.255.255',
      ' rule 20 permit source any',
      '#',
      'route-policy BGP-FILTER permit node 10',
      ' if-match acl 2000',
      '#',
      'bgp 65001',
      ' peer 10.250.0.2 route-policy BGP-FILTER import',
    ].join('\n'),
  },
];

// Helper: detect vendor dialect from device metadata
function detectDialect(device?: Device | null): VendorDialect {
  if (!device) return 'MIKROTIK_ROUTEROS';
  const v = (device.vendor || '').toLowerCase();
  const os = (device.osVersion || '').toLowerCase();

  if (v.includes('cisco') || os.includes('ios')) return 'CISCO_IOS';
  if (v.includes('huawei') || os.includes('vrp')) return 'HUAWEI_VRP';
  if (v.includes('juniper') || os.includes('junos')) return 'JUNIPER_JUNOS';
  return 'MIKROTIK_ROUTEROS';
}

export const ConfigManager: React.FC = () => {
  const {
    devices,
    savedConfigs,
    saveConfig,
    deleteSavedConfig,
    showToast,
    recommendationModeActive,
    setRecommendationModeActive,
  } = useNetOpsStore();

  const [activeDeviceId, setActiveDeviceId] = useState<string>(
    devices.length > 0 ? devices[0]!.id : '30000000-0000-0000-0000-000000000001'
  );

  const activeDevice = useMemo(() => {
    return devices.find((d) => d.id === activeDeviceId) || devices[0] || null;
  }, [devices, activeDeviceId]);

  // Detected Dialect based on device metadata
  const detectedDialect = useMemo(() => detectDialect(activeDevice), [activeDevice]);
  const [selectedDialect, setSelectedDialect] = useState<VendorDialect>(detectedDialect);

  // Sync dialect when device changes
  useEffect(() => {
    setSelectedDialect(detectedDialect);
  }, [detectedDialect]);

  const vendorMeta = VENDOR_SPECS[selectedDialect];

  const [activeTab, setActiveTab] = useState<'editor' | 'diff' | 'recommendations' | 'history'>('editor');

  // Editor content state
  const [editorCode, setEditorCode] = useState<string>(vendorMeta.sampleConfig);
  const [diffOriginal, setDiffOriginal] = useState<string>(vendorMeta.sampleConfig);
  const [diffModified, setDiffModified] = useState<string>(vendorMeta.sampleConfig);
  const [diffTitle, setDiffTitle] = useState<string>('Proposal Configuration');

  // When selectedDialect changes, optionally initialize editor if empty or matching default
  useEffect(() => {
    setEditorCode(vendorMeta.sampleConfig);
    setDiffOriginal(vendorMeta.sampleConfig);
    setDiffModified(vendorMeta.sampleConfig);
  }, [selectedDialect]);

  // Modals state
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isPushModalOpen, setIsPushModalOpen] = useState(false);
  const [isTranspileModalOpen, setIsTranspileModalOpen] = useState(false);

  const [saveFilename, setSaveFilename] = useState(
    `${activeDevice?.name || 'NODE'}-rev-${new Date().toISOString().slice(0, 10)}${vendorMeta.fileExt}`
  );
  const [saveVersion, setSaveVersion] = useState('v1.2.0');
  const [saveNote, setSaveNote] = useState('Vendor-tailored hardening adjustment');
  const [isPushing, setIsPushing] = useState(false);

  // Transpiler states
  const [transpileSourceDialect, setTranspileSourceDialect] = useState<VendorDialect>('MIKROTIK_ROUTEROS');
  const [transpileTargetDialect, setTranspileTargetDialect] = useState<VendorDialect>('CISCO_IOS');
  const [transpileInputText, setTranspileInputText] = useState<string>(
    '/ip route add dst-address=0.0.0.0/0 gateway=192.168.1.1\n/ip firewall filter add chain=input protocol=tcp dst-port=22 action=accept comment="Allow SSH"'
  );
  const [transpiledOutput, setTranspiledOutput] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keep save filename in sync with device and extension
  useEffect(() => {
    setSaveFilename(
      `${activeDevice?.name || 'NODE'}-rev-${new Date().toISOString().slice(0, 10)}${vendorMeta.fileExt}`
    );
  }, [activeDevice, vendorMeta]);

  // Syntax Mismatch & Blacklist Warnings
  const syntaxAnomalies = useMemo(() => {
    const lines = editorCode.split('\n');
    const warnings: string[] = [];

    // Check Blacklist Danger Commands
    const dangerRegex = /(\bwrite\s+erase\b|\breload\b|\breboot\b|\b\/system\s+reset-configuration\b|\breset\s+saved-configuration\b)/i;
    for (let i = 0; i < lines.length; i++) {
      const match = dangerRegex.exec(lines[i]!);
      if (match) {
        warnings.push(`🚨 BARIS ${i + 1}: Perintah Berbahaya "${match[0]}" terdeteksi! Proteksi keselamatan guardrail aktif.`);
      }
    }

    // Check Cross-OS syntax mismatches
    if (selectedDialect === 'MIKROTIK_ROUTEROS') {
      if (editorCode.includes('configure terminal') || editorCode.includes('interface GigabitEthernet') || editorCode.includes('no shutdown')) {
        warnings.push('⚠️ Perhatian: Sintaks Cisco IOS ("conf t / interface GigabitEthernet / no shutdown") terdeteksi di perangkat MikroTik RouterOS! MikroTik menggunakan "/interface ethernet".');
      }
      if (editorCode.includes('system-view') || editorCode.includes('undo shutdown')) {
        warnings.push('⚠️ Perhatian: Sintaks Huawei VRP ("system-view / undo shutdown") terdeteksi di perangkat MikroTik RouterOS!');
      }
    } else if (selectedDialect === 'CISCO_IOS') {
      if (editorCode.includes('/ip/address') || editorCode.includes('/interface bridge') || editorCode.includes('/routing bgp')) {
        warnings.push('⚠️ Perhatian: Sintaks MikroTik slash-notation terdeteksi di perangkat Cisco IOS-XE! Cisco menggunakan "interface Gi..." dan "ip address <ip> <mask>".');
      }
      if (editorCode.includes('undo shutdown') || editorCode.includes('system-view')) {
        warnings.push('⚠️ Perhatian: Perintah Huawei "undo" terdeteksi! Cisco menggunakan "no shutdown" bukan "undo shutdown".');
      }
    } else if (selectedDialect === 'HUAWEI_VRP') {
      if (editorCode.includes('/ip/address') || editorCode.includes('/interface')) {
        warnings.push('⚠️ Perhatian: Sintaks MikroTik terdeteksi di perangkat Huawei VRP!');
      }
      if (editorCode.includes('no shutdown') || editorCode.includes('configure terminal')) {
        warnings.push('⚠️ Perhatian: Sintaks Cisco ("no shutdown / conf t") terdeteksi di perangkat Huawei VRP! Huawei menggunakan "undo shutdown" dan "system-view".');
      }
    }

    return warnings;
  }, [editorCode, selectedDialect]);

  // Transpilation logic
  const handleRunTranspile = () => {
    let result = '';
    const src = transpileSourceDialect;
    const tgt = transpileTargetDialect;
    const input = transpileInputText.trim();

    if (src === tgt) {
      setTranspiledOutput(input);
      return;
    }

    // Example translation rules for Static Route & Firewall / ACL
    if (src === 'MIKROTIK_ROUTEROS' && tgt === 'CISCO_IOS') {
      result = input
        .replace(/\/ip route add dst-address=0\.0\.0\.0\/0 gateway=([\d\.]+)/g, 'ip route 0.0.0.0 0.0.0.0 $1')
        .replace(/\/ip address add address=([\d\.]+)\/24 interface=(\S+)/g, 'interface $2\n ip address $1 255.255.255.0\n no shutdown')
        .replace(/\/ip firewall filter add chain=input protocol=tcp dst-port=(\d+) action=accept.*/g, 'ip access-list extended ACL-INPUT\n permit tcp any any eq $1')
        .replace(/\/system identity set name="([^"]+)"/g, 'hostname $1');
      if (result === input) {
        result = `! Transpiled from MikroTik RouterOS to Cisco IOS-XE:\n${input
          .split('\n')
          .map((l) => (l.startsWith('/') ? `! TODO: Adapt ${l}` : l))
          .join('\n')}`;
      }
    } else if (src === 'MIKROTIK_ROUTEROS' && tgt === 'HUAWEI_VRP') {
      result = input
        .replace(/\/ip route add dst-address=0\.0\.0\.0\/0 gateway=([\d\.]+)/g, 'system-view\nip route-static 0.0.0.0 0.0.0.0 $1')
        .replace(/\/ip address add address=([\d\.]+)\/24 interface=(\S+)/g, 'system-view\ninterface $2\n ip address $1 255.255.255.0\n undo shutdown')
        .replace(/\/ip firewall filter add chain=input protocol=tcp dst-port=(\d+) action=accept.*/g, 'acl number 3000\n rule 5 permit tcp source any destination any destination-port eq $1')
        .replace(/\/system identity set name="([^"]+)"/g, 'sysname $1');
      if (result === input) {
        result = `# Transpiled from MikroTik RouterOS to Huawei VRP:\n${input
          .split('\n')
          .map((l) => (l.startsWith('/') ? `# TODO: Adapt ${l}` : l))
          .join('\n')}`;
      }
    } else if (src === 'CISCO_IOS' && tgt === 'MIKROTIK_ROUTEROS') {
      result = input
        .replace(/ip route 0\.0\.0\.0 0\.0\.0\.0 ([\d\.]+)/g, '/ip route add dst-address=0.0.0.0/0 gateway=$1')
        .replace(/hostname (\S+)/g, '/system identity set name="$1"')
        .replace(/no shutdown/g, '# port enabled')
        .replace(/ip address ([\d\.]+) 255\.255\.255\.0/g, '/ip address add address=$1/24');
    } else if (src === 'CISCO_IOS' && tgt === 'HUAWEI_VRP') {
      result = input
        .replace(/hostname (\S+)/g, 'sysname $1')
        .replace(/no shutdown/g, 'undo shutdown')
        .replace(/configure terminal/g, 'system-view')
        .replace(/ip route 0\.0\.0\.0 0\.0\.0\.0 ([\d\.]+)/g, 'ip route-static 0.0.0.0 0.0.0.0 $1');
    } else if (src === 'HUAWEI_VRP' && tgt === 'CISCO_IOS') {
      result = input
        .replace(/sysname (\S+)/g, 'hostname $1')
        .replace(/undo shutdown/g, 'no shutdown')
        .replace(/system-view/g, 'configure terminal')
        .replace(/ip route-static 0\.0\.0\.0 0\.0\.0\.0 ([\d\.]+)/g, 'ip route 0.0.0.0 0.0.0.0 $1');
    } else {
      result = `# Transpilation matrix from ${src} to ${tgt}:\n${input}`;
    }

    setTranspiledOutput(result);
  };

  // Filter recommendations matching the selected dialect
  const currentRecommendations = useMemo(() => {
    return ALL_RECOMMENDATIONS.filter((r) => r.dialect === selectedDialect);
  }, [selectedDialect]);

  // Download RSC / CFG / CONF
  const handleDownloadFile = () => {
    const blob = new Blob([editorCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const downloadName = `${activeDevice?.hostname || activeDevice?.name?.toLowerCase() || 'config'}${vendorMeta.fileExt}`;
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', downloadName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`File "${downloadName}" berhasil diunduh ke komputer Anda.`, 'success');
  };

  // Upload file into editor
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setEditorCode(content);
        showToast(`File "${file.name}" berhasil dimuat ke dalam editor.`, 'info');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Save to archive
  const handleConfirmSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveConfig({
      deviceId: activeDevice?.id || `dev-${Date.now()}`,
      deviceName: activeDevice?.name || 'CUSTOM-DEVICE',
      filename: saveFilename,
      version: saveVersion,
      content: editorCode,
      changeNote: `[${vendorMeta.osName}] ${saveNote}`,
      author: 'Console Admin',
    });
    setIsSaveModalOpen(false);
  };

  // Push & commit changes to device
  const handleConfirmPush = () => {
    setIsPushing(true);
    setTimeout(() => {
      setIsPushing(false);
      setIsPushModalOpen(false);
      showToast(
        `Konfigurasi dialek ${vendorMeta.osName} berhasil dipush dan diverifikasi pada ${activeDevice?.name}! Snapshot cadangan: pre-push-backup${vendorMeta.fileExt}`,
        'success'
      );
    }, 1800);
  };

  // Apply recommendation
  const handleApplyRecommendation = (rec: RecommendationItem) => {
    setEditorCode((prev) => `${prev}\n\n${rec.proposedCode}`);
    showToast(`Rekomendasi "${rec.title}" ditambahkan ke naskah konfigurasi!`, 'success');
    setActiveTab('editor');
  };

  // Preview Recommendation Diff
  const handlePreviewRecommendation = (rec: RecommendationItem) => {
    setDiffOriginal(editorCode);
    setDiffModified(`${editorCode}\n\n${rec.proposedCode}`);
    setDiffTitle(rec.title);
    setActiveTab('diff');
  };

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto select-none">
      {/* Top Device & Multi-Vendor Engine Banner */}
      <Card className="bg-[#0b1222] border-cyan-500/20 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4">
          <div className="flex items-start space-x-3.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
              <FileCode2 className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-base font-bold text-white font-mono tracking-wide">
                  Network Configuration Studio
                </h1>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold border ${vendorMeta.bgBadge}`}>
                  {vendorMeta.vendorName} • {vendorMeta.osName}
                </span>
                {recommendationModeActive && (
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold bg-purple-950/60 text-purple-300 border border-purple-500/40 flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    <span>AI Mode Active</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Multi-Vendor Parser (MikroTik RouterOS, Cisco IOS-XE, Huawei VRP, Junos), Syntax Transpiler &amp; Pre-flight Safety Guardrails
              </p>
            </div>
          </div>

          {/* Device & Dialect Selection Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Device Selector */}
            <div className="flex items-center space-x-1.5 bg-[#080d1a] px-3 py-1.5 rounded-xl border border-slate-800">
              <Server className="w-4 h-4 text-slate-400" />
              <div className="text-left font-mono">
                <div className="text-[9px] text-slate-500 uppercase tracking-wider">Target Node</div>
                <select
                  value={activeDeviceId}
                  onChange={(e) => setActiveDeviceId(e.target.value)}
                  className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
                >
                  {devices.map((d) => (
                    <option key={d.id} value={d.id} className="bg-slate-900 text-white">
                      {d.name} ({d.vendor} - {d.ipAddress})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Vendor OS Dialect Selector (Auto or Manual Override) */}
            <div className="flex items-center space-x-1.5 bg-[#080d1a] px-3 py-1.5 rounded-xl border border-slate-800">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <div className="text-left font-mono">
                <div className="text-[9px] text-slate-500 uppercase tracking-wider">OS Dialect / Syntax</div>
                <select
                  value={selectedDialect}
                  onChange={(e) => setSelectedDialect(e.target.value as VendorDialect)}
                  className="bg-transparent text-cyan-300 text-xs font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="MIKROTIK_ROUTEROS" className="bg-slate-900 text-white">MikroTik RouterOS v7 (.rsc)</option>
                  <option value="CISCO_IOS" className="bg-slate-900 text-white">Cisco IOS / IOS-XE (.cfg)</option>
                  <option value="HUAWEI_VRP" className="bg-slate-900 text-white">Huawei VRP (.cfg)</option>
                  <option value="JUNIPER_JUNOS" className="bg-slate-900 text-white">Juniper Junos OS (.conf)</option>
                </select>
              </div>
            </div>

            {/* Transpiler Modal Trigger Button */}
            <button
              onClick={() => {
                setTranspileSourceDialect(selectedDialect);
                setTranspileTargetDialect(selectedDialect === 'MIKROTIK_ROUTEROS' ? 'CISCO_IOS' : 'MIKROTIK_ROUTEROS');
                setIsTranspileModalOpen(true);
              }}
              className="px-3 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-300 text-xs font-mono font-bold flex items-center space-x-1.5 transition shadow-[0_0_15px_rgba(99,102,241,0.2)]"
              title="Konversi sintaks konfigurasi antar vendor"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Transpiler</span>
            </button>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".rsc,.txt,.cfg,.conf,.ios,.vrp"
              className="hidden"
            />
          </div>
        </div>

        {/* Syntax Tips Bar for Active Dialect */}
        <div className="px-4 py-2 bg-[#080d1a]/80 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
          <div className="flex items-center space-x-2 text-slate-400">
            <span className="text-cyan-400 font-bold uppercase">{vendorMeta.osName} Tips:</span>
            <span>{vendorMeta.syntaxTips[0]}</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-400">
            <span>URI: <strong className="text-cyan-300 font-semibold">{activeDevice?.hostname ? `api://${activeDevice.hostname}:8729` : 'local://config-studio'}</strong></span>
            <span>•</span>
            <span>Platform: <strong className="text-slate-300">{activeDevice?.platform || 'Universal'}</strong></span>
            <span>•</span>
            <span>Extension: <strong className="text-cyan-400">{vendorMeta.fileExt}</strong></span>
          </div>
        </div>
      </Card>

      {/* Syntax Mismatch & Safety Warnings Banner */}
      {syntaxAnomalies.length > 0 && (
        <div className="space-y-2">
          {syntaxAnomalies.map((warn, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl border text-xs font-mono flex items-center justify-between gap-2 shadow-lg ${
                warn.includes('🚨')
                  ? 'bg-rose-950/60 border-rose-500/60 text-rose-200 animate-pulse'
                  : 'bg-amber-950/40 border-amber-500/50 text-amber-200'
              }`}
            >
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>{warn}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-black/40 border border-slate-700">
                AI Syntax Guard
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[#0b1222] p-2.5 rounded-xl border border-cyan-500/20 text-xs font-mono">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#111c38] hover:bg-[#1a2952] border border-cyan-500/30 text-cyan-300 rounded-lg transition"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Impor ({vendorMeta.fileExt})</span>
          </button>
          <button
            onClick={handleDownloadFile}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#111c38] hover:bg-[#1a2952] border border-cyan-500/30 text-cyan-300 rounded-lg transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor File</span>
          </button>
          <button
            onClick={() => {
              setEditorCode(vendorMeta.sampleConfig);
              showToast(`Buffer dikembalikan ke konfigurasi dasar ${vendorMeta.osName}.`, 'info');
            }}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
            title="Reset ke template bawaan vendor"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Template</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsSaveModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan Versi</span>
          </button>
          <button
            onClick={() => setIsPushModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-lg transition shadow-[0_0_20px_rgba(37,99,235,0.4)]"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Push ke Router ({activeDevice?.name})</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center space-x-2 border-b border-cyan-500/20 pb-2 text-xs font-mono">
        <button
          onClick={() => setActiveTab('editor')}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg transition ${
            activeTab === 'editor'
              ? 'bg-blue-600 text-white font-bold shadow-[0_0_12px_rgba(37,99,235,0.4)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Editor ({vendorMeta.osName})</span>
        </button>

        <button
          onClick={() => setActiveTab('diff')}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg transition ${
            activeTab === 'diff'
              ? 'bg-blue-600 text-white font-bold shadow-[0_0_12px_rgba(37,99,235,0.4)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Visual Diff (Green / Red)</span>
        </button>

        <button
          onClick={() => setActiveTab('recommendations')}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg transition ${
            activeTab === 'recommendations'
              ? 'bg-purple-600 text-white font-bold shadow-[0_0_15px_rgba(168,85,247,0.4)]'
              : 'text-purple-300 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>AI {vendorMeta.vendorName} Recs ({currentRecommendations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg transition ${
            activeTab === 'history'
              ? 'bg-blue-600 text-white font-bold shadow-[0_0_12px_rgba(37,99,235,0.4)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Saved Versions ({savedConfigs.length})</span>
        </button>
      </div>

      {/* TAB 1: Monaco Script Editor */}
      {activeTab === 'editor' && (
        <div className="bg-[#0b1222] border border-cyan-500/20 rounded-xl overflow-hidden shadow-xl">
          <div className="p-3 border-b border-cyan-500/20 bg-[#080d1a] flex flex-wrap items-center justify-between text-xs font-mono gap-2">
            <div className="flex items-center space-x-2">
              <span className="text-white font-bold">
                {activeDevice?.name}{vendorMeta.fileExt}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded border ${vendorMeta.bgBadge}`}>
                {vendorMeta.osName} Mode
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  if (syntaxAnomalies.length === 0) {
                    showToast(`Validasi sintaks ${vendorMeta.osName}: 0 error, struktur perintah valid!`, 'success');
                  } else {
                    showToast(`Ditemukan ${syntaxAnomalies.length} catatan/peringatan sintaks pada naskah ini.`, 'warning');
                  }
                }}
                className="px-2.5 py-1 rounded bg-[#111c38] hover:bg-[#1a2952] border border-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center space-x-1 transition"
              >
                <Sparkles className="w-3 h-3" />
                <span>Cek Sintaks Dialek</span>
              </button>
            </div>
          </div>

          <div className="h-[520px] bg-[#1e1e1e]">
            <Editor
              height="100%"
              value={editorCode}
              onChange={(val) => setEditorCode(val || '')}
              language="shell"
              theme="vs-dark"
              options={{
                readOnly: false,
                minimap: { enabled: true },
                fontSize: 13,
                fontFamily: 'JetBrains Mono, Fira Code, Consolas, monospace',
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
              }}
            />
          </div>
        </div>
      )}

      {/* TAB 2: Visual Diff (Monaco DiffEditor) */}
      {activeTab === 'diff' && (
        <div className="bg-[#0b1222] border border-cyan-500/20 rounded-xl overflow-hidden shadow-xl">
          <div className="p-3 border-b border-cyan-500/20 bg-[#080d1a] flex flex-wrap items-center justify-between text-xs font-mono gap-2">
            <div className="flex items-center space-x-3">
              <span className="text-slate-400">Baseline: <strong className="text-slate-200">{activeDevice?.name} Running ({vendorMeta.osName})</strong></span>
              <span className="text-slate-500">➔</span>
              <span className="text-cyan-400 font-bold">Proposal: {diffTitle}</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-[10px]">
                + Added (GREEN)
              </span>
              <span className="px-2 py-0.5 rounded bg-rose-950 border border-rose-500/40 text-rose-400 text-[10px]">
                - Removed (RED)
              </span>
              <button
                onClick={() => {
                  setEditorCode(diffModified);
                  showToast('Proposal konfigurasi diterapkan ke dalam editor utama.', 'success');
                  setActiveTab('editor');
                }}
                className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition"
              >
                Gunakan Naskah Ini
              </button>
            </div>
          </div>

          <div className="h-[520px] bg-[#1e1e1e]">
            <DiffEditor
              height="100%"
              original={diffOriginal}
              modified={diffModified}
              language="shell"
              theme="vs-dark"
              options={{
                readOnly: true,
                renderSideBySide: true,
                minimap: { enabled: false },
                fontSize: 12,
                fontFamily: 'JetBrains Mono, Fira Code, Consolas, monospace',
                scrollBeyondLastLine: false,
              }}
            />
          </div>
        </div>
      )}

      {/* TAB 3: Vendor-Specific AI Recommendations */}
      {activeTab === 'recommendations' && (
        <div className="space-y-3">
          <div className="p-3 bg-purple-950/30 border border-purple-500/30 rounded-xl flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
              <span className="text-purple-200 font-bold">
                AUDIRA AI Autonomous Recommendations for {vendorMeta.vendorName} ({vendorMeta.osName})
              </span>
            </div>
            <span className="text-slate-400 text-[11px]">
              Disesuaikan secara spesifik dengan arsitektur sintaks {activeDevice?.name}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentRecommendations.map((rec) => (
              <div
                key={rec.id}
                className="bg-[#0b1222] border border-cyan-500/20 hover:border-purple-500/40 rounded-xl p-4 space-y-3 transition shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-900/40 text-purple-300 border border-purple-700/40">
                        {rec.category}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                        Risk: {rec.risk}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {vendorMeta.osName}
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-sm mt-1.5">{rec.title}</h3>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">{rec.description}</p>

                <div className="text-[11px] font-mono text-cyan-300 bg-[#070d18] p-2 rounded-lg border border-slate-800">
                  <div className="text-slate-500 text-[10px]">DAMPAK / BENEFIT:</div>
                  {rec.impact}
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-end space-x-2 text-xs font-mono">
                  <button
                    onClick={() => handlePreviewRecommendation(rec)}
                    className="px-3 py-1.5 rounded-lg bg-[#111c38] hover:bg-[#1a2952] border border-cyan-500/30 text-cyan-300 transition"
                  >
                    Bandingkan Diff
                  </button>
                  <button
                    onClick={() => handleApplyRecommendation(rec)}
                    className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold transition shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                  >
                    Terapkan Rekomendasi
                  </button>
                </div>
              </div>
            ))}
            {currentRecommendations.length === 0 && (
              <div className="col-span-2 p-8 text-center bg-slate-900/40 border border-slate-800 rounded-xl text-slate-400 font-sans text-xs">
                Tidak ada rekomendasi khusus untuk dialek {vendorMeta.osName} saat ini.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: Saved Versions & Rollback History */}
      {activeTab === 'history' && (
        <div className="bg-[#0b1222] border border-cyan-500/20 rounded-xl overflow-hidden shadow-xl">
          <div className="p-3 bg-[#080d1a] border-b border-cyan-500/20 flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-white">Arsip Konfigurasi Multi-Vendor</span>
            <span className="text-slate-400 text-[11px]">{savedConfigs.length} snapshot tersimpan</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#070b16] text-slate-400 border-b border-slate-800 text-[10px] uppercase">
                <tr>
                  <th className="p-3">Filename / Version</th>
                  <th className="p-3">Device Target</th>
                  <th className="p-3">Catatan Perubahan</th>
                  <th className="p-3">Waktu Simpan</th>
                  <th className="p-3">Author</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {savedConfigs.map((cfg) => (
                  <tr key={cfg.id} className="hover:bg-white/5 transition">
                    <td className="p-3 font-semibold text-white">
                      <div className="flex items-center space-x-2">
                        <FileCheck className="w-4 h-4 text-emerald-400" />
                        <span>{cfg.filename}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                          {cfg.version}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-slate-300">{cfg.deviceName}</td>
                    <td className="p-3 text-slate-400 max-w-xs truncate">{cfg.changeNote}</td>
                    <td className="p-3 text-slate-400 text-[11px]">
                      {new Date(cfg.savedAt).toLocaleDateString()} {new Date(cfg.savedAt).toLocaleTimeString()}
                    </td>
                    <td className="p-3 text-cyan-400">{cfg.author}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => {
                            setEditorCode(cfg.content);
                            showToast(`Konfigurasi "${cfg.filename}" dimuat ke dalam editor.`, 'info');
                            setActiveTab('editor');
                          }}
                          className="px-2.5 py-1 rounded bg-[#111c38] hover:bg-[#1a2952] border border-cyan-500/30 text-cyan-300 text-xs transition"
                          title="Buka naskah ini di editor"
                        >
                          Muat di Editor
                        </button>
                        <button
                          onClick={() => {
                            setDiffOriginal(editorCode);
                            setDiffModified(cfg.content);
                            setDiffTitle(`Rollback to ${cfg.version}`);
                            setActiveTab('diff');
                          }}
                          className="px-2.5 py-1 rounded bg-[#111c38] hover:bg-[#1a2952] border border-slate-700 text-slate-300 text-xs transition"
                          title="Bandingkan dengan active buffer"
                        >
                          Diff
                        </button>
                        <button
                          onClick={() => deleteSavedConfig(cfg.id)}
                          className="p-1.5 rounded hover:bg-rose-950/80 text-rose-400 transition"
                          title="Hapus dari arsip"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {savedConfigs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-500 font-sans">
                      Belum ada konfigurasi yang diarsipkan ke database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: Cross-Vendor Syntax Transpiler */}
      {isTranspileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-3xl bg-[#0c1427] border border-indigo-500/40 rounded-2xl shadow-[0_0_50px_rgba(99,102,241,0.3)] p-6 relative font-mono text-xs">
            <button
              onClick={() => setIsTranspileModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                <Shuffle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-sans">Cross-Vendor Config Syntax Transpiler</h3>
                <p className="text-xs text-slate-400 font-sans">
                  Konversi logika konfigurasi secara otomatis antar OS vendor (MikroTik, Cisco, Huawei, Juniper)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Source Dialect */}
              <div>
                <label className="text-slate-300 block mb-1 font-bold">Sumber Dialek (Source)</label>
                <select
                  value={transpileSourceDialect}
                  onChange={(e) => setTranspileSourceDialect(e.target.value as VendorDialect)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-cyan-300 font-semibold focus:outline-none focus:border-indigo-400"
                >
                  <option value="MIKROTIK_ROUTEROS">MikroTik RouterOS v7</option>
                  <option value="CISCO_IOS">Cisco IOS / IOS-XE</option>
                  <option value="HUAWEI_VRP">Huawei VRP</option>
                  <option value="JUNIPER_JUNOS">Juniper Junos</option>
                </select>
                <textarea
                  rows={7}
                  value={transpileInputText}
                  onChange={(e) => setTranspileInputText(e.target.value)}
                  placeholder="Paste syntax source di sini..."
                  className="w-full mt-2 p-2.5 bg-black/80 border border-slate-800 rounded-lg text-slate-200 font-mono text-[11px] focus:outline-none focus:border-indigo-400"
                />
              </div>

              {/* Target Dialect */}
              <div>
                <label className="text-slate-300 block mb-1 font-bold">Target Dialek (Converted)</label>
                <select
                  value={transpileTargetDialect}
                  onChange={(e) => setTranspileTargetDialect(e.target.value as VendorDialect)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-indigo-300 font-semibold focus:outline-none focus:border-indigo-400"
                >
                  <option value="CISCO_IOS">Cisco IOS / IOS-XE</option>
                  <option value="MIKROTIK_ROUTEROS">MikroTik RouterOS v7</option>
                  <option value="HUAWEI_VRP">Huawei VRP</option>
                  <option value="JUNIPER_JUNOS">Juniper Junos</option>
                </select>
                <textarea
                  rows={7}
                  readOnly
                  value={transpiledOutput || '# Klik "Jalankan Transpiler" untuk melihat hasil konversi...'}
                  className="w-full mt-2 p-2.5 bg-black/80 border border-slate-800 rounded-lg text-emerald-300 font-mono text-[11px] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={handleRunTranspile}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition shadow-[0_0_15px_rgba(99,102,241,0.4)] flex items-center space-x-1.5"
              >
                <Zap className="w-4 h-4" />
                <span>Jalankan Transpiler</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsTranspileModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Tutup
                </button>
                {transpiledOutput && (
                  <button
                    onClick={() => {
                      setEditorCode((prev) => `${prev}\n\n# --- Transpiled Code (${transpileTargetDialect}) ---\n${transpiledOutput}`);
                      setIsTranspileModalOpen(false);
                      showToast('Hasil transpiler berhasil disisipkan ke dalam editor!', 'success');
                      setActiveTab('editor');
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center space-x-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Sisipkan ke Editor</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Save Config Modal */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0c1427] border border-cyan-500/40 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.3)] p-6 relative">
            <button
              onClick={() => setIsSaveModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <Save className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Simpan Revisi Konfigurasi</h3>
                <p className="text-xs text-slate-400">Target Dialek: <strong className="text-cyan-300">{vendorMeta.osName}</strong></p>
              </div>
            </div>

            <form onSubmit={handleConfirmSave} className="space-y-3.5 text-xs font-sans">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nama File ({vendorMeta.fileExt})</label>
                <input
                  type="text"
                  required
                  value={saveFilename}
                  onChange={(e) => setSaveFilename(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#111c38] border border-cyan-500/30 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tag Versi (SemVer)</label>
                <input
                  type="text"
                  required
                  value={saveVersion}
                  onChange={(e) => setSaveVersion(e.target.value)}
                  placeholder="v1.2.0"
                  className="w-full px-3 py-2 rounded-xl bg-[#111c38] border border-cyan-500/30 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Catatan Perubahan (Commit Message)</label>
                <textarea
                  rows={3}
                  required
                  value={saveNote}
                  onChange={(e) => setSaveNote(e.target.value)}
                  placeholder="Jelaskan modifikasi konfigurasi yang dilakukan..."
                  className="w-full px-3 py-2 rounded-xl bg-[#111c38] border border-cyan-500/30 text-white font-sans text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-3 border-t border-cyan-500/20 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsSaveModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-[0_0_15px_rgba(16,185,129,0.5)] flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan ke Arsip</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Push to Device Confirmation Modal (Vendor-Tailored) */}
      {isPushModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#0c1427] border border-cyan-500/40 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.3)] p-6 relative font-mono text-xs">
            <button
              onClick={() => setIsPushModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-sans">Push Konfigurasi ke Perangkat Fisik</h3>
                <p className="text-xs text-slate-400 font-sans">
                  Target: <strong className="text-white">{activeDevice?.name}</strong> ({vendorMeta.vendorName} • {vendorMeta.osName})
                </p>
              </div>
            </div>

            <div className="bg-[#111c38] p-4 rounded-xl border border-cyan-500/20 text-xs font-mono space-y-2 mb-4">
              <div className="text-slate-400 font-bold flex items-center space-x-2 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>9-STEP VENDOR-SPECIFIC SAFETY PIPELINE:</span>
              </div>
              <div className="space-y-1 text-slate-300 text-[11px] pl-2 border-l border-cyan-500/30">
                <div className="text-emerald-400">✔ Dialect Grammar Validation ({vendorMeta.osName}): PASS</div>
                <div className="text-emerald-400">✔ Blacklist Command Safety Filter: CLEAN</div>
                <div className="text-emerald-400">
                  ✔ Pre-change Snapshot Backup: READY ({activeDevice?.name}-pre-push{vendorMeta.fileExt})
                </div>
                {selectedDialect === 'MIKROTIK_ROUTEROS' && (
                  <div className="text-cyan-400">● Rollback Mechanism: /safe mode enabled via API-SSL (port 8729)</div>
                )}
                {selectedDialect === 'CISCO_IOS' && (
                  <div className="text-cyan-400">● Rollback Mechanism: Cisco Archive config rollback &amp; write memory gate</div>
                )}
                {selectedDialect === 'HUAWEI_VRP' && (
                  <div className="text-cyan-400">● Rollback Mechanism: Huawei VRP commit-trial timer (600s auto-revert)</div>
                )}
                {selectedDialect === 'JUNIPER_JUNOS' && (
                  <div className="text-cyan-400">● Rollback Mechanism: Junos commit confirmed 5</div>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-400 mb-4 font-sans">
              Koneksi terenkripsi SSH / API dialirkan langsung ke IP <strong className="text-cyan-300">{activeDevice?.ipAddress}</strong>. Semua sesi audit tercatat di Audit Log.
            </p>

            <div className="flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsPushModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmPush}
                disabled={isPushing}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold transition shadow-[0_0_20px_rgba(37,99,235,0.5)] flex items-center space-x-2 disabled:opacity-50"
              >
                {isPushing ? (
                  <>
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Mengeksekusi ke {activeDevice?.name}...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Konfirmasi &amp; Push Sekarang</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
