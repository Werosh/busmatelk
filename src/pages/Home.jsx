import { useState, useEffect } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBus,
  FaRoute,
  FaSearch,
  FaHeart,
  FaMapMarkerAlt,
  FaArrowDown,
  FaAngleRight,
} from "react-icons/fa";
import FeatureSection from "../components/layout/Featuresection";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/routes?search=${searchQuery}`);
  };

  // Popular routes - would be fetched from Firebase in production
  const popularRoutes = [
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
    {
      id: "245",
      name: "Maharagama - Galle",
      stops: "Maharagama, Piliyandala, Panadura, Kalutara, Aluthgama, Galle",
    },
  ];

  return (
    <div className="bg-black text-white">
      {/* Hero Section - 100vh */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-gray-900 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,204,0,0.1)_0,rgba(0,0,0,0)_70%)]"></div>
        </div>

        {/* Animated dots */}
        <div className="absolute inset-0 overflow-hidden">
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

        {/* Hero Content */}
        <div className="container mx-auto px-4 z-10 text-center">
          <div className="animate-fadeIn">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              <span className="block">Experience</span>
              <span className="text-yellow-500">Premium Travel</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              The ultimate transportation companion for Sri Lanka's modern
              traveler
            </p>

            {/* Search Bar */}
            <div className="max-w-lg mx-auto relative mb-12 transform hover:scale-105 transition-all duration-300">
              <form onSubmit={handleSearch} className="flex">
                <input
                  type="text"
                  placeholder="Search routes, destinations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 rounded-l-full border-2 border-yellow-500 bg-black bg-opacity-50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <button
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 rounded-r-full transition-colors duration-300 flex items-center justify-center"
                >
                  <FaSearch size={20} />
                </button>
              </form>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => navigate("/routes")}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              >
                Explore Routes <FaRoute className="ml-2" />
              </button>
              <button
                className="bg-transparent border-2 border-yellow-500 text-yellow-500 font-bold py-3 px-8 rounded-full hover:bg-yellow-500 hover:text-black transition-all duration-300 flex items-center justify-center"
                onClick={() => navigate("/register")}
              >
                Join Now <FaAngleRight className="ml-2" />
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <a
            href="#features"
            className="text-yellow-500 flex flex-col items-center"
          >
            <span className="mb-2 text-sm">Discover More</span>
            <FaArrowDown />
          </a>
        </div>
      </section>

      {/* Features Section */}
      <FeatureSection />

      {/* Popular Routes Section */}
      <section id="routes" className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              <span className="text-yellow-500">Popular</span> Routes
            </h2>
            <button
              onClick={() => navigate("/routes")}
              className="text-yellow-500 hover:text-yellow-400 font-medium flex items-center group"
            >
              View all
              <FaAngleRight className="ml-1 group-hover:ml-2 transition-all duration-300" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularRoutes.map((route, index) => (
              <div
                key={route.id}
                className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-yellow-500 transition-all duration-500 transform hover:-translate-y-2 cursor-pointer group"
                onClick={() => navigate(`/route/${route.id}`)}
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className="h-2 bg-yellow-500"></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">Route {route.id}</h3>
                    <div className="bg-yellow-500 bg-opacity-10 rounded-full p-2 group-hover:bg-yellow-500 transition-all duration-500">
                      <FaBus className="text-yellow-500 group-hover:text-black transition-all duration-500" />
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-gray-900 to-black border border-yellow-500 rounded-2xl p-10 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500 rounded-full filter blur-3xl opacity-10 transform translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500 rounded-full filter blur-3xl opacity-5 transform -translate-x-1/2 translate-y-1/2"></div>
            </div>

            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready for a{" "}
                <span className="text-yellow-500">Premium Travel</span>{" "}
                Experience?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Create your account today and unlock exclusive benefits,
                personalized recommendations, and a seamless journey planning
                experience.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <button
                  onClick={() => navigate("/register")}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  Join Now
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="bg-transparent border-2 border-yellow-500 text-yellow-500 font-bold py-4 px-10 rounded-full hover:bg-yellow-500 hover:text-black transition-all duration-300"
                >
                  Sign In
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

export default Home;
