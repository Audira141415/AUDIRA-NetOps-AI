// Network Topology Graph Component with React Flow

import React, { useState } from 'react';
import {
  Server,
  Zap,
  Activity,
  Layers,
  Search,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import { useNetOpsStore } from '../../store/useNetOpsStore';

interface TopoNode {
  id: string;
  name: string;
  ip: string;
  role: string;
  vendor: string;
  status: 'ONLINE' | 'WARNING' | 'OFFLINE';
  cpu: number;
  latency: number;
  loss: number;
  x: number;
  y: number;
}

const TOPO_NODES: TopoNode[] = [
  { id: '1', name: 'CORE-JOGJA-01', ip: '192.168.10.1', role: 'Core Router', vendor: 'MikroTik CCR2004', status: 'ONLINE', cpu: 16.5, latency: 1.2, loss: 0, x: 280, y: 140 },
  { id: '2', name: 'CORE-JOGJA-02', ip: '192.168.10.2', role: 'Core Router', vendor: 'MikroTik CCR2004', status: 'ONLINE', cpu: 14.2, latency: 1.4, loss: 0, x: 620, y: 140 },
  { id: '3', name: 'EDGE-JOGJA-01', ip: '192.168.10.254', role: 'Edge Firewall', vendor: 'MikroTik RB5009', status: 'ONLINE', cpu: 28.0, latency: 2.1, loss: 0, x: 450, y: 20 },
  { id: '4', name: 'SW-JOGJA-01', ip: '192.168.10.11', role: 'Dist Switch', vendor: 'CRS326 Switch', status: 'ONLINE', cpu: 32.1, latency: 2.5, loss: 0, x: 280, y: 320 },
  { id: '5', name: 'SW-JOGJA-02', ip: '192.168.10.12', role: 'Access Switch', vendor: 'CRS326 Switch', status: 'WARNING', cpu: 38.5, latency: 3.8, loss: 1.4, x: 620, y: 320 },
  { id: '6', name: 'AP-01-NOC', ip: '192.168.20.5', role: 'WiFi AP', vendor: 'cAP ax', status: 'ONLINE', cpu: 9.5, latency: 4.2, loss: 0, x: 180, y: 480 },
  { id: '7', name: 'SERVER-MGMT-01', ip: '192.168.10.200', role: 'Linux Host', vendor: 'Ubuntu 24.04', status: 'ONLINE', cpu: 11.0, latency: 1.8, loss: 0, x: 720, y: 480 },
];

export const NetworkTopology: React.FC = () => {
  const { setSelectedDevice, setCurrentTab } = useNetOpsStore();
  const [selectedNode, setSelectedNode] = useState<TopoNode | null>(TOPO_NODES[0]!);
  const [search, setSearch] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);

  const filteredNodes = TOPO_NODES.filter(n =>
    n.name.toLowerCase().includes(search.toLowerCase()) ||
    n.ip.includes(search)
  );

  return (
    <div className="flex h-[calc(100vh-3.5rem)] bg-noc-bg select-none">
      {/* Topology Canvas */}
      <div className="flex-1 relative overflow-hidden bg-grid-pattern flex flex-col">
        {/* Top Controls Toolbar */}
        <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 bg-noc-panel/90 border border-noc-border rounded-lg p-2 backdrop-blur">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Search topology nodes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-2 py-1 bg-noc-surface border border-noc-border rounded text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-52"
            />
          </div>

          <div className="h-4 w-px bg-noc-border" />

          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.1, 1.5))}
            className="p-1.5 rounded hover:bg-noc-surface text-slate-300 transition"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.1, 0.6))}
            className="p-1.5 rounded hover:bg-noc-surface text-slate-300 transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1.5 rounded hover:bg-noc-surface text-slate-300 transition"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Legend Overlay */}
        <div className="absolute bottom-4 left-4 z-10 bg-noc-panel/90 border border-noc-border rounded-lg p-2.5 backdrop-blur text-[10px] font-mono space-y-1">
          <div className="text-slate-400 font-semibold mb-1">LINK HEALTH STATUS</div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-1 bg-emerald-500 rounded" />
            <span className="text-slate-300">10G SFP+ Link (Healthy)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-1 bg-amber-500 rounded animate-pulse" />
            <span className="text-amber-400">Degraded Link (Loss &gt; 1%)</span>
          </div>
        </div>

        {/* Interactive SVG Links & HTML Nodes */}
        <div
          className="flex-1 w-full h-full relative"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}
        >
          {/* SVG Link lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Edge to Core 1 & Core 2 */}
            <line x1="450" y1="50" x2="280" y2="140" stroke="#10B981" strokeWidth="2" strokeDasharray="4 2" />
            <line x1="450" y1="50" x2="620" y2="140" stroke="#10B981" strokeWidth="2" strokeDasharray="4 2" />

            {/* Core 1 to Core 2 MLAG */}
            <line x1="280" y1="140" x2="620" y2="140" stroke="#06B6D4" strokeWidth="3" />

            {/* Core 1 to SW 1 */}
            <line x1="280" y1="140" x2="280" y2="320" stroke="#10B981" strokeWidth="2" />

            {/* Core 2 to SW 2 (Degraded Link) */}
            <line x1="620" y1="140" x2="620" y2="320" stroke="#F59E0B" strokeWidth="2" strokeDasharray="5 3" />

            {/* SW 1 to AP 1 */}
            <line x1="280" y1="320" x2="180" y2="480" stroke="#475569" strokeWidth="1.5" />

            {/* SW 2 to Server 1 */}
            <line x1="620" y1="320" x2="720" y2="480" stroke="#475569" strokeWidth="1.5" />
          </svg>

          {/* Device Nodes */}
          {filteredNodes.map(node => {
            const isSelected = selectedNode?.id === node.id;
            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                style={{ left: `${node.x - 70}px`, top: `${node.y - 35}px` }}
                className={`absolute w-36 p-2 rounded-lg cursor-pointer transition select-none ${
                  isSelected
                    ? 'bg-noc-panel border-2 border-cyan-400 shadow-lg glow-cyan scale-105'
                    : 'bg-noc-panel/90 hover:bg-noc-panel border border-noc-border hover:border-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-slate-400">{node.role}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      node.status === 'ONLINE' ? 'bg-emerald-500' : 'bg-amber-500 animate-ping'
                    }`}
                  />
                </div>

                <div className="font-semibold text-xs text-white font-mono truncate">{node.name}</div>
                <div className="text-[10px] text-cyan-400 font-mono">{node.ip}</div>

                <div className="mt-1.5 pt-1.5 border-t border-noc-border flex items-center justify-between text-[9px] font-mono text-slate-400">
                  <span>CPU: {node.cpu}%</span>
                  <span>{node.latency}ms</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Node Sidebar Inspector */}
      {selectedNode && (
        <div className="w-80 bg-noc-panel border-l border-noc-border p-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-noc-border pb-3">
              <div className="text-[10px] text-cyan-400 font-mono uppercase tracking-wider">
                Node Telemetry Inspector
              </div>
              <h2 className="text-base font-bold text-white font-mono mt-0.5">{selectedNode.name}</h2>
              <div className="text-xs text-slate-400 font-mono">{selectedNode.vendor}</div>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">OPERATIONAL STATE:</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    selectedNode.status === 'ONLINE'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {selectedNode.status}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">IP ADDRESS:</span>
                <span className="text-cyan-300 font-semibold">{selectedNode.ip}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">CPU UTILIZATION:</span>
                <span className="text-slate-200">{selectedNode.cpu}%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">RTT LATENCY:</span>
                <span className="text-slate-200">{selectedNode.latency} ms</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">PACKET LOSS:</span>
                <span className={selectedNode.loss > 0 ? 'text-amber-400' : 'text-slate-200'}>
                  {selectedNode.loss}%
                </span>
              </div>
            </div>

            {selectedNode.loss > 0 && (
              <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/30 text-xs">
                <div className="text-amber-400 font-semibold flex items-center space-x-1 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Degraded Link Detected</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Elevated packet loss on uplink to CORE-JOGJA-02. Check duplex mismatches or fiber link dBm levels.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2 pt-4 border-t border-noc-border">
            <button
              onClick={() => {
                setSelectedDevice({
                  id: selectedNode.id,
                  name: selectedNode.name,
                  hostname: `${selectedNode.name.toLowerCase()}.audira.net`,
                  ipAddress: selectedNode.ip,
                  vendor: 'MikroTik',
                  deviceType: 'ROUTER',
                  connectionType: 'ROUTEROS_API',
                  apiPort: 8728,
                  sshPort: 22,
                  status: selectedNode.status,
                  createdAt: '',
                  updatedAt: '',
                });
                setCurrentTab('device-detail');
              }}
              className="w-full py-2 px-3 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold shadow glow-cyan transition text-center"
            >
              Open WinBox Management
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
