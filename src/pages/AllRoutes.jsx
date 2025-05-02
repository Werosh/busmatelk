import { useState, useEffect } from "react";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaSearch,
  FaFilter,
  FaBus,
  FaStar,
  FaMapMarkerAlt,
  FaClock,
  FaAngleRight,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import {
  getAllRoutes,
  searchRoutes,
  getRoutesByRegion,
} from "../services/routeService"; // Import the Firebase service functions

const AllRoutes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);

  // Get search query from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search");
    if (search) {
      setSearchQuery(search);
    }
  }, [location.search]);

  // Fetch routes from Firebase
  useEffect(() => {
    const fetchRoutes = async () => {
      setLoading(true);
      setError(null);

      try {
        if (searchQuery) {
          // Search routes if there's a query
          const searchResults = await searchRoutes(searchQuery);
          setRoutes(searchResults);
          setTotalPages(1); // For search results, we don't paginate currently
        } else if (selectedRegion !== "All") {
          // Get routes by region
          const regionRoutes = await getRoutesByRegion(selectedRegion);
          setRoutes(regionRoutes);
          setTotalPages(1); // For region filtering, we don't paginate currently
        } else {
          // Get all routes with pagination
          const routesData = await getAllRoutes(currentPage, 10);
          setRoutes(routesData.routes);
          setTotalPages(routesData.totalPages);
          setCurrentPage(routesData.currentPage);
        }
      } catch (err) {
        console.error("Error fetching routes:", err);
        setError("Failed to load routes. Please try again later.");
        setRoutes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, [searchQuery, selectedRegion, currentPage]);

  const regions = [
    "All",
    "Western",
    "Central",
    "Southern",
    "Northern",
    "Eastern",
    "North Western",
    "North Central",
    "Uva",
    "Sabaragamuwa",
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // Reset pagination when searching
    setCurrentPage(1);
    // Update URL with search query
    navigate(`/routes?search=${searchQuery}`);
  };

  const toggleFavorite = (routeId) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (favorites.includes(routeId)) {
      removeFavorite(routeId);
    } else {
      addFavorite(routeId);
    }
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // Scroll to top when changing page
      window.scrollTo(0, 0);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Header Background with Glowing Effect */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 to-transparent h-64 z-0"></div>
        <div className="absolute top-32 left-1/4 w-32 h-32 bg-yellow-500 rounded-full filter blur-3xl opacity-5"></div>
        <div className="absolute top-48 right-1/4 w-48 h-48 bg-yellow-500 rounded-full filter blur-3xl opacity-5"></div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              <span className="text-yellow-500">Premium</span> Bus Routes
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl">
              Experience the finest transportation options across Sri Lanka with
              our premium route network
            </p>
          </div>

          {/* Search and Filter */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-12 shadow-lg backdrop-blur-sm bg-opacity-90">
            <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[300px]">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by route number, name or stop..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-6 py-4 rounded-lg border-2 border-yellow-500 bg-black bg-opacity-50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <button
                    type="submit"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-yellow-500 hover:text-yellow-400 transition-colors"
                  >
                    <FaSearch size={20} />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setFilterOpen(!filterOpen)}
                className="px-6 py-4 bg-gray-800 hover:bg-gray-700 text-yellow-500 rounded-lg flex items-center gap-2 border border-gray-700 transition-colors"
              >
                <FaFilter /> Filter Options
              </button>
            </form>

            {filterOpen && (
              <motion.div
                className="mt-6 pt-6 border-t border-gray-800"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <div>
                  <p className="font-medium mb-3 text-yellow-500">Region:</p>
                  <div className="flex flex-wrap gap-2">
                    {regions.map((region) => (
                      <button
                        key={region}
                        className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                          selectedRegion === region
                            ? "bg-yellow-500 text-black font-medium"
                            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        }`}
                        onClick={() => {
                          setSelectedRegion(region);
                          setCurrentPage(1); // Reset to first page when changing region
                        }}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/20 border border-red-500 text-red-200 p-4 rounded-lg mb-6">
              <p>{error}</p>
            </div>
          )}

          {/* Routes List */}
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <div className="relative w-20 h-20">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-yellow-500 border-opacity-20 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-yellow-500 rounded-full animate-spin"></div>
              </div>
            </div>
          ) : routes.length > 0 ? (
            <>
              <motion.div
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {routes.map((route) => (
                  <motion.div
                    key={route.id}
                    className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-yellow-500 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-xl hover:shadow-yellow-500/10 group"
                    variants={itemVariants}
                  >
                    <div className="h-2 bg-yellow-500"></div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center">
                            <span className="bg-yellow-500 bg-opacity-10 text-black font-bold px-3 py-1 rounded-lg mr-3">
                              #{route.routeNumber || route.number}
                            </span>
                            <h3 className="text-xl font-semibold">
                              {route.name}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-400 mt-2 flex items-center">
                            <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                            {route.region} Region
                          </p>
                        </div>
                        <button
                          onClick={() => toggleFavorite(route.id)}
                          className="ml-2 p-2"
                          aria-label={
                            favorites.includes(route.id)
                              ? "Remove from favorites"
                              : "Add to favorites"
                          }
                        >
                          <FaStar
                            size={22}
                            className={`${
                              favorites.includes(route.id)
                                ? "text-yellow-500"
                                : "text-gray-600 group-hover:text-gray-500"
                            } transition-colors duration-300`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center mb-4 text-gray-400">
                        <FaClock className="mr-2 text-yellow-500" />
                        <span className="text-sm">
                          Frequency: {route.frequency || "N/A"}
                        </span>
                      </div>

                      <div className="bg-black bg-opacity-30 rounded-lg p-4 mb-5">
                        <p className="text-sm text-yellow-500 mb-3 font-medium flex items-center">
                          <FaMapMarkerAlt className="mr-2" /> Major Stops:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(route.stops || [])
                            .slice(0, 5)
                            .map((stop, index) => (
                              <span
                                key={index}
                                className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm"
                              >
                                {stop}
                              </span>
                            ))}
                          {!route.stops && (
                            <span className="text-gray-500">
                              {route.startPoint} - {route.endPoint}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 disabled:opacity-50 hover:bg-gray-700 transition-colors"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            currentPage === page
                              ? "bg-yellow-500 text-black font-medium"
                              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 disabled:opacity-50 hover:bg-gray-700 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-10 text-center">
              <div className="bg-black bg-opacity-30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <FaBus className="text-yellow-500 h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-3">No Routes Found</h3>
              <p className="text-gray-400 mb-6 max-w-lg mx-auto">
                We couldn't find any premium routes matching your search
                criteria. Please try adjusting your filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedRegion("All");
                  setCurrentPage(1);
                  navigate("/routes");
                }}
                className="px-6 py-3 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-400 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Animated dots for background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-yellow-500 opacity-10"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 8 + 2}px`,
              height: `${Math.random() * 8 + 2}px`,
              animation: `float ${
                Math.random() * 10 + 10
              }s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          ></div>
        ))}
      </div>

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
      `}</style>
    </div>
  );
};

export default AllRoutes;
