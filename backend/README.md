# AI 导航站后端（Spring Boot）

复刻 api.codefather.cn 的 AI 工具导航与社区站后端。

技术栈：Spring Boot 3.2.5 + MyBatis-Plus 3.5.7 + Druid + MySQL / Redis / Elasticsearch 8 / Nacos 2 + Sa-Token + Knife4j。
前端技术栈：Next.js 14（App Router）+ React 18 + TypeScript + Zustand + SWR + Ant Design 5。

---

## 环境要求
- JDK 17+
- Maven 3.9+
- （仅生产 / 特定 profile 用）MySQL 8 + Redis 7 + Elasticsearch 8 + Nacos 2

---

## 方式一：本地秒起（H2 内存库，免 MySQL / 免 Redis）⭐ 推荐先跑这个

`local` profile 用 H2 内存库自动建表灌数据（数据与前端 Mock 一致），并排除 Redis 自动配置（Sa-Token 走内存存储）。

```bash
# 1. 编译打包（多模块：parent + ai-nav-common + ai-nav-web）
cd backend
mvn clean package -DskipTests

# 2. 启动（H2 内存库 + Sa-Token 内存，启动即用）
java -jar ai-nav-web/target/ai-nav-web.jar --spring.profiles.active=local
```

启动后：
- 接口基址：`http://localhost:8123/api`
- 接口文档（Knife4j）：`http://localhost:8123/api/doc.html`
- 默认管理员账号：`admin` / `12345678`

快速验证：
```bash
# 分类列表
curl http://localhost:8123/api/category/list

# 登录（返回 Sa-Token Cookie）
curl -i -X POST http://localhost:8123/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"userAccount":"admin","userPassword":"12345678"}'
```

---

## 方式二：生产（MySQL + Redis）

```bash
# 1. 建库
mysql -u root -p -e "CREATE DATABASE ai_nav CHARACTER SET utf8mb4;"

# 2. 初始化表结构与种子数据
mysql -u root -p ai_nav < backend/sql/schema.sql

# 3. 启动（默认 profile，读取 application.yml 的 MySQL/Redis 配置）
#    请先修改 application.yml 里的 datasource 用户名/密码，并确保本机 Redis 已启动
java -jar ai-nav-web/target/ai-nav-web.jar
```

> 默认 profile 依赖 Redis（Sa-Token 令牌存储）。如不想装 Redis，请使用方式一的 `local` profile。

---

## 中间件接入（Redis / Elasticsearch / Sa-Token / Nacos）

四个中间件都以 **profile 维度** 接入，`local`（H2 内存、免外部服务）始终保持可跑：

| 中间件 | 依赖 | 启用方式 | 默认行为 |
| --- | --- | --- | --- |
| **Sa-Token** | `sa-token-spring-boot3-starter` | 始终启用 | 登录态 + `@SaCheckRole` 角色鉴权（Spring Boot 3.x 必须用 3 系列 starter） |
| **Redis** | `spring-boot-starter-data-redis` + `sa-token-redis-jackson` | 默认（非 local）即生效 | token 存储到 Redis；`prod` profile 额外开启查询缓存 |
| **Elasticsearch** | `spring-boot-starter-data-elasticsearch` | `es` profile | 启动全量同步索引，`/ai_tool/search` 走 ES；未启用则回退 DB |
| **Nacos** | `spring-cloud-starter-alibaba-nacos-*` | `nacos` profile | 服务注册到 Nacos（配置中心默认关闭） |

- `StpInterface`（`SaTokenPermissionImpl`）从 user 表读取角色，修复了先前 `@SaCheckRole("admin")` 把管理员也拒绝的真实 bug。
- Redis 查询缓存（`RedisCacheService`）仅 `ainav.cache.enabled=true`（prod profile）时生效，所有读写 try-catch 穿透到 DB。
- ES 搜索（`EsToolSearchService`）`@ConditionalOnProperty(ainav.es.enabled=true)`，异常 / 未启用时由 `/ai_tool/search` 回退到 DB `listToolByPage`。
- Nacos 在 `application.yml` 中默认 `enabled=false`，仅在 `nacos` profile 打开 `spring.cloud.nacos.discovery.enabled=true`。

### 组合启动示例（生产全量）

