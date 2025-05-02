import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import AllRoutes from "./pages/AllRoutes";
import RouteDetailsPage from "./pages/RouteDetailsPage";
import Favorites from "./pages/Favorites";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import Preloader from "./components/ui/Preloader";

function App() {
  return (
    <>
      <Preloader />

      <Router>
        <AuthProvider>
          <FavoritesProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/routes" element={<AllRoutes />} />
                <Route path="/route/:id" element={<RouteDetailsPage />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin_dashbord" element={<AdminDashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </FavoritesProvider>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
