import React from "react";
import { motion } from "framer-motion";

/**
 * SearchLoadingState Component
 * 
 * Displays an enhanced loading state with progress indication
 * while searching through SFIA and TPQI databases
 */
const SearchLoadingState: React.FC = () => {
  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center py-12"
    >
      <div className="inline-flex flex-col items-center space-y-4 p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-blue-400 rounded-full animate-spin animation-delay-75"></div>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">กำลังค้นหาข้อมูล</h3>
          <p className="text-gray-600">กำลังสืบค้นข้อมูลจากฐานข้อมูล SFIA และ TPQI...</p>
          <div className="mt-3 flex items-center justify-center space-x-2 text-sm text-gray-500">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span>SFIA</span>
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse animation-delay-150"></span>
            <span>TPQI</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SearchLoadingState;
