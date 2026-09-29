/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1F4D3A',
          hover: '#183E2F',
          dark: '#143327',
          light: '#2B6A50',
          50: '#E9F2EE',
          100: '#C7DFD3',
          200: '#94C3AE',
        },
        background: {
          DEFAULT: '#F8EBE1',
          card: '#FFFFFF',
          cream: '#F4E3D7',
          alt: '#FAF2EC'
        },
        secondary: {
          DEFAULT: '#F9D5BA',
          hover: '#F5C6A3',
          light: '#FDEEE4',
          dark: '#E2B18E'
        },
        accent: {
          DEFAULT: '#653220',
          hover: '#522819',
          light: '#85442D',
          border: '#D9C4B5'
        },
        dark: {
          DEFAULT: '#221610',
          muted: '#5A463B',
          light: '#7A6559'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(31, 77, 58, 0.06)',
        'card': '0 4px 16px rgba(101, 50, 32, 0.08)',
        'elevated': '0 10px 30px rgba(31, 77, 58, 0.12)',
      }
    },
  },
  plugins: [],
}
