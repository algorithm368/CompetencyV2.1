import React from "react";

interface SfiaSubSkill {
  id: number;
  subskill_text: string | null;
}

interface SfiaDescription {
  id: number;
  description_text: string | null;
  subskills: SfiaSubSkill[];
}

interface SfiaLevel {
  id: number;
  level_name: string | null;
  descriptions: SfiaDescription[];
}

interface SfiaCompetency {
  competency_id: string;
  competency_name: string | null;
  overall: string | null;
  note: string | null;
  category: {
    id: number;
    category_text: string | null;
  } | null;
  levels: SfiaLevel[];
}

interface CompetencyData {
  competency?: SfiaCompetency;
  totalLevels?: number;
  totalSkills?: number;
  totalKnowledge?: number;
  totalOccupational?: number;
}

interface StatsCardProps {
  source: string;
  competencyData: CompetencyData;
}

const StatsCard: React.FC<StatsCardProps> = ({ source, competencyData }) => {
  // Helper function to count subskills in a description
  const countDescriptionSubskills = (description: SfiaDescription): number => {
    return description.subskills?.filter(subskill => subskill.subskill_text?.trim()).length || 0;
  };

  // Helper function to count subskills in a level
  const countLevelSubskills = (level: SfiaLevel): number => {
    return level.descriptions?.reduce((sum, desc) => sum + countDescriptionSubskills(desc), 0) || 0;
  };

  // Calculate total subskills for SFIA competency
  const calculateTotalSubskills = (): number => {
    if (source !== 'sfia' || !competencyData?.competency?.levels) {
      return competencyData?.totalSkills || 0;
    }
    
    return competencyData.competency.levels.reduce((total, level) => total + countLevelSubskills(level), 0);
  };

  const totalSubskills = calculateTotalSubskills();

  return (
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
            <span className="text-gray-600">Subskills:</span>
            <span className="font-medium text-blue-600">{totalSubskills}</span>
          </div>
        </>
      )}
      {source === 'tpqi' && 'totalOccupational' in competencyData && (
        <>
          <div className="flex justify-between">
            <span className="text-gray-600">Skills:</span>
            <span className="font-medium text-green-600">{totalSubskills}</span>
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
    </div>    </div>
  );
};

export default StatsCard;
