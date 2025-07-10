import React from "react";
import SfiaSkillLevels from "./SfiaSkillLevels";
import { OverviewSection, NotesSection } from "./OverviewAndNotes";

interface SfiaLevel {
  id: string;
  level_name: string;
  descriptions?: Array<{
    id: string;
    description_text?: string;
    skills?: Array<{
      id: string;
      skill_text: string;
    }>;
  }>;
}

interface SfiaSectionProps {
  competency: {
    overall?: string;
    note?: string;
    levels?: SfiaLevel[];
  };
}

const SfiaSection: React.FC<SfiaSectionProps> = ({ competency }) => {
  return (
    <>
      <OverviewSection overall={competency?.overall} />
      <NotesSection note={competency?.note} />
      {competency?.levels && <SfiaSkillLevels levels={competency.levels} />}
    </>
  );
};

export default SfiaSection;
