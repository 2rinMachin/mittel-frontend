import { z } from "zod";

export const Comment = z.object({
  _id: z.string(),
  postId: z.string(),
  content: z.string(),
  author: z.object({
    id: z.string(),
    username: z.string(),
    email: z.string(),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Comment = z.infer<typeof Comment>;