```bash
# 同时启用 Redis 缓存 + ES 搜索 + Nacos 注册（需先 docker-compose up -d 起 ES/Nacos）
java -jar ai-nav-web/target/ai-nav-web.jar --spring.profiles.active=prod,es,nacos
```

`docker-compose.yml` 已包含 `mysql / redis / elasticsearch / nacos` 四个独立服务，按需 `docker-compose up -d elasticsearch nacos` 拉起即可。

---

## 前端对接

前端通过 `.env` 切换 Mock / 真实后端（`NEXT_PUBLIC_*` 为构建期变量，改完需重新 `dev` / `build`）：

```bash
# frontend/.env.local 或 .env
NEXT_PUBLIC_USE_MOCK=false
NEXT_PUBLIC_API_BASE=http://localhost:8123/api
```

前端请求封装带 `credentials: "include"`，与后端 Sa-Token 的 SESSION Cookie 对应，localhost:3000 ↔ localhost:8123 跨端口（same-site）可正常携带登录态。

---

## 主要接口

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET  | `/category/list` | 分类列表 |
| GET  | `/ai_tool/list/page?current=1&pageSize=12&categoryId=&keyword=` | 工具分页 |
| GET  | `/ai_tool/search?keyword=xxx&current=1&pageSize=12` | 工具搜索（ES 优先，回退 DB） |
| GET  | `/ai_tool/get?id=1` | 工具详情 |
| POST | `/user/login` | 登录（返回 Sa-Token Cookie） |
| GET  | `/user/get/login` | 当前登录用户 |
| POST | `/user/logout` | 退出登录 |
| POST | `/admin/tool/add` | 后台新增工具（需管理员登录） |

响应信封统一为 `{ code, data, message }`（code = 0 表示成功）；分页为 `PageResult{ records, total, size, current, pages }`。

---

## 实现要点（踩坑记录）

- **字段映射**：实体用驼峰（如 `userAccount`），表列用下划线（`user_account`）。已在各实体加 `@TableField("...")` 显式映射，并在 `application.yml` 开启 `map-underscore-to-camel-case: true`，否则会报 `Unknown column`。
- **tags 字段**：数据库逗号分隔存储，JSON 以数组形式进出（前端 `string[]`）。通过 `TagsSerializer` / `TagsDeserializer`（Jackson）实现，DB 层仍是逗号串，无需改表结构。
- **H2 兼容**：`application-local.yml` 用 `jdbc:h2:mem:ai_nav;MODE=MySQL;...;NON_KEYWORDS=USER`（让 `user` 表名可用）；`is_recommended`/`is_hot` 用 `BOOLEAN`（H2 的 TINYINT 不会自动映射成 Java `Boolean`）。
- **MySQL 保留字**：`user` 是 MySQL 保留字，`sql/schema.sql` 中已用反引号转义。
- **分页方言**：`MybatisPlusConfig` 的分页 `DbType` 从环境变量 `mybatis-plus.db-type` 读取（local=h2，默认 mysql）。
- **CORS**：`CorsConfig` 用 `allowedOriginPatterns("*")` + `allowCredentials(true)`，放行前端跨端口请求。
- **Sa-Token 角色鉴权**：必须实现 `StpInterface`（`SaTokenPermissionImpl`），从 user 表读 role，否则 `@SaCheckRole("admin")` 因解析不到角色而拒绝所有后台接口（早期版本缺该实现，管理员登录也被拦）。
- **Redis 双职责**：① `sa-token-redis-jackson` 将 token 存储到 Redis（非 local profile 生效）；② `RedisCacheService` 在 `prod` profile 下缓存分类列表等读多写少数据，写失效则穿透 DB。
- **Elasticsearch 搜索**：`es` profile 启动全量同步 `ai_tool` 索引；`/ai_tool/search` 优先 ES 多字段检索，未启用 / 异常时回退 DB `listToolByPage`，保证可用性。
- **Nacos 服务注册**：`nacos` profile 打开 `spring.cloud.nacos.discovery.enabled=true` 将 `ai-nav` 注册到 Nacos；`spring.cloud.nacos.config.enabled` 默认关闭（配置中心需额外 bootstrap.yml）。
- **Profile 组合**：中间件均可叠加，如 `--spring.profiles.active=prod,es,nacos`；`local` 始终排除 Redis/ES/Nacos 自动配置，仅靠 H2 即可启动。
