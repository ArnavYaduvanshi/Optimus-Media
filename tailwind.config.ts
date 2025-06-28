import type {Config} from "tailwindcss";
const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
        backgroundImage:{
            "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
            "gradient-conic":
               "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))"
        }
    },
  },
  plugins: [
    require("daisyui"),
  ],
  // DaisyUI config moved to daisyui.config.js or passed as options below if supported
};
export default config;