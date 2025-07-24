import React from "react";
import SfiaSkillLevels from "./SfiaSkillLevels";
import { OverviewSection, NotesSection } from "../ui/OverviewAndNotes";
import { SfiaLevel, SfiaCompetency } from "../../types/sfia";

interface SfiaSectionProps {
  competency: SfiaCompetency;
}

/**
 * SfiaSection Component
 *
 * Main container for displaying SFIA competency information including:
 * - Overview section with general description
 * - Notes section with additional information
 * - Skill levels with interactive evidence submission
 */
const SfiaSection: React.FC<SfiaSectionProps> = ({ competency }) => {
  const { overall, note, levels } = competency || {};

  const hasSkillLevels = levels && levels.length > 0;

  return (
    <div className="sfia-section space-y-6">
      <CompetencyOverview overall={overall} />
      <CompetencyNotes note={note} />
      {hasSkillLevels && <CompetencySkillLevels levels={levels} />}
    </div>
  );
};

/**
 * Competency Overview Component
 * Displays the general description/overview of the competency
 */
const CompetencyOverview: React.FC<{ overall?: string | null }> = ({
  overall,
}) => {
  if (!overall) return null;

  return <OverviewSection overall={overall} />;
};

/**
 * Competency Notes Component
 * Displays additional notes about the competency
 */
const CompetencyNotes: React.FC<{ note?: string | null }> = ({ note }) => {
  if (!note) return null;

  return <NotesSection note={note} />;
};

/**
 * Competency Skill Levels Component
 * Displays the interactive skill levels with evidence submission
 */
const CompetencySkillLevels: React.FC<{ levels: SfiaLevel[] }> = ({
  levels,
}) => {
  return <SfiaSkillLevels levels={levels} />;
};

export default SfiaSection;
