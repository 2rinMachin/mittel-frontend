import { NavLink, useNavigate, useParams } from "react-router-dom";
import { twJoin } from "tailwind-merge";
import { useClients } from "../../hooks/use-clients";
import { useQuery } from "@tanstack/react-query";
import type { Comment } from "../../schemas/comment";
import {
  LuEye,
  LuShare,
  LuShare2,
  LuThumbsUp,
  LuTrash,
  LuCalendar,
  LuMessageCircle,
} from "react-icons/lu";
import { useEffect, useState, type FormEventHandler } from "react";
import { env } from "../../env";
import { useAuth } from "../../hooks/use-auth";
import { getDeviceInfo } from "../../util/device-info";
import dayjs from "../../util/dayjs";

const ArticlePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { articlesClient, engagementClient } = useClients();
  const [mounted, setMounted] = useState(false);
  const [liked, setLiked] = useState(false);
  const [commentInput, setCommentInput] = useState("");

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

  const { data: commentsData, refetch: refetchComments } = useQuery({
    queryKey: ["post-comments", id],
    queryFn: () =>
      articlesClient.getCommentsByPost({
        params: { postId: id! },
        query: { limit: 5 },
      }),
    enabled: id !== undefined,
  });

  useEffect(() => {
    if (mounted) return;
    const device = getDeviceInfo();
    engagementClient.recordEvent({
      body: { post_id: id!, kind: "view", device },
    });
    setMounted(true);
  }, [mounted, engagementClient, id]);

  const publishComment: FormEventHandler = async (e) => {
    e.preventDefault();

    if (commentInput.length === 0) return;

    await articlesClient.createComment({
      body: {
        postId: article._id,
        content: commentInput,
      },
    });

    setCommentInput("");
    await refetchComments();
  };

  if (articleData === undefined)
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-50 to-blue-50">
        <p className="text-neutral-500 animate-pulse">Cargando artículo...</p>
      </main>
    );

  if (articleData.status === 404)
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-50 to-blue-50">
        <p className="text-neutral-500">No se encontró el artículo :(</p>
      </main>
    );

  const article = articleData.body;
  const stats = statsData?.body;
  const comments = commentsData?.body ?? [];

  const sharePost = async () => {
    const url = `${env.VITE_PUBLIC_URL}/articles/${article._id}`;

    if (navigator.share) {
      await navigator.share({ title: `"${article.title}" en Mittel`, url });
    } else if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(url);
      alert("URL copiada al portapapeles!");
    }

    const device = getDeviceInfo();
    await engagementClient.recordEvent({
      body: { post_id: article._id, user_id: user?.id, kind: "share", device },
    });
  };

  const likePost = async () => {
    if (liked) return;
    const device = getDeviceInfo();
    await engagementClient.recordEvent({
      body: { post_id: article._id, user_id: user?.id, kind: "like", device },
    });
    setLiked(true);
  };

  const deleteArticle = async () => {
    await articlesClient.deleteArticle({ params: { id: article._id } });
    navigate(-1);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50 py-16">
      <section className="max-w-5xl mx-auto px-6">
        {user?.id === article.author.id && (
          <div className="flex justify-end mb-6">
            <button
              onClick={deleteArticle}
              className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 border border-red-200 px-4 py-2 rounded-lg transition enabled:cursor-pointer"
            >
              <LuTrash className="size-4" />
              <span>Borrar artículo</span>
            </button>
          </div>
        )}

        <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm px-8 py-10">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            {article.title}
          </h1>
          <p className="text-neutral-600 mb-6 flex flex-wrap items-center gap-2 text-sm">
            <NavLink
              to={`/users/${article.author.id}`}
              className="font-medium text-neutral-800"
            >
              {article.author.username}
            </NavLink>
            <span>&middot;</span>
            <LuCalendar className="inline size-4 mb-0.5" />
            {dayjs(article.createdAt).locale("es").fromNow()}
          </p>

          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {stats && (
            <div className="text-neutral-600 mb-6 flex items-center gap-x-6 text-sm">
              <span className="flex items-center gap-x-2">
                <LuEye /> {stats.views}
              </span>
              <span className="flex items-center gap-x-2">
                <LuThumbsUp /> {stats.likes + +liked}
              </span>
              <span className="flex items-center gap-x-2">
                <LuShare2 /> {stats.shares}
              </span>
            </div>
          )}

          <article className="prose max-w-none mb-10 text-neutral-800 leading-relaxed">
            <p>{article.content}</p>
          </article>

          <div className="flex justify-end text-neutral-700 gap-x-6">
            <button
              onClick={likePost}
              className={twJoin(
                "flex items-center gap-x-2 px-3 py-1.5 rounded-lg border transition",
                liked
                  ? "border-neutral-300 text-neutral-400 bg-neutral-50"
                  : "border-neutral-300 hover:bg-neutral-100 cursor-pointer",
              )}
            >
              <LuThumbsUp
                className={twJoin("size-4", liked && "fill-neutral-400")}
              />
              <span>Like</span>
            </button>

            <button
              onClick={sharePost}
              className="flex items-center gap-x-2 px-3 py-1.5 rounded-lg border border-neutral-300 hover:bg-neutral-100 cursor-pointer transition"
            >
              <LuShare />
              <span>Compartir</span>
            </button>
          </div>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">
            Comentarios ({comments.length})
          </h2>

          <form
            onSubmit={publishComment}
            className="bg-white border border-neutral-200 rounded-xl shadow-sm p-4 mb-8"
          >
            <textarea
              placeholder="Escribe un comentario..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              className="w-full border border-neutral-300 rounded-lg p-3 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none min-h-[100px] transition"
            />
            <div className="flex justify-end mt-3">
              <button
                type="submit"
                disabled={commentInput.trim().length === 0}
                className="flex items-center gap-2 bg-blue-600 text-white font-medium px-4 py-2 rounded-lg enabled:hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <LuMessageCircle className="size-4" />
                Comentar
              </button>
            </div>
          </form>

          {comments.length === 0 ? (
            <p className="text-neutral-600 italic">
              Aún no hay comentarios. Sé el primero en opinar.
            </p>
          ) : (
            <ul className="space-y-4">
              {comments.map((c: Comment) => (
                <li
                  key={c._id}
                  className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm"
                >
                  <p className="text-neutral-800 mb-2">{c.content}</p>
                  <p className="text-sm text-neutral-500">
                    <NavLink
                      to={`/users/${c.author.id}`}
                      className="cursor-pointer"
                    >
                      {c.author.username}
                    </NavLink>{" "}
                    • {new Date(c.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>
    </main>
  );
};

export default ArticlePage;
