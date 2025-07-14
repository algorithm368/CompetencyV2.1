import React from "react";
import { motion } from "framer-motion";

interface SearchErrorStateProps {
  error: string;
  onRetry: () => void;
}

// Helper function to determine error type and provide appropriate guidance
const getErrorGuidance = (error: string): { icon: JSX.Element; guidance: string } => {
  const lowerError = error.toLowerCase();
  
  // Network-related errors
  if (lowerError.includes('เครือข่าย') || lowerError.includes('เชื่อมต่อ')) {
    return {
      icon: (
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
        </svg>
      ),
      guidance: "โปรดตรวจสอบการเชื่อมต่ออินเทอร์เน็ตของคุณ"
    };
  }
  
  // Validation errors
  if (lowerError.includes('อย่างน้อย') || lowerError.includes('ตัวอักษร') || lowerError.includes('ยาวเกินไป')) {
    return {
      icon: (
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      guidance: "กรุณาแก้ไขคำค้นหาของคุณตามข้อกำหนด"
    };
  }
  
  // Database errors
  if (lowerError.includes('ฐานข้อมูล')) {
    return {
      icon: (
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
        </svg>
      ),
      guidance: "ระบบกำลังมีปัญหา กรุณารอสักครู่แล้วลองใหม่"
    };
  }
  
  // Timeout errors
  if (lowerError.includes('หมดเวลา') || lowerError.includes('ใช้เวลานานเกินไป')) {
    return {
      icon: (
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      guidance: "การค้นหาใช้เวลานานกว่าปกติ ลองใช้คำค้นหาที่สั้นกว่า"
    };
  }
  
  // Server errors
  if (lowerError.includes('เซิร์ฟเวอร์') || lowerError.includes('ระบบ')) {
    return {
      icon: (
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      guidance: "เซิร์ฟเวอร์กำลังมีปัญหา กรุณาลองใหม่ในภายหลัง"
    };
  }
  
  // Rate limiting
  if (lowerError.includes('บ่อยเกินไป')) {
    return {
      icon: (
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      guidance: "โปรดรอสักครู่ก่อนค้นหาอีกครั้ง"
    };
  }
  
  // Default error
  return {
    icon: (
      <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    guidance: "กรุณาลองใหม่อีกครั้ง หรือติดต่อผู้ดูแลระบบ"
  };
};

/**
 * SearchErrorState Component
 * 
 * Displays error state with enhanced error information and retry functionality when search fails
 * Now includes contextual icons and guidance based on error type
 */
const SearchErrorState: React.FC<SearchErrorStateProps> = ({ error, onRetry }) => {
  const { icon, guidance } = getErrorGuidance(error);
  
  return (
    <motion.div
      key="error"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center py-12"
    >
      <div className="inline-flex flex-col items-center space-y-6 p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-red-100 max-w-md mx-auto">
        <div className="p-4 bg-red-100 rounded-full">
          {icon}
        </div>
        <div className="text-center space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">เกิดข้อผิดพลาด</h3>
          <p className="text-gray-700 font-medium">{error}</p>
          <p className="text-sm text-gray-600">{guidance}</p>
        </div>
        <div className="flex flex-col space-y-2 w-full">
          <button
            onClick={onRetry}
            className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            ลองใหม่อีกครั้ง
          </button>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200 text-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            รีเฟรชหน้าเว็บ
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SearchErrorState;
