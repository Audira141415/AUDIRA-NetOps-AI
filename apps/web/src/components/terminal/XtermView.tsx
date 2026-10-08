// Interactive PuTTY Terminal View using Xterm.js
// Bidirectional real-time streaming to backend SSH Gateway via WebSocket

import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { TerminalTabItem } from '../../store/useNetOpsStore';
import { RefreshCw, AlertTriangle } from 'lucide-react';

export interface XtermViewRef {
  sendData: (data: string) => void;
  clear: () => void;
  reconnect: () => void;
  focus: () => void;
  copySelection: () => string;
}

export interface SessionCredentials {
  username?: string;
  password?: string;
  privateKey?: string;
  passphrase?: string;
  isMock?: boolean;
}

interface XtermViewProps {
  tab: TerminalTabItem;
  isActive: boolean;
  credentials?: SessionCredentials;
  onStatusChange?: (status: 'ONLINE' | 'CONNECTING' | 'OFFLINE') => void;
}

function getWebSocketUrl(): string {
  const isHttps = window.location.protocol === 'https:';
  const wsProto = isHttps ? 'wss:' : 'ws:';

  // In local Vite dev mode on port 5180, connect directly to port 3000 to avoid any dev proxy delays
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    if (window.location.port === '5180') {
      return `ws://${window.location.hostname}:3000/ws`;
    }
  }
  return `${wsProto}//${window.location.host}/ws`;
}

