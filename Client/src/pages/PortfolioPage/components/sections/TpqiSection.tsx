import React from "react";
import { FaChartBar, FaInfoCircle, FaBriefcase } from "react-icons/fa";
import { TpqiSummary } from "@Types/portfolio";

interface TpqiSectionProps {
  tpqiCareers: TpqiSummary[];
}

const TpqiSection: React.FC<TpqiSectionProps> = ({ tpqiCareers }) => {
  const getSkillLevelColor = (percentage: number | null) => {
    if (!percentage) return "bg-gray-200";
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-yellow-500";
    if (percentage >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  const getSkillLevelText = (percentage: number | null) => {
    if (!percentage) return "Not Started";
    if (percentage >= 80) return "Expert";
    if (percentage >= 60) return "Proficient";
    if (percentage >= 40) return "Developing";
    return "Beginner";
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          TPQI Career Framework
        </h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
          <FaInfoCircle className="h-4 w-4" />
          <span>Thai Professional Qualification Institute (TPQI)</span>
        </div>
      </div>

      {tpqiCareers.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-100">
          <FaBriefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No TPQI Career Data
          </h3>
          <p className="text-gray-500">
            Complete your career assessment to see your TPQI competencies here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {tpqiCareers.map((careerSummary) => (
            <div
              key={careerSummary.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md hover:border-teal-200 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {careerSummary.career?.name || "Unknown Career"}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">
                      {careerSummary.level?.name || "Unknown Level"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Skills Progress */}
              <div className="mb-4 bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Skills</span>
                  <span className="text-sm text-gray-900 font-bold">
                    {careerSummary.skillPercent
                      ? Math.round(careerSummary.skillPercent)
                      : 0}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 shadow-sm ${getSkillLevelColor(
                      careerSummary.skillPercent
                    )}`}
                    style={{
                      width: `${Math.min(careerSummary.skillPercent || 0, 100)}%`,
                    }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-2 font-medium">
                  {getSkillLevelText(careerSummary.skillPercent)}
                </div>
              </div>

              {/* Knowledge Progress */}
              <div className="mb-4 bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Knowledge</span>
                  <span className="text-sm text-gray-900 font-bold">
                    {careerSummary.knowledgePercent
                      ? Math.round(careerSummary.knowledgePercent)
                      : 0}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 shadow-sm ${getSkillLevelColor(
                      careerSummary.knowledgePercent
                    )}`}
                    style={{
                      width: `${Math.min(careerSummary.knowledgePercent || 0, 100)}%`,
                    }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-2 font-medium">
                  {getSkillLevelText(careerSummary.knowledgePercent)}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-gray-100">
                <button className="flex items-center space-x-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50 text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200 w-full justify-center">
                  <FaChartBar className="h-4 w-4" />
                  <span>View Career Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {tpqiCareers.length > 0 && (
        <div className="mt-6 bg-gray-50 rounded-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            TPQI Career Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border border-purple-100">
              <div className="text-2xl font-bold text-purple-600">
                {tpqiCareers.length}
              </div>
              <div className="text-sm text-purple-700 font-medium">Total Careers</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-blue-100">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(
                  tpqiCareers.reduce(
                    (sum, career) => sum + (career.skillPercent || 0),
                    0
                  ) / tpqiCareers.length
                )}
                %
              </div>
              <div className="text-sm text-blue-700 font-medium">Avg Skills Progress</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-green-100">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(
                  tpqiCareers.reduce(
                    (sum, career) => sum + (career.knowledgePercent || 0),
                    0
                  ) / tpqiCareers.length
                )}
                %
              </div>
              <div className="text-sm text-green-700 font-medium">Avg Knowledge Progress</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-orange-100">
              <div className="text-2xl font-bold text-orange-600">
                {
                  tpqiCareers.filter(
                    (career) => 
                      (career.skillPercent || 0) >= 80 && 
                      (career.knowledgePercent || 0) >= 80
                  ).length
                }
              </div>
              <div className="text-sm text-orange-700 font-medium">Expert Careers</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TpqiSection;
