import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash, FaBus, FaSearch } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import {
  getRoutes,
  addRoute,
  updateRoute,
  deleteRoute,
} from "../services/routeService";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentRoute, setCurrentRoute] = useState({
    number: "",
    name: "",
    region: "Western",
    stops: [],
    frequency: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newStop, setNewStop] = useState("");

  // Regions array for dropdown
  const regions = [
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

  // Check if user is admin
  useEffect(() => {
    if (
      !loading &&
      (!currentUser || !userProfile || userProfile.role !== "admin")
    ) {
      navigate("/");
    }
  }, [currentUser, userProfile, loading, navigate]);

  // Fetch routes from Firebase
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        const routesData = await getRoutes();
        setRoutes(routesData);
        setError(null);
      } catch (err) {
        console.error("Error fetching routes:", err);
        setError("Failed to load routes data");
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentRoute((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add new stop to array
  const handleAddStop = () => {
    if (newStop.trim() !== "") {
      setCurrentRoute((prev) => ({
        ...prev,
        stops: [...prev.stops, newStop.trim()],
      }));
      setNewStop("");
    }
  };

  // Remove stop from array
  const handleRemoveStop = (index) => {
    setCurrentRoute((prev) => ({
      ...prev,
      stops: prev.stops.filter((_, i) => i !== index),
    }));
  };

  // Open modal for adding new route
  const handleOpenAddModal = () => {
    setCurrentRoute({
      number: "",
      name: "",
      region: "Western",
      stops: [],
      frequency: "",
    });
    setIsEditing(false);
    setShowModal(true);
  };

  // Open modal for editing route
  const handleOpenEditModal = (route) => {
    setCurrentRoute(route);
    setIsEditing(true);
    setShowModal(true);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (isEditing) {
        await updateRoute(currentRoute.id, currentRoute);
        setRoutes((prev) =>
          prev.map((route) =>
            route.id === currentRoute.id ? currentRoute : route
          )
        );
      } else {
        const newRoute = await addRoute(currentRoute);
        setRoutes((prev) => [...prev, newRoute]);
      }

      setShowModal(false);
      setError(null);
    } catch (err) {
      console.error("Error saving route:", err);
      setError(isEditing ? "Failed to update route" : "Failed to add route");
    } finally {
      setLoading(false);
    }
  };

  // Handle route deletion
  const handleDeleteRoute = async (routeId) => {
    if (window.confirm("Are you sure you want to delete this route?")) {
      try {
        setLoading(true);
        await deleteRoute(routeId);
        setRoutes((prev) => prev.filter((route) => route.id !== routeId));
        setError(null);
      } catch (err) {
        console.error("Error deleting route:", err);
        setError("Failed to delete route");
      } finally {
        setLoading(false);
      }
    }
  };

  // Filter routes based on search query
  const filteredRoutes = routes.filter((route) => {
    return (
      route.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.stops.some((stop) =>
        stop.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  });

  if (loading && !routes.length) {
    return (
      <div className="bg-black min-h-screen text-white flex justify-center items-center">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-yellow-500 border-opacity-20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-yellow-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              <span className="text-yellow-500">Admin</span> Dashboard
            </h1>
            <p className="text-gray-400 mt-2">
              Manage all bus routes from a single place
            </p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-6 py-3 rounded-lg flex items-center transition-colors"
          >
            <FaPlus className="mr-2" /> Add New Route
          </button>
        </div>

        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search routes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 rounded-lg border-2 border-yellow-500 bg-black bg-opacity-50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-yellow-500">
              <FaSearch size={20} />
            </div>
          </div>
        </div>

        {/* Routes Table */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-yellow-500 uppercase tracking-wider">
                    Route #
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-yellow-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-yellow-500 uppercase tracking-wider">
                    Region
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-yellow-500 uppercase tracking-wider">
                    Frequency
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-yellow-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredRoutes.length > 0 ? (
                  filteredRoutes.map((route) => (
                    <tr key={route.id} className="hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className="bg-yellow-500 bg-opacity-10 text-black px-3 py-1 rounded-lg">
                          #{route.number}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {route.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {route.region}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {route.frequency}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleOpenEditModal(route)}
                          className="text-blue-500 hover:text-blue-400 mr-4"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteRoute(route.id)}
                          className="text-red-500 hover:text-red-400"
                        >
                          <FaTrash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-10 text-center text-gray-400"
                    >
                      {searchQuery
                        ? "No routes found matching your search"
                        : "No routes available. Add your first route!"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Route Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                <span className="text-yellow-500">
                  {isEditing ? "Edit" : "Add New"}
                </span>{" "}
                Route
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Route Number
                    </label>
                    <input
                      type="text"
                      name="number"
                      value={currentRoute.number}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Route Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={currentRoute.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Region
                    </label>
                    <select
                      name="region"
                      value={currentRoute.region}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      required
                    >
                      {regions.map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Frequency
                    </label>
                    <input
                      type="text"
                      name="frequency"
                      value={currentRoute.frequency}
                      onChange={handleInputChange}
                      placeholder="e.g. 10-15 min"
                      className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      required
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Stops
                  </label>
                  <div className="flex items-center mb-4">
                    <input
                      type="text"
                      value={newStop}
                      onChange={(e) => setNewStop(e.target.value)}
                      placeholder="Add a stop"
                      className="flex-1 px-4 py-3 rounded-l-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddStop}
                      className="px-4 py-3 bg-yellow-500 text-black font-medium rounded-r-lg hover:bg-yellow-600 transition-colors"
                    >
                      Add
                    </button>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4">
                    {currentRoute.stops.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {currentRoute.stops.map((stop, index) => (
                          <div
                            key={index}
                            className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm flex items-center"
                          >
                            {stop}
                            <button
                              type="button"
                              onClick={() => handleRemoveStop(index)}
                              className="ml-2 text-red-400 hover:text-red-300"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">
                        No stops added yet. Add at least one stop.
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-600 transition-colors flex items-center"
                    disabled={currentRoute.stops.length === 0}
                  >
                    <FaBus className="mr-2" />
                    {isEditing ? "Update Route" : "Add Route"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
