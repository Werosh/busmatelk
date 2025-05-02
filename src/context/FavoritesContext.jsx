import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import {
  addFavorite,
  removeFavorite,
  getUserFavorites,
  getRouteById,
} from "../services/firebase";

// Create the favorites context
export const FavoritesContext = createContext();

// Custom hook for using the favorites context
export const useFavorites = () => {
  return useContext(FavoritesContext);
};

export const FavoritesProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [favoriteRoutes, setFavoriteRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user's favorites when user changes
  useEffect(() => {
    const loadFavorites = async () => {
      if (!currentUser) {
        setFavorites([]);
        setFavoriteRoutes([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Get favorite route IDs
        const favoriteIds = await getUserFavorites(currentUser.uid);
        setFavorites(favoriteIds);

        // Fetch full route data for each favorite
        const routePromises = favoriteIds.map((id) => getRouteById(id));
        const routes = await Promise.all(routePromises);
        setFavoriteRoutes(routes.filter((route) => route !== null));
      } catch (err) {
        console.error("Error loading favorites:", err);
        setError("Failed to load favorites");
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [currentUser]);

  // Add a route to favorites
  const addToFavorites = async (routeId) => {
    if (!currentUser) {
      setError("You must be logged in to add favorites");
      throw new Error("Authentication required");
    }

    try {
      setError(null);
      await addFavorite(currentUser.uid, routeId);

      // Update local state
      if (!favorites.includes(routeId)) {
        setFavorites((prev) => [...prev, routeId]);

        // Fetch and add the route details to favoriteRoutes
        const route = await getRouteById(routeId);
        if (route) {
          setFavoriteRoutes((prev) => [...prev, route]);
        }
      }

      return true;
    } catch (err) {
      setError("Failed to add favorite");
      throw err;
    }
  };

  // Remove a route from favorites
  const removeFromFavorites = async (routeId) => {
    if (!currentUser) {
      setError("You must be logged in to remove favorites");
      throw new Error("Authentication required");
    }

    try {
      setError(null);
      await removeFavorite(currentUser.uid, routeId);

      // Update local state
      setFavorites((prev) => prev.filter((id) => id !== routeId));
      setFavoriteRoutes((prev) => prev.filter((route) => route.id !== routeId));

      return true;
    } catch (err) {
      setError("Failed to remove favorite");
      throw err;
    }
  };

  // Check if a route is in favorites
  const isFavorite = (routeId) => {
    return favorites.includes(routeId);
  };

  const value = {
    favorites,
    favoriteRoutes,
    loading,
    error,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
