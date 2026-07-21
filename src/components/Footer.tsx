import Link from "next/link";
import { categories } from "@/lib/mock-data";

export default function Footer() {
  return (
    <footer
      className="border-t mt-16"
      style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
    >
      <div className="mx-auto max-w-7xl px-4 py-10 grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-bold text-lg mb-3">
            <span>🧭</span> AI 导航
          </div>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            发现最好的 AI 工具，与社区一起成长。
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-sm">全部分类</h4>
          <ul className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
            {categories.slice(0, 8).map((c) => (
              <li key={c.slug}>
                <Link href={`/category/${c.slug}`} className="hover:text-[var(--primary)]">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-sm">快捷入口</h4>
          <ul className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
            <li><Link href="/rankings" className="hover:text-[var(--primary)]">排行榜</Link></li>
            <li><Link href="/new" className="hover:text-[var(--primary)]">最新收录</Link></li>
            <li><Link href="/community" className="hover:text-[var(--primary)]">交流社区</Link></li>
            <li><Link href="/submit" className="hover:text-[var(--primary)]">提交工具</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-sm">关于</h4>
          <ul className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
            <li><Link href="/about" className="hover:text-[var(--primary)]">关于我们</Link></li>
            <li><Link href="/about#privacy" className="hover:text-[var(--primary)]">隐私政策</Link></li>
            <li><Link href="/about#contact" className="hover:text-[var(--primary)]">联系我们</Link></li>
          </ul>
        </div>
      </div>
      <div
        className="border-t py-4 text-center text-xs"
        style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
      >
        © {new Date().getFullYear()} AI 导航 · 仅供学习演示
      </div>
    </footer>
  );
}
