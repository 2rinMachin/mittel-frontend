import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HomePage from "./pages/Homepage";
import { ClientsContextProvider } from "./components/ClientsContextProvider";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/auth/LoginPage";
import Header from "./components/Header";

const queryClient = new QueryClient();

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ClientsContextProvider>
          <Header />
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
