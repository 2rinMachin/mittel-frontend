import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import { LuLogOut, LuPencil, LuUser } from "react-icons/lu";

const links = [
  {
    label: "Artículos",
    to: "/articles",
  },
] as const;

const Header = () => {
  const { user } = useAuth();
  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <header className="max-w-5xl mx-auto px-6 py-6 flex justify-between">
      <NavLink to="/" className="text-2xl font-semibold">
        <LuPencil className="inline mr-2 mb-1" />
        Mittel
      </NavLink>
      <nav className="flex items-center px-6 space-x-4">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to}>
            {link.label}
          </NavLink>
        ))}
      </nav>
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
