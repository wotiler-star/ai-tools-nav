import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const mcpServers = [
  { name: "Filesystem MCP", slug: "filesystem-mcp", summary: "本地文件读写、搜索与目录管理，让 AI 安全操作工作区文件。", logo: "📁", category: "文件系统", tags: ["文件", "本地", "工具"], url: "https://github.com/modelcontextprotocol/servers", stars: 12400, installs: 89000, featured: true },
  { name: "PostgreSQL MCP", slug: "postgresql-mcp", summary: "把数据库变成自然语言接口，AI 可直接查询与写入结构化数据。", logo: "🐘", category: "数据库", tags: ["SQL", "数据", "查询"], url: "https://github.com/modelcontextprotocol/servers", stars: 9800, installs: 62000, featured: true },
  { name: "GitHub MCP", slug: "github-mcp", summary: "让 AI 读写仓库、管理 Issue 与 PR，实现自动化代码协作。", logo: "🐙", category: "开发协作", tags: ["Git", "代码", "CI"], url: "https://github.com/github/github-mcp-server", stars: 15300, installs: 101000, featured: true },
  { name: "Fetch MCP", slug: "fetch-mcp", summary: "把任意网页 URL 转为干净的 Markdown，供模型检索与总结。", logo: "🌐", category: "网络", tags: ["抓取", "网页", "RAG"], url: "https://github.com/modelcontextprotocol/servers", stars: 7100, installs: 48000, featured: false },
  { name: "Slack MCP", slug: "slack-mcp", summary: "连接团队频道，AI 可发消息、检索历史、触发自动化流程。", logo: "💬", category: "办公协作", tags: ["IM", "通知", "协作"], url: "https://github.com/modelcontextprotocol/servers", stars: 5400, installs: 37000, featured: false },
  { name: "Puppeteer MCP", slug: "puppeteer-mcp", summary: "浏览器自动化，AI 可点击、填表、截图，完成端到端网页任务。", logo: "🎭", category: "浏览器", tags: ["自动化", "测试", "RPA"], url: "https://github.com/modelcontextprotocol/servers", stars: 6600, installs: 41000, featured: false },
  { name: "Notion MCP", slug: "notion-mcp", summary: "打通知识库，AI 可读取与更新页面、数据库和文档。", logo: "📝", category: "知识管理", tags: ["笔记", "知识库", "文档"], url: "https://github.com/modelcontextprotocol/servers", stars: 8200, installs: 55000, featured: false },
  { name: "SearXNG MCP", slug: "searxng-mcp", summary: "隐私优先的聚合搜索服务，为 AI 提供多源检索能力。", logo: "🔍", category: "搜索", tags: ["搜索", "聚合", "隐私"], url: "https://github.com/modelcontextprotocol/servers", stars: 3900, installs: 26000, featured: false },
];

const skills = [
  { name: "doc-writer", slug: "doc-writer", summary: "长文写作助手：从大纲到成稿，自动分段、润色与引用核查。", logo: "📄", category: "写作", tags: ["文档", "写作", "润色"], installCmd: "npx skills add doc-writer", author: "AI 导航", uses: 4200, featured: true },
  { name: "code-reviewer", slug: "code-reviewer", summary: "代码评审专家：指出性能、安全、可维护性缺陷并给出改进方案。", logo: "🔍", category: "编程", tags: ["代码", "评审", "质量"], installCmd: "npx skills add code-reviewer", author: "AI 导航", uses: 5800, featured: true },
  { name: "image-prompt", slug: "image-prompt", summary: "把一句话需求翻译成高质量 Midjourney / 即梦绘图提示词。", logo: "🎨", category: "绘画", tags: ["提示词", "绘画", "生图"], installCmd: "npx skills add image-prompt", author: "AI 导航", uses: 3100, featured: true },
  { name: "sql-genius", slug: "sql-genius", summary: "自然语言转 SQL，支持复杂联表、窗口函数与执行计划解读。", logo: "🗄️", category: "数据", tags: ["SQL", "数据库", "分析"], installCmd: "npx skills add sql-genius", author: "AI 导航", uses: 2900, featured: false },
  { name: "meeting-notes", slug: "meeting-notes", summary: "会议录音转结构化纪要：决议、待办、负责人与跟进时间。", logo: "🎙️", category: "办公", tags: ["纪要", "办公", "效率"], installCmd: "npx skills add meeting-notes", author: "AI 导航", uses: 2400, featured: false },
  { name: "translator", slug: "translator", summary: "保留术语与语气的高质量互译，支持 30+ 语种与本地化风格。", logo: "🌍", category: "语言", tags: ["翻译", "语言", "本地化"], installCmd: "npx skills add translator", author: "AI 导航", uses: 3600, featured: false },
  { name: "research-assistant", slug: "research-assistant", summary: "联网检索 + 多源摘要，自动生成带引用的研究报告。", logo: "📚", category: "研究", tags: ["检索", "研究", "引用"], installCmd: "npx skills add research-assistant", author: "AI 导航", uses: 4700, featured: false },
  { name: "ppt-builder", slug: "ppt-builder", summary: "根据主题一键生成大纲、配图建议与逐页讲稿的演示文稿。", logo: "📊", category: "办公", tags: ["PPT", "演示", "排版"], installCmd: "npx skills add ppt-builder", author: "AI 导航", uses: 2100, featured: false },
];

