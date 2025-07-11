import React from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

interface EmptyStateProps {
  query: string;
}

// Optimized animation variants
const emptyVariants = {
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

const EmptyState: React.FC<EmptyStateProps> = ({ query }) => (
  <motion.div
    key="empty-results"
    variants={emptyVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    className="flex flex-col items-center justify-center py-10"
  >
    <div className="text-center max-w-md">
      <motion.div
        variants={iconVariants}
        initial="initial"
        animate="animate"
        className="mb-8"
      >
        <div className="bg-gradient-to-br from-gray-400 to-gray-500 rounded-full p-6 shadow-lg mx-auto w-fit">
          <TrendingUp className="w-12 h-12 text-white" />
        </div>
      </motion.div>
      <motion.div
        variants={textVariants}
        initial="initial"
        animate="animate"
      >
        <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-800 bg-clip-text text-transparent mb-3">
          ไม่พบผลลัพธ์
        </h3>
        <div className="bg-gradient-to-r from-gray-50 to-gray-100/80 rounded-2xl p-6 border border-gray-200/50 shadow-lg">
          <p className="text-gray-600 mb-3">
            ไม่พบข้อมูลที่ตรงกับคำค้นหา{" "}
            <span className="font-semibold text-teal-700">"{query}"</span>
          </p>
          <p className="text-gray-500 text-sm">
            💡 ลองใช้คำค้นหาอื่นหรือตรวจสอบการสะกดคำ
          </p>
        </div>
      </motion.div>
    </div>
  </motion.div>
);

export default EmptyState;
