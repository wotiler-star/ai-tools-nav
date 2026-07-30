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
│   ├── sql/schema.sql        # 建表 + 初始数据
│   └── pom.xml
├── docker-compose.yml        # MySQL 8 + Redis 7（后端依赖）
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

## 四、启动后端（需 Java 17 + Maven + MySQL + Redis）

```bash
# 1. 启动依赖（MySQL 8 + Redis 7）
docker compose up -d

# 2. 初始化数据库
mysql -uroot -proot ai_nav < backend/sql/schema.sql

# 3. 打包并运行
cd backend
mvn clean package -DskipTests
java -jar ai-nav-web/target/ai-nav-web.jar
```

- 服务端口 `8123`，context-path `/api` → 接口形如 `http://localhost:8123/api/ai_tool/list/page`
- 接口文档 Knife4j：`http://localhost:8123/api/doc.html`
- 登录（演示）：`POST /api/user/login/phone?phone=13800000000`

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
