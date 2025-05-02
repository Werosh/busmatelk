import { useState, useEffect } from "react";
import React from "react";
const Preloader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time - in production this would be based on actual app loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center">
      {/* Background with radial gradient similar to homepage */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,204,0,0.1)_0,rgba(0,0,0,0)_70%)]"></div>
      </div>

      {/* Animated dots similar to homepage */}
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

      {/* Main logo and loading animation */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo */}
        <div className="mb-8 flex items-center transform scale-110">
          <span className="text-4xl font-extrabold text-white">
            Bus<span className="text-yellow-500">Mate</span>
          </span>
          <span className="ml-1 text-lg font-semibold text-yellow-500">LK</span>
        </div>

        {/* Loading indicator */}
        <div className="relative">
          {/* Bus icon moving along route */}
          <div className="absolute top-0 left-0 animate-busMove">
            <div className="bg-yellow-500 p-2 rounded-md transform -translate-y-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-black"
              >
                <path d="M5 17h10M15 5v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5M3 5h14M6 9h8M6 13h8" />
                <circle cx="7" cy="17" r="1" />
                <circle cx="13" cy="17" r="1" />
              </svg>
            </div>
          </div>

          {/* Route line */}
          <div className="w-48 h-1 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-500 animate-routeProgress"></div>
          </div>

          {/* Route points */}
          <div className="flex justify-between w-48 mt-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
          </div>
        </div>

        {/* Loading text */}
        <p className="mt-6 text-gray-400 font-medium">
          <span className="text-yellow-500">Loading</span> premium travel
          experience
        </p>
      </div>

      {/* CSS Animations */}
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

        @keyframes routeProgress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }

        @keyframes busMove {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-routeProgress {
          animation: routeProgress 3s ease-in-out;
        }

        .animate-busMove {
          animation: busMove 3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Preloader;
