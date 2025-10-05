import { z } from "zod";
import { CreateDeviceRequest } from "./device";

export const CreateEventRequest = z.object({
  post_id: z.string().nonempty(),
  user_id: z.string().nonempty().optional(),
  kind: z.enum(["view", "like", "share"]),
  device: CreateDeviceRequest.optional(),
});

export type CreateEventRequest = z.infer<typeof CreateEventRequest>;
