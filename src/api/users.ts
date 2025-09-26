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

const c = initContract();

export const contract = c.router(
  {
    login: {
      method: "POST",
      path: "/auth/login",
      body: LoginRequest,
      responses: {
        200: z.object({ token: z.string() }),
      },
    },
    register: {
      method: "POST",
      path: "/auth/register",
      body: RegisterRequest,
      responses: {
        200: z.object({ token: z.string() }),
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
