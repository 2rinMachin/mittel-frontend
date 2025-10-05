import { z } from "zod";

export const CreateArticleRequest = z.object({
  title: z.string().trim().min(2),
  content: z.string().trim().min(2),
  tags: z.array(z.string().trim().toLowerCase().nonempty()),
});

export type CreateArticleRequest = z.infer<typeof CreateArticleRequest>;
