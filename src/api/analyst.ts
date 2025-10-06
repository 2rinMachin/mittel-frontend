import {
  initClient,
  initContract,
  type InitClientArgs,
  type InitClientReturn,
} from "@ts-rest/core";
import { env } from "../env";
import { z } from "zod";

const c = initContract();

export const contract = c.router(
  {
    findTopTags: {
      method: "GET",
      path: "/tags/top",
      responses: {
        200: z.array(z.object({ tag: z.string() })),
      },
    },
    countActiveUsers: {
      method: "GET",
      path: "/users/countactive",
      responses: {
        200: z.object({
          user_count: z.number(),
        }),
      },
    },
  },
  { strictStatusCodes: true },
);

const clientArgs = {
  baseUrl: env.VITE_ANALYST_URL,
  throwOnUnknownStatus: true,
  validateResponse: true,
} as const satisfies InitClientArgs;

export type AnalystApiClient = InitClientReturn<
  typeof contract,
  typeof clientArgs
>;

export const createAnalystClient = (token: string | null): AnalystApiClient => {
  return initClient(contract, {
    ...clientArgs,
    baseHeaders: token ? { Authorization: `Bearer ${token}` } : {},
  });
};
