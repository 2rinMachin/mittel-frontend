import { createContext } from "react";
import type { ArticlesApiClient } from "../api/articles";
import type { UsersApiClient } from "../api/users";
import type { CommentsApiClient } from "../api/comments";

export interface ClientsContextValue {
  usersClient: UsersApiClient;
  articlesClient: ArticlesApiClient;
  commentsClient: CommentsApiClient;
  refreshClients: (token: string | null) => void;
}

export const ClientsContext = createContext<ClientsContextValue | null>(null);
