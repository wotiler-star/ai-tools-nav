#!/usr/bin/env bash
# AI 导航站 —— 一键部署脚本（腾讯云轻量应用服务器 / 任意 Linux + Docker 环境）
# 前置：
#   1. 服务器已装 docker + docker compose，防火墙放行 80/443
#   2. 域名 www.toolly.cc / toolly.cc 的 A 记录已指向本机公网 IP
# 用法：在服务器上 clone 本仓库后执行  bash deploy.sh

set -euo pipefail

DOMAIN="www.toolly.cc"
EXTRA="toolly.cc"
EMAIL="admin@toolly.cc"
COMPOSE="docker compose"

echo "==> [1/5] 拉取最新代码"
git pull --ff-only || true

echo "==> [2/5] 构建并启动 数据库/缓存/后端/前端（先不起 nginx，独占 80 端口申请证书）"
$COMPOSE up -d --build mysql redis backend frontend

echo "==> [3/5] certbot 申请 Let's Encrypt 证书（standalone 模式，临时占用 80）"
docker run --rm -p 80:80 \
  -v /etc/letsencrypt:/etc/letsencrypt \
  certbot/certbot certonly --standalone \
  -d "$DOMAIN" -d "$EXTRA" \
  --non-interactive --agree-tos -m "$EMAIL"

echo "==> [4/5] 切换到 webroot 续期方式（避免日后续期与 nginx 争抢 80 端口）"
docker run --rm \
  -v /etc/letsencrypt:/etc/letsencrypt \
  -v /var/www/certbot:/var/www/certbot \
  certbot/certbot certonly --webroot --webroot-path /var/www/certbot \
  -d "$DOMAIN" -d "$EXTRA" --non-interactive --force-renewal
$COMPOSE up -d nginx
$COMPOSE exec nginx nginx -s reload

echo "==> [5/5] 完成。访问 https://$DOMAIN"
echo
echo "【证书自动续期】建议加入 crontab（certbot 默认 90 天有效）："
echo "  0 3 * * * docker run --rm -v /etc/letsencrypt:/etc/letsencrypt -v /var/www/certbot:/var/www/certbot certbot/certbot renew && $COMPOSE exec nginx nginx -s reload"
