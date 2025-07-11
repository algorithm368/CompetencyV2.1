import React from "react";
import { motion } from "framer-motion";
import { RefreshCw, AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  error: unknown;
  onRetry: () => void;
}

// Optimized animation variants
const errorVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

const iconVariants = {
  initial: { scale: 0 },
  animate: { 
    scale: 1,
    transition: {
      delay: 0.1,
      type: "spring",
      stiffness: 200,
      damping: 20
    }
  }
};

const buttonVariants = {
  hover: { 
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  tap: { 
    scale: 0.95,
    transition: {
      duration: 0.1
    }
  }
};

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => (
  <motion.div
    key="error"
    variants={errorVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    className="flex flex-col items-center justify-center py-10"
  >
    <div className="bg-gradient-to-br from-red-50 to-red-100/80 border border-red-200 rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
      <motion.div
        variants={iconVariants}
        initial="initial"
        animate="animate"
        className="flex justify-center mb-6"
      >
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-full p-4 shadow-lg">
          <AlertTriangle className="w-8 h-8 text-white" />
        </div>
      </motion.div>
      <h3 className="text-xl font-bold text-red-800 mb-3">เกิดข้อผิดพลาด</h3>
      <p className="text-red-600 mb-6 leading-relaxed">
        {typeof error === "string"
          ? error
          : "ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง"}
      </p>
      <motion.button
        onClick={onRetry}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        ลองใหม่อีกครั้ง
      </motion.button>
    </div>
  </motion.div>
);

export default ErrorState;
