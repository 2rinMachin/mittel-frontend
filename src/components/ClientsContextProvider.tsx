import { useRef, type ReactNode } from "react";
import { createUsersClient } from "../api/users";
import { createArticlesClient } from "../api/articles";
import { ClientsContext, type Clients } from "./ClientsContext";

export interface Props {
  children: ReactNode | null;
}

export const ClientsContextProvider = ({ children }: Props) => {
  const clients = useRef<Clients | null>(null);

  if (clients.current === null) {
    const token = localStorage.getItem("token");
    clients.current = {
      usersClient: createUsersClient(token),
      articlesClient: createArticlesClient(token),
    };
  }

  return <ClientsContext value={clients.current}>{children}</ClientsContext>;
};
