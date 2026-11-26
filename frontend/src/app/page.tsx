/**
 * 首页路由页 —— 直接把 async HomeMagazine 作为路由页本体。
 * 关键（SSR/SEO）：Next 14 中只有「路由 page 本身 async」才会 await 取数后把正文直出到 DOM；
 * 若把 async 组件当作 page 的子组件（<HomeMagazine/>），它会被 Suspense 边界包裹，
 * 正文序列化进 RSC flight，Googlebot 只看到导航壳（实测 DOM 0 article / 0 h3 / 0 工具卡）。
 */
export const dynamic = "force-dynamic";

export { default } from "@/components/home/HomeMagazine";
