import { useRef, type ReactNode } from "react";
import { createUsersClient } from "../api/users";
import { createArticlesClient } from "../api/articles";
import { ClientsContext, type ClientsContextValue } from "./ClientsContext";

export interface Props {
  children: ReactNode | null;
}

export const ClientsProvider = ({ children }: Props) => {
  const clients = useRef<ClientsContextValue | null>(null);

  const createClients = () => {
    const token = localStorage.getItem("token");
    return {
      usersClient: createUsersClient(token),
      articlesClient: createArticlesClient(token),
    };
  };

  const refreshClients = () => {
    clients.current = {
      ...createClients(),
      refreshClients,
    };
  };

  if (clients.current === null) refreshClients();

  return <ClientsContext value={clients.current}>{children}</ClientsContext>;
};
