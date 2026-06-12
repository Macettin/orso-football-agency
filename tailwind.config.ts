import type {Config} from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        ink: '#071426',
        navy: '#0B1E36',
        panel: '#10243F',
        brand: '#003090',
        accent: '#2563EB',
        silver: '#CBD5E1',
        mist: '#CBD5E1',
        line: '#29415F'
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Arial', 'sans-serif'],
        display: ['var(--font-manrope)', 'Arial', 'sans-serif']
      },
      backgroundImage: {
        'hero-grid':
          'linear-gradient(rgba(37,99,235,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,.08) 1px, transparent 1px)'
      },
      boxShadow: {
        blue: '0 22px 70px rgba(0,48,144,.20)',
        'blue-soft': '0 12px 36px rgba(7,20,38,.14)'
      }
    }
  },
  plugins: []
};

export default config;
