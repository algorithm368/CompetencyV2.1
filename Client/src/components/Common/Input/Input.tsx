import React, { InputHTMLAttributes, FC } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input: FC<InputProps> = ({ className = "", disabled, ...rest }) => {
  const baseClass = "bg-white rounded-3xl border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 z-0" + "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition";

  const disabledClass = disabled ? "opacity-50 cursor-not-allowed bg-gray-100" : "";

  return (
    <input
      className={`${baseClass} ${disabledClass} ${className}`}
      disabled={disabled}
      {...rest}
    />
  );
};

export default Input;
