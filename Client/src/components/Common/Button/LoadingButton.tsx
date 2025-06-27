import React from "react";
import Button, { ButtonVariant, ButtonSize } from "./Button"; // สมมติ path นี้ถูกต้อง

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading = false,
  loadingText = "Loading...",
  disabled,
  variant = "primary",
  size = "md",
  children,
  className,
  ...rest
}) => {
  return (
    <Button
      disabled={disabled || isLoading}
      variant={variant}
      size={size}
      className={`inline-flex items-center justify-center ${className || ""}`}
      {...rest}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      )}
      {isLoading ? loadingText : children}
    </Button>
  );
};

export default LoadingButton;
