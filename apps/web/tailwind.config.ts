import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          deep: "#100c16",
          surface: "#181222",
          raised: "#1f1830",
          card: "rgba(24, 18, 34, 0.75)",
        },
        claw: {
          pink: "#F77EB3",
          purple: "#B98FD4",
          peach: "#FFB8D0",
          lavender: "#C4A8E0",
        },
        txt: {
          primary: "#f0e4f4",
          secondary: "#a894b8",
          muted: "#6e5a80",
        },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', "monospace"],
        body: ['"Nunito"', "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem",
        "4xl": "2rem",
      },
      animation: {
        "float": "float-gentle 4s ease-in-out infinite",
        "float-slow": "float-gentle 6s ease-in-out infinite",
        "sparkle": "sparkle 2.5s ease-in-out infinite",
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
        "fade-in": "hero-fade-in 0.5s ease-out",
        "slide-up": "reveal-up 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
      },
      keyframes: {
        "float-gentle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "sparkle": {
          "0%, 100%": { opacity: "0.3", transform: "scale(0.8)" },
          "50%": { opacity: "1", transform: "scale(1.2)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.6", transform: "scale(1.3)" },
        },
        "hero-fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "reveal-up": {
          "0%": { opacity: "0", transform: "translateY(32px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
