# AI 工具导航与社区站（复刻 ai.codefather.cn）

前后端分离的 AI 工具导航 + 社区网站，**全栈技术栈严格对齐 ai.codefather.cn / api.codefather.cn 实测结果**（非臆测）。

- 前端：`frontend/` —— Next.js 14 (App Router) + React 18 + TypeScript
- 后端：`backend/` —— Spring Boot 3.2 + MyBatis-Plus + MySQL + Redis + Sa-Token + Knife4j

> ⚠️ 本机环境说明：当前机器已安装 Node 22（前端可完整构建运行），**未安装 Java/Maven**（后端仅产出可编译源码，需在 Java 17+ 环境运行）。前端内置 Mock 模式，无需后端即可完整预览 UI。

---

## 一、技术栈对照表

### 前端（实测 ai.codefather.cn）
| 维度 | 技术 |
| --- | --- |
| 框架 | React 18 + Next.js 14（App Router） |
| 语言 | TypeScript |
| 状态管理 | **Zustand** |
| 数据请求 | **SWR** |
| UI 组件 | Ant Design 5 + Ant Design Pro Components |
| 样式 | TailwindCSS v3.4.19 + @ant-design/cssinjs（AntD 5 运行时样式） |
| 富文本 | Slate |
| Markdown | markdown-it |
| 可视化 | d3 |
| 工具库 | classNames / dayjs / uuid / lodash / qrcode / nprogress |
| 代码规范 | ESLint + Prettier，字体 Inter(next/font) |

### 后端（实测 api.codefather.cn）
| 维度 | 技术 |
| --- | --- |
| 框架 | Spring Boot 3.2（Maven 多模块） |
| ORM | MyBatis-Plus（分页结构 records/total/size/current） |
| 数据库 | MySQL 8 + Druid 连接池 |
| 缓存 | Redis 7 |
| 认证 | Sa-Token（SESSION Cookie，手机号/微信/短信多方式登录，**无 GitHub OAuth**） |
| 接口文档 | Knife4j（/doc.html） |
| 其他 | Caffeine、Redisson、Elasticsearch、Sentinel、Nacos（按目标站统一栈预留） |

---

## 二、目录结构

```
.
├── frontend/                 # 前端（Next.js 14 App Router）
│   ├── src/
│   │   ├── app/              # 路由（首页/工具详情/分类/社区/提示词 + /api mock 路由）
│   │   ├── components/       # Header / Footer / ToolCard / CategoryNav / ToolExplorer
│   │   ├── store/            # Zustand 全局状态
│   │   ├── lib/              # request（请求封装）、api（SWR fetcher）、mockData
│   │   ├── config/           # 站点配置（API 地址、Mock 开关）
│   │   └── types/            # 全局类型
│   ├── package.json
│   ├── next.config.mjs / tailwind.config.ts / postcss.config.mjs
├── backend/                  # 后端（Spring Boot 多模块）
│   ├── ai-nav-common/        # 公共模块：统一返回/分页/异常
│   ├── ai-nav-web/           # Web 模块：实体/Mapper/Service/Controller/配置
│   ├── sql/schema.sql        # 建表 + 初始数据（Docker 下自动导入）
│   ├── Dockerfile            # 多阶段：maven 构建 → jre 运行
│   └── pom.xml
├── frontend/                 # 前端（Next.js 14 App Router）
│   ├── Dockerfile            # 多阶段：npm ci/build → next start
│   └── ...（见前端目录）
├── nginx/                    # Nginx 反代配置
│   └── nginx.conf            # / → frontend，/api/ → backend
├── docker-compose.yml        # 全栈编排：mysql/redis/es/nacos + backend/frontend/nginx
└── docs/建站说明书.html       # 11 章建站说明书
```

---

## 三、启动前端（已验证可运行）

```bash
cd frontend
npm install
npm run dev          # 开发模式 http://localhost:3000
# 或
npm run build && npm run start   # 生产模式
```

