import { useContext } from "react";
import {
  ClientsContext,
  type ClientsContextValue,
} from "../components/ClientsContext";

export const useClients = (): ClientsContextValue => {
  const clients = useContext(ClientsContext);
  if (clients === null) throw new Error("Clients is null");

  return clients;
};
