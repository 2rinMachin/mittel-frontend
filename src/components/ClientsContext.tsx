import { createContext } from "react";
import type { ArticlesApiClient } from "../api/articles";
import type { UsersApiClient } from "../api/users";

export interface Clients {
  usersClient: UsersApiClient;
  articlesClient: ArticlesApiClient;
}

export const ClientsContext = createContext<Clients | null>(null);
