import {
  initClient,
  initContract,
  type InitClientArgs,
  type InitClientReturn,
} from "@ts-rest/core";
import { z } from "zod";
import { env } from "../env";
import { Comment } from "../schemas/comment";

const c = initContract();

export const contract = c.router(
  {
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
  { strictStatusCodes: true },
);

const clientArgs = {
  baseUrl: env.VITE_ARTICLES_URL,
  throwOnUnknownStatus: true,
  validateResponse: true,
} as const satisfies InitClientArgs;

export type CommentsApiClient = InitClientReturn<
  typeof contract,
  typeof clientArgs
>;

export const createCommentsClient = (
  token: string | null,
): CommentsApiClient => {
  return initClient(contract, {
    ...clientArgs,
    baseHeaders: token ? { Authorization: `Bearer ${token}` } : {},
  });
};
