#!/usr/bin/env bash
set -e
cd /root/ai-tools-nav
DOMAIN=www.starteday.com
EXTRA=starteday.com
EMAIL=admin@starteday.com
echo ">>> [1/3] certbot webroot 申请证书 ..."
certbot certonly --webroot --webroot-path /var/www/certbot \
  -d "$DOMAIN" -d "$EXTRA" \
  --email "$EMAIL" --agree-tos --non-interactive --no-eff-email
echo ">>> [2/3] 并入 443 块并重载 nginx ..."
grep -q "www.starteday.com starteday.com;" nginx/nginx.conf || cat nginx/starteday-443.block >> nginx/nginx.conf
docker compose up -d --force-recreate nginx
echo ">>> [3/3] 校验 ..."
sleep 3
curl -s -o /dev/null -w "https(www)=%{http_code}\n" https://$DOMAIN/
curl -s -o /dev/null -w "https(root)=%{http_code}\n" https://$EXTRA/
echo "完成"
