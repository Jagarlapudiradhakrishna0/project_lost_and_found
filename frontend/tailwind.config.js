module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#030712',
        },
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      backdropFilter: {
        none: 'none',
        blur: 'blur(10px)',
      },
    },
  },
  plugins: [],
};
