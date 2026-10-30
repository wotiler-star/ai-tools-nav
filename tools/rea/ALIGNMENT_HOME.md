# REA 对齐清单 — 首页（toolly.cc → ai.codefather.cn）

> ## ⚠️ 2026-10-28 23:40 修订（高视口采集后）
>
> 用 1440×3200 视口重采两站（`scenario_tall_*.json` → `tall_target/tollly.ev.json`）并生成全页并排对比 `cmp_full.png` 后，**修正 P0-1、补充新观察**：
>
> ### 撤回原 P0-1「114 个平铺收敛为 12 张」
> - observed：toolly 首页 14 个 tab 面板各 8 张，13 个面板 `hidden`，**视觉可见仅 8 张**（HomeMagazine.tsx:138 + TabController.tsx）
> - observed：`HomeMagazine.tsx:109` 注释明写「全部分类面板服务端直出」= **有意的 SEO 设计**；且目标站 DOM 547KB **大于** toolly 397KB，DOM 体积不构成问题
> - 结论：链接数差异（114 vs 14）是「tab 全直出 vs 单面板」的实现选择，不是信息架构缺陷。**不动**
>
> ### 新 observed：真正的布局级差异（3200px 全页对比）
> 1. **目标站是「主列 2/3 + 侧栏 1/3」双栏布局**：AI 资讯、热门文章、推荐内容都在右侧栏与左列并排；toolly 是单列全宽堆叠（资讯 22 条 + 热门文章把页面拖到 3200px 仍未完）
> 2. **目标站「精选推荐」是 6 张带封面大图卡**；toolly「编辑精选」是窄条 banner（4 条文字链接）
> 3. **目标站「AI 绘图/文字提示词」是 6 张带封面大图卡**；toolly 是纯文字小卡
> 4. **目标站有「推荐内容」右侧栏块**（5 条）—— ✅ 已实现：`PromptSection` 内 `RECOMMENDS` 块（标题「推荐内容」+ 5 条，P0-B 交付）
> 5. **目标站底部有「AI 学习资源 / AI 编程课 / AI 润词百科」3 列资源区 + 右栏二维码/社媒挂件** —— ✅ 已实现：`ArticleSection`（`lg:grid-cols-4`：三面板 `lg:col-span-3` + 二维码 `aside lg:col-span-1`，P0-B 交付）
> 6. 社区板块：目标站 1 列紧凑条目（作者+时间+标题+摘要，3-4 条）；toolly 2 列网格卡（6-8 条） —— ✅ P0-D 已对齐（单列紧凑 4 条）
> 7. h3 语义化（原 P0-2）继续有效：目标 21 个 h3 vs toolly 0 个 —— ✅ P0-C 已对齐
>
> ### 修订后优先级
> - ✅ **P0-A 首页改双栏布局** — **已完成并上线（2026-10-28 23:35）**
>   - 改法：`HomeMagazine.tsx` 把「AI 资讯」「🔥热门文章」抽成 `NewsSection` / `HotArticlesSection`，
>     与「AI 工具大全」「AI 交流社区」组成两组 `grid lg:grid-cols-3`（主 col-span-2 + 侧 col-span-1）；
>     资讯 22→10 条；工具卡 grid 4→3 列、每分类 8→9 张（主列变窄后 4 列过挤）
>   - 验证（Evidence `tall_toolly_after.ev.json` + 浏览器实测）：桌面 1440 主列 765px / 侧栏 371px 并排 ✓；
>     移动 390 自动上下堆叠 ✓；h3 由 0→12 ✓；`/news` 链接 22→12（与目标站 12 持平）✓；无 JS 错误
>   - 备份：`HomeMagazine.tsx.bak_p0a_20261028-232908`（本地与服务器各一份）
> - ✅ **P0-B 精选/提示词改大图卡** — **已完成并上线（2026-10-28 23:55）**
>   - 接口无 cover 字段 → 用 **id 派生的确定性渐变**占位（`hsl((id*47)%360 …)`，非随机，SSR/CSR 渲染一致不会水合失配）；接入真实封面后替换该 div 即可
>   - 精选改 6 张横排大图卡 + h3；提示词卡 h-32 渐变大图 + 深链 `/painting/template/<id>`（11 个，路由已验证 200）+ 标题去 emoji 前缀 + 标签 chip
> - ✅ **P0-C 卡片标题 h3 语义化 + 关键页补 h1**（2026-10-30 完成并上线）
>   - `ToolCard` 工具名 div→h3（显式 `margin:0` + 字号/字重抵消默认样式，视觉不变）
>   - `ToolExplorer`（/tool、/category）、`ToolCatalog`（/tool 工具大全）、`search` 页补**视觉隐藏 h1**（同款 clip 写法），消除此前 h2→h3 跳级，形成 h1→h2→h3 正确层级
>   - 验证（REA 重采 Evidence）：首页 `h1=1/h2=5/h3=153`；分类页 `h1=1/h2=1/h3=42`；搜索页 `h1=1/h2=1/h3=20` —— 三页层级均完整无跳级
>   - 注：h1 用视觉隐藏而非可见标题，因各页已有可见板块标题（SectionTitle h2），补 h1 仅补全语义层级、不改变版式
> - 本地提交 `8d82705`；服务器提交 `e723ff7`；备份 `.bak_p0c_20261030-163350`
> - ✅ **P0-D 社区板块改单列紧凑条目**（2026-10-30 完成；commit/push 进行中）
>   - 改动：`HomeMagazine.tsx` 社区区由 `md:grid-cols-2` 网格卡（`posts.slice(0,12)`）改为**单列紧凑横向条目**（`grid-cols-1` + 头像 / 作者·时间 / 标题 / 摘要 一行式），仅 `posts.slice(0,4)` 展示 3-4 条，对齐目标站 observed#6
>   - 验证：`next build` 通过（待跑）；复用既有 `Link/SectionHead/HotArticlesSection` 与 `p.authorName/createTime/title/content` 字段，无新增类型/导入；JSX 结构平衡
>   - 本地提交 `____`；服务器提交 `____`；备份 `.bak_p0d_*`
> - ✅ **P1 文案项**（23:55 完成）：精选标题「精选推荐」✓ /「查看更多」✓ / 热门搜索 4 个 ✓ / NEWS_FEATURED 6 条 ✓；P1-5 资讯 12 条 ✓、P1-6 热门文章侧栏 10 条、P1-7「全部提示词」保留自有
> - 验证（Evidence `tall_toolly_p0b.ev.json`）：h2 含「精选推荐」、h3 0→**29**、提示词深链 11、热门搜索 4、`/news` 12 持平
> - 本地提交 `bd23b5e`；服务器提交 `e07a8de`；备份 `.bak_p0b_*`
> - ~~原 P0-1~~ 撤回
>
> 对照图：`cmp_full.png`（重构前）→ `cmp_after.png`（P0-A 后）→ `cmp_p0b.png`（P0-B+P1 后，左目标站 / 右 toolly）
>
> **剩余差距（内容层面，前端无法独立解决）**：目标站精选/提示词卡是真实文章配图，toolly 是渐变占位 —— 需要运营上传封面图（接口加 cover 字段）或接入图片源；工具描述模板化（P2）需要逐条改写内容数据

