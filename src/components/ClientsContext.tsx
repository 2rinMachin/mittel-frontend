import { createContext } from "react";
import type { ArticlesApiClient } from "../api/articles";
import type { UsersApiClient } from "../api/users";
import type { EngagementApiClient } from "../api/engagement";

export interface ClientsContextValue {
  usersClient: UsersApiClient;
  articlesClient: ArticlesApiClient;
  engagementClient: EngagementApiClient;
  refreshClients: (token: string | null) => void;
}

export const ClientsContext = createContext<ClientsContextValue | null>(null);
