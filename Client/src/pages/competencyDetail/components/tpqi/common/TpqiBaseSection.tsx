import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { FaTools } from "react-icons/fa";
import type { ColorScheme } from "../types";

interface TpqiBaseSectionProps {
  title: string;
  icon?: ReactNode;
  overall?: string;
  children: ReactNode;
  colorScheme: ColorScheme;
}

export const TpqiBaseSection: React.FC<TpqiBaseSectionProps> = ({
  title,
  icon,
  overall,
  children,
  colorScheme,
}) => {
  return (
    <motion.section
      className={`relative ${colorScheme.gradient} backdrop-blur-xl rounded-3xl p-8 border ${colorScheme.border} shadow-2xl overflow-hidden`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Decorative blurred shapes */}
      <div className={`absolute -top-24 -right-24 w-48 h-48 ${colorScheme.decorative[0]} rounded-full mix-blend-multiply filter blur-2xl opacity-20 pointer-events-none`}></div>
      <div className={`absolute -bottom-24 -left-24 w-48 h-48 ${colorScheme.decorative[1]} rounded-full mix-blend-multiply filter blur-2xl opacity-20 pointer-events-none`}></div>
      
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        {icon || <FaTools className={`w-6 h-6 mr-3 ${colorScheme.accent}`} />}
        {title}
      </h2>
      
      {overall && (
        <div className={`mb-4 p-3 ${colorScheme.overviewBg} ${colorScheme.overviewBorder} rounded`}>
          <h3 className={`font-semibold ${colorScheme.overviewText} mb-1`}>Overview</h3>
          <p className="text-gray-700 text-base whitespace-pre-line">{overall}</p>
        </div>
      )}
      
      {children}
    </motion.section>
  );
};