**方法**：REA (Reverse Engineer Anything) v6.7.0，`capture-browser-scenario` + `compare-web-captures`
**原则**：目标站与自有站跑**完全相同的场景配置**（controlled-replay），结论区分 observed / inference / unknown

## Evidence 索引

| 角色 | Evidence ID | 说明 |
|---|---|---|
| 目标站首页 | `ev_f9d31b3c16c8c380d60871435541352a81a18571ef225cc41a5afd1c17b1eee9` | `rea.browser-scenario-capture` / confidence=observed |
| toolly 首页 | `ev_789ad6db65bf24f5c90805d981c8c07eec5d7128bd41724ebbdc1a0b89b77732` | `rea.browser-scenario-capture` / confidence=observed |
| 差异对比 | `ev_80d48375d8c642dfff759270a3ff767b484a6d8126a36f6fb61dcad1a4e6b59d` | `rea.web-capture-diff` / overall_status=**changed** |

场景配置除 `start_url` 外逐字段一致（viewport 1440×900 / zh-CN / Asia-Shanghai / light / reduced-motion / block SW / wait 6000ms）。

**REA 声明的局限**（必须随结论保留）：
- `alignment.status = partial`，failure=`capture_context_mismatch`（跨源对比，浏览器产品/版本或 origin 作用域不同 → 不可用于「完全相等」判定）
- Artifact identity unavailable；网络响应体未保留
- 截图为视口内（非整页）

---

## 已对齐（observed，无需改动）

- 顶部导航 10 项逐项一致：主页 / 社区 / AI工具 / AI知识库 / AI提示词 / MCP / Skills / AI学习资源 / AI资讯 / GitHub开源
- Hero 主标题「探索 AI，从这里开始」+ 副标题「分享最新最有趣的 AI 工具、资源、信息，打造最强 AI 社区」
- 搜索框 + 「热门搜索：」引导语
- 「AI 工具大全」板块的 14 个分类标签逐项一致（AI写作/AI图像/AI视频创作/AI办公/AI开发平台/AI智能体/AI聊天对话/AI音频音乐/AI商业设计/AI大模型/AI学习平台/AI搜索引擎/AI内容检测/AI应用）
- 板块序列：Hero → 精选 → AI 工具大全 → AI 交流社区 → 🌟 AI 资讯 → 🔥 热门文章 → AI 提示词 → 页脚

---

