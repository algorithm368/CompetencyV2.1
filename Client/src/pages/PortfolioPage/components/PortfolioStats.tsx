import React from 'react';
import { FaCog, FaGraduationCap, FaBrain, FaTools } from 'react-icons/fa';

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
      title: 'SFIA Skills',
      value: stats.totalSfiaSkills,
      progress: stats.averageSfiaProgress,
      icon: FaCog,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'TPQI Careers',
      value: stats.totalTpqiCareers,
      progress: (stats.averageTpqiSkillProgress + stats.averageTpqiKnowledgeProgress) / 2,
      icon: FaGraduationCap,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Skills Progress',
      value: `${Math.round(stats.averageTpqiSkillProgress)}%`,
      progress: stats.averageTpqiSkillProgress,
      icon: FaTools,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Knowledge Progress',
      value: `${Math.round(stats.averageTpqiKnowledgeProgress)}%`,
      progress: stats.averageTpqiKnowledgeProgress,
      icon: FaBrain,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Portfolio Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <div key={card.title} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.bgColor} rounded-lg p-3`}>
                  <IconComponent className={`h-6 w-6 ${card.textColor}`} />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  <p className="text-sm text-gray-500">{card.title}</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`${card.color} h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${Math.min(card.progress, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {Math.round(card.progress)}% Complete
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PortfolioStats;
