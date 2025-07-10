import React from "react";

const LoadingState: React.FC<{ source?: string; id?: string }> = ({ source, id }) => (
  <div className="flex flex-col items-center justify-center min-h-96">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
      <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-teal-400 rounded-full animate-pulse"></div>
    </div>
    <p className="text-teal-700 text-lg font-medium mt-6">
      Loading {source?.toUpperCase()} competency details...
    </p>
    <p className="text-gray-600 text-sm mt-2">
      Fetching information for code: {id}
    </p>
  </div>
);

export default LoadingState;
