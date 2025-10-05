import { useParams, NavLink } from "react-router-dom";
import { useClients } from "../../hooks/use-clients";
import { useQuery } from "@tanstack/react-query";
import { LuUser } from "react-icons/lu";
import { useState } from "react";

const PAGE_SIZE = 5;

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
    return <p className="text-center py-8">Cargando usuario...</p>;

  if (userError || !userData || userData.status === 404)
    return (
      <p className="text-center py-8 text-red-500">Usuario no encontrado.</p>
    );

  const user = userData.body;
  const articles = articlesData?.body ?? [];

  return (
    <main className="max-w-4xl mx-auto py-10">
      <div className="text-center flex items-center flex-col mb-10">
        <LuUser className="size-32 bg-neutral-200 rounded-full mb-4 stroke-neutral-600" />
        <h1 className="font-semibold text-3xl mb-1">{user.username}</h1>
        <p className="text-neutral-600">{user.email}</p>
      </div>

      <h2 className="text-2xl font-semibold mb-6 text-center">
        Artículos de {user.username}
      </h2>

      {articlesPending && <p className="text-center">Cargando artículos...</p>}
      {articlesError && (
        <p className="text-center text-red-500">
          Error al cargar artículos del usuario.
        </p>
      )}

      {articles.length === 0 && !articlesPending && (
        <p className="text-center text-neutral-600">
          Este usuario aún no ha publicado artículos.
        </p>
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
              {new Date(a.createdAt).toLocaleDateString()} • {a.commentsCount}{" "}
              comentarios
            </p>
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
          disabled={articles.length < PAGE_SIZE}
          className="border px-4 py-2 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </main>
  );
};

export default UserPage;
