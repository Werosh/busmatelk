import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  FiUser,
  FiLogOut,
  FiHeart,
  FiSearch,
  FiMap,
  FiMenu,
  FiX,
  FiChevronDown,
} from "react-icons/fi";
import { BiBus } from "react-icons/bi";
import { TbRoute } from "react-icons/tb";
import { MdOutlineFavorite, MdOutlineLocationOn } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  // Change navbar background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (userMenuOpen) setUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      // Redirect to home handled by AuthContext
    } catch (error) {
      console.error("Failed to log out", error);
    } finally {
      setIsLoading(false);
    }
  };

  const navbarClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    scrolled
      ? "bg-black bg-opacity-95 shadow-lg shadow-yellow-500/10 backdrop-blur-sm py-2"
      : "bg-black bg-opacity-80 backdrop-blur-sm py-4"
  }`;

  const navLinkVariants = {
    initial: { y: -5, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -5, opacity: 0 },
  };

  const mobileMenuVariants = {
    closed: { opacity: 0, y: -20, height: 0 },
    open: { opacity: 1, y: 0, height: "auto" },
  };

  const loadingAnimation = {
    rotate: [0, 360],
    transition: {
      repeat: Infinity,
      duration: 1,
      ease: "linear",
    },
  };

  const logoAnimation = {
    initial: { scale: 0.95, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15,
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  };

  const navLinkClasses = ({ isActive }) =>
    `relative flex items-center px-4 py-2 font-medium transition-colors duration-200 ${
      isActive ? "text-yellow-500" : "text-gray-200 hover:text-yellow-500"
    }`;

  // Active link indicator animation
  const ActiveLinkIndicator = () => (
    <motion.span
      className="absolute -bottom-1 left-0 h-0.5 bg-yellow-500 w-full rounded-full"
      layoutId="activeNavIndicator"
      transition={{ type: "spring", stiffness: 350, damping: 30 }}
    />
  );

  return (
    <>
      <nav className={navbarClasses}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              className="rounded-full bg-yellow-500 bg-opacity-20 p-2 group-hover:bg-opacity-30 transition-all duration-300"
              initial="initial"
              animate="animate"
              whileHover="hover"
              variants={logoAnimation}
            >
              <BiBus className="w-5 h-5 text-yellow-500" />
            </motion.div>
            <span className="text-xl font-bold text-white tracking-tight">
              Bus<span className="text-yellow-500">Mate LK</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <NavLink to="/" className={navLinkClasses} end>
              {({ isActive }) => (
                <span className="relative">
                  Home
                  {isActive && <ActiveLinkIndicator />}
                </span>
              )}
            </NavLink>
            <NavLink to="/routes" className={navLinkClasses}>
              {({ isActive }) => (
                <span className="relative flex items-center">
                  <TbRoute className="mr-1" /> Routes
                  {isActive && <ActiveLinkIndicator />}
                </span>
              )}
            </NavLink>
            {currentUser && (
              <NavLink to="/favorites" className={navLinkClasses}>
                {({ isActive }) => (
                  <span className="relative flex items-center">
                    <MdOutlineFavorite className="mr-1" /> Favorites
                    {isActive && <ActiveLinkIndicator />}
                  </span>
                )}
              </NavLink>
            )}
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 text-white hover:text-yellow-500 transition-all duration-200 py-2 px-3 rounded-full border border-gray-700 hover:border-yellow-500 group"
                >
                  <motion.div
                    className="w-8 h-8 rounded-full bg-yellow-500 text-black flex items-center justify-center font-medium"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {currentUser.displayName
                      ? currentUser.displayName.charAt(0)
                      : "U"}
                  </motion.div>
                  <span className="text-sm">My Account</span>
                  <FiChevronDown
                    className={`transition-transform duration-200 ${
                      userMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-lg shadow-yellow-500/5 overflow-hidden z-50"
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="py-1 flex flex-col">
                        <Link
                          to="/profile"
                          className="px-4 py-3 text-sm text-gray-200 hover:bg-gray-800 hover:text-yellow-500 flex items-center"
                        >
                          <FiUser className="mr-2" /> Profile
                        </Link>
                        <Link
                          to="/favorites"
                          className="px-4 py-3 text-sm text-gray-200 hover:bg-gray-800 hover:text-yellow-500 flex items-center"
                        >
                          <MdOutlineFavorite className="mr-2" /> Favorites
                        </Link>
                        <div className="border-t border-gray-800 my-1"></div>
                        <button
                          onClick={handleLogout}
                          disabled={isLoading}
                          className="px-4 py-3 text-sm text-gray-200 hover:bg-gray-800 hover:text-yellow-500 flex items-center text-left w-full"
                        >
                          {isLoading ? (
                            <>
                              <motion.div
                                animate={loadingAnimation}
                                className="mr-2"
                              >
                                <AiOutlineLoading3Quarters />
                              </motion.div>
                              Logging out...
                            </>
                          ) : (
                            <>
                              <FiLogOut className="mr-2" /> Logout
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-yellow-500 transition-colors px-4 py-2"
                >
                  Login
                </Link>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/register"
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 px-6 rounded-full transition-all duration-300"
                  >
                    Register
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden text-gray-200 hover:text-yellow-500 transition-colors"
            onClick={toggleMenu}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </motion.button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed top-16 left-0 right-0 bg-black bg-opacity-95 backdrop-blur-md border-t border-gray-800 shadow-lg z-40 md:hidden overflow-hidden"
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto py-2 px-4 flex flex-col">
              <motion.div
                className="flex flex-col space-y-1"
                variants={{
                  open: {
                    transition: {
                      staggerChildren: 0.07,
                      delayChildren: 0.1,
                    },
                  },
                }}
                initial="initial"
                animate="animate"
              >
                <motion.div variants={navLinkVariants}>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `py-3 px-4 ${
                        isActive
                          ? "text-yellow-500 bg-gray-900"
                          : "text-gray-200"
                      } hover:bg-gray-900 rounded-lg flex items-center`
                    }
                    end
                  >
                    Home
                  </NavLink>
                </motion.div>

                <motion.div variants={navLinkVariants}>
                  <NavLink
                    to="/routes"
                    className={({ isActive }) =>
                      `py-3 px-4 ${
                        isActive
                          ? "text-yellow-500 bg-gray-900"
                          : "text-gray-200"
                      } hover:bg-gray-900 rounded-lg flex items-center`
                    }
                  >
                    <TbRoute className="mr-2" /> All Routes
                  </NavLink>
                </motion.div>

                {currentUser && (
                  <motion.div variants={navLinkVariants}>
                    <NavLink
                      to="/favorites"
                      className={({ isActive }) =>
                        `py-3 px-4 ${
                          isActive
                            ? "text-yellow-500 bg-gray-900"
                            : "text-gray-200"
                        } hover:bg-gray-900 rounded-lg flex items-center`
                      }
                    >
                      <MdOutlineFavorite className="mr-2" /> Favorites
                    </NavLink>
                  </motion.div>
                )}

                <div className="border-t border-gray-800 my-2"></div>

                {currentUser ? (
                  <>
                    <motion.div variants={navLinkVariants}>
                      <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                          `py-3 px-4 ${
                            isActive
                              ? "text-yellow-500 bg-gray-900"
                              : "text-gray-200"
                          } hover:bg-gray-900 rounded-lg flex items-center`
                        }
                      >
                        <FiUser className="mr-2" /> Profile
                      </NavLink>
                    </motion.div>

                    <motion.div variants={navLinkVariants}>
                      <button
                        onClick={handleLogout}
                        disabled={isLoading}
                        className="py-3 px-4 text-gray-200 hover:bg-gray-900 hover:text-yellow-500 rounded-lg flex items-center text-left w-full"
                      >
                        {isLoading ? (
                          <>
                            <motion.div
                              animate={loadingAnimation}
                              className="mr-2"
                            >
                              <AiOutlineLoading3Quarters />
                            </motion.div>
                            Logging out...
                          </>
                        ) : (
                          <>
                            <FiLogOut className="mr-2" /> Logout
                          </>
                        )}
                      </button>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div variants={navLinkVariants}>
                      <NavLink
                        to="/login"
                        className={({ isActive }) =>
                          `py-3 px-4 ${
                            isActive
                              ? "text-yellow-500 bg-gray-900"
                              : "text-gray-200"
                          } hover:bg-gray-900 rounded-lg flex items-center`
                        }
                      >
                        Login
                      </NavLink>
                    </motion.div>

                    <motion.div
                      variants={navLinkVariants}
                      whileTap={{ scale: 0.95 }}
                    >
                      <NavLink
                        to="/register"
                        className="bg-yellow-500 text-black font-medium py-3 px-4 rounded-lg mx-4 mt-2 mb-2 flex items-center justify-center"
                      >
                        Register
                      </NavLink>
                    </motion.div>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed navbar */}
      <div className="h-16 md:h-20"></div>
    </>
  );
};

export default Navbar;
