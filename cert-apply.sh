#!/usr/bin/env bash
# 申请 Let's Encrypt 证书并启用 HTTPS（webroot 模式，nginx 无需停）
# 前置：DNS 的 @ 与 www 已 A 记录指向本机公网 IP，且 80 端口可达
set -e
cd /root/ai-tools-nav
DOMAIN=www.startoday.cc
EXTRA=startoday.cc
EMAIL=admin@startoday.cc

echo ">>> [1/3] 申请证书 (webroot) ..."
certbot certonly --webroot --webroot-path /var/www/certbot \
  -d "$DOMAIN" -d "$EXTRA" \
  --email "$EMAIL" --agree-tos --non-interactive --no-eff-email \
  --deploy-hook "cd /root/ai-tools-nav && docker compose exec -T nginx nginx -s reload"

echo ">>> [2/3] 切换到 HTTPS 配置 ..."
cp nginx/nginx.conf.ssl nginx/nginx.conf
docker compose up -d nginx

echo ">>> [3/3] 校验 ..."
sleep 3
curl -s -o /dev/null -w "https=%{http_code}\n" https://$DOMAIN/
echo "完成：https://$DOMAIN 与 https://$EXTRA 已启用"
