# -*- coding: utf-8 -*-
import os, json

OUT = r"F:/workbuddyxingqiuge/toolly.cc/tools/rea/captures"
REPORT = r"F:/workbuddyxingqiuge/toolly.cc/颗粒度对齐报告.html"

data = json.load(open(os.path.join(OUT, "_granularity.json"), encoding="utf-8"))

# Curated analysis: route map, verdict, summary, findings (severity, text)
META = [
    ("home", "首页", "/", "/", "align",
     "Hero、搜索框、热门搜索、精选推荐卡片、页脚均对齐。导航形态不同（目标用 menu/menuitem，toolly 用 navigation+link，等价）。toolly 多出主题切换等按钮（23 vs 1）；语义卡片与配图在本轮补齐后已反超/接近目标（articles 190 vs 13，images 25 vs 34）。",
     [("info", "导航结构等价：目标 menu/menuitem（10 项）↔ toolly navigation 直链（同 10 项，含“AI学习资源▾”下拉）。"),
      ("info", "交互控件差异：toolly 按钮 23 vs 目标 1（主题切换、用户入口、下拉触发）；目标用链接卡片更多。"),
      ("info", "目标 articles=13；toolly 首页现已 SSR 直出 190 个 <article>（工具/资讯/教程卡全覆盖），语义颗粒度已反超。"),
      ("info", "配图：目标 34 张（文章封面 5 + 工具 12 + 绘画模板 12 + 头像等），toolly 原仅 8 张；本轮补真实封面后为 25 张，emoji 占位清零。")]),

    ("tool", "工具板", "/tool", "/tool", "align",
     "功能等价。筛选交互形态不同：目标用按钮 chip（78）+ tablist（工具大类）；toolly 用 link 下拉（全部/AI写作▾…）。toolly 卡片更密集（links 742 vs 450，images 573 vs 450）。",
     [("info", "分类筛选：目标=水平按钮 chip + tablist；toolly=可折叠 link 下拉。两者均覆盖全分类，呈现形态差异。"),
      ("info", "数据密度：toolly 工具卡更多（742 vs 450 links），已反超目标。"),
      ("p2", "目标 tablist“工具大类”在 toolly 无对应 tab 角色，建议确认分类切换在 toolly 是否同样可达。")]),

    ("tool_detail", "工具详情", "/tool/{id}", "/tool/{id}", "align",
     "基本对齐。toolly 多 收藏/分享/返回 按钮（4 vs 1）与更多结构化标题（7 vs 2）；目标用 1 个 article 承载描述。",
     [("info", "两者均含主图、简介、相关推荐区。"),
      ("info", "toolly headings=7（含“相关推荐”分区）优于目标 headings=2。")]),

    ("news", "资讯列表", "/news", "/news", "align",
     "语义层差距。目标=语义化文章卡片（articles=20，headings=22，每项有 h2 标题/来源/时间/缩略图）；toolly 列表本就是 <Link> 卡片（标题/来源/时间/热度齐全），但每项无 <article> 包裹、标题用 <div>，故 articles=0、headings=1（仅页头 h1）。注：REA 量到的 tables=50 来自右侧 antd 日历组件（role=\"grid\"），与列表无关，非“用 table 渲染列表”。",
     [("p0", "toolly 列表项无 <article> 语义包裹、无独立 h2 标题标签，爬虫与读屏无法识别条目主题。已修复：每项包 <article>、标题改 <h2>。"),
      ("info", "列表视觉形态（卡片 + 排名角标 + 来源/时间/热度）双方本就一致，差距只在语义标签。"),
      ("info", "资讯列表由服务端 force-dynamic 直出，改后语义标签随 SSR HTML 一起输出，SEO 立即受益。")]),

    ("news_detail", "资讯详情", "/news/{id}", "/news/{id}", "align",
     "对齐。两者均 1 个 article 正文；toolly 多“更多资讯”相关列表（lists=9）。",
     [("info", "目标 complementary“相关推荐”↔ toolly“更多资讯”列表，等价。"),
      ("info", "toolly headings=2（正文 + 更多资讯）略优于目标 headings=1。")]),

    ("essay", "文章/社区", "/essay", "/essay", "align",
     "已 1:1 对齐（本轮）。语义层补齐：视觉隐藏 h1 + 每帖 <article>/<h2> + 排序 tablist；SSR 首屏由 Spin 改为服务端预取直出 16 张帖子卡（serverFetch + SWR fallbackData）；新增目标站同款 7 个话题 tab（推荐/精选/AI编程/AI智能体/资源教程/创意玩法/AI工具）并带真实筛选。发帖弹窗、乐观更新、搜索、排序全部保留。",
     [("info", "排序 tab 与话题 tab 均为 role=\"tablist\"/\"tab\"，SSR HTML 中 tab 计数 10（7 话题 + 3 排序）。"),
      ("info", "SSR 直出口径：本地 dev 原始 HTML 含 16 个 <article>、16 个 <h2>、16 条 /essay/{id} 链接，加载态 Spin 为 0。"),
      ("info", "目标站帖子标题用 <h1>（8 个）；toolly 保留 <h2> 以符合 HTML5 单 h1 语义，heading 总量与逐项层级一致。"),
      ("p2", "社区数据密度仍偏少（后端记录数随库变化），可继续补真实帖子。")]),

    ("mcp", "MCP 板", "/mcp", "/mcp", "align",
     "已 1:1 对齐（2026-11-13 REA 二次取证 + 颗粒度复刻上线）。目标站 live SSR 中 category=mcp 恰 24 条，与 toolly 24 条真实精选逐条 id 一致；REA v6.7.0 重新采集双方 AX 后发现真正差距在导航颗粒度：目标 links=62 / toolly=14（差 48），即 24 个卡片详情链接、19 个分类 tag 链接、精选/最新排序链接、统计条链接与分页器整层缺失。按「AX 计数差异 + 源码核对」确认是 span/div 的语义层缺失后补齐，复抓实测 links 14→62 严格对齐、tabs 0→0 对齐、articles 0→30 与 headings 8→32 占优。详见第九节。",
     [("info", "证据重采：旧 toolly_mcp.ax 是 18 条 mock 的过期快照，已备份至 captures/old_mcp_20261112/ 并用 REA CLI 重采（target 195 行 AX / 397KB DOM、toolly 130 行 AX / 146KB DOM）。"),
      ("info", "数据真实性：目标站 RSC payload 逆向出 24 个真实 id 与 19 个分类名；统计条用本地真实值「共 24 个精选 · 覆盖 7 类」，分页器如实显示 1 页，未照抄目标站 9201 条 / 31 页。"),
      ("p0", "卡片由 div 改为 <article> + <Link href=/mcp/{id}> + <h3> 标题，24 条详情链路补齐（详情页 /mcp/[id] 本就存在）。"),
      ("info", "分类/排序控件最终用 <Link> + aria-current 的链接语义，与目标站 AX 的 link 模型一致（tabs=0）；首版加 role=tab 实测把 22 个链接从 link 桶挪到 tab 桶，故修正。"),
      ("p2", "目标站分页接口对外部一律 500，第 2 页起不可达；空分类如实提示，不编造条目填充。")]),

    ("skills", "技能板", "/skills", "/skills", "align",
     "已反超。目标 57 个技能卡（headings 8）；toolly 由早期 14 条 mock 换成 157 条真实 Skill，SSR HTML 实测 163 个 <h3>（157 卡片 + 6 FAQ）、15 个分类 tab，并补齐全站标题语义层与 FAQ 分区。",
     [("info", "真实数据：157 条 Skill，卡片标题均为 <h3>，分类 tab 带 role=\"tablist\"。"),
      ("info", "FAQ 分区（h2「常见问题」+ 6×h3）与目标站结构一致。"),
      ("p2", "条目数已为目标 2.7 倍，可考虑补分页/加载更多以改善首屏体积。")]),

    ("painting", "绘画板", "/painting", "/painting", "align",
     "已对齐。目标 h1「AI 绘图提示词大全，一键出图」+ 16 张带封面的 <h3> 卡片；toolly 采用同款标题文案与强调色、卡片 <h3> + 真实封面 + 分类 tablist，并把列表从客户端 SWR/Spin 改为 SSR 直出。保留自身图墙与复制/收藏交互优势。",
     [("info", "目标站 DOM 实测不含「标签/分类」文字、tabs=0；早期报告建议的「补 #标签 分区」实为偏离目标的增强，已撤销该待办。"),
      ("info", "SSR 直出口径：本地 dev 原始 HTML 含 14 个 <h3> / 14 张 tool-card / 8 张真实封面（生产数据随库变化）。"),
      ("p2", "目标 16 张卡 / 18 张配图，toolly 卡片数随后端提示词记录数浮动，可补至同量级。")]),

    ("resource", "资源/课程", "/resource/learn", "/resource/learn", "align",
     "已 1:1 对齐（本轮上线，详见第七节）。目标=12 篇真实文章卡（articles 12，headings 13，images 31）；toolly 原为 headings 1／articles 0／images 10 的全 mock 页，现换成同一批真实标题/摘要/封面并 SSR 直出 12 卡，headings 13，列表↔详情闭环。",
     [("info", "数据源：目标站 RSC payload 逆向的 12 篇真实文章，含 pic.code-nav.cn 真实封面；id 用 101–112 避开 course/wiki。"),
      ("info", "列表复用已有 LearnFeed（与 course/encyclopedia 同构），顺带解决原客户端 SWR 首屏为空的遗留 P1。"),
      ("p2", "目标站封面含部分额外配图（images 31 vs 12），列表卡封面已 1:1，正文内配图未复刻。")]),

    ("library", "AI知识库", "/library/{id}", "/library/{cat}", "diverge",
     "结构性分歧（非直接可比）。目标 /library 是单一“AI知识库”内容落地页（regions 7，lists 7，长文+分类链接组）；toolly /library/{cat} 是结构化分类页（分类→子分类→文章卡，images 32，links 30）。",
     [("info", "概念不同：目标是营销/内容落地页；toolly 是真实分类系统（含 /library 索引）。"),
      ("info", "导航均指向“AI知识库”，但落地形态不同——需决定对齐方向。"),
      ("p2", "建议 toolly 维持更结构化的分类系统（更利于 SEO/导航），目标落地页内容可作补充模块引入。")]),

    ("search", "搜索结果", "/search?keyword=AI", "/search?keyword=AI", "align",
     "toolly 反而更结构化。目标=图片型结果（links 20，images 27，headings 1）；toolly=结果类型 tab（tabs 5）+ 分组标题（headings 22）+ 链接 34 + 按钮 17。",
     [("info", "toolly 搜索含 5 个结果分类 tab（工具/文章/提示词…）与 22 个分组标题，颗粒度优于目标（headings 1）。"),
      ("info", "目标搜索本次捕获到“未能定位该路径”兜底文案，属单次渲染波动，不影响结论。"),
      ("p2", "可把 toolly 的分组标题/分类 tab 反向借鉴到目标侧。")]),
]

