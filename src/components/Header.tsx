import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import { LuLogOut, LuPencil, LuUser, LuUsers } from "react-icons/lu";
import { useClients } from "../hooks/use-clients";
import { useQuery } from "@tanstack/react-query";

const links = [
  {
    label: "Artículos",
    to: "/articles",
    authenticated: false,
  },
  {
    label: "Autores",
    to: "/users",
    authenticated: false,
  },
  {
    label: "Publicar",
    to: "/publish",
    authenticated: true,
  },
] as const;

const Header = () => {
  const { user } = useAuth();
  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const { analystClient } = useClients();
  const { data: activeUsersData } = useQuery({
    queryKey: ["active-users"],
    queryFn: () =>
      analystClient.countActiveUsers(),
    refetchInterval: 10_000,
  });
  const activeUsers = activeUsersData?.body.user_count;

  return (
    <header className="max-w-5xl mx-auto px-6 py-6 flex justify-between">
      <div className="flex items-center">
        <NavLink to="/" className="text-2xl font-semibold mr-8">
          <LuPencil className="inline mr-2 mb-1" />
          Mittel
        </NavLink>
        <nav className="flex items-center px-6 space-x-8">
          {links
            .filter((link) => !link.authenticated || user)
            .map((link) => (
              <NavLink key={link.to} to={link.to}>
                {link.label}
              </NavLink>
            ))}
        </nav>
      </div>

      {activeUsers ? (
        <div className="flex items-center text-sm">
          <LuUsers className="size-4 mr-1" />
          {activeUsers} {activeUsers === 1 ? "activo" : "activos"}
        </div>
      ) : (
        <div className="flex items-center text-sm text-neutral-400 animate-pulse">
          <LuUsers className="size-4 mr-1" />
          ...
        </div>
      )}

      {user ? (
        <div className="flex gap-x-4">
          <NavLink
            to={`/users/${user.id}`}
            className="flex gap-x-3 items-center"
          >
            <span>{user.username}</span>
            <LuUser className="border border-neutral-900 rounded-full size-8" />
          </NavLink>

          <button
            onClick={logout}
            className="border border-neutral-600 rounded-md px-2"
          >
            <LuLogOut className="size-4 stroke-neutral-600" />
          </button>
        </div>
      ) : (
        <div className="space-x-4">
          <NavLink
            to="/login"
            className="bg-neutral-900 text-white rounded-md px-5 py-2 cursor-pointer"
          >
            Iniciar sesión
          </NavLink>
          <NavLink
            to="/register"
            className="border-neutral-900 border rounded-md px-5 py-2 cursor-pointer"
          >
            Crear cuenta
          </NavLink>
        </div>
      )}
    </header>
  );
};

export default Header;
