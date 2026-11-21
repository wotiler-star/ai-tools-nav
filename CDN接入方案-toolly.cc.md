# toolly.cc CDN 接入方案（根治晚高峰"打不开"）

> 2026-11-13 整理。目标：消除大陆用户晚高峰访问首尔源站时的 TLS 握手 6s+、偶发超时。
> 2026-11-21 更新：前置检查已全部完成，方案仍适用，只差账号/控制台授权即可开工（见文末「零、前置检查」）。

## 零、前置检查（2026-11-21 实测，全部通过）
| 项 | 实测结果 | 结论 |
|---|---|---|
| DNS 解析 | `@`/`www` 均 A → `43.155.171.45` | 源站直连，无 CDN，与方案一致 |
| 权威 NS | `zinc.dnspod.net` / `sturgeon.dnspod.net` | 仍托管 DNSPod，无需迁移 |
| 证书 | Let's Encrypt，`notAfter=2027-01-30`（约 70 天） | 有效期充足 |
| 源站响应头 | `Server: nginx/1.27.5`、无 CDN 标识、`Cache-Control: private, no-store` | 无 CDN；SSR 的 no-store 必须在 EO 保留 |
| ACME webroot | nginx `/.well-known/acme-challenge/` → `/var/www/certbot`；放测试 token 经 HTTP 抓取返回 **200** | HTTP-01 续期链路健康 |
| certbot | v0.40，webroot 验证 + `renew_hook` 自动 reload nginx | 正常；dry-run 因随机延迟机制未跑完，但 webroot 实测已证明可达 |

**结论**：接入前的技术准备全部就绪，唯一缺口是 **EdgeOne 账号开通 + DNSPod 改解析的权限**（见第七节）。接入时务必在 EO 把 `/.well-known/acme-challenge/*` 设为「不缓存 + 回源」，否则证书续期会断（见第五节坑 1）。

## 一、问题定性（已实测）

| 时间点 | 现象 | 数据 |
|---|---|---|
| 11-12 23:20 晚高峰 | 外网访问慢、偶发超时 | TLS 握手 0.67~6.41s，TTFB 1.41~11.25s，`/essay` 曾 15s 超时 |
| 同一时刻·服务器自测 | 完全正常 | TLS 20ms，TTFB 90ms；nginx→frontend 仅 9ms；容器全部 healthy |
| 11-13 12:42 白天 | 正常 | TLS 0.20~0.27s，TTFB 0.38~0.47s |

结论：**站点没有宕机，瓶颈是大陆 → 腾讯云首尔（ap-seoul，43.155.171.45）的跨境链路晚高峰拥塞**。白天一切正常，说明优化方向是"让用户就近接入边缘节点"，而不是加服务器资源。

已完成的第一层缓解：nginx 对 ClaudeBot 等 AI 爬虫限流 1r/s（服务器 `c8e3950`、本地 `32b095c`），避免同机 starteday.com 被爬虫刷量抢带宽。

## 二、现状盘点

| 项 | 值 |
|---|---|
| DNS 托管 | 腾讯云 DNSPod（`zinc.dnspod.net` / `sturgeon.dnspod.net`） |
| 解析 | `@` 与 `www` 均为 A → 43.155.171.45；无 MX/TXT 记录，根域可安全改 CNAME |
| 源站 | nginx 1.27.5（Docker `ai-nav-nginx`）→ `ai-nav-frontend:3000` |
| 证书 | Let's Encrypt，`certbot --webroot` HTTP-01 续期（有效期至 2027-01-30） |
| 页面特性 | Next.js SSR，HTML 返回 `Cache-Control: private, no-store` + `Vary: RSC, Next-Router-State-Tree...` |
| 当前 CDN | 无（响应头无 CDN 标识） |

## 三、推荐方案：EdgeOne 免费版（国际站）+ CNAME 接入

理由（据腾讯云国际站 2026-04 官方说明）：免费永久、无需信用卡、**含中国大陆运营商直连节点且不需要 ICP 备案**、自带免费 SSL 与 AI 爬虫控制；支持 CNAME 接入，不必把 DNS 从 DNSPod 迁走。官方给出大陆访问对比约 5.5~7.5s → 0.8~1.3s。

不推荐 Cloudflare 免费版作首选：大陆无直连节点，晚高峰未必改善（官方对比页也指出国内约 5-8s）。

> ⚠️ 备案口径有分歧：腾讯云**中国站** EO 文档要求"中国大陆可用区"必须 ICP 备案；**国际站**免费版说明"无需备案"。因此走国际站免费版；若控制台提示必须备案，先选「全球可用区（不含中国大陆）」做 A/B 测试，再决定。

## 四、接入步骤（按顺序）

