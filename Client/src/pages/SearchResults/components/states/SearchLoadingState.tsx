import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SkeletonLoader } from "../ui";

/**
 * Enhanced SearchLoadingState Component
 *
 * Displays an enhanced loading state with skeleton loading, progress indication,
 * and dynamic status messages while searching through SFIA and TPQI databases
 */
const SearchLoadingState: React.FC = () => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [searchProgress, setSearchProgress] = useState(0);

  const loadingMessages = [
    "กำลังเชื่อมต่อฐานข้อมูล...",
    "กำลังค้นหาข้อมูล SFIA...",
    "กำลังค้นหาข้อมูล TPQI...",
    "กำลังประมวลผลข้อมูล...",
    "เกือบเสร็จแล้ว..."
  ];

  useEffect(() => {
    // Simulate progress and message updates
    const progressInterval = setInterval(() => {
      setSearchProgress(prev => {
        const next = prev + Math.random() * 15 + 5;
        return next > 95 ? 95 : next;
      });
    }, 200);

    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % loadingMessages.length);
    }, 1200);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, [loadingMessages.length]);

  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Enhanced Loading Header */}
      <div className="text-center py-8">
        <motion.div 
          className="inline-flex flex-col items-center space-y-4 p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Enhanced Loading Spinner */}
          <div className="relative">
            <motion.div 
              className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-teal-400 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-2 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-2 h-2 bg-teal-600 rounded-full" />
            </motion.div>
          </div>

          {/* Dynamic Content */}
          <div className="text-center space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">
              กำลังค้นหาข้อมูล
            </h3>
            
            {/* Animated Status Message */}
            <AnimatePresence mode="wait">
              <motion.p
                key={currentMessage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-gray-600 text-sm min-h-[20px]"
              >
                {loadingMessages[currentMessage]}
              </motion.p>
            </AnimatePresence>

            {/* Progress Bar */}
            <div className="w-64 bg-gray-200 rounded-full h-2 mt-4">
              <motion.div
                className="bg-gradient-to-r from-teal-500 to-teal-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${searchProgress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
            <p className="text-xs text-gray-500">
              {Math.round(searchProgress)}% เสร็จสิ้น
            </p>

            {/* Database Status Indicators */}
            <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-500">
              <motion.div 
                className="flex items-center space-x-1"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
              >
                <motion.span 
                  className="w-2 h-2 bg-green-400 rounded-full"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span>SFIA Database</span>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-1"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
              >
                <motion.span 
                  className="w-2 h-2 bg-teal-400 rounded-full"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                />
                <span>TPQI Database</span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Skeleton Loading Results */}
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <SkeletonLoader count={4} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SearchLoadingState;
