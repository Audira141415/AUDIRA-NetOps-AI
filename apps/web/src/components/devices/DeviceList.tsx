// Devices Management Component (List, Filtering, Actions)

import React, { useState } from 'react';
import {
  Server,
  Plus,
  Terminal,
  Activity,
  HardDriveDownload,
  Bot,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import { Device, DeviceStatus } from '@audira/types';
import { useNetOpsStore } from '../../store/useNetOpsStore';

const INITIAL_DEVICES: Device[] = [
  {
    id: '30000000-0000-0000-0000-000000000001',
    name: 'CORE-JOGJA-01',
    hostname: 'core-jogja-01.audira.net',
    ipAddress: '192.168.10.1',
    macAddress: 'D4:CA:6D:E1:01:01',
    vendor: 'MikroTik',
    platform: 'CCR2004-16G-2S+',
    osVersion: 'RouterOS v7.14.3',
    deviceType: 'ROUTER',
    connectionType: 'ROUTEROS_API',
    apiPort: 8728,
    sshPort: 22,
    status: 'ONLINE',
    pollingIntervalSeconds: 15,
    lastSeen: 'Just now',
    createdAt: '2026-10-01T00:00:00Z',
    updatedAt: '2026-10-04T07:00:00Z',
  },
  {
    id: '30000000-0000-0000-0000-000000000002',
    name: 'CORE-JOGJA-02',
    hostname: 'core-jogja-02.audira.net',
    ipAddress: '192.168.10.2',
    macAddress: 'D4:CA:6D:E1:01:02',
    vendor: 'MikroTik',
    platform: 'CCR2004-16G-2S+',
    osVersion: 'RouterOS v7.14.3',
    deviceType: 'ROUTER',
    connectionType: 'ROUTEROS_API',
    apiPort: 8728,
    sshPort: 22,
    status: 'ONLINE',
    pollingIntervalSeconds: 15,
    lastSeen: 'Just now',
    createdAt: '2026-10-01T00:00:00Z',
    updatedAt: '2026-10-04T07:00:00Z',
  },
  {
    id: '30000000-0000-0000-0000-000000000003',
    name: 'EDGE-JOGJA-01',
    hostname: 'edge-jogja-01.audira.net',
    ipAddress: '192.168.10.254',
    macAddress: 'D4:CA:6D:E1:02:01',
    vendor: 'MikroTik',
    platform: 'RB5009UG+S+IN',
    osVersion: 'RouterOS v7.14.3',
    deviceType: 'FIREWALL',
    connectionType: 'ROUTEROS_API',
    apiPort: 8728,
    sshPort: 22,
    status: 'ONLINE',
    pollingIntervalSeconds: 15,
    lastSeen: 'Just now',
    createdAt: '2026-10-01T00:00:00Z',
    updatedAt: '2026-10-04T07:00:00Z',
  },
  {
    id: '30000000-0000-0000-0000-000000000004',
    name: 'SW-JOGJA-01',
    hostname: 'sw-dist-01.audira.net',
    ipAddress: '192.168.10.11',
    macAddress: '48:8F:5A:22:01:10',
    vendor: 'MikroTik',
    platform: 'CRS326-24G-2S+RM',
    osVersion: 'SwitchOS / ROS v7',
    deviceType: 'SWITCH',
    connectionType: 'SSH',
    apiPort: 8728,
    sshPort: 22,
    status: 'ONLINE',
    pollingIntervalSeconds: 15,
    lastSeen: 'Just now',
    createdAt: '2026-10-01T00:00:00Z',
    updatedAt: '2026-10-04T07:00:00Z',
  },
  {
    id: '30000000-0000-0000-0000-000000000005',
    name: 'SW-JOGJA-02',
    hostname: 'sw-access-02.audira.net',
    ipAddress: '192.168.10.12',
    macAddress: '48:8F:5A:22:01:20',
    vendor: 'MikroTik',
    platform: 'CRS326-24G-2S+RM',
    osVersion: 'SwitchOS / ROS v7',
    deviceType: 'SWITCH',
    connectionType: 'SSH',
    apiPort: 8728,
    sshPort: 22,
    status: 'WARNING',
    pollingIntervalSeconds: 15,
    lastSeen: 'Just now',
    createdAt: '2026-10-01T00:00:00Z',
    updatedAt: '2026-10-04T07:00:00Z',
  },
  {
    id: '30000000-0000-0000-0000-000000000006',
    name: 'AP-01-NOC',
    hostname: 'ap-noc-floor2.audira.net',
    ipAddress: '192.168.20.5',
    macAddress: 'CC:2D:E0:11:22:33',
    vendor: 'MikroTik',
    platform: 'cAP ax',
    osVersion: 'RouterOS v7.12',
    deviceType: 'ACCESS_POINT',
    connectionType: 'ROUTEROS_API',
    apiPort: 8728,
    sshPort: 22,
    status: 'ONLINE',
    pollingIntervalSeconds: 30,
    lastSeen: '1m ago',
    createdAt: '2026-10-01T00:00:00Z',
    updatedAt: '2026-10-04T07:00:00Z',
  },
  {
    id: '30000000-0000-0000-0000-000000000007',
    name: 'SERVER-MGMT-01',
    hostname: 'srv-netops.audira.net',
    ipAddress: '192.168.10.200',
    macAddress: '00:15:5D:44:55:66',
    vendor: 'Linux',
    platform: 'Ubuntu 24.04 LTS',
    osVersion: 'Linux 6.8.0',
    deviceType: 'SERVER',
    connectionType: 'SSH',
    apiPort: 0,
    sshPort: 22,
    status: 'ONLINE',
    pollingIntervalSeconds: 30,
    lastSeen: 'Just now',
    createdAt: '2026-10-01T00:00:00Z',
    updatedAt: '2026-10-04T07:00:00Z',
  },
];

export const DeviceList: React.FC = () => {
  const { setSelectedDevice, addTerminalTab, setAiDrawerOpen, setCurrentTab } = useNetOpsStore();
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
  const [searchTerm, setSearchTerm] = useState('');
  const [vendorFilter, setVendorFilter] = useState('ALL');

  const filteredDevices = devices.filter(d => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.ipAddress.includes(searchTerm) ||
      d.hostname.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVendor = vendorFilter === 'ALL' || d.vendor === vendorFilter;
    return matchesSearch && matchesVendor;
  });

  const getStatusBadge = (status: DeviceStatus) => {
    switch (status) {
      case 'ONLINE':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            <span>ONLINE</span>
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-3 h-3" />
            <span>WARNING</span>
          </span>
        );
      case 'OFFLINE':
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <XCircle className="w-3 h-3" />
            <span>OFFLINE</span>
          </span>
        );
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Top Controls: Search, Filter, Add Device */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter by name, IP, hostname..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-noc-panel border border-noc-border rounded text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <select
            value={vendorFilter}
            onChange={e => setVendorFilter(e.target.value)}
            className="bg-noc-panel border border-noc-border text-slate-300 text-xs font-mono rounded px-2 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Vendors</option>
            <option value="MikroTik">MikroTik</option>
            <option value="Linux">Linux</option>
            <option value="Cisco">Cisco</option>
            <option value="GenericSSH">Generic SSH</option>
          </select>
        </div>

        <button
          onClick={() => alert('New Device Modal: Provide IP, Connection (MikroTik API / SSH), and Credentials')}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-semibold shadow glow-cyan transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Node</span>
        </button>
      </div>

      {/* Device Table */}
      <div className="bg-noc-panel border border-noc-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-noc-surface/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-noc-border">
              <tr>
                <th className="px-4 py-3">Node Name</th>
                <th className="px-4 py-3">IP Address</th>
                <th className="px-4 py-3">Vendor / Hardware</th>
                <th className="px-4 py-3">OS Version</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Protocol</th>
                <th className="px-4 py-3 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-noc-border">
              {filteredDevices.map(device => (
                <tr
                  key={device.id}
                  className="hover:bg-noc-surface/50 transition cursor-pointer"
                  onClick={() => setSelectedDevice(device)}
                >
                  <td className="px-4 py-3 font-semibold text-white flex items-center space-x-2">
                    <Server className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{device.name}</span>
                  </td>
                  <td className="px-4 py-3 text-cyan-300 font-mono">{device.ipAddress}</td>
                  <td className="px-4 py-3 text-slate-300">
                    <div className="font-sans font-medium">{device.vendor}</div>
                    <div className="text-[10px] text-slate-500">{device.platform}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{device.osVersion}</td>
                  <td className="px-4 py-3">{getStatusBadge(device.status)}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 border border-slate-700 text-slate-300">
                      {device.connectionType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div
                      className="inline-flex items-center space-x-1"
                      onClick={e => e.stopPropagation()}
                    >
                      {/* WinBox Details */}
                      <button
                        title="Open WinBox Management Tabs"
                        onClick={() => setSelectedDevice(device)}
                        className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>

                      {/* PuTTY Terminal */}
                      <button
                        title="Open PuTTY Live Terminal"
                        onClick={() => addTerminalTab(device)}
                        className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition"
                      >
                        <Terminal className="w-3.5 h-3.5" />
                      </button>

                      {/* AI Copilot */}
                      <button
                        title="Ask AI Copilot to Diagnose"
                        onClick={() => {
                          setAiDrawerOpen(true);
                          setCurrentTab('ai-copilot');
                        }}
                        className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition"
                      >
                        <Bot className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
