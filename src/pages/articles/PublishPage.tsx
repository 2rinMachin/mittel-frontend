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
  })
  const topTags = topTagsData?.body.map(res => res.tag);

  const onSubmit = async (data: CreateArticleRequest) => {
    try {
      const res = await articlesClient.createArticle({ body: data });
      navigate(`/articles/${res.body._id}`);
    } catch (e: unknown) {
      console.error(e);
      setError("Algo salió mal :(");
    }
  };

  return (
    <main className="">
      <h1 className="text-center font-semibold text-3xl">
        Publicar un artículo
      </h1>

      <form
        className="rounded-md max-w-md mx-auto px-6 py-4 my-8 space-y-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <input
          placeholder="Título"
          className="border border-neutral-950 rounded-md px-2 py-1 w-full"
          {...form.register("title", { required: true })}
        />
        <textarea
          placeholder="Contenido..."
          className="border border-neutral-950 rounded-md px-2 py-1 w-full min-h-50"
          {...form.register("content", { required: true })}
        />

        <Controller
          control={form.control}
          name="tags"
          render={({ field }) => (
            <>
              <div className="flex flex-wrap gap-2 mb-2">
                {field.value.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-neutral-100 px-2 py-1 rounded-md flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => field.onChange(field.value.filter((_, j) => j != i))}
                      className="">
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                placeholder="Escribe una etiqueta y presiona Enter"
                className="border border-neutral-950 rounded-md px-2 py-1 w-full"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value.trim()) {
                    e.preventDefault();
                    const newTag = e.currentTarget.value.trim();
                    if (!field.value.includes(newTag))
                      field.onChange([...field.value, newTag]);

                    e.currentTarget.value = "";
                  }
                }}
              />
              {topTags && topTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {topTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        if (!field.value.includes(tag)) field.onChange([...field.value, tag]);
                      }}
                      className="text-sm bg-neutral-100 hover:bg-neutral-300 rounded-md px-2 py-1">
                      + {tag}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        />

        <div className="text-center">
          <button
            type="submit"
            className="bg-neutral-950 text-white rounded-md px-5 py-2 cursor-pointer"
          >
            ¡Publicar!
          </button>{" "}
        </div>
      </form>
      {error && <p className="text-red-600 text-center">{error}</p>}
    </main>
  );
};

export default PublishPage;
