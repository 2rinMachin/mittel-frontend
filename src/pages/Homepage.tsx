import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useClients } from "../hooks/use-clients";

const HomePage = () => {
  const { articlesClient } = useClients();

  const {
    data: posts,
    isPending,
    error,
  } = useQuery({
    queryKey: ["articles", "recent"],
    queryFn: () => articlesClient.getRecentArticles(),
  });

  useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  return (
    <main className="py-8">
      <h1 className="font-semibold text-3xl text-center">Últimos artículos</h1>

      {error ? (
        <p>Algo salió mal :(</p>
      ) : isPending ? (
        <p>Cargando...</p>
      ) : (
        <ul>
          {posts.body.map((article) => (
            <li key={article._id}>kajadls</li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default HomePage;
