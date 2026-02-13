/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'pulse-slow': 'pulse-slow 2s ease-in-out infinite',
        'notification-enter': 'notification-enter 0.3s ease-out',
        'notification-exit': 'notification-exit 0.3s ease-in',
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'notification-enter': {
          '0%': { opacity: '0', transform: 'translate(-50%, -100%)' },
          '100%': { opacity: '1', transform: 'translate(-50%, 0)' },
        },
        'notification-exit': {
          '0%': { opacity: '1', transform: 'translate(-50%, 0)' },
          '100%': { opacity: '0', transform: 'translate(-50%, -100%)' },
        },
      },
    },
  },
  plugins: [],
}
