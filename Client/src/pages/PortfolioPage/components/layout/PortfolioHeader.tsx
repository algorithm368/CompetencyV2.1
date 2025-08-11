import React from "react";
import {
  FaUser,
  FaEnvelope,
  FaCalendar,
  FaSync,
  FaExclamationTriangle,
} from "react-icons/fa";

interface PortfolioHeaderProps {
  userEmail: string;
  isDataStale?: boolean;
  loading?: boolean;
  onRefresh?: () => void;
  lastUpdated?: Date;
}

const PortfolioHeader: React.FC<PortfolioHeaderProps> = ({
  userEmail,
  isDataStale = false,
  loading = false,
  onRefresh,
  lastUpdated,
}) => {
  const currentDate = lastUpdated
    ? lastUpdated.toLocaleDateString()
    : new Date().toLocaleDateString();

  return (
    <div className="bg-white shadow-lg rounded-lg mb-6">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-6">
        <div className="flex items-center justify-between">
          {/* Left side - User info */}
          <div className="flex items-center space-x-6">
            <div className="bg-gradient-to-br from-teal-100 to-teal-200 rounded-full p-4 shadow-sm">
              <FaUser className="h-8 w-8 text-teal-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                My Portfolio
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-gray-600">
                <div className="flex items-center space-x-2">
                  <FaEnvelope className="h-4 w-4 text-teal-500" />
                  <span className="text-sm font-medium">{userEmail}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaCalendar className="h-4 w-4 text-teal-500" />
                  <span className="text-sm">Last updated: {currentDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Status and Actions */}
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm text-gray-500">Professional Competency</p>
              <p className="text-lg font-semibold text-teal-600">
                Assessment Report
              </p>
            </div>

            {/* Status indicators and refresh button */}
            <div className="flex flex-col items-end space-y-2">
              {isDataStale && (
                <div className="flex items-center space-x-1 text-orange-600">
                  <FaExclamationTriangle className="h-3 w-3" />
                  <span className="text-xs font-medium">
                    Data may be outdated
                  </span>
                </div>
              )}

              {onRefresh && (
                <button
                  onClick={onRefresh}
                  disabled={loading}
                  className="flex items-center space-x-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 disabled:transform-none shadow-md"
                >
                  <FaSync
                    className={`h-3 w-3 ${loading ? "animate-spin" : ""}`}
                  />
                  <span>{loading ? "Refreshing..." : "Refresh"}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioHeader;
