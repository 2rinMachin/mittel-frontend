import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { NavLink } from "react-router-dom";
import { useClients } from "../../hooks/use-clients";

const PAGE_SIZE = 15;

const SearchUsersPage = () => {
  const { usersClient } = useClients();
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 500);
  const [page, setPage] = useState(1);

  const { data, isFetching } = useQuery({
    queryKey: ["users-search", debouncedQuery, page],
    queryFn: () =>
      usersClient.searchUsers({
        query: { pattern: debouncedQuery, page, page_size: PAGE_SIZE },
      }),
    enabled: debouncedQuery !== "",
  });

  const users = data?.body.results ?? [];

  return (
    <main className="my-12 px-4">
      <h1 className="font-semibold text-3xl text-center mb-10 bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
        Buscar autores
      </h1>

      <div className="flex justify-center">
        <input
          placeholder="Busca un autor..."
          value={query}
          onChange={(e) => setQuery(e.target.value.trimStart())}
          className="border border-neutral-300 rounded-xl px-4 py-2 w-full max-w-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      <section className="max-w-4xl mx-auto mt-10 min-h-[200px]">
        {debouncedQuery === "" ? (
          <p className="text-center text-neutral-500 mt-10 italic">
            Escribe algo para comenzar a buscar.
          </p>
        ) : isFetching ? (
          <p className="text-center text-neutral-600 mt-10 animate-pulse">
            Cargando...
          </p>
        ) : users.length === 0 ? (
          <p className="text-center text-neutral-600 mt-10">
            No se encontraron autores con ese nombre.
          </p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-8">
            {users.map((user) => (
              <li key={user.id}>
                <NavLink
                  to={`/users/${user.id}`}
                  className="block p-4 border border-neutral-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-400 transition bg-white"
                >
                  <h2 className="font-medium text-lg text-neutral-800 truncate">
                    {user.username}
                  </h2>
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </section>

      {users.length > 0 && (
        <div className="flex justify-center items-center gap-4 mt-16">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="px-5 py-2 rounded-lg border border-slate-300 text-slate-700 disabled:opacity-40 hover:bg-slate-100 transition enabled:cursor-pointer"
          >
            Anterior
          </button>
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:from-indigo-600 hover:to-purple-600 transition enabled:cursor-pointer shadow-sm"
          >
            Siguiente
          </button>
        </div>
      )}
    </main>
  );
};

export default SearchUsersPage;
