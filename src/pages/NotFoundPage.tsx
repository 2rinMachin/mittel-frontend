import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <main className="py-10">
      <h1 className="font-semibold text-3xl text-center">
        Página no encontrada.
      </h1>
      <div className="text-center my-8">
        <button
          onClick={() => navigate(-1)}
          className="bg-neutral-900 text-white rounded-md px-5 py-2 cursor-pointer"
        >
          Volver
        </button>
      </div>
    </main>
  );
};

export default NotFoundPage;
