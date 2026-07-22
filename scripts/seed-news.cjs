// AI 资讯种子数据：用 CommonJS 直接 require Prisma Client，按 slug 幂等 upsert。
// 本地运行：  DATABASE_URL="file:<项目>/prisma/dev.db" node scripts/seed-news.cjs
// 服务器运行：DATABASE_URL="file:C:/www/ai-tools-nav/prisma/dev.db" node seed-news.cjs
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const NEWS = [
  {
    slug: "openai-multimodal-model",
    title: "OpenAI 发布多模态新模型，推理成本下降 60%",
    summary: "新模型在保持质量的同时大幅压缩推理开销，开发者可直接调用，性价比显著提升。",
    source: "OpenAI Blog",
    sourceUrl: "https://openai.com/blog",
    cover: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)",
    tags: ["AI", "大模型", "产品"],
    publishedAt: "2026-07-21T08:00:00Z",
    content:
      "OpenAI 今日发布新一代多模态模型，在图像、音频与文本的统一推理上取得明显进展。官方表示，新模型在多项基准测试中持平甚至超过上一代，而单位 token 的推理成本下降了约 60%，这意味着同等预算下开发者可以支撑更大规模的调用。\n\n值得注意的是，新模型对工具调用与函数编排更加稳定，适合构建复杂的 Agent 工作流。API 已向所有付费层级开放，并提供了更低延迟的流式接口。\n\n对于中小团队而言，推理成本的下探将显著降低试错门槛，预计会带动一波多模态应用的落地潮。",
  },
  {
    slug: "china-llm-filing-12",
    title: "国内大模型备案再添 12 家，行业进入精细化监管",
    summary: "监管框架进一步明确，中小企业合规路径更清晰，行业走向规范发展。",
    source: "智东西",
    sourceUrl: "https://www.zhidx.com",
    cover: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
    tags: ["监管", "大模型", "政策"],
    publishedAt: "2026-07-20T18:30:00Z",
    content:
      "最新一批生成式人工智能服务备案名单公布，共新增 12 家企业的模型完成备案。至此，国内通过备案的大模型数量持续上升，覆盖通用对话、代码、垂直行业等多个方向。\n\n业内分析认为，备案制度的常态化让合规路径更加清晰：企业可在早期就对照安全与内容要求做设计，减少上线后的整改成本。与此同时，监管也开始从「有没有备案」转向「用得好不好」，对内容安全、数据来源提出更细的要求。\n\n对开发者来说，选择已备案的基础模型进行二次开发，能更快通过审核、缩短上线周期。",
  },
  {
    slug: "ai-video-image-to-video",
    title: "AI 视频生成赛道升温，图生视频成竞争焦点",
    summary: "从文生视频到图生视频，可控性成为竞争焦点，多家厂商密集上新。",
    source: "机器之心",
    sourceUrl: "https://www.jiqizhixin.com",
    cover: "linear-gradient(135deg, #c31432 0%, #240b36 100%)",
    tags: ["AI视频", "产品", "生成式"],
    publishedAt: "2026-07-20T10:15:00Z",
    content:
      "过去一个月，AI 视频生成领域密集发布新能力，竞争焦点从「文生视频」快速转向「图生视频」与「视频编辑」。厂商们比拼的不再只是画面质量，而是对角色一致性、镜头运动和风格迁移的可控程度。\n\n图生视频之所以重要，是因为它把创作者的已有素材（分镜、角色设定、品牌元素）直接接入生成流程，更贴近真实生产。多家工具已支持基于首帧或参考图生成连贯片段，并能在后期用自然语言做局部修改。\n\n可以预见，短视频、广告与电商素材生产将率先受益，但版权与肖像权仍是绕不开的合规议题。",
  },
  {
    slug: "claude-code-migration",
    title: "Claude Code 推出官方大规模代码迁移教程",
    summary: "规则驱动、试跑验证、多 Agent 流水线，几万行项目重构有章法。",
    source: "Anthropic Blog",
    sourceUrl: "https://www.anthropic.com/news",
    cover: "linear-gradient(135deg, #42275a 0%, #734b6d 100%)",
    tags: ["Claude", "AI编程", "教程"],
    publishedAt: "2026-07-19T22:00:00Z",
    content:
      "Anthropic 发布《六步迁移法》官方教程，系统性地讲解如何用 Claude Code 完成大型代码库的现代重构。教程强调先把规则写清楚（编码规范、目录约定、禁改范围），再让模型在受控范围内小步试跑。\n\n核心思路是「规则驱动 + 试跑验证 + 多 Agent 流水线」：把迁移拆成可独立验证的任务，每个任务由独立 Agent 执行，主流程负责汇总与回滚。这样即使某一步出错，也能定位到具体模块。\n\n对于几万行以上的遗留项目，这种分治策略比一次性「大改写」稳妥得多，也更容易被团队接受。",
  },
  {
    slug: "alibaba-qianwen-office",
    title: "阿里整合智能体业务，传将推「千问办公」",
    summary: "钉钉新任 CEO 负责，企业级 AI 办公整合提速，剑指协同赛道。",
    source: "36氪",
    sourceUrl: "https://36kr.com",
    cover: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
    tags: ["阿里", "智能体", "AI办公"],
    publishedAt: "2026-07-19T15:20:00Z",
    content:
      "据多家媒体报道，阿里巴巴正在将分散在各业务的智能体能力进行整合，并筹备面向企业的「千问办公」产品。新架构由钉钉团队牵头，目标是把对话、文档、日程与业务流程打通为一个统一的 AI 助手。\n\n在企业级市场，单点工具已经无法满足需求，客户更看重「能直接干活」的 Agent——例如自动整理会议纪要、生成周报、跨系统查询数据。整合后的产品有望把这些能力沉淀为可配置的智能体。\n\n这也意味着协同办公赛道竞争将进一步白热化，飞书、企业微信等玩家都将面临来自大模型原厂的直接挑战。",
  },
  {
    slug: "microsoft-outlook-ai-draft",
    title: "微软 Outlook 年内引入 AI 自动起草邮件",
    summary: "AI 起草、智能摘要将进入数亿用户的日常邮箱，办公场景全面智能化。",
    source: "The Verge",
    sourceUrl: "https://www.theverge.com",
    cover: "linear-gradient(135deg, #0c3483 0%, #a2b6df 100%)",
    tags: ["微软", "AI办公", "产品"],
    publishedAt: "2026-07-19T09:40:00Z",
    content:
      "微软宣布将在年内为经典版 Outlook 引入 AI 自动起草与智能摘要功能。据演示，用户只需给出简短意图，模型即可生成措辞得体的邮件草稿，并能根据往来邮件自动提炼要点。\n\n该功能将随 Microsoft 365 订阅逐步推送，意味着全球数亿办公用户将在日常邮箱中直接体验 AI 写作。微软强调，草稿默认由用户审阅后再发送，并提供了清晰的来源标注。\n\n办公套件正成为大模型最天然的落地场景之一：高频、刚需、且容错空间相对友好。",
  },
  {
    slug: "agent-benchmark-search",
    title: "面向搜索的智能体评测基准发布",
    summary: "新基准强调可溯源与可复现，用知识图谱校准能力认知，缓解「刷分」幻觉。",
    source: "arXiv Daily",
    sourceUrl: "https://arxiv.org",
    cover: "linear-gradient(135deg, #2d1b69 0%, #11998e 100%)",
    tags: ["评测", "智能体", "研究"],
    publishedAt: "2026-07-18T20:10:00Z",
    content:
      "一项新的智能体评测基准在 arXiv 公开，专门面向「带检索的搜索型 Agent」。与过往偏重最终答案准确率的做法不同，该基准要求模型给出可追溯的引用链条，并用知识图谱校验中间推理步骤。\n\n研究者指出，单纯比拼准确率容易催生「刷分」行为，而引入溯源与可复现约束，能更真实地反映模型在开放搜索任务中的可靠性。基准还提供了可复现的评测脚本，方便社区横向对比。\n\n这类更严谨的评测，有望成为企业选型 Agent 框架的重要参考。",
  },
  {
    slug: "tencent-music-ai",
    title: "腾讯音乐推出 AI 音乐创作工具",
    summary: "人声、编曲、混音一体化，一句话出歌，降低音乐创作门槛。",
    source: "音乐先声",
    sourceUrl: "https://www.sohu.com",
    cover: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
    tags: ["腾讯", "AI音乐", "产品"],
    publishedAt: "2026-07-18T14:05:00Z",
    content:
      "腾讯音乐旗下推出首款 AI 音乐创作工具，用户用一句话描述风格与主题，即可生成包含人声、编曲与混音的完整歌曲。工具还支持对生成结果做局部调整，例如更换曲风、改写歌词。\n\n对普通用户而言，这意味着无需乐理基础也能快速产出可听 demo；对音乐人而言，它更像是一个高效的灵感与伴奏生成器，能显著缩短从想法到样带的距离。\n\n当然，生成内容的版权归属与平台分成机制，仍是与创作者利益息息相关的关键问题。",
  },
  {
    slug: "open-source-ai-skill-discovery",
    title: "开源社区上线 AI Skill 自动发现工具",
    summary: "自动识别 GitHub 仓库中的可复用 Skill 与全栈应用骨架，提升开发效率。",
    source: "Hacker News",
    sourceUrl: "https://news.ycombinator.com",
    cover: "linear-gradient(135deg, #1f4037 0%, #99f2c8 100%)",
    tags: ["开源", "Skill", "开发者"],
    publishedAt: "2026-07-18T11:30:00Z",
    content:
      "一个开源项目在 Hacker News 引发关注：它能自动分析 GitHub 仓库，识别出其中可复用的「Skill」（技能包）以及完整的全栈应用骨架，并生成结构化索引。\n\n作者表示，许多优秀的能力其实散落在各类仓库里，但缺少统一发现机制。该工具通过静态分析与依赖识别，把仓库自动归纳成可直接安装的 Skill，降低了复用门槛。\n\n社区反馈积极，也有人提醒需注意许可证合规与依赖安全，避免「一键引入」带来的供应链风险。",
  },
  {
    slug: "stanford-ai-coding-course",
    title: "斯坦福开设 AI 编程公开课",
    summary: "现代软件开发者课程面向零基础，课件、阅读材料与作业全部公开免费。",
    source: "MIT Technology Review",
    sourceUrl: "https://www.technologyreview.com",
    cover: "linear-gradient(135deg, #16222a 0%, #3a6073 100%)",
    tags: ["课程", "AI编程", "教育"],
    publishedAt: "2026-07-17T19:00:00Z",
    content:
      "斯坦福推出一门面向零基础的「现代软件开发者」公开课，系统讲解在 AI 辅助下从需求拆解到上线维护的完整路径。课程配套 PPT、阅读材料与编程作业全部公开，可免费自学。\n\n与传统编程课不同，这门课把 AI 编程助手作为「默认协作伙伴」来教：如何清晰地描述需求、如何审查模型生成的代码、如何在关键模块保持人类把关。\n\n在 AI 大幅降低编码门槛的当下，这类课程的意义不仅在于「学会写代码」，更在于培养对软件工程整体负责的能力。",
  },
];