默认开启 **Mock 模式**（`NEXT_PUBLIC_USE_MOCK=true`），由 `src/app/api/*` 路由返回内置数据，无需后端即可体验完整页面。

切换到真实后端：
```bash
# frontend/.env.local
NEXT_PUBLIC_USE_MOCK=false
NEXT_PUBLIC_API_BASE=http://localhost:8123/api
```

---

## 四、启动后端（需 Java 17 + Maven）

> 两种方式，**推荐先跑方案 A**（H2 内存库，零外部依赖，30 秒起服务）。

### 方案 A：本地秒起（H2 内存库，免 MySQL / 免 Redis）⭐

```bash
cd backend
mvn clean package -DskipTests
java -jar ai-nav-web/target/ai-nav-web.jar --spring.profiles.active=local
```

- `local` profile 用 H2 内存库自动建表灌数据，并排除 Redis 自动配置（Sa-Token 走内存），**启动即用**。
- 服务端口 `8123`，context-path `/api` → 接口形如 `http://localhost:8123/api/ai_tool/list/page`
- 接口文档 Knife4j：`http://localhost:8123/api/doc.html`
- 默认管理员：`admin` / `12345678`

### 方案 B：接 MySQL + Redis

```bash
# 1. 启动依赖（MySQL 8 + Redis 7）
docker compose up -d mysql redis

# 2. 初始化数据库
mysql -uroot -proot ai_nav < backend/sql/schema.sql

# 3. 打包并运行（默认 profile，读取 application.yml 的 MySQL/Redis 配置）
cd backend
mvn clean package -DskipTests
java -jar ai-nav-web/target/ai-nav-web.jar
```

- 默认 profile 依赖 Redis（Sa-Token 令牌存储）。不想装 Redis 时请改用方案 A 的 `local`。
- 更多中间件（ES / Nacos）与 profile 组合见下一节《部署指南》。

---

## 五、核心接口（与前端约定一致）

| 接口 | 说明 |
| --- | --- |
| `GET /api/ai_tool/list/page` | AI 工具分页（categoryId / keyword / current / pageSize） |
| `GET /api/ai_tool/get?id=` | 工具详情（含相关推荐） |
| `GET /api/category/list` | 分类列表 |
| `GET /api/ai_post/list/page` | 社区帖子分页 |
| `GET /api/ai_prompt/list/page` | 提示词分页 |
| `POST /api/user/login/phone` | 手机号登录（演示） |

返回结构统一为 `{ code, data, message }`，分页为 `{ records, total, size, current, pages }`。

---

## 六、后续可扩展

- 接入 Elasticsearch 做工具/文章全文检索（目标站 `hotSearchText` / `recommendAiContent`）
- Sa-Token 接入微信/短信真实登录流程
- 后台管理模块（`/admin/**`，已配置登录拦截）
- 图片上传至 `pic.code-nav.cn` 风格 CDN
- Docker Compose 增加 Nginx 反代，对齐目标站部署架构

---

## 七、部署指南（Docker Compose + Nginx 生产架构）

### 7.1 整体架构

```
                ┌─────────────┐
   浏览器 ─────► │   Nginx     │  :80  (HTTPS 由 Nginx 终止)
                │ 反向代理     │
                └──────┬──────┘
           ┌──────────┼──────────────┐
           │ /         │             │ /api
           ▼           │             ▼
   ┌──────────────┐    │     ┌──────────────────────┐
   │ 前端 Next.js │    │     │ 后端 Spring Boot      │
   │ (build 产物) │    │     │ :8123  context /api   │
   └──────────────┘    │     └───────────┬──────────┘
                       │                 │
                       │        ┌────────┼────────┬────────┐
                       │        │MySQL  │Redis  │  ES 8  │ Nacos 2
                       │        │ :3306 │ :6379 │ :9200  │ :8848
                       │        └───────┴───────┴────────┴────────┘
                  docker-compose 管理上述中间件
```

