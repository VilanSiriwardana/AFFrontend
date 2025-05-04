import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import LoginForm from "./components/UserManagement/LoginForm";
import ErrorPage from "./pages/Errors/ServerError";
import NotFoundPage from "./pages/Errors/NotFoundPage";
import MainLayout from "./layouts/MainLayout";
import CountryDetail from "./pages/CountryDetail";
import RegisterForm from "./components/UserManagement/RegisterForm";

function App() {
  return (
    <Router>
      <div className="bg-secondary min-h-screen text-white">
        <Routes>
          {/* Auth */}

          <Route path="/" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />

          {/* App with Sidebar */}
          <Route
            path="/countries"
            element={
              <MainLayout>
                <Home />
              </MainLayout>
            }
          />
          <Route
            path="/country/:code"
            element={
              <MainLayout>
                <CountryDetail />
              </MainLayout>
            }
          />

          {/* Errors */}
          <Route path="/500" element={<ErrorPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
