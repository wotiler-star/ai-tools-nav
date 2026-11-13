#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""REA v6.7.0 重新采集 /mcp 双方证据（旧 toolly_mcp.ax 是 18 条 mock 的过期快照）。
用法：python3 cap_mcp_rerun.py   （必须 dangerouslyDisableSandbox=true，Windows 沙箱会拦 Chrome 出网）
旧证据先备份到 captures/old_mcp_20261112/，再用标准文件名覆盖，便于报告/_granularity.json 直接引用。
"""
import base64
import json
import os
import shutil
import subprocess
import time

ROOT = r"F:/workbuddyxingqiuge/toolly.cc/tools/rea"
OUT = os.path.join(ROOT, "captures")
BAK = os.path.join(OUT, "old_mcp_20261112")
REA = r"C:/Users/Administrator/.claude-installer/npm-global/node_modules/rea-agents/scripts/rea.mjs"
NODE = r"C:/Users/Administrator/.workbuddy/binaries/node/versions/22.22.2/node.exe"
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

TASKS = [
    ("target", "mcp", "https://ai.codefather.cn/mcp"),
    ("toolly", "mcp", "https://toolly.cc/mcp"),
]


def scenario(url):
    return {
        "browser": {"mode": "launch", "executable_path": CHROME, "headless": True},
        "start_url": {"url": url, "query": []},
        "environment": {
            "viewport": {"width": 1440, "height": 900, "device_scale_factor": 1},
            "locale": "zh-CN", "timezone": "Asia/Shanghai",
            "color_scheme": "light", "reduced_motion": "reduce",
            "service_workers": "block",
        },
        "actions": [{"step_id": "wait_render", "action": "wait_for_timeout", "duration_ms": 9000}],
        "storage": {"cookies": [], "local_storage": [], "session_storage": []},
        "secrets": [],
        "capture": {
            "after_each_step": [],
            "at_end": ["url", "dom", "accessibility", "screenshot"],
            "events": [],
            "network": {"request_body": False, "response_body": False, "header_values": False},
        },
    }


def extract(ev):
    out = {}
    steps = ev.get("normalized_result", {}).get("steps", [])
    arts = (steps[-1] if steps else {}).get("artifacts", {})
    for name in ("accessibility", "dom", "url"):
        v = arts.get(name, {})
        if isinstance(v, dict) and v.get("state") == "captured":
            out[name] = v.get("value", {}).get("text", "")
    sv = arts.get("screenshot", {})
    if isinstance(sv, dict) and sv.get("state") == "captured":
        try:
            out["screenshot"] = base64.b64decode(sv.get("value", {}).get("text", ""))
        except Exception:
            pass
    return out


def main():
    os.makedirs(BAK, exist_ok=True)
    for f in ("target_mcp.ax.txt", "target_mcp.dom.html", "target_mcp.meta.json",
              "toolly_mcp.ax.txt", "toolly_mcp.dom.html", "toolly_mcp.meta.json"):
        src, dst = os.path.join(OUT, f), os.path.join(BAK, f)
        if os.path.exists(src) and not os.path.exists(dst):
            shutil.copy2(src, dst)
    print("[backup] old MCP evidence ->", BAK)

    for site, page, url in TASKS:
        key = f"{site}_{page}"
        scen_path = os.path.join(OUT, f"_{key}.scenario.json")
        with open(scen_path, "w", encoding="utf-8") as fh:
            json.dump(scenario(url), fh, ensure_ascii=False)
        t0 = time.time()
        r = subprocess.run([NODE, REA, "capture-browser-scenario", scen_path, "--format", "json"],
                           capture_output=True, text=True, timeout=180)
        if r.returncode != 0:
            print(f"[FAIL] {key} rc={r.returncode} stderr={r.stderr[:400]}")
            continue
        try:
            ev = json.loads(r.stdout)
        except Exception as e:
            print(f"[FAIL] {key} JSON parse: {e}; stdout head={r.stdout[:300]}")
            continue
        arts = extract(ev)
        ax = arts.get("accessibility", "")
        dom = arts.get("dom", "")
        if not ax:
            print(f"[FAIL] {key} no accessibility captured")
            continue
        with open(os.path.join(OUT, f"{key}.ax.txt"), "w", encoding="utf-8") as fh:
            fh.write(ax)
        with open(os.path.join(OUT, f"{key}.dom.html"), "w", encoding="utf-8") as fh:
            fh.write(dom)
        if arts.get("screenshot"):
            with open(os.path.join(OUT, f"{key}.png"), "wb") as fh:
                fh.write(arts["screenshot"])
        meta = {
            "site": site, "page": page, "url": url,
            "ax_lines": ax.count("\n") + 1, "dom_bytes": len(dom),
            "has_screenshot": bool(arts.get("screenshot")),
            "captured_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "rea": "v6.7.0 CLI capture-browser-scenario",
        }
        with open(os.path.join(OUT, f"{key}.meta.json"), "w", encoding="utf-8") as fh:
            json.dump(meta, fh, ensure_ascii=False, indent=2)
        print(f"[OK] {key}: ax_lines={meta['ax_lines']} dom_bytes={meta['dom_bytes']} "
              f"shot={meta['has_screenshot']} {time.time()-t0:.1f}s")


if __name__ == "__main__":
    main()
