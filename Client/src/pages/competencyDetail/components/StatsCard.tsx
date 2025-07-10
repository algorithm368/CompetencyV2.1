import React from "react";

interface StatsCardProps {
  source: string;
  competencyData: any;
}

const StatsCard: React.FC<StatsCardProps> = ({ source, competencyData }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-teal-200 shadow-lg min-w-64">
    <h3 className="font-semibold text-gray-800 mb-4">Overview</h3>
    <div className="space-y-3">
      {source === 'sfia' && 'totalLevels' in competencyData && (
        <>
          <div className="flex justify-between">
            <span className="text-gray-600">Levels:</span>
            <span className="font-medium text-blue-600">{competencyData.totalLevels}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Skills:</span>
            <span className="font-medium text-blue-600">{competencyData.totalSkills}</span>
          </div>
        </>
      )}
      {source === 'tpqi' && 'totalOccupational' in competencyData && (
        <>
          <div className="flex justify-between">
            <span className="text-gray-600">Skills:</span>
            <span className="font-medium text-green-600">{competencyData.totalSkills}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Knowledge:</span>
            <span className="font-medium text-green-600">{competencyData.totalKnowledge}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Occupational:</span>
            <span className="font-medium text-green-600">{competencyData.totalOccupational}</span>
          </div>
        </>
      )}
    </div>
  </div>
);

export default StatsCard;
