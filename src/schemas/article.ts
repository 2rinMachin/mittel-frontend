import { z } from "zod";

export const Article = z.object({
  _id: z.string(),
  title: z.string(),
  tags: z.array(z.string()),
  author: z.object({
    id: z.string(),
    username: z.string(),
    email: z.string(),
  }),
  commentsCount: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ArticleWithContent = Article.extend({
  content: z.string().optional(),
});

export type Article = z.infer<typeof Article>;
export type ArticleWithContent = z.infer<typeof ArticleWithContent>;
