import {
  initClient,
  initContract,
  type InitClientArgs,
  type InitClientReturn,
} from "@ts-rest/core";
import { env } from "../env";
import { z } from "zod";
import { Article } from "../schemas/article";
import { User } from "../schemas/user";

const c = initContract();

export const contract = c.router(
  {
    discoverArticlesByTitle: {
      method: "GET",
      path: "/discover/articles/title/:title",
      responses: {
        200: z.array(Article),
      },
    },
    discoverUsersByUsername: {
      method: "GET",
      path: "/discover/users/name/:username",
      responses: {
        200: z.array(User),
      },
    },
  },
  { strictStatusCodes: true },
);

const clientArgs = {
  baseUrl: env.VITE_DISCOVERY_URL,
  throwOnUnknownStatus: true,
  validateResponse: true,
} as const satisfies InitClientArgs;

export type DiscoveryApiClient = InitClientReturn<
  typeof contract,
  typeof clientArgs
>;

export const createDiscoveryClient = (
  token: string | null,
): DiscoveryApiClient => {
  return initClient(contract, {
    ...clientArgs,
    baseHeaders: token ? { Authorization: `Bearer ${token}` } : {},
  });
};
