import { NavLink } from "react-router-dom";

const links = [
  {
    label: "Artículos",
    to: "/articles",
  },
] as const;

const Header = () => (
  <header className="max-w-5xl mx-auto px-6 py-6 flex justify-between">
    <NavLink to="/" className="text-2xl font-semibold">
      Mittel
    </NavLink>
    <nav className="flex items-center px-6 space-x-4">
      {links.map((link) => (
        <NavLink key={link.to} to={link.to}>
          {link.label}
        </NavLink>
      ))}
    </nav>
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
  </header>
);

export default Header;
