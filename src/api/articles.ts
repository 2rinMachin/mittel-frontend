import {
  initClient,
  initContract,
  type InitClientArgs,
  type InitClientReturn,
} from "@ts-rest/core";
import { z } from "zod";
import { Article } from "../schemas/article";
import { env } from "../env";

const c = initContract();

export const contract = c.router(
  {
    getRecentArticles: {
      method: "GET",
      path: "/articles/recent",
      responses: {
        200: z.array(Article),
      },
    },
  },
  {
    strictStatusCodes: true,
  },
);

const clientArgs = {
  baseUrl: env.VITE_ARTICLES_URL,
  throwOnUnknownStatus: true,
  validateResponse: true,
} as const satisfies InitClientArgs;

export type ArticlesApiClient = InitClientReturn<
  typeof contract,
  typeof clientArgs
>;

export const createArticlesClient = (
  token: string | null,
): ArticlesApiClient => {
  return initClient(contract, {
    ...clientArgs,
    baseHeaders: token ? { Authorization: `Bearer ${token}` } : {},
  });
};
