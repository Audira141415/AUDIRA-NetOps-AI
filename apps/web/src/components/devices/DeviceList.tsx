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
  Pencil,
  Eye,
  RotateCcw,
  Download,
  Globe,
} from 'lucide-react';
import { Device, DeviceStatus, DeviceType, ConnectionType, VendorType } from '@audira/types';
import { useNetOpsStore } from '../../store/useNetOpsStore';

export const DeviceList: React.FC = () => {
  const {
    devices,
    addDevice,
    updateDevice,
    removeDevice,
    resetDevicesToDefaults,
    setSelectedDevice,
    addTerminalTab,
    setAiDrawerOpen,
    setCurrentTab,
    isAddDeviceModalOpen,
    setAddDeviceModalOpen,
    showToast,
  } = useNetOpsStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [vendorFilter, setVendorFilter] = useState('ALL');

  // Edit Device State
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Device>>({});

  // Delete Confirmation State
  const [deletingDevice, setDeletingDevice] = useState<Device | null>(null);

  // View Device Quick Modal State
  const [viewingDevice, setViewingDevice] = useState<Device | null>(null);

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
      platform:
        formData.vendor === 'MikroTik'
          ? 'Cloud Core Router CCR2004'
          : formData.vendor === 'Cisco'
          ? 'Catalyst 9300 Series'
          : formData.vendor === 'Huawei'
          ? 'CloudEngine 6800 Series'
          : formData.vendor === 'Juniper'
          ? 'Juniper MX204 Universal Router'
          : `${formData.vendor} Appliance`,
      osVersion:
        formData.vendor === 'MikroTik'
          ? 'RouterOS v7.14'
          : formData.vendor === 'Cisco'
          ? 'IOS-XE 17.9.4a'
          : formData.vendor === 'Huawei'
          ? 'VRP V800R012'
          : formData.vendor === 'Juniper'
          ? 'Junos 22.4R2-S2'
          : 'Firmware v1.0',
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
          <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>ONLINE</span>
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>WARNING</span>
          </span>
        );
      case 'OFFLINE':
      default:
        return (
          <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>OFFLINE</span>
          </span>
        );
    }
  };

  const handleOpenEdit = (dev: Device) => {
    setEditingDevice(dev);
    setEditFormData({
      name: dev.name,
      ipAddress: dev.ipAddress,
      hostname: dev.hostname,
      vendor: dev.vendor,
      platform: dev.platform,
      deviceType: dev.deviceType,
      connectionType: dev.connectionType,
      apiPort: dev.apiPort,
      sshPort: dev.sshPort,
      status: dev.status,
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDevice) return;
    updateDevice(editingDevice.id, editFormData);
    setEditingDevice(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingDevice) return;
    removeDevice(deletingDevice.id);
    setDeletingDevice(null);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'IP Address', 'Hostname', 'Vendor', 'Platform', 'Device Type', 'Status', 'API Port', 'SSH Port'];
    const rows = devices.map((d) => [
      d.id,
      `"${d.name}"`,
      d.ipAddress,
      `"${d.hostname}"`,
      d.vendor,
      `"${d.platform || ''}"`,
      d.deviceType,
      d.status,
      d.apiPort,
      d.sshPort,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `audira_device_inventory_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Top Controls: Search, Filter, Add Device, Export, Reset */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter by name, IP, hostname..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition"
            />
          </div>

          <select
            value={vendorFilter}
            onChange={(e) => setVendorFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-zinc-700 transition"
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

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-sans text-xs transition"
            title="Download Device Inventory as CSV"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          {devices.length > 0 && (
            <button
              onClick={resetDevicesToDefaults}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-950/20 hover:bg-rose-900/40 border border-rose-800/40 text-rose-400 font-sans text-xs transition"
              title="Reset inventory to empty state"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Clear Fleet</span>
            </button>
          )}

          <button
            onClick={() => setAddDeviceModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Device</span>
          </button>
        </div>
      </div>

      {/* Devices List Table */}
      <div className="bg-[#121215] rounded-xl border border-zinc-800 overflow-hidden shadow-sm">
        {filteredDevices.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mx-auto">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-semibold text-zinc-200">No Network Devices Found</div>
              <div className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                {devices.length === 0
                  ? 'Your inventory is currently empty. Connect a physical router or switch to begin telemetry ingestion.'
                  : 'No devices match your search criteria.'}
              </div>
            </div>
            {devices.length === 0 && (
              <button
                onClick={() => setAddDeviceModalOpen(true)}
                className="px-4 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs transition shadow-sm"
              >
                + Add First Device
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-900/60 border-b border-zinc-800 text-zinc-400 font-sans text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="p-3">Device Name</th>
                  <th className="p-3">IP &amp; Hostname</th>
                  <th className="p-3">Vendor / Model</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Last Polled</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                {filteredDevices.map((dev) => (
                  <tr key={dev.id} className="hover:bg-zinc-900/40 transition">
                    <td className="p-3 font-semibold text-zinc-100">
                      <a
                        href={`#/devices/${encodeURIComponent(dev.name.toLowerCase())}`}
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedDevice(dev);
                        }}
                        className="hover:text-white flex items-center space-x-2 transition text-left cursor-pointer"
                      >
                        <Server className="w-3.5 h-3.5 text-zinc-400" />
                        <span className="font-semibold text-zinc-100">{dev.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60">
                          {dev.vendor}
                        </span>
                      </a>
                    </td>
                    <td className="p-3 text-zinc-300 font-mono">
                      <div className="flex items-center space-x-1.5 font-medium text-zinc-200">
                        <Globe className="w-3 h-3 text-zinc-400 shrink-0" />
                        <a
                          href={`#/devices/${encodeURIComponent(dev.name.toLowerCase())}`}
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedDevice(dev);
                          }}
                          className="text-zinc-300 hover:text-white hover:underline"
                        >
                          {dev.hostname}
                        </a>
                      </div>
                      <div className="flex items-center space-x-2 text-[10px] text-zinc-500 mt-0.5">
                        <span className="text-zinc-400">{dev.ipAddress}</span>
                        <span>•</span>
                        {(() => {
                          const endpointUri =
                            dev.vendor === 'MikroTik'
                              ? `api://${dev.hostname}:${dev.apiPort || 8729}`
                              : dev.vendor === 'Cisco'
                              ? `restconf://${dev.hostname}:443`
                              : dev.vendor === 'Huawei'
                              ? `ssh://${dev.hostname}:${dev.sshPort || 22}`
                              : `https://${dev.hostname}:${dev.apiPort || 443}`;
                          return (
                            <span
                              className="text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 cursor-pointer hover:border-zinc-700 hover:text-zinc-200 flex items-center space-x-1 transition"
                              title="Click to copy URI"
                              onClick={() => {
                                navigator.clipboard.writeText(endpointUri);
                                showToast(`URI ${endpointUri} copied!`, 'info');
                              }}
                            >
                              <span>{endpointUri}</span>
                            </span>
                          );
                        })()}
                      </div>
                    </td>
                    <td className="p-3 text-zinc-300">
                      <div>{dev.vendor}</div>
                      <div className="text-[10px] text-zinc-500">{dev.platform}</div>
                    </td>
                    <td className="p-3">{getStatusBadge(dev.status)}</td>
                    <td className="p-3 text-zinc-400 text-[11px]">{dev.lastSeen}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => setViewingDevice(dev)}
                          className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition"
                          title="Quick View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(dev)}
                          className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-amber-400 transition"
                          title="Edit Device Properties"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => addTerminalTab(dev)}
                          className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition"
                          title="Open SSH Terminal"
                        >
                          <Terminal className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setSelectedDevice(dev)}
                          className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition"
                          title="WinBox Device Management"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingDevice(dev)}
                          className="p-1.5 rounded-lg bg-zinc-900 hover:bg-rose-950/40 border border-zinc-800 hover:border-rose-900 text-zinc-400 hover:text-rose-400 transition"
                          title="Delete Device"
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

      {/* Edit Device Modal */}
      {editingDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#0c1427] border border-amber-500/40 rounded-2xl shadow-[0_0_50px_rgba(245,158,11,0.25)] p-6 relative">
            <button
              onClick={() => setEditingDevice(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                <Pencil className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Edit Device Properties</h3>
                <p className="text-xs text-slate-400">Perbarui parameter koneksi &amp; metadata {editingDevice.name}</p>
              </div>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs font-sans">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Device Name</label>
                  <input
                    type="text"
                    required
                    value={editFormData.name || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#111c38] border border-cyan-500/30 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">IP Address</label>
                  <input
                    type="text"
                    required
                    value={editFormData.ipAddress || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, ipAddress: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#111c38] border border-cyan-500/30 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Hostname / FQDN</label>
                  <input
                    type="text"
                    value={editFormData.hostname || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, hostname: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#111c38] border border-cyan-500/30 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Hardware / Platform</label>
                  <input
                    type="text"
                    value={editFormData.platform || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, platform: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#111c38] border border-cyan-500/30 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Vendor</label>
                  <select
                    value={editFormData.vendor}
                    onChange={(e) => setEditFormData({ ...editFormData, vendor: e.target.value as VendorType })}
                    className="w-full px-3 py-2 rounded-xl bg-[#111c38] border border-cyan-500/30 text-white text-xs font-mono"
                  >
                    <option value="MikroTik">MikroTik</option>
                    <option value="Cisco">Cisco</option>
                    <option value="Huawei">Huawei</option>
                    <option value="Juniper">Juniper</option>
                    <option value="Fortinet">Fortinet</option>
                    <option value="EdgeCore">EdgeCore</option>
                    <option value="GenericSSH">Generic SSH</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">API Port</label>
                  <input
                    type="number"
                    value={editFormData.apiPort || 443}
                    onChange={(e) => setEditFormData({ ...editFormData, apiPort: parseInt(e.target.value) || 443 })}
                    className="w-full px-3 py-2 rounded-xl bg-[#111c38] border border-cyan-500/30 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">SSH Port</label>
                  <input
                    type="number"
                    value={editFormData.sshPort || 22}
                    onChange={(e) => setEditFormData({ ...editFormData, sshPort: parseInt(e.target.value) || 22 })}
                    className="w-full px-3 py-2 rounded-xl bg-[#111c38] border border-cyan-500/30 text-white font-mono text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-cyan-500/20 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingDevice(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition shadow-[0_0_15px_rgba(245,158,11,0.5)] flex items-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0c1427] border border-rose-500/40 rounded-2xl shadow-[0_0_50px_rgba(244,63,94,0.3)] p-6 relative">
            <button
              onClick={() => setDeletingDevice(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Hapus Perangkat Jaringan?</h3>
                <p className="text-xs text-rose-400">Tindakan ini memerlukan konfirmasi keamanan</p>
              </div>
            </div>

            <div className="bg-[#111c38] p-3 rounded-xl border border-rose-500/20 text-xs font-mono text-slate-300 space-y-1 my-3">
              <div>Perangkat: <span className="font-bold text-white">{deletingDevice.name}</span></div>
              <div>IP Target: <span className="text-cyan-400">{deletingDevice.ipAddress}</span></div>
              <div>Vendor: <span className="text-slate-200">{deletingDevice.vendor}</span> ({deletingDevice.platform})</div>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Semua telemetri, histori sesi PuTTY, dan pemantauan aktif untuk node ini akan dilepaskan dari NOC.
            </p>

            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => setDeletingDevice(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
              >
                Batalkan
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition shadow-[0_0_15px_rgba(244,63,94,0.5)] flex items-center space-x-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Hapus Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {viewingDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#0c1427] border border-cyan-500/40 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.3)] p-6 relative">
            <button
              onClick={() => setViewingDevice(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{viewingDevice.name}</h3>
                <p className="text-xs text-cyan-400 font-mono">{viewingDevice.ipAddress} • {viewingDevice.vendor}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono bg-[#111c38] p-4 rounded-xl border border-cyan-500/20 mb-4">
              <div>
                <span className="text-slate-500 block text-[10px]">HOSTNAME</span>
                <span className="text-slate-200">{viewingDevice.hostname}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">MAC ADDRESS</span>
                <span className="text-cyan-300">{viewingDevice.macAddress || '48:8F:5A:21:A4:B0'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">PLATFORM / HARDWARE</span>
                <span className="text-slate-200">{viewingDevice.platform || 'CCR2004 Appliance'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">OS VERSION</span>
                <span className="text-emerald-400">{viewingDevice.osVersion || 'RouterOS v7'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">CONNECTION PROTOCOL</span>
                <span className="text-slate-200">{viewingDevice.connectionType} (API: {viewingDevice.apiPort}, SSH: {viewingDevice.sshPort})</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">STATUS OPERASIONAL</span>
                <span className="text-emerald-400 font-bold">{viewingDevice.status}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-cyan-500/20">
              <span className="text-[11px] font-mono text-slate-400">Terakhir dipolling: {viewingDevice.lastSeen}</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const dev = viewingDevice;
                    setViewingDevice(null);
                    addTerminalTab(dev);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-700/80 hover:bg-emerald-600 text-white text-xs font-mono flex items-center space-x-1.5 transition"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Launch PuTTY</span>
                </button>
                <button
                  onClick={() => {
                    const dev = viewingDevice;
                    setViewingDevice(null);
                    setSelectedDevice(dev);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono flex items-center space-x-1.5 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>WinBox Suite</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
