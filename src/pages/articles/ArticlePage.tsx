import { useParams } from "react-router-dom";
import { twJoin } from "tailwind-merge";
import { useClients } from "../../hooks/use-clients";
import { useQuery } from "@tanstack/react-query";
import type { Comment } from "../../schemas/comment";
import { LuEye, LuShare, LuShare2, LuThumbsUp } from "react-icons/lu";
import { useEffect, useState } from "react";
import { env } from "../../env";
import { useAuth } from "../../hooks/use-auth";

const ArticlePage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { articlesClient, engagementClient } = useClients();
  const [mounted, setMounted] = useState(false);
  const [liked, setLiked] = useState(false);

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

  const sharePost = async () => {
    const url = `${env.VITE_PUBLIC_URL}/articles/${article._id}`;

    if (navigator.share) {
      await navigator.share({
        title: `"${article.title}" en Mittel`,
        url,
      });
    } else if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(url);
      alert("URL copiada al portapapeles!");
    } else {
      return;
    }

    await engagementClient.recordEvent({
      body: {
        post_id: article._id,
        user_id: user?.id,
        kind: "share",
      },
    });
  };

  const likePost = async () => {
    if (liked) return;

    await engagementClient.recordEvent({
      body: {
        post_id: article._id,
        user_id: user?.id,
        kind: "like",
      },
    });

    setLiked(true);
  };

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
            <LuThumbsUp /> {stats.likes + +liked}
          </span>
          <span className="flex flex-row gap-x-2 items-center">
            <LuShare2 /> {stats.shares}
          </span>
        </div>
      )}

      <article className="prose max-w-none mb-10 text-lg">
        <p>{article.content}</p>
      </article>

      <div className="flex justify-end text-neutral-800 stroke-neutral-800 gap-x-6">
        <button
          onClick={likePost}
          className={twJoin(
            "flex items-center gap-x-2",
            liked ? " text-neutral-400" : "cursor-pointer",
          )}
        >
          <LuThumbsUp className={twJoin(liked && "fill-neutral-400")} />
          <span>Like</span>
        </button>
        <button
          onClick={sharePost}
          className="flex items-center gap-x-2 cursor-pointer"
        >
          <LuShare />
          <span>Compartir</span>
        </button>
      </div>

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
