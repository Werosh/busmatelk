import React, { useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const SearchBar = ({
  placeholder = "Search...",
  onSearch,
  className = "",
  initialValue = "",
  variant = "default",
  animate = true,
  searchHistory = [],
  handleSaveSearch = null,
  showHistory = false,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Style variants
  const variants = {
    default: "bg-white border border-lightGray",
    primary: "bg-blue-50 border border-blue-200",
    transparent: "bg-white bg-opacity-80 backdrop-blur-md",
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());

      // Save to search history if the function is provided
      if (handleSaveSearch) {
        handleSaveSearch(searchTerm.trim());
      }

      // Hide suggestions after search
      setShowSuggestions(false);
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    // Optional: clear search results
    if (onSearch) {
      onSearch("");
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (searchHistory.length > 0 && showHistory) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className={`search-container ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch
              className={`h-5 w-5 ${
                isFocused ? "text-primary" : "text-darkGray"
              }`}
            />
          </div>

          <motion.input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={`
              search-input
              pl-10 pr-10
              ${variants[variant]}
              ${isFocused ? "border-primary" : "border-lightGray"}
            `}
            whileFocus={animate ? { scale: 1.01 } : {}}
            transition={{ duration: 0.2 }}
          />

          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              aria-label="Clear search"
            >
              <FiX className="h-5 w-5 text-darkGray hover:text-primary" />
            </button>
          )}
        </div>

        {/* Search suggestions */}
        <AnimatePresence>
          {showSuggestions && searchHistory.length > 0 && (
            <motion.div
              className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-lightGray"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ul className="max-h-60 overflow-auto py-1">
                {searchHistory.map((item, index) => (
                  <li
                    key={`${item}-${index}`}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => handleSuggestionClick(item)}
                  >
                    <FiSearch className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};

export default SearchBar;
