/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        scada: {
          bg:      '#080d18',
          card:    '#0d1526',
          border:  '#1a2840',
          panel:   '#111e33',
          cyan:    '#00d4ff',
          green:   '#00e676',
          amber:   '#ffab00',
          red:     '#ff3d3d',
          muted:   '#4a6080',
          text:    '#c8d8f0',
          textDim: '#5a7090',
        },
      },
    },
  },
  plugins: [],
}