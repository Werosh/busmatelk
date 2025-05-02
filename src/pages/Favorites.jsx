import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import React from "react";
import {
  FaRoute,
  FaBus,
  FaTrash,
  FaStar,
  FaAngleRight,
  FaSearch,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Favorites = () => {
  const { currentUser } = useAuth();
  const { favoriteRoutes, loading, error, removeFromFavorites, isFavorite } =
    useFavorites();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser && !loading) {
      navigate("/login", { state: { from: "/favorites" } });
    }
  }, [currentUser, loading, navigate]);

  // Filter routes based on search query
  useEffect(() => {
    if (favoriteRoutes) {
      setFilteredRoutes(
        favoriteRoutes.filter(
          (route) =>
            route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            route.id.toString().includes(searchQuery)
        )
      );
    }
  }, [searchQuery, favoriteRoutes]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Just filter the already fetched favorites
    setSearchQuery(e.target.value);
  };

  const handleRemoveFavorite = async (routeId) => {
    try {
      await removeFromFavorites(routeId);
    } catch (err) {
      console.error("Error removing favorite:", err);
    }
  };

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-yellow-500 border-t-transparent"></div>
          <p className="mt-4 text-yellow-500">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 flex items-center justify-center overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-gray-900 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,204,0,0.1)_0,rgba(0,0,0,0)_70%)]"></div>
        </div>

        {/* Animated dots */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-yellow-500 opacity-10"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                animation: `float ${
                  Math.random() * 10 + 10
                }s infinite ease-in-out`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            ></div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 z-10 text-center">
          <div className="animate-fadeIn">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              <span className="text-yellow-500">Your Favorites</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              Quick access to your most loved routes for simplified journey
              planning
            </p>
          </div>
        </div>
      </section>

      {/* Favorites Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-8">
            <FaStar className="text-yellow-500 mr-3" size={24} />
            <h2 className="text-3xl md:text-4xl font-bold">
              Your Favorite Routes
            </h2>
          </div>

          {error && (
            <div className="bg-red-900 bg-opacity-25 border border-red-500 text-red-500 rounded-lg p-4 mb-8">
              <p>{error}</p>
            </div>
          )}

          {favoriteRoutes.length === 0 ? (
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-12 text-center">
              <div className="flex justify-center mb-6">
                <div className="rounded-full bg-yellow-500 bg-opacity-10 w-20 h-20 flex items-center justify-center">
                  <FaRoute className="text-yellow-500 text-4xl" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-4">No Favorites Yet</h3>
              <p className="text-xl text-gray-400 mb-8 max-w-lg mx-auto">
                You haven't added any bus routes to your favorites yet. Explore
                our routes and add your favorites for quick access.
              </p>
              <button
                onClick={() => navigate("/routes")}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                Explore Routes
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRoutes.map((route) => (
                <div
                  key={route.id}
                  className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-yellow-500 transition-all duration-500 transform hover:-translate-y-2 group relative"
                >
                  <div className="h-2 bg-yellow-500"></div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold">
                        Route {route.id}
                      </h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFavorite(route.id);
                          }}
                          className="bg-red-500 bg-opacity-10 hover:bg-red-500 rounded-full p-2 transition-all duration-300 group-hover:text-black"
                        >
                          <FaTrash
                            className="text-red-500 group-hover:text-black transition-all duration-300"
                            size={14}
                          />
                        </button>
                        <div className="bg-yellow-500 bg-opacity-10 rounded-full p-2 group-hover:bg-yellow-500 transition-all duration-500">
                          <FaBus className="text-yellow-500 group-hover:text-black transition-all duration-500" />
                        </div>
                      </div>
                    </div>
                    <p className="font-medium text-lg mb-3">{route.name}</p>
                    <div className="bg-gray-800 rounded p-3">
                      <p className="text-sm text-gray-400">
                        <span className="text-yellow-500 font-medium">
                          Stops:
                        </span>{" "}
                        {route.stops}
                      </p>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => navigate(`/route/${route.id}`)}
                        className="text-yellow-500 hover:text-yellow-400 font-medium flex items-center group"
                      >
                        View Details
                        <FaAngleRight className="ml-1 group-hover:ml-2 transition-all duration-300" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Favorites;
