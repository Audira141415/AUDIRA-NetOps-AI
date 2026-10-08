// Golden Configuration Drift & Shadow Change Detection Component
// Audits running device configurations against declared GitOps/IaC baselines with 1-click reconciliation

import React, { useState } from 'react';
import {
  Shield,
  FileCode2,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Server,
  Zap,
  RefreshCw,
  GitBranch,
  ArrowRight,
  Eye,
  Check,
  X,
  Lock,
} from 'lucide-react';
import { GoldenConfigDriftEngine, ConfigDriftResult } from '@audira/security';
import { useNetOpsStore } from '../../store/useNetOpsStore';

const SAMPLE_GOLDEN_CONFIG = `# AUDIRA Golden IaC Baseline v2.4 (CCR2004)
/system/identity/set name="CORE-JOGJA-01"
/ip/service/set [find name=telnet] disabled=yes
/ip/service/set [find name=ftp] disabled=yes
/ip/service/set [find name=http] disabled=yes
/ip/service/set [find name=api] disabled=yes
/ip/service/set [find name=api-ssl] disabled=no port=8729
/ip/ssh/set strong-crypto=yes forwarding-enabled=no
/ip/firewall/filter/add chain=input in-interface-list=WAN protocol=udp dst-port=53 action=drop comment="CIS-01: Block WAN DNS"
/ip/firewall/filter/add chain=input protocol=tcp dst-port=22 src-address-list=!ADMIN_WHITELIST action=drop comment="CIS-02: Drop Untrusted SSH"
/snmp/set enabled=yes trap-version=3
/routing/bgp/connection/add name="UPSTREAM-TRANSIT" remote.address=10.100.1.1 as=65001`;

const SAMPLE_RUNNING_CONFIG_DRIFTED = `# Running Configuration exported from CORE-JOGJA-01
/system/identity/set name="CORE-JOGJA-01"
/ip/service/set [find name=telnet] disabled=yes
/ip/service/set [find name=ftp] disabled=yes
/ip/service/set [find name=http] disabled=yes
/ip/service/set [find name=api] disabled=yes
/ip/service/set [find name=api-ssl] disabled=no port=8729
# SHADOW CHANGE: Someone disabled strong-crypto at 3:14 AM
/ip/ssh/set strong-crypto=no forwarding-enabled=yes
# SHADOW CHANGE: Rogue user added directly via serial console
/user/add name="temp-vendor" group=full password="Password123"
# Missing: CIS-01 Block WAN DNS Recursion was deleted!
/ip/firewall/filter/add chain=input protocol=tcp dst-port=22 src-address-list=!ADMIN_WHITELIST action=drop comment="CIS-02: Drop Untrusted SSH"
/snmp/set enabled=yes trap-version=3
/routing/bgp/connection/add name="UPSTREAM-TRANSIT" remote.address=10.100.1.1 as=65001`;