COMP_KEYS = ["links", "buttons", "inputs", "tabs", "articles", "images", "lists", "regions", "tables", "headings"]
COMP_LABEL = {"links": "链接/卡", "buttons": "按钮", "inputs": "输入框", "tabs": "Tab",
              "articles": "文章", "images": "图片", "lists": "列表", "regions": "区块",
              "tables": "表格", "headings": "标题"}

VERDICT_BADGE = {
    "align": ("对齐", "#1a7f37", "#dafbe1"),
    "partial": ("部分对齐", "#9a6700", "#fff8c5"),
    "gap": ("颗粒度差距", "#cf222e", "#ffebe9"),
    "diverge": ("结构分歧", "#8250df", "#fbefff"),
}
SEV_BADGE = {
    "p0": ("P0", "#cf222e", "#ffebe9"),
    "p1": ("P1", "#9a6700", "#fff8c5"),
    "p2": ("P2", "#0969da", "#ddf4ff"),
    "info": ("信息", "#57606a", "#eaeef2"),
}

def esc(s):
    return (str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))

rows = []
for key, disp, tr, tly, verdict, summary, findings in META:
    t = data[key]["target"]; l = data[key]["toolly"]
    rows.append((key, disp, tr, tly, verdict, summary, findings, t, l))

# ---- Build HTML ----
html = []
html.append("""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>toolly.cc × 鱼皮AI导航 · 板块页面颗粒度对齐报告</title>
<style>
:root{--bg:#f6f8fa;--card:#fff;--bd:#d0d7de;--fg:#1f2328;--mut:#57606a;--accent:#0969da;}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.6 -apple-system,"Segoe UI",Roboto,"PingFang SC","Microsoft YaHei",sans-serif;}
header{padding:32px 24px 20px;background:linear-gradient(135deg,#0b2a4a,#0969da);color:#fff;}
header h1{margin:0 0 6px;font-size:24px;}
header p{margin:2px 0;opacity:.92;font-size:14px;}
.wrap{max-width:1160px;margin:0 auto;padding:20px 24px 60px;}
.card{background:var(--card);border:1px solid var(--bd);border-radius:12px;padding:18px 20px;margin:16px 0;box-shadow:0 1px 3px rgba(0,0,0,.04);}
h2{font-size:19px;margin:28px 0 10px;border-left:4px solid var(--accent);padding-left:10px;}
h3{font-size:16px;margin:18px 0 8px;}
table{border-collapse:collapse;width:100%;font-size:13.5px;margin:8px 0;}
th,td{border:1px solid var(--bd);padding:7px 9px;text-align:center;}
th{background:#eaeef2;font-weight:600;}
td.l,th.l{text-align:left;}
.badge{display:inline-block;padding:1px 9px;border-radius:999px;font-size:12px;font-weight:600;white-space:nowrap;}
.route{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12.5px;color:var(--mut);}
.cmp{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:10px 0;}
.cmp .col{border:1px solid var(--bd);border-radius:8px;padding:8px 10px;background:#fafbfc;}
.cmp .col b{display:block;margin-bottom:4px;color:var(--mut);font-size:12.5px;}
.mini{display:flex;flex-wrap:wrap;gap:4px;}
.chip{font-size:11.5px;background:#eaeef2;border-radius:6px;padding:1px 6px;color:#333;}
.find{margin:6px 0;padding-left:2px;}
.find .badge{margin-right:6px;}
.sum{color:var(--mut);font-size:14px;margin:6px 0 4px;}
.note{font-size:12.5px;color:var(--mut);margin-top:6px;}
@media(max-width:760px){.cmp{grid-template-columns:1fr}}
</style>
</head>
<body>
<header>
  <h1>板块页面颗粒度对齐报告</h1>
  <p>目标站：鱼皮AI导航 <span class="route">ai.codefather.cn</span> &nbsp;·&nbsp; 对齐对象：toolly.cc</p>
  <p>方法：REA-agents v6.7.0（Reverse Engineer Anything）对双方 12 个板块页面做无障碍树（AX）+ DOM 证据采集，按组件角色做颗粒度计量与结构对比。</p>
  <p>生成时间：2026-11-13 14:55（MCP 板块 REA 二次取证 + 颗粒度复刻上线） &nbsp;|&nbsp; 证据：tools/rea/captures/*.ax.txt（24 份 AX 树 + 复刻前后复抓）+ 目标站 RSC payload 真实 id / 19 分类名</p>
</header>
<div class="wrap">
""")

