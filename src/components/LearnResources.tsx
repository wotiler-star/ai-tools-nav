import { learns } from "@/lib/mock-data";

// 鱼皮风格：AI 学习教程 / AI 项目课程 / AI 知识百科（卡片网格）
export default function LearnResources() {
  return (
    <section id="learn" className="mx-auto max-w-7xl px-4 py-8 scroll-mt-20">
      <div className="flex items-end justify-between mb-5">
        <h2 className="text-xl font-bold">
          AI 学习教程{" "}
          <span className="text-base font-normal" style={{ color: "var(--text-muted)" }}>
            / AI 项目课程 / AI 知识百科
          </span>
        </h2>
        <a href="#learn" className="text-sm hover:underline" style={{ color: "var(--primary)" }}>
          加载更多 →
        </a>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {learns.map((l) => (
          <a
            key={l.id}
            href={l.href}
            className="card p-4 flex flex-col gap-2 hover:-translate-y-0.5 transition"
          >
            <span className="chip self-start">{l.tag}</span>
            <h3 className="font-semibold leading-snug">{l.title}</h3>
            <p className="text-sm line-clamp-3" style={{ color: "var(--text-muted)" }}>
              {l.summary}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}