export const ConfigDriftView: React.FC = () => {
  const { devices, showToast } = useNetOpsStore();
  const [selectedDeviceName, setSelectedDeviceName] = useState<string>(
    devices[0]?.name || 'CORE-JOGJA-01'
  );
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [isReconciling, setIsReconciling] = useState<boolean>(false);
  const [isDiffModalOpen, setIsDiffModalOpen] = useState<boolean>(false);

  // Compute live drift analysis
  const [driftResult, setDriftResult] = useState<ConfigDriftResult>(() =>
    GoldenConfigDriftEngine.detectDrift(SAMPLE_RUNNING_CONFIG_DRIFTED, SAMPLE_GOLDEN_CONFIG)
  );

  const handleAuditDrift = async () => {
    setIsAuditing(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    const result = GoldenConfigDriftEngine.detectDrift(
      SAMPLE_RUNNING_CONFIG_DRIFTED,
      SAMPLE_GOLDEN_CONFIG
    );
    setDriftResult(result);
    setIsAuditing(false);
    showToast('Audit Golden Configuration Drift selesai diproses!', 'info');
  };

  const handleReconcileToGolden = async () => {
    setIsReconciling(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    // Simulate successful reconciliation (100% in sync)
    const reconciled = GoldenConfigDriftEngine.detectDrift(
      SAMPLE_GOLDEN_CONFIG,
      SAMPLE_GOLDEN_CONFIG
    );
    setDriftResult(reconciled);
    setIsReconciling(false);
    showToast(
      'Snapshot pre-flight dibuat! Konfigurasi live berhasil direkonsiliasi 100% ke Golden Baseline.',
      'success'
    );
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#0e162e] via-[#101b3b] to-[#0d142b] p-6 rounded-2xl border border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.15)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-wide flex items-center gap-2">
                Golden Configuration Drift &amp; GitOps Auditor
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300">
                  Zero Shadow Changes
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Pendeteksi perubahan liar di luar kontrol platform (Shadow Changes via console lokal), verifikasi kepatuhan GitOps, dan rekonsiliasi 1-klik.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 relative z-10">
          <button
            onClick={handleAuditDrift}
            disabled={isAuditing}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
            <span>Pindai Ulang</span>
          </button>
          <button
            onClick={handleReconcileToGolden}
            disabled={isReconciling || !driftResult.isDrifted}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(245,158,11,0.4)] transition disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isReconciling ? 'animate-spin' : ''}`} />
            <span>{isReconciling ? 'Merekonsiliasi...' : 'Rekonsiliasi ke Golden Template'}</span>
          </button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Drift Score Card */}
        <div className="bg-[#0b1329]/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-5 shadow-[0_0_25px_rgba(6,182,212,0.1)]">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>COMPLIANCE DRIFT SCORE</span>
            <Shield className="w-4 h-4 text-cyan-400" />
          </div>
          <div
            className={`text-3xl font-extrabold font-mono drop-shadow-md ${
              driftResult.driftScore >= 90
                ? 'text-emerald-400'
                : driftResult.driftScore >= 70
                ? 'text-amber-400'
                : 'text-rose-400'
            }`}
          >
            {driftResult.driftScore}%
          </div>
          <div className="mt-2 text-xs font-semibold text-slate-300">
            {driftResult.isDrifted
              ? `Status: ${driftResult.severity} DRIFT DETECTED`
              : 'Status: 100% IN-SYNC DENGAN GITOPS'}
          </div>
        </div>

        {/* Critical Violations */}
        <div className="bg-[#0b1329]/80 backdrop-blur-xl border border-rose-500/30 rounded-2xl p-5 shadow-[0_0_25px_rgba(244,63,94,0.1)]">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>CRITICAL SECURITY VIOLATIONS</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-rose-400">
            {driftResult.criticalViolationsCount}
          </div>
          <div className="mt-2 text-xs font-semibold text-rose-300">
            Perubahan akun admin / cipher lemah
          </div>
        </div>

        {/* Shadow Additions */}
        <div className="bg-[#0b1329]/80 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-5 shadow-[0_0_25px_rgba(245,158,11,0.1)]">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>UNAUTHORIZED SHADOW ADDITIONS</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-amber-400">
            +{driftResult.addedLinesCount} Baris
          </div>
          <div className="mt-2 text-xs font-semibold text-amber-300">
            Ditambahkan langsung via konsol lokal
          </div>
        </div>

        {/* Missing Baseline Standards */}
        <div className="bg-[#0b1329]/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-5 shadow-[0_0_25px_rgba(168,85,247,0.1)]">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>MISSING BASELINE STANDARDS</span>
            <FileCode2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-purple-400">
            -{driftResult.removedLinesCount} Baris
          </div>
          <div className="mt-2 text-xs font-semibold text-purple-300">
            Aturan firewall wajib terhapus
          </div>
        </div>
      </div>

      {/* Discrepancies Table */}
      <div className="bg-[#0c1427]/90 border border-slate-800 rounded-2xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.5)] space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-cyan-400" />
              Daftar Anomali Konfigurasi ({driftResult.discrepancies.length} Item)
            </h2>
            <p className="text-xs text-slate-400">
              Perbedaan baris perintah antara live running configuration dan Golden Template repositori GitOps.
            </p>
          </div>
          <button
            onClick={() => setIsDiffModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono hover:bg-cyan-900/60 transition flex items-center space-x-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Lihat Visual Diff Monaco</span>
          </button>
        </div>

        {driftResult.discrepancies.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Konfigurasi 100% Selaras!</h3>
            <p className="text-xs text-slate-400">
              Tidak ada shadow changes atau penyimpangan aturan yang terdeteksi pada {selectedDeviceName}.
            </p>
          </div>
        ) : (
          <div className="space-y-3 font-mono text-xs">
            {driftResult.discrepancies.map((d, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border flex items-start justify-between gap-4 ${
                  d.severity === 'CRITICAL'
                    ? 'bg-rose-950/20 border-rose-500/40 text-rose-200'
                    : d.severity === 'HIGH'
                    ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                    : 'bg-slate-900/40 border-slate-800 text-slate-300'
                }`}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        d.type === 'UNAUTHORIZED_ADDITION'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      }`}
                    >
                      {d.type === 'UNAUTHORIZED_ADDITION' ? '+ SHADOW TAMBAHAN' : '- BASELINE HILANG'}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      Tingkat: {d.severity}
                    </span>
                  </div>
                  <div className="bg-[#090d1a] p-2.5 rounded-lg border border-slate-800 text-slate-100 font-mono text-xs overflow-x-auto">
                    {d.lineContent}
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans">{d.reason}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Visual Diff Modal */}
      {isDiffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-4xl bg-[#0c1427] border border-cyan-500/40 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.3)] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <div className="flex items-center space-x-2">
                <FileCode2 className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Visual Diff: Golden vs. Live Running</h3>
              </div>
              <button
                onClick={() => setIsDiffModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-2">
                <div className="font-bold text-emerald-400">GOLDEN BASELINE TEMPLATE (IaC)</div>
                <pre className="bg-[#080d1a] p-3 rounded-xl border border-emerald-500/30 text-emerald-300/80 max-h-96 overflow-y-auto">
                  {SAMPLE_GOLDEN_CONFIG}
                </pre>
              </div>
              <div className="space-y-2">
                <div className="font-bold text-rose-400">LIVE RUNNING CONFIGURATION</div>
                <pre className="bg-[#080d1a] p-3 rounded-xl border border-rose-500/30 text-rose-300/80 max-h-96 overflow-y-auto">
                  {SAMPLE_RUNNING_CONFIG_DRIFTED}
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsDiffModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700"
              >
                Tutup Jendela
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
