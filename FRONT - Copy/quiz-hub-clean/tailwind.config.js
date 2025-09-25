/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Keeping your ultra modern dark palette
        dark: {
          900: '#0a0a0f',    // Deepest background
          800: '#0f0f1a',    // Main background  
          700: '#1a1a2e',    // Surface
          600: '#16213e',    // Card background
          500: '#1e293b',    // Elevated surface
          400: '#334155',    // Border/divider
          300: '#64748b',    // Muted text
          200: '#94a3b8',    // Secondary text
          100: '#e2e8f0',    // Primary text
        },
        // QuizHub brand colors - matching your current design
        primary: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',       // Main yellow
          500: '#f59e0b',       // Darker yellow
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Accent colors for modern UI
        accent: {
          primary: '#fbbf24',    // Yellow (matching your design)
          secondary: '#8b5cf6',  // Violet  
          tertiary: '#06b6d4',   // Cyan
          success: '#10b981',    // Emerald
          warning: '#f59e0b',    // Amber
          error: '#ef4444',      // Red
        },
        // Neon/glow colors
        neon: {
          yellow: '#fbbf24',      // Your yellow
          blue: '#00d4ff',
          purple: '#a855f7',
          pink: '#ec4899',
          green: '#00ff88',
        },
        // QuizHub specific grays (matching your current components)
        quiz: {
          bg: '#111827',          // gray-900 equivalent
          surface: '#1f2937',    // gray-800 equivalent
          border: '#374151',      // gray-700 equivalent
          text: {
            primary: '#ffffff',    // white
            secondary: '#d1d5db', // gray-300
            muted: '#9ca3af',      // gray-400
          }
        }
      },
      backgroundImage: {
        // ✅ NOVI UZORAK: Ponavljajuće žute tačke (glume upitnike)
        'question-marks': "radial-gradient(#fbbf24 1px, transparent 1px)",
        
        // QuizHub gradients
        'gradient-primary': 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
        'gradient-card': 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
        // Keep your modern gradients
        'gradient-mesh': 'radial-gradient(circle at 25% 25%, #fbbf24 0%, transparent 50%), radial-gradient(circle at 75% 75%, #f59e0b 0%, transparent 50%)',
        'gradient-aurora': 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
        // QuizHub hero background
        'quiz-hero': 'linear-gradient(135deg, #111827 0%, #1f2937 50%, #111827 100%)',
      },
      
      // ✅ NOVO: background size za ponavljanje
      backgroundSize: {
          'size-40': '40px 40px', 
      },
      
      // ✅ NOVO: background repeat klasa
      backgroundRepeat: {
          'repeat': 'repeat',
      },

      boxShadow: {
        // QuizHub specific shadows
        'yellow-glow': '0 0 20px rgba(251, 191, 36, 0.3)',
        'yellow-glow-lg': '0 0 40px rgba(251, 191, 36, 0.4)',
        'quiz-card': '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
        'quiz-card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(251, 191, 36, 0.2)',
        
        // Keep your enhanced glows and shadows
        'glow-sm': '0 0 10px rgba(99, 102, 241, 0.3)',
        'glow': '0 0 20px rgba(99, 102, 241, 0.4)',
        'glow-lg': '0 0 40px rgba(99, 102, 241, 0.5)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.4)',
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.4)',
        'glow-pink': '0 0 20px rgba(236, 72, 153, 0.4)',
        
        // Modern card shadows
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
        'yellow-glow-pulse': 'yellowGlowPulse 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'quiz-bounce': 'quizBounce 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glowPulse: {
          '0%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)' },
          '100%': { boxShadow: '0 0 40px rgba(99, 102, 241, 0.8)' },
        },
        yellowGlowPulse: {
          '0%': { boxShadow: '0 0 20px rgba(251, 191, 36, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(251, 191, 36, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        quizBounce: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      }
    },
  },
  plugins: [],
}