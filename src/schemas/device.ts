import { z } from "zod";

export const CreateDeviceRequest = z.object({
  browser: z.string(),
  os: z.string(),
  screen_resolution: z.string(),
  language: z.string(),
});

export type CreateDeviceRequest = z.infer<typeof CreateDeviceRequest>;
