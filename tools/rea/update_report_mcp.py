# -*- coding: utf-8 -*-
"""把 2026-11-13 MCP 板块 REA 二次取证 + 颗粒度复刻的结论回写 build_report.py。
精确字符串替换（每处断言命中），并追加第九节。运行后再执行 build_report.py 重新出报告。
"""
import io
import sys

P = r"F:/workbuddyxingqiuge/toolly.cc/tools/rea/build_report.py"
s = io.open(P, encoding="utf-8").read()


def rep(old, new):
    global s
    if old not in s:
        print("MISS:", repr(old[:90]))
        sys.exit(1)
    s = s.replace(old, new, 1)
    print("OK  :", repr(old[:60]))


# 1) 头部证据说明
rep(
    "<p>生成时间：2026-11-13（复核 MCP 结论并更新判定分布） &nbsp;|&nbsp; 证据：tools/rea/captures/*.ax.txt（共 24 份 AX 树）+ 11-13 目标站 SSR/接口实测</p>",
    "<p>生成时间：2026-11-13 14:55（MCP 板块 REA 二次取证 + 颗粒度复刻上线） &nbsp;|&nbsp; 证据：tools/rea/captures/*.ax.txt（24 份 AX 树 + 复刻前后复抓）+ 目标站 RSC payload 真实 id / 19 分类名</p>",
)

# 2) 评分卡说明
rep(
    """html.append('<p class="sum">12 个板块中：对齐/占优 11 个，结构性分歧 1 个（AI知识库，概念不同）；颗粒度差距项已清零（MCP 经 11-13 复核确认为对齐：目标 live=24 与 toolly=24 逐条一致）。</p>')""",
    """html.append('<p class="sum">12 个板块中：对齐/占优 11 个，结构性分歧 1 个（AI知识库，概念不同）；颗粒度差距项已清零。本轮用 REA v6.7.0 对 /mcp 二次取证并完成 1:1 颗粒度复刻：links 14→62 与目标站严格对齐，tabs 0→0 对齐，articles 0→30 / headings 8→32 占优（详见第九节）。</p>')""",
)

# 3) 评分卡 note
rep(
    """html.append('<p class="note">一致性强项：搜索结果页 toolly 反而更结构化；资讯/技能/资源/知识库/社区/绘画等板块已完成语义化与真实数据对齐；/essay 与 /painting 已改为 SSR 直出（见第六、七、八节）。剩余弱项：社区数据密度、首页配图数量（25 vs 34）、知识库结构性分歧（见第五节 P2-1）；MCP 板块复核详情见第二节 mcp 条目。</p>')""",
    """html.append('<p class="note">一致性强项：搜索结果页 toolly 反而更结构化；资讯/技能/资源/知识库/社区/绘画等板块已完成语义化与真实数据对齐；/essay 与 /painting 已改为 SSR 直出（见第六、七、八节）；/mcp 本轮完成导航颗粒度复刻（见第九节）。剩余弱项：社区数据密度、首页配图数量（25 vs 34）、知识库结构性分歧（见第五节 P2-1）。</p>')""",
)

# 4) MCP 条目（META）
rep(
    """    ("mcp", "MCP 板", "/mcp", "/mcp", "align",
     "已对齐（2026-11-13 复核）。目标站 /mcp 当前公开渲染的精选 MCP 实测 24 条（SSR flight JSON 中 category=mcp 恰 24 条），与 toolly 现有 24 条真实精选逐条 id 完全一致；卡片结构、FAQ 分区、多标签展示均已对齐。早期报告的「目标 62」为 11-12 快照口径：目标站该类目 pager 显示 total 725、每页 24，但其分页接口（api/ai_post/list/page/vo）对外部请求（含真实 headless Chrome 会话）一律 500，第 2 页及以后不可达，62 无法从公开渠道验证取得。",
     [("info", "目标站 live SSR=24 与 toolly=24 逐条 id 一致，本板块在「可验证公开数据」层面已 1:1 对齐。"),
      ("info", "两者“常见问题”FAQ 区块与标题结构一致（headings 8）。"),
      ("info", "24 条均为真实精选条目，非编造占位；卡片语义与配图已对齐。"),
      ("p2", "若需继续扩量，需目标站分页接口恢复或另取真实数据源；在取得真实 62 条之前不编造数据填充。")]),""",
    """    ("mcp", "MCP 板", "/mcp", "/mcp", "align",
     "已 1:1 对齐（2026-11-13 REA 二次取证 + 颗粒度复刻上线）。目标站 live SSR 中 category=mcp 恰 24 条，与 toolly 24 条真实精选逐条 id 一致；REA v6.7.0 重新采集双方 AX 后发现真正差距在导航颗粒度：目标 links=62 / toolly=14（差 48），即 24 个卡片详情链接、19 个分类 tag 链接、精选/最新排序链接、统计条链接与分页器整层缺失。按「AX 计数差异 + 源码核对」确认是 span/div 的语义层缺失后补齐，复抓实测 links 14→62 严格对齐、tabs 0→0 对齐、articles 0→30 与 headings 8→32 占优。详见第九节。",
     [("info", "证据重采：旧 toolly_mcp.ax 是 18 条 mock 的过期快照，已备份至 captures/old_mcp_20261112/ 并用 REA CLI 重采（target 195 行 AX / 397KB DOM、toolly 130 行 AX / 146KB DOM）。"),
      ("info", "数据真实性：目标站 RSC payload 逆向出 24 个真实 id 与 19 个分类名；统计条用本地真实值「共 24 个精选 · 覆盖 7 类」，分页器如实显示 1 页，未照抄目标站 9201 条 / 31 页。"),
      ("p0", "卡片由 div 改为 <article> + <Link href=/mcp/{id}> + <h3> 标题，24 条详情链路补齐（详情页 /mcp/[id] 本就存在）。"),
      ("info", "分类/排序控件最终用 <Link> + aria-current 的链接语义，与目标站 AX 的 link 模型一致（tabs=0）；首版加 role=tab 实测把 22 个链接从 link 桶挪到 tab 桶，故修正。"),
      ("p2", "目标站分页接口对外部一律 500，第 2 页起不可达；空分类如实提示，不编造条目填充。")]),""",
)

# 5) 跨板块共性 P1 里的旧 MCP 结论
rep(
    "数据密度差距曾集中在 MCP（14 vs 62）、Skills（14 vs 57）、资源（23 vs 43）、社区（39 vs 120）。",
    "历史曾把 MCP（14 vs 62）记作数据密度差距；REA 二次取证证实那是导航层 link 缺失，本轮已补齐至 62 并严格对齐。其余曾集中在 Skills（14 vs 57）、资源（23 vs 43）、社区（39 vs 120）。",
)

# 6) 优先级清单 P1-2
rep(
    "MCP 已确认与目标站 live 展示集逐条一致（原 62 为过期快照口径，目标分页接口 500 不可达，未编造数据填充）；",
    "MCP 已完成 REA 颗粒度复刻，links 14→62 与目标站严格对齐（原 62 为过期快照口径，目标分页接口 500 不可达，未编造数据填充，详见第九节）；",
)

# 7) 追加第九节（插在最终闭合标签之前）
SECTION9 = '''
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
'''
rep("html.append('</div></body></html>')", SECTION9 + "\nhtml.append('</div></body></html>')")

io.open(P, "w", encoding="utf-8").write(s)
print("patched build_report.py, bytes:", len(s))
