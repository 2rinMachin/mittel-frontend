import { useParams } from "react-router-dom";
import { useClients } from "../../hooks/use-clients";
import { useQuery } from "@tanstack/react-query";
import type { Comment } from "../../schemas/comment";
import { LuEye, LuShare2, LuThumbsUp } from "react-icons/lu";
import { useEffect, useState } from "react";

const ArticlePage = () => {
  const { id } = useParams();
  const { articlesClient, engagementClient } = useClients();
  const [mounted, setMounted] = useState(false);

  const { data: articleData } = useQuery({
    queryKey: ["article", id],
    queryFn: () => articlesClient.getArticle({ params: { id: id! } }),
    enabled: id !== undefined,
  });

  const { data: statsData } = useQuery({
    queryKey: ["event-summary", id],
    queryFn: () =>
      engagementClient.getEventsSummary({ params: { postId: id! } }),
    enabled: id !== undefined,
  });

  const { data: commentsData } = useQuery({
    queryKey: ["comments", id],
    queryFn: () =>
      articlesClient.getCommentsByPost({
        params: { postId: id! },
        query: { limit: 5 },
      }),
    enabled: id !== undefined,
  });

  useEffect(() => {
    if (mounted) return;

    engagementClient.recordEvent({
      body: {
        post_id: id!,
        kind: "view",
      },
    });

    setMounted(true);
  }, [mounted, engagementClient, id]);

  if (articleData === undefined) {
    return <p className="text-center py-8">Cargando...</p>;
  }

  if (articleData.status === 404) {
    return <p className="text-center py-8">No se encontró el artículo.</p>;
  }

  const article = articleData.body;
  const comments = commentsData?.body ?? [];

  const stats = statsData?.body;

  return (
    <main className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
      <p className="text-neutral-600 mb-4">
        Por {article.author.username} •{" "}
        {new Date(article.createdAt).toLocaleDateString()}
      </p>
      {stats && (
        <div className="text-neutral-600 mb-4 flex items-center gap-x-4">
          <span className="flex flex-row gap-x-2 items-center">
            <LuEye /> {stats.views}
          </span>
          <span className="flex flex-row gap-x-2 items-center">
            <LuThumbsUp /> {stats.likes}
          </span>
          <span className="flex flex-row gap-x-2 items-center">
            <LuShare2 /> {stats.shares}
          </span>
        </div>
      )}

      <article className="prose max-w-none mb-10 text-lg">
        <p>{article.content}</p>
      </article>

      <hr className="my-8 border-neutral-400" />
      <section>
        <h2 className="text-2xl font-semibold mb-4">
          Comentarios ({comments.length})
        </h2>
        {comments.length === 0 ? (
          <p className="text-neutral-600">Aún no hay comentarios.</p>
        ) : (
          <ul className="space-y-4">
            {comments.map((c: Comment) => (
              <li key={c._id} className="border rounded-lg p-3">
                <p className="text-sm text-neutral-700 mb-1">{c.content}</p>
                <p className="text-xs text-neutral-500">
                  {c.author.username} • {new Date(c.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};

export default ArticlePage;
