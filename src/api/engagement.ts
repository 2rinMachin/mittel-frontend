import {
  initClient,
  initContract,
  type InitClientArgs,
  type InitClientReturn,
} from "@ts-rest/core";
import { env } from "../env";
import { EventSummary } from "../schemas/event-summary";

const c = initContract();

export const contract = c.router(
  {
    getEventsSummary: {
      method: "GET",
      path: "/events/:postId",
      responses: {
        200: EventSummary,
      },
    },
  },
  { strictStatusCodes: true },
);

const clientArgs = {
  baseUrl: env.VITE_ENGAGEMENT_URL,
  throwOnUnknownStatus: true,
  validateResponse: true,
} as const satisfies InitClientArgs;

export type EngagementApiClient = InitClientReturn<
  typeof contract,
  typeof clientArgs
>;

export const createEngagementClient = (
  token: string | null,
): EngagementApiClient => {
  return initClient(contract, {
    ...clientArgs,
    baseHeaders: token ? { Authorization: `Bearer ${token}` } : {},
  });
};