const categories = [
  { slug: "writing", name: "AI 写作", icon: "✍️", desc: "文案、润色、创作" },
  { slug: "image", name: "AI 绘画", icon: "🎨", desc: "文生图、风格迁移" },
  { slug: "video", name: "AI 视频", icon: "🎬", desc: "生成、剪辑、配音" },
  { slug: "office", name: "AI 办公", icon: "📊", desc: "文档、表格、PPT" },
  { slug: "coding", name: "编程开发", icon: "💻", desc: "代码助手、Copilot" },
  { slug: "audio", name: "语音音频", icon: "🎧", desc: "转录、克隆、TTS" },
  { slug: "design", name: "设计", icon: "🧩", desc: "UI、素材、3D" },
  { slug: "business", name: "商业营销", icon: "📈", desc: "投放、CRM、分析" },
  { slug: "chatbot", name: "聊天机器人", icon: "💬", desc: "对话、客服、角色" },
  { slug: "productivity", name: "效率工具", icon: "⚡", desc: "笔记、自动化" },
  { slug: "education", name: "教育学习", icon: "📚", desc: "辅导、语言、考试" },
  { slug: "search", name: "搜索研究", icon: "🔎", desc: "聚合、知识库" },
];

const tools = [
  { name: "ChatGPT", slug: "chatgpt", summary: "OpenAI 出品的通用对话助手，支持写作、编程、分析。", url: "https://chat.openai.com", logo: "🤖", category: "chatbot", tags: ["对话", "写作", "编程"], featured: true, clicks: 98213, favorites: 12400, rating: 4.8 },
  { name: "Midjourney", slug: "midjourney", summary: "顶级文生图模型，艺术风格与质感出色。", url: "https://midjourney.com", logo: "🖼️", category: "image", tags: ["绘画", "艺术", "设计"], featured: true, clicks: 87420, favorites: 11200, rating: 4.7 },
  { name: "Claude", slug: "claude", summary: "Anthropic 长文本理解强，写作与代码均衡。", url: "https://claude.ai", logo: "📝", category: "chatbot", tags: ["对话", "长文本", "写作"], featured: true, clicks: 76110, favorites: 9800, rating: 4.7 },
  { name: "Cursor", slug: "cursor", summary: "AI 原生代码编辑器，理解整个项目上下文。", url: "https://cursor.com", logo: "🧠", category: "coding", tags: ["编程", "IDE", "Copilot"], featured: true, clicks: 80330, favorites: 10500, rating: 4.8 },
  { name: "Perplexity", slug: "perplexity", summary: "带引用的 AI 搜索，答案可溯源。", url: "https://perplexity.ai", logo: "🔍", category: "search", tags: ["搜索", "研究"], featured: true, clicks: 71200, favorites: 8800, rating: 4.6 },
  { name: "Suno", slug: "suno", summary: "一句话生成完整歌曲，含人声与编曲。", url: "https://suno.com", logo: "🎵", category: "audio", tags: ["音乐", "生成", "TTS"], featured: false, clicks: 55210, favorites: 7200, rating: 4.5 },
  { name: "Gamma", slug: "gamma", summary: "AI 一键生成 PPT、文档与网页。", url: "https://gamma.app", logo: "📑", category: "office", tags: ["PPT", "文档", "办公"], featured: false, clicks: 49880, favorites: 6600, rating: 4.4 },
  { name: "Pika", slug: "pika", summary: "文生视频与图生视频，风格化能力强。", url: "https://pika.art", logo: "🎥", category: "video", tags: ["视频", "生成"], featured: false, clicks: 43770, favorites: 5900, rating: 4.3 },
];

async function main() {
  console.log("🌱 开始灌入种子数据…");

  // 演示管理员（密码 admin123，登录后可在后台管理）
  const adminHash = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@ainav.dev" },
    update: {},
    create: {
      name: "管理员",
      email: "admin@ainav.dev",
      avatar: "🛡️",
      role: "admin",
      passwordHash: adminHash,
      bio: "站点管理员",
      points: 0,
    },
  });

  await prisma.category.createMany({ data: categories });
  const catMap = Object.fromEntries(
    (await prisma.category.findMany()).map((c) => [c.slug, c.id])
  );

  await prisma.tool.createMany({
    data: tools.map(({ category, ...rest }) => ({
      ...rest,
      categoryId: catMap[category],
      tags: JSON.stringify(rest.tags),
    })),
  });

  const user = await prisma.user.create({
    data: { name: "夜行的猫", avatar: "🐱", bio: "AI 工具爱好者", points: 1280 },
  });

  const post = await prisma.post.create({
    data: {
      title: "用了 3 个月的 Claude，总结一份高效提示词模板",
      content: "把任务拆成「角色 + 背景 + 约束 + 输出格式」四段后，产出质量明显提升。",
      authorId: user.id,
      type: "share",
      tags: JSON.stringify(["提示词", "Claude", "效率"]),
      likes: 328,
      comments: 1,
      views: 5210,
    },
  });

  await prisma.comment.create({
    data: {
      postId: post.id,
      authorName: "阿白",
      content: "模板太实用了，已收藏！",
      likes: 12,
    },
  });

  await prisma.prompt.create({
    data: {
      title: "爆款小红书文案生成器",
      content: "你是一位资深小红书运营，请基于主题【{主题}】生成 3 篇笔记……",
      category: "writing",
      tags: JSON.stringify(["文案", "小红书", "营销"]),
      authorName: "运营猫",
      uses: 1820,
    },
  });

  await prisma.mcpServer.createMany({
    data: mcpServers.map(({ tags, ...rest }) => ({
      ...rest,
      tags: JSON.stringify(tags),
      status: "PUBLISHED",
    })),
  });

  await prisma.skill.createMany({
    data: skills.map(({ tags, ...rest }) => ({
      ...rest,
      tags: JSON.stringify(tags),
      status: "PUBLISHED",
    })),
  });

  console.log("✅ 种子数据完成：", {
    categories: categories.length,
    tools: tools.length,
    users: 1,
    posts: 1,
    comments: 1,
    prompts: 1,
    mcpServers: mcpServers.length,
    skills: skills.length,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
