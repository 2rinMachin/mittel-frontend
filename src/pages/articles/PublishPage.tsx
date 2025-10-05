import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CreateArticleRequest } from "../../schemas/create-article-request";
import { useClients } from "../../hooks/use-clients";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PublishPage = () => {
  const navigate = useNavigate();
  const { articlesClient } = useClients();
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(CreateArticleRequest),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
    },
  });

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
