import { createContext } from "react";
import type { User } from "../schemas/user";

export interface AuthContextValue {
  user: User | null;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
