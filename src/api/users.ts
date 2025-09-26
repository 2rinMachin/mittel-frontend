import {
  initClient,
  initContract,
  type InitClientArgs,
  type InitClientReturn,
} from "@ts-rest/core";
import { z } from "zod";
import { LoginRequest } from "../schemas/login-request";
import { RegisterRequest } from "../schemas/register-request";
import { env } from "../env";
import { User } from "../schemas/user";

const c = initContract();

export const contract = c.router(
  {
    login: {
      method: "POST",
      path: "/auth/login",
      body: LoginRequest,
      responses: {
        200: z.object({ token: z.string() }),
        401: z.unknown(),
      },
    },
    register: {
      method: "POST",
      path: "/auth/register",
      body: RegisterRequest,
      responses: {
        201: z.unknown(),
        400: z.unknown(),
      },
    },
    getSelf: {
      method: "GET",
      path: "/users/self",
      responses: {
        200: User,
        401: z.unknown(),
      },
    },
  },
  { strictStatusCodes: true },
);

const clientArgs = {
  baseUrl: env.VITE_USERS_URL,
  throwOnUnknownStatus: true,
  validateResponse: true,
} as const satisfies InitClientArgs;

export type UsersApiClient = InitClientReturn<
  typeof contract,
  typeof clientArgs
>;

export const createUsersClient = (token: string | null): UsersApiClient => {
  return initClient(contract, {
    ...clientArgs,
    baseHeaders: token ? { Authorization: `Bearer ${token}` } : {},
  });
};