- 前端：Next.js 14 生产模式（`npm run build && npm run start`，或静态导出 + 任意静态服务器）。
- 后端：Spring Boot 打 jar，`java -jar` 运行；`local` 免外部服务，`prod/es/nacos` 按需接中间件。
- Nginx：把站点根路径反代到前端、把 `/api` 反代到后端，统一端口对外。

### 7.2 本地开发联调（前端 Mock / 真实后端随时切）

```bash
# 终端 1：前端（默认 Mock 模式，无需后端即可看完整页面）
cd frontend && npm install && npm run dev          # http://localhost:3000

# 终端 2：后端（H2 内存秒起）
cd backend && mvn clean package -DskipTests
java -jar ai-nav-web/target/ai-nav-web.jar --spring.profiles.active=local

# 想让前端走真实后端：frontend/.env.local 写
#   NEXT_PUBLIC_USE_MOCK=false
#   NEXT_PUBLIC_API_BASE=http://localhost:8123/api
# 然后重启前端 dev（NEXT_PUBLIC_* 是构建期变量，必须重启生效）
```

### 7.3 一键全栈（Docker Compose，推荐）

`docker-compose.yml` 已编排**全栈**：中间件 `mysql / redis / elasticsearch / nacos` + 应用 `backend / frontend / nginx`，一条命令拉起即可访问：

```bash
# 全栈（含 ES/Nacos，首次构建镜像较慢）
docker compose up -d

# 最小可用（不含 ES/Nacos，启动最快）
docker compose up -d mysql redis backend frontend nginx

docker compose down                  # 停止并移除容器（数据卷保留）
docker compose down -v               # 连数据卷一起删（清空 MySQL 数据）
```

- **自动建表**：`backend/sql/schema.sql` 已挂载到 MySQL 的 `/docker-entrypoint-initdb.d`，首次启动自动建库 + 灌种子数据，无需手动导入。
- **前端构建参数**：`frontend` 服务构建时注入 `NEXT_PUBLIC_API_base=/api`、`NEXT_PUBLIC_USE_MOCK=false`（见 `frontend/Dockerfile`），因此页面走同源 `/api`，由 Nginx 反代到后端，免 CORS。
- **访问入口**：Nginx 监听 `:80`，`/` → 前端（:3000），`/api/` → 后端（:8123）。直接浏览器开 `http://<服务器IP>/` 即可。
- 镜像构建：后端用 `backend/Dockerfile`（maven 多阶段 → jre 运行，默认 `prod` profile）；前端用 `frontend/Dockerfile`（`npm ci/build` → `next start`）。

> 单独只起中间件时仍可按服务名拉起：`docker compose up -d mysql redis`、`docker compose up -d elasticsearch nacos`。

- MySQL：root/`root`，库名 `ai_nav`，字符集 utf8mb4。
- Redis：无密码，`6379`。
- Elasticsearch：单节点、关闭 xpack 安全、堆 512m，`9200`。
- Nacos：standalone、关闭鉴权，`8848`；仅做服务注册（配置中心默认关闭）。

### 7.4 生产部署步骤

**后端（jar）**

```bash
cd backend
mvn clean package -DskipTests
# 全量中间件：MySQL+Redis+ES+Nacos 都已 docker compose up -d
java -jar ai-nav-web/target/ai-nav-web.jar --spring.profiles.active=prod,es,nacos
# 或仅 MySQL+Redis：java -jar ai-nav-web/target/ai-nav-web.jar   （默认 profile）
```

**前端（Next.js 生产模式）**

```bash
cd frontend
# 写入真实后端地址（生产环境改成你的域名/IP）
echo "NEXT_PUBLIC_USE_MOCK=false" > .env.production
echo "NEXT_PUBLIC_API_BASE=http://<你的服务器IP>:8123/api" >> .env.production
npm run build
npm run start -- -p 3000          # 或 pm2/nohup 常驻
```

**Nginx 反代示例**（`/etc/nginx/conf.d/ainav.conf`）

