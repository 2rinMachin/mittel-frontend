import { createContext } from "react";
import type { ArticlesApiClient } from "../api/articles";
import type { UsersApiClient } from "../api/users";

export interface ClientsContextValue {
  usersClient: UsersApiClient;
  articlesClient: ArticlesApiClient;
  engagementClient: ArticlesApiClient;
  refreshClients: (token: string | null) => void;
}

export const ClientsContext = createContext<ClientsContextValue | null>(null);
