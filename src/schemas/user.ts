import { z } from "zod";

export const User = z.object({
  id: z.string(),
  email: z.string(),
  first_name: z.string(),
  last_name: z.string(),
});

export type User = z.infer<typeof User>;
