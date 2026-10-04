// System Settings Component (AI Provider, Telemetry, RBAC, Credentials)

import React, { useState } from 'react';
import {
  Settings,
  Bot,
  Activity,
  Shield,
  Bell,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { AIProviderType } from '@audira/types';

export const SettingsView: React.FC = () => {
  const [provider, setProvider] = useState<AIProviderType>('ollama');
  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434');
  const [ollamaModel, setOllamaModel] = useState('qwen2.5:7b');
  const [pollingInterval, setPollingInterval] = useState(15);
  const [cpuWarning, setCpuWarning] = useState(75);
  const [cpuCritical, setCpuCritical] = useState(90);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-4 space-y-4 max-w-4xl font-mono text-xs">
      <div className="bg-noc-panel border border-noc-border rounded-lg p-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Settings className="w-5 h-5 text-cyan-400" />
          <div>
            <h1 className="text-sm font-semibold text-white font-sans">NOC System Settings</h1>
            <p className="text-slate-400">Configure AI Providers, Telemetry polling rates, and Security thresholds</p>
          </div>
        </div>

        {saved && (
          <span className="flex items-center space-x-1 text-emerald-400 text-xs">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* AI Gateway Configuration */}
        <div className="bg-noc-panel border border-noc-border rounded-lg p-4 space-y-3">
          <div className="flex items-center space-x-2 text-white font-semibold font-sans">
            <Bot className="w-4 h-4 text-cyan-400" />
            <span>AI Gateway &amp; Copilot Engine</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">AI Provider</label>
              <select
                value={provider}
                onChange={e => setProvider(e.target.value as AIProviderType)}
                className="w-full bg-noc-surface border border-noc-border rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="ollama">Local LLM via Ollama (Recommended)</option>
                <option value="openai">OpenAI (GPT-4o)</option>
                <option value="anthropic">Anthropic (Claude 3.5 Sonnet)</option>
                <option value="gemini">Google Gemini (Gemini 2.0 Flash)</option>
                <option value="custom">Custom OpenAI-Compatible Endpoint</option>
              </select>
            </div>

            {provider === 'ollama' && (
              <>
                <div>
                  <label className="text-slate-400 block mb-1">Ollama Base URL</label>
                  <input
                    type="text"
                    value={ollamaUrl}
                    onChange={e => setOllamaUrl(e.target.value)}
                    className="w-full bg-noc-surface border border-noc-border rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Ollama Model</label>
                  <input
                    type="text"
                    value={ollamaModel}
                    onChange={e => setOllamaModel(e.target.value)}
                    className="w-full bg-noc-surface border border-noc-border rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Telemetry Polling Intervals */}
        <div className="bg-noc-panel border border-noc-border rounded-lg p-4 space-y-3">
          <div className="flex items-center space-x-2 text-white font-semibold font-sans">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Telemetry &amp; Polling Intervals</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Default Polling (Seconds)</label>
              <input
                type="number"
                value={pollingInterval}
                onChange={e => setPollingInterval(Number(e.target.value))}
                className="w-full bg-noc-surface border border-noc-border rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">CPU Warning (%)</label>
              <input
                type="number"
                value={cpuWarning}
                onChange={e => setCpuWarning(Number(e.target.value))}
                className="w-full bg-noc-surface border border-noc-border rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">CPU Critical (%)</label>
              <input
                type="number"
                value={cpuCritical}
                onChange={e => setCpuCritical(Number(e.target.value))}
                className="w-full bg-noc-surface border border-noc-border rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Security & Credentials */}
        <div className="bg-noc-panel border border-noc-border rounded-lg p-4 space-y-3">
          <div className="flex items-center space-x-2 text-white font-semibold font-sans">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Security &amp; Secret Encryption</span>
          </div>

          <div className="text-slate-400 space-y-1 text-xs">
            <div>Secret Cipher: <span className="text-emerald-400">AES-256-GCM (Hardware Accelerated)</span></div>
            <div>Credentials Storage: <span className="text-emerald-400">Encrypted in PostgreSQL / Never Sent to Frontend</span></div>
            <div>Risk Analysis Engine: <span className="text-emerald-400">Active · CRITICAL Auto-Execution Forbidden</span></div>
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center space-x-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-semibold shadow glow-cyan transition"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </form>
    </div>
  );
};
