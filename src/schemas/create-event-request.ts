import { z } from "zod";

export const CreateEventRequest = z.object({
  post_id: z.string().nonempty(),
  user_id: z.string().nonempty().optional(),
  kind: z.enum(["view", "like", "share"]),
});

export type CreateEventRequest = z.infer<typeof CreateEventRequest>;
