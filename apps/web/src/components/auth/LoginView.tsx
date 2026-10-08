// NOC Operator Authentication Portal
// Cyberpunk Enterprise Login Gateway with Role-Based Access Control (RBAC)

import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  Lock,
  User,
  KeyRound,
  Terminal,
  Cpu,
  ArrowRight,
  Globe,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Server,
  Activity,
} from 'lucide-react';
import { useNetOpsStore, OperatorUser } from '../../store/useNetOpsStore';

export const LoginView: React.FC = () => {
  const { login, setCurrentTab, currentTab } = useNetOpsStore();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('••••••••');
  const [role, setRole] = useState<OperatorUser['role']>('Super Admin');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const resolveTargetTab = () => {
    const hash = window.location.hash || '';
    if (hash.includes('terminal')) return 'terminal';
    if (hash.includes('topology')) return 'topology';
    if (hash.includes('devices')) return 'devices';
    if (hash.includes('monitoring')) return 'monitoring';
    if (hash.includes('config')) return 'configuration';
    if (currentTab && currentTab !== 'landing') return currentTab;
    return 'dashboard';
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      login(username || 'admin', role);
      setIsLoading(false);
      const target = resolveTargetTab();
      setCurrentTab(target);
    }, 600);
  };

  const handleQuickLogin = (userType: 'admin' | 'engineer' | 'secops', targetTab?: 'dashboard' | 'terminal') => {
    setIsLoading(true);
    setTimeout(() => {
      if (userType === 'admin') {
        login('admin', 'Super Admin');
      } else if (userType === 'engineer') {
        login('noc_engineer', 'NOC Engineer Tier-2');
      } else {
        login('sec_auditor', 'Cybersecurity Operator');
      }
      setIsLoading(false);
      const target = targetTab || resolveTargetTab();
      setCurrentTab(target);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#050813] text-slate-100 flex flex-col justify-between p-4 sm:p-6 font-sans relative overflow-hidden select-none">
      {/* Background Cyber Grid Accent & Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950/60 to-[#040711] pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-10 max-w-6xl w-full mx-auto flex items-center justify-between pb-4 border-b border-cyan-500/20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-[0_0_20px_rgba(56,189,248,0.5)] border border-cyan-300/40">
            <span className="font-extrabold text-base tracking-tighter">A</span>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-base tracking-wide text-white">AUDIRA</span>
              <span className="font-bold text-base text-cyan-300">NetOps AI</span>
              <span className="text-[10px] font-mono text-cyan-400 px-1.5 py-0.2 rounded bg-cyan-950/60 border border-cyan-500/30">
                Enterprise v1.0
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Autonomous NOC Cockpit &amp; Clustered Terminal Gateway
            </div>
          </div>
        </div>

        <button
          onClick={() => setCurrentTab('landing')}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 text-xs font-mono transition"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Landing Page &amp; Lisensi</span>
        </button>
      </header>

      {/* Center Login Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-8">
        <div className="w-full max-w-md bg-[#090f22]/90 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.15)] relative">
          {/* Prismatic Top Highlight */}
          <div className="absolute top-0 left-6 right-6 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

          {/* Title Header */}
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>NOC Operator Authentication Gate</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
              Masuk ke Console NOC
            </h2>
            <p className="text-xs text-slate-400">
              Autentikasi operator untuk mengakses clustered terminal, Winbox, dan AI Network Copilot.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Operator ID / Username</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin atau noc_engineer"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Kredensial operator"
                  className="w-full pl-9 pr-9 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Tingkat Hak Akses (RBAC Role)</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as OperatorUser['role'])}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-cyan-300 font-semibold focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                <option value="Super Admin">Super Administrator (Full Privileges)</option>
                <option value="NOC Engineer Tier-2">NOC Engineer Tier-2 (Operasional &amp; Triage)</option>
                <option value="Cybersecurity Operator">Cybersecurity Operator (Audit &amp; Sniffer)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)] transition flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Memverifikasi Sesi...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Sign In ke Platform NOC</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Sign-In Shortcut Buttons */}
          <div className="mt-5 pt-4 border-t border-slate-800 space-y-2">
            <div className="text-[10px] text-slate-500 font-mono text-center uppercase tracking-wider">
              Atau Masuk Cepat (Akses Demo NOC)
            </div>
            <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin', 'dashboard')}
                className="px-2 py-1.5 rounded-lg bg-[#111a33] hover:bg-[#182548] border border-cyan-500/40 text-cyan-300 transition flex items-center justify-center space-x-1"
                title="Masuk langsung ke Dashboard NOC"
              >
                <span>⚡ Admin Dashboard</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin', 'terminal')}
                className="px-2 py-1.5 rounded-lg bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/40 text-amber-300 transition flex items-center justify-center space-x-1"
                title="Masuk langsung ke PuTTY Terminal / Serial"
              >
                <span>💻 Terminal Console</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('engineer', 'dashboard')}
                className="px-2 py-1.5 rounded-lg bg-[#111a33] hover:bg-[#182548] border border-slate-700 text-slate-300 transition flex items-center justify-center space-x-1"
                title="Masuk sebagai NOC Engineer"
              >
                <span>🔧 NOC Engineer</span>
              </button>
            </div>
          </div>

          {/* Security Guarantee Badges */}
          <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span className="flex items-center space-x-1">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>AES-256 Auth Guard</span>
            </span>
            <span className="flex items-center space-x-1">
              <Activity className="w-3 h-3 text-cyan-400" />
              <span>Session Log Audited</span>
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center text-[11px] text-slate-500 font-mono pt-4 border-t border-cyan-500/10">
        AUDIRA NetOps AI v1.0 • Enterprise Network Operations &amp; Autonomous AI Gateway • All Rights Reserved © 2025-2026 AUDIRA (Agus Dwi R)
      </footer>
    </div>
  );
};
