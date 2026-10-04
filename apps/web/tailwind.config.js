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
        holo: {
          bg: '#0A051B',          // Deep obsidian violet
          canvas: '#0E0725',      // Canvas deep violet
          panel: '#150B33',       // Hologram glass panel
          surface: '#1E1045',     // Glass surface
          elevated: '#28155A',    // Elevated card
          border: 'rgba(192, 132, 252, 0.22)',
          borderGlow: 'rgba(236, 72, 153, 0.4)',
          violet: '#A855F7',
          fuchsia: '#EC4899',
          aurora: '#2DD4BF',
          gold: '#FBBF24',
          platinum: '#F1F5F9',
        },
        noc: {
          bg: '#0A051B',
          panel: '#140A2E',
          surface: '#1E1045',
          border: 'rgba(192, 132, 252, 0.2)',
          borderHover: 'rgba(236, 72, 153, 0.45)',
          cyan: '#2DD4BF',        // Holographic Aurora
          emerald: '#34D399',     // Holographic Mint
          amber: '#FBBF24',      // Holographic Gold
          rose: '#F43F5E',       // Holographic Fuchsia Rose
          violet: '#C084FC',     // Radiant Amethyst
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'holo-card': '0 8px 32px 0 rgba(112, 26, 117, 0.25), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        'holo-glow': '0 0 25px 2px rgba(168, 85, 247, 0.35)',
        'holo-fuchsia': '0 0 25px 2px rgba(236, 72, 153, 0.35)',
        'holo-aurora': '0 0 25px 2px rgba(45, 212, 191, 0.35)',
      },
      animation: {
        'holo-pulse': 'holoPulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'holo-shimmer': 'holoShimmer 6s linear infinite',
      },
      keyframes: {
        holoPulse: {
          '0%, 100%': { opacity: 1, filter: 'drop-shadow(0 0 15px rgba(168,85,247,0.6))' },
          '50%': { opacity: 0.85, filter: 'drop-shadow(0 0 25px rgba(236,72,153,0.7))' },
        },
        holoShimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        }
      }
    },
  },
  plugins: [],
}
