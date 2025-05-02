import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  to,
  href,
  type = "button",
  disabled = false,
  onClick,
  fullWidth = false,
  className = "",
  icon,
  iconPosition = "left",
  isLoading = false,
  ...props
}) => {
  // Button variants
  const variants = {
    primary: "bg-primary text-white hover:bg-blue-600 focus:ring-primary",
    secondary:
      "bg-secondary text-white hover:bg-green-600 focus:ring-secondary",
    cta: "bg-cta text-white hover:bg-ctaHover focus:ring-cta",
    outline:
      "bg-transparent border border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary",
    ghost: "bg-transparent text-primary hover:bg-blue-50 focus:ring-primary",
    danger: "bg-error text-white hover:bg-red-600 focus:ring-error",
  };

  // Button sizes
  const sizes = {
    sm: "text-xs px-2.5 py-1.5 rounded",
    md: "text-sm px-4 py-2 rounded-md",
    lg: "text-base px-6 py-3 rounded-lg",
    xl: "text-lg px-8 py-4 rounded-lg",
  };

  // Base classes
  const baseClasses = `inline-flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${
    disabled ? "opacity-60 cursor-not-allowed" : ""
  } ${fullWidth ? "w-full" : ""} ${variants[variant]} ${
    sizes[size]
  } ${className}`;

  // Loading spinner component
  const LoadingSpinner = () => (
    <svg
      className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  // Content with icon and loading state
  const content = (
    <>
      {isLoading && <LoadingSpinner />}
      {icon && iconPosition === "left" && !isLoading && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      {icon && iconPosition === "right" && <span className="ml-2">{icon}</span>}
    </>
  );

  // Use Framer Motion for subtle hover effects
  const MotionComponent = ({ children, ...rest }) => (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.1 }}
      {...rest}
    >
      {children}
    </motion.button>
  );

  // Render as link if 'to' or 'href' prop is provided
  if (to) {
    return (
      <Link to={to} className={baseClasses} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={baseClasses} {...props}>
        {content}
      </a>
    );
  }

  // Render as button
  return (
    <MotionComponent
      type={type}
      className={baseClasses}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {content}
    </MotionComponent>
  );
};

export default Button;
