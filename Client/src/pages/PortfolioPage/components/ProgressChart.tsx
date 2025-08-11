import React from 'react';
import { FaChartBar, FaChartPie } from 'react-icons/fa';
import { PortfolioData } from '@Types/portfolio';

interface ProgressChartProps {
  portfolioData: PortfolioData;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ portfolioData }) => {
  const { sfiaSkills, tpqiCareers, overallStats } = portfolioData;

  // Prepare SFIA skills chart data
  const sfiaChartData = sfiaSkills.map(skill => ({
    name: skill.skill?.name || 'Unknown',
    code: skill.skillCode || '',
    progress: skill.skillPercent || 0,
    level: skill.level?.name || 'Unknown'
  }));

  // Prepare TPQI careers chart data
  const tpqiChartData = tpqiCareers.map(career => ({
    name: career.career.name,
    skillProgress: career.skillPercent || 0,
    knowledgeProgress: career.knowledgePercent || 0,
    level: career.level.name
  }));

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Progress Analytics</h2>
      
      {/* Overall Progress Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Competency Overview</h3>
          <FaChartPie className="h-6 w-6 text-teal-600" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* SFIA Overall */}
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-200"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="transparent"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-blue-500"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="transparent"
                  strokeDasharray={`${overallStats.averageSfiaProgress * 100 / 100}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-blue-600">
                  {Math.round(overallStats.averageSfiaProgress)}%
                </span>
              </div>
            </div>
            <h4 className="font-semibold text-gray-900">SFIA Skills</h4>
            <p className="text-sm text-gray-500">{overallStats.totalSfiaSkills} skills assessed</p>
          </div>

          {/* TPQI Skills */}
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-200"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="transparent"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-green-500"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="transparent"
                  strokeDasharray={`${overallStats.averageTpqiSkillProgress * 100 / 100}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-green-600">
                  {Math.round(overallStats.averageTpqiSkillProgress)}%
                </span>
              </div>
            </div>
            <h4 className="font-semibold text-gray-900">TPQI Skills</h4>
            <p className="text-sm text-gray-500">{overallStats.totalTpqiCareers} career paths</p>
          </div>

          {/* TPQI Knowledge */}
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-200"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="transparent"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-purple-500"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="transparent"
                  strokeDasharray={`${overallStats.averageTpqiKnowledgeProgress * 100 / 100}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-purple-600">
                  {Math.round(overallStats.averageTpqiKnowledgeProgress)}%
                </span>
              </div>
            </div>
            <h4 className="font-semibold text-gray-900">TPQI Knowledge</h4>
            <p className="text-sm text-gray-500">Knowledge assessments</p>
          </div>
        </div>
      </div>

      {/* SFIA Skills Detailed Chart */}
      {sfiaChartData.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">SFIA Skills Progress</h3>
            <FaChartBar className="h-6 w-6 text-blue-600" />
          </div>
          <div className="space-y-4">
            {sfiaChartData.map((skill) => (
              <div key={skill.code} className="flex items-center space-x-4">
                <div className="w-32 text-sm font-medium text-gray-700 truncate">
                  {skill.name}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                  <div
                    className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(skill.progress, 100)}%` }}
                  ></div>
                  <span className="absolute right-2 top-0 text-xs text-gray-600 leading-4">
                    {Math.round(skill.progress)}%
                  </span>
                </div>
                <div className="w-20 text-xs text-gray-500 text-right">
                  {skill.level}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TPQI Careers Detailed Chart */}
      {tpqiChartData.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">TPQI Career Progress</h3>
            <FaChartBar className="h-6 w-6 text-green-600" />
          </div>
          <div className="space-y-6">
            {tpqiChartData.map((career) => (
              <div key={career.name} className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">{career.name}</h4>
                <div className="space-y-3">
                  {/* Skills Progress */}
                  <div className="flex items-center space-x-4">
                    <div className="w-20 text-sm text-gray-600">Skills</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
                      <div
                        className="bg-green-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(career.skillProgress, 100)}%` }}
                      ></div>
                      <span className="absolute right-2 top-0 text-xs text-gray-600 leading-3">
                        {Math.round(career.skillProgress)}%
                      </span>
                    </div>
                  </div>
                  {/* Knowledge Progress */}
                  <div className="flex items-center space-x-4">
                    <div className="w-20 text-sm text-gray-600">Knowledge</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
                      <div
                        className="bg-purple-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(career.knowledgeProgress, 100)}%` }}
                      ></div>
                      <span className="absolute right-2 top-0 text-xs text-gray-600 leading-3">
                        {Math.round(career.knowledgeProgress)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressChart;
