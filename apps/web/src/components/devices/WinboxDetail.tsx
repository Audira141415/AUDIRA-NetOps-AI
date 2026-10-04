// WinBox-style Comprehensive Device Management Component

import React, { useState } from 'react';
import {
  ArrowLeft,
  Server,
  Activity,
  Network,
  Shield,
  Layers,
  Terminal as TerminalIcon,
  FileCode2,
  HardDriveDownload,
  Bot,
  ListFilter,
  CheckCircle2,
  Clock,
  Cpu,
  HardDrive,
  Thermometer,
} from 'lucide-react';
import { Device, DeviceTab, useNetOpsStore } from '../../store/useNetOpsStore';

interface WinboxDetailProps {
  device: Device;
}

export const WinboxDetail: React.FC<WinboxDetailProps> = ({ device }) => {
  const { setSelectedDevice, addTerminalTab, setAiDrawerOpen, setCurrentTab } = useNetOpsStore();
  const [activeTab, setActiveTab] = useState<DeviceTab>('overview');

  const TABS: { id: DeviceTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'interfaces', label: 'Interfaces' },
    { id: 'ip-addresses', label: 'IP Addresses' },
    { id: 'routes', label: 'Routes' },
    { id: 'firewall', label: 'Firewall' },
    { id: 'nat', label: 'NAT' },
    { id: 'dhcp', label: 'DHCP' },
    { id: 'dns', label: 'DNS' },
    { id: 'vlan', label: 'VLAN' },
    { id: 'bridge', label: 'Bridge' },
    { id: 'vpn', label: 'VPN' },
    { id: 'queues', label: 'Queues' },
    { id: 'logs', label: 'Logs' },
    { id: 'terminal', label: 'Terminal' },
    { id: 'configuration', label: 'Configuration' },
    { id: 'backups', label: 'Backups' },
    { id: 'ai', label: 'AI Copilot' },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-noc-bg select-none">
      {/* Header bar with Back button & Device summary */}
      <div className="h-12 bg-noc-panel border-b border-noc-border px-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSelectedDevice(null)}
            className="p-1.5 rounded hover:bg-noc-surface text-slate-400 hover:text-slate-200 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-2">
            <span className="font-semibold text-sm text-white font-mono">{device.name}</span>
            <span className="text-xs text-cyan-400 font-mono">({device.ipAddress})</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
              {device.status}
            </span>
          </div>
        </div>

        {/* Action triggers */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => addTerminalTab(device)}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-emerald-400 border border-slate-700"
          >
            <TerminalIcon className="w-3 h-3" />
            <span>Launch Live PuTTY</span>
          </button>

          <button
            onClick={() => {
              setAiDrawerOpen(true);
              setCurrentTab('ai-copilot');
            }}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-xs font-mono text-white shadow glow-cyan"
          >
            <Bot className="w-3 h-3" />
            <span>AI Diagnose Node</span>
          </button>
        </div>
      </div>

      {/* WinBox-style Tab Navigation Bar */}
      <div className="bg-noc-panel/90 border-b border-noc-border px-2 flex items-center space-x-1 overflow-x-auto text-xs font-mono">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 border-b-2 whitespace-nowrap transition ${
                isActive
                  ? 'border-cyan-400 text-cyan-300 font-semibold bg-noc-surface/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-noc-surface/30'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 p-4 overflow-y-auto">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* System Resource Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
              <div className="bg-noc-panel border border-noc-border rounded-lg p-3">
                <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                  <span>CPU UTILIZATION</span>
                  <Cpu className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="mt-1 text-2xl font-bold font-mono text-emerald-400">14.5%</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">4 Cores @ 1700MHz</div>
              </div>

              <div className="bg-noc-panel border border-noc-border rounded-lg p-3">
                <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                  <span>MEMORY RESIDENCY</span>
                  <Activity className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="mt-1 text-2xl font-bold font-mono text-cyan-400">812 MB / 4.0 GB</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">3.2 GB Free</div>
              </div>

              <div className="bg-noc-panel border border-noc-border rounded-lg p-3">
                <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                  <span>STORAGE (HDD/FLASH)</span>
                  <HardDrive className="w-4 h-4 text-slate-300" />
                </div>
                <div className="mt-1 text-2xl font-bold font-mono text-white">20 MB / 128 MB</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">108 MB Available</div>
              </div>

              <div className="bg-noc-panel border border-noc-border rounded-lg p-3">
                <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                  <span>BOARD TEMPERATURE</span>
                  <Thermometer className="w-4 h-4 text-amber-400" />
                </div>
                <div className="mt-1 text-2xl font-bold font-mono text-amber-400">41.5 °C</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">Fan: Normal · 24.1V</div>
              </div>
            </div>

            {/* Hardware & OS Details Table */}
            <div className="bg-noc-panel border border-noc-border rounded-lg p-4">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono mb-3">
                RouterBOARD Hardware & System Specs
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                <div>
                  <div className="text-slate-500 text-[10px]">UPTIME</div>
                  <div className="text-slate-200 mt-0.5">42d 16h 24m 12s</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[10px]">OS VERSION</div>
                  <div className="text-slate-200 mt-0.5">{device.osVersion}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[10px]">ARCHITECTURE</div>
                  <div className="text-slate-200 mt-0.5">arm64 (64-bit)</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[10px]">BOARD MODEL</div>
                  <div className="text-slate-200 mt-0.5">{device.platform}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[10px]">IP ADDRESS</div>
                  <div className="text-cyan-400 mt-0.5">{device.ipAddress}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[10px]">MAC ADDRESS</div>
                  <div className="text-slate-200 mt-0.5">{device.macAddress}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[10px]">MANAGEMENT PORT</div>
                  <div className="text-slate-200 mt-0.5">API: {device.apiPort} | SSH: {device.sshPort}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[10px]">POLLING FREQUENCY</div>
                  <div className="text-slate-200 mt-0.5">{device.pollingIntervalSeconds} seconds</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'interfaces' && (
          <div className="bg-noc-panel border border-noc-border rounded-lg overflow-hidden text-xs font-mono">
            <div className="p-3 border-b border-noc-border bg-noc-surface/50 font-semibold text-white">
              Interface List (Ethernet, SFP+, Bridge)
            </div>
            <table className="w-full text-left">
              <thead className="bg-noc-surface text-slate-400 uppercase text-[10px] tracking-wider border-b border-noc-border">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Link</th>
                  <th className="px-4 py-2">Speed</th>
                  <th className="px-4 py-2">MTU</th>
                  <th className="px-4 py-2">RX Bytes</th>
                  <th className="px-4 py-2">TX Bytes</th>
                  <th className="px-4 py-2">Errors / Drops</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-noc-border">
                <tr>
                  <td className="px-4 py-2.5 font-semibold text-white">sfp-sfpplus1</td>
                  <td className="px-4 py-2.5 text-slate-400">sfp-plus</td>
                  <td className="px-4 py-2.5 text-emerald-400">UP</td>
                  <td className="px-4 py-2.5 text-cyan-300">10 Gbps</td>
                  <td className="px-4 py-2.5 text-slate-300">1500</td>
                  <td className="px-4 py-2.5 text-slate-300">95.8 GB</td>
                  <td className="px-4 py-2.5 text-slate-300">84.9 GB</td>
                  <td className="px-4 py-2.5 text-slate-500">0 / 0</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-semibold text-white">ether1-wan</td>
                  <td className="px-4 py-2.5 text-slate-400">ethernet</td>
                  <td className="px-4 py-2.5 text-emerald-400">UP</td>
                  <td className="px-4 py-2.5 text-cyan-300">1 Gbps</td>
                  <td className="px-4 py-2.5 text-slate-300">1500</td>
                  <td className="px-4 py-2.5 text-slate-300">4.8 GB</td>
                  <td className="px-4 py-2.5 text-slate-300">2.3 GB</td>
                  <td className="px-4 py-2.5 text-slate-500">0 / 0</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-semibold text-white">ether2-lan</td>
                  <td className="px-4 py-2.5 text-slate-400">ethernet</td>
                  <td className="px-4 py-2.5 text-emerald-400">UP</td>
                  <td className="px-4 py-2.5 text-cyan-300">1 Gbps</td>
                  <td className="px-4 py-2.5 text-slate-300">1500</td>
                  <td className="px-4 py-2.5 text-slate-300">12.8 GB</td>
                  <td className="px-4 py-2.5 text-slate-300">19.2 GB</td>
                  <td className="px-4 py-2.5 text-slate-500">0 / 0</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-semibold text-white">bridge-lan</td>
                  <td className="px-4 py-2.5 text-slate-400">bridge</td>
                  <td className="px-4 py-2.5 text-emerald-400">UP</td>
                  <td className="px-4 py-2.5 text-cyan-300">10 Gbps</td>
                  <td className="px-4 py-2.5 text-slate-300">1500</td>
                  <td className="px-4 py-2.5 text-slate-300">152.8 GB</td>
                  <td className="px-4 py-2.5 text-slate-300">189.2 GB</td>
                  <td className="px-4 py-2.5 text-slate-500">0 / 0</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'ip-addresses' && (
          <div className="bg-noc-panel border border-noc-border rounded-lg overflow-hidden text-xs font-mono">
            <div className="p-3 border-b border-noc-border bg-noc-surface/50 font-semibold text-white">
              Configured IP Address Assignments
            </div>
            <table className="w-full text-left">
              <thead className="bg-noc-surface text-slate-400 uppercase text-[10px] tracking-wider border-b border-noc-border">
                <tr>
                  <th className="px-4 py-2">Address / Subnet</th>
                  <th className="px-4 py-2">Network</th>
                  <th className="px-4 py-2">Interface</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-noc-border">
                <tr>
                  <td className="px-4 py-2.5 text-cyan-300 font-semibold">10.250.0.1/30</td>
                  <td className="px-4 py-2.5 text-slate-400">10.250.0.0</td>
                  <td className="px-4 py-2.5 text-slate-200">sfp-sfpplus1</td>
                  <td className="px-4 py-2.5 text-emerald-400">BOUND</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 text-cyan-300 font-semibold">192.168.1.100/24</td>
                  <td className="px-4 py-2.5 text-slate-400">192.168.1.0</td>
                  <td className="px-4 py-2.5 text-slate-200">ether1-wan</td>
                  <td className="px-4 py-2.5 text-emerald-400">BOUND</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 text-cyan-300 font-semibold">192.168.10.1/24</td>
                  <td className="px-4 py-2.5 text-slate-400">192.168.10.0</td>
                  <td className="px-4 py-2.5 text-slate-200">bridge-lan</td>
                  <td className="px-4 py-2.5 text-emerald-400">BOUND</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'routes' && (
          <div className="bg-noc-panel border border-noc-border rounded-lg overflow-hidden text-xs font-mono">
            <div className="p-3 border-b border-noc-border bg-noc-surface/50 font-semibold text-white">
              Routing Table (FIB / RIB)
            </div>
            <table className="w-full text-left">
              <thead className="bg-noc-surface text-slate-400 uppercase text-[10px] tracking-wider border-b border-noc-border">
                <tr>
                  <th className="px-4 py-2">Destination</th>
                  <th className="px-4 py-2">Gateway</th>
                  <th className="px-4 py-2">Distance</th>
                  <th className="px-4 py-2">Scope</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-noc-border">
                <tr>
                  <td className="px-4 py-2.5 text-white font-semibold">0.0.0.0/0</td>
                  <td className="px-4 py-2.5 text-cyan-300">192.168.1.1</td>
                  <td className="px-4 py-2.5 text-slate-400">1</td>
                  <td className="px-4 py-2.5 text-slate-400">30</td>
                  <td className="px-4 py-2.5 text-emerald-400">ACTIVE, STATIC</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 text-white font-semibold">192.168.10.0/24</td>
                  <td className="px-4 py-2.5 text-cyan-300">bridge-lan</td>
                  <td className="px-4 py-2.5 text-slate-400">0</td>
                  <td className="px-4 py-2.5 text-slate-400">10</td>
                  <td className="px-4 py-2.5 text-emerald-400">ACTIVE, CONNECTED</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Other tabs fallback */}
        {!['overview', 'interfaces', 'ip-addresses', 'routes'].includes(activeTab) && (
          <div className="bg-noc-panel border border-noc-border rounded-lg p-6 text-center text-xs font-mono text-slate-400">
            <div className="text-white font-semibold text-sm mb-1 uppercase tracking-wide">
              {activeTab} Management Panel
            </div>
            <p className="text-slate-500 max-w-md mx-auto">
              Live {activeTab} parameters connected to {device.name} via {device.connectionType}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
