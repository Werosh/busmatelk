import { db } from "./firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

// Collection references
const routesCollection = collection(db, "routes");
const stopsCollection = collection(db, "stops");

/**
 * Get all routes from Firestore
 * @returns {Promise<Array>} Array of route objects
 */
export const getRoutes = async () => {
  try {
    const routesSnapshot = await getDocs(routesCollection);
    return routesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting routes:", error);
    throw error;
  }
};

/**
 * Get route by ID
 * @param {string} routeId - The route ID
 * @returns {Promise<Object|null>} Route object or null if not found
 */
export const getRouteById = async (routeId) => {
  try {
    const routeDoc = await getDoc(doc(db, "routes", routeId));

    if (routeDoc.exists()) {
      return {
        id: routeDoc.id,
        ...routeDoc.data(),
      };
    }

    return null;
  } catch (error) {
    console.error("Error getting route by ID:", error);
    throw error;
  }
};

/**
 * Get all bus routes with pagination support
 * @param {number} page - Page number (starting from 1)
 * @param {number} limit - Number of items per page
 * @returns {Promise<Object>} Paginated results with metadata
 */
export const getAllRoutes = async (page = 1, limit = 10) => {
  try {
    const routes = await getRoutes();

    // Simple pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedRoutes = routes.slice(startIndex, endIndex);

    return {
      routes: paginatedRoutes,
      totalRoutes: routes.length,
      totalPages: Math.ceil(routes.length / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error("Error fetching routes:", error);
    throw error;
  }
};

/**
 * Get multiple routes by their IDs
 * @param {Array<string>} routeIds - Array of route IDs
 * @returns {Promise<Array>} Array of route objects
 */
export const getRoutesByIds = async (routeIds) => {
  try {
    if (!routeIds || !Array.isArray(routeIds) || routeIds.length === 0) {
      return [];
    }

    // For best performance with Firestore, we should use a where-in query
    // But if the array is large, we need to batch the requests due to Firestore limitations
    if (routeIds.length <= 10) {
      // Firestore has a limit of 10 items in a "in" query
      const routesQuery = query(
        routesCollection,
        where("__name__", "in", routeIds)
      );

      const routesSnapshot = await getDocs(routesQuery);
      return routesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } else {
      // If we have more than 10 ids, we need to batch the requests
      const batches = [];

      // Split the array into chunks of 10
      for (let i = 0; i < routeIds.length; i += 10) {
        const batch = routeIds.slice(i, i + 10);
        const routesQuery = query(
          routesCollection,
          where("__name__", "in", batch)
        );

        batches.push(getDocs(routesQuery));
      }

      // Wait for all batches to complete
      const snapshots = await Promise.all(batches);

      // Combine all results
      let routes = [];
      snapshots.forEach((snapshot) => {
        routes = routes.concat(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      });

      return routes;
    }
  } catch (error) {
    console.error("Error fetching routes by ids:", error);
    throw error;
  }
};

/**
 * Search routes by number or location (start/end point)
 * @param {string} searchTerm - Search query
 * @returns {Promise<Array>} Array of matching route objects
 */
export const searchRoutes = async (searchTerm) => {
  try {
    if (!searchTerm || searchTerm.trim() === "") {
      return [];
    }

    const term = searchTerm.toLowerCase().trim();
    const routes = await getRoutes();

    // Filter routes that match the search term
    return routes.filter((route) => {
      const routeNumber =
        route.routeNumber?.toLowerCase() || route.number?.toLowerCase() || "";
      const routeName = route.name?.toLowerCase() || "";
      const startPoint = route.startPoint?.toLowerCase() || "";
      const endPoint = route.endPoint?.toLowerCase() || "";
      const region = route.region?.toLowerCase() || "";
      const viaPoints = route.viaPoints?.map((p) => p.toLowerCase()) || [];
      const stops = route.stops?.map((stop) => stop.toLowerCase()) || [];

      return (
        routeNumber.includes(term) ||
        routeName.includes(term) ||
        startPoint.includes(term) ||
        endPoint.includes(term) ||
        region.includes(term) ||
        viaPoints.some((point) => point.includes(term)) ||
        stops.some((stop) => stop.includes(term))
      );
    });
  } catch (error) {
    console.error("Error searching routes:", error);
    throw error;
  }
};

/**
 * Get route details with stops
 * @param {string} routeId - The route ID
 * @returns {Promise<Object>} Route object with stops
 */
export const getRouteDetails = async (routeId) => {
  try {
    const route = await getRouteById(routeId);

    if (!route) {
      throw new Error("Route not found");
    }

    // Fetch stops for this route if they're in a separate collection
    const stopsQuery = query(stopsCollection, where("routeId", "==", routeId));

    const stopsSnapshot = await getDocs(stopsQuery);
    const stops = stopsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Sort stops by their sequence
    stops.sort((a, b) => a.sequence - b.sequence);

    return {
      ...route,
      stops,
    };
  } catch (error) {
    console.error(`Error fetching route details for ${routeId}:`, error);
    throw error;
  }
};

/**
 * Get popular routes
 * @param {number} limit - Number of routes to return
 * @returns {Promise<Array>} Array of popular route objects
 */
export const getPopularRoutes = async (limit = 5) => {
  try {
    // In a real app, you'd have a field like 'viewCount' or 'favoriteCount'
    // For now, we'll just return the first few routes
    const { routes } = await getAllRoutes(1, limit);
    return routes;
  } catch (error) {
    console.error("Error fetching popular routes:", error);
    throw error;
  }
};

/**
 * Get routes by region
 * @param {string} region - The region name
 * @returns {Promise<Array>} Array of route objects
 */
export const getRoutesByRegion = async (region) => {
  try {
    // Handle both array-contains and direct equality queries
    const q = query(routesCollection, where("region", "==", region));
    const querySnapshot = await getDocs(q);

    // Try the array-contains query if the direct query returns no results
    if (querySnapshot.empty) {
      const arrayQuery = query(
        routesCollection,
        where("regions", "array-contains", region)
      );
      const arraySnapshot = await getDocs(arrayQuery);
      return arraySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    }

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error(`Error fetching routes for region ${region}:`, error);
    throw error;
  }
};

/**
 * Get neighboring stops
 * @param {string} stopId - The stop ID
 * @param {number} distance - The distance in meters
 * @returns {Promise<Array>} Array of nearby stop objects
 */
export const getNeighboringStops = async (stopId, distance = 500) => {
  try {
    // This would require a more complex geospatial query in a real app
    // For now, we'll just return an empty array
    return [];
  } catch (error) {
    console.error(`Error fetching neighboring stops for ${stopId}:`, error);
    throw error;
  }
};

/**
 * Add a new route to Firestore
 * @param {Object} routeData - The route data
 * @returns {Promise<Object>} The added route with ID
 */
export const addRoute = async (routeData) => {
  try {
    // Add timestamps
    const routeWithTimestamps = {
      ...routeData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(routesCollection, routeWithTimestamps);

    // Return the new route with its ID
    return {
      id: docRef.id,
      ...routeData,
    };
  } catch (error) {
    console.error("Error adding route:", error);
    throw error;
  }
};

/**
 * Update an existing route
 * @param {string} routeId - The route ID
 * @param {Object} routeData - The updated route data
 * @returns {Promise<boolean>} Success indicator
 */
export const updateRoute = async (routeId, routeData) => {
  try {
    const routeRef = doc(db, "routes", routeId);

    // Add updated timestamp
    const updatedData = {
      ...routeData,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(routeRef, updatedData);
    return true;
  } catch (error) {
    console.error("Error updating route:", error);
    throw error;
  }
};

/**
 * Delete a route
 * @param {string} routeId - The route ID
 * @returns {Promise<boolean>} Success indicator
 */
export const deleteRoute = async (routeId) => {
  try {
    await deleteDoc(doc(db, "routes", routeId));
    return true;
  } catch (error) {
    console.error("Error deleting route:", error);
    throw error;
  }
};
