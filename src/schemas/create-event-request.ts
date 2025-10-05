import { z } from "zod";

export const CreateEventRequest = z.object({
  post_id: z.string().nonempty(),
  kind: z.enum(["view", "like", "share"]),
});

export type CreateEventRequest = z.infer<typeof CreateEventRequest>;
