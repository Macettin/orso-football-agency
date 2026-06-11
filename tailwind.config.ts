import type {Config} from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        ink: '#020817',
        navy: '#04102a',
        panel: '#07111f',
        brand: '#003090',
        accent: '#0b4bd3',
        silver: '#cbd5e1',
        mist: '#aab6c8',
        line: '#17243a'
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Arial', 'sans-serif'],
        display: ['var(--font-manrope)', 'Arial', 'sans-serif']
      },
      backgroundImage: {
        'hero-grid':
          'linear-gradient(rgba(11,75,211,.09) 1px, transparent 1px), linear-gradient(90deg, rgba(11,75,211,.09) 1px, transparent 1px)'
      },
      boxShadow: {
        blue: '0 22px 70px rgba(11,75,211,.18)',
        'blue-soft': '0 12px 40px rgba(0,48,144,.14)'
      }
    }
  },
  plugins: []
};

export default config;
