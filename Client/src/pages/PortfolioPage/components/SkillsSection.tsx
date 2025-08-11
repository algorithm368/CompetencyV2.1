import React from 'react';
import { FaCog, FaChartBar, FaInfoCircle } from 'react-icons/fa';
import { SfiaSummary } from '@Types/portfolio';

interface SkillsSectionProps {
  sfiaSkills: SfiaSummary[];
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ sfiaSkills }) => {
  const getSkillLevelColor = (percentage: number | null) => {
    if (!percentage) return 'bg-gray-200';
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getSkillLevelText = (percentage: number | null) => {
    if (!percentage) return 'Not Started';
    if (percentage >= 80) return 'Expert';
    if (percentage >= 60) return 'Proficient';
    if (percentage >= 40) return 'Developing';
    return 'Beginner';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">SFIA Skills Framework</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <FaInfoCircle />
          <span>Skills for the Information Age (SFIA) Framework</span>
        </div>
      </div>

      {sfiaSkills.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <FaCog className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No SFIA Skills Data</h3>
          <p className="text-gray-500">Complete your skills assessment to see your SFIA competencies here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sfiaSkills.map((skillSummary) => (
            <div key={skillSummary.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {skillSummary.skill?.name || 'Unknown Skill'}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                      {skillSummary.skillCode}
                    </span>
                    <span>•</span>
                    <span>{skillSummary.level?.name || 'Unknown Level'}</span>
                  </div>
                  {skillSummary.skill?.overview && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {skillSummary.skill.overview}
                    </p>
                  )}
                </div>
                <div className="ml-4 text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {skillSummary.skillPercent ? Math.round(skillSummary.skillPercent) : 0}%
                  </div>
                  <div className="text-xs text-gray-500">
                    {getSkillLevelText(skillSummary.skillPercent)}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${getSkillLevelColor(skillSummary.skillPercent)}`}
                  style={{ width: `${Math.min(skillSummary.skillPercent || 0, 100)}%` }}
                ></div>
              </div>

              {/* Skill Category */}
              {skillSummary.skill?.category && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Category:</span>
                  <span className="font-medium text-gray-700">
                    {skillSummary.skill.category.name}
                  </span>
                </div>
              )}

              {/* Action Button */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button className="flex items-center space-x-2 text-teal-600 hover:text-teal-700 text-sm font-medium">
                  <FaChartBar className="h-4 w-4" />
                  <span>View Detailed Assessment</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {sfiaSkills.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">SFIA Skills Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{sfiaSkills.length}</div>
              <div className="text-sm text-blue-700">Total Skills</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(
                  sfiaSkills.reduce((sum, skill) => sum + (skill.skillPercent || 0), 0) / sfiaSkills.length
                )}%
              </div>
              <div className="text-sm text-green-700">Average Progress</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {sfiaSkills.filter(skill => (skill.skillPercent || 0) >= 80).length}
              </div>
              <div className="text-sm text-purple-700">Expert Level Skills</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsSection;
