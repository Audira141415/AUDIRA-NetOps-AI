/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          canvas: '#000000',
          bg: '#09090b',
          panel: '#101014',
          surface: '#18181b',
          surfaceHover: '#222226',
          border: '#27272a',
          borderSubtle: '#1f1f23',
          borderActive: '#3f3f46',
          muted: '#71717a',
          text: '#f4f4f5',
          secondary: '#a1a1aa',
        },
        noc: {
          bg: '#09090b',
          panel: '#101014',
          surface: '#18181b',
          border: '#27272a',
          borderHover: '#3f3f46',
          cyan: '#38bdf8',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#ef4444',
          violet: '#8b5cf6',
          indigo: '#6366f1',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"SF Mono"', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'studio-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.4)',
        'studio-card': '0 1px 3px 0 rgba(0, 0, 0, 0.5), 0 1px 2px -1px rgba(0, 0, 0, 0.5)',
        'studio-elevated': '0 10px 30px -5px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(255, 255, 255, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.15s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(2px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      }
    },
  },
  plugins: [],
}
