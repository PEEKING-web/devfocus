/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Updated to LeetCode Green palette
        primary: {
          50: '#e6fff2',
          100: '#ccffea',
          200: '#99ffd5',
          300: '#66ffbf',
          400: '#33ffaa',
          500: '#00ff88', // Brand Green
          600: '#00cc6a',
          700: '#009950',
          800: '#006635',
          900: '#00331b',
        },
        // Standard LeetCode dark backgrounds
        dark: {
          bg: '#0a0a0a',
          card: '#1a1a1a',
          border: '#333333',
        },
        success: {
          500: '#00ff88',
          600: '#00cc6a',
        },
        warning: {
          500: '#ffa116', // LeetCode warning orange
          600: '#cc8111',
        },
        danger: {
          500: '#ef4444',
          600: '#dc2626',
        },
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '0.5rem', // Overriding 2xl to match LC's more "boxy" feel
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        // Updated gradients to use LeetCode Greens
        'gradient-primary': 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
        'gradient-success': 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
        'gradient-dark': 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}