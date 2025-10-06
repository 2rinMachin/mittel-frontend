import { useQuery } from "@tanstack/react-query";
import { useClients } from "../hooks/use-clients";
import { useState } from "react";
import ArticleList from "../components/ArticleList";

const PAGE_SIZE = 10;

const HomePage = () => {
  const { discoveryClient } = useClients();
  const [page, setPage] = useState(0);

  const { data, isPending, error } = useQuery({
    queryKey: ["articles", page],
    queryFn: () =>
      discoveryClient.discoverFeaturedArticles({
        query: { skip: page * PAGE_SIZE, limit: PAGE_SIZE },
      }),
  });

  const articles = data?.body ?? [];

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-200/40 via-purple-200/30 to-transparent rounded-full blur-3xl animate-pulse -z-10"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-300/30 via-blue-100/40 to-transparent rounded-full blur-3xl animate-pulse -z-10"></div>

      <section className="relative py-16 text-center">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm">
          ¡Bienvenido de vuelta!
        </h1>
        <p className="text-slate-600 mt-3 text-lg">
          Explora los últimos artículos, reflexiones y debates de la comunidad.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-4 mt-2">
        {isPending && (
          <p className="text-center text-slate-500 animate-pulse">
            Cargando artículos...
          </p>
        )}
        {error && (
          <p className="text-center text-red-500">Error al cargar artículos.</p>
        )}

        <ArticleList articles={articles} />

        <div className="flex justify-center items-center gap-4 mt-16">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
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
      </section>
    </main>
  );
};

export default HomePage;
