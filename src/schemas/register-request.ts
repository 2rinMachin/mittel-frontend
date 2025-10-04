import { z } from "zod";

export const RegisterRequest = z.object({
  email: z.email().trim(),
  password: z.string().min(4),
  username: z.string().trim().min(3),
});

export type RegisterRequest = z.infer<typeof RegisterRequest>;
