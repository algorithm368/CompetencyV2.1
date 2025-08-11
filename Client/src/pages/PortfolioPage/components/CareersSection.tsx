import React from 'react';
import { FaGraduationCap, FaBrain, FaTools, FaInfoCircle } from 'react-icons/fa';
import { TpqiSummary } from '@Types/portfolio';

interface CareersSectionProps {
  tpqiCareers: TpqiSummary[];
}

const CareersSection: React.FC<CareersSectionProps> = ({ tpqiCareers }) => {
  const getProgressColor = (percentage: number | null) => {
    if (!percentage) return 'bg-gray-200';
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getProgressText = (percentage: number | null) => {
    if (!percentage) return 'Not Started';
    if (percentage >= 80) return 'Expert';
    if (percentage >= 60) return 'Proficient';
    if (percentage >= 40) return 'Developing';
    return 'Beginner';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">TPQI Career Framework</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <FaInfoCircle />
          <span>Thailand Professional Qualification Institute (TPQI)</span>
        </div>
      </div>

      {tpqiCareers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <FaGraduationCap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No TPQI Career Data</h3>
          <p className="text-gray-500">Complete your career assessment to see your TPQI competencies here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {tpqiCareers.map((careerSummary) => (
            <div key={careerSummary.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {careerSummary.career.name}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                      {careerSummary.level.name}
                    </span>
                    <span>•</span>
                    <span>Career Level ID: {careerSummary.careerLevelId}</span>
                  </div>
                </div>
              </div>

              {/* Skills and Knowledge Progress */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Skills Progress */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <FaTools className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-900">Skills</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-blue-900">
                        {careerSummary.skillPercent ? Math.round(careerSummary.skillPercent) : 0}%
                      </div>
                      <div className="text-xs text-blue-700">
                        {getProgressText(careerSummary.skillPercent)}
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(careerSummary.skillPercent)}`}
                      style={{ width: `${Math.min(careerSummary.skillPercent || 0, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Knowledge Progress */}
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <FaBrain className="h-5 w-5 text-purple-600" />
                      <span className="font-medium text-purple-900">Knowledge</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-purple-900">
                        {careerSummary.knowledgePercent ? Math.round(careerSummary.knowledgePercent) : 0}%
                      </div>
                      <div className="text-xs text-purple-700">
                        {getProgressText(careerSummary.knowledgePercent)}
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(careerSummary.knowledgePercent)}`}
                      style={{ width: `${Math.min(careerSummary.knowledgePercent || 0, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Overall Progress */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-gray-900">Overall Career Progress</span>
                  <span className="text-lg font-bold text-gray-900">
                    {careerSummary.skillPercent && careerSummary.knowledgePercent
                      ? Math.round((careerSummary.skillPercent + careerSummary.knowledgePercent) / 2)
                      : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-teal-500 h-3 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        careerSummary.skillPercent && careerSummary.knowledgePercent
                          ? (careerSummary.skillPercent + careerSummary.knowledgePercent) / 2
                          : 0,
                        100
                      )}%`
                    }}
                  ></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex space-x-4">
                <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                  <FaTools className="h-4 w-4" />
                  <span>View Skills Details</span>
                </button>
                <button className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 text-sm font-medium">
                  <FaBrain className="h-4 w-4" />
                  <span>View Knowledge Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {tpqiCareers.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">TPQI Career Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{tpqiCareers.length}</div>
              <div className="text-sm text-green-700">Career Paths</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(
                  tpqiCareers.reduce((sum, career) => sum + (career.skillPercent || 0), 0) / tpqiCareers.length
                )}%
              </div>
              <div className="text-sm text-blue-700">Avg Skills Progress</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(
                  tpqiCareers.reduce((sum, career) => sum + (career.knowledgePercent || 0), 0) / tpqiCareers.length
                )}%
              </div>
              <div className="text-sm text-purple-700">Avg Knowledge Progress</div>
            </div>
            <div className="text-center p-4 bg-teal-50 rounded-lg">
              <div className="text-2xl font-bold text-teal-600">
                {tpqiCareers.filter(career => 
                  career.skillPercent && career.knowledgePercent && 
                  (career.skillPercent + career.knowledgePercent) / 2 >= 80
                ).length}
              </div>
              <div className="text-sm text-teal-700">Expert Careers</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareersSection;
