import { z } from "zod";

export const RegisterRequest = z.object({
  email: z.email().trim(),
  password: z.string().min(4),
  first_name: z.string().trim().min(3),
  last_name: z.string().trim().min(3),
});

export type RegisterRequest = z.infer<typeof RegisterRequest>;
