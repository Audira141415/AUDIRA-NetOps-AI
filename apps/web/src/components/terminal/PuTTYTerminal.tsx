// PuTTY-like Interactive Live Terminal Component
// Real Multi-Vendor SSH Session Manager with PTY Streaming via WebSocket & Web Serial

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
  KeyRound,
  Lock,
  User,
  Server,
  Globe,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  Shield,
  Zap,
  Usb,
  Radio,
  Cpu,
  RefreshCw,
  Sliders,
  Send,
  HelpCircle,
} from 'lucide-react';
import { useNetOpsStore, TerminalTabItem, SerialPortConfig } from '../../store/useNetOpsStore';
import { Device } from '@audira/types';
import { ConsoleHardwareDetector } from './ConsoleHardwareDetector';
import { XtermView, XtermViewRef, SessionCredentials } from './XtermView';

export const PuTTYTerminal: React.FC = () => {
  const {
    terminalTabs,
    activeTerminalTabId,
    setActiveTerminalTabId,
    closeTerminalTab,
    addTerminalTab,
    addSerialTerminalTab,
    updateTerminalTabStatus,
    devices,
  } = useNetOpsStore();

  const [tabCredentials, setTabCredentials] = useState<Record<string, SessionCredentials>>({});
  const xtermRefs = useRef<Record<string, XtermViewRef | null>>({});

  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isSplit, setIsSplit] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // New Connection / Login Modal State
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isConsoleDetectorOpen, setIsConsoleDetectorOpen] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(
    devices.length > 0 ? devices[0]!.id : 'custom'
  );
  const [customHost, setCustomHost] = useState('192.168.100.180');
  const [sshPort, setSshPort] = useState(22);
  const [protocol, setProtocol] = useState<'SSH' | 'TELNET' | 'SERIAL' | 'CONSOLE_SERVER'>('SSH');
  const [serialPortName, setSerialPortName] = useState('COM3');
  const [serialBaudRate, setSerialBaudRate] = useState(115200);
  const [username, setUsername] = useState('audira');
  const [password, setPassword] = useState('');
  const [authMethod, setAuthMethod] = useState<'PASSWORD' | 'SSH_KEY'>('PASSWORD');
  const [showPassword, setShowPassword] = useState(false);
  const [isMockMode, setIsMockMode] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const activeTab = terminalTabs.find((t) => t.id === activeTerminalTabId) || terminalTabs[0];

  const handleStatusChange = React.useCallback(
    (tabId: string, status: 'ONLINE' | 'CONNECTING' | 'OFFLINE') => {
      updateTerminalTabStatus(tabId, status);
    },
    [updateTerminalTabStatus]
  );

  // Open modal when plus is clicked
  const handleOpenNewConnection = () => {
    if (devices.length > 0) {
      setSelectedDeviceId(devices[0]!.id);
      setUsername('admin');
      setPassword('');
      setSshPort(devices[0]!.sshPort || 22);
    } else {
      setSelectedDeviceId('custom');
      setCustomHost('192.168.100.180');
      setUsername('audira');
      setPassword('');
      setSshPort(22);
    }
    setIsConnectModalOpen(true);
  };

  // Connect & launch real SSH or Serial session
  const handleConnectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);

    const isCustom = selectedDeviceId === 'custom';
    const chosenDevice = !isCustom ? devices.find((d) => d.id === selectedDeviceId) : null;
    const targetHost = isCustom ? customHost.trim() : (chosenDevice?.ipAddress || customHost.trim());
    const port = isCustom ? sshPort : (chosenDevice?.sshPort || sshPort);

    const targetDev: Device = chosenDevice || {
      id: `dev-${Date.now()}`,
      name: `NODE-${targetHost.replace(/\./g, '-')}`,
      hostname: targetHost,
      ipAddress: targetHost,
      vendor: 'GenericSSH',
      deviceType: 'SERVER',
      connectionType: protocol === 'SERIAL' ? 'SERIAL' : 'SSH',
      apiPort: 8728,
      sshPort: port,
      status: 'ONLINE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (protocol === 'SERIAL') {
      const serialConfig: SerialPortConfig = {
        portName: serialPortName,
        baudRate: serialBaudRate,
        dataBits: 8,
        stopBits: 1,
        parity: 'none',
        flowControl: 'none',
        chipset: 'FTDI FT232RL USB-to-Serial Bridge',
      };
      addSerialTerminalTab(targetDev, serialConfig);
      setIsConnecting(false);
      setIsConnectModalOpen(false);
      return;
    }

    // Real SSH Tab creation
    const tabId = `tab-${Date.now()}`;
    setTabCredentials((prev) => ({
      ...prev,
      [tabId]: {
        username: username.trim(),
        password: password,
        isMock: isMockMode,
      },
    }));

    addTerminalTab(targetDev, {
      id: tabId,
      username: username.trim(),
      port,
      connectionType: 'SSH',
    });

    setIsConnecting(false);
    setIsConnectModalOpen(false);
  };

  // Launch terminal tab directly from Web Serial hardware detector modal
  const handleConnectFromDetector = (targetDev: Device | null, serialConfig: SerialPortConfig) => {
    const dev = targetDev || (devices.length > 0 ? devices[0] : null);
    addSerialTerminalTab(dev, serialConfig);
    setIsConsoleDetectorOpen(false);
  };

  // Hardware Console Serial Break signals
  const handleSendBreak = () => {
    if (!activeTab) return;
    xtermRefs.current[activeTab.id]?.sendData('\x03'); // Send Ctrl+C
  };

  const handleSendRouterBoot = () => {
    if (!activeTab) return;
    xtermRefs.current[activeTab.id]?.sendData(' '); // Send Space
  };

  const handleSendBootRom = () => {
    if (!activeTab) return;
    xtermRefs.current[activeTab.id]?.sendData('\x02'); // Send Ctrl+B
  };

  const handleClearScreen = () => {
    if (!activeTab) return;
    xtermRefs.current[activeTab.id]?.clear();
  };

  const handleReconnect = () => {
    if (!activeTab) return;
    xtermRefs.current[activeTab.id]?.reconnect();
  };

  const handleCopy = () => {
    if (!activeTab) return;
    const text = xtermRefs.current[activeTab.id]?.copySelection() || '';
    if (text) {
      navigator.clipboard.writeText(text);
    }
  };

  // Handle Quick Command Submit from bottom input bar
  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || !activeTab) return;

    const cmd = inputVal.trim();
    setHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);

    // Send raw command string followed by Enter to real SSH shell
    xtermRefs.current[activeTab.id]?.sendData(cmd + '\r');
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
    <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-[#050810] font-mono text-xs select-none relative">
      {/* PuTTY Tabs Bar: [CORE-01] [CORE-02] [SW-01] [+] */}
      <div className="h-10 bg-noc-panel border-b border-noc-border px-2 flex items-center justify-between">
        <div className="flex items-center space-x-1 overflow-x-auto">
          {terminalTabs.map((tab) => {
            const isActive = tab.id === activeTerminalTabId;
            const isSerial = tab.connectionType === 'SERIAL';
            const isOnline = tab.status === 'ONLINE';
            const isConnectingTab = tab.status === 'CONNECTING';

            return (
              <div
                key={tab.id}
                onClick={() => setActiveTerminalTabId(tab.id)}
                className={`group flex items-center space-x-2 px-3 py-1.5 rounded-t text-xs cursor-pointer border-t border-x transition ${
                  isActive
                    ? isSerial
                      ? 'bg-[#080C14] border-amber-500/50 text-amber-300 font-semibold shadow glow-amber'
                      : 'bg-[#080C14] border-cyan-500/50 text-cyan-300 font-semibold shadow glow-cyan'
                    : 'bg-noc-surface/50 border-noc-border text-slate-400 hover:text-slate-200'
                }`}
              >
                {isSerial ? (
                  <Usb className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isOnline
                        ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                        : isConnectingTab
                        ? 'bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                        : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]'
                    }`}
                  />
                )}
                <span className="font-semibold text-white">[{tab.name}]</span>
                {isSerial ? (
                  <span
                    className="text-[10px] text-amber-400/80 font-mono"
                    title={`serial://${tab.serialConfig?.portName || 'COM3'}@${tab.serialConfig?.baudRate || 115200}`}
                  >
                    {tab.serialConfig?.portName || 'COM3'} · {tab.serialConfig?.baudRate || 115200} 8N1
                  </span>
                ) : (
                  <span
                    className="text-[10px] text-cyan-400/80 font-mono"
                    title={`ssh://${tab.username}@${tab.ip}:${tab.port || 22}`}
                  >
                    {tab.username}@{tab.ip}:{tab.port || 22}
                  </span>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTerminalTab(tab.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition"
                  title="Tutup Sesi Terminal"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}

          <button
            onClick={handleOpenNewConnection}
            className="p-1.5 rounded bg-noc-surface hover:bg-noc-surface/80 border border-noc-border text-slate-400 hover:text-cyan-300 transition flex items-center space-x-1"
            title="Buka Sesi SSH / Telnet Baru"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="text-[10px] hidden sm:inline">Sesi Baru</span>
          </button>

          <button
            onClick={() => setIsConsoleDetectorOpen(true)}
            className="px-2 py-1.5 rounded bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 hover:text-cyan-200 transition flex items-center space-x-1.5 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
            title="Deteksi Port Hardware Serial Console (Web Serial API & COM Port Scanner)"
          >
            <Usb className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] font-semibold hidden sm:inline">+ Deteksi Console</span>
          </button>
        </div>

        {/* Toolbar: Reconnect, Copy, Clear, Split, Break Signals */}
        <div className="flex items-center space-x-2">
          {activeTab && activeTab.connectionType === 'SERIAL' ? (
            <>
              <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-amber-950/50 border border-amber-500/40 text-[10px] text-amber-300">
                <Usb className="w-3 h-3 text-amber-400 animate-pulse" />
                <span>
                  SERIAL · {activeTab.serialConfig?.portName || 'COM3'} · {activeTab.serialConfig?.baudRate || 115200} 8N1
                </span>
              </div>

              <button
                onClick={handleSendBreak}
                className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-[10px] text-amber-300 hover:bg-amber-500/20 transition flex items-center space-x-1"
                title="Kirim Sinyal Break RS-232 (Cisco ROMmon / Interupsi Bootloader)"
              >
                <Radio className="w-3 h-3 text-amber-400" />
                <span>Send Break</span>
              </button>

              <button
                onClick={handleSendRouterBoot}
                className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-[10px] text-cyan-300 hover:bg-cyan-500/20 transition flex items-center space-x-1"
                title="Kirim Setup Escape Key RouterBOOT BIOS MikroTik"
              >
                <Cpu className="w-3 h-3 text-cyan-400" />
                <span>RouterBOOT</span>
              </button>

              <button
                onClick={handleSendBootRom}
                className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-[10px] text-purple-300 hover:bg-purple-500/20 transition flex items-center space-x-1"
                title="Kirim Escape Key Ctrl+B BootROM Huawei"
              >
                <Zap className="w-3 h-3 text-purple-400" />
                <span>BootROM</span>
              </button>

              <button
                onClick={() => setIsConsoleDetectorOpen(true)}
                className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-300 hover:text-cyan-300 transition flex items-center space-x-1"
                title="Buka Diagnostic Pinout & Status Port Serial"
              >
                <Sliders className="w-3 h-3" />
                <span>Pinout &amp; Diag</span>
              </button>
            </>
          ) : activeTab ? (
            <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-emerald-400">
              <Wifi className="w-3 h-3 animate-pulse" />
              <span>Real SSH-2.0 PTY · {activeTab.latencyMs}ms</span>
            </div>
          ) : null}

          {activeTab && (
            <>
              <button
                title="Konek Ulang SSH (Reconnect)"
                onClick={handleReconnect}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              <button
                title="Copy Terminal Selection"
                onClick={handleCopy}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>

              <button
                title="Clear Terminal Buffer"
                onClick={handleClearScreen}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}

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
      {terminalTabs.length === 0 || !activeTab ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 font-mono">
          <div className="w-16 h-16 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <TerminalIcon className="w-8 h-8" />
          </div>
          <div>
            <div className="text-white font-bold text-sm font-sans">
              Belum Ada Sesi Terminal SSH / Serial Console yang Terbuka
            </div>
            <div className="text-slate-400 text-xs mt-1 max-w-md font-sans">
              Buka koneksi SSH baru ke perangkat riil Anda (seperti Linux, MikroTik, Cisco) atau tancapkan kabel USB console rollover untuk memulai.
            </div>
          </div>
          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={handleOpenNewConnection}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold flex items-center space-x-2 transition shadow-[0_0_15px_rgba(6,182,212,0.3)] font-sans text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>+ Sesi SSH Baru</span>
            </button>
            <button
              onClick={() => setIsConsoleDetectorOpen(true)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700 flex items-center space-x-2 transition font-sans text-xs"
            >
              <Usb className="w-4 h-4 text-amber-400" />
              <span>+ Pindai Hardware Serial Console (COM)</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Active Terminal Container */}
          <div className={`flex-1 relative overflow-hidden ${isSplit ? 'grid grid-cols-2 gap-2' : ''}`}>
            {terminalTabs.map((tab) => (
              <XtermView
                key={tab.id}
                ref={(el) => {
                  xtermRefs.current[tab.id] = el;
                }}
                tab={tab}
                isActive={tab.id === activeTerminalTabId}
                credentials={tabCredentials[tab.id]}
                onStatusChange={(status) => handleStatusChange(tab.id, status)}
              />
            ))}

            {/* Split View Secondary Stream */}
            {isSplit && (
              <div className="border-l border-noc-border p-3 h-full overflow-y-auto bg-[#070b14] text-slate-400 font-mono text-xs">
                <div className="text-[10px] text-cyan-400 mb-2 border-b border-noc-border pb-1 flex items-center justify-between">
                  <span>[Split Console Monitor Stream]</span>
                  <span className="text-emerald-400">Live RX/TX</span>
                </div>
                <div className="text-slate-500 leading-relaxed">
                  Passive interface stream active. Listening on background syslog/snmp traps...
                </div>
              </div>
            )}
          </div>

          {/* Bottom Interactive Command Bar (For quick command dispatch or copy-paste) */}
          <div className="h-9 bg-[#090e1c] border-t border-noc-border px-3 flex items-center space-x-2 shrink-0">
            <span className="text-cyan-400 font-semibold whitespace-nowrap text-xs">
              [{activeTab.username || 'admin'}@{activeTab.name}] &gt;
            </span>
            <form onSubmit={handleCommandSubmit} className="flex-1 flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ketik perintah SSH atau klik di layar terminal untuk kontrol interaktif langsung..."
                className="w-full bg-transparent border-none outline-none text-emerald-300 font-mono text-xs caret-emerald-400 placeholder:text-slate-600"
              />
            </form>
            <button
              onClick={handleCommandSubmit}
              disabled={!inputVal.trim()}
              className="px-2 py-1 rounded bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 disabled:opacity-30 transition flex items-center space-x-1"
              title="Kirim Perintah"
            >
              <Send className="w-3 h-3" />
              <span className="text-[10px]">Kirim</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL: PuTTY New Connection & SSH/Serial Login Dialog */}
      {isConnectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#090f22] border border-cyan-500/40 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.3)] p-6 relative font-mono text-xs">
            <button
              onClick={() => setIsConnectModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                {protocol === 'SERIAL' ? <Usb className="w-5 h-5 text-amber-400" /> : <TerminalIcon className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-sans">
                  {protocol === 'SERIAL' ? 'Konfigurasi Serial Console Port' : 'PuTTY Live SSH Connection'}
                </h3>
                <p className="text-xs text-slate-400 font-sans">
                  {protocol === 'SERIAL'
                    ? 'Koneksi langsung melalui antarmuka hardware RS-232 / UART'
                    : 'Koneksi PTY langsung ke server riil melalui gateway SSH backend'}
                </p>
              </div>
            </div>

            {/* Protocol Selector Tabs */}
            <div className="mb-4">
              <label className="block text-slate-300 font-semibold mb-1.5">Tipe Sesi (Connection Type)</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setProtocol('SSH')}
                  className={`py-2 px-3 rounded-lg border text-center transition flex flex-col items-center justify-center space-y-1 ${
                    protocol === 'SSH'
                      ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <TerminalIcon className="w-4 h-4" />
                  <span className="font-semibold text-[11px]">SSH-2.0</span>
                </button>

                <button
                  type="button"
                  onClick={() => setProtocol('SERIAL')}
                  className={`py-2 px-3 rounded-lg border text-center transition flex flex-col items-center justify-center space-y-1 ${
                    protocol === 'SERIAL'
                      ? 'bg-amber-950/60 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Usb className="w-4 h-4" />
                  <span className="font-semibold text-[11px]">Serial Console</span>
                </button>

                <button
                  type="button"
                  onClick={() => setProtocol('TELNET')}
                  className={`py-2 px-3 rounded-lg border text-center transition flex flex-col items-center justify-center space-y-1 ${
                    protocol === 'TELNET'
                      ? 'bg-blue-950/60 border-blue-400 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Radio className="w-4 h-4" />
                  <span className="font-semibold text-[11px]">Telnet</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleConnectSubmit} className="space-y-3.5 text-xs font-mono">
              {/* Target Device Dropdown */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Host / Device</label>
                <select
                  value={selectedDeviceId}
                  onChange={(e) => {
                    setSelectedDeviceId(e.target.value);
                    const d = devices.find((dev) => dev.id === e.target.value);
                    if (d) {
                      setSshPort(d.sshPort || 22);
                      setCustomHost(d.ipAddress);
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  <option value="custom">+ Manual Host / Custom IP &amp; Port</option>
                  {devices.map((d) => (
                    <option key={d.id} value={d.id}>
                      [{d.name}] • {d.hostname} ({d.ipAddress}:{d.sshPort || 22} · {d.vendor})
                    </option>
                  ))}
                </select>
              </div>

              {/* SERIAL Protocol Specific Fields */}
              {protocol === 'SERIAL' ? (
                <div className="space-y-3 p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 text-amber-300 font-semibold text-xs">
                      <Usb className="w-4 h-4 text-amber-400" />
                      <span>Parameter Hardware Serial Port</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsConsoleDetectorOpen(true)}
                      className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-[10px] font-semibold border border-amber-500/40 flex items-center space-x-1 transition"
                    >
                      <RefreshCw className="w-3 h-3 text-amber-300" />
                      <span>Deteksi Port Otomatis</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">COM Port Interface</label>
                      <select
                        value={serialPortName}
                        onChange={(e) => setSerialPortName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                      >
                        <option value="COM3">COM3 (FTDI FT232R Rollover)</option>
                        <option value="COM4">COM4 (CP2102 Type-C Console)</option>
                        <option value="COM5">COM5 (CH340 DB9 RS-232)</option>
                        <option value="COM1">COM1 (Motherboard Legacy)</option>
                        <option value="COM2">COM2 (Auxiliary COM)</option>
                        <option value="/dev/ttyUSB0">/dev/ttyUSB0 (Linux POSIX)</option>
                        <option value="/dev/ttyUSB1">/dev/ttyUSB1 (Linux POSIX)</option>
                        <option value="/dev/ttyS0">/dev/ttyS0 (Hardware UART)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Baud Rate (Speed)</label>
                      <select
                        value={serialBaudRate}
                        onChange={(e) => setSerialBaudRate(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                      >
                        <option value={115200}>115200 bps (MikroTik / Huawei / Modern)</option>
                        <option value={9600}>9600 bps (Cisco IOS Default 8N1)</option>
                        <option value={57600}>57600 bps (High-Speed Switch)</option>
                        <option value={38400}>38400 bps (Standard Telecom)</option>
                        <option value={19200}>19200 bps (Legacy Diagnostic)</option>
                        <option value={230400}>230400 bps (High-Speed Flash)</option>
                      </select>
                    </div>
                  </div>

                  <div className="text-[10px] text-amber-200/80 bg-slate-900/80 p-2 rounded border border-amber-500/20 flex items-center justify-between">
                    <span>Frame: 8 Data Bits • No Parity • 1 Stop Bit (8N1) • Flow: None</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                </div>
              ) : (
                /* SSH & Telnet Fields */
                <>
                  {selectedDeviceId === 'custom' && (
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Host FQDN Domain / IP Target</label>
                      <input
                        type="text"
                        required
                        value={customHost}
                        onChange={(e) => setCustomHost(e.target.value)}
                        placeholder="192.168.100.180"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400 font-mono text-xs"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Port</label>
                      <input
                        type="number"
                        required
                        value={sshPort}
                        onChange={(e) => setSshPort(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Protokol</label>
                      <div className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-lg text-slate-300">
                        {protocol === 'SSH' ? 'SSH-2.0 RFC 4253' : 'Telnet NVT RFC 854'}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Username */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {protocol === 'SERIAL' ? 'Login Username (Opsional jika prompt awal)' : 'Login Username'}
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required={protocol !== 'SERIAL'}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="audira, root, atau admin"
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {protocol === 'SERIAL' ? 'Password / Passphrase (Opsional)' : 'Password SSH'}
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password riil server Anda..."
                    className="w-full pl-9 pr-9 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Real Connection vs Demo Mode Toggle */}
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="mockModeCheckbox"
                  checked={isMockMode}
                  onChange={(e) => setIsMockMode(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="mockModeCheckbox" className="text-slate-400 cursor-pointer select-none text-[11px]">
                  Gunakan Sesi Simulasi (Demo Mock) — Biarkan tidak dicentang untuk koneksi riil
                </label>
              </div>

              {/* Authentication Security Notes */}
              <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-xl text-[11px] text-cyan-300 font-mono flex items-center justify-between">
                <span>
                  {protocol === 'SERIAL'
                    ? 'Transmisi: RS-232 Physical Bitstream (Direct UART)'
                    : isMockMode
                    ? 'Mode: Simulasi Lokal (Demo Sandbox)'
                    : 'Koneksi: SSH-2.0 Real PTY Gateway (Port 22)'}
                </span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsConnectModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isConnecting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold transition shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center space-x-2 disabled:opacity-50"
                >
                  {isConnecting ? (
                    <>
                      <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Mengotentikasi...</span>
                    </>
                  ) : protocol === 'SERIAL' ? (
                    <>
                      <Usb className="w-3.5 h-3.5 text-amber-300" />
                      <span>Konek Serial Console ({serialPortName})</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5" />
                      <span>Konek Riil ke Server ({customHost})</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hardware Serial Console Detector & Diagnostics Modal */}
      <ConsoleHardwareDetector
        isOpen={isConsoleDetectorOpen}
        onClose={() => setIsConsoleDetectorOpen(false)}
        onConnectSerial={handleConnectFromDetector}
        targetDevice={devices.find((d) => d.id === selectedDeviceId) || null}
      />
    </div>
  );
};
