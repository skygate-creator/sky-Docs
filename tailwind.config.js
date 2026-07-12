/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          50: '#EFF4FF',
          100: '#DBE6FE',
          200: '#BDD1FE',
          300: '#8FB2FC',
          400: '#5A8AF9',
          500: '#2563EB', // Base
          600: '#194FD1',
          700: '#153FAA',
          800: '#153687',
          900: '#152F6B',
          950: '#0F1D42',
        },
        secondary: {
          DEFAULT: '#0F172A',
          50: '#F5F7FA',
          100: '#E6E9EF',
          200: '#C7CDD9',
          300: '#9BA5BB',
          400: '#69759A',
          500: '#4A5578',
          600: '#374260',
          700: '#28304A',
          800: '#1B2236',
          900: '#0F172A', // Base
          950: '#080D18',
        },
        tertiary: {
          DEFAULT: '#BC4800',
          50: '#FFF4EB',
          100: '#FFE4CC',
          200: '#FFC594',
          300: '#FF9E52',
          400: '#F67B1E',
          500: '#BC4800', // Base
          600: '#9C3C00',
          700: '#7A2F00',
          800: '#582200',
          900: '#3D1700',
          950: '#240D00',
        },
        neutral: {
          DEFAULT: '#F9FAFB',
          50: '#FFFFFF',
          100: '#F9FAFB',
          200: '#EEF0F2',
          300: '#DCDFE4',
          400: '#B5BAC2',
          500: '#8B919B',
          600: '#63697374',
          700: '#4A4F57',
          800: '#33363B',
          900: '#1C1E21',
          950: '#0D0E10',
        },
      },
      fontFamily: {
        sans: ['var(--font-ibm-plex-sans)', 'sans-serif'],
      },
      fontSize: {
        11: '0.6875rem', // 11px
        12: '0.75rem', // 12px
        13: '0.8125rem', // 13px
        14: '0.875rem', // 14px
        16: '1rem', // 16px
        18: '1.125rem', // 18px
        20: '1.25rem', // 20px
        24: '1.5rem', // 24px
        28: '1.75rem', // 28px
        35: '2.1875rem', // 35px
        40: '2.5rem', // 40px
      },
    },
  },
  plugins: [],
};
