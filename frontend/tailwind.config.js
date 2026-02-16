/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        primary: {
          DEFAULT: '#2563EB', // Brand / CTAs
          dark: '#1D4ED8',    // Hover state
          light: '#3B82F6',   // Light variant
        },
        secondary: {
          DEFAULT: '#7C3AED', // Secondary actions
          dark: '#6D28D9',
          light: '#8B5CF6',
        },
        // Background Colors
        background: '#F8FAFC',
        surface: '#FFFFFF',
        // Text Colors
        text: {
          primary: '#0F172A',
          secondary: '#64748B',
        },
        // Finance Colors
        success: {
          DEFAULT: '#16A34A', // Income
          dark: '#15803D',
          light: '#22C55E',
        },
        danger: {
          DEFAULT: '#DC2626', // Expenses
          dark: '#B91C1C',
          light: '#EF4444',
        },
        warning: {
          DEFAULT: '#F59E0B',
          dark: '#D97706',
          light: '#FBBF24',
        },
      },
    },
  },
  plugins: [],
}
