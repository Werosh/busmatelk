import React, { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      label,
      type = "text",
      id,
      name,
      value,
      onChange,
      onBlur,
      placeholder,
      error,
      helper,
      disabled = false,
      required = false,
      className = "",
      inputClassName = "",
      labelClassName = "",
      icon,
      iconPosition = "left",
      fullWidth = true,
      ...props
    },
    ref
  ) => {
    // Generate unique ID if not provided
    const inputId =
      id || `input-${name || Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={`mb-4 ${fullWidth ? "w-full" : ""} ${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className={`block text-sm font-medium text-darkGray mb-1 ${labelClassName}`}
          >
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {icon && iconPosition === "left" && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-darkGray">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            type={type}
            id={inputId}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            placeholder={placeholder}
            required={required}
            className={`
            form-input
            ${error ? "border-error focus:border-error focus:ring-error" : ""}
            ${disabled ? "bg-lightGray cursor-not-allowed opacity-70" : ""}
            ${icon && iconPosition === "left" ? "pl-10" : ""}
            ${icon && iconPosition === "right" ? "pr-10" : ""}
            ${inputClassName}
          `}
            {...props}
          />

          {icon && iconPosition === "right" && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-darkGray">
              {icon}
            </div>
          )}
        </div>

        {/* Helper text or error message */}
        {(helper || error) && (
          <p
            className={`mt-1 text-sm ${error ? "text-error" : "text-darkGray"}`}
          >
            {error || helper}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
