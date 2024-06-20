import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./_Components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "openbox-green": "#bcd727",
        "hover-obgreen": "#819417",
        white: "#ffffff",
        gray: "#d4d4d4",
        "hover-gray": "#a1a1aa",
        background_gray: "#f6f6f6",
      },
      fontSize: {
        xxs: ".65rem",
        xxl: "1.75rem",
        "3.5xl": "2rem",
      },
    },
  },
  plugins: [],
};
export default config;
