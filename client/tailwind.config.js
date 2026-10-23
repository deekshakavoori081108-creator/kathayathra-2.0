/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yatra: {
          gold: "#F59E0B",
          darkgold: "#D97706",
          amber: "#FBBF24",
          crimson: "#E11D48",
          royal: "#4F46E5",
          sand: "#FEF3C7",
          parchment: "#FFFBEB",
          night: "#0F172A",
          slate: "#1E293B",
          card: "#182234"
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        story: ['Lora', 'Merriweather', 'serif']
      },
      animation: {
        'bounce-soft': 'bounceSoft 2s infinite',
        'pulse-glow': 'pulseGlow 2.5s infinite',
        'float': 'float 3s ease-in-out infinite'
      },
      keyframes: {
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 12px rgba(245, 158, 11, 0.6))' },
          '50%': { opacity: '0.8', filter: 'drop-shadow(0 0 4px rgba(245, 158, 11, 0.2))' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        }
      }
    },
  },
  plugins: [],
}