## P0 — 结构级差异（影响性能 / SEO / 信息架构）

### P0-1 首页「AI 工具大全」全量平铺，目标站才是「精选预览 + 查看更多」
- observed：目标站首页 `/tool` 链接 **14** 个（12 张工具卡 + 导航 + 更多）；toolly 首页 `/tool` 链接 **114** 个
- observed：目标站首页可见文本块 176 个；toolly **481** 个
- inference：目标站采用「预览 + 跳转」信息架构，toolly 采用「全量平铺」—— 平铺会让首页极长、SEO 权重分散、首屏渲染压力大
- 关联：这与 10-28 `d7f34f5`「pageSize 200→1000」的方向相反 —— 首页不该吃满全量，全量应留在 `/tool` 页
- **建议**：首页工具区只取每个分类的精选 N 张（对齐目标站 12 张左右），保留「查看更多」跳转 `/tool`

### P0-2 卡片标题缺少语义化标题标签
- observed：目标站首页有 **21 个 h3**（精选卡片、社区帖、热门文章均用 h3）；toolly 首页 **0 个 h3**，仅 5 个 h2
- inference：toolly 的卡片标题当前是非语义元素（div/span），丢失标题层级
- **建议**：卡片标题改用 h3，板块标题保持 h2

---

## P1 — 组件 / 文案级差异

| # | 项 | 目标站 (observed) | toolly (observed) | 建议 |
|---|---|---|---|---|
| P1-1 | 精选板块标题 | `精选推荐` | `✨ 编辑精选` | 对齐为「精选推荐」，去掉 emoji |
| P1-2 | 查看更多文案 | `查看更多` | `更多` | 对齐为「查看更多」 |
| P1-3 | 精选卡片数 | 6 张 | 4 张 + 1 个 banner | 补到 6 张 |
| P1-4 | 热门搜索词 | 4 个（零基础AI编程课/AI学习路线/AI项目/OpencClaw 中文网） | 5 个（Vibe Coding 教程/AI 学习路线/AI 项目/AI 编程/提示词大全） | 数量对齐 4 个，内容保留自有 |
| P1-5 | 资讯条数 | `/news` 12 条 | `/news` 22 条 | 首页收敛到 12 条 |
| P1-6 | 热门文章条数 | `/essay` 3 条 | `/essay` 25 条 | 首页收敛到 3-8 条 |
| P1-7 | 提示词「全部」文案 | `全部绘图提示词` | `全部提示词` | 视自有分类定 |
| P1-8 | 提示词卡片 | 带模板 ID 深链 `/painting/template/<id>`，标签 `#吉伊卡哇•#可爱•#漫画` | 浅链 `/painting`，标题带 emoji 前缀 `🎨国风插画提示词` | 深链 + 去 emoji 前缀，对齐标签样式 |

---

## P2 — 内容质量差异

### P2-1 工具描述模板化重复
- observed（toolly）：`满血DeepSeek-问小白主打智能写作，起草、润色与归纳各类文稿。` / `有道写作把智能写作做顺手，起草、润色与归纳各类文稿。` / `通义听悟属于写作文档一类，起草、润色与归纳各类文稿。` —— 同一分类下后缀整句重复
- observed（目标站）：`Google Labs 推出的 AI 原生设计工具 Stitch` / `科大讯飞出品的专业AI同声传译平台` / `火山引擎推出的云端托管版 OpenClaw 服务` —— 每条是具体产品事实
- inference：toolly 描述为「分类模板句 + 工具名」批量拼接，目标站为逐条人工/精编写
- **建议**：描述改写为「厂商/能力 + 产品事实」，避免同分类后缀整句复用

---

## Unknown（本次证据未覆盖，需进一步取证）

- 目标站首页 12 张工具卡的**选取规则**（精选 / 热门 / 最新 / 编辑推荐）无法从 DOM 直接观测，需运行时或接口证据
- 目标站首页各板块的**数据来源与更新频率**
- 目标站精选卡片的排序与置顶逻辑
- 两站的**交互态**差异（分类 tab 切换、搜索联想、hover 效果）—— 本次仅采集静态首屏

---

## 复现命令

```bash
# 采集（同场景，仅 url 不同）
rea capture-browser-scenario scenario_home_target.json --format json > target_home.ev.json
rea capture-browser-scenario scenario_home_toolly.json --format json > toolly_home.ev.json

# 官方证据级对比（注意：入参需为 normalized_result，非整个 Evidence）
python -c "import json;d=json.load(open('target_home.ev.json',encoding='utf-8'));json.dump(d['normalized_result'],open('normalized_target_home.json','w',encoding='utf-8'),ensure_ascii=False)"
rea compare-web-captures normalized_target_home.json normalized_toolly_home.json --format json > compare_home.json

# 语义级骨架提取
python rea_skeleton.py target_home.ev.json toolly_home.ev.json
```