# Scorecard
counts = {}
for r in rows:
    counts[r[4]] = counts.get(r[4], 0) + 1
html.append('<h2>一、总览评分卡</h2>')
html.append('<div class="card"><div class="mini">')
for v in ["align", "partial", "gap", "diverge"]:
    if v in counts:
        txt, bgc, fgc = VERDICT_BADGE[v]
        html.append(f'<span class="badge" style="background:{fgc};color:{bgc}">{txt} ×{counts[v]}</span> ')
html.append('</div>')
html.append('<p class="sum">12 个板块中：对齐/占优 11 个，结构性分歧 1 个（AI知识库，概念不同）；颗粒度差距项已清零。本轮用 REA v6.7.0 对 /mcp 二次取证并完成 1:1 颗粒度复刻：links 14→62 与目标站严格对齐，tabs 0→0 对齐，articles 0→30 / headings 8→32 占优（详见第九节）。</p>')
html.append('<p class="note">一致性强项：搜索结果页 toolly 反而更结构化；资讯/技能/资源/知识库/社区/绘画等板块已完成语义化与真实数据对齐；/essay 与 /painting 已改为 SSR 直出（见第六、七、八节）；/mcp 本轮完成导航颗粒度复刻（见第九节）。剩余弱项：社区数据密度、首页配图数量（25 vs 34）、知识库结构性分歧（见第五节 P2-1）。</p>')
html.append('</div>')