```nginx
upstream ainav_front { server 127.0.0.1:3000; }
upstream ainav_api   { server 127.0.0.1:8123; }

server {
    listen 80;
    server_name your.domain.com;

    # 前端站点
    location / {
        proxy_pass http://ainav_front;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 后端 API（context-path 已是 /api，这里透传即可）
    location /api/ {
        proxy_pass http://ainav_api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        # Sa-Token 用 SESSION Cookie，必须透传 Cookie 才能保持登录态
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

> 生产建议再加 HTTPS（Let's Encrypt / 自有证书），并在 Nginx 终止 TLS；Sa-Token 的 `tokenName` 与 `isReadCookie=true` 默认即可，跨端口/跨域靠 `CorsConfig`（已配 `allowedOriginPatterns("*")` + `allowCredentials(true)`）放行。

### 7.5 环境变量 / 配置速查

| 配置项 | 位置 | 说明 |
| --- | --- | --- |
| `NEXT_PUBLIC_USE_MOCK` | frontend `.env*` | `true` 走前端内置 Mock；`false` 走真实后端（**构建期固化**，改后需重启 dev / 重 build） |
| `NEXT_PUBLIC_API_BASE` | frontend `.env*` | 真实后端基址，如 `http://localhost:8123/api` |
| `spring.profiles.active` | 启动参数 | `local` / 默认 / `prod` / `es` / `nacos`，可叠加如 `prod,es,nacos` |
| `spring.datasource.*` | `application.yml` | MySQL 连接（默认 `localhost:3306/ai_nav`，root/root） |
| `spring.data.redis.*` | `application.yml` | Redis 连接（默认 `localhost:6379`，无密码） |
| `ainav.es.host` | `application-es.yml` | ES 地址，默认 `http://localhost:9200` |
| `spring.cloud.nacos.discovery.server-addr` | `application-nacos.yml` | Nacos 地址，env `NACOS_SERVER_ADDR` 可覆盖 |

### 7.6 Profile 矩阵

| Profile | 数据库 | Redis | ES 搜索 | Nacos 注册 | 适用场景 |
| --- | --- | --- | --- | --- | --- |
| `local` | H2 内存 | 关闭 | 关闭 | 关闭 | 本地秒起、CI 验证（零外部依赖） |
| 默认（无 profile） | MySQL | 开启（token 存储） | 关闭 | 关闭 | 基础生产 |
| `prod` | MySQL | 开启 + 查询缓存 | 关闭 | 关闭 | 带 Redis 缓存的生产 |
| `prod,es,nacos` | MySQL | 开启 | 开启 | 开启 | 全量中间件生产 |

### 7.7 常见部署坑

- **`NEXT_PUBLIC_*` 是构建期变量**：改了 `.env` 必须重新 `npm run dev` 或 `npm run build`，热更新不会生效。
- **Sa-Token 必须 Boot3 starter**：Spring Boot 3.x 用 `sa-token-spring-boot3-starter`，用 2.x 的 `sa-token-spring-boot-starter` 会直接框架报错。
- **`local` 免 Redis 却会崩**：已通过排除 `SaTokenDaoRedisJackson` 自动配置修复；若自定义 profile 想免 Redis，记得同样排除该 DAO。
- **跨域 / 登录态**：前端 `credentials: include` + 后端 `CorsConfig` 已放行；Nginx 反代时务必 `proxy_set_header` 透传 Cookie，否则 Sa-Token 登录态丢失。
- **H2 ↔ MySQL 方言**：`local` 用 `MODE=MySQL` + `NON_KEYWORDS=USER`；生产用 MySQL，二者表结构一致（`backend/sql/schema.sql`）。
- **ES 同步失败不致命**：`EsToolSearchService` 全量同步与查询都包 try-catch，`/ai_tool/search` 异常时自动回退 DB 分页，不影响可用性。
- **admin 接口 403**：必须实现 `StpInterface`（`SaTokenPermissionImpl`）从 user 表读角色，否则 `@SaCheckRole("admin")` 会拒绝所有管理员——默认管理员 `admin/12345678` 已带 `admin` 角色。
