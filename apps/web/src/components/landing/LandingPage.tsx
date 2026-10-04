// AUDIRA NetOps AI - Public Enterprise Landing Page
// Created by AUDIRA (Agus Dwi R) - Proprietary Commercial Software (Berbayar Penuh)
// All Rights Reserved © 2025-2026 AUDIRA (Agus Dwi R)

import React, { useState } from 'react';
import {
  ShieldCheck,
  Terminal,
  Server,
  Cpu,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Activity,
  Sparkles,
  Layers,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Check,
  X,
  ChevronDown,
  Database,
  RefreshCw,
  Play,
  ShoppingCart,
  PhoneCall,
  Mail,
  Award,
  Network,
  HelpCircle,
  HardDrive,
  Eye,
  Sliders,
  Radio,
  FileText,
  BadgeAlert,
  Menu,
} from 'lucide-react';
import { useNetOpsStore } from '../../store/useNetOpsStore';

export const LandingPage: React.FC = () => {
  const { setCurrentTab } = useNetOpsStore();

  // Interactive State
  const [activePreviewTab, setActivePreviewTab] = useState<
    'winbox' | 'terminal' | 'ai-copilot' | 'safety' | 'topology'
  >('winbox');

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<
    'starter' | 'enterprise' | 'carrier' | 'appliance'
  >('enterprise');

  // Order Form State
  const [formPicName, setFormPicName] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formWhatsApp, setFormWhatsApp] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formNodeCount, setFormNodeCount] = useState('25');
  const [formNotes, setFormNotes] = useState('');
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);

  // FAQ Accordion State
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Mobile Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleOpenOrderModal = (
    tier: 'starter' | 'enterprise' | 'carrier' | 'appliance'
  ) => {
    setSelectedTier(tier);
    setIsOrderModalOpen(true);
    setIsOrderSuccess(false);
  };

  const handleSendWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const tierNames = {
      starter: 'Starter NOC (Rp 4.500.000 / cluster)',
      enterprise: 'Enterprise Pro (Rp 12.800.000 / cluster) [RECOMMENDED]',
      carrier: 'Carrier & ISP Master (Rp 28.500.000 / cluster)',
      appliance: 'Turn-Key 1U Hardware Appliance (Custom Enterprise)',
    };

    const text =
      `*PESANAN LISENSI RESMI AUDIRA NETOPS AI v1.0*\n` +
      `----------------------------------------\n` +
      `Kepada: *AUDIRA (Agus Dwi R)*\n` +
      `Status: Lisensi Komersial / Proprietary (Berbayar)\n\n` +
      `*Detail Pemesan:*\n` +
      `• Nama PIC: ${formPicName || 'N/A'}\n` +
      `• Instansi / Perusahaan: ${formCompany || 'N/A'}\n` +
      `• No. WhatsApp: ${formWhatsApp || 'N/A'}\n` +
      `• Email: ${formEmail || 'N/A'}\n` +
      `• Paket Lisensi: ${tierNames[selectedTier]}\n` +
      `• Estimasi Node / Router: ${formNodeCount} unit\n` +
      `• Catatan Kebutuhan: ${formNotes || '-'}\n\n` +
      `Mohon informasikan invoice resmi, nomor rekening pembayaran, dan prosedur penerbitan Certificate License Key. Terima kasih.`;

    const encoded = encodeURIComponent(text);
    // AUDIRA direct contact
    window.open(`https://wa.me/6281234567890?text=${encoded}`, '_blank');
    setIsOrderSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#060a16] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Banner: Official Notice of Proprietary License */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border-b border-cyan-500/30 px-4 py-2 text-center text-xs text-cyan-200 flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
        <span className="font-bold text-white tracking-wide shrink-0">PENGUMUMAN RESMI:</span>
        <span className="text-slate-300">
          AUDIRA NetOps AI v1.0 adalah software <strong className="text-cyan-300">Lisensi Komersial / Proprietary Berbayar</strong> milik <strong className="text-white">AUDIRA (Agus Dwi R)</strong>. Tidak tersedia versi gratis untuk produksi.
        </span>
        <button
          onClick={() => handleOpenOrderModal('enterprise')}
          className="ml-1 underline text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer shrink-0 whitespace-nowrap"
        >
          Beli Lisensi Resmi &rarr;
        </button>
      </div>

      {/* Public Navbar - Collision-Proof & Responsive */}
      <nav className="sticky top-0 z-50 bg-[#080d1e]/95 backdrop-blur-2xl border-b border-cyan-500/20 px-4 sm:px-6 py-2.5 sm:py-3 shadow-[0_4px_30px_rgba(6,182,212,0.15)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div
            className="flex items-center space-x-3 shrink-0 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-[0_0_20px_rgba(56,189,248,0.6)] border border-cyan-300/40 shrink-0">
              <span className="font-extrabold text-base tracking-tighter">A</span>
            </div>
            <div className="shrink-0">
              <div className="flex items-center space-x-2 whitespace-nowrap">
                <span className="font-black text-lg tracking-wider text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
                  AUDIRA
                </span>
                <span className="font-bold text-lg text-cyan-400">
                  NetOps AI
                </span>
                <span className="text-[10px] font-mono font-bold text-cyan-300 px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 shrink-0 hidden sm:inline-block">
                  PROPRIETARY v1.0
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-sans tracking-tight whitespace-nowrap hidden sm:block">
                By AUDIRA (Agus Dwi R) • Commercial Enterprise Edition
              </div>
            </div>
          </div>

          {/* Desktop Nav Links (Clean, Concise, No Wrapping) */}
          <div className="hidden xl:flex items-center gap-6 text-xs font-semibold text-slate-300 whitespace-nowrap">
            <a href="#fitur" className="hover:text-cyan-300 transition whitespace-nowrap">
              Fitur
            </a>
            <a href="#preview" className="hover:text-cyan-300 transition whitespace-nowrap">
              Live Preview
            </a>
            <a href="#keamanan" className="hover:text-cyan-300 transition whitespace-nowrap">
              AI Safety
            </a>
            <a href="#arsitektur" className="hover:text-cyan-300 transition whitespace-nowrap">
              Arsitektur
            </a>
            <a href="#harga" className="text-cyan-300 font-bold hover:text-cyan-200 transition whitespace-nowrap">
              Harga & Lisensi
            </a>
            <a href="#hak-cipta" className="hover:text-cyan-300 transition whitespace-nowrap">
              Hak Cipta
            </a>
            <a href="#faq" className="hover:text-cyan-300 transition whitespace-nowrap">
              FAQ
            </a>
          </div>

          {/* Header Action Buttons & Mobile Hamburger */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0 whitespace-nowrap">
            <button
              onClick={() => handleOpenOrderModal('enterprise')}
              className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-cyan-300/40 transition-all flex items-center space-x-1.5 whitespace-nowrap shrink-0"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Beli Lisensi</span>
            </button>

            <button
              onClick={() => setCurrentTab('dashboard')}
              className="px-3.5 py-2 rounded-lg bg-[#121c38] hover:bg-[#1a2952] border border-cyan-500/40 text-cyan-300 hover:text-white font-bold text-xs shadow-sm transition-all flex items-center space-x-1.5 whitespace-nowrap shrink-0 group"
            >
              <span>Console NOC</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </button>

            {/* Mobile / Tablet Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg bg-[#121c38] border border-cyan-500/30 text-cyan-300 hover:text-white transition shrink-0"
              title="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="xl:hidden mt-3 pt-3 border-t border-cyan-500/20 bg-[#091024]/95 backdrop-blur-xl rounded-xl p-3.5 space-y-2 text-xs font-semibold text-slate-300 animate-in fade-in slide-in-from-top-2 duration-150">
            <a
              href="#fitur"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg hover:bg-slate-800/80 hover:text-cyan-300 transition"
            >
              Fitur Lengkap
            </a>
            <a
              href="#preview"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg hover:bg-slate-800/80 hover:text-cyan-300 transition"
            >
              Live Sandbox Preview
            </a>
            <a
              href="#keamanan"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg hover:bg-slate-800/80 hover:text-cyan-300 transition"
            >
              9-Step AI Execution Safety
            </a>
            <a
              href="#arsitektur"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg hover:bg-slate-800/80 hover:text-cyan-300 transition"
            >
              Arsitektur Vendor-Neutral
            </a>
            <a
              href="#harga"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg bg-cyan-950/70 text-cyan-300 border border-cyan-500/40 font-bold"
            >
              Harga & Paket Lisensi (Berbayar)
            </a>
            <a
              href="#hak-cipta"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg hover:bg-slate-800/80 hover:text-cyan-300 transition"
            >
              Sertifikat Hak Cipta AUDIRA (Agus Dwi R)
            </a>
            <a
              href="#faq"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg hover:bg-slate-800/80 hover:text-cyan-300 transition"
            >
              FAQ (Pertanyaan Umum)
            </a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-6 overflow-hidden">
        {/* Ambient Holographic Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-cyan-600/20 via-blue-600/20 to-purple-600/10 blur-[130px] pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-400/40 text-cyan-300 text-xs font-mono mb-6 shadow-[0_0_18px_rgba(6,182,212,0.25)]">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold tracking-wider uppercase">
              LISENSI KOMERSIAL PROPRIETARY • HAK MILIK RESMI AUDIRA (AGUS DWI R)
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Satu Platform NOC Cerdas untuk <br />
            <span className="text-transparent bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-300 bg-clip-text drop-shadow-[0_0_35px_rgba(56,189,248,0.4)]">
              Seluruh Operasional Jaringan Enterprise
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Platform Next-Gen Network Operations Center berlisensi komersial yang menggabungkan{' '}
            <strong className="text-cyan-300">WinBox Web GUI 17 Sub-tabs</strong>,{' '}
            <strong className="text-blue-300">PuTTY Clustered Terminal</strong>,{' '}
            <strong className="text-emerald-300">Autonomous AI Copilot (26 Tools)</strong>, dan{' '}
            <strong className="text-sky-300">9-Step Safety Guardrails</strong>. Dibuat dan dirancang khusus oleh{' '}
            <strong className="text-white">AUDIRA (Agus Dwi R)</strong> untuk ISP, Data Center, dan Network Administrator profesional.
          </p>

          {/* Strict Commercial Warning Callout */}
          <div className="mt-6 inline-block max-w-2xl px-4 py-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs font-sans">
            <span className="font-bold text-amber-400 mr-1.5">PERINGATAN LISENSI:</span>
            Seluruh fitur berstatus <strong className="text-white">berbayar penuh (Bukan Free / Open Source)</strong>. Setiap aktivasi memerlukan serial key resmi yang terikat ke Server UUID & ditandatangani langsung oleh AUDIRA (Agus Dwi R).
          </div>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => handleOpenOrderModal('enterprise')}
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-sm shadow-[0_0_30px_rgba(6,182,212,0.5)] border border-cyan-300/40 transition-all flex items-center space-x-2 transform hover:-translate-y-0.5"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Beli Lisensi Komersial</span>
            </button>

            <button
              onClick={() => setCurrentTab('dashboard')}
              className="px-7 py-3.5 rounded-xl bg-[#0f172e] hover:bg-[#162244] border border-cyan-500/40 hover:border-cyan-400 text-cyan-200 font-bold text-sm shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all flex items-center space-x-2 transform hover:-translate-y-0.5"
            >
              <Play className="w-4 h-4 text-cyan-400" />
              <span>Buka Live Console NOC</span>
            </button>

            <a
              href="https://wa.me/6281234567890?text=Halo%20AUDIRA%20(Agus%20Dwi%20R),%20saya%20tertarik%20membeli%20Lisensi%20Resmi%20AUDIRA%20NetOps%20AI%20v1.0"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all flex items-center space-x-2"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>Konsultasi WhatsApp</span>
            </a>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left font-mono">
            <div className="glass-cyber-card p-3 rounded-xl border border-cyan-500/20">
              <div className="text-cyan-400 text-xs font-bold flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>100% On-Premise AI</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1 font-sans">
                Kredensial & konfigurasi router aman tanpa bocor ke internet.
              </div>
            </div>

            <div className="glass-cyber-card p-3 rounded-xl border border-cyan-500/20">
              <div className="text-cyan-400 text-xs font-bold flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>26 Network AI Tools</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1 font-sans">
                Diagnostik BGP, OSPF, NAT, DHCP, Firewall otomatis.
              </div>
            </div>

            <div className="glass-cyber-card p-3 rounded-xl border border-cyan-500/20">
              <div className="text-cyan-400 text-xs font-bold flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>9-Step Safety Gate</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1 font-sans">
                Nol risiko eksekusi liar, pre-flight backup + diff visual.
              </div>
            </div>

            <div className="glass-cyber-card p-3 rounded-xl border border-cyan-500/20">
              <div className="text-cyan-400 text-xs font-bold flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Lisensi Terproteksi</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1 font-sans">
                Sertifikat hak milik resmi terbitan AUDIRA (Agus Dwi R).
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Live Sandbox Preview Window */}
      <section id="preview" className="py-14 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-mono font-bold text-cyan-400 tracking-widest uppercase">
              INTERACTIVE ARCHITECTURE SANDBOX
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Jelajahi Modul Unggulan AUDIRA NetOps AI
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl mx-auto">
              Pilih tab di bawah untuk melihat preview interaktif bagaimana sistem mengelola jaringan Anda dengan akurasi tinggi.
            </p>
          </div>

          {/* Sandbox Switcher Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <button
              onClick={() => setActivePreviewTab('winbox')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
                activePreviewTab === 'winbox'
                  ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.6)] border border-cyan-400/50'
                  : 'bg-[#0f172e] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Server className="w-3.5 h-3.5 text-cyan-400" />
              <span>WinBox Web GUI (17 Tabs)</span>
            </button>

            <button
              onClick={() => setActivePreviewTab('terminal')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
                activePreviewTab === 'terminal'
                  ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.6)] border border-cyan-400/50'
                  : 'bg-[#0f172e] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>PuTTY Terminal Multiplexer</span>
            </button>

            <button
              onClick={() => setActivePreviewTab('ai-copilot')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
                activePreviewTab === 'ai-copilot'
                  ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.6)] border border-cyan-400/50'
                  : 'bg-[#0f172e] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Copilot (26 Tools)</span>
            </button>

            <button
              onClick={() => setActivePreviewTab('safety')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
                activePreviewTab === 'safety'
                  ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.6)] border border-cyan-400/50'
                  : 'bg-[#0f172e] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>9-Step Safety & Visual Diff</span>
            </button>

            <button
              onClick={() => setActivePreviewTab('topology')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
                activePreviewTab === 'topology'
                  ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.6)] border border-cyan-400/50'
                  : 'bg-[#0f172e] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Network className="w-3.5 h-3.5 text-cyan-400" />
              <span>Holographic Topology</span>
            </button>
          </div>

          {/* Interactive Screen Container */}
          <div className="glass-cyber-holo rounded-2xl border border-cyan-500/30 overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.25)]">
            {/* Top Bar of Window */}
            <div className="bg-[#0b1226] px-4 py-2.5 border-b border-cyan-500/20 flex items-center justify-between font-mono text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <span className="text-slate-400 ml-2 font-bold">
                  AUDIRA NetOps AI [Proprietary Edition] — {activePreviewTab.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center space-x-3 text-[11px] text-cyan-300">
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>ONLINE (LATENCY: 0.8ms)</span>
                </span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-400">UUID: 8F2A-44C1-NOC-PRO</span>
              </div>
            </div>

            {/* Sandbox Content Views */}
            <div className="p-6 bg-[#080d1e]/90 min-h-[420px]">
              {/* 1. WinBox Web GUI Preview */}
              {activePreviewTab === 'winbox' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-1 rounded bg-blue-950 border border-blue-500/40 text-blue-300 font-mono text-xs font-bold">
                        MikroTik CCR2004-16G-2S+
                      </span>
                      <span className="text-xs text-slate-300">RouterOS v7.15.2 (x86_64)</span>
                    </div>
                    <div className="text-xs font-mono text-emerald-400">
                      CPU: 7% • RAM: 3.4GB / 4.0GB • UPTIME: 42d 18h
                    </div>
                  </div>

                  {/* Sub-tab navigation demo */}
                  <div className="flex flex-wrap gap-1.5 font-mono text-[11px] text-slate-400 border-b border-slate-800 pb-2">
                    {['Interfaces', 'IP Address', 'DHCP Server', 'Routes', 'Firewall Filter', 'NAT', 'Queue Simple', 'WireGuard', 'System'].map(
                      (tabName, i) => (
                        <span
                          key={tabName}
                          className={`px-2.5 py-1 rounded cursor-pointer ${
                            i === 0
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                              : 'hover:text-slate-200'
                          }`}
                        >
                          {tabName}
                        </span>
                      )
                    )}
                  </div>

                  {/* Interfaces Table Preview */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className="text-slate-400 border-b border-cyan-500/20 bg-slate-900/60">
                          <th className="py-2 px-3">#</th>
                          <th className="py-2 px-3">INTERFACE NAME</th>
                          <th className="py-2 px-3">TYPE</th>
                          <th className="py-2 px-3">IP ADDRESS</th>
                          <th className="py-2 px-3">TX / RX RATE</th>
                          <th className="py-2 px-3">STATUS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        <tr className="hover:bg-slate-800/40">
                          <td className="py-2 px-3 text-cyan-400 font-bold">1</td>
                          <td className="py-2 px-3 font-semibold text-white">sfp-sfpplus1-UPLINK-TELKOM</td>
                          <td className="py-2 px-3 text-slate-400">SFP+ 10G</td>
                          <td className="py-2 px-3 text-cyan-300">103.14.88.2/30</td>
                          <td className="py-2 px-3 text-emerald-400">8.42 Gbps / 4.19 Gbps</td>
                          <td className="py-2 px-3"><span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[10px]">LINK UP</span></td>
                        </tr>
                        <tr className="hover:bg-slate-800/40">
                          <td className="py-2 px-3 text-cyan-400 font-bold">2</td>
                          <td className="py-2 px-3 font-semibold text-white">sfp-sfpplus2-BACKBONE-IX</td>
                          <td className="py-2 px-3 text-slate-400">SFP+ 10G</td>
                          <td className="py-2 px-3 text-cyan-300">218.100.40.14/30</td>
                          <td className="py-2 px-3 text-emerald-400">5.81 Gbps / 3.20 Gbps</td>
                          <td className="py-2 px-3"><span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[10px]">LINK UP</span></td>
                        </tr>
                        <tr className="hover:bg-slate-800/40">
                          <td className="py-2 px-3 text-cyan-400 font-bold">3</td>
                          <td className="py-2 px-3 font-semibold text-white">bridge-LAN-DISTRIBUSI</td>
                          <td className="py-2 px-3 text-slate-400">Bridge</td>
                          <td className="py-2 px-3 text-cyan-300">172.16.0.1/20</td>
                          <td className="py-2 px-3 text-blue-400">1.25 Gbps / 840 Mbps</td>
                          <td className="py-2 px-3"><span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[10px]">RUNNING</span></td>
                        </tr>
                        <tr className="hover:bg-slate-800/40">
                          <td className="py-2 px-3 text-cyan-400 font-bold">4</td>
                          <td className="py-2 px-3 font-semibold text-white">wg-noc-management</td>
                          <td className="py-2 px-3 text-slate-400">WireGuard</td>
                          <td className="py-2 px-3 text-cyan-300">10.99.0.1/24</td>
                          <td className="py-2 px-3 text-purple-400">14 Mbps / 18 Mbps</td>
                          <td className="py-2 px-3"><span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[10px]">ENCRYPTED</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="p-3 bg-cyan-950/30 border border-cyan-500/20 rounded-xl text-xs flex items-center justify-between text-cyan-200">
                    <span>⚡ Mode WinBox Web AUDIRA: Akses GUI penuh tanpa butuh Wine di macOS atau Linux. Kompatibel MikroTik v6 & v7.</span>
                    <button onClick={() => setCurrentTab('devices')} className="font-bold text-white underline hover:text-cyan-300">
                      Coba di Console &rarr;
                    </button>
                  </div>
                </div>
              )}

              {/* 2. PuTTY Clustered Terminal Preview */}
              {activePreviewTab === 'terminal' && (
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex items-center space-x-2 border-b border-cyan-500/20 pb-2">
                    <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                      Tab 1: CORE-BGP-01 [10.0.0.1]
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400">
                      Tab 2: DIST-SW-02 [10.0.1.1]
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400">
                      Tab 3: EDGE-PE-03 [10.0.2.1]
                    </span>
                    <span className="text-[10px] text-amber-400 ml-auto font-bold">
                      [BROADCAST CLUSTER: ON]
                    </span>
                  </div>

                  <div className="bg-[#030611] p-4 rounded-xl border border-slate-800 text-slate-300 space-y-2 h-[260px] overflow-y-auto">
                    <div className="text-slate-400">
                      [admin@AUDIRA-CORE-01] &gt; <span className="text-white">/ip route print where static</span>
                    </div>
                    <div className="text-cyan-300">
                      Flags: D - DYNAMIC; A - ACTIVE; c - CONNECT, s - STATIC, b - BGP
                    </div>
                    <div className="text-slate-300">
                      # &nbsp; &nbsp; DST-ADDRESS &nbsp; &nbsp; &nbsp; &nbsp; GATEWAY &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; DISTANCE &nbsp; STATUS<br />
                      0 &nbsp;AS 0.0.0.0/0 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 103.14.88.1 &nbsp; &nbsp; &nbsp; 1 &nbsp; &nbsp; &nbsp; &nbsp;reachable (sfp-sfpplus1)<br />
                      1 &nbsp;Ab 172.16.0.0/16 &nbsp; &nbsp; &nbsp; 10.0.1.2 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;20 &nbsp; &nbsp; &nbsp; &nbsp;reachable (OSPF Area 0)<br />
                      2 &nbsp;Ab 192.168.100.0/24 &nbsp; 10.0.2.2 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;20 &nbsp; &nbsp; &nbsp; &nbsp;reachable (BGP AS64500)
                    </div>
                    <div className="text-emerald-400">
                      [Broadcast Output: 3 of 3 routers responded successfully in 2.1ms]
                    </div>
                    <div className="text-slate-400 flex items-center space-x-1">
                      <span>[admin@AUDIRA-CORE-01] &gt; </span>
                      <span className="w-2 h-4 bg-cyan-400 animate-pulse" />
                    </div>
                  </div>

                  <div className="text-slate-400 text-xs flex items-center justify-between">
                    <span>* Mendukung copy/paste ANSI, keyboard shortcut nano/vim, dan multi-router terminal broadcast.</span>
                    <button onClick={() => setCurrentTab('terminal')} className="text-cyan-400 font-bold hover:underline">
                      Jalankan PuTTY Terminal &rarr;
                    </button>
                  </div>
                </div>
              )}

              {/* 3. AI Copilot (26 Tools) Preview */}
              {activePreviewTab === 'ai-copilot' && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-950/60 to-cyan-950/60 p-3 rounded-xl border border-cyan-500/30">
                    <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center space-x-2">
                        <span>AUDIRA Network AI Copilot (Engine: Local Qwen2.5:7b / Ollama)</span>
                        <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 text-[10px] border border-emerald-500/30">Air-Gapped Ready</span>
                      </div>
                      <div className="text-[11px] text-slate-400">26 Specialized Network Tools Registered • 0% Secret Leakage</div>
                    </div>
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    {/* User Prompt Simulation */}
                    <div className="bg-[#0b1226] p-3 rounded-xl border border-slate-800 text-slate-300">
                      <span className="text-cyan-400 font-bold">Operator:</span> &quot;Deteksi kenapa link ke Uplink BGP Telkom mengalami packet drop 4% pada jam sibuk.&quot;
                    </div>

                    {/* AI Analysis Simulation */}
                    <div className="bg-[#040816] p-4 rounded-xl border border-cyan-500/30 text-slate-200 space-y-2">
                      <div className="flex items-center space-x-2 text-cyan-300 font-bold">
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        <span>AI Diagnostic Execution: [Tool: routeros_bgp_analyze, routeros_interface_stats]</span>
                      </div>
                      <p className="text-slate-300 text-xs font-sans leading-relaxed">
                        Analisis selesai dalam 0.4 detik. Ditemukan bahwa buffer queue pada interface <code className="text-cyan-300">sfp-sfpplus1</code> mencapai limit default 50 packets (hardware default FIFO) saat traffic melonjak di atas 8.2 Gbps. Interface mengalami tail-drop, bukan kendala optik laser (Rx Power normal di -3.2 dBm).
                      </p>
                      <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-emerald-300 text-[11px]">
                        <strong>Rekomendasi Solusi:</strong> Ubah queue interface ke <code className="text-white">multi-queue-ethernet-default</code> dengan buffer 500 packets via 9-Step AI Execution Safety Pipeline.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. 9-Step Safety & Visual Diff Preview */}
              {activePreviewTab === 'safety' && (
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-white">9-STEP AI SAFETY PIPELINE: STEP 6/9 (VISUAL DIFF & GATE)</span>
                    </div>
                    <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 text-[11px]">
                      RISK SCORE: 12/100 (LOW RISK)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                    {/* Before Diff */}
                    <div className="bg-[#050918] p-3 rounded-xl border border-rose-500/30">
                      <div className="text-rose-400 font-bold mb-1.5 flex items-center space-x-1">
                        <X className="w-3.5 h-3.5" />
                        <span>Current Active Config (Pre-Flight Snapshot Saved)</span>
                      </div>
                      <pre className="text-rose-300/80 font-mono">
{`/queue interface set [ find default=sfp-sfpplus1 ] queue=only-hardware-queue
# Buffer limit: 50 packets (Causes Tail-Drop)`}
                      </pre>
                    </div>

                    {/* After Diff */}
                    <div className="bg-[#050918] p-3 rounded-xl border border-emerald-500/30">
                      <div className="text-emerald-400 font-bold mb-1.5 flex items-center space-x-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Proposed Safe Modification (Green = Add / Modify)</span>
                      </div>
                      <pre className="text-emerald-300 font-mono">
{`/queue interface set [ find default=sfp-sfpplus1 ] queue=multi-queue-ethernet-default
# Buffer limit: 500 packets (Adaptive FQ-Codel)`}
                      </pre>
                    </div>
                  </div>

                  {/* Operator Gate Confirmation */}
                  <div className="p-3 bg-[#0d1630] rounded-xl border border-amber-500/30 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-amber-300">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span className="font-sans text-xs">
                        Operator Approval Gate: Tindakan tidak dieksekusi sebelum Anda menekan tombol Approve.
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1 rounded bg-rose-950 border border-rose-500/40 text-rose-300 text-xs">
                        Reject
                      </button>
                      <button className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-[0_0_12px_rgba(16,185,129,0.5)]">
                        Approve & Execute (Step 7)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. Holographic Topology Preview */}
              {activePreviewTab === 'topology' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                    <span className="text-xs font-mono text-cyan-300 font-bold">
                      MULTI-VENDOR BACKBONE TOPOLOGY (LLDP/CDP AUTO-DISCOVERY)
                    </span>
                    <span className="text-xs text-slate-400">Total Nodes: 4 • All Links Green</span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-[#0d1733] border border-cyan-500/40 text-center">
                      <Server className="w-6 h-6 text-cyan-400 mx-auto mb-1" />
                      <div className="font-bold text-xs text-white">CORE-CCR2004</div>
                      <div className="text-[10px] text-cyan-300 font-mono">10.0.0.1 • MikroTik</div>
                      <div className="text-[10px] text-emerald-400 mt-1">● Up (0.4ms)</div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#0d1733] border border-blue-500/40 text-center">
                      <Server className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                      <div className="font-bold text-xs text-white">DIST-CISCO-9300</div>
                      <div className="text-[10px] text-blue-300 font-mono">10.0.1.1 • Cisco IOS</div>
                      <div className="text-[10px] text-emerald-400 mt-1">● Up (0.8ms)</div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#0d1733] border border-indigo-500/40 text-center">
                      <Server className="w-6 h-6 text-indigo-400 mx-auto mb-1" />
                      <div className="font-bold text-xs text-white">SW-HUAWEI-5720</div>
                      <div className="text-[10px] text-indigo-300 font-mono">10.0.2.1 • Huawei VRP</div>
                      <div className="text-[10px] text-emerald-400 mt-1">● Up (1.1ms)</div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#0d1733] border border-teal-500/40 text-center">
                      <Server className="w-6 h-6 text-teal-400 mx-auto mb-1" />
                      <div className="font-bold text-xs text-white">EDGE-JUNIPER-MX</div>
                      <div className="text-[10px] text-teal-300 font-mono">10.0.3.1 • JunOS</div>
                      <div className="text-[10px] text-emerald-400 mt-1">● Up (1.4ms)</div>
                    </div>
                  </div>

                  <div className="p-3 bg-[#081024] rounded-xl border border-cyan-500/20 text-xs text-slate-300 flex items-center justify-between">
                    <span>⚡ Canvas topologi interaktif mendeteksi link failure, BGP status, dan throughput realtime antar perangkat.</span>
                    <button onClick={() => setCurrentTab('topology')} className="text-cyan-400 font-bold hover:underline">
                      Buka Canvas Topology &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 6 Core Pillars Feature Grid */}
      <section id="fitur" className="py-20 px-6 bg-[#040714] border-t border-cyan-500/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-mono font-bold text-cyan-400 tracking-widest uppercase">
              FITUR UTAMA ENTERPRISE
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-1">
              Dirancang untuk Beban Kerja NOC Tanpa Toleransi Kesalahan
            </h2>
            <p className="text-sm text-slate-400 mt-3 max-w-2xl mx-auto">
              AUDIRA NetOps AI menggabungkan kehandalan alat operasional klasik dengan kekuatan model kecerdasan buatan otonom berkeamanan militer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="glass-cyber-card p-6 rounded-2xl border border-cyan-500/20 hover:border-cyan-400/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                <Server className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">WinBox-like Web GUI (17 Tabs)</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Akses konfigurasi MikroTik RouterOS v6 & v7 langsung dari browser tanpa emulasi Wine. Kelola Interfaces, IP Pools, Routes, DHCP, Firewall Filter, NAT, Queues, hingga WireGuard secara real-time.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-cyan-400">
                • Kompatibel RouterOS v6 & v7 API-SSL
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="glass-cyber-card p-6 rounded-2xl border border-blue-500/20 hover:border-blue-400/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-500/40 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                <Terminal className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">PuTTY Terminal Multiplexer</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Terminal multi-tab WebSocket streaming berkecepatan tinggi dengan ANSI syntax highlighting. Kirim perintah single broadcast ke puluhan router sekaligus untuk automasi massal tanpa delay.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-blue-400">
                • WebSocket Full-Duplex + Multi-tab SSH
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="glass-cyber-card p-6 rounded-2xl border border-emerald-500/20 hover:border-emerald-400/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Autonomous AI Copilot (26 Tools)</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Asisten NOC cerdas yang terintegrasi 26 network tools. Mendeteksi BGP flapping, rogue DHCP, konflik IP, spike CPU, dan anomali throughput dengan penalaran kontekstual real-time.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-emerald-400">
                • Support Ollama Lokal & Cloud API
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="glass-cyber-card p-6 rounded-2xl border border-indigo-500/20 hover:border-indigo-400/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">9-Step AI Execution Safety Pipeline</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Setiap perintah AI wajib melewati 9 tahapan verifikasi: Validasi sintaks, analisis risiko, snapshot konfigurasi, visual 3-color diff, dan konfirmasi operator sebelum dieksekusi.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-indigo-400">
                • Zero Unauthorized Modification Guarantee
              </div>
            </div>

            {/* Pillar 5 */}
            <div className="glass-cyber-card p-6 rounded-2xl border border-teal-500/20 hover:border-teal-400/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-teal-950/80 border border-teal-500/40 flex items-center justify-center text-teal-400 mb-4 group-hover:scale-110 transition shadow-[0_0_20px_rgba(20,184,166,0.3)]">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Holographic Observability</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Dashboard telemetri live dengan visualisasi cyberpunk gelap. Pantau status link up/down, utilisasi bandwidth antarmuka, heatmap latency, dan grafik beban resource seketika.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-teal-400">
                • Polling Latency &lt; 2 Detik Real-time
              </div>
            </div>

            {/* Pillar 6 */}
            <div className="glass-cyber-card p-6 rounded-2xl border border-sky-500/20 hover:border-sky-400/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-sky-950/80 border border-sky-500/40 flex items-center justify-center text-sky-400 mb-4 group-hover:scale-110 transition shadow-[0_0_20px_rgba(14,165,233,0.3)]">
                <HardDrive className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Disaster Recovery & Config Diff</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Pencadangan file konfigurasi `.rsc` otomatis berkala dengan riwayat versi. Perbandingan diff side-by-side dan tombol 1-Click Rollback jika terjadi kesalahan setting jaringan.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-sky-400">
                • Snapshot Pre-Flight + Automatic Rollback
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deep-Dive: 9-Step AI Execution Safety Pipeline */}
      <section id="keamanan" className="py-20 px-6 bg-[#060b18]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-mono font-bold text-emerald-400 tracking-widest uppercase">
              KEAMANAN ZERO-RISK
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-1">
              9-Step AI Execution Safety Pipeline
            </h2>
            <p className="text-sm text-slate-400 mt-3 max-w-2xl mx-auto">
              Tidak ada perintah berbahaya yang dijalankan tanpa melewati protokol pengamanan 9 tahap ini. Keamanan router Anda adalah prioritas mutlak.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            {[
              { step: '01', title: 'AI Proposal', desc: 'AI menyusun usulan tindakan berdasarkan laporan masalah jaringan tanpa hak eksekusi langsung.', color: 'border-cyan-500/30' },
              { step: '02', title: 'Tool Registry Lookup', desc: 'Pemeriksaan apakah tool yang diminta terdaftar secara resmi di registry aman kami.', color: 'border-blue-500/30' },
              { step: '03', title: 'Input Validation', desc: 'Sanitasi parameter input untuk mencegah injection attack atau argumen ilegal.', color: 'border-indigo-500/30' },
              { step: '04', title: 'Risk Engine Scoring', desc: 'Kalkulasi skor risiko (Low / Medium / High / Critical) berdasarkan parameter perintah.', color: 'border-purple-500/30' },
              { step: '05', title: 'Pre-flight Backup', desc: 'Pengambilan snapshot konfigurasi router otomatis sebagai garansi rollback darurat.', color: 'border-amber-500/30' },
              { step: '06', title: 'Visual 3-Color Diff', desc: 'Visualisasi perubahan side-by-side (Hijau = Tambah, Kuning = Ubah, Merah = Hapus).', color: 'border-emerald-500/30' },
              { step: '07', title: 'Operator Approval Gate', desc: 'Pemberian persetujuan eksplisit oleh Operator Manusia (Human-in-the-Loop).', color: 'border-rose-500/30' },
              { step: '08', title: 'Sandboxed Execution', desc: 'Eksekusi perintah melalui jalur terenkripsi API-SSL / SSH dengan timeout ketat.', color: 'border-cyan-500/30' },
              { step: '09', title: 'Post-flight Audit & Verification', desc: 'Pencatatan mutlak ke audit log PostgreSQL & verifikasi bahwa link tetap beroperasi normal.', color: 'border-emerald-500/30' },
            ].map((item) => (
              <div key={item.step} className={`glass-cyber-card p-4 rounded-xl border ${item.color} relative group hover:-translate-y-0.5 transition`}>
                <div className="text-2xl font-black text-slate-600 group-hover:text-cyan-400 transition font-sans">
                  {item.step}
                </div>
                <div className="text-sm font-bold text-white mt-1">{item.title}</div>
                <div className="text-xs text-slate-400 mt-1 font-sans leading-relaxed">
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Multi-Vendor Compatibility Showcase */}
      <section id="arsitektur" className="py-16 px-6 bg-[#030612] border-t border-cyan-500/20">
        <div className="max-w-6xl mx-auto text-center">
          <span className="text-xs font-mono font-bold text-cyan-400 tracking-widest uppercase">
            VENDOR-NEUTRAL ARCHITECTURE
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Kompatibilitas Lintas Perangkat Keras Jaringan
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            Dirancang dengan DeviceConnector terisolasi sehingga mendukung beragam vendor jaringan enterprise tanpa bergantung pada satu merek.
          </p>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="p-4 rounded-xl bg-[#0a1124] border border-cyan-500/30 text-center">
              <div className="font-black text-sm text-white">MikroTik</div>
              <div className="text-[10px] text-cyan-300 font-mono mt-0.5">RouterOS v6 & v7</div>
              <div className="text-[9px] text-slate-400 mt-1">REST API & API-SSL</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0a1124] border border-blue-500/30 text-center">
              <div className="font-black text-sm text-white">Cisco Systems</div>
              <div className="text-[10px] text-blue-300 font-mono mt-0.5">IOS-XE & NX-OS</div>
              <div className="text-[9px] text-slate-400 mt-1">SSH & Netconf</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0a1124] border border-indigo-500/30 text-center">
              <div className="font-black text-sm text-white">Huawei</div>
              <div className="text-[10px] text-indigo-300 font-mono mt-0.5">VRP OS Platform</div>
              <div className="text-[9px] text-slate-400 mt-1">Telnet & SSH Clustered</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0a1124] border border-teal-500/30 text-center">
              <div className="font-black text-sm text-white">Juniper Networks</div>
              <div className="text-[10px] text-teal-300 font-mono mt-0.5">JunOS Enterprise</div>
              <div className="text-[9px] text-slate-400 mt-1">Junoscript & Netconf</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0a1124] border border-purple-500/30 text-center col-span-2 sm:col-span-1">
              <div className="font-black text-sm text-white">EdgeCore / VyOS</div>
              <div className="text-[10px] text-purple-300 font-mono mt-0.5">Open Networking</div>
              <div className="text-[9px] text-slate-400 mt-1">SONiC & Linux Kernel</div>
            </div>
          </div>
        </div>
      </section>

      {/* Commercial Pricing & Licensing Matrix (BERBAYAR PENUH - BUKAN FREE) */}
      <section id="harga" className="py-20 px-6 bg-[#05091a] relative">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-mono mb-3">
              <Lock className="w-3.5 h-3.5 text-rose-400" />
              <span>KEBIJAKAN LISENSI KOMERSIAL RESMI • BUKAN PERANGKAT LUNAK GRATIS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Pilihan Paket Lisensi Komersial (Berbayar)
            </h2>
            <p className="text-sm text-slate-300 mt-3 max-w-2xl mx-auto leading-relaxed">
              Software ini berbayar penuh untuk memastikan ketersediaan dukungan teknis purna jual, update firmware rutin, dan komitmen keamanan tingkat enterprise. Dapatkan sertifikat lisensi resmi yang ditandatangani langsung oleh <strong className="text-cyan-300">AUDIRA (Agus Dwi R)</strong>.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Tier 1: Starter NOC */}
            <div className="glass-cyber-card rounded-2xl p-7 border border-cyan-500/25 flex flex-col justify-between hover:border-cyan-400/50 transition">
              <div>
                <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  STARTER NOC EDITION
                </div>
                <h3 className="text-xl font-bold text-white mt-1">Branch & Small ISP</h3>
                <p className="text-xs text-slate-400 mt-2">
                  Cocok untuk RT/RW Net, ISP Skala Kecil, atau Kantor Cabang hingga 10 Router.
                </p>

                <div className="mt-5 pt-4 border-t border-slate-800">
                  <div className="text-xs text-slate-400">Harga Lisensi Permanen:</div>
                  <div className="text-3xl font-black text-white mt-1">
                    Rp 4.500.000
                    <span className="text-xs font-normal text-slate-400"> / cluster</span>
                  </div>
                  <div className="text-[11px] text-cyan-400 font-mono mt-1">
                    ✓ Lisensi Seumur Hidup + 1 Thn Update
                  </div>
                </div>

                <div className="mt-6 space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Maksimal 10 Router / Switch terdaftar</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>WinBox Web GUI (Semua 17 Sub-tabs)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>PuTTY Clustered Terminal 10 Tab</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Autonomous AI Copilot Standard</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Backup Konfigurasi Harian Otomatis</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Sertifikat Lisensi UUID Resmi AUDIRA</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleOpenOrderModal('starter')}
                className="mt-8 w-full py-3 rounded-xl bg-[#111c3a] hover:bg-[#1a2c5a] border border-cyan-500/40 text-cyan-200 font-bold text-xs transition flex items-center justify-center space-x-1.5"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Pesan Lisensi Starter</span>
              </button>
            </div>

            {/* Tier 2: Enterprise Pro (MOST POPULAR) */}
            <div className="glass-cyber-card rounded-2xl p-7 border-2 border-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.3)] flex flex-col justify-between relative transform lg:-translate-y-2">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-[10px] tracking-wider uppercase shadow-[0_0_15px_rgba(6,182,212,0.6)]">
                PALING BANYAK DIPILIH (RECOMMENDED)
              </div>

              <div>
                <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  ENTERPRISE PRO EDITION
                </div>
                <h3 className="text-xl font-bold text-white mt-1">Regional ISP & Corporate NOC</h3>
                <p className="text-xs text-slate-400 mt-2">
                  Didesain untuk Penyedia Jasa Internet Regional, Kampus, dan Corporate Datacenter hingga 50 Router.
                </p>

                <div className="mt-5 pt-4 border-t border-slate-800">
                  <div className="text-xs text-slate-400">Harga Lisensi Permanen:</div>
                  <div className="text-3xl font-black text-white mt-1">
                    Rp 12.800.000
                    <span className="text-xs font-normal text-slate-400"> / cluster</span>
                  </div>
                  <div className="text-[11px] text-emerald-400 font-mono mt-1">
                    ✓ Lisensi Seumur Hidup + 1 Thn SLA Priority
                  </div>
                </div>

                <div className="mt-6 space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Maksimal 50 Router / Switch terdaftar</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Semua fitur Starter NOC disertakan</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-bold text-white">Full 9-Step AI Execution Safety Pipeline</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Visual 3-Color Config Diffing & Rollback</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Clustered Terminal Multi-Router Broadcast</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>On-Premise Offline AI Engine (Ollama Qwen2.5)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Audit Log Compliance & PostgreSQL Vault</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleOpenOrderModal('enterprise')}
                className="mt-8 w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-xs shadow-[0_0_20px_rgba(6,182,212,0.5)] border border-cyan-300/40 transition flex items-center justify-center space-x-1.5"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Pesan Lisensi Enterprise Pro</span>
              </button>
            </div>

            {/* Tier 3: Carrier & Telco Master */}
            <div className="glass-cyber-card rounded-2xl p-7 border border-indigo-500/25 flex flex-col justify-between hover:border-indigo-400/50 transition">
              <div>
                <div className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
                  CARRIER & ISP MASTER
                </div>
                <h3 className="text-xl font-bold text-white mt-1">Tier-1 Telco & Multi-Region</h3>
                <p className="text-xs text-slate-400 mt-2">
                  Dikhususkan bagi National Telco, Bank, Multi-Region Datacenter tanpa batasan jumlah perangkat.
                </p>

                <div className="mt-5 pt-4 border-t border-slate-800">
                  <div className="text-xs text-slate-400">Harga Lisensi Permanen:</div>
                  <div className="text-3xl font-black text-white mt-1">
                    Rp 28.500.000
                    <span className="text-xs font-normal text-slate-400"> / cluster</span>
                  </div>
                  <div className="text-[11px] text-indigo-400 font-mono mt-1">
                    ✓ Unlimited Nodes + 2 Thn Dedicated SLA
                  </div>
                </div>

                <div className="mt-6 space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-bold text-white">UNLIMITED Nodes (Tanpa Batas Perangkat)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Dukungan Multi-Vendor (MikroTik, Cisco, Huawei, Juniper)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Fine-Tuning AI Model Khusus Topologi Jaringan Anda</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Disaster Recovery Multi-Datacenter Replication</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Dukungan Teknis Langsung 24/7 Dedicated Support</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Setup & Deployment On-Site oleh Tim AUDIRA</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleOpenOrderModal('carrier')}
                className="mt-8 w-full py-3 rounded-xl bg-[#13173d] hover:bg-[#1d235e] border border-indigo-500/40 text-indigo-200 font-bold text-xs transition flex items-center justify-center space-x-1.5"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Pesan Lisensi Carrier</span>
              </button>
            </div>
          </div>

          {/* Tier 4: Hardware Appliance Turn-Key Banner */}
          <div className="mt-8 glass-cyber-card rounded-2xl p-6 border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <HardDrive className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="text-base font-bold text-white">
                    Turn-Key Hardware Appliance 1U Rackmount Server
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">
                    HARDWARE + SOFTWARE
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                  Solusi siap pasang di rack NOC Anda. Server 1U enterprise dengan AUDIRA NetOps AI pre-installed, GPU on-premise untuk AI offline, dan instalasi langsung oleh AUDIRA (Agus Dwi R). Mulai dari Rp 45.000.000,-
                </p>
              </div>
            </div>

            <button
              onClick={() => handleOpenOrderModal('appliance')}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(16,185,129,0.4)] whitespace-nowrap shrink-0"
            >
              Minta Penawaran Appliance &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* Official Ownership, Copyright & Legal Certificate */}
      <section id="hak-cipta" className="py-20 px-6 bg-[#040817] border-t border-cyan-500/20">
        <div className="max-w-4xl mx-auto">
          <div className="glass-cyber-holo p-8 rounded-2xl border-2 border-cyan-400/40 shadow-[0_0_40px_rgba(6,182,212,0.2)] relative">
            <div className="flex items-center justify-between border-b border-cyan-500/25 pb-4">
              <div className="flex items-center space-x-3">
                <Award className="w-7 h-7 text-cyan-400" />
                <div>
                  <h3 className="text-lg font-bold text-white tracking-wide">
                    SERTIFIKAT HAK CIPTA & LISENSI RESMI
                  </h3>
                  <div className="text-xs text-slate-400">
                    Proprietary Commercial Software Registration Certificate
                  </div>
                </div>
              </div>
              <div className="text-right font-mono text-xs">
                <span className="text-cyan-400 font-bold">REG-ID: AUDIRA-NOC-2025</span>
                <div className="text-[10px] text-slate-500">DIGITALLY SIGNED</div>
              </div>
            </div>

            <div className="mt-6 space-y-4 text-xs text-slate-300 font-sans leading-relaxed">
              <p>
                Perangkat lunak <strong>AUDIRA NetOps AI (Enterprise Suite v1.0.0)</strong> adalah karya intelektual yang dibuat, dirancang, dan dimiliki sepenuhnya oleh:
              </p>

              <div className="p-4 rounded-xl bg-[#091124] border border-cyan-500/30 font-mono space-y-1 text-slate-200">
                <div>• <strong>Pemilik Hak Cipta & Arsitek Sistem:</strong> AUDIRA (Agus Dwi R)</div>
                <div>• <strong>Kategori Lisensi:</strong> Lisensi Komersial / Proprietary (Berbayar Penuh)</div>
                <div>• <strong>Ketentuan Penggunaan:</strong> Hak Guna Terbatas bagi Pembeli Lisensi Sah</div>
                <div>• <strong>Status Freeware:</strong> BUKAN FREEEWARE / BUKAN OPEN SOURCE UNTUK PRODUKSI</div>
              </div>

              <p className="text-slate-400">
                Dilarang keras menyalin, membongkar, mendekompilasi, mendistribusikan ulang, menjual kembali, atau memanfaatkan kode sumber ini tanpa persetujuan tertulis dan bukti transaksi lisensi resmi dari AUDIRA (Agus Dwi R). Setiap bentuk pembajakan atau penggunaan tanpa izin akan diproses sesuai peraturan perundang-undangan Hak Cipta Republik Indonesia dan hukum internasional yang berlaku.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-cyan-500/20 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
              <div className="flex items-center space-x-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified Legal Ownership by Agus Dwi R (AUDIRA)</span>
              </div>
              <a
                href="https://github.com/Audira141415/AUDIRA-NetOps-AI/blob/main/LICENSE"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:underline flex items-center space-x-1"
              >
                <span>Lihat Dokumen LICENSE Resmi</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6 bg-[#030612]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-mono font-bold text-cyan-400 tracking-widest uppercase">
              PERTANYAAN UMUM
            </span>
            <h2 className="text-3xl font-black text-white mt-1">
              Frequently Asked Questions (FAQ)
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Mengapa software ini berbayar penuh dan tidak disediakan versi gratis?',
                a: 'AUDIRA NetOps AI dirancang untuk kebutuhan operasional jaringan misi-kritis (ISP, Telco, Datacenter). Pendekatan komersial berbayar menjamin tersedianya pembaruan fitur berkesinambungan, riset model AI lokal, audit keamanan ketat, serta garansi bantuan langsung oleh AUDIRA (Agus Dwi R) saat terjadi kendala darurat jaringan.',
              },
              {
                q: 'Apakah saya bisa mencoba sistem ini sebelum membeli?',
                a: 'Tentu. Anda dapat langsung menguji coba antarmuka live secara interaktif melalui tombol "Buka Console NOC" di atas, atau menghubungi kami untuk demonstrasi on-site / remote demo bersama Agus Dwi R.',
              },
              {
                q: 'Bagaimana cara AI Copilot bekerja tanpa membocorkan kredensial router?',
                a: 'Sistem menggunakan arsitektur On-Premise. Model AI seperti Ollama (Qwen2.5:7b / DeepSeek-R1) berjalan di server lokal Anda sendiri. Seluruh password dan private key dienkripsi dengan AES-256-GCM dan otomatis di-masking menjadi bintang (********) sehingga tidak pernah keluar ke internet.',
              },
              {
                q: 'Apakah bisa digunakan tanpa koneksi internet sama sekali (Air-Gapped)?',
                a: 'Ya, 100% bisa. AUDIRA NetOps AI dirancang untuk berjalan di lingkungan jaringan air-gapped menggunakan database PostgreSQL lokal dan engine Ollama on-premise.',
              },
              {
                q: 'Bagaimana mekanisme pengikatan lisensi ke server?',
                a: 'Setelah pembayaran diverifikasi, Anda akan menerima License Key resmi berbentuk digital signature yang terikat dengan Server Hardware UUID Anda. Satu lisensi berlaku seumur hidup untuk cluster yang didaftarkan.',
              },
              {
                q: 'Siapa yang memberikan dukungan purna jual dan update software?',
                a: 'Dukungan diberikan langsung oleh tim AUDIRA di bawah pengawasan langsung Agus Dwi R via grup WhatsApp prioritas, panggilan darurat, dan portal tiket resmi.',
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="glass-cyber-card rounded-xl border border-cyan-500/20 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-sm font-bold text-white hover:text-cyan-300 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-cyan-400 transition-transform ${
                      activeFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="p-4 pt-0 text-xs text-slate-300 font-sans leading-relaxed border-t border-slate-800/60 bg-slate-900/30">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 px-6 bg-gradient-to-b from-[#05091a] to-[#080f26] border-t border-cyan-500/30 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Siap Mengamankan & Mengotomasi Jaringan Anda?
          </h2>
          <p className="mt-3 text-sm text-slate-300 max-w-xl mx-auto">
            Tingkatkan efisiensi NOC dan eliminasi human-error sekarang dengan platform resmi dari AUDIRA (Agus Dwi R).
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => handleOpenOrderModal('enterprise')}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-sm shadow-[0_0_30px_rgba(6,182,212,0.5)] border border-cyan-300/40 transition flex items-center space-x-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Beli Lisensi Resmi Sekarang</span>
            </button>

            <button
              onClick={() => setCurrentTab('dashboard')}
              className="px-8 py-3.5 rounded-xl bg-[#0e1630] hover:bg-[#152044] border border-cyan-500/40 text-cyan-200 font-bold text-sm transition flex items-center space-x-2"
            >
              <Play className="w-4 h-4 text-cyan-400" />
              <span>Masuk Console NOC</span>
            </button>
          </div>
        </div>
      </section>

      {/* Public Footer */}
      <footer className="bg-[#02050f] border-t border-cyan-500/20 py-12 px-6 text-xs text-slate-400 font-sans">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white font-extrabold text-xs">
                A
              </div>
              <span className="font-black text-base text-white tracking-wider">
                AUDIRA <span className="text-cyan-400">NetOps AI</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs max-w-md leading-relaxed">
              Enterprise Network Operations Center Platform dengan WinBox-like Web GUI, PuTTY Clustered Terminal, dan Autonomous AI Copilot berlisensi komersial. Hak cipta dan kepemilikan penuh oleh AUDIRA (Agus Dwi R).
            </p>
            <div className="text-[11px] font-mono text-cyan-400">
              Copyright © 2025-2026 AUDIRA (Agus Dwi R). All Rights Reserved.
            </div>
          </div>

          {/* Quick Nav Col */}
          <div>
            <div className="font-bold text-white uppercase tracking-wider text-xs mb-3 font-mono">
              Navigasi Halaman
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#fitur" className="hover:text-cyan-300 transition">Fitur Lengkap</a>
              </li>
              <li>
                <a href="#preview" className="hover:text-cyan-300 transition">Live Sandbox Preview</a>
              </li>
              <li>
                <a href="#keamanan" className="hover:text-cyan-300 transition">9-Step AI Safety</a>
              </li>
              <li>
                <a href="#harga" className="hover:text-cyan-300 transition">Paket Lisensi Berbayar</a>
              </li>
              <li>
                <a href="#hak-cipta" className="hover:text-cyan-300 transition">Sertifikat Hak Cipta</a>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <div className="font-bold text-white uppercase tracking-wider text-xs mb-3 font-mono">
              Kontak & Pemesanan
            </div>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center space-x-2">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-300 transition"
                >
                  WhatsApp: +62 812-3456-7890
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <a href="mailto:audira.netops@gmail.com" className="hover:text-cyan-300 transition">
                  audira.netops@gmail.com
                </a>
              </li>
              <li className="flex items-center space-x-2 text-slate-400">
                <Award className="w-3.5 h-3.5 text-indigo-400" />
                <span>Author: Agus Dwi R (AUDIRA)</span>
              </li>
              <li className="pt-2">
                <button
                  onClick={() => setCurrentTab('dashboard')}
                  className="w-full py-1.5 rounded bg-blue-900/40 hover:bg-blue-800/60 border border-blue-500/40 text-cyan-200 text-xs font-bold"
                >
                  Masuk Console NOC &rarr;
                </button>
              </li>
            </ul>
          </div>
        </div>
      </footer>

      {/* Interactive License Purchase Order Modal */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-cyber-holo w-full max-w-lg rounded-2xl border border-cyan-400/50 shadow-[0_0_50px_rgba(6,182,212,0.4)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#0b1226] px-5 py-4 border-b border-cyan-500/20 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-400/50 flex items-center justify-center text-cyan-300">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Pemesanan Lisensi Resmi AUDIRA NetOps AI
                  </h3>
                  <div className="text-[10px] text-cyan-300 font-mono">
                    Lisensi Komersial Proprietary Berbayar by Agus Dwi R
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOrderModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 max-h-[80vh] overflow-y-auto">
              {isOrderSuccess ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400 mx-auto animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-white">Pesanan Siap Dikirim!</h4>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                    Sistem telah membuka tautan chat WhatsApp resmi AUDIRA (Agus Dwi R) dengan rincian pesanan Anda. Tim kami akan segera menerbitkan invoice resmi dan kode lisensi.
                  </p>
                  <button
                    onClick={() => setIsOrderModalOpen(false)}
                    className="px-6 py-2.5 rounded-xl bg-cyan-600 text-white font-bold text-xs"
                  >
                    Tutup Modal
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSendWhatsAppOrder} className="space-y-4 text-xs font-sans">
                  {/* Select Tier */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      Pilihan Paket Lisensi Komersial:
                    </label>
                    <select
                      value={selectedTier}
                      onChange={(e) => setSelectedTier(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg bg-[#0b1226] border border-cyan-500/40 text-cyan-200 font-bold focus:outline-none focus:border-cyan-300"
                    >
                      <option value="starter">Starter NOC (Rp 4.500.000 / cluster - s.d 10 Router)</option>
                      <option value="enterprise">Enterprise Pro (Rp 12.800.000 / cluster - s.d 50 Router) [POPULAR]</option>
                      <option value="carrier">Carrier & ISP Master (Rp 28.500.000 / cluster - Unlimited Nodes)</option>
                      <option value="appliance">Turn-Key 1U Hardware Appliance (Custom Quote)</option>
                    </select>
                  </div>

                  {/* Input Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Nama Lengkap PIC: <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Budi Santoso"
                        value={formPicName}
                        onChange={(e) => setFormPicName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-[#080d1e] border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Nama Instansi / Perusahaan / ISP: <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: PT Lintas Data Nusantara"
                        value={formCompany}
                        onChange={(e) => setFormCompany(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-[#080d1e] border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Nomor WhatsApp PIC: <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="Contoh: 081234567890"
                        value={formWhatsApp}
                        onChange={(e) => setFormWhatsApp(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-[#080d1e] border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Email Perusahaan: <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="noc@perusahaan.co.id"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-[#080d1e] border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Estimasi Jumlah Router / Switch yang Dikelola:
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formNodeCount}
                      onChange={(e) => setFormNodeCount(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#080d1e] border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Catatan Tambahan / Kebutuhan Khusus:
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Contoh: Butuh bantuan integrasi Ollama offline di server Proxmox..."
                      value={formNotes}
                      onChange={(e) => setFormNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#080d1e] border border-slate-700 text-white focus:outline-none focus:border-cyan-400 resize-none"
                    />
                  </div>

                  <div className="p-3 bg-cyan-950/50 rounded-xl border border-cyan-500/30 text-[11px] text-cyan-200">
                    🔒 Data Anda aman dan digunakan semata-mata untuk penerbitan invoice serta Certificate Key lisensi resmi dari AUDIRA (Agus Dwi R).
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500 hover:from-emerald-500 hover:to-cyan-400 text-white font-black text-xs shadow-[0_0_25px_rgba(16,185,129,0.5)] border border-emerald-300/40 transition flex items-center justify-center space-x-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Kirim Pesanan Resmi ke WhatsApp AUDIRA &rarr;</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
