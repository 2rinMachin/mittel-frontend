import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { useClients } from "../hooks/use-clients";
import { NavLink } from "react-router-dom";

const SearchArticlesPage = () => {
  const { discoveryClient } = useClients();
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 500);

  const { data } = useQuery({
    queryKey: ["articles-search", debouncedQuery],
    queryFn: () =>
      discoveryClient.discoverArticlesByTitle({
        params: { title: debouncedQuery },
      }),
    enabled: debouncedQuery != "",
  });

  const articles = data?.body;

  return (
    <main className="my-8">
      <h1 className="font-semibold text-3xl text-center mb-12">
        Buscar artículos
      </h1>
      <input
        placeholder="Búsqueda..."
        value={query}
        onChange={(e) => setQuery(e.target.value.trimStart())}
        className="border border-neutral-950 rounded-md px-2 py-1 w-full max-w-2xl block mx-auto"
      />
      {debouncedQuery === "" ? (
        <p>¡Busca algo para comenzar!</p>
      ) : articles === undefined ? (
        <p>Cargando...</p>
      ) : articles.length === 0 ? (
        <p>¡No hay nada por aquí!</p>
      ) : (
        <ul className="space-y-4 max-w-4xl mx-auto my-10">
          {articles.map((article) => (
            <li key={article._id}>
              <NavLink
                to={`/articles/${article._id}`}
                className="block cursor-pointer border border-neutral-600 rounded-md px-4 py-2"
              >
                {article.title}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default SearchArticlesPage;
