import React from "react";
import { Link } from "react-router-dom";
import {
  FaBus,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaAngleRight,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white pt-16 pb-8">
      {/* Yellow accent line */}
      <div className="h-1 bg-yellow-500 mb-16"></div>

      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <FaBus className="text-yellow-500 text-2xl" />
              <span className="text-2xl font-bold">
                BusMate<span className="text-yellow-500">LK</span>
              </span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your trusted companion for public transit in Sri Lanka. Find
              routes, save favorites, and travel with confidence in premium
              style.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="bg-gray-800 hover:bg-yellow-500 text-yellow-500 hover:text-black w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="bg-gray-800 hover:bg-yellow-500 text-yellow-500 hover:text-black w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="bg-gray-800 hover:bg-yellow-500 text-yellow-500 hover:text-black w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                className="bg-gray-800 hover:bg-yellow-500 text-yellow-500 hover:text-black w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6 relative inline-block">
              <span className="relative z-10">Quick Links</span>
              <span className="absolute bottom-0 left-0 w-full h-1 bg-yellow-500 opacity-50 z-0"></span>
            </h3>
            <ul className="space-y-3">
              {[
                "Home",
                "Explore Routes",
                "Track Stops",
                "Favorites",
                "Profile",
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    to={
                      item === "Home"
                        ? "/"
                        : `/${item.toLowerCase().replace(/\s+/g, "-")}`
                    }
                    className="text-gray-400 hover:text-yellow-500 flex items-center group transition-all duration-300"
                  >
                    <FaAngleRight className="mr-2 text-yellow-500 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Routes */}
          <div>
            <h3 className="text-xl font-semibold mb-6 relative inline-block">
              <span className="relative z-10">Popular Routes</span>
              <span className="absolute bottom-0 left-0 w-full h-1 bg-yellow-500 opacity-50 z-0"></span>
            </h3>
            <ul className="space-y-3">
              {[
                { route: "138", name: "Pettah - Kaduwela" },
                { route: "100", name: "Colombo - Kandy" },
                { route: "245", name: "Maharagama - Galle" },
                { route: "154", name: "Colombo - Gampaha" },
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    to={`/route/${item.route}`}
                    className="text-gray-400 hover:text-yellow-500 transition-all duration-300 flex items-center group"
                  >
                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center mr-3 group-hover:bg-yellow-500 transition-all duration-300">
                      <span className="text-xs text-yellow-500 font-medium group-hover:text-black transition-all duration-300">
                        {item.route}
                      </span>
                    </div>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-6 relative inline-block">
              <span className="relative z-10">Contact Us</span>
              <span className="absolute bottom-0 left-0 w-full h-1 bg-yellow-500 opacity-50 z-0"></span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-gray-800 rounded-full p-2 mr-4 mt-1">
                  <FaMapMarkerAlt className="text-yellow-500" />
                </div>
                <span className="text-gray-400">
                  123 Bus Terminal Road,
                  <br />
                  Colombo 01, Sri Lanka
                </span>
              </li>
              <li className="flex items-center">
                <div className="bg-gray-800 rounded-full p-2 mr-4">
                  <FaPhone className="text-yellow-500" />
                </div>
                <span className="text-gray-400">+94 11 234 5678</span>
              </li>
              <li className="flex items-center">
                <div className="bg-gray-800 rounded-full p-2 mr-4">
                  <FaEnvelope className="text-yellow-500" />
                </div>
                <span className="text-gray-400">info@busmatelk.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        {/* <div className="border-t border-gray-800 mt-12 pt-8 pb-4">
          <div className="max-w-4xl mx-auto text-center">
            <h4 className="text-2xl font-semibold mb-4">Stay Updated</h4>
            <p className="text-gray-400 mb-6">
              Subscribe to our newsletter for exclusive updates and special
              offers
            </p>
            <form className="flex flex-col sm:flex-row max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 rounded-l-full sm:rounded-r-none border-2 border-yellow-500 bg-black bg-opacity-50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 w-full"
              />
              <button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 rounded-full sm:rounded-l-none font-medium transition-colors duration-300 mt-3 sm:mt-0"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div> */}

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {currentYear} BusMate LK. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
