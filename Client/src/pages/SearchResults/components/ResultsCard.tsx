import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Database } from "lucide-react";

interface ItemType {
  id: number;
  name: string;
  framework: string;
}

interface ResultCardProps {
  item: ItemType;
  onViewDetails: (id: number) => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ item, onViewDetails }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="relative group overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-15 group-hover:opacity-25 transition-opacity duration-300"></div>
      </div>

      <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-teal-100/50 group-hover:border-teal-200 h-full flex flex-col justify-between group-hover:bg-white">
        {/* Header with framework badge */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 bg-gradient-to-r from-teal-50 to-teal-100 text-teal-800 px-3 py-1 rounded-full text-xs font-medium border border-teal-200/50">
              <Database className="w-3 h-3" />
              {item.framework}
            </div>
            <motion.div
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ rotate: 0 }}
              whileHover={{ rotate: 45 }}
            >
              <ArrowRight className="w-4 h-4 text-teal-600" />
            </motion.div>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-teal-700 transition-colors duration-300 leading-tight">
            {item.name}
          </h2>

          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <span className="w-2 h-2 bg-teal-400 rounded-full"></span>
            <span>กรอบสมรรถนะ: {item.framework}</span>
          </div>
        </div>

        {/* Action button */}
        <div className="mt-auto">
          <motion.button
            onClick={() => onViewDetails(item.id)}
            className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white py-3 rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg group-hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="flex items-center justify-center gap-2">
              ดูรายละเอียด
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </motion.button>
        </div>

        {/* Subtle decoration line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </motion.div>
  );
};

export default ResultCard;
