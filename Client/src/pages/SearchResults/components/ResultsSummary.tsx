import React from "react";

interface ResultsSummaryProps {
  query: string;
  itemsCount: number;
  currentPage: number;
  totalPages: number;
}

/**
 * ResultsSummary Component
 * 
 * Displays summary information about search results including
 * results count, pagination info, and data sources
 */
const ResultsSummary: React.FC<ResultsSummaryProps> = ({
  query,
  itemsCount,
  currentPage,
  totalPages,
}) => {
  return (
    <div className="mb-6 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">
              พบผลลัพธ์ {itemsCount} รายการ สำหรับ "{query}"
            </p>
            <p className="text-sm text-gray-600">
              หน้า {currentPage} จาก {totalPages} หน้า
            </p>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          แสดงผลจากฐานข้อมูล SFIA และ TPQI
        </div>
      </div>
    </div>
  );
};

export default ResultsSummary;
