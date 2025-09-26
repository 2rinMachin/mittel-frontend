import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HomePage from "./pages/Homepage";
import { ClientsContextProvider } from "./components/ClientsContextProvider";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/auth/LoginPage";

const links = [
  {
    label: "Artículos",
    to: "/articles",
  },
] as const;

const queryClient = new QueryClient();

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ClientsContextProvider>
          <header className="max-w-5xl mx-auto py-6 flex justify-between">
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

          <div className="px-8">
            <Routes>
              <Route index Component={HomePage} />
              <Route path="*" Component={NotFoundPage} />
              <Route path="/login" Component={LoginPage} />
            </Routes>
          </div>
        </ClientsContextProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