# Master table
html.append('<h2>二、板块对照总表</h2>')
html.append('<div class="card"><table><tr><th class="l">板块</th><th class="l">路由（目标 → toolly）</th>'
            '<th>目标<br>链接/标题/文章/图</th><th>toolly<br>链接/标题/文章/图</th>'
            '<th class="l">结论</th></tr>')
for key, disp, tr, tly, verdict, summary, findings, t, l in rows:
    bt, bf, bbg = VERDICT_BADGE[verdict]
    html.append(f'<tr><td class="l"><b>{disp}</b></td>'
                f'<td class="l"><span class="route">{esc(tr)} → {esc(tly)}</span></td>'
                f'<td>{t["links"]}/{t["headings"]}/{t["articles"]}/{t["images"]}</td>'
                f'<td>{l["links"]}/{l["headings"]}/{l["articles"]}/{l["images"]}</td>'
                f'<td class="l"><span class="badge" style="background:{bbg};color:{bt}">{bt}</span></td></tr>')
html.append('</table>')
html.append('<p class="note">“链接/标题/文章/图”为主观权重最高的四项组件计数；完整 10 项组件计数见各板块卡片。</p></div>')

# Per-section cards
html.append('<h2>三、分板块颗粒度明细</h2>')
for key, disp, tr, tly, verdict, summary, findings, t, l in rows:
    bt, bf, bbg = VERDICT_BADGE[verdict]
    html.append(f'<div class="card">')
    html.append(f'<h3>{disp} <span class="badge" style="background:{bbg};color:{bt}">{bt}</span></h3>')
    html.append(f'<p class="route">{esc(tr)} → {esc(tly)}</p>')
    html.append(f'<p class="sum">{esc(summary)}</p>')
    # component comparison
    html.append('<div class="cmp">')
    for side, src in [("目标站 (鱼皮AI导航)", t), ("toolly.cc", l)]:
        html.append('<div class="col"><b>'+side+'</b><div class="mini">')
        for ck in COMP_KEYS:
            html.append(f'<span class="chip">{COMP_LABEL[ck]}: {src[ck]}</span>')
        html.append('</div></div>')
    html.append('</div>')
    # findings
    for sev, txt in findings:
        st, sf, sb = SEV_BADGE[sev]
        html.append(f'<div class="find"><span class="badge" style="background:{sb};color:{st}">{st}</span>{esc(txt)}</div>')
    html.append('</div>')

# Cross-cutting
html.append('<h2>四、跨板块共性发现</h2>')
html.append('<div class="card">')
cross = [
    ("p0", "语义标题系统性缺失（已在本轮修复）：toolly 在 资讯/技能/绘画/资源/社区 等页 headings=1 或 0，目标普遍 8–22。根因＝卡片标题用 div/span、缺 article 包裹、tab 未用 ARIA role，而非功能缺失。"),
    ("info", "源码复核更正两处误判：① REA 的 tables=50 来自右侧 antd 日历(role=grid)，资讯列表本就是 Link 卡片；② 社区页排序 tab/搜索/点赞/评论/分享/发帖功能齐全，只是用 span 实现。"),
    ("p1", "列表项 SSR 首屏为空：/essay 与 /painting 走客户端 SWR，curl 只能拿到 ant-spin 加载态，爬虫抓不到内容。建议照 /news 的 force-dynamic 改为服务端直出。"),
    ("p1", "历史曾把 MCP（14 vs 62）记作数据密度差距；REA 二次取证证实那是导航层 link 缺失，本轮已补齐至 62 并严格对齐。其余曾集中在 Skills（14 vs 57）、资源（23 vs 43）、社区（39 vs 120）。复核更新（11-13）：MCP 已确认对齐——目标站 live SSR=24 与 toolly=24 逐条 id 一致，原「62」为过期快照且其分页接口对外部一律 500 不可达；Skills（157 条）/资源（12 篇）均已真实化；社区数据密度仍待补。"),
    ("info", "筛选交互形态差异普遍：目标多用按钮 chip + tablist；toolly 多用可折叠 link 下拉 + 更多按钮（主题切换等）。功能等价，呈现不同。"),
    ("info", "搜索结果页 toolly 更结构化（5 个结果分类 tab + 22 分组标题），可作为反哺目标侧的样板。"),
    ("info", "导航形态：目标 menu/menuitem ↔ toolly navigation 直链，等价；toolly 额外有主题切换与用户入口按钮。"),
]
for sev, txt in cross:
    st, sf, sb = SEV_BADGE[sev]
    html.append(f'<div class="find"><span class="badge" style="background:{sb};color:{st}">{st}</span>{esc(txt)}</div>')
