import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import { LuLogOut, LuPencil, LuUser, LuUsers } from "react-icons/lu";
import { useClients } from "../hooks/use-clients";
import { useQuery } from "@tanstack/react-query";

const links = [
  { label: "Artículos", to: "/articles", authenticated: false },
  { label: "Autores", to: "/users", authenticated: false },
  { label: "Publicar", to: "/publish", authenticated: true },
] as const;

const Header = () => {
  const { user } = useAuth();
  const { usersClient } = useClients();

  const logout = async () => {
    localStorage.removeItem("token");

    try {
      await usersClient.logout(undefined);
    } catch (e) {
      console.error(e);
    } finally {
      window.location.reload();
    }
  };

  const { analystClient } = useClients();
  const { data: activeUsersData } = useQuery({
    queryKey: ["active-users"],
    queryFn: () => analystClient.countActiveUsers(),
    refetchInterval: 10_000,
  });

  const activeUsers = activeUsersData?.body.user_count;

  return (
    <header className="sticky top-0 z-50">
      <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

      <div className="bg-white/70 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <NavLink
              to="/"
              className="flex items-center text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent select-none"
            >
              <LuPencil className="inline-block mr-2" />
              Mittel
            </NavLink>

            <nav className="flex items-center gap-6">
              {links
                .filter((l) => !l.authenticated || user)
                .map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `relative text-slate-700 hover:text-indigo-600 transition-colors
                       after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-0.5
                       after:w-0 after:bg-gradient-to-r from-blue-600 to-indigo-600
                       hover:after:w-full after:transition-all
                       ${isActive ? "text-indigo-600 font-medium after:w-full" : ""}`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
            </nav>
          </div>

          <div className="flex items-center gap-x-8">
            <div className="hidden sm:flex items-center text-sm text-slate-600">
              <LuUsers className="size-4 mr-1" />
              {activeUsers ? (
                <>
                  <span
                    className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"
                    aria-hidden="true"
                  ></span>
                  {activeUsers} {activeUsers === 1 ? "activo" : "activos"}
                </>
              ) : (
                <span className="text-slate-400 animate-pulse">...</span>
              )}
            </div>

            {user ? (
              <div className="flex items-center gap-4">
                <NavLink
                  to={`/users/${user.id}`}
                  className="flex items-center gap-3 text-slate-700 hover:text-indigo-600 transition-colors"
                >
                  <span>{user.username}</span>
                  <LuUser className="size-8 p-1 border border-slate-400 rounded-full" />
                </NavLink>

                <button
                  onClick={logout}
                  className="p-2 rounded-md border border-slate-300 hover:bg-slate-100 transition enabled:cursor-pointer"
                  title="Cerrar sesión"
                >
                  <LuLogOut className="size-5 stroke-slate-600" />
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <NavLink
                  to="/login"
                  className="px-5 py-2 rounded-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 transition font-medium"
                >
                  Iniciar sesión
                </NavLink>
                <NavLink
                  to="/register"
                  className="px-5 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
                >
                  Crear cuenta
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
