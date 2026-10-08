/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        nexus: {
          950: '#070A12',
          900: '#0B0F19',
          850: '#0F1626',
          800: '#141D32',
          750: '#1A2540',
          700: '#233254',
          600: '#344772',
          500: '#4D68A2',
          400: '#6C89C7',
          300: '#9AB1E2',
          200: '#CCD8F3',
          100: '#E8EFFC',
          50: '#F4F7FD'
        },
        cyanGlow: '#00D2FF',
        amberAlert: '#F59E0B',
        crimsonThreat: '#EF4444',
        emeraldClear: '#10B981'
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Menlo', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
