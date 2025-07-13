import React from "react";

interface FloatingActionButtonsProps {
  onClearSearch: () => void;
  onScrollToTop: () => void;
}

/**
 * FloatingActionButtons Component
 * 
 * Provides quick action buttons that float at the bottom-right of the screen
 * Includes clear search and scroll to top functionality
 */
const FloatingActionButtons: React.FC<FloatingActionButtonsProps> = ({
  onClearSearch,
  onScrollToTop,
}) => {
  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      <div className="flex flex-col space-y-2 sm:space-y-3">
        {/* Clear search button */}
        <button
          onClick={onClearSearch}
          className="p-2 sm:p-3 bg-white shadow-lg rounded-full border border-gray-200 hover:bg-gray-50 hover:shadow-xl transition-all duration-200 group hover-scale"
          title="ล้างการค้นหา"
          aria-label="ล้างการค้นหา"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Scroll to top button */}
        <button
          onClick={onScrollToTop}
          className="p-2 sm:p-3 bg-gradient-to-r from-indigo-600 to-blue-600 shadow-lg rounded-full hover:from-indigo-700 hover:to-blue-700 hover:shadow-xl transition-all duration-200 group hover-scale"
          title="กลับขึ้นด้านบน"
          aria-label="กลับขึ้นด้านบน"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default FloatingActionButtons;
