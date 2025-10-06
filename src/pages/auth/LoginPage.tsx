import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginRequest } from "../../schemas/login-request";
import { useClients } from "../../hooks/use-clients";
import { useState } from "react";
import { LuLogIn } from "react-icons/lu";
import { NavLink } from "react-router-dom";

const LoginPage = () => {
  const { usersClient, refreshClients } = useClients();
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

    localStorage.setItem("token", res.body.token);
    refreshClients(res.body.token);

    window.location.href = "/";
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-[70vh] px-6">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center mb-8">
          Iniciar sesión
        </h1>

        <form
          className="bg-white border border-neutral-200 rounded-2xl shadow-sm px-6 py-8 space-y-5"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div>
            <input
              type="email"
              placeholder="Correo"
              className="border border-neutral-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-neutral-800 focus:border-neutral-800 transition"
              {...form.register("email", { required: true })}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Contraseña"
              className="border border-neutral-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-neutral-800 focus:border-neutral-800 transition"
              {...form.register("password", { required: true })}
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center font-medium">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-neutral-900 text-white rounded-lg py-2.5 font-medium flex items-center justify-center gap-2 hover:bg-neutral-800 transition enabled:cursor-pointer"
          >
            <LuLogIn className="size-4" />
            Entrar
          </button>
        </form>

        <p className="text-sm text-neutral-600 text-center mt-6">
          ¿No tienes cuenta?{" "}
          <NavLink
            to="/register"
            className="text-neutral-900 font-medium hover:underline"
          >
            Crear una
          </NavLink>
        </p>
      </div>
    </main>
  );
};

export default LoginPage;
