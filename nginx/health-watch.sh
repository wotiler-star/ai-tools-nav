#!/bin/sh
# 上游健康巡检：探测各上游健康端点，异常时改写 /etc/nginx/health_state.conf 并 reload nginx，
# 实现「上游异常时 nginx 自动摘流 + 恢复后自动回挂」。与 http 层 resolver 配合，
# 同时覆盖「容器重建换 IP」与「进程崩溃/依赖故障」两类 502 场景。
set -u

STATE="/etc/nginx/health_state.conf"
INTERVAL=5
THRESHOLD=2   # 连续失败达到该次数才判定 down，避免瞬时抖动误摘流

fb=0; bb=0; gb=0            # 连续失败计数
fdown=0; bdown=0; gdown=0   # 当前判定（0 健康 / 1 异常）

probe() { curl -fsS -m 5 "$1" >/dev/null 2>&1; }

while true; do
  if probe "http://frontend:3000/health"; then fb=0; fdown=0; \
  else fb=$((fb+1)); [ "$fb" -ge "$THRESHOLD" ] && fdown=1 || fdown=0; fi

  if probe "http://backend:8123/api/health"; then bb=0; bdown=0; \
  else bb=$((bb+1)); [ "$bb" -ge "$THRESHOLD" ] && bdown=1 || bdown=0; fi

  # starteday 的 global-headlines 无 /health 路由，探根路径作为存活探针
  if probe "http://global-headlines:3000/"; then gb=0; gdown=0; \
  else gb=$((gb+1)); [ "$gb" -ge "$THRESHOLD" ] && gdown=1 || gdown=0; fi

  NEW="map \$scheme \$frontend_down { default $fdown; }\nmap \$scheme \$backend_down { default $bdown; }\nmap \$scheme \$global_down { default $gdown; }\n"
  CUR=""
  [ -f "$STATE" ] && CUR=$(cat "$STATE")
  if [ "$NEW" != "$CUR" ]; then
    printf '%b' "$NEW" > "$STATE"
    nginx -s reload 2>/dev/null
  fi
  sleep "$INTERVAL"
done
