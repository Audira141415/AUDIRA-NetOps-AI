// Configuration Management Component (View, Diff, Validate, Rollback)

import React, { useState } from 'react';
import {
  FileCode2,
  CheckCircle2,
  AlertTriangle,
  History,
  RotateCcw,
  Shield,
  Download,
  Upload,
} from 'lucide-react';
import { RiskLevel } from '@audira/types';

export const ConfigManager: React.FC = () => {
  const [activeDevice, setActiveDevice] = useState('CORE-JOGJA-01');
  const [activeTab, setActiveTab] = useState<'view' | 'diff' | 'validate'>('diff');

  const BEFORE_CODE = [
    '/interface bridge add name=bridge-lan vlan-filtering=yes',
    '/interface ethernet set [ find default-name=ether1 ] name=ether1-wan',
    '/interface ethernet set [ find default-name=ether2 ] name=ether2-lan',
    '/ip address add address=192.168.10.1/24 interface=bridge-lan network=192.168.10.0',
    '/ip route add dst-address=0.0.0.0/0 gateway=192.168.1.1',
    '/ip firewall nat add action=masquerade chain=srcnat out-interface=ether1-wan',
  ];

  const AFTER_CODE = [
    { type: 'UNCHANGED', text: '/interface bridge add name=bridge-lan vlan-filtering=yes' },
    { type: 'UNCHANGED', text: '/interface ethernet set [ find default-name=ether1 ] name=ether1-wan' },
    { type: 'UNCHANGED', text: '/interface ethernet set [ find default-name=ether2 ] name=ether2-lan' },
    { type: 'ADDED', text: '+ /interface vlan add interface=bridge-lan name=vlan100-iot vlan-id=100' },
    { type: 'UNCHANGED', text: '/ip address add address=192.168.10.1/24 interface=bridge-lan network=192.168.10.0' },
    { type: 'ADDED', text: '+ /ip address add address=10.100.0.1/24 interface=vlan100-iot network=10.100.0.0' },
    { type: 'ADDED', text: '+ /ip pool add name=pool-vlan100 ranges=10.100.0.10-10.100.0.250' },
    { type: 'ADDED', text: '+ /ip dhcp-server add address-pool=pool-vlan100 interface=vlan100-iot name=dhcp-vlan100' },
    { type: 'UNCHANGED', text: '/ip route add dst-address=0.0.0.0/0 gateway=192.168.1.1' },
    { type: 'UNCHANGED', text: '/ip firewall nat add action=masquerade chain=srcnat out-interface=ether1-wan' },
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-noc-panel border border-noc-border rounded-lg p-3">
        <div className="flex items-center space-x-3">
          <FileCode2 className="w-5 h-5 text-cyan-400" />
          <div>
            <h1 className="text-sm font-semibold text-white">Network Configuration Manager</h1>
            <p className="text-xs text-slate-400 font-mono">Live Configuration, Visual Diffing, &amp; Rollback Engine</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={activeDevice}
            onChange={e => setActiveDevice(e.target.value)}
            className="bg-noc-surface border border-noc-border text-slate-200 text-xs font-mono rounded px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            <option value="CORE-JOGJA-01">CORE-JOGJA-01 (192.168.10.1)</option>
            <option value="CORE-JOGJA-02">CORE-JOGJA-02 (192.168.10.2)</option>
            <option value="EDGE-JOGJA-01">EDGE-JOGJA-01 (192.168.10.254)</option>
          </select>

          <button
            onClick={() => alert('Exporting active configuration file: CORE-JOGJA-01-running.rsc')}
            className="flex items-center space-x-1 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 border border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export RSC</span>
          </button>
        </div>
      </div>

      {/* Tabs: Visual Diff, Running Config, Syntax Validator */}
      <div className="flex items-center space-x-2 border-b border-noc-border pb-2 text-xs font-mono">
        <button
          onClick={() => setActiveTab('diff')}
          className={`px-3 py-1 rounded transition ${
            activeTab === 'diff' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Visual Configuration Diff (Green / Red / Yellow)
        </button>
        <button
          onClick={() => setActiveTab('view')}
          className={`px-3 py-1 rounded transition ${
            activeTab === 'view' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Running Configuration View
        </button>
      </div>

      {/* Visual Diff Window */}
      {activeTab === 'diff' && (
        <div className="bg-noc-panel border border-noc-border rounded-lg overflow-hidden">
          <div className="p-3 border-b border-noc-border bg-noc-surface/60 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-3">
              <span className="text-slate-300 font-semibold">Base Config: Active Running</span>
              <span className="text-slate-500">→</span>
              <span className="text-cyan-400 font-semibold">Target: VLAN 100 Deployment Proposal</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px]">
                +4 Added (GREEN)
              </span>
              <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px]">
                -0 Removed (RED)
              </span>
              <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/40 text-[10px] font-bold">
                RISK: HIGH
              </span>
            </div>
          </div>

          <div className="p-4 bg-[#050810] font-mono text-xs space-y-1 overflow-x-auto">
            {AFTER_CODE.map((item, idx) => (
              <div
                key={idx}
                className={`py-0.5 px-2 rounded ${
                  item.type === 'ADDED'
                    ? 'bg-emerald-950/30 text-emerald-400 border-l-2 border-emerald-500'
                    : 'text-slate-400'
                }`}
              >
                {item.text}
              </div>
            ))}
          </div>

          <div className="p-3 bg-noc-surface/50 border-t border-noc-border flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-2 text-slate-400 text-[11px]">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Automatic rollback snapshot will be created before execution.</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => alert('Rollback test: Restoring previous backup baseline.')}
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Rollback</span>
              </button>
              <button
                onClick={() => alert('Pre-flight checks passed! Change applied to CORE-JOGJA-01.')}
                className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow glow-emerald"
              >
                Apply Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Running Config View */}
      {activeTab === 'view' && (
        <div className="bg-noc-panel border border-noc-border rounded-lg p-4 bg-[#050810] font-mono text-xs text-slate-300 space-y-1">
          {BEFORE_CODE.map((line, idx) => (
            <div key={idx}>{line}</div>
          ))}
        </div>
      )}
    </div>
  );
};
