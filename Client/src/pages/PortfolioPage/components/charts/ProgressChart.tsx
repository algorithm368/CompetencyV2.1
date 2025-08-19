import React from "react";
import { FaChartBar, FaChartPie } from "react-icons/fa";
import { PortfolioData } from "@Types/portfolio";

interface ProgressChartProps {
  portfolioData: PortfolioData;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ portfolioData }) => {
  const { sfiaSkills, tpqiCareers, overallStats } = portfolioData;

  // Prepare SFIA skills chart data
  const sfiaChartData = sfiaSkills.map((skill) => ({
    name: skill.skill?.name || "Unknown",
    code: skill.skillCode || "",
    progress: skill.skillPercent || 0,
    level: skill.level?.name || "Unknown",
  }));

  // Prepare TPQI careers chart data
  const tpqiChartData = tpqiCareers.map((career) => ({
    name: career.career.name,
    skillProgress: career.skillPercent || 0,
    knowledgeProgress: career.knowledgePercent || 0,
    level: career.level.name,
  }));

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 border border-slate-200">
      <div className="flex items-center justify-between mb-8">
        <div className="flex-1">
          <h2 className="text-2xl font-light text-slate-800 mb-2">
            Progress Analytics
          </h2>
          <p className="text-slate-600 font-light">
            Visual representation of your competency development journey
          </p>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
          <FaChartBar className="h-6 w-6 text-blue-600" />
        </div>
      </div>

      {/* Overall Progress Summary */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl p-8 mb-8 border border-slate-200">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-medium text-slate-800">
            Competency Overview
          </h3>
          <div className="bg-white rounded-xl p-3 border border-slate-200">
            <FaChartPie className="h-5 w-5 text-slate-600" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* SFIA Overall */}
          <div className="text-center bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <div className="relative w-36 h-36 mx-auto mb-6">
              <svg
                className="w-36 h-36 transform -rotate-90"
                viewBox="0 0 36 36"
              >
                <path
                  className="text-slate-200"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  fill="transparent"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-blue-500"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  fill="transparent"
                  strokeLinecap="round"
                  strokeDasharray={`${
                    (overallStats.averageSfiaProgress * 100) / 100
                  }, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-2xl font-light text-blue-600">
                    {Math.round(overallStats.averageSfiaProgress)}%
                  </span>
                  <div className="text-xs text-slate-500 font-medium">Average</div>
                </div>
              </div>
            </div>
            <h4 className="text-lg font-medium text-slate-800 mb-2">
              SFIA Framework
            </h4>
            <p className="text-sm text-slate-600 font-light">
              {overallStats.totalSfiaSkills} skills assessed
            </p>
            <div className="mt-4 bg-blue-50 rounded-xl p-3 border border-blue-100">
              <div className="text-sm font-medium text-blue-700">
                Professional Skills Development
              </div>
            </div>
          </div>

          {/* TPQI Overall (Combined Skills + Knowledge) */}
          <div className="text-center bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <div className="relative w-36 h-36 mx-auto mb-6">
              <svg
                className="w-36 h-36 transform -rotate-90"
                viewBox="0 0 36 36"
              >
                <path
                  className="text-slate-200"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  fill="transparent"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-500"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  fill="transparent"
                  strokeLinecap="round"
                  strokeDasharray={`${
                    (overallStats.averageTpqiSkillProgress +
                      overallStats.averageTpqiKnowledgeProgress) /
                    2
                  }, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-2xl font-light text-emerald-600">
                    {Math.round(
                      (overallStats.averageTpqiSkillProgress +
                        overallStats.averageTpqiKnowledgeProgress) /
                        2
                    )}%
                  </span>
                  <div className="text-xs text-slate-500 font-medium">Combined</div>
                </div>
              </div>
            </div>
            <h4 className="text-lg font-medium text-slate-800 mb-2">
              TPQI Framework
            </h4>
            <p className="text-sm text-slate-600 font-light">
              {overallStats.totalTpqiCareers} career paths
            </p>
            <div className="mt-4 bg-emerald-50 rounded-xl p-3 border border-emerald-100">
              <div className="text-sm font-medium text-emerald-700">
                Career Pathway Assessment
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SFIA Skills Detailed Chart */}
      {sfiaChartData.length > 0 && (
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl p-8 mb-8 border border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-medium text-slate-800">
              SFIA Skills Progress
            </h3>
            <div className="bg-white rounded-xl p-3 border border-slate-200">
              <FaChartBar className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="space-y-4">
            {sfiaChartData.map((skill) => (
              <div key={skill.code} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center space-x-6">
                  <div className="w-40 text-sm font-medium text-slate-800 truncate">
                    {skill.name}
                  </div>
                  <div className="flex-1 bg-slate-100 rounded-full h-3 relative shadow-inner">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full transition-all duration-700 shadow-sm"
                      style={{ width: `${Math.min(skill.progress, 100)}%` }}
                    ></div>
                    <span className="absolute right-3 top-0 text-xs text-slate-600 leading-3 font-medium">
                      {Math.round(skill.progress)}%
                    </span>
                  </div>
                  <div className="w-24 text-xs text-slate-600 text-right font-medium">{skill.level}</div>
                </div>
                <div className="mt-3 flex items-center space-x-3">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-200">
                    {skill.code}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TPQI Careers Detailed Chart */}
      {tpqiChartData.length > 0 && (
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl p-8 border border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-medium text-slate-800">
              TPQI Career Progress
            </h3>
            <div className="bg-white rounded-xl p-3 border border-slate-200">
              <FaChartBar className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
          <div className="space-y-6">
            {tpqiChartData.map((career, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="mb-4">
                  <h4 className="text-lg font-medium text-slate-800 mb-2">{career.name}</h4>
                  <span className="text-sm text-slate-600 font-light">{career.level}</span>
                </div>
                <div className="space-y-4">
                  {/* Skills Progress */}
                  <div className="flex items-center space-x-4">
                    <div className="w-20 text-sm font-medium text-slate-700">Skills</div>
                    <div className="flex-1 bg-slate-100 rounded-full h-3 relative shadow-inner">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-3 rounded-full transition-all duration-700 shadow-sm"
                        style={{ width: `${Math.min(career.skillProgress, 100)}%` }}
                      ></div>
                      <span className="absolute right-3 top-0 text-xs text-slate-600 leading-3 font-medium">
                        {Math.round(career.skillProgress)}%
                      </span>
                    </div>
                  </div>
                  {/* Knowledge Progress */}
                  <div className="flex items-center space-x-4">
                    <div className="w-20 text-sm font-medium text-slate-700">Knowledge</div>
                    <div className="flex-1 bg-slate-100 rounded-full h-3 relative shadow-inner">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-amber-400 h-3 rounded-full transition-all duration-700 shadow-sm"
                        style={{ width: `${Math.min(career.knowledgeProgress, 100)}%` }}
                      ></div>
                      <span className="absolute right-3 top-0 text-xs text-slate-600 leading-3 font-medium">
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
