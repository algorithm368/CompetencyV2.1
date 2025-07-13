import React from "react";
import { motion } from "framer-motion";

interface SearchEmptyStateProps {
  query: string;
  onNewSearch: () => void;
}

/**
 * SearchEmptyState Component
 * 
 * Displays empty state with search suggestions when no results are found
 */
const SearchEmptyState: React.FC<SearchEmptyStateProps> = ({ query, onNewSearch }) => {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center py-16"
    >
      <div className="max-w-xl mx-auto">
        <div className="p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-yellow-100 rounded-full">
              <svg className="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">ไม่พบผลลัพธ์</h3>
          <p className="text-gray-600 mb-6">
            ไม่พบข้อมูลที่ตรงกับคำค้นหา "<strong>{query}</strong>" ในฐานข้อมูล
          </p>
          
          {/* Search suggestions */}
          <div className="space-y-4 text-left">
            <p className="text-sm font-medium text-gray-700">คำแนะนำ:</p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>ลองใช้คำหลักที่กว้างขึ้น เช่น "software" แทน "software engineering"</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>ตรวจสอบการสะกดคำ</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>ลองใช้คำภาษาอังกฤษ</span>
              </li>
            </ul>
          </div>
          
          <button
            onClick={onNewSearch}
            className="mt-6 inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            ค้นหาใหม่
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SearchEmptyState;
