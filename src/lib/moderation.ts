// 简易内容审核：敏感词过滤 + 新用户首帖待审标记。
// 生产环境应替换为专业内容安全服务（如腾讯云天御 / 数美）。
const SENSITIVE = ["暴力", "色情", "赌博", "诈骗", "代开发票", "私彩"];

export function moderate(text: string): { ok: boolean; clean: string; hit: string[] } {
  const hit: string[] = [];
  let clean = text;
  for (const w of SENSITIVE) {
    if (clean.includes(w)) {
      hit.push(w);
      clean = clean.split(w).join("***");
    }
  }
  return { ok: hit.length === 0, clean, hit };
}

// 演示：未登录用户视为新用户，首帖需审核
export function isNewUser(authed: boolean) {
  return !authed;
}
