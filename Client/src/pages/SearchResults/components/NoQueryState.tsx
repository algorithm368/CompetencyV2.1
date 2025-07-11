import React from "react";
import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";

// Optimized animation variants
const noQueryVariants = {
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

const NoQueryState: React.FC = () => (
  <motion.div
    key="no-query"
    variants={noQueryVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    className="flex flex-col items-center justify-center py-10"
  >
    <div className="text-center">
      <motion.div
        variants={iconVariants}
        initial="initial"
        animate="animate"
        className="mb-8"
      >
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-full p-6 shadow-lg mx-auto w-fit">
          <Search className="w-12 h-12 text-white" />
        </div>
      </motion.div>
      <motion.div
        variants={textVariants}
        initial="initial"
        animate="animate"
      >
        <h3 className="text-2xl font-bold bg-gradient-to-r from-teal-700 to-teal-800 bg-clip-text text-transparent mb-3 pt-6">
          เริ่มต้นการค้นหา
        </h3>
        <p className="text-teal-600 text-lg mb-6">
          กรุณากรอกคำค้นหาเพื่อดูผลลัพธ์
        </p>
        <div className="inline-flex items-center gap-2 bg-teal-100/70 text-teal-700 px-4 py-2 rounded-full text-sm font-medium border border-teal-200/30">
          <Sparkles className="w-4 h-4" />
          ค้นหาสมรรถนะในฝันของคุณ
        </div>
      </motion.div>
    </div>
  </motion.div>
);

export default NoQueryState;
