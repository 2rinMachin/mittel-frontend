import { useParams } from "react-router-dom";
import { useClients } from "../../hooks/use-clients";
import { useQuery } from "@tanstack/react-query";
import { LuUser } from "react-icons/lu";
import { useState } from "react";
import ArticleList from "../../components/ArticleList";

const PAGE_SIZE = 10;

const UserPage = () => {
  const { id } = useParams();
  const { usersClient, articlesClient } = useClients();
  const [page, setPage] = useState(0);

  const {
    data: userData,
    isPending: userPending,
    error: userError,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: () => usersClient.getUser({ params: { id: id! } }),
    enabled: !!id,
  });

  const {
    data: articlesData,
    isPending: articlesPending,
    error: articlesError,
  } = useQuery({
    queryKey: ["articles", "author", id, page],
    queryFn: () =>
      articlesClient.getArticles({
        query: { authorId: id!, skip: page * PAGE_SIZE, limit: PAGE_SIZE },
      }),
    enabled: !!id,
  });

  if (userPending)
    return (
      <p className="text-center py-8 text-neutral-600">Cargando usuario...</p>
    );

  if (userError || !userData || userData.status === 404)
    return (
      <p className="text-center py-8 text-red-500">Usuario no encontrado.</p>
    );

  const user = userData.body;
  const articles = articlesData?.body ?? [];

  return (
    <main className="max-w-4xl mx-auto py-12 px-4">
      <section className="flex flex-col items-center text-center mb-12">
        <LuUser className="size-28 bg-neutral-200 rounded-full mb-4 stroke-neutral-600 p-4" />
        <h1 className="text-3xl font-bold mb-1 text-neutral-900">
          {user.username}
        </h1>
        <p className="text-neutral-600 mb-2">{user.email}</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-center mb-8">
          Artículos de {user.username}
        </h2>

        {articlesPending && (
          <p className="text-center text-neutral-600">Cargando artículos...</p>
        )}

        {articlesError && (
          <p className="text-center text-red-500">
            Error al cargar los artículos del usuario.
          </p>
        )}

        {!articlesPending && articles.length === 0 && (
          <p className="text-center text-neutral-600">
            Este usuario aún no ha publicado artículos.
          </p>
        )}

        {articles.length > 0 && <ArticleList articles={articles} />}

        {articles.length > 0 && (
          <div className="flex justify-center gap-4 mt-10">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              className="px-4 py-2 border border-neutral-300 rounded-md text-neutral-700 disabled:opacity-50 hover:border-neutral-400 hover:bg-neutral-50 transition"
            >
              Anterior
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={articles.length < PAGE_SIZE}
              className="px-4 py-2 border border-neutral-300 rounded-md text-neutral-700 disabled:opacity-50 hover:border-neutral-400 hover:bg-neutral-50 transition"
            >
              Siguiente
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default UserPage;
