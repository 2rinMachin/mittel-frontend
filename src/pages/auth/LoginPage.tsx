import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginRequest } from "../../schemas/login-request";
import { useClients } from "../../hooks/use-clients";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const { usersClient } = useClients();
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(LoginRequest),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginRequest) => {
    const res = await usersClient.login({ body: data });

    if (res.status === 401) {
      setError("Credenciales incorrectas");
      return;
    }

    console.log("res.body:", res.body);
    localStorage.setItem("token", res.body.token);

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
          type="email"
          placeholder="Correo"
          className="border border-neutral-950 rounded-md px-2 py-1 w-full"
          {...form.register("email")}
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="border border-neutral-950 rounded-md px-2 py-1 w-full"
          {...form.register("password")}
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

export default LoginPage;
