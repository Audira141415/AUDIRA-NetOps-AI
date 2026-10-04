// Command Palette Component (Ctrl+Shift+P)

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Terminal,
  Activity,
  Network,
  HardDriveDownload,
  FileCode2,
  Bot,
  Settings as SettingsIcon,
  Compass,
  ArrowRight,
  Server,
  Zap,
} from 'lucide-react';
import { useNetOpsStore } from '../../store/useNetOpsStore';

interface CommandItem {
  id: string;
  title: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
}

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    setCurrentTab,
    setAiDrawerOpen,
  } = useNetOpsStore();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const COMMANDS: CommandItem[] = [
    {
      id: 'open-terminal',
      title: 'Open Terminal',
      category: 'Terminal',
      icon: Terminal,
      action: () => setCurrentTab('terminal'),
    },
    {
      id: 'ai-diagnose',
      title: 'AI Diagnose',
      category: 'AI Copilot',
      icon: Bot,
      action: () => {
        setAiDrawerOpen(true);
        setCurrentTab('ai-copilot');
      },
    },
    {
      id: 'ai-generate-config',
      title: 'AI Generate Config',
      category: 'AI Copilot',
      icon: Zap,
      action: () => {
        setAiDrawerOpen(true);
        setCurrentTab('configuration');
      },
    },
    {
      id: 'open-topology',
      title: 'Open Topology',
      category: 'Network',
      icon: Network,
      action: () => setCurrentTab('topology'),
    },
    {
      id: 'connect-device',
      title: 'Connect Device',
      category: 'Devices',
      icon: Server,
      action: () => setCurrentTab('devices'),
    },
    {
      id: 'monitor-interface',
      title: 'Monitor Interface',
      category: 'Monitoring',
      icon: Activity,
      action: () => setCurrentTab('monitoring'),
    },
    {
      id: 'backup-device',
      title: 'Backup Device',
      category: 'Backups',
      icon: HardDriveDownload,
      action: () => setCurrentTab('backups'),
    },
    {
      id: 'compare-config',
      title: 'Compare Config',
      category: 'Configuration',
      icon: FileCode2,
      action: () => setCurrentTab('configuration'),
    },
    {
      id: 'network-discovery',
      title: 'Network Discovery',
      category: 'Discovery',
      icon: Compass,
      action: () => setCurrentTab('devices'),
    },
    {
      id: 'settings',
      title: 'Settings',
      category: 'System',
      icon: SettingsIcon,
      action: () => setCurrentTab('settings'),
    },
  ];

  const filteredCommands = COMMANDS.filter(cmd =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [isCommandPaletteOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setCommandPaletteOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filteredCommands.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = filteredCommands[selectedIndex];
      if (selected) {
        selected.action();
        setCommandPaletteOpen(false);
      }
    }
  };

  if (!isCommandPaletteOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-24"
      onClick={() => setCommandPaletteOpen(false)}
    >
      <div
        className="w-full max-w-xl bg-noc-panel border border-noc-border rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-noc-border bg-noc-surface/50">
          <Search className="w-4 h-4 text-cyan-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search (e.g. Terminal, Ping, Backup, AI)..."
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent border-none outline-none text-sm text-slate-100 placeholder-slate-500 font-mono"
          />
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-noc-bg border border-noc-border text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Command list */}
        <div className="max-h-80 overflow-y-auto py-2 px-1">
          {filteredCommands.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500 font-mono">
              No matching NOC commands found
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    setCommandPaletteOpen(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2 rounded-md text-xs cursor-pointer transition ${
                    isSelected
                      ? 'bg-cyan-500/15 text-cyan-200 border border-cyan-500/30'
                      : 'text-slate-300 hover:bg-noc-surface/80 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span className="font-medium">{cmd.title}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-noc-surface border border-noc-border text-slate-400">
                      {cmd.category}
                    </span>
                    {isSelected && <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
