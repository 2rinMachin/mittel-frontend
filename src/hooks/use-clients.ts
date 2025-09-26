import { useContext } from "react";
import { ClientsContext, type Clients } from "../components/ClientsContext";

export const useClients = (): Clients => {
  const clients = useContext(ClientsContext);
  if (clients === null) throw new Error("Clients is null");

  return clients;
};
