// PuTTY-like Interactive Live Terminal Component

import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal as TerminalIcon,
  Plus,
  X,
  RotateCw,
  PowerOff,
  Copy,
  Trash2,
  Maximize2,
  Columns,
  Search,
  Wifi,
  ShieldCheck,
} from 'lucide-react';
import { useNetOpsStore, TerminalTabItem } from '../../store/useNetOpsStore';

export const PuTTYTerminal: React.FC = () => {
  const {
    terminalTabs,
    activeTerminalTabId,
    setActiveTerminalTabId,
    closeTerminalTab,
    addTerminalTab,
  } = useNetOpsStore();

  const [terminalOutput, setTerminalOutput] = useState<Record<string, string[]>>({
    'tab-core-01': [
      '\x1b[36m  █████╗ ██╗   ██╗██████╗ ██╗██████╗  █████╗ \x1b[0m',
      '\x1b[36m ██╔══██╗██║   ██║██╔══██╗██║██╔══██╗██╔══██╗\x1b[0m',
      '\x1b[36m ███████║██║   ██║██║  ██║██║██████╔╝███████║\x1b[0m',
      '\x1b[36m ██╔══██║██║   ██║██║  ██║██║██╔══██╗██╔══██║\x1b[0m',
      '\x1b[36m ██║  ██║╚██████╔╝██████╔╝██║██║  ██║██║  ██║\x1b[0m  \x1b[33mNetOps Live Terminal\x1b[0m',
      '\x1b[90mConnected to CORE-JOGJA-01 (MikroTik RouterOS v7.14.3 arm64) over SSH-2.0\x1b[0m',
      '\x1b[90mSession secured & audited. Never enter plaintext private keys.\x1b[0m',
      '',
    ],
  });

  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isSplit, setIsSplit] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeTab = terminalTabs.find(t => t.id === activeTerminalTabId) || terminalTabs[0];

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalOutput, activeTerminalTabId]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || !activeTab) return;

    const cmd = inputVal.trim();
    setHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);

    // Append command to output
    const promptLine = `[admin@${activeTab.name}] > ${cmd}`;
    let responseLines: string[] = [];

    if (cmd === 'help' || cmd === '?') {
      responseLines = [
        'Available CLI Commands:',
        '  /system resource print      - Show CPU, memory, uptime',
        '  /interface print            - Show network interface states',
        '  /ip address print           - Show assigned IP addresses',
        '  /ip route print             - Show routing table',
        '  /ping <target>              - Send ICMP echo requests',
        '  clear                       - Clear terminal screen',
      ];
    } else if (cmd === 'clear') {
      setTerminalOutput(prev => ({ ...prev, [activeTab.id]: [] }));
      setInputVal('');
      return;
    } else if (cmd.includes('/system resource print') || cmd === 'resource') {
      responseLines = [
        '                   uptime: 42d16h24m',
        '                  version: 7.14.3 (stable)',
        '               build-time: Feb/28/2026 12:30:11',
        '             free-memory: 3.2GiB',
        '            total-memory: 4.0GiB',
        '                     cpu: ARM64 AL32400',
        '               cpu-count: 4',
        '           cpu-frequency: 1700MHz',
        '                cpu-load: 14%',
      ];
    } else if (cmd.includes('/interface print') || cmd === 'interface') {
      responseLines = [
        'Flags: R - RUNNING',
        'Columns: NAME, TYPE, ACTUAL-MTU, MAC-ADDRESS',
        ' #   NAME          TYPE       ACTUAL-MTU  MAC-ADDRESS',
        ' 0 R sfp-sfpplus1  sfp-plus   1500        D4:CA:6D:E1:01:01',
        ' 1 R ether1-wan    ethernet   1500        D4:CA:6D:E1:01:02',
        ' 2 R ether2-lan    ethernet   1500        D4:CA:6D:E1:01:03',
        ' 3 R bridge-lan    bridge     1500        D4:CA:6D:E1:01:04',
      ];
    } else if (cmd.includes('system reset') || cmd.includes('reboot')) {
      responseLines = [
        '\x1b[31;1m[SECURITY BLOCKED] Command contains high/critical risk. Automated execution denied without signed approval.\x1b[0m',
      ];
    } else {
      responseLines = [`[RouterOS executed]: ${cmd}`];
    }

    setTerminalOutput(prev => ({
      ...prev,
      [activeTab.id]: [...(prev[activeTab.id] || []), promptLine, ...responseLines],
    }));

    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIdx);
        setInputVal(history[nextIdx] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const nextIdx = historyIndex + 1;
        if (nextIdx >= history.length) {
          setHistoryIndex(-1);
          setInputVal('');
        } else {
          setHistoryIndex(nextIdx);
          setInputVal(history[nextIdx] || '');
        }
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-[#050810] font-mono text-xs select-none">
      {/* PuTTY Tabs Bar: [CORE-01] [CORE-02] [SW-01] [+] */}
      <div className="h-10 bg-noc-panel border-b border-noc-border px-2 flex items-center justify-between">
        <div className="flex items-center space-x-1 overflow-x-auto">
          {terminalTabs.map(tab => {
            const isActive = tab.id === activeTerminalTabId;
            return (
              <div
                key={tab.id}
                onClick={() => setActiveTerminalTabId(tab.id)}
                className={`group flex items-center space-x-2 px-3 py-1.5 rounded-t text-xs cursor-pointer border-t border-x transition ${
                  isActive
                    ? 'bg-[#080C14] border-cyan-500/50 text-cyan-300 font-semibold shadow glow-cyan'
                    : 'bg-noc-surface/50 border-noc-border text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>[{tab.name}]</span>
                <span className="text-[10px] text-slate-500">({tab.latencyMs}ms)</span>

                <button
                  onClick={e => {
                    e.stopPropagation();
                    closeTerminalTab(tab.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}

          <button
            onClick={() =>
              addTerminalTab({
                id: `dev-${Date.now()}`,
                name: `SW-JOGJA-02`,
                hostname: 'sw-02.audira.net',
                ipAddress: '192.168.10.12',
                vendor: 'MikroTik',
                deviceType: 'SWITCH',
                connectionType: 'SSH',
                apiPort: 8728,
                sshPort: 22,
                status: 'WARNING',
                createdAt: '',
                updatedAt: '',
              })
            }
            className="p-1.5 rounded bg-noc-surface hover:bg-noc-surface/80 border border-noc-border text-slate-400 hover:text-cyan-300 transition"
            title="Open New Terminal Session"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Toolbar: Reconnect, Copy, Clear, Split, Fullscreen */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-emerald-400">
            <Wifi className="w-3 h-3 animate-pulse" />
            <span>SSH-2.0 · 1.2ms</span>
          </div>

          <button
            title="Clear Terminal Screen"
            onClick={() => {
              if (activeTab) {
                setTerminalOutput(prev => ({ ...prev, [activeTab.id]: [] }));
              }
            }}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            title="Split Screen"
            onClick={() => setIsSplit(!isSplit)}
            className={`p-1 rounded hover:bg-slate-800 transition ${
              isSplit ? 'text-cyan-400 bg-cyan-950/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Screen Body */}
      <div className={`flex-1 p-3 overflow-y-auto space-y-1 ${isSplit ? 'grid grid-cols-2 gap-2' : ''}`}>
        {/* Primary Terminal View */}
        <div
          className="h-full overflow-y-auto cursor-text"
          onClick={() => inputRef.current?.focus()}
        >
          {(terminalOutput[activeTab?.id || ''] || []).map((line, idx) => (
            <div key={idx} className="whitespace-pre-wrap leading-relaxed text-slate-300">
              {line}
            </div>
          ))}

          {/* Interactive Command Input Line */}
          <form onSubmit={handleCommandSubmit} className="flex items-center space-x-2 mt-2">
            <span className="text-cyan-400 font-semibold whitespace-nowrap">
              [admin@{activeTab?.name || 'router'}] &gt;
            </span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-emerald-300 font-mono text-xs caret-emerald-400"
              autoFocus
            />
          </form>
          <div ref={terminalEndRef} />
        </div>

        {/* Split View Secondary Console if enabled */}
        {isSplit && (
          <div className="border-l border-noc-border pl-3 h-full overflow-y-auto text-slate-400">
            <div className="text-[10px] text-cyan-400 mb-2 border-b border-noc-border pb-1">
              [Split Console: SW-JOGJA-01 Monitor Stream]
            </div>
            <div className="text-slate-500">Streaming passive interface packet drop logs...</div>
            <div className="text-slate-400 mt-1">ether8 link rate: 100Mbps Full Duplex</div>
            <div className="text-amber-400 mt-1">Warning: RX pause frame detected on port 8</div>
          </div>
        )}
      </div>
    </div>
  );
};
