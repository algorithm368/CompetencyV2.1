import React from "react";
import {
  FaCog,
  FaGraduationCap,
  FaChartBar,
} from "react-icons/fa";

interface OverallStats {
  totalSfiaSkills: number;
  totalTpqiCareers: number;
  averageSfiaProgress: number;
  averageTpqiSkillProgress: number;
  averageTpqiKnowledgeProgress: number;
}

interface PortfolioStatsProps {
  stats: OverallStats;
}

const PortfolioStats: React.FC<PortfolioStatsProps> = ({ stats }) => {
  const statCards = [
    {
      title: "SFIA Skills Assessment",
      value: stats.totalSfiaSkills,
      progress: stats.averageSfiaProgress,
      icon: FaCog,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      textColor: "text-blue-700",
      borderColor: "border-blue-200",
    },
    {
      title: "TPQI Career Paths",
      value: stats.totalTpqiCareers,
      progress:
        (stats.averageTpqiSkillProgress + stats.averageTpqiKnowledgeProgress) /
        2,
      icon: FaGraduationCap,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "from-emerald-50 to-emerald-100",
      textColor: "text-emerald-700",
      borderColor: "border-emerald-200",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 border border-slate-200">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-light text-slate-800 mb-2">
            Portfolio Overview
          </h2>
          <p className="text-slate-600 font-light">
            Comprehensive view of your professional competencies
          </p>
        </div>
        <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl p-3 shadow-sm">
          <FaChartBar className="h-6 w-6 text-slate-600" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {statCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <div
              key={card.title}
              className={`bg-gradient-to-br ${card.bgColor} rounded-2xl p-6 border ${card.borderColor} hover:shadow-md transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`bg-gradient-to-br ${card.color} rounded-xl p-3 shadow-sm`}
                >
                  <IconComponent className="h-5 w-5 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-light text-slate-800 mb-1">
                    {card.value}
                  </p>
                  <p className="text-xs text-slate-600 font-medium">
                    {card.title}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="w-full bg-white/60 rounded-full h-2 shadow-inner">
                  <div
                    className={`bg-gradient-to-r ${card.color} h-2 rounded-full transition-all duration-700 shadow-sm`}
                    style={{ width: `${Math.min(card.progress, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-medium ${card.textColor}`}>
                    {Math.round(card.progress)}% Complete
                  </span>
                  <span className="text-xs text-slate-500 font-light">
                    Professional Level
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PortfolioStats;
