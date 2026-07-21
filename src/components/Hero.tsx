import Link from "next/link";
import { Search, TrendingUp } from "lucide-react";
import { hotWords } from "@/lib/mock-data";

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background:
          "radial-gradient(1200px 400px at 50% -10%, var(--primary-soft), transparent)",
      }}
    >
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          发现最好的 <span style={{ color: "var(--primary)" }}>AI 工具</span>
        </h1>
        <p className="mt-3 text-base" style={{ color: "var(--text-muted)" }}>
          精选全球优质 AI 工具，配社区、资讯与提示词广场，一站直达。
        </p>

        <form
          action="/search"
          method="get"
          className="mt-7 mx-auto flex items-center gap-2 max-w-xl px-4 h-12 rounded-full border shadow-sm"
          style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
        >
          <Search size={20} style={{ color: "var(--text-muted)" }} />
          <input
            name="q"
            placeholder="搜索 AI 写作、绘画、视频工具…"
            className="flex-1 bg-transparent outline-none text-base"
            autoFocus
          />
          <button type="submit" className="btn-primary">
            搜索
          </button>
        </form>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
            <TrendingUp size={14} /> 热门：
          </span>
          {hotWords.map((w) => (
            <Link key={w} href={`/search?q=${encodeURIComponent(w)}`} className="chip">
              {w}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
