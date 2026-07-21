export type Category = {
  slug: string;
  name: string;
  icon: string; // emoji 占位，生产可换 svg
  desc?: string;
};

export type Tool = {
  id: string;
  name: string;
  slug: string;
  summary: string;
  description?: string;
  url: string;
  logo?: string;
  category: string; // 分类 slug
  tags: string[];
  featured: boolean;
  clicks: number;
  favorites: number;
  rating: number;
  createdAt: string;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatar?: string;
  createdAt: string;
  type: "discussion" | "question" | "share" | "showcase";
  tags: string[];
  likes: number;
  comments: number;
  views: number;
};

export type Comment = {
  id: string;
  postId: string;
  author: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  parentId?: string | null;
  likes: number;
};

export type Prompt = {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  uses: number;
};

export type NewsItem = {
  id: string;
  title: string;
  source: string;
  url: string;
  summary: string;
  views: number;
  publishedAt: string;
};

export type FeaturedItem = {
  id: string;
  title: string;
  summary: string;
  tag: string;
  href: string;
};

export type Article = {
  id: string;
  title: string;
  views: number;
  href: string;
};

export type Recommend = {
  id: string;
  rank: number;
  title: string;
  href: string;
};

export type LearnResource = {
  id: string;
  title: string;
  summary: string;
  tag: string;
  href: string;
};

export type McpServer = {
  id: string;
  name: string;
  slug?: string;
  summary: string;
  logo: string;
  category: string;
  tags: string[];
  url: string;
  stars: number;
  installs: number;
  featured?: boolean;
};

export type Skill = {
  id: string;
  name: string;
  slug?: string;
  summary: string;
  logo: string;
  category: string;
  tags: string[];
  installCmd: string;
  author: string;
  uses: number;
  featured?: boolean;
};

