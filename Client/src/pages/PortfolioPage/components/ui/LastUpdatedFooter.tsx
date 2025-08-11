import React from "react";

interface LastUpdatedFooterProps {
  lastFetched: Date | null;
}

const LastUpdatedFooter: React.FC<LastUpdatedFooterProps> = ({ lastFetched }) => {
  if (!lastFetched) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 mt-6">
      <div className="bg-white rounded-lg shadow-md p-4 text-center border border-gray-100">
        <div className="flex items-center justify-center space-x-2">
          <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <span className="text-sm text-gray-600 font-medium">
            Last updated: {lastFetched.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LastUpdatedFooter;
