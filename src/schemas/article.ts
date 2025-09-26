import { z } from "zod";

export const Article = z.object({
  _id: z.string(),
});

export type Article = z.infer<typeof Article>;
