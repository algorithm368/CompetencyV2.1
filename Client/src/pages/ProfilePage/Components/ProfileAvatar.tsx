import React from "react";

interface ProfileAvatarProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ 
  size = "lg", 
  className = "" 
}) => {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24", 
    lg: "w-32 h-32"
  };

  const iconSizes = {
    sm: "text-xl",
    md: "text-3xl",
    lg: "text-4xl"
  };

  const buttonSizes = {
    sm: "w-6 h-6 -bottom-1 -right-1",
    md: "w-8 h-8 -bottom-1 -right-1", 
    lg: "w-12 h-12 -bottom-2 -right-2"
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Main Avatar */}
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-teal-100 via-blue-100 to-teal-50 rounded-2xl flex items-center justify-center border-4 border-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group`}>
        <div className="absolute inset-0 bg-gradient-to-br from-teal-400/20 to-blue-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <i className={`fas fa-user ${iconSizes[size]} text-teal-600 relative z-10 group-hover:text-teal-700 transition-colors duration-300`}></i>
      </div>
      
      {/* Camera Button */}
      <button className={`absolute ${buttonSizes[size]} bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group`}>
        <i className="fas fa-camera text-sm group-hover:scale-110 transition-transform duration-200"></i>
        
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          เปลี่ยนรูปโปรไฟล์
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      </button>
      
      {/* Online Status Indicator */}
      <div className="absolute top-1 right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
    </div>
  );
};
