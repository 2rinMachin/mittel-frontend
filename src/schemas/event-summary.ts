import z from "zod";

export const EventSummary = z.object({
  likes: z.number(),
  views: z.number(),
  shares: z.number(),
});

export type EventSummary = z.infer<typeof EventSummary>;