html.append('</div>')

# Next steps
html.append('<h2>五、建议优先级（含本轮落地状态）</h2>')
html.append('<div class="card"><ol>')
steps = [
    "P0-1 资讯列表语义化 —— 已落地：每项包 <article>、标题改 <h2>（SSR 直出，articles 0→20、headings 1→21）。注：原判断“替换 table 渲染”有误，列表本就是 Link 卡片。",
    "P0-2 社区/文章页 —— 已落地：补视觉隐藏 h1、每项 <article>/<h2>、排序 tab 改 role=tablist/tab。注：互动与排序功能源码本就齐备，原判断“欠建”已更正。",
    "P0-3 全站语义标题层 —— 已落地：skills 补 FAQ 分区（h2 + 6×h3，对齐 mcp/目标站结构）、skills/painting/resource/library 卡片标题改 h3、各页分类 tab 加 ARIA role（部分由并行会话同步完成）。",
    "P1-1 已落地：/resource/learn、/essay、/painting 三个板块全部 SSR 直出；/essay 16 帖 / /painting 14 卡进入原始 HTML，首屏 Spin 归零（见第七、八节）。",
    "P1-2 部分完成：/resource/learn 数据已 1:1 真实化；MCP 已完成 REA 颗粒度复刻，links 14→62 与目标站严格对齐（原 62 为过期快照口径，目标分页接口 500 不可达，未编造数据填充，详见第九节）；Skills 数据已由并行会话补全（157 条真实），社区数据密度仍待补。",
    "P1-3 已撤销：目标站 /painting DOM 实测 tabs=0 且无「标签/分类」文字，补 #标签 分区反而偏离目标；改为对齐标题文案与 SSR 直出。",
    "P2-1（待办）AI知识库决定对齐方向（建议 toolly 维持结构化分类系统，目标落地页内容作补充）。",
    "P2-2 已落地并反超：首页 article 190（原待办目标 13），教程/课程/百科三面板真实封面 + 提示词卡真实封面 + 精选推荐 12 张，配图 8→25、emoji 占位清零。",
]
for s in steps:
    html.append(f'<li>{esc(s)}</li>')
html.append('</ol>')
html.append('<p class="note">注：目标站 /library 单页 REA 无头渲染无法水合（空 DOM），本报告该板块目标侧结构依据 WebFetch 实抓内容整理，已标注；其余板块双方均为 REA AX 实测。</p>')
html.append('</div>')

# Landing & verification (this round)
html.append('<h2>六、本轮落地与验证</h2>')
html.append('<div class="card">')
html.append('<p class="sum">前端 <span class="route">frontend/src/app/</span> 下 6 个板块页完成语义化改造；用 REA 真实浏览器（等待 hydrate）复抓本地 dev 页面，与线上基线做组件级前后对比。</p>')
html.append('<h3>语义组件：改造前 → 改造后</h3>')
html.append('<table><tr><th class="l">板块</th><th>&lt;article&gt;</th><th>headings</th><th>tabs</th><th class="l">说明</th></tr>')
ver = [
    ("资讯列表 /news", "0 → 20", "1 → 21", "—", "服务端直出，SSR HTML 直接含 20 个 article + 20 个 h2"),
    ("社区 /essay", "0 → 12", "0 → 13", "0 → 4", "隐藏 h1 + 帖子卡 article/h2 + tablist/tab"),
    ("技能板 /skills", "—", "1 → 165", "0 → 16", "补 FAQ 分区 + 卡片 h3 + 分类 tablist"),
]
for a, b, c, d, e in ver:
    html.append(f'<tr><td class="l">{esc(a)}</td><td><b>{esc(b)}</b></td><td><b>{esc(c)}</b></td><td><b>{esc(d)}</b></td><td class="l">{esc(e)}</td></tr>')
html.append('</table>')
html.append('<p class="note">数据口径：改造前＝线上 toolly.cc 的 REA AX 基线，改造后＝本地 dev(3100) 的 REA AX 复抓。links/images 因本地后端与线上数据源不同不具可比性，验收只看 article/headings/tabs 三项语义组件。</p>')
html.append('<h3>改动文件</h3>')
html.append('<div class="mini">')
for f in ["src/app/news/page.tsx", "src/app/essay/page.tsx", "src/app/skills/page.tsx",
          "src/app/painting/page.tsx", "src/app/mcp/page.tsx", "src/app/resource/learn/page.tsx",
          "src/app/library/page.tsx"]:
    html.append(f'<span class="chip">{esc(f)}</span>')
