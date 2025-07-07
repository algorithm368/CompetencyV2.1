import React from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

const LoadingState: React.FC = () => (
  <motion.div
    key="loading"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.4 }}
    className="flex flex-col items-center justify-center py-10"
  >
    <div className="relative">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-teal-100 border-t-teal-600 rounded-full"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-2 bg-teal-100 rounded-full"
      />
    </div>
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-8 text-center"
    >
      <div className="inline-flex items-center gap-2 bg-teal-100/80 backdrop-blur-sm text-teal-800 px-6 py-3 rounded-full font-medium mb-2 border border-teal-200/50">
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
