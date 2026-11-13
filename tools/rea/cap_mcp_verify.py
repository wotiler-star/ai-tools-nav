#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""复刻上线后，用 REA v6.7.0 复抓线上 toolly.cc/mcp（hydrate 后 AX），做前后颗粒度量化对比。
用法：python3 cap_mcp_verify.py  （需 dangerouslyDisableSandbox=true）
输出 captures/verify_mcp.ax.txt / .dom.html / .meta.json
"""
import base64
import json
import os
import subprocess
import time

OUT = r"F:/workbuddyxingqiuge/toolly.cc/tools/rea/captures"
REA = r"C:/Users/Administrator/.claude-installer/npm-global/node_modules/rea-agents/scripts/rea.mjs"
NODE = r"C:/Users/Administrator/.workbuddy/binaries/node/versions/22.22.2/node.exe"
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
URL = "https://toolly.cc/mcp"
KEY = "verify_mcp"

SCENARIO = {
    "browser": {"mode": "launch", "executable_path": CHROME, "headless": True},
    "start_url": {"url": URL, "query": []},
    "environment": {
        "viewport": {"width": 1440, "height": 900, "device_scale_factor": 1},
        "locale": "zh-CN", "timezone": "Asia/Shanghai",
        "color_scheme": "light", "reduced_motion": "reduce",
        "service_workers": "block",
    },
    "actions": [{"step_id": "w", "action": "wait_for_timeout", "duration_ms": 9000}],
    "storage": {"cookies": [], "local_storage": [], "session_storage": []},
    "secrets": [],
    "capture": {
        "after_each_step": [],
        "at_end": ["url", "dom", "accessibility"],
        "events": [],
        "network": {"request_body": False, "response_body": False, "header_values": False},
    },
}


def main():
    sp = os.path.join(OUT, f"_{KEY}.scenario.json")
    with open(sp, "w", encoding="utf-8") as fh:
        json.dump(SCENARIO, fh, ensure_ascii=False)
    t0 = time.time()
    r = subprocess.run([NODE, REA, "capture-browser-scenario", sp, "--format", "json"],
                       capture_output=True, text=True, timeout=180)
    if r.returncode != 0:
        print("[FAIL] REA rc=", r.returncode, r.stderr[:400])
        return
    ev = json.loads(r.stdout)
    steps = ev.get("normalized_result", {}).get("steps", [])
    arts = (steps[-1] if steps else {}).get("artifacts", {})
    ax = dom = ""
    for name in ("accessibility", "dom"):
        v = arts.get(name, {})
        if isinstance(v, dict) and v.get("state") == "captured":
            val = v.get("value", {}).get("text", "")
            if name == "accessibility":
                ax = val
            else:
                dom = val
    if not ax:
        print("[FAIL] no accessibility captured")
        return
    with open(os.path.join(OUT, f"{KEY}.ax.txt"), "w", encoding="utf-8") as fh:
        fh.write(ax)
    with open(os.path.join(OUT, f"{KEY}.dom.html"), "w", encoding="utf-8") as fh:
        fh.write(dom)
    meta = {
        "url": URL, "ax_lines": ax.count("\n") + 1, "dom_bytes": len(dom),
        "captured_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "rea": "v6.7.0 CLI capture-browser-scenario (post-deploy verify)",
    }
    with open(os.path.join(OUT, f"{KEY}.meta.json"), "w", encoding="utf-8") as fh:
        json.dump(meta, fh, ensure_ascii=False, indent=2)
    print(f"[OK] {KEY}: ax_lines={meta['ax_lines']} dom_bytes={meta['dom_bytes']} {time.time()-t0:.1f}s")


if __name__ == "__main__":
    main()
