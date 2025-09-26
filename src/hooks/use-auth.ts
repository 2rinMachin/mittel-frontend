import { useContext } from "react";
import { AuthContext, type AuthContextValue } from "../components/AuthContext";

export const useAuth = (): AuthContextValue => {
  const auth = useContext(AuthContext);
  if (auth === null) throw new Error("AuthContext is not provided");

  return auth;
};
