import { useRef, type ReactNode } from "react";
import { createUsersClient } from "../api/users";
import { createArticlesClient } from "../api/articles";
import { ClientsContext, type ClientsContextValue } from "./ClientsContext";
import { createEngagementClient } from "../api/engagement";
import { createDiscoveryClient } from "../api/discovery";
import { createAnalystClient } from "../api/analyst";

export interface Props {
  children: ReactNode | null;
}

export const ClientsProvider = ({ children }: Props) => {
  const clients = useRef<ClientsContextValue | null>(null);

  const createClients = (
    token: string | null = localStorage.getItem("token"),
  ) => {
    return {
      usersClient: createUsersClient(token),
      articlesClient: createArticlesClient(token),
      engagementClient: createEngagementClient(token),
      discoveryClient: createDiscoveryClient(token),
      analystClient: createAnalystClient(token),
    };
  };

  const refreshClients = (token?: string | null) => {
    clients.current = {
      ...createClients(token),
      refreshClients,
    };
  };

  if (clients.current === null) refreshClients();

  return <ClientsContext value={clients.current}>{children}</ClientsContext>;
};
