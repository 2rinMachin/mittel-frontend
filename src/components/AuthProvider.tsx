import { useCallback, useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { useClients } from "../hooks/use-clients";
import type { User } from "../schemas/user";

export interface Props {
  children: ReactNode | null;
}

const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const { usersClient } = useClients();

  const fetchUser = useCallback(async () => {
    try {
      const res = await usersClient.getSelf();

      if (res.status === 401) {
        localStorage.removeItem("token");
        return;
      }

      setUser(res.body);
    } catch (err) {
      console.error("Could not fetch user:", err);
    }
  }, [usersClient]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return <AuthContext value={{ user }}>{children}</AuthContext>;
};

export default AuthProvider;
