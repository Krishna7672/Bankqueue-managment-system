/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sbi: {
          navy: '#292075',       // Official SBI Neon Navy / Deep Indigo
          deep: '#1A1450',       // Darker tone for headers/accents
          blue: '#1B1464',       // Classic SBI Blue
          cerulean: '#00B5EF',   // Official SBI Vivid Cerulean / Cyan Keyhole Blue
          sky: '#38BDF8',        // Accent sky
          gold: '#F8A51D',       // Official SBI Accent Gold / Yellow
          amber: '#F59E0B',
          light: '#E6F8FE',      // Tint of SBI Cerulean for active items
          surface: '#F8FAFC',
        },
        navy: {
          950: '#140F3E',
          900: '#1B1464',
          800: '#292075',
          700: '#342994',
          600: '#00B5EF',
          100: '#E0F2FE',
          50: '#F0F9FF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
