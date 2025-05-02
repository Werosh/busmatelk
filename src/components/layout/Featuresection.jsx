import { motion } from "framer-motion";
import {
  FaRoute,
  FaMapMarkerAlt,
  FaHeart,
  FaBus,
  FaAngleRight,
} from "react-icons/fa";
import React from "react";

const FeatureSection = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
    hover: {
      y: -10,
      transition: { type: "spring", stiffness: 300, damping: 15 },
    },
  };

  const iconContainerVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1 },
  };

  const rotatingBorderVariants = {
    initial: { opacity: 0, rotate: 0 },
    hover: {
      opacity: 1,
      rotate: 360,
      transition: { duration: 10, repeat: Infinity, ease: "linear" },
    },
  };

  const newFeatureVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, delay: 0.6 },
    },
  };

  const pulseVariants = {
    initial: { scale: 1, opacity: 0.7 },
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.7, 0.9, 0.7],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  };

  const backgroundBlobVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.8, transition: { duration: 0.7 } },
  };

  // Features data
  const features = [
    {
      icon: <FaRoute />,
      title: "Smart Route Discovery",
      description:
        "Our AI-powered route finder helps you discover the perfect journey based on your preferences, time constraints, and comfort needs. Get personalized recommendations that adapt to your travel patterns.",
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "Live Tracking & Updates",
      description:
        "Never miss a stop with real-time tracking and predictive ETA. Get instant notifications about delays, changes, and alternative routes. Our system adapts to traffic conditions for accurate timing.",
    },
    {
      icon: <FaHeart />,
      title: "Smart Preferences",
      description:
        "Create a personalized travel profile that learns your preferences over time. Save favorite routes, set recurring journeys, and receive custom alerts based on your travel habits and schedule.",
    },
  ];

  return (
    <section
      id="features"
      className="py-24 relative overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #000000, #111827)",
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ opacity: 0.05 }}
          animate={{
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500 rounded-full filter blur-3xl"
        ></motion.div>

        <motion.div
          initial={{ opacity: 0.03 }}
          animate={{
            opacity: [0.03, 0.08, 0.03],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2,
          }}
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-yellow-500 rounded-full filter blur-3xl"
        ></motion.div>

        {/* Dynamic grid lines */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-10"
        >
          {/* Feature Cards - Completely redesigned with Framer Motion */}
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover="hover"
              className="feature-card"
            >
              <div className="glass-card p-8 rounded-xl relative overflow-hidden h-full">
                {/* Background blob */}
                <motion.div
                  variants={backgroundBlobVariants}
                  className="absolute top-0 right-0 w-40 h-40 bg-yellow-500 opacity-5 rounded-full transform translate-x-1/2 -translate-y-1/2"
                ></motion.div>

                {/* Icon with animated border */}
                <motion.div
                  variants={iconContainerVariants}
                  className="feature-icon-wrapper mb-8 relative"
                >
                  <motion.div
                    variants={rotatingBorderVariants}
                    className="absolute inset-0 bg-conic-gradient rounded-full"
                  ></motion.div>
                  <div className="feature-icon relative z-10">
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, -5, 5, 0] }}
                      transition={{ duration: 0.5 }}
                      className="feature-icon-inner"
                    >
                      {feature.icon}
                    </motion.div>
                  </div>
                </motion.div>

                <motion.h3
                  whileHover={{ color: "#eab308" }}
                  className="text-2xl font-semibold mb-4 text-white transition-colors duration-300"
                >
                  {feature.title}
                </motion.h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>

                {/* Interactive element */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="mt-6 pt-4 border-t border-gray-800 flex items-center justify-between text-yellow-500"
                >
                  <span className="text-sm font-medium">Explore feature</span>
                  <motion.div
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <FaAngleRight />
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* New feature highlight */}
        <motion.div
          variants={newFeatureVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 bg-gray-900 bg-opacity-50 rounded-2xl p-8 border border-gray-800 border-opacity-50"
        >
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/4 mb-6 md:mb-0 flex justify-center">
              <div className="relative">
                <motion.div
                  variants={pulseVariants}
                  initial="initial"
                  animate="animate"
                  className="absolute inset-0 bg-yellow-500 rounded-full opacity-20"
                ></motion.div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative bg-yellow-500 bg-opacity-10 rounded-full p-6 border border-yellow-500 border-opacity-30"
                >
                  <FaBus className="text-yellow-500 text-4xl" />
                </motion.div>
              </div>
            </div>
            <div className="md:w-3/4 md:pl-8">
              <div className="flex items-center mb-3">
                <motion.span
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full mr-3"
                >
                  NEW
                </motion.span>
                <h3 className="text-2xl font-bold text-yellow-500">
                  Premium Fleet Tracking
                </h3>
              </div>
              <p className="text-gray-300 mb-4">
                Our latest feature gives you access to real-time information
                about the premium buses on your route. Check amenities, current
                capacity, on-time performance, and even select your preferred
                seat before boarding.
              </p>
              <motion.button
                whileHover={{
                  backgroundColor: "#eab308",
                  color: "#000000",
                  scale: 1.03,
                }}
                transition={{ type: "spring", stiffness: 400 }}
                className="bg-transparent text-yellow-500 font-medium py-2 px-4 border border-yellow-500 rounded-lg flex items-center"
              >
                Try it now{" "}
                <motion.div
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="ml-2"
                >
                  <FaAngleRight />
                </motion.div>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* CSS for static elements */}
      <style jsx>{`
        .bg-grid-pattern {
          background-image: radial-gradient(
            circle,
            rgba(255, 204, 0, 0.1) 1px,
            transparent 1px
          );
          background-size: 30px 30px;
        }

        .glass-card {
          background: linear-gradient(
            to bottom right,
            rgba(30, 30, 30, 0.6),
            rgba(20, 20, 20, 0.8)
          );
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 204, 0, 0.1);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
        }

        .feature-icon-wrapper {
          width: 70px;
          height: 70px;
        }

        .feature-icon {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 50%;
          border: 2px solid rgba(255, 204, 0, 0.3);
          overflow: hidden;
        }

        .feature-icon-inner {
          font-size: 24px;
          color: #eab308;
        }

        .bg-conic-gradient {
          background: conic-gradient(
            transparent,
            rgba(255, 204, 0, 0.5),
            transparent 30%
          );
        }
      `}</style>
    </section>
  );
};

export default FeatureSection;
