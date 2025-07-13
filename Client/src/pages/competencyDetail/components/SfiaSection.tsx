import React from "react";
import SfiaSkillLevels from "./SfiaSkillLevels";
import { OverviewSection, NotesSection } from "./OverviewAndNotes";

// Match the actual API structure
interface SfiaLevel {
  id: number;
  level_name: string | null;
  descriptions: Array<{
    id: number;
    description_text: string | null;
    subskills: Array<{
      id: number;
      subskill_text: string | null;
    }>;
  }>;
}

interface SfiaSectionProps {
  competency: {
    competency_id: string;
    competency_name: string | null;
    overall: string | null;
    note: string | null;
    category: {
      id: number;
      category_text: string | null;
    } | null;
    levels: SfiaLevel[];
  };
}

const SfiaSection: React.FC<SfiaSectionProps> = ({ competency }) => {
  console.log("SfiaSection competency:", competency);
  return (
    <>
      <OverviewSection overall={competency?.overall} />
      <NotesSection note={competency?.note} />
      {competency?.levels && competency.levels.length > 0 && <SfiaSkillLevels levels={competency.levels} />}

    </>
  );
};

export default SfiaSection;
