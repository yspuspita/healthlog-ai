/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#FBEFEF',
        surface: '#FFE2E2',
        border: {
          DEFAULT: '#F5CBCB',
          strong: '#E8B5B5',
        },
        accent: {
          DEFAULT: '#C5B3D3',
          dark: '#B09CC4',
          light: '#E8DFF0',
        },
        text: {
          primary: '#2D1F3D',
          secondary: '#6B5B7B',
          muted: '#9B8FA0',
        },
        sidebar: '#F7E8E8',
        success: '#B3D9C5',
        warning: '#FFE5B3',
        danger: '#FFB3B3',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        btn: '12px',
        input: '12px',
        bubble: '18px',
        tag: '20px',
      },
      boxShadow: {
        card: '0 2px 12px rgba(197, 179, 211, 0.12)',
        'card-hover': '0 4px 20px rgba(197, 179, 211, 0.2)',
        btn: '0 2px 8px rgba(197, 179, 211, 0.3)',
        input: '0 0 0 3px rgba(197, 179, 211, 0.2)',
      },
    },
  },
  plugins: [],
}
