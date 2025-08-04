import React from "react";
import { motion } from "framer-motion";
import { SkeletonLoader } from "../ui";

/**
 * SearchLoadingState Component
 *
 * Displays an enhanced loading state with skeleton loading and progress indication
 * while searching through SFIA and TPQI databases
 */
const SearchLoadingState: React.FC = () => {
  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Loading Header */}
      <div className="text-center py-8">
        <div className="inline-flex flex-col items-center space-y-4 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
          <div className="relative">
            <div className="w-10 h-10 border-3 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-10 h-10 border-3 border-transparent border-t-teal-400 rounded-full animate-spin animation-delay-75"></div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              กำลังค้นหาข้อมูล
            </h3>
            <p className="text-gray-600 text-sm">
              กำลังสืบค้นข้อมูลจากฐานข้อมูล SFIA และ TPQI...
            </p>
            <div className="mt-3 flex items-center justify-center space-x-3 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span>SFIA</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse animation-delay-150"></span>
                <span>TPQI</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skeleton Loading Results */}
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <SkeletonLoader count={4} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SearchLoadingState;
