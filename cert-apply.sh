#!/usr/bin/env bash
# 申请 Let's Encrypt 证书并启用 HTTPS（webroot 模式，nginx 无需停）
# 前置：DNS 的 @ 与 www 已 A 记录指向本机公网 IP，且 80 端口可达
set -e
cd /root/ai-tools-nav
DOMAIN=www.toolly.cc
EXTRA=toolly.cc
EMAIL=admin@toolly.cc

echo ">>> [1/3] 申请证书 (webroot) ..."
certbot certonly --webroot --webroot-path /var/www/certbot \
  -d "$DOMAIN" -d "$EXTRA" \
  --email "$EMAIL" --agree-tos --non-interactive --no-eff-email \
  --deploy-hook "/bin/sh -c 'cd /root/ai-tools-nav && docker compose exec -T nginx nginx -s reload'"

echo ">>> [2/3] 切换到 HTTPS 配置 ..."
cp nginx/nginx.conf.ssl nginx/nginx.conf
# ⚠️ 绑定挂载（:ro）坑：cp 会替换宿主机文件的 inode，而容器绑定挂的是旧 inode，
# 容器内读到的仍是旧文件，光 reload 不会生效。必须用 --force-recreate 让容器
# 重新挂载当前宿主机文件，nginx 才会真正加载 443 配置。
docker compose up -d --force-recreate nginx

echo ">>> [3/3] 校验 ..."
sleep 3
curl -s -o /dev/null -w "https(www)=%{http_code}\n" https://$DOMAIN/
curl -s -o /dev/null -w "https(root)=%{http_code}\n" https://$EXTRA/
echo "完成：https://$DOMAIN 与 https://$EXTRA 已启用"
