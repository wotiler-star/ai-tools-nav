// 全局类型定义（对齐 ai.codefather.cn / api.codefather.cn 业务模型）

/** 分类 */
export interface Category {
  id: number;
  name: string;
  icon: string;
  sort: number;
  /** 二级子标签（复刻目标站『分类→子标签』导航） */
  tags?: string[];
  /** 全局标签云配额：该分类在全局云里展示几个标签（对齐目标站红框第 3 行） */
  cloudCount?: number;
}

/** AI 工具 */
export interface AiTool {
  id: number;
  name: string;
  logo: string;
  description: string;
  url: string;
  categoryId: number;
  tags: string[];
  heat: number; // 热度
  isRecommended: boolean; // 是否推荐
  isHot: boolean; // 是否热门
}

/** AI 社区帖子 */
export interface AiPost {
  id: number;
  title: string;
  content: string;
  authorName: string;
  authorAvatar: string;
  thumbUrl: string;
  createTime: string;
  viewNum: number;
  likeNum: number;
  commentNum: number;
}

/** AI 提示词 */
export interface AiPrompt {
  id: number;
  title: string;
  content: string;
  categoryName: string;
  useCount: number;
}

/** AI 资讯（首页榜单） */
export interface NewsItem {
  id: number;
  rank: number;
  title: string;
  hot?: boolean;
  content?: string; // 正文（markdown 源），缺省时由详情页合成
}

/** 精选推荐卡片 */
export interface FeaturedItem {
  id: number;
  title: string;
  cover?: string;
  href?: string; // 跳转目标，缺省时由渲染处兜底到真实存在的路由
}

/** 学习教程 / 项目课程 / 知识百科 文章 */
export interface Article {
  id: number;
  title: string;
  cover?: string;
  category: "tutorial" | "course" | "wiki";
}

/** 首页提示词卡片（绘图 / 文字） */
export interface HomePrompt {
  id: number;
  title: string;
  tags: string[];
  kind: "draw" | "text";
}

/** MCP 服务器（/mcp 页） */
export interface McpServer {
  id: number;
  name: string;
  tag: string; // 一级标签，如 data-extraction / AI
  category: string; // 所属分类
  description: string;
}

/** Skill 指令（/skills 页） */
export interface SkillItem {
  id: number;
  name: string;
  category: string; // 所属分类
  description: string;
}

/** 社区帖子（/essay 页，带话题分类与标签） */
export interface EssayPost {
  id: number;
  authorName: string;
  authorAvatar: string;
  authorTag: string; // 作者身份标签，如 人工智能 / 后端
  topic: string; // 话题：AI编程 / AI智能体 / 资源教程 / 创意玩法
  createTime: string;
  title: string;
  summary: string;
  tags: string[];
  likeNum: number;
  commentNum: number;
  featured?: boolean; // 是否精选
  content?: string; // 正文（markdown 源），缺省时由详情页合成
}

/** 学习教程（/resource/learn 页） */
export interface Tutorial {
  id: number;
  title: string;
  cover?: string;
  source: string; // 来源，如 公众号 / B站
}

/** 提示词模板（/painting 页，绘图 / 文字） */
export interface PromptTemplate {
  id: number;
  title: string;
  tags: string[];
  kind: "draw" | "text";
  useCount: number;
}

/** 知识库专栏（/library 页） */
export interface KbColumn {
  id: number;
  title: string;
  description: string;
  articleCount: number;
  free: boolean;
}

/** 用户（对齐后端 UserVO，无第三方 OAuth 字段） */
export interface UserVO {
  id: number;
  userName: string;
  userAvatar: string;
  userRole: string; // user / admin
  userProfile?: string;
  email?: string;
  phone?: string;
  /** 积分 */
  points?: number;
  /** 成长等级 */
  level?: number;
  /** 会员类型：0 普通 / 1 月度 / 2 年度 / 3 永久 */
  vipType?: number;
  /** 会员过期时间 */
  vipExpireTime?: string;
  createTime?: string;
}

/** 会员中心信息（对齐后端 MemberVO） */
export interface MemberVO {
  points: number;
  level: number;
  vipType: number;
  vipTypeName: string;
  vipExpireTime?: string;
  isVip: boolean;
  benefits: string[];
}

/** 用户收藏（对齐后端 UserFavorite，含目标快照） */
export interface UserFavorite {
  id: number;
  userId: number;
  targetType: string; // tool / post / prompt
  targetId: number;
  targetTitle?: string;
  targetCover?: string;
  targetDesc?: string;
  targetUrl?: string;
  createTime?: string;
}

/** MyBatis-Plus 分页结构（与后端一致：records/total/size/current） */
export interface PageResult<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/** 统一返回结构（与后端 BaseResponse 一致） */
export interface BaseResponse<T> {
  code: number;
  data: T;
  message: string;
}

export type BaseResponsePage<T> = BaseResponse<PageResult<T>>;

/** ===== AI 知识库（对齐后端 AiColumn / AiArticle / AiColumnCategory） ===== */
export interface AiColumnCategory {
  id: number;
  name: string;
  sort?: number;
  description?: string;
}

export interface AiColumn {
  id: number;
  title: string;
  description?: string;
  /** 封面色值（如 #3874F7），前端生成渐变封面 */
  coverColor?: string;
  categoryId?: number;
  categoryName?: string;
  /** 逗号分隔标签 */
  tags?: string;
  /** 是否会员：0 免费 / 1 会员 */
  needVip?: number;
  articleCount?: number;
  viewNum?: number;
  likeNum?: number;
  collectNum?: number;
  sort?: number;
  status?: number;
  createTime?: string;
}

export interface AiArticle {
  id: number;
  columnId?: number;
  title: string;
  summary?: string;
  /** 正文 markdown */
  content?: string;
  coverUrl?: string;
  viewNum?: number;
  likeNum?: number;
  collectNum?: number;
  sort?: number;
  status?: number;
  createTime?: string;
}

/** 评论（通用：文章 / 帖子），对齐后端 ai_comment */
export interface AiComment {
  id: number;
  targetType?: string;
  targetId?: number;
  userId?: number;
  userName?: string;
  userAvatar?: string;
  content?: string;
  parentId?: number;
  likeNum?: number;
  status?: number;
  createTime?: string;
}

/** 发布评论请求体 */
export interface AddCommentReq {
  targetType: string;
  targetId: number;
  content: string;
  parentId?: number;
}
