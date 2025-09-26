import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useClients } from "../hooks/use-clients";

const HomePage = () => {
  const { articlesClient } = useClients();

  const { data, isPending, error } = useQuery({
    queryKey: ["articles", "recent"],
    queryFn: () => articlesClient.getRecentArticles(),
  });

  useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  const articles = data?.body;

  return (
    <main className="py-8">
      <h1 className="font-semibold text-3xl text-center">Últimos artículos</h1>

      {error ? (
        <p className="text-center my-8">Algo salió mal :(</p>
      ) : isPending ? (
        <p className="text-center my-8">Cargando...</p>
      ) : articles?.length === 0 ? (
        <p className="text-center my-8">¡No hay nada por aquí!</p>
      ) : (
        <ul>
          {articles?.map((article) => (
            <li key={article._id}>kajadls</li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default HomePage;