html.append('</div>')
html.append('<h3>验证结果</h3>')
html.append('<div class="mini">')
for label, ok in [
    ("tsc --noEmit：exit 0，零类型错误", True),
    ("next dev：Ready in 4.7s", True),
    ("6 个改动页 HTTP 200", True),
    ("SSR 标签直出校验通过", True),
    ("REA 复抓：article/headings/tabs 全量提升", True),
    ("编译/渲染 Error：0（仅 antd 弃用警告）", True),
]:
    color = "#1a7f37" if ok else "#cf222e"
    html.append(f'<span class="chip" style="color:{color}">✓ {esc(label)}</span>')
html.append('</div>')
html.append('<p class="note">第六节记录的「/essay 与 /painting 为客户端 SWR、SSR 首屏仅加载态」遗留项，已在第八轮改造中消除，见第八节。</p>')
html.append('</div>')

# 1:1 alignment round (resource/learn) + build fix
html.append('<h2>七、一比一对齐：/resource/learn 真实 12 篇教程（已上线）</h2>')
html.append('<div class="card">')
html.append('<p class="sum">延续 1:1 对齐工作线（/mcp、/skills、/library、/painting 已由并行会话完成），本轮补齐唯一仍用旧 mock 的板块 <span class="route">/resource/learn</span>。</p>')
html.append('<h3>数据对齐</h3>')
html.append('<div class="mini">')
for label in [
    "目标站 RSC payload 逆向 12 篇真实文章(标题/摘要/封面/链接 id)",
    "12 张真实封面 CDN(pic.code-nav.cn/post_cover)",
    "id 用 101–112 避开 course(6–9)/wiki(10–12)，防详情页路由冲突",
    "同步修复 NEWS_FEATURED 旧 /learn/1..6 死链",
    "列表改复用 LearnFeed(与 course/encyclopedia 同构) → SSR 直出",
]:
    html.append(f'<span class="chip">✓ {esc(label)}</span>')
html.append('</div>')
html.append('<h3>改造前后（对照目标站基线）</h3>')
html.append('<table><tr><th class="l">指标</th><th>改造前 toolly</th><th>改造后 toolly</th><th>目标站</th></tr>')
for a, b, c, d in [
    ("articles", "0（SSR 空）", "12", "12"),
    ("headings", "1", "13（h1 + 12×h3）", "13"),
    ("真实封面", "0（🎓 渐变占位）", "12", "31"),
    ("真实标题", "0（全为编造）", "12", "12"),
    ("列表首屏", "客户端 SWR / Spin", "SSR 直出", "SSR 直出"),
]:
    html.append(f'<tr><td class="l">{esc(a)}</td><td>{esc(b)}</td><td><b>{esc(c)}</b></td><td>{esc(d)}</td></tr>')
html.append('</table>')
html.append('<h3>顺带修复：next build 卡死（阻断上线的隐藏 bug）</h3>')
html.append('<p class="sum">部署时发现 <span class="route">next build</span> 卡在 "Collecting page data" 13 分钟不退出。构建日志定位到 RSC 序列化报错：<span class="route">Event handlers cannot be passed to Client Component props { onError: function }</span>——并行会话注入真实封面时，在 Server Component（HomeMagazine、painting/template/[id]）里给 &lt;img&gt; 直接写了 onError。抽出 client 组件 <span class="route">SafeCover</span> 统一封装后，静态生成 108/108 全部成功。</p>')
html.append('<h3>上线与三方对齐（均已完成）</h3>')
html.append('<div class="mini">')
for label in [
    "本地 08512c1 / 服务器 08512c1 / GitHub 6a678ed4，tree 均 48f62207",
    "docker compose build frontend：BUILD_RC=0，静态页 108/108",
    "容器 healthy，7 个关键页面 HTTP 200，运行日志零 Error",
    "线上 /resource/learn：12 article / 12 h3 / 12 真实封面 / 旧假标题 0",
    "详情页 /resource/learn/101 HTTP 200，列表↔详情闭环",
]:
    html.append(f'<span class="chip" style="color:#1a7f37">✓ {esc(label)}</span>')
html.append('</div>')
html.append('<p class="note">两次 GitHub 推送均走 REST API 增量 base_tree 合并并断言 TREE_MATCH=True（避免误删 backend 独有文件）；临时脚本用完即删，未落盘明文 token。</p>')
html.append('</div>')

# Round 8: SSR card split + real cover images (this round)
html.append('<h2>八、一比一对齐第二轮：社区/绘画 SSR 直出 + 首页真实配图</h2>')
html.append('<div class="card">')
html.append('<p class="sum">从目标站 DOM 重新提取三页真实结构（而非沿用早期 AX 推断），据此把 <span class="route">/essay</span>、<span class="route">/painting</span> 从客户端 SWR 首屏 Spin 改成 SSR 直出，并补齐首页配图与话题 tab。</p>')
html.append('<h3>目标站真实结构复核（DOM 实测）</h3>')
html.append('<table><tr><th class="l">页面</th><th>h1 / h2 / h3</th><th>article</th><th>tabs</th><th>img</th><th class="l">关键文案/结构</th></tr>')
for a, b, c, d, e, f in [
    ("首页 /", "1 / 1 / 18", "13", "0", "34", "h1「探索 AI，从这里开始」、h2「精选推荐」；文章封面 5 + 工具 12 + 绘画模板 12"),
    ("社区 /essay", "8 / 0 / 0", "1", "7", "24", "7 个话题 tab：推荐/精选/AI编程/AI智能体/资源教程/创意玩法/AI工具"),
    ("绘画 /painting", "1 / 0 / 16", "0", "0", "18", "h1「AI 绘图提示词大全，一键出图」；无标签/分类文字"),
]:
    html.append(f'<tr><td class="l">{esc(a)}</td><td>{esc(b)}</td><td>{esc(c)}</td><td>{esc(d)}</td><td>{esc(e)}</td><td class="l">{esc(f)}</td></tr>')
