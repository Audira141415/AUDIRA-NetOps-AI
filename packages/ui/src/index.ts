// AUDIRA NetOps UI Tokens and Constants

export type NocTheme = 'studio-dark' | 'cyber-hologram' | 'obsidian-blue' | 'matrix-green';

export interface NocThemeMeta {
  name: string;
  tagline: string;
  previewBg: string;
  previewBorder: string;
  previewDot: string;
  primaryColor: string;
}

export const NOC_THEMES: Record<NocTheme, NocThemeMeta> = {
  'studio-dark': {
    name: 'Studio Dark Precision',
    tagline: 'Minimalis, Presisi Tinggi & Border Hairline',
    previewBg: '#09090b',
    previewBorder: '#27272a',
    previewDot: '#10b981',
    primaryColor: '#38bdf8',
  },
  'cyber-hologram': {
    name: 'Holographic Cyber NOC',
    tagline: 'Futuristik, Neon Cyan Aurora & Fuchsia',
    previewBg: '#0a051b',
    previewBorder: 'rgba(168, 85, 247, 0.4)',
    previewDot: '#2dd4bf',
    primaryColor: '#ec4899',
  },
  'obsidian-blue': {
    name: 'Obsidian Blue NOC',
    tagline: 'Kontras Tinggi Video-Wall Datadog Style',
    previewBg: '#070c18',
    previewBorder: 'rgba(56, 189, 248, 0.4)',
    previewDot: '#38bdf8',
    primaryColor: '#3b82f6',
  },
  'matrix-green': {
    name: 'Matrix Phosphor Green',
    tagline: 'Retro-Hacker VT100 / PuTTY Emerald',
    previewBg: '#050d08',
    previewBorder: 'rgba(34, 197, 94, 0.4)',
    previewDot: '#22c55e',
    primaryColor: '#4ade80',
  },
};

export const NOC_THEME = {
  colors: {
    bgDark: '#0B0F17',
    bgCard: '#111827',
    bgCardHover: '#1F2937',
    border: '#1E293B',
    borderLight: '#334155',
    accentCyan: '#06B6D4',
    accentEmerald: '#10B981',
    accentAmber: '#F59E0B',
    accentRose: '#F43F5E',
    accentViolet: '#8B5CF6',
  },
  typography: {
    fontSans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontMono: '"JetBrains Mono", Menlo, Monaco, Consolas, "Courier New", monospace',
  },
};

export const STATUS_COLORS = {
  ONLINE: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-500',
  },
  WARNING: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    dot: 'bg-amber-500',
  },
  OFFLINE: {
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
    dot: 'bg-rose-500',
  },
  UNREACHABLE: {
    bg: 'bg-zinc-500/10',
    text: 'text-zinc-400',
    border: 'border-zinc-500/30',
    dot: 'bg-zinc-500',
  },
};

export const RISK_COLORS = {
  LOW: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  MEDIUM: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  HIGH: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  CRITICAL: 'bg-rose-500/20 text-rose-400 border-rose-500/50 animate-pulse',
};
