import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { NavLink } from "react-router-dom";
import { useClients } from "../../hooks/use-clients";

const SearchUsersPage = () => {
  const { discoveryClient } = useClients();
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 500);

  const { data } = useQuery({
    queryKey: ["users-search", debouncedQuery],
    queryFn: () =>
      discoveryClient.discoverUsersByUsername({
        params: { username: debouncedQuery },
      }),
    enabled: debouncedQuery != "",
  });

  const users = data?.body;

  return (
    <main className="my-8">
      <h1 className="font-semibold text-3xl text-center mb-12">
        Buscar autores
      </h1>
      <input
        placeholder="Búsqueda..."
        value={query}
        onChange={(e) => setQuery(e.target.value.trimStart())}
        className="border border-neutral-950 rounded-md px-2 py-1 w-full max-w-2xl block mx-auto"
      />
      {debouncedQuery === "" ? (
        <p>¡Busca algo para comenzar!</p>
      ) : users === undefined ? (
        <p>Cargando...</p>
      ) : users.length === 0 ? (
        <p>¡No hay nada por aquí!</p>
      ) : (
        <ul className="space-y-4 max-w-4xl mx-auto my-10">
          {users.map((user) => (
            <li key={user.id}>
              <NavLink
                to={`/users/${user.id}`}
                className="block cursor-pointer border border-neutral-600 rounded-md px-4 py-2"
              >
                {user.username}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default SearchUsersPage;