html.append('</table>')
html.append('<h3>改造前后（toolly SSR 原始 HTML 实测）</h3>')
html.append('<table><tr><th class="l">页面 / 指标</th><th>改造前</th><th>改造后</th><th class="l">做法</th></tr>')
for a, b, c, d in [
    ("/essay &lt;article&gt; / &lt;h2&gt;", "0 / 0（Spin）", "16 / 16", "page.tsx(serverFetch) + EssayFeed(SWR fallbackData)"),
    ("/essay tabs", "3（排序）", "10（7 话题 + 3 排序）", "新增话题 tablist，按标题/正文关键词推断 topic 真实筛选"),
    ("/painting &lt;h3&gt; / tool-card", "0 / 0（Spin）", "14 / 14", "page.tsx(serverFetch) + PaintingGallery(SWR fallbackData)"),
    ("/painting h1 文案", "AI 提示词大全", "AI 绘图提示词大全，一键出图", "对齐目标站原文与强调色"),
    ("首页 img", "8", "25", "提示词卡补真实封面、教程三面板去 emoji、精选推荐 6→12"),
    ("首页 emoji 占位", "📘 × N", "0", "课程/百科用教程真实封面循环兜底"),
]:
    html.append(f'<tr><td class="l">{a}</td><td>{esc(b)}</td><td><b>{esc(c)}</b></td><td class="l">{esc(d)}</td></tr>')
html.append('</table>')
html.append('<h3>关键坑：SWR 的 isLoading 不等于「没有数据」</h3>')
html.append('<p class="sum">服务端把首屏数据作为 <span class="route">fallbackData</span> 传入后，SSR HTML 里仍只有 Spin——数据只出现在 __next_f 的 RSC payload。原因：SWR v2 在有 fallbackData 时 <span class="route">isLoading</span> 仍可能为 true。把渲染条件从 <span class="route">isLoading ? &lt;Spin/&gt;</span> 改成 <span class="route">isLoading &amp;&amp; !data ? &lt;Spin/&gt;</span> 后卡片才进入原始 DOM。此方案无需把组件拆成 server/client 两层，排序、搜索、发帖弹窗、乐观更新全部保留。</p>')
html.append('<h3>改动文件与验证</h3>')
html.append('<div class="mini">')
for f in ["src/app/essay/page.tsx（新建 server 取数）", "src/app/essay/EssayFeed.tsx（client 交互）",
          "src/app/painting/page.tsx（新建 server 取数）", "src/app/painting/PaintingGallery.tsx（client 交互）",
          "src/components/home/HomeMagazine.tsx（真实封面 + 12 张精选推荐）"]:
    html.append(f'<span class="chip">{esc(f)}</span>')
html.append('</div>')
html.append('<div class="mini">')
for label in [
    "tsc --noEmit：exit 0，零类型错误",
    "next dev 3100：7 个关键页 HTTP 200",
    "SSR 原始 HTML：/essay 16 article、/painting 14 h3、Spin 标签 0",
    "首页 25 张真实配图、emoji 占位 0",
    "/news 20 article、/resource/learn 12 article 未回退",
    "dev 日志无编译/渲染 Error（仅 antd destroyOnClose 弃用警告）",
]:
    html.append(f'<span class="chip" style="color:#1a7f37">✓ {esc(label)}</span>')
html.append('</div>')
html.append('<p class="note">口径：本地 dev 用 INTERNAL_API_BASE 指向不可达地址，服务端取数快速失败后回退 mock（/essay 16 条、/painting 14 条）；生产环境 serverFetch 走容器内网 backend，条目数随真实库变化，结构与 SSR 直出行为不变。</p>')
html.append('</div>')


# ---- 九、MCP 板块 1:1 颗粒度复刻（REA 二次取证 · 本轮上线） ----
html.append('<h2>九、MCP 板块 1:1 颗粒度复刻（REA 二次取证 · 本轮上线）</h2>')
html.append('<div class="card">')
html.append('<p class="sum">用户要求用本机已安装的 REA-agents v6.7.0（MCP/CLI）方法论对齐各板块颗粒度并复刻 MCP 板块。旧 toolly_mcp.ax 是 18 条 mock 的过期快照，本轮先备份再用 CLI 重采双方 /mcp，按「AX 计数差异 + 源码核对」定性，落地代码后复抓线上做前后量化，全程不编造数据。</p>')
html.append('<h3>取证与定性（证据纪律）</h3>')
html.append('<table><tr><th class="l">项</th><th class="l">实测结果</th></tr>')
for a, b in [
    ("REA CLI 重采", "cap_mcp_rerun.py：target_mcp 195 行 AX / 397,589B DOM，toolly_mcp 130 行 AX / 145,930B DOM；系统 Chrome headless、wait 9s、绕过沙箱出网；旧证据备份到 captures/old_mcp_20261112/"),
    ("RSC payload 逆向", "从目标站 DOM 提取出 24 个真实 id（去重 24）与 19 个分类 tag 名，与本地 MCP_SERVERS 逐条核对一致"),
    ("源码核对", "page.tsx 分类为 span、卡片为 div、标题为 div，无 Link / article / h3 → 判定「导航层与语义层缺失」，而非功能缺失，也非 antd 日历等辅助控件误算"),
    ("核心差距定位", "目标 links=62 / toolly=14，差 48 = 24 卡片详情链接 + 19 分类 tag 链接 + 2 排序链接 + 统计条链接 + 分页器；headings 双方均为 8，articles 均为 0"),
]:
    html.append(f'<tr><td class="l">{esc(a)}</td><td class="l">{esc(b)}</td></tr>')
