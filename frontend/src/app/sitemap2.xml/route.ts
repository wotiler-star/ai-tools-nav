/**
 * sitemap2.xml —— 全新路径的 sitemap（2026-11-27）
 *
 * 背景：GSC 中 /sitemap.xml 的提交记录卡在「无法抓取」状态，
 * 判失败后 Google 不再重试，而该记录在界面上无法删除。
 * 新建一条全新 URL 的 sitemap，让用户在 GSC「新增提交」，
 * 强制 Google 重新排队抓取，绕开卡住的旧记录。
 *
 * 内容与原 sitemap.xml 完全一致（复用同一 GET handler），
 * 所有 loc 仍指向 www.toolly.cc，不改变收录目标。
 */
export { GET } from "../sitemap.xml/route";
export const dynamic = "force-dynamic";
