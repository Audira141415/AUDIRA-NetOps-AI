// Backup Manager Component (Snapshots, Downloads, Retention, Rollbacks)

import React, { useState } from 'react';
import {
  HardDriveDownload,
  Plus,
  Download,
  RotateCcw,
  CheckCircle2,
  FileCheck,
  Search,
  Trash2,
} from 'lucide-react';
import { ConfigurationBackup } from '@audira/types';

const INITIAL_BACKUPS: ConfigurationBackup[] = [
  {
    id: 'bkp-001',
    deviceId: '30000000-0000-0000-0000-000000000001',
    backupType: 'RSC_EXPORT',
    filename: 'CORE-JOGJA-01-20261001-daily.rsc',
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    sizeBytes: 18450,
    createdBy: 'Automated Nightly Backup Job',
    createdAt: '2026-10-01T02:00:00Z',
  },
  {
    id: 'bkp-002',
    deviceId: '30000000-0000-0000-0000-000000000001',
    backupType: 'RSC_EXPORT',
    filename: 'CORE-JOGJA-01-pre-bgp-change.rsc',
    hash: 'b4a8e2c1d3f567890123456789abcdef0123456789abcdef0123456789abcdef',
    sizeBytes: 19200,
    createdBy: 'admin',
    createdAt: '2026-10-04T10:15:00Z',
  },
  {
    id: 'bkp-003',
    deviceId: '30000000-0000-0000-0000-000000000002',
    backupType: 'BINARY_BACKUP',
    filename: 'CORE-JOGJA-02-system.backup',
    hash: 'c1d2e3f4a5b67890123456789abcdef0123456789abcdef0123456789abcdef',
    sizeBytes: 124800,
    createdBy: 'admin',
    createdAt: '2026-10-03T18:30:00Z',
  },
];

export const BackupManager: React.FC = () => {
  const [backups, setBackups] = useState<ConfigurationBackup[]>(INITIAL_BACKUPS);
  const [search, setSearch] = useState('');

  const filtered = backups.filter(b =>
    b.filename.toLowerCase().includes(search.toLowerCase()) ||
    b.createdBy?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-noc-panel border border-noc-border rounded-lg p-3">
        <div className="flex items-center space-x-3">
          <HardDriveDownload className="w-5 h-5 text-cyan-400" />
          <div>
            <h1 className="text-sm font-semibold text-white">Disaster Recovery &amp; Backups</h1>
            <p className="text-xs text-slate-400 font-mono">Automated RSC exports, binary backups, and point-in-time restores</p>
          </div>
        </div>

        <button
          onClick={() => {
            const newBkp: ConfigurationBackup = {
              id: `bkp-${Date.now()}`,
              deviceId: '30000000-0000-0000-0000-000000000001',
              backupType: 'RSC_EXPORT',
              filename: `CORE-JOGJA-01-manual-${Date.now()}.rsc`,
              hash: 'f1e2d3c4b5a67890123456789abcdef0123456789abcdef0123456789abcdef',
              sizeBytes: 19400,
              createdBy: 'admin',
              createdAt: new Date().toISOString(),
            };
            setBackups(prev => [newBkp, ...prev]);
            alert('Instant RSC backup snapshot triggered and saved.');
          }}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-semibold shadow glow-cyan transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Instant Snapshot</span>
        </button>
      </div>

      {/* Backups Table */}
      <div className="bg-noc-panel border border-noc-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-noc-surface text-slate-400 uppercase text-[10px] tracking-wider border-b border-noc-border">
              <tr>
                <th className="px-4 py-3">Filename</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">SHA-256 Hash</th>
                <th className="px-4 py-3">Size</th>
                <th className="px-4 py-3">Author</th>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-noc-border">
              {filtered.map(bkp => (
                <tr key={bkp.id} className="hover:bg-noc-surface/50 transition">
                  <td className="px-4 py-3 font-semibold text-white flex items-center space-x-2">
                    <FileCheck className="w-4 h-4 text-emerald-400" />
                    <span>{bkp.filename}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 border border-slate-700 text-slate-300">
                      {bkp.backupType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 font-mono text-[10px] truncate max-w-[120px]">
                    {bkp.hash}
                  </td>
                  <td className="px-4 py-3 text-slate-300">{(bkp.sizeBytes / 1024).toFixed(1)} KB</td>
                  <td className="px-4 py-3 text-slate-400">{bkp.createdBy}</td>
                  <td className="px-4 py-3 text-slate-400">
                    {new Date(bkp.createdAt).toLocaleDateString()} {new Date(bkp.createdAt).toLocaleTimeString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center space-x-1">
                      <button
                        title="Download Backup File"
                        onClick={() => alert(`Downloading ${bkp.filename}`)}
                        className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        title="Restore Device to this Backup"
                        onClick={() => alert(`Initiating safe rollback to ${bkp.filename}`)}
                        className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
