import React, { useContext } from "react";
import { motion } from "framer-motion";
import {
  FaClock,
  FaMapMarkerAlt,
  FaRoad,
  FaBus,
  FaStar,
  FaRegStar,
} from "react-icons/fa";
import { FavoritesContext } from "../../context/FavoritesContext";

const RouteDetails = ({ route }) => {
  const { favorites, addToFavorites, removeFromFavorites } =
    useContext(FavoritesContext);
  const isFavorite = favorites.includes(route.id);

  const toggleFavorite = async (routeId) => {
    if (isFavorite) {
      await removeFromFavorites(routeId);
    } else {
      await addToFavorites(routeId);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="rounded-full bg-primary px-4 py-2 mr-3 text-white font-bold text-lg">
            <FaBus className="inline mr-2" />
            {route.routeNumber}
          </div>
          <h2 className="text-xl font-semibold text-heading">{route.name}</h2>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => toggleFavorite(route.id)}
          className="text-yellow-500 focus:outline-none"
        >
          {isFavorite ? <FaStar size={24} /> : <FaRegStar size={24} />}
        </motion.button>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center border-b border-lightGray pb-2">
          <div className="bg-primary/10 p-2 rounded-full mr-3">
            <FaMapMarkerAlt className="text-primary" />
          </div>
          <div>
            <div className="text-sm text-darkGray">Start Point</div>
            <div className="font-medium">{route.startPoint}</div>
          </div>
        </div>
        <div className="flex items-center border-b border-lightGray pb-2">
          <div className="bg-secondary/10 p-2 rounded-full mr-3">
            <FaMapMarkerAlt className="text-secondary" />
          </div>
          <div>
            <div className="text-sm text-darkGray">End Point</div>
            <div className="font-medium">{route.endPoint}</div>
          </div>
        </div>
        <div className="flex items-center">
          <div className="bg-primary/10 p-2 rounded-full mr-3">
            <FaRoad className="text-primary" />
          </div>
          <div>
            <div className="text-sm text-darkGray">Distance</div>
            <div className="font-medium">{route.distance} km</div>
          </div>
        </div>
        <div className="flex items-center">
          <div className="bg-secondary/10 p-2 rounded-full mr-3">
            <FaClock className="text-secondary" />
          </div>
          <div>
            <div className="text-sm text-darkGray">Duration</div>
            <div className="font-medium">{route.duration} min</div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3 text-heading">Route Stops</h3>
        <motion.ul
          className="space-y-2"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {route.stops &&
            route.stops.map((stop, index) => (
              <motion.li
                key={index}
                className="flex items-center"
                variants={item}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-lightGray text-darkGray mr-3">
                  {index + 1}
                </div>
                <div className="border-b border-lightGray pb-2 flex-1">
                  {stop.name}
                  {stop.time && (
                    <span className="text-sm text-darkGray ml-2">
                      ({stop.time})
                    </span>
                  )}
                </div>
              </motion.li>
            ))}
        </motion.ul>
      </div>

      {route.schedule && (
        <div>
          <h3 className="text-lg font-medium mb-3 text-heading">Schedule</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(route.schedule).map(([day, times]) => (
              <div key={day} className="border border-lightGray rounded p-3">
                <div className="font-medium mb-1">{day}</div>
                <div className="text-sm text-darkGray">
                  First: {times.first}
                </div>
                <div className="text-sm text-darkGray">Last: {times.last}</div>
                <div className="text-sm text-darkGray">
                  Frequency: {times.frequency}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteDetails;
