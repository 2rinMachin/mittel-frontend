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
    getArticles: {
      method: "GET",
      path: "/articles",
      query: z.object({
        title: z.string().optional(),
        tag: z.string().optional(),
        skip: z.number().optional(),
        limit: z.number().optional(),
      }),
      responses: {
        200: z.array(Article),
      },
    },
    getArticle: {
      method: "GET",
      path: "/articles/:id",
      responses: {
        200: Article.extend({
          content: z.string(),
        }),
        404: z.unknown(),
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
