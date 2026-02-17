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
        'modal-enter': 'modal-enter 0.2s ease-out',
        'modal-backdrop-enter': 'modal-backdrop-enter 0.15s ease-out',
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
        'modal-enter': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'modal-backdrop-enter': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
