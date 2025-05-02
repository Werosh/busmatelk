import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaShare,
  FaBus,
  FaRoute,
  FaMapMarkerAlt,
  FaClock,
  FaMoneyBillWave,
  FaInfoCircle,
  FaAngleRight,
} from "react-icons/fa";
import { getRouteById } from "../services/routeService";
import RouteDetails from "../components/routes/Routedetails";
import BusRouteMap from "../components/maps/BusRouteMap";

const RouteDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [route, setRoute] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchRouteDetails = async () => {
      try {
        setIsLoading(true);
        const routeData = await getRouteById(id);
        if (routeData) {
          setRoute(routeData);
        } else {
          setError("Route not found");
        }
      } catch (err) {
        console.error("Error fetching route details:", err);
        setError("Failed to load route details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRouteDetails();
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `BusMate LK - Route ${route.routeNumber}`,
        text: `Check out bus route ${route.routeNumber}: ${route.startPoint} to ${route.endPoint}`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-16 w-16 relative">
            <div className="absolute inset-0 rounded-full border-4 border-yellow-500 border-t-transparent animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-2 border-white border-b-transparent animate-spin animation-delay-500"></div>
          </div>
          <p className="mt-4 text-xl text-yellow-500">
            Loading premium route details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="bg-gray-900 border border-yellow-500 p-8 rounded-lg text-center max-w-md mx-auto">
          <div className="text-yellow-500 text-5xl mb-4">
            <FaInfoCircle />
          </div>
          <p className="text-xl mb-6">{error}</p>
          <button
            onClick={() => navigate("/routes")}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105"
          >
            Back to All Routes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Header with animated background */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-black shadow-lg shadow-yellow-500/10"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-yellow-500 hover:text-yellow-400 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back
            </button>
            <h1 className="text-xl font-bold">
              Route{" "}
              <span className="text-yellow-500">{route?.routeNumber}</span>
            </h1>
            <button
              onClick={handleShare}
              className="flex items-center bg-yellow-500 text-black px-4 py-2 rounded-full hover:bg-yellow-600 transition-all duration-300"
            >
              <FaShare className="mr-2" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
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
        <div className="container mx-auto px-4 z-10 relative mt-12">
          <div className="animate-fadeIn">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8 relative overflow-hidden group hover:border-yellow-500 transition-all duration-500">
              <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500 rounded-full filter blur-3xl opacity-10 transform translate-x-1/2 -translate-y-1/2 group-hover:opacity-20 transition-all duration-500"></div>

              <div className="flex items-center mb-4">
                <div className="bg-yellow-500 bg-opacity-10 rounded-full p-3 mr-4">
                  <FaBus className="text-yellow-500 text-xl" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">
                    {route.startPoint}{" "}
                    <span className="text-yellow-500">to</span> {route.endPoint}
                  </h2>
                  <p className="text-gray-400">
                    Route Number:{" "}
                    <span className="text-yellow-500 font-semibold">
                      {route.routeNumber}
                    </span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="flex items-center">
                  <div className="bg-yellow-500 bg-opacity-10 rounded-full p-2 mr-3">
                    <FaRoute className="text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Distance</p>
                    <p className="font-semibold">{route.distance} km</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-yellow-500 bg-opacity-10 rounded-full p-2 mr-3">
                    <FaClock className="text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Duration</p>
                    <p className="font-semibold">{route.duration}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-yellow-500 bg-opacity-10 rounded-full p-2 mr-3">
                    <FaMoneyBillWave className="text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Base Fare</p>
                    <p className="font-semibold">LKR {route.baseFare}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Tabs */}
      <div className="container mx-auto px-4 -mt-6 relative z-10">
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden mb-8">
          <div className="flex overflow-x-auto">
            <button
              className={`px-6 py-4 font-medium flex-1 text-center transition-all duration-300 ${
                activeTab === "details"
                  ? "bg-yellow-500 text-black"
                  : "text-gray-400 hover:text-yellow-500"
              }`}
              onClick={() => setActiveTab("details")}
            >
              Route Details
            </button>
            <button
              className={`px-6 py-4 font-medium flex-1 text-center transition-all duration-300 ${
                activeTab === "map"
                  ? "bg-yellow-500 text-black"
                  : "text-gray-400 hover:text-yellow-500"
              }`}
              onClick={() => setActiveTab("map")}
            >
              Map View
            </button>
            <button
              className={`px-6 py-4 font-medium flex-1 text-center transition-all duration-300 ${
                activeTab === "fare"
                  ? "bg-yellow-500 text-black"
                  : "text-gray-400 hover:text-yellow-500"
              }`}
              onClick={() => setActiveTab("fare")}
            >
              Fare Information
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-fadeIn">
          {activeTab === "details" && (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-8 hover:border-yellow-500 transition-all duration-500 transform hover:-translate-y-1">
              <h3 className="text-2xl font-bold mb-4 relative inline-block">
                <span className="relative z-10">Route Details</span>
                <span className="absolute bottom-0 left-0 w-full h-2 bg-yellow-500 opacity-40 z-0"></span>
              </h3>

              {/* Route stops visualization */}
              <div className="mt-8">
                {route.stops &&
                  route.stops.map((stop, index) => (
                    <div key={index} className="flex mb-4 relative">
                      <div className="mr-4 flex flex-col items-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            index === 0 || index === route.stops.length - 1
                              ? "bg-yellow-500"
                              : "bg-gray-800 border-2 border-yellow-500"
                          }`}
                        >
                          {index === 0 || index === route.stops.length - 1 ? (
                            <FaMapMarkerAlt className="text-black text-xs" />
                          ) : (
                            <span className="text-xs text-yellow-500">
                              {index}
                            </span>
                          )}
                        </div>
                        {index < route.stops.length - 1 && (
                          <div className="w-0.5 h-16 bg-gray-700 my-1"></div>
                        )}
                      </div>
                      <div className="bg-gray-800 rounded-lg p-4 flex-1 hover:bg-gray-800/70 transition-all duration-300 transform hover:translate-x-1">
                        <p className="font-medium">{stop.name}</p>
                        {stop.arrivalTime && (
                          <div className="flex items-center mt-2 text-sm text-gray-400">
                            <FaClock className="mr-2 text-yellow-500" />
                            <span>Arrival: {stop.arrivalTime}</span>
                          </div>
                        )}
                        {stop.facilities && (
                          <div className="mt-2 text-sm">
                            <span className="text-yellow-500">Facilities:</span>{" "}
                            {stop.facilities}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Additional information */}
              {route.additionalInfo && (
                <div className="mt-8 bg-black bg-opacity-50 rounded-lg p-5 border border-gray-800">
                  <h3 className="text-lg font-medium mb-3 text-yellow-500 flex items-center">
                    <FaInfoCircle className="mr-2" />
                    Additional Information
                  </h3>
                  <p className="text-gray-300">{route.additionalInfo}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "map" && (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-8 hover:border-yellow-500 transition-all duration-500 transform hover:-translate-y-1">
              <h3 className="text-2xl font-bold mb-4 relative inline-block">
                <span className="relative z-10">Route Map</span>
                <span className="absolute bottom-0 left-0 w-full h-2 bg-yellow-500 opacity-40 z-0"></span>
              </h3>

              <div className="rounded-lg overflow-hidden h-96 border border-gray-800 relative">
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-center">
                    <FaMapMarkerAlt className="text-yellow-500 text-4xl mx-auto mb-4" />
                    <p className="text-lg">Interactive map would appear here</p>
                    <p className="text-gray-400 text-sm mt-2">
                      Showing route from {route.startPoint} to {route.endPoint}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-black bg-opacity-50 rounded-lg p-4 border border-gray-800">
                  <h4 className="font-medium text-yellow-500 mb-2">
                    Route Overview
                  </h4>
                  <p className="text-gray-300 text-sm">
                    This premium route offers a scenic journey through the heart
                    of Sri Lanka, connecting major urban centers with
                    comfortable amenities and reliable service.
                  </p>
                </div>
                <div className="bg-black bg-opacity-50 rounded-lg p-4 border border-gray-800">
                  <h4 className="font-medium text-yellow-500 mb-2">
                    Travel Tips
                  </h4>
                  <p className="text-gray-300 text-sm">
                    For the best experience, arrive 15 minutes before departure.
                    Premium seats can be reserved through the mobile app for an
                    enhanced travel experience.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "fare" && (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-8 hover:border-yellow-500 transition-all duration-500 transform hover:-translate-y-1">
              <h3 className="text-2xl font-bold mb-4 relative inline-block">
                <span className="relative z-10">Fare Information</span>
                <span className="absolute bottom-0 left-0 w-full h-2 bg-yellow-500 opacity-40 z-0"></span>
              </h3>

              {route.fareInfo && (
                <div className="mt-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-yellow-500 uppercase tracking-wider border-b border-gray-700">
                            Passenger Category
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-yellow-500 uppercase tracking-wider border-b border-gray-700">
                            Price (LKR)
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {Object.entries(route.fareInfo).map(
                          ([category, price]) => (
                            <tr
                              key={category}
                              className="hover:bg-black/30 transition-colors duration-200"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                {category}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right font-semibold">
                                {price}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-8 bg-black bg-opacity-40 rounded-lg p-4 border border-gray-800">
                    <h4 className="font-medium text-yellow-500 mb-2 flex items-center">
                      <FaInfoCircle className="mr-2" />
                      Fare Policy
                    </h4>
                    <ul className="text-gray-300 text-sm space-y-2">
                      <li>
                        • Children under 3 years travel free when not occupying
                        a separate seat
                      </li>
                      <li>• Student discounts apply with valid student ID</li>
                      <li>
                        • Senior citizen discounts available with proper
                        identification
                      </li>
                      <li>
                        • Fares are subject to change during peak holiday
                        seasons
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-gray-900 to-black border border-yellow-500 rounded-xl p-8 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500 rounded-full filter blur-3xl opacity-10 transform translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500 rounded-full filter blur-3xl opacity-5 transform -translate-x-1/2 translate-y-1/2"></div>
            </div>

            <div className="relative z-10 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Experience{" "}
                <span className="text-yellow-500">Premium Travel</span> Today
              </h2>
              <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
                Create an account to save this route to your favorites and
                receive real-time updates on bus timings.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => navigate("/register")}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                >
                  Join Now <FaAngleRight className="ml-2" />
                </button>
                <button
                  onClick={() => alert("Route added to favorites!")}
                  className="bg-transparent border-2 border-yellow-500 text-yellow-500 font-bold py-3 px-8 rounded-full hover:bg-yellow-500 hover:text-black transition-all duration-300 flex items-center justify-center"
                >
                  Save Route <FaHeart className="ml-2" />
                </button>
              </div>
            </div>
          </div>
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
          animation: fadeIn 0.8s ease-out forwards;
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

        .animation-delay-500 {
          animation-delay: 0.5s;
        }
      `}</style>
    </div>
  );
};

export default RouteDetailsPage;