1. **开通**：注册 EdgeOne 国际站账号 → 领 Free Plan → 添加站点 `toolly.cc`，选 **CNAME 接入**，按提示加 TXT 记录验证归属（DNSPod 里加，验证完可留着）。
2. **加速区域**：全球（含中国大陆）；如被备案校验拦住，改选不含中国大陆区域。
3. **源站配置**：回源地址 `43.155.171.45`，**回源协议 HTTPS + 端口 443 + 回源 SNI `toolly.cc`**（源站 80 端口会 301 跳 HTTPS，用 HTTP 回源会造成重定向循环）。边缘 HTTPS 证书用 EO 免费自动签发；源站 LE 证书保持不变。
4. **缓存规则**（关键，SSR 站不能整站缓存）：
   - HTML / RSC（`Vary: RSC`）→ **不缓存，透传**，遵守源站 `no-store`；
   - `/_next/static/*`、`/_next/image*`、图片/CSS/JS/字体 → 缓存，长 TTL；
   - 保留 `Vary: RSC, Next-Router-State-Tree, Next-Router-Prefetch` 响应头，否则客户端导航会拿到错内容。
5. **DNS 切换**（DNSPod）：把 `@` 与 `www` 的 A 记录改为 EO 分配的 CNAME。TTL 先调到 600s 便于回滚。**先只切 `www`，验证 30 分钟无异常后再切根域**。
6. **验收**：
   - `curl -I https://toolly.cc/` 应出现 EdgeOne 响应标识，且 HTML 仍带 `Cache-Control: private, no-store`；
   - 晚高峰（21:00-24:00）从大陆复测 10 次，记录 TLS/TTFB，目标 TTFB < 1.5s 且无超时；
   - 关键页 200：`/ /news /tool /mcp /resource/learn /essay /skills /painting`；
   - 客户端导航（点分类/翻页）不出现白屏或旧数据。

## 五、三个必须提前处理的坑

1. **证书续期会断**：`certbot --webroot` 的 HTTP-01 挑战走 `/.well-known/acme-challenge/`，被 CDN 代理后可能拿不到源站文件。二选一：① 在 EO 规则里把该路径设为「不缓存/直连源站」并放行 80 端口；② 改用 **DNS-01** 挑战（DNSPod 有 certbot 插件，长期更稳）。切 DNS 前务必先 `certbot renew --dry-run` 验证。
2. **爬虫限流的 key 会变**：当前 nginx 用 `$binary_remote_addr` 做 bot 限流 key。接入 CDN 后看到的是边缘节点 IP，所有爬虫共享一个 IP（限得更狠，符合预期），普通用户 key 为空不受影响，所以**不用改配置**。但如果以后要给普通用户加按 IP 限流，必须先配 `set_real_ip_from <EdgeOne IP 段>` + `real_ip_header X-Forwarded-For`，否则会误封全部用户；不要提前开启信任，否则可伪造 XFF 绕过限流。
3. **nginx 配置是单文件 bind mount**：宿主机源 `/root/ai-tools-nav/nginx/nginx.conf` → 容器 `/etc/nginx/conf.d/default.conf`，容器绑定的是旧 inode。改完宿主机文件后 `nginx -s reload` 读到的仍是旧内容，必须 `docker restart ai-nav-nginx`（中断 1~2s）才生效。改前先备份，改后用 `docker exec ai-nav-nginx grep -c "目标指令" ...` 确认容器内确实加载了新配置。

## 六、回滚

DNSPod 把 `@` / `www` 改回 A → `43.155.171.45`，TTL 600s 生效；源站与 nginx 无需任何改动。EO 侧站点可保留不删。

## 七、需要你提供的（前置检查已完成，只差这一步）

当前会话**没有可操作的 EdgeOne CDN 工具**（`edgeone-pages` 是静态托管、非 CDN 加速且未连接），所以下面三项必须你来，或给我控制台操作授权：

1. **EdgeOne 国际站免费套餐**：注册并开通，添加站点 `toolly.cc`（CNAME 接入）。若不方便操作，给我账号我来做。
2. **DNSPod 改解析权限**：EO 验证归属后会分配一个 CNAME 目标值（形如 `xxx.eo.dnse3.com`）。**把这个 CNAME 值发我**，我立即给你精确的改记录清单（`@` 与 `www` 两条，TTL 先设 600s，先切 `www` 观察 30 分钟再切根域）。或者你自己在 DNSPod 改也行。
3. **ICP 备案状态**：确认 `toolly.cc` 是否已有 ICP 备案 —— 决定加速区域选「全球（含中国大陆）」还是「不含中国大陆」。国际站免费版据称无需备案，但控制台若拦截需据实调整。

> 你只要回复「①已开通，CNAME 是 xxx」+「②备案：有/无」，我就能立刻把 DNS 切换 + 缓存规则 + 验收这一整套落地。若你愿意给 EdgeOne/DNSPod 控制台授权，我可以从开通到切换全程代劳。

## 八、备选（若不做 CDN）

- **迁站**：把前端迁到大陆服务器 + ICP 备案，最彻底但工作量最大；
- **现状容忍**：白天与凌晨体验正常，晚高峰仅偶发慢；已有限流兜底；
- **HTTP/3(QUIC) 实验**：nginx 1.27 可开 `listen 443 quic`，对丢包链路有帮助，但需要同时调整防火墙 UDP 443，收益不如 CDN 确定。
