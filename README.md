# AI 导航网站（可运行脚手架）

基于《建站说明书》《首页与导航栏设计方案》《社区板块设计方案》实现的 Next.js 15 全栈脚手架：
**前端页面 + 后端 API 一体**，首页、导航栏、社区页、提示词广场全部可跑，并用 Mock 数据保证
`npm run dev` 零数据库即可预览；接上数据库后即是一套生产级应用。

## 技术栈
- **Next.js 15**（App Router + Route Handlers 同时承担前后端）
- **React 19 + TypeScript 5**
- **Tailwind CSS v4**（CSS 变量驱动明暗双主题）
- **Prisma 6**（开发用 SQLite，上线切 PostgreSQL 仅需改 `datasource`）
- **Zod** 统一前后端校验；**lucide-react** 图标

## 快速启动
```bash
npm install          # 会自动 prisma generate
npm run dev          # 打开 http://localhost:3000
```
此时首页、社区页、提示词均使用内置 Mock 数据，无需数据库。

## 接入真实数据库（可选）
```bash
npx prisma db push   # 按 schema 建表（SQLite 默认）
npm run db:seed      # 灌入示例数据
```
之后 `/api/posts` 等接口会自动走 Prisma；数据库不可用时自动降级回 Mock，交互不中断。

## 目录结构
```
prisma/schema.prisma        # 数据模型（Tool/Category/User/Post/Comment/Like/Follow/Prompt）
prisma/seed.ts              # 种子数据
src/app/
  layout.tsx page.tsx       # 根布局 + 首页（11 区块漏斗）
  community/                # 社区页 + 帖子详情（评论树）
  api/posts/...             # 发帖 / 评论 / 点赞（Zod + 鉴权占位 + 敏感词过滤）
src/components/             # Navbar / Hero / ToolCard / Rankings / CommunityClient / ...
src/lib/                    # prisma.ts mock-data.ts validation.ts moderation.ts types.ts
```

## 关键设计
- 导航栏：5 个一级入口（首页/分类/排行榜/最新/交流社区）+ 右侧搜索·登录·提交，sticky 吸顶毛玻璃，移动端汉堡抽屉。
- 社区：发帖 / 评论（楼中楼）/ 点赞 / 关注 / 积分等级 / 社区榜单 / 提示词一键复制。
- 内容治理：敏感词过滤、新用户首帖待审、XSS 转义（React 默认）、接口限流（生产补充）。
- **真实登录（Auth.js v5）**：Credentials 密码登录 + JWT 会话，bcrypt 哈希存储；`/admin` 受 middleware 角色守卫保护。
- **后台管理**：`/admin` 概览 + 工具增删改/精选切换 + 社区内容审核（通过/拒绝）+ 提示词管理，全部走 server actions。

## 默认账号（已写入种子数据）
- 管理员：`admin@ainav.dev` / `admin123`（可进入 `/admin`）
- 普通用户：在 `/login` 注册页自行注册

## 部署
详见 **[DEPLOYMENT.md](./DEPLOYMENT.md)**：Docker Compose / 1Panel / Coolify / Vercel 四种方式，含生产检查清单与数据库切换说明。
