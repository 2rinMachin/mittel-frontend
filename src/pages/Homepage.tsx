import { useQuery } from "@tanstack/react-query";
import { useClients } from "../hooks/use-clients";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const PAGE_SIZE = 5;

const HomePage = () => {
  const { articlesClient } = useClients();
  const [page, setPage] = useState(0);

  const { data, isPending, error } = useQuery({
    queryKey: ["articles", page],
    queryFn: () =>
      articlesClient.getArticles({
        query: { skip: page * PAGE_SIZE, limit: PAGE_SIZE },
      }),
  });

  const articles = data?.body ?? [];

  return (
    <main className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-8 text-center">
        ¡Bienvenido de vuelta!
      </h1>

      {isPending && <p className="text-center">Cargando...</p>}
      {error && (
        <p className="text-center text-red-500">Error al cargar artículos</p>
      )}

      <ul className="space-y-6">
        {articles.map((a) => (
          <li
            key={a._id}
            className="border border-neutral-300 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <NavLink to={`/articles/${a._id}`}>
              <h2 className="text-xl font-semibold mb-1">{a.title}</h2>
            </NavLink>
            <p className="text-sm text-neutral-600">
              Por <span className="font-medium">{a.author.username}</span> •{" "}
              {new Date(a.createdAt).toLocaleDateString()}
            </p>
            <p className="text-sm mt-1">{a.commentsCount} comentarios</p>
          </li>
        ))}
      </ul>

      <div className="flex justify-center gap-4 mt-8">
        <button
          disabled={page === 0}
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          className="border px-4 py-2 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="border px-4 py-2 rounded"
        >
          Siguiente
        </button>
      </div>
    </main>
  );
};

export default HomePage;