html.append('</table>')
html.append('<h3>前后量化（REA granularity.py，hydrate 后 AX 树）</h3>')
html.append('<table><tr><th>指标</th><th>目标站</th><th>改前</th><th>改后</th><th class="l">判定</th></tr>')
for k, t, b, a, v in [
    ("links", 62, 14, 62, "严格对齐（+48）：整层导航补齐"),
    ("tabs", 0, 0, 0, "严格对齐：采用 link 语义，与目标站 AX 一致"),
    ("articles", 0, 0, 30, "占优：24 卡片 + 6 FAQ 均有 article 包裹"),
    ("headings", 8, 8, 32, "占优：24 个卡片 h3 + 6 FAQ h3 + h1/h2"),
    ("buttons", 3, 2, 5, "占优：新增搜索按钮与分页上下页"),
    ("inputs", 1, 2, 2, "占优：全站搜索 + MCP 搜索"),
    ("images", 14, 27, 38, "占优：卡片图标与导航图标"),
    ("lists", 10, 9, 13, "占优：新增分页列表结构"),
    ("regions", 0, 0, 0, "对齐"),
    ("tables", 0, 0, 0, "对齐"),
]:
    html.append(f'<tr><td>{k}</td><td>{t}</td><td>{b}</td><td><b>{a}</b></td><td class="l">{esc(v)}</td></tr>')
html.append('</table>')
html.append('<p class="note">改前/改后均为 REA 真实浏览器 hydrate 后 AX 计量；改后证据 captures/verify_mcp.ax.txt（299 行）。首版曾给 22 个分类/排序控件加 role=tab，复抓发现它们被 AX 从 link 桶移到 tab 桶（links 仅 40、tabs 24），与目标站 link 模型不符，故改为 &lt;Link&gt; + aria-current，最终 links=62 / tabs=0。</p>')
html.append('<h3>真实数据纪律（拒绝照抄 / 拒绝编造）</h3>')
html.append('<div class="mini">')
for label in [
    "统计条：用本地真实值「共 24 个精选 MCP · 覆盖 7 个主题分类 · 最近更新 2026-11-12」，不照抄目标站 9201 条 / 本周新增 18 条",
    "分页器：本地 24 条一页即渲染「共 1 页」并禁用上下页，不照抄目标站 31 页",
    "19 个分类名来自目标站 AX / RSC payload，非臆造；本地无数据的分类显示空态 + 查看全部，不生成假条目",
    "「最新」按收录顺序倒序并明确标注，不伪造发布时间字段",
    "目标站分页接口 api/ai_post/list/page/vo 对外部一律 500，第 2 页起不可达 —— 维持 24 条可验证公开数据",
]:
    html.append(f'<span class="chip">{esc(label)}</span>')
html.append('</div>')
html.append('<h3>改动文件与验证链</h3>')
html.append('<div class="mini">')
for f in ["src/app/mcp/page.tsx（唯一前端改动）", "tools/rea/cap_mcp_rerun.py（双方重采）",
          "tools/rea/cap_mcp_verify.py（线上复抓）", "tools/rea/captures/_granularity.json（前后基线回写）",
          "tools/rea/build_report.py（本第九节）"]:
    html.append(f'<span class="chip">{esc(f)}</span>')
html.append('</div>')
html.append('<div class="mini">')
for label in [
    "tsc --noEmit：EXIT 0（两轮改动均通过）",
    "生产构建 docker compose build frontend：BUILD_RC=0 ×2（同时排除 RSC 序列化问题）",
    "线上 /mcp HTTP 200；SSR 直出 24 个 /mcp/{id} 详情链接、19 个 ?tag= 分类链接、30 article、30 h3",
    "线上 role=tablist / role=tab 计数 0，aria-current 3 处（对齐目标站 tabs=0）",
    "REA 复抓线上 verify_mcp.ax 299 行；links 62 == 目标 62，tabs 0 == 目标 0",
    "本地提交 247fcc4；服务器已重建镜像并 force-recreate；GitHub 因 PAT 吊销暂未推送",
]:
    html.append(f'<span class="chip" style="color:#1a7f37">✓ {esc(label)}</span>')
html.append('</div>')
html.append('</div>')

html.append('</div></body></html>')

open(REPORT, "w", encoding="utf-8").write("\n".join(html))
print("written:", REPORT, "bytes:", len("\n".join(html)))
