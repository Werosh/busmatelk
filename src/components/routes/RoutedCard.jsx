import React from "react";
import { motion } from "framer-motion";
import { FaStar, FaRegStar, FaMapMarkerAlt, FaBus } from "react-icons/fa";
import { Link } from "react-router-dom";

const RouteCard = ({ route, isFavorite = false, onToggleFavorite }) => {
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { y: -5, boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)" },
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden mb-4"
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      transition={{ duration: 0.3 }}
    >
      <Link to={`/route/${route.id}`} className="block">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <div className="rounded-full bg-primary px-3 py-1 mr-3 text-white font-bold">
                <FaBus className="inline mr-1" />
                {route.routeNumber}
              </div>
              <h3 className="text-lg font-medium text-heading">{route.name}</h3>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.preventDefault();
                onToggleFavorite(route.id);
              }}
              className="text-yellow-500 focus:outline-none"
            >
              {isFavorite ? <FaStar size={20} /> : <FaRegStar size={20} />}
            </motion.button>
          </div>
          <div className="text-sm text-darkGray">
            <div className="flex items-center mb-1">
              <FaMapMarkerAlt className="text-primary mr-2" />
              <span>From: {route.startPoint}</span>
            </div>
            <div className="flex items-center">
              <FaMapMarkerAlt className="text-secondary mr-2" />
              <span>To: {route.endPoint}</span>
            </div>
          </div>
          <div className="mt-3 text-xs text-darkGray flex items-center">
            <span className="mr-3">{route.distance} km</span>
            <span>{route.duration} min</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default RouteCard;
