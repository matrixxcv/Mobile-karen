import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#030711',
        surface: '#0A1120',
        surface2: '#0E1830',
        line: 'rgba(203,213,225,0.10)',
        blue: {
          DEFAULT: '#2563FF',
          deep: '#0F2E99',
          soft: '#4C7FFF'
        },
        sky: {
          DEFAULT: '#38BDF8',
          dim: '#0EA5C7'
        },
        silver: {
          DEFAULT: '#CBD5E1',
          bright: '#F1F5F9',
          dim: '#8593A8'
        }
      },
      fontFamily: {
        display: ['Vazirmatn', 'sans-serif'],
        body: ['Vazirmatn', 'sans-serif']
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(56,189,248,0.45)',
        'glow-blue': '0 0 60px -10px rgba(37,99,255,0.55)'
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(203,213,225,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(203,213,225,0.06) 1px, transparent 1px)'
      },
      keyframes: {
        pulseglow: {
          '0%,100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' }
        },
        driftgrid: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '48px 48px' }
        },
        rise: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        pulseglow: 'pulseglow 5s ease-in-out infinite',
        driftgrid: 'driftgrid 6s linear infinite',
        rise: 'rise 0.6s cubic-bezier(0.16,1,0.3,1) both'
      }
    }
  },
  plugins: []
} satisfies Config
