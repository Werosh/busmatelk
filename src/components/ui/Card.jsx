import React from "react";
import { motion } from "framer-motion";

const Card = ({
  children,
  className = "",
  elevated = false,
  hoverEffect = true,
  onClick,
  variant = "default",
  ...props
}) => {
  // Card variants
  const variants = {
    default: "bg-white",
    primary: "bg-blue-50 border-l-4 border-primary",
    secondary: "bg-green-50 border-l-4 border-secondary",
    error: "bg-red-50 border-l-4 border-error",
    warning: "bg-yellow-50 border-l-4 border-yellow-500",
    info: "bg-blue-50",
  };

  // Base classes
  const baseClasses = `
    rounded-lg 
    p-6 
    transition-all 
    duration-300 
    ${variants[variant]} 
    ${elevated ? "shadow-md" : "shadow-card"} 
    ${hoverEffect ? "hover:shadow-hover" : ""} 
    ${onClick ? "cursor-pointer" : ""} 
    ${className}
  `;

  if (onClick) {
    return (
      <motion.div
        className={baseClasses}
        onClick={onClick}
        whileHover={hoverEffect ? { y: -3 } : {}}
        whileTap={onClick ? { scale: 0.98 } : {}}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={baseClasses} {...props}>
      {children}
    </div>
  );
};

// Card Header Component
Card.Header = ({ children, className = "", ...props }) => (
  <div
    className={`mb-4 pb-3 border-b border-lightGray flex justify-between items-center ${className}`}
    {...props}
  >
    {children}
  </div>
);

// Card Title Component
Card.Title = ({ children, className = "", ...props }) => (
  <h3 className={`text-lg font-semibold text-heading ${className}`} {...props}>
    {children}
  </h3>
);

// Card Body Component
Card.Body = ({ children, className = "", ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

// Card Footer Component
Card.Footer = ({ children, className = "", ...props }) => (
  <div
    className={`mt-4 pt-3 border-t border-lightGray flex justify-between items-center ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default Card;
