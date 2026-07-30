/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 关闭 X-Powered-By 响应头（减少无谓头信息）
  poweredByHeader: false,
  // AntD 5 + React 18 需开启 transpilePackages 以保证样式正确打包
  transpilePackages: [
    "antd",
    "@ant-design/icons",
    "@ant-design/pro-components",
    "@ant-design/cssinjs",
    "rc-util",
    "rc-pagination",
    "rc-picker"
  ],
  // 自动按需 tree-shake 大依赖：大幅削减 antd / 图标 / lodash 的客户端包体积
  experimental: {
    optimizePackageImports: [
      "antd",
      "@ant-design/icons",
      "@ant-design/pro-components",
      "lodash",
      "lodash-es"
    ]
  },
  // 生产构建移除 console.*（保留 error/warn 便于排错），减小客户端 JS
  compiler: {
    removeConsole: { exclude: ["error", "warn"] }
  },
  // 图片 CDN 白名单（收窄，避免任意域名代理隐患）
  images: {
    remotePatterns: [
      // 项目图片 CDN（复刻 pic.code-nav.cn）
      { protocol: "https", hostname: "pic.code-nav.cn" },
      { protocol: "https", hostname: "**.code-nav.cn" },
      { protocol: "https", hostname: "**.codefather.cn" },
      // 常用头像 / 占位图服务
      { protocol: "https", hostname: "api.dicebear.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" }
    ]
  }
};

export default nextConfig;
