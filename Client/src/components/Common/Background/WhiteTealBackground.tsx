// src/components/Home/SharedBackground.tsx
import React from "react";

interface SharedBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export const SharedBackground: React.FC<SharedBackgroundProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`relative min-h-screen overflow-hidden ${className}`}>
      {/* Unified gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-teal-50 via-teal-25 to-white">
        {/* Primary decorative elements */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div
          className="absolute top-1/4 -left-40 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Secondary flowing elements */}
        <div className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-teal-200 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
        <div className="absolute bottom-1/3 right-1/3 w-32 h-32 bg-teal-300 rounded-full mix-blend-multiply filter blur-2xl opacity-25"></div>
        <div className="absolute top-3/4 right-1/4 w-36 h-36 bg-teal-200 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>

        {/* Framework-specific decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-25"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-25"></div>
        <div className="absolute top-2/3 left-20 w-24 h-24 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute bottom-1/3 right-10 w-18 h-18 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-25"></div>
        <div className="absolute bottom-40 left-1/3 w-22 h-22 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>

        {/* Subtle pattern overlay for texture */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute top-1/4 left-1/4 w-2 h-2 bg-teal-400 rounded-full animate-ping"
            style={{ animationDuration: "3s" }}
          ></div>
          <div
            className="absolute top-1/3 right-1/3 w-1 h-1 bg-teal-500 rounded-full animate-ping"
            style={{ animationDuration: "4s", animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-teal-400 rounded-full animate-ping"
            style={{ animationDuration: "5s", animationDelay: "2s" }}
          ></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-teal-600 rounded-full animate-ping"
            style={{ animationDuration: "3.5s", animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute top-3/4 left-1/3 w-1 h-1 bg-blue-400 rounded-full animate-ping"
            style={{ animationDuration: "4.5s", animationDelay: "1.5s" }}
          ></div>
          <div
            className="absolute bottom-1/2 right-1/5 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"
            style={{ animationDuration: "6s", animationDelay: "3s" }}
          ></div>
        </div>

        {/* Additional texture layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-teal-50/10 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-blue-50/5 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-emerald-50/5 to-transparent"></div>
      </div>

      {/* Content overlay */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
