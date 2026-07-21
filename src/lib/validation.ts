import { z } from "zod";

export const PostSchema = z.object({
  title: z.string().min(4, "标题至少 4 个字").max(100),
  content: z.string().min(2, "内容太短").max(5000),
  type: z.enum(["discussion", "question", "share", "showcase"]),
  tags: z.array(z.string().max(20)).max(6).default([]),
});

export const CommentSchema = z.object({
  content: z.string().min(1, "评论不能为空").max(2000),
  author: z.string().min(1).max(40).default("匿名"),
  parentId: z.string().optional().nullable(),
});

export const LikeSchema = z.object({
  target: z.enum(["post", "comment"]).default("post"),
});

export const McpSchema = z.object({
  name: z.string().min(2, "名称至少 2 个字").max(60),
  summary: z.string().min(4, "简介太短").max(500),
  url: z.string().url("请输入合法的链接"),
  category: z.string().min(1, "请选择分类"),
  logo: z.string().max(8).optional(),
  tags: z.string().max(200).optional(),
});

export const SkillSchema = z.object({
  name: z.string().min(2, "名称至少 2 个字").max(60),
  summary: z.string().min(4, "简介太短").max(500),
  category: z.string().min(1, "请选择分类"),
  installCmd: z.string().min(4, "安装命令太短").max(200),
  author: z.string().max(40).optional(),
  logo: z.string().max(8).optional(),
  tags: z.string().max(200).optional(),
});
