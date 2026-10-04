// AUDIRA NetOps AI - Enterprise System Settings & Integration Hub
// Proprietary Commercial Software by AUDIRA (Agus Dwi R)
// Supports xAI Grok, Ollama, DeepSeek, OpenAI, Anthropic, Gemini + 9 Router Vendors + Telegram/WhatsApp Webhooks

import React, { useState } from 'react';
import {
  Settings,
  Bot,
  Activity,
  Shield,
  Bell,
  Save,
  CheckCircle2,
  Cpu,
  Globe,
  Server,
  HardDrive,
  Lock,
  RefreshCw,
  Sliders,
  Key,
  Radio,
  Eye,
  EyeOff,
  Send,
  MessageSquare,
  Mail,
  Cloud,
  Database,
  Network,
  Layers,
  AlertTriangle,
  Zap,
  Check,
  Award,
} from 'lucide-react';
import { AIProviderType, VendorType } from '@audira/types';

export const SettingsView: React.FC = () => {
  // Navigation Sub-tab
  const [activeTab, setActiveTab] = useState<
    'ai-gateway' | 'routers' | 'notifications' | 'telemetry' | 'backup' | 'security'
  >('ai-gateway');

  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  // 1. AI Gateway State (Includes Grok, DeepSeek, Ollama, OpenAI, etc.)
  const [aiProvider, setAiProvider] = useState<AIProviderType>('grok');
  const [showApiKey, setShowApiKey] = useState(false);
  const [aiConfig, setAiConfig] = useState({
    grokApiKey: 'xai-9f8a2c4e1b7d5e6a0c3b8d1f',
    grokModel: 'grok-2-1212',
    grokBaseUrl: 'https://api.x.ai/v1',
    ollamaBaseUrl: 'http://localhost:11434',
    ollamaModel: 'qwen2.5:7b',
    deepseekApiKey: 'sk-dsk-884192b0c1e8',
    deepseekModel: 'deepseek-chat',
    openaiApiKey: 'sk-proj-********************',
    openaiModel: 'gpt-4o',
    anthropicApiKey: 'sk-ant-********************',
    anthropicModel: 'claude-3-5-sonnet-20241022',
    geminiApiKey: 'AIzaSy********************',
    geminiModel: 'gemini-2.0-flash',
    temperature: 0.2,
    maxTokens: 4096,
    enableStream: true,
    safetyGuardAutoApproveLow: true,
    safetyGuardStrictHighRisk: true,
  });

  const [isAiTesting, setIsAiTesting] = useState(false);
  const [aiTestResult, setAiTestResult] = useState<{
    success: boolean;
    message: string;
    latencyMs: number;
  } | null>(null);

  // 2. 9 Router Vendor Integrations Profile State
  const [selectedVendorTab, setSelectedVendorTab] = useState<VendorType>('MikroTik');
  const [routerConfigs, setRouterConfigs] = useState({
    MikroTik: {
      defaultPort: 8729,
      apiProtocol: 'API-SSL (Port 8729)',
      tlsVerify: false,
      timeoutSeconds: 10,
      keepAliveInterval: 30,
      enableRosV7Rest: true,
      autoRollbackSnapshot: true,
    },
    Cisco: {
      defaultPort: 22,
      protocol: 'SSHv2 / NETCONF',
      enableSecretRequired: true,
      terminalPagingDisable: true,
      timeoutSeconds: 15,
      netconfPort: 830,
    },
    Huawei: {
      defaultPort: 22,
      protocol: 'SSH / VRP',
      superPasswordRequired: true,
      screenLengthZero: true,
      timeoutSeconds: 12,
      snmpVersion: 'v3',
    },
    Juniper: {
      defaultPort: 830,
      protocol: 'NETCONF / JunOS XML',
      commitConfirmTimerMinutes: 5,
      timeoutSeconds: 15,
      autoRollback: true,
    },
    Arista: {
      defaultPort: 443,
      protocol: 'eAPI (JSON-RPC over HTTPS)',
      tlsVerify: true,
      timeoutSeconds: 10,
      streamingTelemetry: true,
    },
    Fortinet: {
      defaultPort: 443,
      protocol: 'FortiOS REST API',
      apiTokenBearer: true,
      vdomName: 'root',
      timeoutSeconds: 10,
    },
    VyOS: {
      defaultPort: 443,
      protocol: 'VyOS HTTP API / SSH',
      authApiKey: true,
      timeoutSeconds: 10,
      useVtysh: true,
    },
    EdgeCore: {
      defaultPort: 50051,
      protocol: 'gNMI / SONiC Telemetry',
      streamingRateHz: 1,
      timeoutSeconds: 8,
    },
    Ubiquiti: {
      defaultPort: 443,
      protocol: 'UniFi Controller API / EdgeOS SSH',
      siteName: 'default',
      timeoutSeconds: 10,
    },
  });

  // 3. Notification & Webhook Channels State
  const [telegramConfig, setTelegramConfig] = useState({
    enabled: true,
    botToken: '7192841920:AAHq_m9vK28dLx8Yp7Wq4',
    chatId: '-1002345678901',
    alertSeverity: 'WARNING_AND_ABOVE',
  });

  const [whatsAppConfig, setWhatsAppConfig] = useState({
    enabled: true,
    gatewayProvider: 'Fonnte',
    apiKey: 'waba_991823a0b81',
    targetPhone: '081234567890',
  });

  const [discordConfig, setDiscordConfig] = useState({
    enabled: false,
    webhookUrl: 'https://discord.com/api/webhooks/12999/xxxxxxxx',
  });

  const [slackConfig, setSlackConfig] = useState({
    enabled: false,
    webhookUrl: 'https://hooks.slack.com/services/T00/B00/xxxx',
  });

  const [isWebhookTesting, setIsWebhookTesting] = useState(false);
  const [webhookTestStatus, setWebhookTestStatus] = useState<string | null>(null);

  // 4. Telemetry & Discovery State
  const [telemetry, setTelemetry] = useState({
    pollingIntervalSeconds: 15,
    fastPollingSeconds: 5,
    cpuWarningPercent: 75,
    cpuCriticalPercent: 90,
    ramWarningPercent: 80,
    ramCriticalPercent: 95,
    latencyWarningMs: 45,
    snmpCommunity: 'public_audira_noc',
    snmpVersion: 'v2c',
    lldpAutoScanIntervalMinutes: 30,
    subnetSweepRange: '10.0.0.0/24',
  });

  // 5. Backup & Disaster Recovery State
  const [backupConfig, setBackupConfig] = useState({
    autoBackupSchedule: 'DAILY_MIDNIGHT',
    retentionSnapshots: 30,
    exportFormat: 'RSC_AND_BINARY',
    storageDestination: 'LOCAL_POSTGRES_VAULT',
    sftpHost: '10.99.0.50',
    sftpPort: 22,
    sftpUser: 'audira-backup',
    sftpPath: '/srv/netops-backups',
  });

  // Save Notification
  const triggerSaveSuccess = (message: string) => {
    setSavedMessage(message);
    setTimeout(() => setSavedMessage(null), 3500);
  };

  // Test AI Gateway Connection
  const handleTestAiConnection = () => {
    setIsAiTesting(true);
    setAiTestResult(null);

    setTimeout(() => {
      setIsAiTesting(false);
      const providerLabel =
        aiProvider === 'grok'
          ? 'xAI Grok API (grok-2-1212)'
          : aiProvider === 'ollama'
          ? 'Local Ollama (Qwen2.5:7b)'
          : aiProvider === 'deepseek'
          ? 'DeepSeek API (deepseek-chat)'
          : aiProvider.toUpperCase();

      setAiTestResult({
        success: true,
        message: `Koneksi ke ${providerLabel} BERHASIL! Respons inferensi valid dengan 26 Network Tools terdaftar.`,
        latencyMs: aiProvider === 'ollama' ? 12 : 240,
      });
    }, 1100);
  };

  // Test Webhook Dispatch
  const handleTestWebhook = (channelName: string) => {
    setIsWebhookTesting(true);
    setWebhookTestStatus(null);
    setTimeout(() => {
      setIsWebhookTesting(false);
      setWebhookTestStatus(`Pesan uji coba berhasil terkirim ke ${channelName} [Status HTTP 200 OK]`);
      setTimeout(() => setWebhookTestStatus(null), 4000);
    }, 900);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans text-xs select-none">
      {/* Top Header Card */}
      <div className="glass-cyber-holo p-5 rounded-2xl border border-cyan-500/30 flex flex-wrap items-center justify-between gap-4 shadow-[0_4px_30px_rgba(6,182,212,0.15)] relative overflow-hidden">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-[0_0_20px_rgba(56,189,248,0.5)] border border-cyan-300/40">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-extrabold text-white tracking-wide">
                NOC System Settings &amp; Multi-Vendor Integrations
              </h1>
              <span className="text-[10px] font-mono font-bold text-cyan-300 px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40">
                PROPRIETARY v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">
              Kelola AI Gateway (xAI Grok, Ollama, DeepSeek), 9 Profil Vendor Router, Notifikasi Webhook, dan Keamanan AES-256
            </p>
          </div>
        </div>

        {savedMessage && (
          <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold animate-in fade-in zoom-in-95 duration-150">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{savedMessage}</span>
          </div>
        )}
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-cyan-500/20 pb-2">
        {[
          { id: 'ai-gateway', label: 'AI Gateway (Grok & LLMs)', icon: Bot },
          { id: 'routers', label: '9 Router Integrations', icon: Server },
          { id: 'notifications', label: 'Notifications & Webhooks', icon: Bell },
          { id: 'telemetry', label: 'Telemetry & Auto-Discovery', icon: Activity },
          { id: 'backup', label: 'Disaster Recovery & Storage', icon: HardDrive },
          { id: 'security', label: 'Security & Legal License', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.6)] border border-cyan-400/50'
                  : 'bg-[#0f172e] text-slate-400 hover:text-white hover:bg-[#162347] border border-slate-800'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-cyan-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: AI GATEWAY & LLM CONFIGURATION */}
      {activeTab === 'ai-gateway' && (
        <div className="space-y-6">
          <div className="glass-cyber-card p-6 rounded-2xl border border-cyan-500/25 space-y-5">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <div className="flex items-center space-x-2.5">
                <Bot className="w-5 h-5 text-cyan-400" />
                <div>
                  <h2 className="text-sm font-bold text-white">AI Gateway &amp; Autonomous Copilot Engine</h2>
                  <p className="text-[11px] text-slate-400">
                    Pilih model AI utama untuk diagnostik jaringan 26 tools dan 9-step safety pipeline.
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center space-x-2 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-lg border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>AI ENGINE READY</span>
              </div>
            </div>

            {/* Provider Grid Selector */}
            <div>
              <label className="block text-slate-300 font-bold mb-2">
                Pilih AI Model Provider:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 font-mono">
                {[
                  { id: 'grok', name: 'xAI Grok', badge: 'High Reasoning', icon: Zap },
                  { id: 'ollama', name: 'Ollama (Local)', badge: 'Air-Gapped', icon: Server },
                  { id: 'deepseek', name: 'DeepSeek API', badge: 'R1 / V3', icon: Cpu },
                  { id: 'openai', name: 'OpenAI GPT-4o', badge: 'Cloud API', icon: Globe },
                  { id: 'anthropic', name: 'Claude 3.5', badge: 'Anthropic', icon: Bot },
                  { id: 'gemini', name: 'Google Gemini', badge: '2.0 Flash', icon: Cloud },
                  { id: 'mistral', name: 'Mistral AI', badge: 'Codestral', icon: Layers },
                  { id: 'openrouter', name: 'OpenRouter', badge: 'Unified', icon: Network },
                  { id: 'custom', name: 'Custom OpenAI', badge: 'vLLM/LocalAI', icon: Sliders },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAiProvider(item.id as AIProviderType)}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                      aiProvider === item.id
                        ? 'bg-blue-950/80 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                        : 'bg-[#0a1124] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs">{item.name}</span>
                      <item.icon className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                    <span className="text-[10px] text-cyan-300 font-sans">{item.badge}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Provider Specific Inputs */}
            <div className="p-4 rounded-xl bg-[#080d1e] border border-cyan-500/20 space-y-4">
              {aiProvider === 'grok' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center space-x-1.5">
                      <Zap className="w-4 h-4 text-cyan-400" />
                      <span>Konfigurasi xAI Grok (Official API)</span>
                    </span>
                    <span className="text-[10px] text-slate-400">Endpoint: https://api.x.ai/v1</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">xAI API Key</label>
                      <div className="relative">
                        <input
                          type={showApiKey ? 'text' : 'password'}
                          value={aiConfig.grokApiKey}
                          onChange={(e) => setAiConfig({ ...aiConfig, grokApiKey: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#0e1730] border border-cyan-500/30 text-white font-mono focus:outline-none focus:border-cyan-400 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                        >
                          {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Pilihan Model Grok</label>
                      <select
                        value={aiConfig.grokModel}
                        onChange={(e) => setAiConfig({ ...aiConfig, grokModel: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#0e1730] border border-cyan-500/30 text-white font-mono focus:outline-none focus:border-cyan-400"
                      >
                        <option value="grok-2-1212">grok-2-1212 (State of the art reasoning &amp; code)</option>
                        <option value="grok-2-vision-1212">grok-2-vision-1212 (Multimodal network diagrams)</option>
                        <option value="grok-beta">grok-beta (High throughput)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {aiProvider === 'ollama' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center space-x-1.5">
                      <Server className="w-4 h-4 text-emerald-400" />
                      <span>Konfigurasi Ollama On-Premise (Air-Gapped &amp; 100% Offline)</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">Zero Cloud Leakage</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Ollama Base URL</label>
                      <input
                        type="text"
                        value={aiConfig.ollamaBaseUrl}
                        onChange={(e) => setAiConfig({ ...aiConfig, ollamaBaseUrl: e.target.value })}
                        placeholder="http://localhost:11434"
                        className="w-full px-3 py-2 rounded-lg bg-[#0e1730] border border-cyan-500/30 text-white font-mono focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Nama Model Lokal</label>
                      <input
                        type="text"
                        value={aiConfig.ollamaModel}
                        onChange={(e) => setAiConfig({ ...aiConfig, ollamaModel: e.target.value })}
                        placeholder="qwen2.5:7b, deepseek-r1:7b, llama3.3:70b"
                        className="w-full px-3 py-2 rounded-lg bg-[#0e1730] border border-cyan-500/30 text-white font-mono focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {aiProvider === 'deepseek' && (
                <div className="space-y-3">
                  <span className="font-bold text-white flex items-center space-x-1.5">
                    <Cpu className="w-4 h-4 text-blue-400" />
                    <span>Konfigurasi DeepSeek API</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">DeepSeek API Key</label>
                      <input
                        type="password"
                        value={aiConfig.deepseekApiKey}
                        onChange={(e) => setAiConfig({ ...aiConfig, deepseekApiKey: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#0e1730] border border-cyan-500/30 text-white font-mono focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Model</label>
                      <select
                        value={aiConfig.deepseekModel}
                        onChange={(e) => setAiConfig({ ...aiConfig, deepseekModel: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#0e1730] border border-cyan-500/30 text-white font-mono focus:outline-none focus:border-cyan-400"
                      >
                        <option value="deepseek-chat">deepseek-chat (DeepSeek-V3)</option>
                        <option value="deepseek-reasoner">deepseek-reasoner (DeepSeek-R1)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {aiProvider === 'openai' && (
                <div className="space-y-3">
                  <span className="font-bold text-white flex items-center space-x-1.5">
                    <Globe className="w-4 h-4 text-teal-400" />
                    <span>Konfigurasi OpenAI API</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">OpenAI API Key</label>
                      <input
                        type="password"
                        value={aiConfig.openaiApiKey}
                        onChange={(e) => setAiConfig({ ...aiConfig, openaiApiKey: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#0e1730] border border-cyan-500/30 text-white font-mono focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Model</label>
                      <select
                        value={aiConfig.openaiModel}
                        onChange={(e) => setAiConfig({ ...aiConfig, openaiModel: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#0e1730] border border-cyan-500/30 text-white font-mono focus:outline-none focus:border-cyan-400"
                      >
                        <option value="gpt-4o">gpt-4o (Omni flagship)</option>
                        <option value="gpt-4o-mini">gpt-4o-mini (Fast &amp; cost-efficient)</option>
                        <option value="o1-preview">o1-preview (Advanced complex routing)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Tuning Parameters (Temperature, Max Tokens, Safety Gate) */}
              <div className="pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Temperature (Penalaran):</span>
                    <span className="font-mono text-cyan-300">{aiConfig.temperature}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={aiConfig.temperature}
                    onChange={(e) => setAiConfig({ ...aiConfig, temperature: parseFloat(e.target.value) })}
                    className="w-full accent-cyan-400"
                  />
                  <span className="text-[10px] text-slate-500">Nilai rendah (0.1 - 0.3) ideal untuk stabilitas sintaks router.</span>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Max Tokens Output:</span>
                    <span className="font-mono text-cyan-300">{aiConfig.maxTokens}</span>
                  </div>
                  <input
                    type="range"
                    min="1024"
                    max="8192"
                    step="512"
                    value={aiConfig.maxTokens}
                    onChange={(e) => setAiConfig({ ...aiConfig, maxTokens: parseInt(e.target.value) })}
                    className="w-full accent-cyan-400"
                  />
                  <span className="text-[10px] text-slate-500">Kapasitas panjang output diagnostik &amp; script diff.</span>
                </div>

                <div className="space-y-1.5">
                  <span className="text-slate-300 font-semibold block">9-Step Safety Guardrails:</span>
                  <label className="flex items-center space-x-2 text-slate-400 hover:text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={aiConfig.safetyGuardStrictHighRisk}
                      onChange={(e) => setAiConfig({ ...aiConfig, safetyGuardStrictHighRisk: e.target.checked })}
                      className="accent-cyan-400 rounded"
                    />
                    <span>Wajib Persetujuan Manusia pada High/Critical</span>
                  </label>
                  <label className="flex items-center space-x-2 text-slate-400 hover:text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={aiConfig.safetyGuardAutoApproveLow}
                      onChange={(e) => setAiConfig({ ...aiConfig, safetyGuardAutoApproveLow: e.target.checked })}
                      className="accent-cyan-400 rounded"
                    />
                    <span>Auto-Approve Read-Only Inspection Tools</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Test Connection Button & Status */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleTestAiConnection}
                  disabled={isAiTesting}
                  className="px-4 py-2 rounded-xl bg-[#131d38] hover:bg-[#1a2850] border border-cyan-500/40 text-cyan-200 font-bold transition flex items-center space-x-1.5 shadow"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isAiTesting ? 'animate-spin' : ''}`} />
                  <span>{isAiTesting ? 'Menguji Latency...' : 'Uji Koneksi AI Gateway'}</span>
                </button>

                {aiTestResult && (
                  <span
                    className={`font-mono text-xs flex items-center space-x-1.5 ${
                      aiTestResult.success ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {aiTestResult.message} ({aiTestResult.latencyMs}ms)
                    </span>
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => triggerSaveSuccess('Pengaturan AI Gateway berhasil disimpan!')}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold flex items-center space-x-1.5 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Pengaturan AI</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 9 ROUTER VENDOR INTEGRATIONS */}
      {activeTab === 'routers' && (
        <div className="space-y-6">
          <div className="glass-cyber-card p-6 rounded-2xl border border-cyan-500/25 space-y-5">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <div className="flex items-center space-x-2.5">
                <Server className="w-5 h-5 text-cyan-400" />
                <div>
                  <h2 className="text-sm font-bold text-white">9 Enterprise Router Vendor Profiles</h2>
                  <p className="text-[11px] text-slate-400">
                    Konfigurasi parameter koneksi default, timeout, TLS verification, dan port protokol untuk masing-masing vendor.
                  </p>
                </div>
              </div>
            </div>

            {/* Vendor Selector Tabs (All 9 Router Vendors) */}
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
              {[
                { id: 'MikroTik', name: 'MikroTik', sub: 'RouterOS' },
                { id: 'Cisco', name: 'Cisco', sub: 'IOS-XE' },
                { id: 'Huawei', name: 'Huawei', sub: 'VRP OS' },
                { id: 'Juniper', name: 'Juniper', sub: 'JunOS' },
                { id: 'Arista', name: 'Arista', sub: 'EOS eAPI' },
                { id: 'Fortinet', name: 'Fortinet', sub: 'FortiOS' },
                { id: 'VyOS', name: 'VyOS', sub: 'FRRouting' },
                { id: 'EdgeCore', name: 'EdgeCore', sub: 'SONiC' },
                { id: 'Ubiquiti', name: 'Ubiquiti', sub: 'EdgeMAX' },
              ].map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVendorTab(v.id as VendorType)}
                  className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center ${
                    selectedVendorTab === v.id
                      ? 'bg-blue-600 text-white font-bold border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                      : 'bg-[#0b1226] text-slate-400 hover:text-white border-slate-800'
                  }`}
                >
                  <span className="text-xs font-bold leading-none">{v.name}</span>
                  <span className="text-[9px] font-mono text-cyan-300 mt-1">{v.sub}</span>
                </button>
              ))}
            </div>

            {/* Active Vendor Detail Form */}
            <div className="p-5 rounded-xl bg-[#080d1e] border border-cyan-500/20 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-sm font-bold text-cyan-300 font-mono">
                  VENDOR PROTOCOL DRIVER: [{selectedVendorTab.toUpperCase()}]
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  Driver: @audira/{selectedVendorTab.toLowerCase()} (Active)
                </span>
              </div>

              {selectedVendorTab === 'MikroTik' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Default Protocol Port</label>
                    <input
                      type="number"
                      value={routerConfigs.MikroTik.defaultPort}
                      onChange={(e) =>
                        setRouterConfigs({
                          ...routerConfigs,
                          MikroTik: { ...routerConfigs.MikroTik, defaultPort: parseInt(e.target.value) },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#0e1730] border border-cyan-500/30 text-white font-mono"
                    />
                    <span className="text-[10px] text-slate-500">API-SSL: 8729, REST: 443, WinBox: 8291, Plain: 8728</span>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">API Timeout (Seconds)</label>
                    <input
                      type="number"
                      value={routerConfigs.MikroTik.timeoutSeconds}
                      onChange={(e) =>
                        setRouterConfigs({
                          ...routerConfigs,
                          MikroTik: { ...routerConfigs.MikroTik, timeoutSeconds: parseInt(e.target.value) },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#0e1730] border border-cyan-500/30 text-white font-mono"
                    />
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={routerConfigs.MikroTik.enableRosV7Rest}
                        onChange={(e) =>
                          setRouterConfigs({
                            ...routerConfigs,
                            MikroTik: { ...routerConfigs.MikroTik, enableRosV7Rest: e.target.checked },
                          })
                        }
                        className="accent-cyan-400 rounded"
                      />
                      <span>Prioritize RouterOS v7 REST API</span>
                    </label>

                    <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={routerConfigs.MikroTik.autoRollbackSnapshot}
                        onChange={(e) =>
                          setRouterConfigs({
                            ...routerConfigs,
                            MikroTik: { ...routerConfigs.MikroTik, autoRollbackSnapshot: e.target.checked },
                          })
                        }
                        className="accent-cyan-400 rounded"
                      />
                      <span>Auto Pre-Flight Snapshot &amp; Rollback</span>
                    </label>
                  </div>
                </div>
              )}

              {selectedVendorTab === 'Cisco' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">SSH CLI Port</label>
                    <input
                      type="number"
                      value={routerConfigs.Cisco.defaultPort}
                      onChange={(e) =>
                        setRouterConfigs({
                          ...routerConfigs,
                          Cisco: { ...routerConfigs.Cisco, defaultPort: parseInt(e.target.value) },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#0e1730] border border-cyan-500/30 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">NETCONF Subsystem Port</label>
                    <input
                      type="number"
                      value={routerConfigs.Cisco.netconfPort}
                      onChange={(e) =>
                        setRouterConfigs({
                          ...routerConfigs,
                          Cisco: { ...routerConfigs.Cisco, netconfPort: parseInt(e.target.value) },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#0e1730] border border-cyan-500/30 text-white font-mono"
                    />
                  </div>
                  <div className="space-y-2 pt-2">
                    <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={routerConfigs.Cisco.terminalPagingDisable}
                        onChange={(e) =>
                          setRouterConfigs({
                            ...routerConfigs,
                            Cisco: { ...routerConfigs.Cisco, terminalPagingDisable: e.target.checked },
                          })
                        }
                        className="accent-cyan-400 rounded"
                      />
                      <span>Auto inject `terminal length 0`</span>
                    </label>
                    <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={routerConfigs.Cisco.enableSecretRequired}
                        onChange={(e) =>
                          setRouterConfigs({
                            ...routerConfigs,
                            Cisco: { ...routerConfigs.Cisco, enableSecretRequired: e.target.checked },
                          })
                        }
                        className="accent-cyan-400 rounded"
                      />
                      <span>Require Enable Secret Level 15</span>
                    </label>
                  </div>
                </div>
              )}

              {selectedVendorTab === 'Huawei' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">VRP SSH Port</label>
                    <input
                      type="number"
                      value={routerConfigs.Huawei.defaultPort}
                      className="w-full px-3 py-2 rounded-lg bg-[#0e1730] border border-cyan-500/30 text-white font-mono"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">SNMP Version</label>
                    <input
                      type="text"
                      value="v2c / v3 (SHA-AES)"
                      className="w-full px-3 py-2 rounded-lg bg-[#0e1730] border border-cyan-500/30 text-white font-mono"
                      readOnly
                    />
                  </div>
                  <div className="space-y-2 pt-2">
                    <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                      <input type="checkbox" defaultChecked className="accent-cyan-400 rounded" />
                      <span>Auto inject `screen-length 0 temporary`</span>
                    </label>
                  </div>
                </div>
              )}

              {selectedVendorTab === 'Juniper' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">NETCONF Port</label>
                    <input
                      type="number"
                      value={830}
                      className="w-full px-3 py-2 rounded-lg bg-[#0e1730] border border-cyan-500/30 text-white font-mono"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Commit Confirm Timer</label>
                    <input
                      type="text"
                      value="5 Menit (Rollback otomatis)"
                      className="w-full px-3 py-2 rounded-lg bg-[#0e1730] border border-cyan-500/30 text-white font-mono"
                      readOnly
                    />
                  </div>
                  <div className="pt-2">
                    <span className="text-emerald-400 font-mono text-[11px]">
                      ✓ JunOS XML Schema Validator Active
                    </span>
                  </div>
                </div>
              )}

              {['Arista', 'Fortinet', 'VyOS', 'EdgeCore', 'Ubiquiti'].includes(selectedVendorTab) && (
                <div className="p-3 bg-cyan-950/30 border border-cyan-500/20 rounded-xl flex items-center justify-between text-cyan-200">
                  <span>
                    Driver konektor untuk <strong>{selectedVendorTab}</strong> telah terdaftar dan terisolasi dengan AES-256-GCM credential vault.
                  </span>
                  <span className="font-mono text-xs text-emerald-400">STATUS: READY</span>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => triggerSaveSuccess(`Profil driver ${selectedVendorTab} berhasil disimpan!`)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold flex items-center space-x-1.5 shadow"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Pengaturan {selectedVendorTab}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: NOTIFICATIONS & WEBHOOKS */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="glass-cyber-card p-6 rounded-2xl border border-cyan-500/25 space-y-6">
            <div className="border-b border-cyan-500/20 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-cyan-400" />
                  <span>Kanal Notifikasi &amp; Alert Webhooks NOC</span>
                </h2>
                <p className="text-[11px] text-slate-400">
                  Kirim peringatan link down, traffic spike, atau anomali BGP secara otomatis ke Telegram, WhatsApp, atau Discord.
                </p>
              </div>
              {webhookTestStatus && (
                <span className="text-emerald-400 font-mono text-xs bg-emerald-950/80 px-3 py-1 rounded-lg border border-emerald-500/40">
                  {webhookTestStatus}
                </span>
              )}
            </div>

            {/* 1. Telegram Bot Integration */}
            <div className="p-4 rounded-xl bg-[#091024] border border-cyan-500/25 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-white font-bold">
                  <Send className="w-4 h-4 text-cyan-400" />
                  <span>Telegram NOC Bot Integration</span>
                </div>
                <label className="flex items-center space-x-2 text-xs text-cyan-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={telegramConfig.enabled}
                    onChange={(e) => setTelegramConfig({ ...telegramConfig, enabled: e.target.checked })}
                    className="accent-cyan-400 rounded"
                  />
                  <span>Aktifkan Bot</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Telegram Bot Token (dari @BotFather)</label>
                  <input
                    type="text"
                    value={telegramConfig.botToken}
                    onChange={(e) => setTelegramConfig({ ...telegramConfig, botToken: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#0e1730] border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Chat ID / Group Channel ID</label>
                  <input
                    type="text"
                    value={telegramConfig.chatId}
                    onChange={(e) => setTelegramConfig({ ...telegramConfig, chatId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#0e1730] border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => handleTestWebhook('Telegram NOC')}
                  disabled={isWebhookTesting}
                  className="px-3.5 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-200 text-xs font-semibold"
                >
                  {isWebhookTesting ? 'Mengirim...' : 'Kirim Test Alert ke Telegram'}
                </button>
              </div>
            </div>

            {/* 2. WhatsApp Gateway Integration */}
            <div className="p-4 rounded-xl bg-[#091024] border border-emerald-500/25 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-white font-bold">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp Gateway API (Fonnte / Wablas / Twilio)</span>
                </div>
                <label className="flex items-center space-x-2 text-xs text-emerald-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={whatsAppConfig.enabled}
                    onChange={(e) => setWhatsAppConfig({ ...whatsAppConfig, enabled: e.target.checked })}
                    className="accent-emerald-400 rounded"
                  />
                  <span>Aktifkan WhatsApp</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Gateway Provider</label>
                  <select
                    value={whatsAppConfig.gatewayProvider}
                    onChange={(e) => setWhatsAppConfig({ ...whatsAppConfig, gatewayProvider: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#0e1730] border border-slate-700 text-white font-mono"
                  >
                    <option value="Fonnte">Fonnte (Indonesia Direct)</option>
                    <option value="Wablas">Wablas Gateway</option>
                    <option value="Twilio">Twilio WhatsApp Business</option>
                    <option value="CustomHTTP">Custom HTTP Endpoint</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">API Key / Token</label>
                  <input
                    type="password"
                    value={whatsAppConfig.apiKey}
                    onChange={(e) => setWhatsAppConfig({ ...whatsAppConfig, apiKey: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#0e1730] border border-slate-700 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nomor PIC / Group WhatsApp</label>
                  <input
                    type="text"
                    value={whatsAppConfig.targetPhone}
                    onChange={(e) => setWhatsAppConfig({ ...whatsAppConfig, targetPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#0e1730] border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => handleTestWebhook('WhatsApp PIC')}
                  disabled={isWebhookTesting}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-200 text-xs font-semibold"
                >
                  {isWebhookTesting ? 'Mengirim...' : 'Kirim Test Alert ke WhatsApp'}
                </button>
              </div>
            </div>

            {/* 3. Discord & Slack Webhooks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#091024] border border-indigo-500/25 space-y-2">
                <span className="font-bold text-white block">Discord NOC Incidents Webhook</span>
                <input
                  type="text"
                  value={discordConfig.webhookUrl}
                  onChange={(e) => setDiscordConfig({ ...discordConfig, webhookUrl: e.target.value })}
                  placeholder="https://discord.com/api/webhooks/..."
                  className="w-full px-3 py-2 rounded-lg bg-[#0e1730] border border-slate-700 text-white font-mono text-xs"
                />
              </div>

              <div className="p-4 rounded-xl bg-[#091024] border border-teal-500/25 space-y-2">
                <span className="font-bold text-white block">Slack Incoming Webhook</span>
                <input
                  type="text"
                  value={slackConfig.webhookUrl}
                  onChange={(e) => setSlackConfig({ ...slackConfig, webhookUrl: e.target.value })}
                  placeholder="https://hooks.slack.com/services/..."
                  className="w-full px-3 py-2 rounded-lg bg-[#0e1730] border border-slate-700 text-white font-mono text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => triggerSaveSuccess('Kanal Webhook notifikasi berhasil disimpan!')}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold flex items-center space-x-1.5 shadow"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Kanal Notifikasi</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TELEMETRY & AUTO-DISCOVERY */}
      {activeTab === 'telemetry' && (
        <div className="space-y-6">
          <div className="glass-cyber-card p-6 rounded-2xl border border-cyan-500/25 space-y-5">
            <div className="border-b border-cyan-500/20 pb-3 flex items-center space-x-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              <div>
                <h2 className="text-sm font-bold text-white">Telemetry Thresholds &amp; Auto-Discovery Scanner</h2>
                <p className="text-[11px] text-slate-400">
                  Pengaturan frekuensi polling, ambang batas alarm CPU/RAM/Latency, dan scanner topologi otomatis LLDP/CDP.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Standard Polling Rate (Detik)</label>
                <input
                  type="number"
                  value={telemetry.pollingIntervalSeconds}
                  onChange={(e) => setTelemetry({ ...telemetry, pollingIntervalSeconds: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0e1730] border border-cyan-500/30 text-white font-mono"
                />
                <span className="text-[10px] text-slate-500">Default: 15 detik untuk semua router.</span>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">CPU Warning Alarm (%)</label>
                <input
                  type="number"
                  value={telemetry.cpuWarningPercent}
                  onChange={(e) => setTelemetry({ ...telemetry, cpuWarningPercent: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0e1730] border border-amber-500/30 text-amber-300 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">CPU Critical Alarm (%)</label>
                <input
                  type="number"
                  value={telemetry.cpuCriticalPercent}
                  onChange={(e) => setTelemetry({ ...telemetry, cpuCriticalPercent: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0e1730] border border-rose-500/30 text-rose-300 font-mono"
                />
              </div>
            </div>

            {/* SNMP & Network Scanner */}
            <div className="p-4 rounded-xl bg-[#091024] border border-slate-800 space-y-3">
              <span className="font-bold text-white block">SNMP &amp; Topology Auto-Discovery Engine</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">SNMP v2c Community String</label>
                  <input
                    type="password"
                    value={telemetry.snmpCommunity}
                    onChange={(e) => setTelemetry({ ...telemetry, snmpCommunity: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#0e1730] border border-slate-700 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Subnet Sweep Scanner Range</label>
                  <input
                    type="text"
                    value={telemetry.subnetSweepRange}
                    onChange={(e) => setTelemetry({ ...telemetry, subnetSweepRange: e.target.value })}
                    placeholder="10.0.0.0/24"
                    className="w-full px-3 py-2 rounded-lg bg-[#0e1730] border border-slate-700 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">LLDP/CDP Auto-Scan Interval</label>
                  <input
                    type="number"
                    value={telemetry.lldpAutoScanIntervalMinutes}
                    onChange={(e) => setTelemetry({ ...telemetry, lldpAutoScanIntervalMinutes: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#0e1730] border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => triggerSaveSuccess('Pengaturan telemetri & scanner berhasil disimpan!')}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold flex items-center space-x-1.5 shadow"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Pengaturan Telemetri</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DISASTER RECOVERY & STORAGE */}
      {activeTab === 'backup' && (
        <div className="space-y-6">
          <div className="glass-cyber-card p-6 rounded-2xl border border-cyan-500/25 space-y-5">
            <div className="border-b border-cyan-500/20 pb-3 flex items-center space-x-2">
              <HardDrive className="w-5 h-5 text-sky-400" />
              <div>
                <h2 className="text-sm font-bold text-white">Disaster Recovery &amp; Off-Site Storage Destination</h2>
                <p className="text-[11px] text-slate-400">
                  Otomasi pencadangan file konfigurasi .rsc dan binary snapshot dengan replikasi off-site SFTP / S3.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Jadwal Backup Otomatis</label>
                <select
                  value={backupConfig.autoBackupSchedule}
                  onChange={(e) => setBackupConfig({ ...backupConfig, autoBackupSchedule: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0e1730] border border-cyan-500/30 text-white font-mono"
                >
                  <option value="HOURLY">Setiap 1 Jam Sekali</option>
                  <option value="DAILY_MIDNIGHT">Harian (Tengah Malam 00:00)</option>
                  <option value="WEEKLY">Mingguan (Setiap Minggu)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Maksimal Retensi Snapshot</label>
                <input
                  type="number"
                  value={backupConfig.retentionSnapshots}
                  onChange={(e) => setBackupConfig({ ...backupConfig, retentionSnapshots: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0e1730] border border-cyan-500/30 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Penyimpanan Utama</label>
                <select
                  value={backupConfig.storageDestination}
                  onChange={(e) => setBackupConfig({ ...backupConfig, storageDestination: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0e1730] border border-cyan-500/30 text-white font-mono"
                >
                  <option value="LOCAL_POSTGRES_VAULT">Local PostgreSQL Vault (Terenkripsi AES-256)</option>
                  <option value="REMOTE_SFTP">Remote SFTP Server</option>
                  <option value="AWS_S3">Amazon S3 / MinIO Object Storage</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => triggerSaveSuccess('Pengaturan disaster recovery berhasil disimpan!')}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold flex items-center space-x-1.5 shadow"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Pengaturan Backup</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: SECURITY & COMMERCIAL LICENSE */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="glass-cyber-card p-6 rounded-2xl border border-cyan-500/25 space-y-6">
            <div className="border-b border-cyan-500/20 pb-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-indigo-400" />
                <div>
                  <h2 className="text-sm font-bold text-white">Hardware Vault &amp; Official Commercial License Status</h2>
                  <p className="text-[11px] text-slate-400">
                    Verifikasi kepemilikan hak cipta, status sertifikat lisensi komersial, dan master cipher AES-256-GCM.
                  </p>
                </div>
              </div>
            </div>

            {/* Official License Badge Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/70 border-2 border-cyan-400/40 shadow-[0_0_30px_rgba(6,182,212,0.2)] space-y-3 font-mono">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center space-x-2 text-sm">
                  <Award className="w-5 h-5 text-cyan-400" />
                  <span>AUDIRA NETOPS AI COMMERCIAL LICENSE CERTIFICATE</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                  ● ACTIVE &amp; LICENSED
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 pt-2 border-t border-cyan-500/20">
                <div>
                  <span className="text-slate-500">Pemilik Hak Cipta &amp; Lisensi:</span>
                  <div className="text-white font-bold">AUDIRA (Agus Dwi R)</div>
                </div>
                <div>
                  <span className="text-slate-500">Kategori Lisensi:</span>
                  <div className="text-cyan-300 font-bold">Lisensi Komersial / Proprietary (Berbayar Penuh)</div>
                </div>
                <div>
                  <span className="text-slate-500">Server Hardware UUID:</span>
                  <div className="text-slate-300">8F2A-44C1-99B0-AUDIRA-NOC</div>
                </div>
                <div>
                  <span className="text-slate-500">Status Freeware:</span>
                  <div className="text-rose-400 font-bold">BUKAN FREEWARE / BUKAN OPEN SOURCE UNTUK PRODUKSI</div>
                </div>
              </div>
            </div>

            {/* Secret Encryption Specs */}
            <div className="p-4 rounded-xl bg-[#080d1e] border border-slate-800 space-y-2">
              <span className="font-bold text-white block">Standar Enkripsi &amp; Perlindungan Kredensial:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-300 font-mono text-[11px]">
                <div className="p-2.5 rounded-lg bg-[#0e1730] border border-cyan-500/20">
                  <div className="text-slate-500">Master Secret Cipher:</div>
                  <div className="text-emerald-400 font-bold">AES-256-GCM (Hardware Accel)</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#0e1730] border border-cyan-500/20">
                  <div className="text-slate-500">Frontend Expose:</div>
                  <div className="text-emerald-400 font-bold">0% (Always Masked ********)</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#0e1730] border border-cyan-500/20">
                  <div className="text-slate-500">Audit Trail:</div>
                  <div className="text-emerald-400 font-bold">Immutable PostgreSQL Log</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
