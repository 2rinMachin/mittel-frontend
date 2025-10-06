import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { CreateArticleRequest } from "../../schemas/create-article-request";
import { useClients } from "../../hooks/use-clients";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const PublishPage = () => {
  const navigate = useNavigate();
  const { articlesClient, analystClient } = useClients();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(CreateArticleRequest),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
    },
  });

  const { data: topTagsData } = useQuery({
    queryKey: ["top-tags"],
    queryFn: () => analystClient.findTopTags(),
  });

  const { data: topArticlesData } = useQuery({
    queryKey: ["top-articles"],
    queryFn: () => analystClient.findTopArticles(),
  });

  const topTags = topTagsData?.body.map((res) => res.tag);
  const topArticles = topArticlesData?.body;

  const openTopArticle = () => {
    if (!topArticles) return;

    const article = topArticles[Math.floor(Math.random() * topArticles.length)];
    window.open(
      `${window.location.origin}/articles/${article.article_id}`,
      "_blank",
    );
  };

  const onSubmit = async (data: CreateArticleRequest) => {
    try {
      setSubmitting(true);
      const res = await articlesClient.createArticle({ body: data });
      navigate(`/articles/${res.body._id}`);
    } catch (e: unknown) {
      console.error(e);
      setError("Algo salió mal :(");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="py-10 px-4">
      <h1 className="text-center font-bold text-3xl text-neutral-900 mb-10">
        Publicar un artículo
      </h1>

      {topArticles && topArticles.length > 0 && (
        <section className="max-w-2xl mx-auto mb-10 bg-gradient-to-r from-blue-50 to-neutral-50 border border-blue-100 rounded-lg px-6 py-5 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-800 mb-2">
            ¿Necesitas inspiración?
          </h2>
          <p className="text-neutral-600 mb-4">
            Inspírate con algunos de los artículos más destacados del momento
            antes de escribir el tuyo.
          </p>
          <button
            onClick={openTopArticle}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md px-4 py-2 transition cursor-pointer"
          >
            Ver un artículo destacado
          </button>
        </section>
      )}

      <form
        className="bg-white rounded-lg shadow-sm max-w-2xl mx-auto px-6 py-8 space-y-6 border border-neutral-200"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Título
          </label>
          <input
            placeholder="Introduce un título llamativo"
            className="border border-neutral-300 focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 rounded-md px-3 py-2 w-full transition"
            {...form.register("title", { required: true })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Contenido
          </label>
          <textarea
            placeholder="Escribe el contenido de tu artículo..."
            className="border border-neutral-300 focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 rounded-md px-3 py-2 w-full min-h-[200px] resize-y transition"
            {...form.register("content", { required: true })}
          />
        </div>

        <Controller
          control={form.control}
          name="tags"
          render={({ field }) => (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Etiquetas
              </label>

              {field.value.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {field.value.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-neutral-100 text-neutral-800 px-2 py-1 rounded-md flex items-center gap-2 text-sm"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() =>
                          field.onChange(field.value.filter((_, j) => j !== i))
                        }
                        className="text-neutral-500 hover:text-neutral-800 transition enabled:cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <input
                placeholder="Escribe una etiqueta y presiona Enter"
                className="border border-neutral-300 focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 rounded-md px-3 py-2 w-full transition"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value.trim()) {
                    e.preventDefault();
                    const newTag = e.currentTarget.value.trim().toLowerCase();
                    if (!field.value.includes(newTag))
                      field.onChange([...field.value, newTag]);
                    e.currentTarget.value = "";
                  }
                }}
              />

              {topTags && topTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {topTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        if (!field.value.includes(tag))
                          field.onChange([...field.value, tag]);
                      }}
                      className="text-sm bg-neutral-100 hover:bg-neutral-200 rounded-md px-2 py-1 text-neutral-700 transition enabled:cursor-pointer"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        />

        <div className="text-center">
          <button
            type="submit"
            disabled={submitting}
            className="bg-neutral-900 text-white rounded-md px-6 py-2 font-medium hover:bg-neutral-800 disabled:opacity-50 transition"
          >
            {submitting ? "Publicando..." : "¡Publicar!"}
          </button>
        </div>
      </form>

      {error && (
        <p className="text-red-600 text-center mt-4 font-medium">{error}</p>
      )}
    </main>
  );
};

export default PublishPage;
