import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useClients } from "../../hooks/use-clients";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterRequest } from "../../schemas/register-request";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { usersClient, refreshClients } = useClients();
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(RegisterRequest),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterRequest) => {
    const res = await usersClient.register({ body: data });

    if (res.status === 400) {
      setError("Este email ya está en uso.");
      return;
    }

    const loginRes = await usersClient.login({ body: data });

    if (loginRes.status === 401) {
      setError("Algo salió mal :(");
      return;
    }

    localStorage.setItem("token", loginRes.body.token);
    refreshClients(loginRes.body.token);

    navigate("/");
  };

  return (
    <main className="py-8">
      <h1 className="text-3xl font-semibold text-center">Iniciar sesión</h1>

      <form
        className="rounded-md max-w-md mx-auto px-6 py-4 my-8 space-y-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <input
          type="text"
          placeholder="Nombre de usuario"
          className="border border-neutral-950 rounded-md px-2 py-1 w-full"
          {...form.register("username", { required: true })}
        />
        <input
          type="email"
          placeholder="Correo"
          className="border border-neutral-950 rounded-md px-2 py-1 w-full"
          {...form.register("email", { required: true })}
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="border border-neutral-950 rounded-md px-2 py-1 w-full"
          {...form.register("password", { required: true })}
        />
        <div className="text-center">
          <button
            type="submit"
            className="bg-neutral-950 text-white rounded-md px-5 py-2 cursor-pointer"
          >
            Enviar
          </button>{" "}
        </div>
      </form>
      {error && <p className="text-red-600 text-center">{error}</p>}
    </main>
  );
};

export default RegisterPage;
