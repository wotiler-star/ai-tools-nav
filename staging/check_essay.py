import json, urllib.request

url = "https://www.toolly.cc/api/ai_post/list/page?current=1&pageSize=20"
with urllib.request.urlopen(url, timeout=20) as r:
    raw = r.read().decode("utf-8")

d = json.loads(raw)
recs = d["data"]["records"]
key = "鱼皮"
print(f"total={d['data']['total']}, records_returned={len(recs)}")
for rec in recs:
    print(f"  id={rec['id']} | author={rec['authorName']} | title={rec['title'][:30]}")
yp = [rec for rec in recs if key in rec.get("authorName", "") or key in rec.get("title", "") or key in rec.get("content", "")]
print(f"\nfish_remaining_in_api = {len(yp)}")
if yp:
    for rec in yp:
        print("  STILL:", rec["id"], rec["authorName"], rec["title"])
