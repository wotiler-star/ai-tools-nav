import HomeMagazine from "@/components/home/HomeMagazine";

// 首页为纯静态内容（mock 数据直出，无动态数据获取），
// 显式声明 force-static 让 Next 在构建期预渲染（SSG），
// 首屏/SEO 拿到完整 HTML，构建产物为静态文件。
export const dynamic = "force-static";

export default function HomePage() {
  // 直接渲染 HomeMagazine（客户端组件也由 Next.js 在服务端预渲染），
  // 不再用 <Suspense fallback={null}> 包裹，从而首屏/SEO 拿到完整 HTML。
  // 路由切换时的骨架屏由 app/loading.tsx 提供。
  return <HomeMagazine />;
}
