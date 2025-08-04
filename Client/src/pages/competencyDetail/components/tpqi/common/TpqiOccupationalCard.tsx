import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";

interface TpqiOccupationalCardProps {
  name: string;
  colorScheme: {
    accent: string;
    border: string;
    shadow: string;
    decorativeDot: string;
  };
}

export const TpqiOccupationalCard: React.FC<TpqiOccupationalCardProps> = ({
  name,
  colorScheme,
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);

  return (
    <motion.div
      className={`flex items-center p-4 bg-white/80 backdrop-blur-md rounded-2xl border ${colorScheme.border} shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden`}
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        scale: isActive ? 1.05 : 1,
        boxShadow: isActive ? colorScheme.shadow : 'none'
      }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
    >
      {/* Decorative dot */}
      <div className={`absolute top-2 right-4 w-2 h-2 ${colorScheme.decorativeDot} rounded-full opacity-20`}></div>
      <FaCheckCircle className={`w-5 h-5 ${colorScheme.accent} mr-3 flex-shrink-0`} />
      <span className="text-gray-800 font-semibold text-lg">{name}</span>
    </motion.div>
  );
};
