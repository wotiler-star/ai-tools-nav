# GSC 接入 + Next.js Docker 部署 SOP（toolly.cc / ai-tools-nav）

> 沉淀自 2026-09-04 实战。每次部署都按此顺序，可避开已踩过的坑。

## 一、GSC 验证标签接入（build-time 变量陷阱）

`NEXT_PUBLIC_*` 是 **构建期内联**变量，运行时改 env 无效，必须作为 Docker build arg。

1. `frontend/src/app/layout.tsx` 的 metadata 末尾追加条件标签：
   ```ts
   ...(process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION
     ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION } }
     : {})
   ```
2. `frontend/Dockerfile` 在 `RUN npm run build` 之前加：
   ```dockerfile
   ARG NEXT_PUBLIC_GOOGLE_VERIFICATION
   ENV NEXT_PUBLIC_GOOGLE_VERIFICATION=$NEXT_PUBLIC_GOOGLE_VERIFICATION
   ```
3. 构建时传 `--build-arg NEXT_PUBLIC_GOOGLE_VERIFICATION=<token>`。
4. `docker-compose.yml` frontend 的 `build.args` 填该 token（公开验证串，非密钥，可入库）。
5. 完整 build args（本项目）：
   - `NEXT_PUBLIC_API_BASE=/api`
   - `NEXT_PUBLIC_USE_MOCK=false`
   - `NEXT_PUBLIC_GOOGLE_VERIFICATION=<token>`

## 二、sitemap 必须是运行时动态（关键坑）

静态 `sitemap.ts`（build-time）会用 mock 假数据且 id 错位；且一旦路由被预渲染，
容器内 `backend` 主机名在构建网络不可达 → fetch 抛错 → **缓存空 sitemap**。

- 改用 Route Handler `frontend/src/app/sitemap.xml/route.ts`：`export const dynamic = "force-dynamic"`，
  运行时从 `http://backend:8123/api/...` 真实拉取。
- **不要**用 `export const revalidate = 3600` + `fetch(..., { next:{ revalidate } })`，
  那会触发构建期预渲染，缓存空结果（已踩坑）。
- 取数用 Node `fetch` 即可（容器内实测 backend 可达、返回 `code:0`）。
- `robots.ts`：`Disallow: [/admin,/user/,/api/,/search]`，`Sitemap: https://www.toolly.cc/sitemap.xml`。

## 三、部署实操（沙箱无 sshpass，用 paramiko）

环境：docker 不可用、sshpass/plink(旧版不支持 `-accept-host-keys`)/expect 缺、
`~/.ssh` 写被拦截。可用 `paramiko`（`C:/Users/Administrator/.workbuddy/binaries/python/envs/default/Scripts/python.exe`）。

1. 只传变更文件（sftp）：
   ```python
   sftp.put(LOCAL, "/root/ai-tools-nav/" + REL)
   ```
2. **单独 build frontend 镜像，绕过 backend 编译**（后端有无关旧 bug `PageResult`
   重复构造函数，但线上 backend 正常，绝不重建）：
   ```bash
   cd /root/ai-tools-nav && docker build -f frontend/Dockerfile -t ai-tools-nav-frontend:latest frontend \
     --build-arg NEXT_PUBLIC_API_BASE=/api \
     --build-arg NEXT_PUBLIC_USE_MOCK=false \
     --build-arg NEXT_PUBLIC_GOOGLE_VERIFICATION=<token>
   docker compose up -d --no-build frontend
   ```
3. **坑**：paramiko 会话里 `nohup ... &` 会被掐（会话关闭进程死）。
   改为前台阻塞 `exec_command("... docker build ... 2>&1")`，由后台任务进程持有。
4. 验证：
   - `https://www.toolly.cc/` 含 `<meta name="google-site-verification" content="<token>"/>`
   - `https://www.toolly.cc/sitemap.xml` 应含 `/tool/ /library/ /category/` 真实链接
   - `https://www.toolly.cc/robots.txt` 含 Sitemap 行

## 四、本次修掉的前端类型错误（每次重建前先 grep）

4 个 admin 组件把 `api.admin.*` 误写成 `api.*`（挂在根对象）导致 TS 编译失败、
前端镜像一直没重建：
- `AdminComments.tsx`：`api.admin.deleteAdminComment`
- `AdminUsers.tsx`：`api.admin.updateUser` / `api.admin.deleteUser`
- `AdminPrompts.tsx`：`api.admin.updateAdminPrompt` / `api.admin.deleteAdminPrompt`
- `AdminPosts.tsx`：`api.admin.updateAdminPost` / `api.admin.deleteAdminPost`

> 提交前先 `grep "api\.(updateUser|deleteUser|...)"` 全量排查，避免逐个构建试错。

## 五、GSC 网页侧（用户操作）

1. Search Console → 添加资源 `https://www.toolly.cc`（网址前缀）。
2. 验证方式选「HTML 标记」→ meta 已在线，直接点**验证**。
3. 验证通过后 → 「站点地图」→ 提交 `https://www.toolly.cc/sitemap.xml`。

## 六、安全（务必处理）

- 服务器 root 密码、腾讯云 SecretKey 曾明文出现在对话 → 立即轮换 SecretKey、改 root 密码。
- SecretKey 绝不写入任何文件 / 记忆 / 日志。
