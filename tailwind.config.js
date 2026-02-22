/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Mobile-first approach - no custom screens needed, use defaults
  // sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      // Mobile-first responsive font sizes
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.8125rem', { lineHeight: '1.125rem' }],
        'base': ['0.875rem', { lineHeight: '1.25rem' }],
        'lg': ['1rem', { lineHeight: '1.5rem' }],
        'xl': ['1.125rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.25rem', { lineHeight: '2rem' }],
        '3xl': ['1.5rem', { lineHeight: '2.25rem' }],
        '4xl': ['1.875rem', { lineHeight: '2.5rem' }],
        '5xl': ['2.25rem', { lineHeight: '1' }],
        '6xl': ['3rem', { lineHeight: '1' }],
        '7xl': ['3.75rem', { lineHeight: '1' }],
        '8xl': ['4.5rem', { lineHeight: '1' }],
        '9xl': ['6rem', { lineHeight: '1' }],
        // Responsive heading sizes for mobile
        'mobile-xs': ['0.6875rem', { lineHeight: '1rem' }],
        'mobile-sm': ['0.75rem', { lineHeight: '1.125rem' }],
        'mobile-base': ['0.8125rem', { lineHeight: '1.25rem' }],
        'mobile-lg': ['0.875rem', { lineHeight: '1.5rem' }],
        'mobile-xl': ['1rem', { lineHeight: '1.5rem' }],
        'mobile-2xl': ['1.125rem', { lineHeight: '1.75rem' }],
        'mobile-3xl': ['1.25rem', { lineHeight: '1.75rem' }],
        'mobile-4xl': ['1.5rem', { lineHeight: '2rem' }],
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      // Mobile-optimized spacing
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
        'touch': '44px', // iOS minimum touch target
      },
      // Responsive max widths for containers
      maxWidth: {
        'mobile': '100%',
        'tablet': '768px',
        'desktop': '1024px',
        'wide': '1280px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-bottom': 'slideInBottom 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInBottom: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      // Responsive breakpoints for container queries
      containers: {
        'mobile': '320px',
        'tablet': '768px',
        'desktop': '1024px',
      },
    },
  },
  plugins: [],
}