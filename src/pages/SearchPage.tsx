import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { useClients } from "../hooks/use-clients";
import ArticleList from "../components/ArticleList";

const SearchArticlesPage = () => {
  const { discoveryClient } = useClients();
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 500);

  const { data, isFetching } = useQuery({
    queryKey: ["articles-search", debouncedQuery],
    queryFn: () =>
      discoveryClient.discoverArticlesByTitle({
        params: { title: debouncedQuery },
      }),
    enabled: debouncedQuery !== "",
  });

  const articles = data?.body;

  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50 py-16">
      <section className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-neutral-900 mb-10">
          Buscar artículos
        </h1>

        <div className="max-w-2xl mx-auto mb-10">
          <input
            placeholder="Buscar por título..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border border-neutral-300 rounded-xl px-4 py-2 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          />
        </div>

        {debouncedQuery === "" ? (
          <p className="text-center text-neutral-500 italic">
            Escribe algo para comenzar a buscar
          </p>
        ) : isFetching || articles === undefined ? (
          <p className="text-center text-neutral-500 animate-pulse">
            Buscando artículos...
          </p>
        ) : articles?.length === 0 ? (
          <p className="text-center text-neutral-500">No encontramos nada :(</p>
        ) : (
          <ArticleList articles={articles} />
        )}
      </section>
    </main>
  );
};

export default SearchArticlesPage;
