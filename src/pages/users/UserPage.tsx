import { useParams } from "react-router-dom";
import { useClients } from "../../hooks/use-clients";
import { useQuery } from "@tanstack/react-query";
import { LuUser } from "react-icons/lu";

const UserPage = () => {
  const { id } = useParams();
  const { usersClient } = useClients();

  const { data: userData, isPending } = useQuery({
    queryKey: ["article", id],
    queryFn: () => usersClient.getUser({ params: { id: id! } }),
    enabled: !!id,
  });

  if (isPending) {
    return <p className="text-center py-8">Cargando...</p>;
  }

  if (!userData || userData.status === 404) {
    return <p className="text-center py-8">Usuario no encontrado.</p>;
  }

  const user = userData.body;

  return (
    <main className="my-10">
      <div className="text-center flex items-center flex-col">
        <LuUser className="size-32 bg-neutral-200 rounded-full mb-4 stroke-neutral-600" />
        <h1 className="font-semibold text-3xl">{user.username}</h1>
      </div>
    </main>
  );
};

export default UserPage;
