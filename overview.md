# AI 知识库三件套交付说明（2026-09-03）

在已上线的「AI 知识库」板块（列表/详情/文章 3 页 + 后端 3 表）基础上，补齐用户要求的 3 项能力：**文章评论、后台编辑入口、阅读量真实计数**。现已全栈部署到 `https://www.toolly.cc`。

## 1. 文章评论（真实持久化）

**后端**
- 新表 `ai_comment`（通用评论，预留 `targetType=article/post`），13 字段含父评论 `parent_id`、冗余 `user_name/user_avatar`、状态、点赞数
- `AiCommentController`：`GET /ai_comment/list`（公开）、`POST /ai_comment/add`、`DELETE /ai_comment/delete/{id}`
- 发/删需登录（SaTokenConfig 已加 `/ai_comment/add`、`/ai_comment/delete/**` 拦截）；删评论校验「本人或管理员」
- 灌入 3 条演示评论

**前端**
- 文章详情页底部新增评论区：评论列表（头像+昵称+时间+内容）+ 输入框 + 发布按钮 + 删除自己的评论
- 未登录点发布→弹出登录框；登录后即时刷新列表

## 2. 后台编辑入口（知识库管理）

**后端**：`AdminController` 新增专栏/文章的 `{list, add, update, delete}`（`@SaCheckRole("admin")`），删专栏级联删其下文章。

**前端**：后台 `/admin` 新增「知识库管理」Tab
- 专栏表：标题/描述/文章数/阅读/会员标签 + 编辑/删除
- 文章表：按专栏下拉筛选 + 编辑/删除
- 两个弹窗：专栏（标题/简介/封面色值/主题分类/标签/会员/状态/排序）、文章（标题/所属专栏/摘要/Markdown 正文/排序/状态/阅读量）

## 3. 阅读量真实计数

- 后端：`POST /ai_column/article/view/{id}`（文章）、`POST /ai_column/view/{id}`（专栏），read-modify-write 自增 `view_num`
- 前端：进入文章详情页调用一次，`sessionStorage` 防同会话重复计数；列表/详情页显示真实阅读量

## 验证结果（全绿）

```
后端接口（公网 /api 经 nginx）：
  /ai_comment/list                → 2 条（演示）
  登录 admin + POST /ai_comment/add → code=0, id 自增
  /ai_column/article/view/1 (×2)  → 611 → 612
  /admin/column/list              → code=0, 10 个专栏
页面路由（HTTPS）：
  /library/11/1 → 200   /library → 200   /admin → 200
前端 tsc --noEmit → 0 错误；docker compose 全栈 build 成功
```

## 踩坑记录（复刻站后端，后续会再踩）

1. **Maven `-q` 吞报错**：Dockerfile 用 `mvn -B -q` 看不到真实错误。改用 `docker run maven:3.9-eclipse-temurin-17 mvn -B -s settings.xml clean package -DskipTests` 抓完整日志。
2. **漏 import 导致编译失败**：`AdminController` 用 `@RequestParam` 但没 import；`AiColumnController` 用 `@PostMapping` 但没 import。两处补 import 后通过。
3. **`User.getRole()` 不是 `getUserRole()`**：实体角色字段名是 `role`，`user.getUserRole()` 编译失败。
4. **INT 字段别用 antd Switch**：后端 `needVip`/`status` 是 `Integer`，前端 `<Switch valuePropName="checked">` 会发布尔值导致 Jackson 反序列化报错，改用 `<Select value=0/1>`。

## 遗留待办

- 评论暂为单层（无真正的「回复」嵌套 UI，字段已预留 `parent_id`）
- 服务器密码 `bendan666.`、旧 PAT `ghp_apc98…` 仍建议轮换
- GitHub 远端有 6 个本地没有的提交，push 前需先 rebase/merge
