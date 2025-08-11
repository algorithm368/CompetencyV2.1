import React from 'react';
import { FaUser, FaEnvelope, FaCalendar } from 'react-icons/fa';

interface PortfolioHeaderProps {
  userEmail: string;
}

const PortfolioHeader: React.FC<PortfolioHeaderProps> = ({ userEmail }) => {
  const currentDate = new Date().toLocaleDateString();
  
  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="bg-teal-100 rounded-full p-4">
              <FaUser className="h-8 w-8 text-teal-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Portfolio</h1>
              <div className="flex items-center space-x-4 mt-2 text-gray-600">
                <div className="flex items-center space-x-2">
                  <FaEnvelope className="h-4 w-4" />
                  <span className="text-sm">{userEmail}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaCalendar className="h-4 w-4" />
                  <span className="text-sm">Last updated: {currentDate}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Professional Competency</p>
            <p className="text-lg font-semibold text-teal-600">Assessment Report</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioHeader;
