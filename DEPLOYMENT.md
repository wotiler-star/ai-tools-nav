# 部署指南

本项目是标准 Next.js 15 应用，前后端一体。下面给出四种常见部署方式：
**Docker Compose（自托管首选）**、**1Panel**、**Coolify**、**Vercel**。

> ⚠️ **数据库切换（生产必读）**
> 开发期用 SQLite（`provider = "sqlite"`），生产推荐 PostgreSQL。使用 Postgres 前，
> 把 `prisma/schema.prisma` 顶部的 `datasource` 改为：
> ```prisma
> datasource db {
>   provider = "postgresql"
>   url      = env("DATABASE_URL")
> }
> ```
> 然后 `npx prisma migrate deploy`（或 `db push`）建表。Docker / 1Panel / Coolify / Vercel
> 的启动命令里已包含 `prisma migrate deploy`，无需手动执行。

---

## 1. Docker Compose（自托管首选，一条命令起）

仓库已含 `Dockerfile` 与 `docker-compose.yml`。

```bash
# 1) 准备环境变量
cp .env.example .env
# 编辑 .env：把 AUTH_SECRET 换成 `openssl rand -base64 32` 的结果

# 2) 若用 Postgres，先把 schema 切到 postgresql（见上方警告）

# 3) 启动（含 Postgres）
docker compose up -d --build
# 访问 http://<服务器IP>:3000
```

- 应用镜像启动时会自动 `prisma migrate deploy` 再 `npm run start`。
- 数据持久化在 compose 的 `pgdata` 卷；如需备份直接备份该卷。
- 反向代理（Nginx / Caddy）把 80/443 转发到容器 3000 即可，`NEXTAUTH_URL` 填对外域名。

---

## 2. 1Panel（国产面板，适合国内服务器）

1. **应用商店 / 容器** 中新建「编排」（Compose）应用，粘贴本仓库 `docker-compose.yml` 内容，
   或直接「创建容器」选已构建的镜像。
2. 在环境变量里设置：
   - `DATABASE_URL`（Postgres 连接串）
   - `AUTH_SECRET`（随机串）
   - `NEXTAUTH_URL`（你的域名）
3. 端口映射 `3000:3000`；如需域名访问，在 1Panel「网站」里建反向代理指向该容器。
4. 数据库可用 1Panel 自带的 **PostgreSQL 应用** 或外部云库，连接串填入 `DATABASE_URL` 即可。

> 镜像构建可在 1Panel 的「构建镜像」功能中基于本仓库 Dockerfile 完成，或先在本地
> `docker build -t ainav:latest .` 后推送到私有 registry 再拉取。

---

## 3. Coolify（Git 自动部署，最接近 Vercel 体验）

1. 在 Coolify 新建 **Application**，选择 Git 仓库（GitHub / Gitea / 等）。
2. 构建方式选 **Dockerfile**（会自动识别仓库根目录的 `Dockerfile`）。
3. 在 Environment 里添加变量：
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `NEXTAUTH_URL`（Coolify 分配的域名）
4. Coolify 会自行构建镜像并运行；数据库可在 Coolify 内一键创建 Postgres，
   把内网连接串填进 `DATABASE_URL`。
5. 部署完成后，启动命令已包含 `prisma migrate deploy`，开箱即用。

---

## 4. Vercel（最快上线，零运维）

1. 推送到 GitHub，在 Vercel 导入仓库，Framework 选 **Next.js**（自动识别）。
2. **Build Command** 改为：
   ```
   npx prisma migrate deploy && next build
   ```
   （确保生产数据库已存在，可先用 `prisma db push` 初始化。）
3. **Environment Variables** 添加：
   - `DATABASE_URL`（Postgres，推荐 Vercel Postgres / Supabase / Neon）
   - `AUTH_SECRET`
   - `NEXTAUTH_URL`（Vercel 分配的域名，默认会自动识别，可不填）
4. 部署即可。Vercel 会自动做 ISR/SSG 优化；客户端的 `use client` 组件与
   Route Handlers 均按 Next.js 15 标准运行。

---

## 生产检查清单

- [ ] `AUTH_SECRET` 已替换为强随机值
- [ ] `DATABASE_URL` 指向生产数据库，且 `schema.prisma` 的 `provider` 已切到对应引擎
- [ ] 已执行迁移（`prisma migrate deploy` / `db push`）并灌种子（`npm run db:seed`）
- [ ] `NEXTAUTH_URL` 与对外域名一致（自托管用 `trustHost: true`，一般无需填）
- [ ] 反向代理已开启 HTTPS（Auth.js 在 HTTPS 下才安全下发会话 Cookie）
- [ ] 默认管理员账号 `admin@ainav.dev` / `admin123` 上线后**务必修改密码或删除**

## 默认账号

| 角色 | 邮箱 | 密码 |
|------|------|------|
| 管理员 | `admin@ainav.dev` | `admin123` |
| 普通用户 | 注册页自行注册 | — |

管理员可访问 `/admin` 管理工具、审核社区内容、管理提示词。
