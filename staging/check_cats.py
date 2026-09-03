import json
d = json.load(open("/tmp/cats.json"))["data"]
print(len(d), "cats")
for c in d:
    print(c["id"], c["name"], "cloud=" + str(c.get("cloudCount", "-")), "tags=" + str(len(c.get("tags", []))))