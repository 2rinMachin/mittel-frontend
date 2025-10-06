import {
  initClient,
  initContract,
  type InitClientArgs,
  type InitClientReturn,
} from "@ts-rest/core";
import { z } from "zod";
import { Article, ArticleWithContent } from "../schemas/article";
import { env } from "../env";
import { CreateArticleRequest } from "../schemas/create-article-request";
import { Comment } from "../schemas/comment";

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
        authorId: z.string().optional(),
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
        200: ArticleWithContent,
        404: z.unknown(),
      },
    },
    createArticle: {
      method: "POST",
      path: "/articles",
      body: CreateArticleRequest,
      responses: {
        201: ArticleWithContent,
      },
    },
    deleteArticle: {
      method: "DELETE",
      path: "/articles/:id",
      responses: {
        200: z.unknown(),
      },
    },
    getCommentsByPost: {
      method: "GET",
      path: "/comments/post/:postId",
      query: z.object({
        skip: z.number().optional(),
        limit: z.number().optional(),
      }),
      responses: {
        200: z.array(Comment),
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
