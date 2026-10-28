import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        // 主品牌色（蓝紫调）
        brand: {
          DEFAULT: "#1677ff",
          light: "#4096ff",
          dark: "#0958d9"
        },
        bg: {
          page: "#f5f7fa",
          card: "#ffffff"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"]
      }
    }
  },
  // 关键：不重置 AntD 已有样式，用 important 层级隔离
  corePlugins: {
    preflight: false
  },
  plugins: []
};

export default config;
