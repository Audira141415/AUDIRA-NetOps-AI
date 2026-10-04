// Configuration Management Component (View, Diff, Validate, Rollback) with Monaco Editor & shadcn/ui

import React, { useState } from 'react';
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
} from 'lucide-react';
import { Button, Badge, Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui';

export const ConfigManager: React.FC = () => {
  const [activeDevice, setActiveDevice] = useState('CORE-JOGJA-01');
  const [activeTab, setActiveTab] = useState<'diff' | 'editor' | 'history'>('diff');

  const BEFORE_CODE = [
    '# RouterOS v7.15.2 configuration export',
    '# by AUDIRA NetOps AI on 2026-10-04',
    '/interface bridge add name=bridge-lan vlan-filtering=yes',
    '/interface ethernet set [ find default-name=ether1 ] name=ether1-wan',
    '/interface ethernet set [ find default-name=ether2 ] name=ether2-lan',
    '/ip address add address=192.168.10.1/24 interface=bridge-lan network=192.168.10.0',
    '/ip route add dst-address=0.0.0.0/0 gateway=192.168.1.1 distance=1',
    '/ip firewall nat add action=masquerade chain=srcnat out-interface=ether1-wan',
    '/system identity set name="CORE-JOGJA-01"',
  ].join('\n');

  const AFTER_CODE = [
    '# RouterOS v7.15.2 configuration export',
    '# by AUDIRA NetOps AI on 2026-10-04 (Target: VLAN 100 Proposal)',
    '/interface bridge add name=bridge-lan vlan-filtering=yes',
    '/interface ethernet set [ find default-name=ether1 ] name=ether1-wan',
    '/interface ethernet set [ find default-name=ether2 ] name=ether2-lan',
    '/interface vlan add interface=bridge-lan name=vlan100-iot vlan-id=100',
    '/ip address add address=192.168.10.1/24 interface=bridge-lan network=192.168.10.0',
    '/ip address add address=10.100.0.1/24 interface=vlan100-iot network=10.100.0.0',
    '/ip pool add name=pool-vlan100 ranges=10.100.0.10-10.100.0.250',
    '/ip dhcp-server add address-pool=pool-vlan100 interface=vlan100-iot name=dhcp-vlan100',
    '/ip route add dst-address=0.0.0.0/0 gateway=192.168.1.1 distance=1',
    '/ip firewall nat add action=masquerade chain=srcnat out-interface=ether1-wan',
    '/system identity set name="CORE-JOGJA-01"',
  ].join('\n');

  const [editorCode, setEditorCode] = useState<string>(BEFORE_CODE);

  return (
    <div className="p-4 space-y-4">
      {/* Top Header Card */}
      <Card className="bg-noc-panel border-noc-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <FileCode2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-sm font-semibold text-white font-mono">Network Configuration Studio</h1>
                <Badge variant="cyan">Monaco Editor Engine</Badge>
              </div>
              <p className="text-xs text-slate-400 font-mono">Live Configuration, Visual Diffing, &amp; Disaster Recovery</p>
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

            <Button
              variant="outline"
              size="sm"
              onClick={() => alert(`Exporting active configuration file: ${activeDevice}-running.rsc`)}
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              <span>Export RSC</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabs navigation */}
      <div className="flex items-center space-x-2 border-b border-noc-border pb-2 text-xs font-mono">
        <button
          onClick={() => setActiveTab('diff')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded transition ${
            activeTab === 'diff'
              ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Monaco Visual Diff (Green / Red / Yellow)</span>
        </button>
        <button
          onClick={() => setActiveTab('editor')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded transition ${
            activeTab === 'editor'
              ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Monaco Script Editor</span>
        </button>
      </div>

      {/* Visual Diff Window (Monaco DiffEditor) */}
      {activeTab === 'diff' && (
        <div className="bg-noc-panel border border-noc-border rounded-lg overflow-hidden shadow-lg">
          <div className="p-3 border-b border-noc-border bg-noc-surface/60 flex flex-wrap items-center justify-between text-xs font-mono gap-2">
            <div className="flex items-center space-x-3">
              <span className="text-slate-400">Baseline: <strong className="text-slate-200">Active Running Config</strong></span>
              <span className="text-slate-500">→</span>
              <span className="text-cyan-400 font-semibold">Proposal: VLAN 100 Deployment</span>
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant="success">+4 Added (GREEN)</Badge>
              <Badge variant="destructive">-0 Removed (RED)</Badge>
              <Badge variant="warning">RISK: HIGH</Badge>
            </div>
          </div>

          <div className="h-[460px] bg-[#1e1e1e]">
            <DiffEditor
              height="100%"
              original={BEFORE_CODE}
              modified={AFTER_CODE}
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

          <div className="p-3 bg-noc-surface/50 border-t border-noc-border flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-2 text-slate-400 text-[11px]">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Safety Pipeline: Pre-flight snapshot will be created automatically before change.</span>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => alert('Rollback test: Restoring previous backup baseline.')}
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                <span>Rollback</span>
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => alert(`Pre-flight checks passed! Change applied to ${activeDevice}.`)}
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                <span>Apply Configuration</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Script Editor (Monaco Editor) */}
      {activeTab === 'editor' && (
        <div className="bg-noc-panel border border-noc-border rounded-lg overflow-hidden shadow-lg">
          <div className="p-3 border-b border-noc-border bg-noc-surface/60 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-2">
              <span className="text-slate-300 font-semibold">{activeDevice}.rsc (Interactive Editor)</span>
              <Badge variant="secondary">RouterOS Script</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => alert('Syntax check completed: 0 errors, 0 warnings.')}
              >
                <Sparkles className="w-3.5 h-3.5 mr-1 text-cyan-400" />
                <span>Validate Syntax</span>
              </Button>
            </div>
          </div>

          <div className="h-[460px] bg-[#1e1e1e]">
            <Editor
              height="100%"
              value={editorCode}
              onChange={val => setEditorCode(val || '')}
              language="shell"
              theme="vs-dark"
              options={{
                readOnly: false,
                minimap: { enabled: true },
                fontSize: 12,
                fontFamily: 'JetBrains Mono, Fira Code, Consolas, monospace',
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
