import { createContext } from "react";
import type { ArticlesApiClient } from "../api/articles";
import type { UsersApiClient } from "../api/users";
import type { EngagementApiClient } from "../api/engagement";
import type { DiscoveryApiClient } from "../api/discovery";
import type { AnalystApiClient } from "../api/analyst";

export interface ClientsContextValue {
  usersClient: UsersApiClient;
  articlesClient: ArticlesApiClient;
  engagementClient: EngagementApiClient;
  discoveryClient: DiscoveryApiClient;
  analystClient: AnalystApiClient;
  refreshClients: (token: string | null) => void;
}

export const ClientsContext = createContext<ClientsContextValue | null>(null);
