import React from "react";
import { motion } from "framer-motion";

interface SkeletonLoaderProps {
  count?: number;
}

/**
 * SkeletonLoader Component
 * 
 * Provides skeleton loading animation for search results
 * to improve perceived performance during loading states
 */
const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ count = 6 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: index * 0.1, // Staggered animation
            ease: "easeOut",
          }}
          className="p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-3">
              {/* Title skeleton */}
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-5 bg-gray-200 rounded-lg animate-pulse flex-1 max-w-md" />
              </div>
              
              {/* Description skeleton */}
              <div className="space-y-2 pl-6">
                <div className="h-4 bg-gray-100 rounded animate-pulse max-w-2xl" />
                <div className="h-4 bg-gray-100 rounded animate-pulse max-w-xl" />
              </div>
              
              {/* Framework badge skeleton */}
              <div className="flex items-center space-x-2 pl-6 pt-2">
                <div className="h-6 w-16 bg-gray-100 rounded-full animate-pulse" />
                <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
            
            {/* Button skeleton */}
            <div className="ml-4">
              <div className="h-9 w-24 bg-gray-100 rounded-lg animate-pulse" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
