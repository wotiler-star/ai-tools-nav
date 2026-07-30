"use client";

import { SkeletonGrid } from "@/components/Loading";

/**
 * 首页路由级骨架屏：作为路由切换 / 首屏的 Suspense 兜底，
 * 改善首屏感知与导航体验。真实内容由 HomeMagazine 渲染
 * （生产构建 next build && next start 时，内容会随 SSR 流式输出，利于 SEO）。
 */
export default function HomeLoading() {
  return (
    <div className="pb-10">
      {/* Hero 占位 */}
      <section style={{ background: "var(--hero-bg)" }}>
        <div className="container-1200 py-14 text-center">
          <div
            className="skeleton-block"
            style={{ width: 320, height: 24, margin: "0 auto 12px" }}
          />
          <div
            className="skeleton-block"
            style={{ width: 240, height: 14, margin: "0 auto 6px" }}
          />
          <div
            className="skeleton-block"
            style={{ width: 200, height: 14, margin: "0 auto" }}
          />
          <div className="mx-auto mt-8 flex max-w-2xl items-center justify-center">
            <div
              className="skeleton-block"
              style={{ width: "100%", height: 52, borderRadius: 26 }}
            />
          </div>
        </div>
      </section>

      <div className="container-1200 mt-8 space-y-12">
        <section>
          <div
            className="skeleton-block"
            style={{ width: 160, height: 22, marginBottom: 16 }}
          />
          <SkeletonGrid count={8} />
        </section>
        <section>
          <div
            className="skeleton-block"
            style={{ width: 160, height: 22, marginBottom: 16 }}
          />
          <SkeletonGrid count={4} />
        </section>
      </div>
    </div>
  );
}
