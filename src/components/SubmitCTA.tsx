import Link from "next/link";
import { PlusCircle, Mail } from "lucide-react";

export default function SubmitCTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div
        className="card p-8 text-center flex flex-col items-center gap-4"
        style={{ background: "var(--primary-soft)" }}
      >
        <h2 className="text-2xl font-bold">发现好用的 AI 工具？</h2>
        <p style={{ color: "var(--text-muted)" }}>
          提交给社区，或订阅每周 AI 工具周报，不错过新物种。
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/submit" className="btn-primary flex items-center gap-1">
            <PlusCircle size={16} /> 提交工具
          </Link>
          <form className="flex items-center gap-2">
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="h-10 px-4 rounded-full border text-sm outline-none"
              style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
            />
            <button className="btn-primary flex items-center gap-1" type="submit">
              <Mail size={16} /> 订阅
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
