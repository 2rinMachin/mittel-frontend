import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HomePage from "./pages/Homepage";
import { ClientsProvider } from "./components/ClientsProvider";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/auth/LoginPage";
import Header from "./components/Header";
import AuthProvider from "./components/AuthProvider";
import RegisterPage from "./pages/auth/RegisterPage";
import ArticlePage from "./pages/articles/ArticlePage";
import UserPage from "./pages/users/UserPage";
import PublishPage from "./pages/articles/PublishPage";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ClientsProvider>
        <AuthProvider>
          <Header />
          <div className="px-8">
            <Routes>
              <Route index Component={HomePage} />
              <Route path="*" Component={NotFoundPage} />
              <Route path="login" Component={LoginPage} />
              <Route path="register" Component={RegisterPage} />
              <Route path="articles/:id" Component={ArticlePage} />
              <Route path="users/:id" Component={UserPage} />
              <Route path="publish" Component={PublishPage} />
            </Routes>
          </div>
        </AuthProvider>
      </ClientsProvider>
    </QueryClientProvider>
  </BrowserRouter>
);
export default App;
