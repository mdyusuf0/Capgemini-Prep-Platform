/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "on-background": "#0f172a",
        "on-secondary-fixed-variant": "#004d64",
        "on-surface": "#0f172a",
        "inverse-primary": "#c8c6c5",
        "on-secondary-container": "#00607b",
        "surface-charcoal": "#292929",
        "on-tertiary-fixed": "#180262",
        "inverse-on-surface": "#f2f0f3",
        "accent-pink": "#fc618d",
        "accent-mint": "#7bd88f",
        "on-error-container": "#93000a",
        "surface-container-low": "#f5f3f6",
        "outline-variant": "#c4c7c7",
        "primary-container": "#1c1b1b",
        "surface-container-high": "#e9e7eb",
        "on-tertiary-container": "#8379d0",
        "surface-dim": "#dbd9dd",
        "surface-cream": "#f6f6f6",
        "secondary-container": "#86daff",
        "error": "#ba1a1a",
        "on-primary-fixed": "#1c1b1b",
        "inverse-surface": "#303033",
        "tertiary-fixed": "#e4dfff",
        "on-secondary": "#ffffff",
        "tertiary": "#000000",
        "secondary": "#006684",
        "surface-container-highest": "#e4e2e5",
        "on-secondary-fixed": "#001f2a",
        "surface-tint": "#5f5e5e",
        "on-surface-variant": "#334155",
        "border-graphite": "#38383a",
        "surface-container": "#efedf1",
        "background": {
          DEFAULT: "#fbf8fc",
          lighter: "#f6f6f6",
          card: "#ffffff",
          deep: "#efedf1"
        },
        "border-hairline": "#e2e2df",
        "tertiary-fixed-dim": "#c7bfff",
        "surface-paper": "#ffffff",
        "surface-bright": "#fbf8fc",
        "on-primary-fixed-variant": "#474646",
        "on-primary-container": "#858383",
        "surface": {
          DEFAULT: "#ffffff",
          paper: "#ffffff",
          cream: "#f6f6f6",
          charcoal: "#292929",
          container: "#efedf1",
          light: "#f6f6f6",
          lighter: "#faf9fb"
        },
        "on-error": "#ffffff",
        "tertiary-container": "#180262",
        "on-primary": "#ffffff",
        "primary": {
          DEFAULT: "#000000",
          50: "#f6f6f6",
          100: "#e9e7eb",
          200: "#dbd9dd",
          300: "#c8c6c5",
          400: "#858383",
          500: "#000000",
          600: "#1c1b1b",
          700: "#292929",
          800: "#303033",
          900: "#1b1b1e",
          950: "#141414"
        },
        "on-tertiary": "#ffffff",
        "primary-fixed-dim": "#c8c6c5",
        "secondary-fixed-dim": "#7dd1f6",
        "surface-container-lowest": "#ffffff",
        "secondary-fixed": "#bde9ff",
        "on-tertiary-fixed-variant": "#453a8e",
        "outline": "#747878",
        "error-container": "#ffdad6",
        "primary-fixed": "#e5e2e1",
        "surface-variant": "#e4e2e5",
        "accent-yellow": "#f8e67a",
        accent: {
          DEFAULT: "#006684",
          hover: "#004d64"
        },
        success: {
          DEFAULT: "#16a34a",
          hover: "#15803d"
        },
        warning: {
          DEFAULT: "#d97706",
          hover: "#b45309"
        },
        danger: {
          DEFAULT: "#dc2626",
          hover: "#b91c1c"
        }
      },
      fontFamily: {
        sans: ['"JetBrains Mono"', 'Inter', 'monospace', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        code: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
