import { createContext } from "react";
import type { ArticlesApiClient } from "../api/articles";
import type { UsersApiClient } from "../api/users";
import type { EngagementApiClient } from "../api/engagement";
import type { DiscoveryApiClient } from "../api/discovery";

export interface ClientsContextValue {
  usersClient: UsersApiClient;
  articlesClient: ArticlesApiClient;
  engagementClient: EngagementApiClient;
  discoveryClient: DiscoveryApiClient;
  refreshClients: (token: string | null) => void;
}

export const ClientsContext = createContext<ClientsContextValue | null>(null);
