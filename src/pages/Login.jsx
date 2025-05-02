import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bus, Mail, Lock, Phone, ArrowRight } from "lucide-react";
import React from "react";
import { useAuth } from "../context/AuthContext";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate } from "react-router-dom"; // Import for navigation

const StyledLogin = () => {
  const { login, error: authError, currentUser } = useAuth();
  const navigate = useNavigate(); // Initialize navigation hook
  const [loginMethod, setLoginMethod] = useState("email");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phoneNumber: "",
    otp: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

  useEffect(() => {
    // Reset errors when auth error changes
    if (authError) {
      setErrors({ general: authError });
    }
  }, [authError]);

  useEffect(() => {
    // If user is logged in, redirect to home page
    if (currentUser) {
      navigate("/"); // Redirect to main page
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setErrors({ general: "Please provide both email and password" });
      return;
    }

    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
      // Redirect is handled in the useEffect
    } catch (error) {
      setErrors({ general: error.message || "Failed to log in" });
    } finally {
      setIsLoading(false);
    }
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
          },
        }
      );
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.phoneNumber || formData.phoneNumber.length < 10) {
      setErrors({ general: "Please enter a valid phone number" });
      return;
    }

    setIsLoading(true);
    try {
      setupRecaptcha();

      // Format phone number with country code if necessary
      let phoneNumber = formData.phoneNumber;
      if (!phoneNumber.startsWith("+")) {
        // Assuming Sri Lankan phone numbers (+94)
        phoneNumber = phoneNumber.startsWith("0")
          ? `+94${phoneNumber.substring(1)}`
          : `+94${phoneNumber}`;
      }

      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        window.recaptchaVerifier
      );

      setConfirmationResult(confirmation);
      setOtpSent(true);
    } catch (error) {
      console.error("OTP Error:", error);
      setErrors({ general: error.message || "Failed to send OTP" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!formData.otp || formData.otp.length < 6) {
      setErrors({ general: "Please enter the complete OTP" });
      return;
    }

    setIsLoading(true);
    try {
      if (!confirmationResult) {
        throw new Error("OTP verification session expired. Please try again.");
      }

      await confirmationResult.confirm(formData.otp);
      // Redirect is handled in the useEffect
    } catch (error) {
      console.error("Verification Error:", error);
      setErrors({ general: error.message || "Invalid OTP. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      // Import dynamically to reduce initial bundle size
      const { GoogleAuthProvider, signInWithPopup } = await import(
        "firebase/auth"
      );
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // Redirect is handled in the useEffect
    } catch (error) {
      console.error("Google Sign-in Error:", error);
      setErrors({ general: error.message || "Google login failed" });
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
          Welcome to <span className="text-yellow-500">BusMate LK</span>
        </motion.h1>

        <motion.p
          className="text-center text-gray-400 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Log in to access your saved routes and more
        </motion.p>

        {errors.general && (
          <div className="mb-4 p-3 bg-red-900 bg-opacity-30 border border-red-500 text-red-500 rounded">
            {errors.general}
          </div>
        )}

        {/* Login Method Tabs */}
        <motion.div
          className="flex border-b border-gray-700 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
        >
          <button
            onClick={() => setLoginMethod("email")}
            className={`flex-1 pb-2 text-center font-medium ${
              loginMethod === "email"
                ? "border-b-2 border-yellow-500 text-yellow-500"
                : "text-gray-400"
            }`}
          >
            Email & Password
          </button>
          <button
            onClick={() => {
              setLoginMethod("phone");
              setOtpSent(false);
            }}
            className={`flex-1 pb-2 text-center font-medium ${
              loginMethod === "phone"
                ? "border-b-2 border-yellow-500 text-yellow-500"
                : "text-gray-400"
            }`}
          >
            Phone Number
          </button>
        </motion.div>

        {/* Email Login Form */}
        {loginMethod === "email" && (
          <form onSubmit={handleEmailLogin}>
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-5"
            >
              <label className="flex items-center mb-2 text-sm font-medium text-gray-300">
                <Mail className="mr-2 text-yellow-500" size={16} /> Email
                Address
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
              transition={{ delay: 0.6 }}
              className="mb-6"
            >
              <div className="flex justify-between items-center mb-2">
                <label className="flex items-center text-sm font-medium text-gray-300">
                  <Lock className="mr-2 text-yellow-500" size={16} /> Password
                </label>
                <a
                  href="#"
                  className="text-xs text-yellow-500 hover:text-yellow-400"
                >
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full p-3 border ${
                  errors.password ? "border-red-500" : "border-gray-700"
                } rounded-md bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 10,
                delay: 0.7,
              }}
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-full flex items-center justify-center"
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
              {isLoading ? "Logging in..." : "Log In"}
              {!isLoading && <ArrowRight className="ml-2" size={16} />}
            </motion.button>
          </form>
        )}

        {/* Phone Login Forms */}
        {loginMethod === "phone" && !otpSent && (
          <form onSubmit={handleSendOtp}>
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-6"
            >
              <label className="flex items-center mb-2 text-sm font-medium text-gray-300">
                <Phone className="mr-2 text-yellow-500" size={16} /> Phone
                Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  handleChange({ target: { name: "phoneNumber", value } });
                }}
                className={`w-full p-3 border ${
                  errors.phoneNumber ? "border-red-500" : "border-gray-700"
                } rounded-md bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                placeholder="07XXXXXXXX"
              />
              <p className="mt-1 text-xs text-gray-400">
                We'll send you a one-time code to verify your number
              </p>
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.phoneNumber}
                </p>
              )}
            </motion.div>

            {/* Invisible reCAPTCHA container */}
            <div id="recaptcha-container"></div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 10,
                delay: 0.6,
              }}
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-full flex items-center justify-center"
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
              {isLoading ? "Sending..." : "Send OTP"}
              {!isLoading && <ArrowRight className="ml-2" size={16} />}
            </motion.button>
          </form>
        )}

        {/* OTP Verification Form */}
        {loginMethod === "phone" && otpSent && (
          <form onSubmit={handleVerifyOtp}>
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-6"
            >
              <label className="flex items-center mb-2 text-sm font-medium text-gray-300">
                Enter OTP sent to {formData.phoneNumber}
              </label>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={(e) => {
                  const value = e.target.value
                    .replace(/[^0-9]/g, "")
                    .slice(0, 6);
                  handleChange({ target: { name: "otp", value } });
                }}
                className="w-full p-3 border border-gray-700 rounded-md bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-center tracking-widest"
                placeholder="------"
                maxLength={6}
              />
              <p className="mt-2 text-sm text-gray-400">
                Didn't receive code?{" "}
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="text-yellow-500 hover:text-yellow-400"
                >
                  Resend
                </button>
              </p>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 10,
                delay: 0.6,
              }}
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-full flex items-center justify-center"
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
              {isLoading ? "Verifying..." : "Verify OTP"}
              {!isLoading && <ArrowRight className="ml-2" size={16} />}
            </motion.button>
          </form>
        )}

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 relative flex items-center justify-center"
        >
          <div className="border-t border-gray-700 absolute w-full"></div>
          <div className="relative bg-black px-4 text-sm text-gray-400">OR</div>
        </motion.div>

        {/* Google Login */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 10,
            delay: 0.9,
          }}
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full mt-4 py-3 border border-gray-700 hover:bg-gray-900 text-white font-medium rounded-full flex items-center justify-center"
        >
          <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"
            />
            <path
              fill="#34A853"
              d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"
            />
            <path
              fill="#4A90E2"
              d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5818182 23.1818182,9.90909091 L12,9.90909091 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"
            />
            <path
              fill="#FBBC05"
              d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"
            />
          </svg>
          Continue with Google
        </motion.button>

        {/* Sign up link */}
        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <span className="text-gray-400">Don't have an account? </span>
          <motion.a
            href="/register"
            className="text-yellow-500 font-medium hover:text-yellow-400"
            whileHover={{ scale: 1.05 }}
          >
            Register here
          </motion.a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default StyledLogin;
