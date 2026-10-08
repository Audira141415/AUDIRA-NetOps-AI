// Visual IPAM (IP Address Management) & Subnet Tree Planner
// Hierarchical CIDR Allocation, Collision Detector, DHCP Exhaustion, VLSM Calculator & Full CRUD

import React, { useState, useMemo } from 'react';
import {
  Network,
  Layers,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Server,
  ArrowRight,
  Database,
  Sliders,
  Copy,
  Check,
  Zap,
  Edit2,
  Trash2,
  Download,
  Eye,
  X,
  FileSpreadsheet,
  ShieldAlert,
} from 'lucide-react';

export interface SubnetBlock {
  id: string;
  cidr: string;
  name: string;
  category: 'Core Management' | 'WiFi Distribution' | 'Server DMZ' | 'VoIP Network';
  vlanId: number;
  totalHosts: number;
  usedHosts: number;
  gateway: string;
  status: 'OPTIMAL' | 'WARNING' | 'EXHAUSTED';
}

const INITIAL_SUBNETS: SubnetBlock[] = [];

// Helper: Convert IPv4 string to 32-bit unsigned integer
function ipToInt(ip: string): number {
  return ip
    .split('.')
    .reduce((acc, octet) => ((acc << 8) + parseInt(octet, 10)) >>> 0, 0);
}

// Helper: Check if two CIDRs overlap
function cidrsOverlap(cidr1: string, cidr2: string): boolean {
  try {
    const [ip1, p1Str] = cidr1.split('/');
    const [ip2, p2Str] = cidr2.split('/');
    if (!ip1 || !p1Str || !ip2 || !p2Str) return false;

    const p1 = parseInt(p1Str, 10);
    const p2 = parseInt(p2Str, 10);
    const minPrefix = Math.min(p1, p2);
    const mask = (0xffffffff << (32 - minPrefix)) >>> 0;

    return (ipToInt(ip1) & mask) === (ipToInt(ip2) & mask);
  } catch {
    return false;
  }
}

