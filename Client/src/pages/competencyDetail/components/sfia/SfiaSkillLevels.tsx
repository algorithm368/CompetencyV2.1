import React, { useMemo } from "react";
import { FaGraduationCap } from "react-icons/fa";
import { useSfiaEvidence } from "../../hooks/useSfiaEvidence";
import { SfiaLevel } from "../../types/sfia";
import {
  filterValidLevels,
  hasValidContent,
  countSubskills,
} from "../../utils/sfiaUtils";
import SubSkillItem from "./sfiaSubSkillItem";

interface SfiaSkillLevelsProps {
  levels: SfiaLevel[];
}

/**
 * ## Props
 * @param {SfiaLevel[]} levels - Array of SFIA skill levels to display.
 * ## Usage
 * <SfiaSkillLevels levels={skillLevels} />
 */
const SfiaSkillLevels: React.FC<SfiaSkillLevelsProps> = ({ levels }) => {
  // Use custom hook to manage evidence state for sub-skills
  const { evidenceState, handleUrlChange, handleRemove, handleSubmit } =
    useSfiaEvidence();

  // Filter out levels that do not have valid descriptions or subskills
  const filteredLevels = useMemo(() => filterValidLevels(levels), [levels]);

  // Early return for empty state
  if (filteredLevels.length === 0) {
    return <EmptySkillLevelsSection />;
  }

  return (
    <section className="relative bg-gradient-to-b from-blue-50 via-white to-blue-25 backdrop-blur-xl rounded-3xl p-8 border border-blue-100 shadow-lg overflow-hidden">
      <DecorativeBackground />
      <SectionHeader />
      <SkillLevelsList
        filteredLevels={filteredLevels}
        evidenceState={evidenceState}
        onUrlChange={handleUrlChange}
        onRemove={handleRemove}
        onSubmit={handleSubmit}
      />
    </section>
  );
};

// Empty state component - matches OverviewAndNotes section styling
const EmptySkillLevelsSection = () => (
  <section className="relative bg-gradient-to-b from-blue-50 via-white to-blue-25 backdrop-blur-xl rounded-3xl p-8 border border-blue-100 shadow-lg overflow-hidden">
    <SectionHeader />
    <div className="text-center py-8">
      <p className="text-gray-500 text-lg">
        No skill level information available for this competency.
      </p>
    </div>
  </section>
);

// Section header component - matches OverviewAndNotes pattern
const SectionHeader = () => (
  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
    <FaGraduationCap className="w-6 h-6 mr-3 text-blue-600" />
    Skill Levels
  </h2>
);

// Decorative background elements
const DecorativeBackground = () => (
  <>
    <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-20 pointer-events-none" />
    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20 pointer-events-none" />
  </>
);

// Skills levels list component
interface SkillLevelsListProps {
  filteredLevels: SfiaLevel[];
  evidenceState: unknown;
  onUrlChange: (id: number, value: string) => void;
  onRemove: (id: number) => void;
  onSubmit: (id: number) => void;
}

const SkillLevelsList: React.FC<SkillLevelsListProps> = ({
  filteredLevels,
  evidenceState,
  onUrlChange,
  onRemove,
  onSubmit,
}) => (
  <div className="flex flex-col gap-6">
    {filteredLevels.map((level, index) => (
      <SkillLevel
        key={level.id}
        level={level}
        index={index}
        evidenceState={evidenceState}
        onUrlChange={onUrlChange}
        onRemove={onRemove}
        onSubmit={onSubmit}
      />
    ))}
  </div>
);

// Individual skill level component
interface SkillLevelProps {
  level: SfiaLevel;
  index: number;
  evidenceState: unknown;
  onUrlChange: (id: number, value: string) => void;
  onRemove: (id: number) => void;
  onSubmit: (id: number) => void;
}

const SkillLevel: React.FC<SkillLevelProps> = ({
  level,
  index,
  evidenceState,
  onUrlChange,
  onRemove,
  onSubmit,
}) => {
  const filteredDescriptions = level.descriptions.filter(hasValidContent);

  if (filteredDescriptions.length === 0) return null;

  const totalSubskills = countSubskills(filteredDescriptions);
  const levelName = level.level_name
    ? `Level ${level.level_name}`
    : `Level ${index + 1}`;

  return (
    <div className="mb-8">
      <div className="flex flex-col p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-blue-200 gap-2 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden">
      
        <SkillLevelHeader
          levelName={levelName}
          totalSubskills={totalSubskills}
        />

        <DescriptionsList
          descriptions={filteredDescriptions}
          evidenceState={evidenceState}
          onUrlChange={onUrlChange}
          onRemove={onRemove}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
};

// Skill level header
interface SkillLevelHeaderProps {
  levelName: string;
  totalSubskills: number;
}

const SkillLevelHeader: React.FC<SkillLevelHeaderProps> = ({
  levelName,
  totalSubskills,
}) => (
  <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center justify-between">
    <span>{levelName}</span>
    {totalSubskills > 0 && (
      <span className="text-sm font-normal text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
        {totalSubskills} subskill{totalSubskills !== 1 ? "s" : ""}
      </span>
    )}
  </h3>
);

// Descriptions list component
interface DescriptionsListProps {
  descriptions: unknown[];
  evidenceState: unknown;
  onUrlChange: (id: number, value: string) => void;
  onRemove: (id: number) => void;
  onSubmit: (id: number) => void;
}

const DescriptionsList: React.FC<DescriptionsListProps> = ({
  descriptions,
  evidenceState,
  onUrlChange,
  onRemove,
  onSubmit,
}) => (
  <>
    {descriptions.map((desc) => (
      <div key={desc.id} className="mb-4">
        {desc.description_text?.trim() && (
          <p className="text-gray-700 leading-relaxed mb-3">
            {desc.description_text}
          </p>
        )}

        {desc.subskills && desc.subskills.length > 0 && (
          <SubSkillsSection
            subskills={desc.subskills}
            evidenceState={evidenceState}
            onUrlChange={onUrlChange}
            onRemove={onRemove}
            onSubmit={onSubmit}
          />
        )}
      </div>
    ))}
  </>
);

// Subskills section
interface SubSkillsSectionProps {
  subskills: unknown[];
  evidenceState: unknown;
  onUrlChange: (id: number, value: string) => void;
  onRemove: (id: number) => void;
  onSubmit: (id: number) => void;
}

const SubSkillsSection: React.FC<SubSkillsSectionProps> = ({
  subskills,
  evidenceState,
  onUrlChange,
  onRemove,
  onSubmit,
}) => (
  <div>
    <h4 className="font-medium text-gray-800 mb-2">SubSkills:</h4>
    <ul className="space-y-4">
      {subskills
        .filter((subskill) => subskill.subskill_text?.trim())
        .map((subskill) => {
          const idStr = subskill.id.toString();

          return (
            <SubSkillItem
              key={subskill.id}
              subskill={subskill}
              url={evidenceState.urls[idStr] || ""}
              submitted={evidenceState.submitted[idStr] || false}
              loading={evidenceState.loading[idStr] || false}
              error={evidenceState.errors[idStr] || ""}
              onUrlChange={(value: string) => onUrlChange(subskill.id, value)}
              onRemove={() => onRemove(subskill.id)}
              onSubmit={() => onSubmit(subskill.id)}
            />
          );
        })}
    </ul>
  </div>
);

export default SfiaSkillLevels;
