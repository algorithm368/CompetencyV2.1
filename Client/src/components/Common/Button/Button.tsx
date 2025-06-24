import React from "react";
import classNames from "classnames";

export type ButtonVariant = "primary" | "secondary" | "danger" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
  danger: "bg-red-600 text-white hover:bg-red-700",
  outline: "border border-gray-400 text-gray-800 hover:bg-gray-100",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-5 py-3 text-lg",
};

const baseStyles = "rounded-3xl font-medium focus:outline-none transition z-0";

const Button: React.FC<ButtonProps> = ({ variant = "primary", size = "md", children, className, ...props }) => {
  return (
    <button
      className={classNames(baseStyles, variantStyles[variant], sizeStyles[size], className, props.disabled && "opacity-50 cursor-not-allowed")}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
