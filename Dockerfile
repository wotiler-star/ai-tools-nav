# ---- 构建阶段 ----
FROM node:22-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

# ---- 运行阶段 ----
FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
# 复制完整构建产物（含 prisma CLI，用于 migrate deploy）
COPY --from=builder /app /app
EXPOSE 3000
# 启动时先执行数据库迁移，再启动服务
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
