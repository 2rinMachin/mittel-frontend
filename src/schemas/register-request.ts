import { z } from "zod";

export const RegisterRequest = z.object({
  email: z.email().trim(),
  password: z.string().min(4),
  firstName: z.string().trim().min(3),
  lastName: z.string().trim().min(3),
});

export type RegisterRequest = z.infer<typeof RegisterRequest>;