export const IpamView: React.FC = () => {
  const [subnets, setSubnets] = useState<SubnetBlock[]>(INITIAL_SUBNETS);
  const [search, setSearch] = useState<string>('');
  const [selectedSubnet, setSelectedSubnet] = useState<SubnetBlock | null>(null);
  const [calcInputIp, setCalcInputIp] = useState<string>('192.168.50.0');
  const [calcPrefix, setCalcPrefix] = useState<number>(24);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [subnetToEdit, setSubnetToEdit] = useState<SubnetBlock | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [subnetToDelete, setSubnetToDelete] = useState<SubnetBlock | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states for Add Subnet
  const [formData, setFormData] = useState({
    name: '',
    cidr: '192.168.40.0/24',
    category: 'Core Management' as SubnetBlock['category'],
    vlanId: 40,
    gateway: '192.168.40.1',
    usedHosts: 10,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // VLSM calculation helpers
  const totalIps = Math.pow(2, 32 - calcPrefix);
  const usableHosts = calcPrefix >= 31 ? (calcPrefix === 31 ? 2 : 1) : totalIps - 2;

  // Collision / Clash Detector across all subnets
  const clashes = useMemo(() => {
    const list: { sub1: SubnetBlock; sub2: SubnetBlock }[] = [];
    for (let i = 0; i < subnets.length; i++) {
      for (let j = i + 1; j < subnets.length; j++) {
        if (cidrsOverlap(subnets[i]!.cidr, subnets[j]!.cidr)) {
          list.push({ sub1: subnets[i]!, sub2: subnets[j]! });
        }
      }
    }
    return list;
  }, [subnets]);

  const filteredSubnets = subnets.filter(
    (s) =>
      s.cidr.includes(search) ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase()) ||
      String(s.vlanId).includes(search)
  );

  const totalAllocatedIps = subnets.reduce((acc, s) => acc + s.totalHosts, 0);
  const totalUsedIps = subnets.reduce((acc, s) => acc + s.usedHosts, 0);
  const globalUtilization = totalAllocatedIps > 0 ? ((totalUsedIps / totalAllocatedIps) * 100).toFixed(1) : '0';
  const exhaustedCount = subnets.filter((s) => s.status === 'EXHAUSTED').length;

  const calculateStatus = (used: number, total: number): SubnetBlock['status'] => {
    const ratio = used / total;
    if (ratio >= 0.95) return 'EXHAUSTED';
    if (ratio >= 0.8) return 'WARNING';
    return 'OPTIMAL';
  };

  const calculateHostsFromCidr = (cidr: string): number => {
    const parts = cidr.split('/');
    if (parts.length === 2) {
      const p = parseInt(parts[1]!, 10);
      if (!isNaN(p) && p >= 8 && p <= 32) {
        return Math.max(1, Math.pow(2, 32 - p) - 2);
      }
    }
    return 254;
  };

  // Add Subnet
  const handleCreateSubnet = (e: React.FormEvent) => {
    e.preventDefault();
    const total = calculateHostsFromCidr(formData.cidr);
    const newStatus = calculateStatus(formData.usedHosts, total);

    const newSub: SubnetBlock = {
      id: `sub-${Date.now()}`,
      name: formData.name || 'New Allocated Subnet',
      cidr: formData.cidr,
      category: formData.category,
      vlanId: Number(formData.vlanId),
      gateway: formData.gateway,
      totalHosts: total,
      usedHosts: Number(formData.usedHosts),
      status: newStatus,
    };

    setSubnets((prev) => [newSub, ...prev]);
    setSelectedSubnet(newSub);
    setIsAddOpen(false);
    showToast(`Subnet ${newSub.cidr} successfully allocated!`);
  };

  // Edit Subnet
  const handleOpenEdit = (sub: SubnetBlock, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSubnetToEdit({ ...sub });
    setIsEditOpen(true);
  };

  const handleUpdateSubnet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subnetToEdit) return;

    const total = calculateHostsFromCidr(subnetToEdit.cidr);
    const updatedStatus = calculateStatus(subnetToEdit.usedHosts, total);

    const updated: SubnetBlock = {
      ...subnetToEdit,
      totalHosts: total,
      status: updatedStatus,
    };

    setSubnets((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    if (selectedSubnet?.id === updated.id) {
      setSelectedSubnet(updated);
    }
    setIsEditOpen(false);
    showToast(`Subnet ${updated.cidr} updated.`);
  };

  // Delete Subnet
  const handleOpenDelete = (sub: SubnetBlock, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSubnetToDelete(sub);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!subnetToDelete) return;
    const remaining = subnets.filter((s) => s.id !== subnetToDelete.id);
    setSubnets(remaining);
    if (selectedSubnet?.id === subnetToDelete.id) {
      setSelectedSubnet(remaining.length > 0 ? remaining[0]! : null);
    }
    setIsDeleteOpen(false);
    showToast(`Subnet ${subnetToDelete.cidr} deleted.`);
  };

  // Export CSV Inventory
  const handleExportCsv = () => {
    const headers = ['ID,CIDR,Name,Category,VLAN,Gateway,TotalHosts,UsedHosts,UtilizationPct,Status'];
    const rows = subnets.map((s) => {
      const pct = Math.round((s.usedHosts / s.totalHosts) * 100);
      return `"${s.id}","${s.cidr}","${s.name}","${s.category}",${s.vlanId},"${s.gateway}",${s.totalHosts},${s.usedHosts},"${pct}%","${s.status}"`;
    });
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `audira_ipam_inventory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('IPAM Inventory exported as CSV!');
  };

  const getStatusBadge = (status: SubnetBlock['status']) => {
    switch (status) {
      case 'OPTIMAL':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono font-bold">OPTIMAL</span>;
      case 'WARNING':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono font-bold">WARNING (&gt;80%)</span>;
      case 'EXHAUSTED':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 font-mono font-bold animate-pulse">EXHAUSTED</span>;
    }
  };

  const generatedScript = selectedSubnet
    ? `/ip/address add address=${calcInputIp}/${calcPrefix} interface=ether2 comment="VLAN-${selectedSubnet.vlanId} Subnet"
/ip/pool add name=pool-vlan${selectedSubnet.vlanId} ranges=${calcInputIp.replace(/\.0$/, '.50')}-${calcInputIp.replace(/\.0$/, '.250')}
/ip/dhcp-server add name=dhcp-vlan${selectedSubnet.vlanId} interface=ether2 address-pool=pool-vlan${selectedSubnet.vlanId} disabled=no`
    : `# Pilih atau buat subnet baru untuk generate script RouterOS otomatis`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(generatedScript);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-cyan-950/90 border border-cyan-500 text-cyan-200 px-4 py-3 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center space-x-2 text-xs font-mono animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-[#0b1329]/90 border border-cyan-500/30 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[0_4px_25px_rgba(6,182,212,0.1)]">
        <div className="flex items-center space-x-3.5">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Network className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold text-white tracking-wide">Visual IPAM &amp; Subnet Tree Planner</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono font-semibold">
                VLSM &amp; Conflict Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Hierarchical CIDR allocator, DHCP pool exhaustion alerts, IP clash detection, and RouterOS script generator
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition"
            title="Download CSV inventory"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => {
              setFormData({
                name: '',
                cidr: '192.168.40.0/24',
                category: 'Core Management',
                vlanId: 40,
                gateway: '192.168.40.1',
                usedHosts: 10,
              });
              setIsAddOpen(true);
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold shadow-[0_0_15px_rgba(6,182,212,0.4)] transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Allocate New Subnet</span>
          </button>
        </div>
      </div>

      {/* Clashes Alert Banner if overlaps detected */}
      {clashes.length > 0 && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 flex items-center justify-between text-xs font-mono text-rose-300">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse" />
            <div>
              <span className="font-bold">IP Collision Detected!</span> Overlapping CIDR ranges detected between{' '}
              {clashes.map((c, i) => (
                <span key={i} className="font-bold text-white underline mx-1">
                  {c.sub1.cidr} &amp; {c.sub2.cidr}
                </span>
              ))}
            </div>
          </div>
          <span className="text-[10px] bg-rose-500/20 px-2 py-0.5 rounded text-rose-300 border border-rose-500/40">
            Routing Hazard
          </span>
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-[#090f20]/90 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Allocated Subnets</div>
            <div className="text-xl font-bold font-mono text-white mt-1">{subnets.length} Blocks</div>
          </div>
          <div className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded">
            {totalAllocatedIps.toLocaleString()} Total IPs
          </div>
        </div>

        <div className="bg-[#090f20]/90 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">IP Clashes / Conflicts</div>
            <div className={`text-xl font-bold font-mono mt-1 ${clashes.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {clashes.length} Detected
            </div>
          </div>
          {clashes.length > 0 ? (
            <AlertTriangle className="w-5 h-5 text-rose-400 animate-bounce" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          )}
        </div>

        <div className="bg-[#090f20]/90 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Exhaustion Warning</div>
            <div className="text-xl font-bold font-mono text-rose-400 mt-1">
              {exhaustedCount > 0 ? `${exhaustedCount} Pool Critical` : 'All Optimal'}
            </div>
          </div>
          <AlertTriangle className={`w-5 h-5 text-rose-400 ${exhaustedCount > 0 ? 'animate-pulse' : ''}`} />
        </div>

        <div className="bg-[#090f20]/90 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Global IP Utilization</div>
            <div className="text-xl font-bold font-mono text-cyan-300 mt-1">{globalUtilization}%</div>
          </div>
          <div className="text-[10px] font-mono text-slate-400">{totalUsedIps.toLocaleString()} Used</div>
        </div>
      </div>

      {/* Main Grid: Subnet Table + Subnet Inspector & VLSM Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Subnet Hierarchy List */}
        <div className="lg:col-span-8 space-y-3">
          <div className="bg-[#0b1329]/90 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter subnet CIDR, name, or VLAN..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Showing {filteredSubnets.length} of {subnets.length} subnets
            </span>
          </div>

          <div className="bg-[#070c18] border border-cyan-500/20 rounded-xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-[#0b1329] text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Subnet CIDR</th>
                    <th className="py-2.5 px-3">Name / Role</th>
                    <th className="py-2.5 px-3">VLAN</th>
                    <th className="py-2.5 px-3">Gateway</th>
                    <th className="py-2.5 px-3">Utilization</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                    <th className="py-2.5 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-[11px]">
                  {filteredSubnets.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-14 px-4 text-center text-slate-500 font-sans">
                        <div className="w-12 h-12 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-3 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                          <Network className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-semibold text-slate-300">Belum Ada Blok Subnet IPAM</p>
                        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto font-sans">
                          Semua data subnet telah dibersihkan. Klik tombol di bawah untuk mendefinisikan segmentasi IP/VLAN jaringan riil Anda.
                        </p>
                        <button
                          onClick={() => {
                            setFormData({
                              name: '',
                              cidr: '192.168.1.0/24',
                              category: 'Core Management',
                              vlanId: 10,
                              gateway: '192.168.1.1',
                              usedHosts: 0,
                            });
                            setIsAddOpen(true);
                          }}
                          className="mt-4 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md transition inline-flex items-center space-x-1.5 font-mono"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Tambah Subnet Pertama</span>
                        </button>
                      </td>
                    </tr>
                  ) : (
                    filteredSubnets.map((sub) => {
                      const pct = Math.round((sub.usedHosts / sub.totalHosts) * 100);
                      const isSelected = selectedSubnet?.id === sub.id;

                      return (
                        <tr
                          key={sub.id}
                          onClick={() => setSelectedSubnet(sub)}
                          className={`cursor-pointer transition ${
                            isSelected
                              ? 'bg-cyan-500/10 border-l-2 border-cyan-400 text-white font-semibold'
                              : 'hover:bg-slate-900/60 text-slate-300'
                          }`}
                        >
                        <td className="py-2.5 px-3 font-bold text-cyan-300">{sub.cidr}</td>
                        <td className="py-2.5 px-3 font-sans text-white">{sub.name}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[10px]">
                            VLAN {sub.vlanId}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-400">{sub.gateway}</td>
                        <td className="py-2.5 px-3">
                          <div className="w-28 space-y-1">
                            <div className="flex items-center justify-between text-[10px]">
                              <span>{pct}%</span>
                              <span className="text-slate-500">{sub.usedHosts}/{sub.totalHosts}</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  pct > 90
                                    ? 'bg-rose-500'
                                    : pct > 80
                                    ? 'bg-amber-400'
                                    : 'bg-emerald-400'
                                }`}
                                style={{ width: `${Math.min(pct, 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-right">{getStatusBadge(sub.status)}</td>
                        <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center space-x-1.5">
                            <button
                              onClick={(e) => handleOpenEdit(sub, e)}
                              className="p-1 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 rounded transition"
                              title="Edit Subnet"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => handleOpenDelete(sub, e)}
                              className="p-1 hover:bg-rose-950 text-slate-400 hover:text-rose-400 rounded transition"
                              title="Delete Subnet"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Subnet Inspector & VLSM Calculator */}
        <div className="lg:col-span-4 space-y-3">
          {/* Detail Subnet Inspector Card */}
          <div className="bg-[#0b1329]/90 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Subnet Inspector
              </span>
              {selectedSubnet && (
                <span className="text-[10px] font-mono text-cyan-400 font-bold">
                  {selectedSubnet.cidr}
                </span>
              )}
            </div>

            {selectedSubnet ? (
              <>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-slate-800/40">
                    <span className="text-slate-400">Name / Purpose:</span>
                    <span className="text-white font-sans text-[11px] truncate max-w-[160px]">{selectedSubnet.name}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/40">
                    <span className="text-slate-400">Category:</span>
                    <span className="text-cyan-300">{selectedSubnet.category}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/40">
                    <span className="text-slate-400">Gateway:</span>
                    <span className="text-white">{selectedSubnet.gateway}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/40">
                    <span className="text-slate-400">VLAN Tag:</span>
                    <span className="text-white">ID {selectedSubnet.vlanId}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/40">
                    <span className="text-slate-400">Usable Range:</span>
                    <span className="text-cyan-300">
                      {selectedSubnet.gateway.replace(/\.1$/, '.2')} - {selectedSubnet.gateway.replace(/\.1$/, '.254')}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/40">
                    <span className="text-slate-400">Broadcast:</span>
                    <span className="text-slate-300">
                      {selectedSubnet.gateway.replace(/\.1$/, '.255')}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Subnet Mask:</span>
                    <span className="text-slate-300">255.255.255.0</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    onClick={(e) => handleOpenEdit(selectedSubnet, e)}
                    className="flex items-center space-x-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded border border-slate-700 transition"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit Subnet</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="py-8 text-center text-slate-500 font-sans space-y-1">
                <Network className="w-7 h-7 mx-auto text-slate-600 mb-1" />
                <p className="text-xs text-slate-400">Pilih subnet dari tabel untuk melihat rincian.</p>
                <p className="text-[10px] text-slate-600">Atau buat subnet baru untuk memulai alokasi IP.</p>
              </div>
            )}
          </div>

          {/* Interactive VLSM Subnet Calculator */}
          <div className="bg-[#090f20]/90 border border-cyan-500/20 rounded-xl p-4 space-y-3">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                VLSM Subnet Calculator
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Network IP</label>
                <input
                  type="text"
                  value={calcInputIp}
                  onChange={(e) => setCalcInputIp(e.target.value)}
                  className="w-full px-2.5 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Prefix (/{calcPrefix})</label>
                <select
                  value={calcPrefix}
                  onChange={(e) => setCalcPrefix(Number(e.target.value))}
                  className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  {[24, 25, 26, 27, 28, 29, 30].map((p) => (
                    <option key={p} value={p}>
                      /{p} ({Math.pow(2, 32 - p) - 2} hosts)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Usable Hosts:</span>
                <span className="text-emerald-400 font-bold">{usableHosts}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Total Addresses:</span>
                <span className="text-slate-300">{totalIps}</span>
              </div>
            </div>

            {/* Generated RouterOS Snippet */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>RouterOS Command Snippet:</span>
                <button
                  onClick={handleCopyScript}
                  className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300"
                >
                  {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="bg-black/80 p-2 rounded text-[10px] font-mono text-slate-300 overflow-x-auto border border-slate-800/80 max-h-24">
                {generatedScript}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: Allocate New Subnet */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1329] border border-cyan-500/40 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Network className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white font-sans">Allocate New Subnet Block</h3>
              </div>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubnet} className="space-y-3">
              <div>
                <label className="text-slate-300 block mb-1">Subnet Name / Role</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Branch Office HQ - LAN"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">CIDR Block</label>
                  <input
                    type="text"
                    required
                    placeholder="192.168.40.0/24"
                    value={formData.cidr}
                    onChange={(e) => setFormData({ ...formData, cidr: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">VLAN ID</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={4094}
                    value={formData.vlanId}
                    onChange={(e) => setFormData({ ...formData, vlanId: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Default Gateway</label>
                  <input
                    type="text"
                    required
                    placeholder="192.168.40.1"
                    value={formData.gateway}
                    onChange={(e) => setFormData({ ...formData, gateway: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Allocated Hosts</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.usedHosts}
                    onChange={(e) => setFormData({ ...formData, usedHosts: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Category Classification</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as SubnetBlock['category'] })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400 font-sans"
                >
                  <option value="Core Management">Core Management</option>
                  <option value="WiFi Distribution">WiFi Distribution</option>
                  <option value="Server DMZ">Server DMZ</option>
                  <option value="VoIP Network">VoIP Network</option>
                </select>
              </div>

              <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-lg text-[11px] text-cyan-300">
                Calculated Capacity: ~{calculateHostsFromCidr(formData.cidr)} usable host addresses on /
                {formData.cidr.split('/')[1] || '24'}.
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold shadow-[0_0_15px_rgba(6,182,212,0.4)] transition"
                >
                  Allocate Subnet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Edit Subnet */}
      {isEditOpen && subnetToEdit && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1329] border border-cyan-500/40 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Edit2 className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white font-sans">Edit Subnet Allocation</h3>
              </div>
              <button onClick={() => setIsEditOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubnet} className="space-y-3">
              <div>
                <label className="text-slate-300 block mb-1">Subnet Name</label>
                <input
                  type="text"
                  required
                  value={subnetToEdit.name}
                  onChange={(e) => setSubnetToEdit({ ...subnetToEdit, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">CIDR Block</label>
                  <input
                    type="text"
                    required
                    value={subnetToEdit.cidr}
                    onChange={(e) => setSubnetToEdit({ ...subnetToEdit, cidr: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">VLAN ID</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={4094}
                    value={subnetToEdit.vlanId}
                    onChange={(e) => setSubnetToEdit({ ...subnetToEdit, vlanId: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Default Gateway</label>
                  <input
                    type="text"
                    required
                    value={subnetToEdit.gateway}
                    onChange={(e) => setSubnetToEdit({ ...subnetToEdit, gateway: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Used Hosts</label>
                  <input
                    type="number"
                    min={0}
                    value={subnetToEdit.usedHosts}
                    onChange={(e) => setSubnetToEdit({ ...subnetToEdit, usedHosts: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Category Classification</label>
                <select
                  value={subnetToEdit.category}
                  onChange={(e) => setSubnetToEdit({ ...subnetToEdit, category: e.target.value as SubnetBlock['category'] })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400 font-sans"
                >
                  <option value="Core Management">Core Management</option>
                  <option value="WiFi Distribution">WiFi Distribution</option>
                  <option value="Server DMZ">Server DMZ</option>
                  <option value="VoIP Network">VoIP Network</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Delete Confirmation */}
      {isDeleteOpen && subnetToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1329] border border-rose-500/40 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl font-mono text-xs">
            <div className="flex items-center space-x-2 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-sm font-bold text-white font-sans">Delete Subnet Allocation?</h3>
            </div>

            <p className="text-slate-300 font-sans text-xs">
              Are you sure you want to remove subnet block <span className="font-bold font-mono text-cyan-300">{subnetToDelete.cidr}</span> ({subnetToDelete.name})?
            </p>

            <div className="p-3 bg-rose-950/30 border border-rose-500/30 rounded-lg text-rose-300 text-[11px]">
              ⚠️ Warning: This subnet currently tracks {subnetToDelete.usedHosts} allocated hosts on VLAN {subnetToDelete.vlanId}. Deleting this will unbind the IPAM record.
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-[0_0_15px_rgba(244,63,94,0.4)] transition"
              >
                Delete Subnet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
