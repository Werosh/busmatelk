import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, User, Mail, Lock, Phone, ArrowRight, Bus } from "lucide-react";
import React from "react";
import { useAuth } from "../context/AuthContext"; // Update this path to match your project structure
import { useNavigate } from "react-router-dom"; // Assuming you're using react-router

const StyledRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Phone validation (optional)
    if (formData.phone && !/^07\d{8}$/.test(formData.phone)) {
      newErrors.phone = "Phone number should be in format 07XXXXXXXX";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Register the user using Firebase auth
      await register(formData.email, formData.password, {
        displayName: formData.name,
        phoneNumber: formData.phone || "",
      });

      // Navigate to home page or dashboard after successful registration
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({
        general: error.message || "Failed to create account. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center py-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-gray-900">
        <div className="absolute inset-0 bg-black opacity-80"></div>
      </div>

      {/* Animated dots */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-yellow-500 opacity-10"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: Math.random() > 0.8 ? "10px" : "5px",
            height: Math.random() > 0.8 ? "10px" : "5px",
          }}
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-8 rounded-lg relative z-10"
      >
        {/* Logo */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2,
          }}
        >
          <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center">
            <Bus className="text-black" size={32} />
          </div>
        </motion.div>

        <motion.h1
          className="text-3xl font-bold text-center mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Join <span className="text-yellow-500">BusMate LK</span>
        </motion.h1>

        <motion.p
          className="text-center text-gray-400 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Create your account to save favorite routes and more
        </motion.p>

        {errors.general && (
          <div className="mb-4 p-3 bg-red-900 bg-opacity-30 border border-red-500 text-red-500 rounded">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <label className="flex items-center mb-2 text-sm font-medium text-gray-300">
              <User className="mr-2 text-yellow-500" size={16} /> Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-3 border ${
                errors.name ? "border-red-500" : "border-gray-700"
              } rounded-md bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500`}
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <label className="flex items-center mb-2 text-sm font-medium text-gray-300">
              <Mail className="mr-2 text-yellow-500" size={16} /> Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 border ${
                errors.email ? "border-red-500" : "border-gray-700"
              } rounded-md bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500`}
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <label className="flex items-center mb-2 text-sm font-medium text-gray-300">
              <Phone className="mr-2 text-yellow-500" size={16} /> Phone Number
              (Optional)
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full p-3 border ${
                errors.phone ? "border-red-500" : "border-gray-700"
              } rounded-md bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500`}
              placeholder="07XXXXXXXX"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <label className="flex items-center mb-2 text-sm font-medium text-gray-300">
              <Lock className="mr-2 text-yellow-500" size={16} /> Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full p-3 border ${
                errors.password ? "border-red-500" : "border-gray-700"
              } rounded-md bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500`}
              placeholder="Create a strong password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <label className="flex items-center mb-2 text-sm font-medium text-gray-300">
              <Lock className="mr-2 text-yellow-500" size={16} /> Confirm
              Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full p-3 border ${
                errors.confirmPassword ? "border-red-500" : "border-gray-700"
              } rounded-md bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500`}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.confirmPassword}
              </p>
            )}
          </motion.div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 10,
              delay: 1,
            }}
            className="w-full py-4 mt-4 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-full flex items-center justify-center"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : null}
            {isLoading ? "Creating Account..." : "Register Now"}
            {!isLoading && <ArrowRight className="ml-2" size={16} />}
          </motion.button>
        </form>

        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <span className="text-gray-400">Already have an account? </span>
          <motion.a
            href="/login"
            className="text-yellow-500 font-medium hover:text-yellow-400"
            whileHover={{ scale: 1.05 }}
          >
            Login here
          </motion.a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default StyledRegister;
