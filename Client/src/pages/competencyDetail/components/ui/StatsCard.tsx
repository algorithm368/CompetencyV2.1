import React from "react";

// Type definitions for better code organization
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
  // Helper functions for calculating subskills
  const countDescriptionSubskills = (description: SfiaDescription): number => {
    if (!description.subskills) return 0;

    return description.subskills.filter((subskill) =>
      subskill.subskill_text?.trim()
    ).length;
  };

  const countLevelSubskills = (level: SfiaLevel): number => {
    if (!level.descriptions) return 0;

    return level.descriptions.reduce(
      (sum, desc) => sum + countDescriptionSubskills(desc),
      0
    );
  };

  // Calculate total subskills based on source type
  const calculateTotalSubskills = (): number => {
    if (source !== "sfia" || !competencyData?.competency?.levels) {
      return competencyData?.totalSkills || 0;
    }

    return competencyData.competency.levels.reduce(
      (total, level) => total + countLevelSubskills(level),
      0
    );
  };

  const totalSubskills = calculateTotalSubskills();

  // Render SFIA stats
  const renderSfiaStats = () => {
    if (source !== "sfia" || !("totalLevels" in competencyData)) return null;

    return (
      <>
        <StatRow
          label="Levels"
          value={competencyData.totalLevels}
          colorClass="text-blue-600"
        />
        <StatRow
          label="Subskills"
          value={totalSubskills}
          colorClass="text-blue-600"
        />
      </>
    );
  };

  // Render TPQI stats
  const renderTpqiStats = () => {
    if (source !== "tpqi" || !("totalOccupational" in competencyData))
      return null;

    return (
      <>
        <StatRow
          label="Skills"
          value={totalSubskills}
          colorClass="text-green-600"
        />
        <StatRow
          label="Knowledge"
          value={competencyData.totalKnowledge}
          colorClass="text-green-600"
        />
        <StatRow
          label="Occupational"
          value={competencyData.totalOccupational}
          colorClass="text-green-600"
        />
      </>
    );
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 min-w-64 shadow-sm hover:shadow-md transition-shadow duration-200">
      <h3 className="font-semibold text-gray-800 mb-4 text-lg">📊 Overview</h3>

      <div className="space-y-4">
        {renderSfiaStats()}
        {renderTpqiStats()}

        {/* Show a friendly message when no data is available */}
        {!renderSfiaStats() && !renderTpqiStats() && (
          <div className="text-gray-500 text-center py-4">
            <span className="text-2xl">🔍</span>
            <p className="mt-2">No statistics available</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable component for stat rows
interface StatRowProps {
  label: string;
  value?: number;
  colorClass: string;
}

const StatRow: React.FC<StatRowProps> = ({ label, value = 0, colorClass }) => (
  <div className="flex justify-between items-center py-1">
    <span className="text-gray-600 font-medium">{label}:</span>
    <span className={`font-semibold ${colorClass} text-lg`}>
      {value.toLocaleString()}
    </span>
  </div>
);

export default StatsCard;
