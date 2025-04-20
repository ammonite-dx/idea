import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontSize: {
        '2xs': '0.625rem', // 10px相当
      },
      fontFamily: {
        // Noto Sans JP
        sans: ['Noto Sans JP', 'ui-sans-serif', 'system-ui'],
      },
      maxWidth: {
        '9xl': '96rem', // 例：96rem = 1536px
      },
    },
  },
  plugins: [],
} satisfies Config;
