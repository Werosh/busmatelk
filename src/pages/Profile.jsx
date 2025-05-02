import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import React from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaSignOutAlt,
  FaSave,
  FaBus,
  FaHeart,
  FaRoute,
  FaArrowDown,
  FaAngleRight,
  FaEdit,
  FaTimes,
} from "react-icons/fa";
import { validatePhone } from "../utils/helpers";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [favoriteRoutes, setFavoriteRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Check if user is logged in
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Fetch user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);
            setEditFormData({
              name: data.name || "",
              phone: data.phone || "",
            });

            // Fetch favorite routes data
            setFavoriteRoutes(data.favorites || []);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        // Redirect to login if not authenticated
        navigate("/login");
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setErrors({});
    setUpdateSuccess(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing again
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!editFormData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (editFormData.phone && !validatePhone(editFormData.phone)) {
      newErrors.phone = "Please enter a valid Sri Lankan phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSaving(true);

    try {
      // Update user profile in Firestore
      await updateDoc(doc(db, "users", user.uid), {
        name: editFormData.name,
        phone: editFormData.phone || "",
      });

      // Update display name in Authentication
      await user.updateProfile({
        displayName: editFormData.name,
      });

      // Update local state
      setUserData((prev) => ({
        ...prev,
        name: editFormData.name,
        phone: editFormData.phone || "",
      }));

      setUpdateSuccess(true);
      setTimeout(() => {
        setIsEditing(false);
        setUpdateSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrors((prev) => ({
        ...prev,
        general: "Failed to update profile. Please try again.",
      }));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    // Reset form data to current user data
    if (userData) {
      setEditFormData({
        name: userData.name || "",
        phone: userData.phone || "",
      });
    }
  };

  // Sample routes for display - in real app, these would come from userData.favorites
  const sampleFavoriteRoutes = [
    {
      id: "138",
      name: "Pettah - Kaduwela",
      stops: "Pettah, Maradana, Borella, Battaramulla, Kaduwela",
    },
    {
      id: "100",
      name: "Colombo - Kandy",
      stops: "Colombo, Kadawatha, Nittambuwa, Kegalle, Mawanella, Kandy",
    },
  ];

  // Display the favorite routes from user data or sample routes for demonstration
  const displayRoutes =
    favoriteRoutes.length > 0 ? favoriteRoutes : sampleFavoriteRoutes;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Background with animated dots */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-gray-900 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,204,0,0.1)_0,rgba(0,0,0,0)_70%)]"></div>
        </div>

        {/* Animated dots */}
        {[...Array(20)].map((_, i) => (
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

      <div className="container mx-auto px-4 py-12 relative z-10 animate-fadeIn">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-12 text-center">
          <span className="text-yellow-500">My</span> Profile
        </h1>

        {/* Profile Content */}
        <div className="max-w-4xl mx-auto">
          {/* Profile Card */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 hover:border-yellow-500 transition-all duration-500 overflow-hidden shadow-lg shadow-yellow-500/5 mb-10">
            <div className="h-2 bg-yellow-500"></div>

            <div className="p-8">
              {/* Status Messages */}
              {errors.general && (
                <div className="mb-6 p-4 bg-red-900 bg-opacity-30 border border-red-500 text-red-400 rounded-lg">
                  {errors.general}
                </div>
              )}

              {updateSuccess && (
                <div className="mb-6 p-4 bg-green-900 bg-opacity-30 border border-green-500 text-green-400 rounded-lg">
                  Profile updated successfully!
                </div>
              )}

              {isEditing ? (
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div>
                    <label className="flex items-center mb-3 text-sm font-medium text-gray-300">
                      <FaUser className="mr-2 text-yellow-500" /> Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleChange}
                      className={`w-full px-6 py-4 rounded-lg border-2 ${
                        errors.name ? "border-red-500" : "border-yellow-500"
                      } bg-black bg-opacity-50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                      placeholder="Enter your name"
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-400">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center mb-3 text-sm font-medium text-gray-300">
                      <FaEnvelope className="mr-2 text-yellow-500" /> Email
                      Address
                    </label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="w-full px-6 py-4 rounded-lg border-2 border-gray-700 bg-gray-800 bg-opacity-50 text-gray-400"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Email cannot be changed
                    </p>
                  </div>

                  <div>
                    <label className="flex items-center mb-3 text-sm font-medium text-gray-300">
                      <FaPhoneAlt className="mr-2 text-yellow-500" /> Phone
                      Number (Optional)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={editFormData.phone}
                      onChange={handleChange}
                      className={`w-full px-6 py-4 rounded-lg border-2 ${
                        errors.phone ? "border-red-500" : "border-yellow-500"
                      } bg-black bg-opacity-50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                      placeholder="07XXXXXXXX"
                    />
                    {errors.phone && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                    >
                      <FaSave className="mr-2" />
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>

                    <button
                      type="button"
                      onClick={handleCancel}
                      className="bg-transparent border-2 border-gray-500 text-gray-300 font-bold py-3 px-8 rounded-full hover:bg-gray-800 transition-all duration-300 flex items-center justify-center"
                    >
                      <FaTimes className="mr-2" />
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  {/* User Info Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Name Card */}
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-yellow-500 transition-all duration-300 transform hover:-translate-y-1">
                      <div className="rounded-full bg-yellow-500 bg-opacity-10 w-12 h-12 flex items-center justify-center mb-4">
                        <FaUser className="text-yellow-500 text-xl" />
                      </div>
                      <p className="text-sm text-gray-400 mb-1">Full Name</p>
                      <p className="text-xl font-semibold">
                        {userData?.name || "Not set"}
                      </p>
                    </div>

                    {/* Email Card */}
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-yellow-500 transition-all duration-300 transform hover:-translate-y-1">
                      <div className="rounded-full bg-yellow-500 bg-opacity-10 w-12 h-12 flex items-center justify-center mb-4">
                        <FaEnvelope className="text-yellow-500 text-xl" />
                      </div>
                      <p className="text-sm text-gray-400 mb-1">
                        Email Address
                      </p>
                      <p className="text-xl font-semibold">
                        {user?.email || "Not available"}
                      </p>
                    </div>

                    {/* Phone Card */}
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-yellow-500 transition-all duration-300 transform hover:-translate-y-1">
                      <div className="rounded-full bg-yellow-500 bg-opacity-10 w-12 h-12 flex items-center justify-center mb-4">
                        <FaPhoneAlt className="text-yellow-500 text-xl" />
                      </div>
                      <p className="text-sm text-gray-400 mb-1">Phone Number</p>
                      <p className="text-xl font-semibold">
                        {userData?.phone || "Not set"}
                      </p>
                    </div>

                    {/* Favorites Card */}
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-yellow-500 transition-all duration-300 transform hover:-translate-y-1">
                      <div className="rounded-full bg-yellow-500 bg-opacity-10 w-12 h-12 flex items-center justify-center mb-4">
                        <FaHeart className="text-yellow-500 text-xl" />
                      </div>
                      <p className="text-sm text-gray-400 mb-1">
                        Favorite Routes
                      </p>
                      <p className="text-xl font-semibold">
                        {favoriteRoutes.length || 0}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                    <button
                      onClick={handleEdit}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                    >
                      <FaEdit className="mr-2" />
                      Edit Profile
                    </button>

                    <button
                      onClick={handleSignOut}
                      className="bg-transparent border-2 border-yellow-500 text-yellow-500 font-bold py-3 px-8 rounded-full hover:bg-yellow-500 hover:text-black transition-all duration-300 flex items-center justify-center"
                    >
                      <FaSignOutAlt className="mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Favorite Routes Section */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 hover:border-yellow-500 transition-all duration-500 overflow-hidden shadow-lg shadow-yellow-500/5">
            <div className="h-2 bg-yellow-500"></div>

            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">
                  <span className="text-yellow-500">My</span> Favorite Routes
                </h2>
                <button
                  onClick={() => navigate("/routes")}
                  className="text-yellow-500 hover:text-yellow-400 font-medium flex items-center group"
                >
                  Browse all
                  <FaAngleRight className="ml-1 group-hover:ml-2 transition-all duration-300" />
                </button>
              </div>

              {displayRoutes.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {displayRoutes.map((route, index) => (
                    <div
                      key={route.id}
                      className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-yellow-500 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
                      onClick={() => navigate(`/route/${route.id}`)}
                      style={{
                        animationDelay: `${index * 0.1}s`,
                      }}
                    >
                      <div className="h-1 bg-yellow-500"></div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-semibold">
                            Route {route.id}
                          </h3>
                          <div className="bg-yellow-500 bg-opacity-10 rounded-full p-2 group-hover:bg-yellow-500 transition-all duration-500">
                            <FaBus className="text-yellow-500 group-hover:text-black transition-all duration-500" />
                          </div>
                        </div>
                        <p className="font-medium text-lg mb-3">{route.name}</p>
                        <div className="bg-gray-900 rounded p-3">
                          <p className="text-sm text-gray-400">
                            <span className="text-yellow-500 font-medium">
                              Stops:
                            </span>{" "}
                            {route.stops}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FaBus className="mx-auto text-5xl text-yellow-500 opacity-30 mb-4" />
                  <h3 className="text-xl font-medium mb-2">
                    No Favorite Routes Yet
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Save routes to access them quickly here
                  </p>
                  <button
                    onClick={() => navigate("/routes")}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center justify-center mx-auto"
                  >
                    <FaRoute className="mr-2" />
                    Explore Routes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
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

export default Profile;
