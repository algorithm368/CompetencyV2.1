import React from "react";

interface RecommendationsPanelProps {
  recommendations: string[];
}

const RecommendationsPanel: React.FC<RecommendationsPanelProps> = ({
  recommendations,
}) => {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 mb-6">
      <div className="bg-white border border-teal-100 rounded-lg p-6 shadow-md">
        <div className="flex items-center space-x-2 mb-4">
          <div className="bg-teal-100 rounded-full p-2">
            <svg className="h-5 w-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 text-lg">
            Recommendations for You
          </h3>
        </div>
        <div className="bg-teal-50 rounded-lg p-4">
          <ul className="text-sm text-gray-700 space-y-2">
            {recommendations.map((rec, index) => (
              <li key={`recommendation-${rec.slice(0, 30)}-${index}`} className="flex items-start space-x-2">
                <span className="text-teal-500 mt-1">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsPanel;
