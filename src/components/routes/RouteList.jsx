import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaFilter } from "react-icons/fa";
import RouteCard from "./RouteCard";
import { getRoutes } from "../../services/routeService";
import { FavoritesContext } from "../../contexts/FavoritesContext";

const RouteList = () => {
  const [routes, setRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const routesData = await getRoutes();
        setRoutes(routesData);
        setFilteredRoutes(routesData);
      } catch (error) {
        console.error("Error fetching routes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredRoutes(routes);
      return;
    }

    const filtered = routes.filter(
      (route) =>
        route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.routeNumber.toString().includes(searchTerm) ||
        route.startPoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.endPoint.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredRoutes(filtered);
  }, [searchTerm, routes]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-darkGray">Loading routes...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 sticky top-0 bg-background pt-4 pb-4 z-10">
        <div className="relative">
          <input
            type="text"
            placeholder="Search routes by number, name, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-lg border border-lightGray focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <FaSearch className="absolute left-3 top-3.5 text-darkGray" />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="absolute right-3 top-3 text-darkGray"
          >
            <FaFilter />
          </button>
        </div>

        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-3 p-4 border border-lightGray rounded-lg"
          >
            {/* Filter options would go here */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">Sort by</label>
                <select className="w-full p-2 rounded border border-lightGray">
                  <option value="number">Route Number</option>
                  <option value="name">Route Name</option>
                  <option value="distance">Distance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Region</label>
                <select className="w-full p-2 rounded border border-lightGray">
                  <option value="all">All Regions</option>
                  <option value="colombo">Colombo</option>
                  <option value="kandy">Kandy</option>
                  <option value="galle">Galle</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {filteredRoutes.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-darkGray">No routes found matching your search.</p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredRoutes.map((route) => (
            <RouteCard
              key={route.id}
              route={route}
              isFavorite={favorites.includes(route.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default RouteList;
