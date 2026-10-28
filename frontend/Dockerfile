# 前端：Next.js 14 生产镜像（next start 模式）
FROM node:22-alpine AS builder
WORKDIR /app

# 依赖优先层（利用 Docker 缓存）
COPY package*.json ./
RUN npm ci

# 源码 + 构建
COPY . .
# NEXT_PUBLIC_* 在构建期被静态内联：走 Nginx 相对基址 /api，关闭 Mock
ARG NEXT_PUBLIC_API_BASE=/api
ARG NEXT_PUBLIC_USE_MOCK=false
ENV NEXT_PUBLIC_API_BASE=$NEXT_PUBLIC_API_BASE
ENV NEXT_PUBLIC_USE_MOCK=$NEXT_PUBLIC_USE_MOCK
# Google Search Console 站点验证 token：在 GSC 添加站点后获取，留空则不输出验证 meta 标签
ARG NEXT_PUBLIC_GOOGLE_VERIFICATION
ENV NEXT_PUBLIC_GOOGLE_VERIFICATION=$NEXT_PUBLIC_GOOGLE_VERIFICATION
RUN npm run build

# 运行层
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
    CMD wget -q -O - http://127.0.0.1:3000/health || exit 1

CMD ["npm", "run", "start"]
