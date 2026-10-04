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
  Trash2,
  Network,
  X,
} from 'lucide-react';
import { Device, DeviceStatus, DeviceType, ConnectionType, VendorType } from '@audira/types';
import { useNetOpsStore } from '../../store/useNetOpsStore';

export const DeviceList: React.FC = () => {
  const {
    devices,
    addDevice,
    removeDevice,
    setSelectedDevice,
    addTerminalTab,
    setAiDrawerOpen,
    setCurrentTab,
    isAddDeviceModalOpen,
    setAddDeviceModalOpen,
  } = useNetOpsStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [vendorFilter, setVendorFilter] = useState('ALL');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    ipAddress: '',
    vendor: 'MikroTik' as VendorType,
    deviceType: 'ROUTER' as DeviceType,
    connectionType: 'ROUTEROS_API' as ConnectionType,
    port: '443',
    username: 'admin',
    password: '',
  });

  const filteredDevices = devices.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.ipAddress.includes(searchTerm) ||
      d.hostname.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVendor = vendorFilter === 'ALL' || d.vendor === vendorFilter;
    return matchesSearch && matchesVendor;
  });

  const handleSaveDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.ipAddress) return;

    const newDev: Device = {
      id: `dev-${Date.now()}`,
      name: formData.name,
      hostname: `${formData.name.toLowerCase()}.local`,
      ipAddress: formData.ipAddress,
      vendor: formData.vendor,
      platform: `${formData.vendor} Appliance`,
      osVersion: formData.vendor === 'MikroTik' ? 'RouterOS v7' : 'Firmware v1.0',
      deviceType: formData.deviceType,
      connectionType: formData.connectionType,
      apiPort: parseInt(formData.port) || 443,
      sshPort: 22,
      status: 'ONLINE',
      pollingIntervalSeconds: 15,
      lastSeen: 'Just now',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addDevice(newDev);
    setAddDeviceModalOpen(false);
    setFormData({
      name: '',
      ipAddress: '',
      vendor: 'MikroTik',
      deviceType: 'ROUTER',
      connectionType: 'ROUTEROS_API',
      port: '443',
      username: 'admin',
      password: '',
    });
  };

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
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#111c38] border border-cyan-500/25 rounded-xl text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <select
            value={vendorFilter}
            onChange={(e) => setVendorFilter(e.target.value)}
            className="bg-[#111c38] border border-cyan-500/25 text-slate-300 text-xs font-mono rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL">All Vendors</option>
            <option value="MikroTik">MikroTik RouterOS</option>
            <option value="Cisco">Cisco Systems</option>
            <option value="Huawei">Huawei Enterprise</option>
            <option value="Juniper">Juniper Networks</option>
            <option value="Arista">Arista Networks</option>
            <option value="Fortinet">Fortinet FortiGate</option>
            <option value="VyOS">VyOS Routing</option>
            <option value="EdgeCore">EdgeCore SONiC</option>
            <option value="Ubiquiti">Ubiquiti EdgeMAX/UniFi</option>
            <option value="Linux">Linux Server</option>
            <option value="GenericSSH">Generic SSH</option>
          </select>
        </div>

        <button
          onClick={() => setAddDeviceModalOpen(true)}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-[0_0_15px_rgba(37,99,235,0.4)] transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Device</span>
        </button>
      </div>

      {/* Devices List Table */}
      <div className="glass-cyber-card rounded-2xl border border-cyan-500/20 overflow-hidden shadow-lg">
        {filteredDevices.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mx-auto shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <Server className="w-7 h-7" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Tidak Ada Perangkat Jaringan</div>
              <div className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {devices.length === 0
                  ? 'Sistem saat ini dalam keadaan bersih. Klik tombol di bawah untuk mendaftarkan router atau switch fisik pertama Anda.'
                  : 'Tidak ada perangkat yang cocok dengan filter pencarian.'}
              </div>
            </div>
            {devices.length === 0 && (
              <button
                onClick={() => setAddDeviceModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md transition"
              >
                + Tambah Perangkat Pertama
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0b1222] border-b border-cyan-500/20 text-slate-400">
                <tr>
                  <th className="p-3">Device Name</th>
                  <th className="p-3">IP &amp; Hostname</th>
                  <th className="p-3">Vendor / Model</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Last Polled</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-500/10">
                {filteredDevices.map((dev) => (
                  <tr key={dev.id} className="hover:bg-white/5 transition">
                    <td className="p-3 font-semibold text-white">
                      <button
                        onClick={() => setSelectedDevice(dev)}
                        className="hover:text-cyan-300 flex items-center space-x-1.5 transition text-left"
                      >
                        <Server className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{dev.name}</span>
                      </button>
                    </td>
                    <td className="p-3 text-slate-300">
                      <div>{dev.ipAddress}</div>
                      <div className="text-[10px] text-slate-500">{dev.hostname}</div>
                    </td>
                    <td className="p-3 text-slate-300">
                      <div>{dev.vendor}</div>
                      <div className="text-[10px] text-slate-500">{dev.platform}</div>
                    </td>
                    <td className="p-3">{getStatusBadge(dev.status)}</td>
                    <td className="p-3 text-slate-400 text-[11px]">{dev.lastSeen}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => addTerminalTab(dev)}
                          className="p-1.5 rounded-lg bg-[#111c38] hover:bg-[#1b2a52] border border-cyan-500/20 text-slate-300 hover:text-white transition"
                          title="Open SSH Terminal"
                        >
                          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                        </button>
                        <button
                          onClick={() => setSelectedDevice(dev)}
                          className="p-1.5 rounded-lg bg-[#111c38] hover:bg-[#1b2a52] border border-cyan-500/20 text-slate-300 hover:text-white transition"
                          title="WinBox Device Management"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                        </button>
                        <button
                          onClick={() => removeDevice(dev.id)}
                          className="p-1.5 rounded-lg bg-[#111c38] hover:bg-rose-950/80 border border-rose-500/30 text-rose-400 hover:text-rose-200 transition"
                          title="Remove Device"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Device Modal */}
      {isAddDeviceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0c1427] border border-cyan-500/40 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.3)] p-6 relative">
            <button
              onClick={() => setAddDeviceModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Add Network Device</h3>
                <p className="text-xs text-slate-400">Hubungkan router atau switch fisik Anda</p>
              </div>
            </div>

            <form onSubmit={handleSaveDevice} className="space-y-3.5 text-xs font-sans">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Device Name / Label</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: RB4011-CORE-01"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#111c38] border border-cyan-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">IP Address / Hostname</label>
                  <input
                    type="text"
                    required
                    placeholder="192.168.88.1"
                    value={formData.ipAddress}
                    onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#111c38] border border-cyan-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Port</label>
                  <input
                    type="text"
                    placeholder="443 atau 8728"
                    value={formData.port}
                    onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#111c38] border border-cyan-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Vendor</label>
                  <select
                    value={formData.vendor}
                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value as VendorType })}
                    className="w-full px-3 py-2 rounded-xl bg-[#111c38] border border-cyan-500/30 text-white focus:outline-none focus:border-cyan-400 text-xs font-mono"
                  >
                    <option value="MikroTik">MikroTik RouterOS</option>
                    <option value="Cisco">Cisco Systems (IOS-XE/NX-OS)</option>
                    <option value="Huawei">Huawei Enterprise (VRP OS)</option>
                    <option value="Juniper">Juniper Networks (JunOS)</option>
                    <option value="Arista">Arista Networks (EOS)</option>
                    <option value="Fortinet">Fortinet FortiGate (FortiOS)</option>
                    <option value="VyOS">VyOS Routing Platform</option>
                    <option value="EdgeCore">EdgeCore Networks (SONiC)</option>
                    <option value="Ubiquiti">Ubiquiti (EdgeMAX/UniFi)</option>
                    <option value="Linux">Linux / Ubuntu Server</option>
                    <option value="GenericSSH">Generic SSH Switch/Router</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Protocol</label>
                  <select
                    value={formData.connectionType}
                    onChange={(e) => setFormData({ ...formData, connectionType: e.target.value as ConnectionType })}
                    className="w-full px-3 py-2 rounded-xl bg-[#111c38] border border-cyan-500/30 text-white focus:outline-none focus:border-cyan-400 text-xs font-mono"
                  >
                    <option value="ROUTEROS_API">RouterOS REST / API</option>
                    <option value="SSH">SSH CLI (Port 22)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Username</label>
                  <input
                    type="text"
                    required
                    placeholder="admin"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#111c38] border border-cyan-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#111c38] border border-cyan-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-cyan-500/20 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setAddDeviceModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition shadow-[0_0_15px_rgba(37,99,235,0.5)] flex items-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Connect &amp; Save Device</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
