# 2026-09-02 红框对齐 v2（与目标红框完全一致）

## 参考站红框元素（www.toolly.cc/tool）
1. **第 1 行**：14 个分类横排 chip + ▾ 下拉指示，纯文字 + 蓝色下划线 active
2. **第 2 行**：搜索框 "在「AI工具」中搜索" + 独立蓝色"搜索"按钮（不是 prefix 图标）
3. **第 3 行**：全局混合标签云 ~20 个**精选**标签，直角 chip，按分类顺序
4. **分类区块**："AI写作" 大标题 + 数字 + 「全部 >」链接
5. **子标签行**：每个分类区块下方都有该分类的二级子标签 + 工具网格

## 关键改动（与上次 v1 差异）
| 元素 | v1（我之前的实现） | v2（这次对齐） |
|------|---------------------|----------------|
| 分类行 | chip + 背景框 | 纯文字 + 蓝色下划线 active |
| 搜索框 | prefix 图标 | "在「AI工具」中搜索" + 独立蓝按钮 |
| 全局云数量 | 100+（聚合所有分类的所有 tags） | **19 个精选**（按 category.cloudCount 配额） |
| 子标签行 | 只在筛选视图显示 | **每个分类区块下方都显示** |
| 「全部 >」链接 | 顶部右侧 | 区块标题右侧 + 子标签行尾 |

## 后端 schema 改动
- `category` 表加 `cloud_count INT` 字段
- `Category.java` 加 `private Integer cloudCount`
- 类型 `types/index.ts` 加 `cloudCount?: number`
- 配额：cat1=4 cat2=4 cat3=0 cat4=7 cat5=1 cat6=1 cat7=0 cat8=1 cat9=0 cat10=0 cat11=0 cat12=0 cat13=0 cat14=1（合计 19）

## 验证
- 类型检查 TSC_EXIT=0
- 后端 + 前端 docker compose up -d --build BUILD_EXIT=0
- /api/category/list 返回 14 个分类 + cloudCount 字段
- /tool 200，全局云 19 个标签（与参考站 20 接近）
- AI办公▾ hover 弹出 9 项：AI PPT/AI文档工具/AI思维导图/AI表格数据处理/AI语言翻译/AI会议工具/AI招聘求职/AI效率提升/AI法律助手 ✅
- AI写作 区块显示 12 个子标签 + 全部 > ✅

## SQL 文件
- `staging/cloud_count.sql`：幂等 ALTER + UPDATE，含 14 行的配额设置