export const XtermView = forwardRef<XtermViewRef, XtermViewProps>(({
  tab,
  isActive,
  credentials,
  onStatusChange,
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Keep latest props in refs to avoid re-triggering effects and render loops
  const tabRef = useRef(tab);
  tabRef.current = tab;
  const credentialsRef = useRef(credentials);
  credentialsRef.current = credentials;
  const onStatusChangeRef = useRef(onStatusChange);
  onStatusChangeRef.current = onStatusChange;

  const [connectionState, setConnectionState] = useState<'CONNECTING' | 'ONLINE' | 'OFFLINE'>('CONNECTING');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Safe Fit utility
  const safeFit = () => {
    if (!containerRef.current || !fitAddonRef.current || !termRef.current) return;
    if (containerRef.current.clientWidth === 0 || containerRef.current.clientHeight === 0) return;
    try {
      fitAddonRef.current.fit();
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: 'resize',
            cols: termRef.current.cols,
            rows: termRef.current.rows,
          })
        );
      }
    } catch {
      // Ignore fit errors if element temporarily unmeasured
    }
  };

  const connectWebSocket = () => {
    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch {
        // Ignore
      }
      wsRef.current = null;
    }

    setConnectionState('CONNECTING');
    setErrorMessage(null);
    onStatusChangeRef.current?.('CONNECTING');

    const currentTab = tabRef.current;
    const currentCreds = credentialsRef.current;
    const term = termRef.current;

    if (term) {
      term.writeln(`\r\n\x1b[36m[AUDIRA NOC] Membuka sesi SSH ke ${currentCreds?.username || currentTab.username || 'admin'}@${currentTab.ip}:${currentTab.port || 22}...\x1b[0m`);
    }

    const wsUrl = getWebSocketUrl();
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      const connectPayload = {
        type: 'connect',
        host: currentTab.ip,
        port: currentTab.port || 22,
        username: currentCreds?.username || currentTab.username || 'admin',
        password: currentCreds?.password || '',
        privateKey: currentCreds?.privateKey,
        isMock: currentCreds?.isMock || false,
        cols: termRef.current?.cols || 100,
        rows: termRef.current?.rows || 30,
      };

      ws.send(JSON.stringify(connectPayload));
    };

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'data' && payload.data !== undefined) {
          termRef.current?.write(payload.data);
        } else if (payload.type === 'status') {
          if (payload.status === 'connected') {
            setConnectionState('ONLINE');
            onStatusChangeRef.current?.('ONLINE');
          } else if (payload.status === 'error') {
            setConnectionState('OFFLINE');
            setErrorMessage(payload.message || 'Koneksi SSH gagal');
            onStatusChangeRef.current?.('OFFLINE');
          } else if (payload.status === 'disconnected') {
            setConnectionState('OFFLINE');
            onStatusChangeRef.current?.('OFFLINE');
          }
        }
      } catch {
        termRef.current?.write(event.data);
      }
    };

    ws.onerror = () => {
      setConnectionState('OFFLINE');
      setErrorMessage('Gagal terhubung ke WebSocket Gateway (Port 3000)');
      onStatusChangeRef.current?.('OFFLINE');
      termRef.current?.writeln('\r\n\x1b[31;1m[WebSocket Error]\x1b[0m Tidak dapat menjangkau backend terminal gateway.\r\n');
    };

    ws.onclose = () => {
      setConnectionState('OFFLINE');
      onStatusChangeRef.current?.('OFFLINE');
    };
  };

  // Expose control methods via ref
  useImperativeHandle(ref, () => ({
    sendData: (data: string) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'data', data }));
      }
    },
    clear: () => {
      termRef.current?.clear();
    },
    reconnect: () => {
      connectWebSocket();
    },
    focus: () => {
      termRef.current?.focus();
    },
    copySelection: () => {
      return termRef.current?.getSelection() || '';
    },
  }));

  // Initialize Terminal instance ONCE on mount
  useEffect(() => {
    if (!containerRef.current) return;

    const term = new Terminal({
      cursorBlink: true,
      cursorStyle: 'block',
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Menlo, Monaco, Consolas, monospace",
      fontSize: 13,
      lineHeight: 1.25,
      scrollback: 5000,
      theme: {
        background: '#050810',
        foreground: '#e2e8f0',
        cursor: '#22d3ee',
        cursorAccent: '#050810',
        selectionBackground: 'rgba(6, 182, 212, 0.35)',
        black: '#090d16',
        red: '#f43f5e',
        green: '#10b981',
        yellow: '#f59e0b',
        blue: '#3b82f6',
        magenta: '#d946ef',
        cyan: '#06b6d4',
        white: '#e2e8f0',
        brightBlack: '#64748b',
        brightRed: '#fb7185',
        brightGreen: '#34d399',
        brightYellow: '#fbbf24',
        brightBlue: '#60a5fa',
        brightMagenta: '#e879f9',
        brightCyan: '#38bdf8',
        brightWhite: '#ffffff',
      },
      convertEol: true,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    term.open(containerRef.current);
    termRef.current = term;
    fitAddonRef.current = fitAddon;

    // Handle user keyboard inputs
    term.onData((data) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'data', data }));
      }
    });

    // ResizeObserver
    const ro = new ResizeObserver(() => {
      safeFit();
    });
    ro.observe(containerRef.current);

    // Initial safe fit
    const timer = setTimeout(() => {
      safeFit();
      term.focus();
    }, 60);

    // Connect WebSocket
    connectWebSocket();

    return () => {
      clearTimeout(timer);
      ro.disconnect();
      if (wsRef.current) {
        try {
          wsRef.current.close();
        } catch {}
        wsRef.current = null;
      }
      term.dispose();
      termRef.current = null;
      fitAddonRef.current = null;
    };
  }, []); // Run ONCE on mount

  // Safe-fit and focus when tab becomes active
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        safeFit();
        termRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  return (
    <div
      className={`relative w-full h-full flex flex-col bg-[#050810] ${
        isActive ? 'flex' : 'hidden'
      }`}
    >
      {/* Session status banner if disconnected */}
      {connectionState === 'OFFLINE' && (
        <div className="bg-rose-950/80 border-b border-rose-500/40 px-3 py-1.5 flex items-center justify-between text-rose-200 text-xs shrink-0">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>{errorMessage || 'Sesi SSH terputus dari target host.'}</span>
          </div>
          <button
            onClick={connectWebSocket}
            className="px-2 py-0.5 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-semibold border border-rose-500/30 flex items-center space-x-1 transition text-[11px]"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Konek Ulang</span>
          </button>
        </div>
      )}

      {/* Terminal View Container */}
      <div
        ref={containerRef}
        className="flex-1 w-full h-full p-2 overflow-hidden cursor-text"
        onClick={() => termRef.current?.focus()}
      />
    </div>
  );
});

XtermView.displayName = 'XtermView';
