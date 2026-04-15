import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["'Bebas Neue'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
        body: ["'Barlow'", "sans-serif"],
      },
      colors: {
        bg: {
          base: "#060809",
          secondary: "#0a0e12",
          card: "#0e1419",
          hover: "#131b22",
        },
        accent: {
          cyan: "#00f5d4",
          electric: "#0ff",
          green: "#39ff14",
          amber: "#ffbe0b",
          red: "#ff2d55",
        },
        border: {
          subtle: "rgba(255,255,255,0.05)",
          glow: "rgba(0,245,212,0.2)",
        },
      },
      animation: {
        "scan": "scan 3s linear infinite",
        "pulse-slow": "pulse 4s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "glitch": "glitch 0.3s ease-in-out infinite alternate",
        "border-flow": "border-flow 4s linear infinite",
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glitch: {
          "0%": { clipPath: "inset(40% 0 61% 0)", transform: "translate(-2px, 0)" },
          "20%": { clipPath: "inset(92% 0 1% 0)", transform: "translate(1px, 0)" },
          "40%": { clipPath: "inset(43% 0 1% 0)", transform: "translate(-1px, 0)" },
          "60%": { clipPath: "inset(25% 0 58% 0)", transform: "translate(2px, 0)" },
          "80%": { clipPath: "inset(54% 0 7% 0)", transform: "translate(-2px, 0)" },
          "100%": { clipPath: "inset(58% 0 43% 0)", transform: "translate(1px, 0)" },
        },
        "border-flow": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      backgroundImage: {
        "grid-pattern": "linear-gradient(rgba(0,245,212,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,212,0.03) 1px, transparent 1px)",
        "grid-pattern-lg": "linear-gradient(rgba(0,245,212,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,212,0.04) 1px, transparent 1px)",
        "noise": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
export default config;
