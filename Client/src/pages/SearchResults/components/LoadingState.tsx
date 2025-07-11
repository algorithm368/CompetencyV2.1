import React from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

// Optimized animation variants (defined outside component for performance)
const loadingVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

const spinnerVariants = {
  animate: { 
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

const textVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      delay: 0.2,
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

const LoadingState: React.FC = () => (
  <motion.div
    key="loading"
    variants={loadingVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    className="flex flex-col items-center justify-center py-10"
  >
    <div className="relative">
      <motion.div
        variants={spinnerVariants}
        animate="animate"
        className="w-16 h-16 border-4 border-teal-100 border-t-teal-600 rounded-full"
      />
      {/* Removed the inner pulsing circle to reduce animation complexity */}
    </div>
    <motion.div
      variants={textVariants}
      initial="initial"
      animate="animate"
      className="mt-8 text-center"
    >
      <div className="inline-flex items-center gap-2 bg-teal-100/70 text-teal-800 px-6 py-3 rounded-full font-medium mb-2 border border-teal-200/30">
        <Clock className="w-4 h-4" />
        กำลังค้นหา...
      </div>
      <p className="text-teal-600 text-lg font-medium">กำลังประมวลผลข้อมูล</p>
      <p className="text-teal-500 text-sm mt-2">
        กรุณารอสักครู่เพื่อประสบการณ์ที่ดีที่สุด
      </p>
    </motion.div>
  </motion.div>
);

export default LoadingState;