async function main() {
  // 确保 news 表存在（服务器旧库可能早于该模型创建；本地已存在则 IF NOT EXISTS 跳过）
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "news" (
      "id" TEXT PRIMARY KEY,
      "title" TEXT NOT NULL,
      "slug" TEXT NOT NULL,
      "summary" TEXT NOT NULL,
      "content" TEXT NOT NULL,
      "source" TEXT NOT NULL,
      "source_url" TEXT,
      "cover" TEXT,
      "tags" TEXT NOT NULL,
      "views" INTEGER NOT NULL,
      "likes" INTEGER NOT NULL,
      "published" BOOLEAN NOT NULL,
      "publishedAt" DATETIME NOT NULL,
      "createdAt" DATETIME NOT NULL,
      "updatedAt" DATETIME NOT NULL,
      "authorId" TEXT,
      "authorName" TEXT NOT NULL
    );
  `);
  await prisma.$executeRawUnsafe(
    `CREATE UNIQUE INDEX IF NOT EXISTS "news_slug_key" ON "news"("slug");`
  );

  let ok = 0;
  for (const n of NEWS) {
    await prisma.news.upsert({
      where: { slug: n.slug },
      update: {
        title: n.title,
        summary: n.summary,
        source: n.source,
        sourceUrl: n.sourceUrl,
        cover: n.cover,
        tags: JSON.stringify(n.tags),
        content: n.content,
        published: true,
        publishedAt: new Date(n.publishedAt),
      },
      create: {
        title: n.title,
        slug: n.slug,
        summary: n.summary,
        source: n.source,
        sourceUrl: n.sourceUrl,
        cover: n.cover,
        tags: JSON.stringify(n.tags),
        content: n.content,
        published: true,
        publishedAt: new Date(n.publishedAt),
        authorName: "AI 导航",
      },
    });
    ok++;
  }
  console.log(`SEED_OK count=${ok}`);
}

main()
  .catch((e) => {
    console.error("SEED_FAIL", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
