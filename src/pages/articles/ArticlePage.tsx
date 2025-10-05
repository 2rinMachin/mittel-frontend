import { useParams } from "react-router-dom";
import { useClients } from "../../hooks/use-clients";
import { useQuery } from "@tanstack/react-query";
import type { ArticleWithContent } from "../../schemas/article";
import type { Comment } from "../../schemas/comment";

const ArticlePage = () => {
  const { id } = useParams();
  const { articlesClient, commentsClient } = useClients();

  const { data: articleData, isPending } = useQuery({
    queryKey: ["article", id],
    queryFn: () => articlesClient.getArticle({ params: { id: id! } }),
    enabled: !!id,
  });

  const { data: commentsData } = useQuery({
    queryKey: ["comments", id],
    queryFn: () =>
      commentsClient.getCommentsByPost({
        params: { postId: id! },
        query: { limit: 5 },
      }),
    enabled: !!id,
  });

  if (isPending) return <p className="text-center py-8">Cargando...</p>;
  if (!articleData)
    return <p className="text-center py-8">No se encontró el artículo.</p>;

  const article = articleData.body as ArticleWithContent;
  const comments = commentsData?.body ?? [];

  return (
    <main className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
      <p className="text-neutral-600 mb-4">
        Por {article.author.username} •{" "}
        {new Date(article.createdAt).toLocaleDateString()}
      </p>

      <article className="prose max-w-none mb-10">
        <p>{article.content}</p>
      </article>

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
