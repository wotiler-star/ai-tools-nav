import re, json, urllib.request, urllib.parse, time

CATS = [
    ("AI写作", "ai-writing", "✍️"),
    ("AI图像", "ai-image", "🎨"),
    ("AI视频创作", "ai-video", "🎬"),
    ("AI办公", "ai-office", "📄"),
    ("AI开发平台", "ai-dev", "💻"),
    ("AI智能体", "ai-agent", "🤖"),
    ("AI聊天对话", "ai-chat", "💬"),
    ("AI音频音乐", "ai-audio", "🎵"),
    ("AI商业设计", "ai-design", "🏷️"),
    ("AI大模型", "ai-model", "🧠"),
    ("AI学习平台", "ai-learn", "📚"),
    ("AI搜索引擎", "ai-search", "🔍"),
    ("AI内容检测", "ai-detect", "🔎"),
    ("AI应用", "ai-app", "🧩"),
]

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
BASE = "https://ai.codefather.cn/tool/all/"

def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", "ignore")

def parse_tools(html):
    out = []
    # Split by each SSR <a href="/tool/<id>"> opening tag. The block that
    # follows (up to the next tool's <a>) contains the image, the <h5> name
    # and the <sub> description (both as SSR markup and RSC flight payload).
    parts = re.split(r'<a[^>]+href="/tool/(\d+)"', html)
    for k in range(1, len(parts), 2):
        tid = parts[k]
        content = parts[k + 1]
        alt = re.search(r'alt="([^"]*)"', content)
        nm = alt.group(1) if alt else ""
        h5 = re.search(r'<h5[^>]*>(.*?)</h5>', content, re.S)
        if h5:
            nm = re.sub(r'<[^>]+>', '', h5.group(1)).strip() or nm
        ds = ""
        sub = re.search(r'<sub[^>]*>(.*?)</sub>', content, re.S)
        if sub:
            ds = re.sub(r'<[^>]+>', '', sub.group(1)).strip()
        if not ds:
            htmls = re.findall(r'__html\\":\\"(.*?)\\"', content)
            ds = htmls[-1] if htmls else ""
            if ds == nm and len(htmls) >= 2:
                ds = htmls[-2]
        um = re.search(r'url=([^&\s"]+)', content)
        logo = urllib.parse.unquote(um.group(1)) if um else ""
        if tid and nm:
            out.append({"id": tid, "name": nm, "summary": ds[:160], "logo": logo})
    return out

all_tools = []
for cname, slug, icon in CATS:
    seen = set()
    count = 0
    for cur in range(1, 41):
        url = BASE + urllib.parse.quote(cname) + f"?current={cur}"
        try:
            html = fetch(url)
        except Exception as e:
            print("ERR", cname, cur, e, flush=True)
            break
        tools = parse_tools(html)
        if not tools:
            break
        for t in tools:
            if t["id"] not in seen:
                seen.add(t["id"])
                all_tools.append({"category": slug, "categoryName": cname, "icon": icon, **t})
                count += 1
        print(f"{cname}: page{cur} +{len(tools)} total={count}", flush=True)
        if len(tools) < 50:
            break
        time.sleep(0.15)
    json.dump(all_tools, open("scrape/tools_raw.json", "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)

print("TOTAL TOOLS:", len(all_tools), flush=True)
json.dump(all_tools, open("scrape/tools_raw.json", "w", encoding="utf-8"),
          ensure_ascii=False, indent=1)
