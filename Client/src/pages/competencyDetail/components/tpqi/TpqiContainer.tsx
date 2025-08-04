import React from "react";
import { TpqiSkillsSection } from "./sections/TpqiSkillsSection";
import { TpqiKnowledgeSection } from "./sections/TpqiKnowledgeSection";
import { TpqiOccupationalSection } from "./sections/TpqiOccupationalSection";
import { OverviewSection, NotesSection } from "../ui/OverviewAndNotes";
import type { TpqiCompetency } from "./types";

interface TpqiContainerProps {
  competency: TpqiCompetency;
}

// TpqiSection component
/**
 * Renders the TPQI section of a competency detail page.
 * Displays an overview, notes, and various TPQI sections like skills, knowledge, and occupational items.
 *
 * @param {TpqiSectionProps} props - The props for the component.
 * @returns {JSX.Element} The rendered component.
 */
const TpqiContainer: React.FC<TpqiContainerProps> = ({ competency }) => {
  // Convert the API structure to what the components expect
  const convertedSkills = competency?.skills?.map(skill => ({
    id: skill.id.toString(),
    name_skill: skill.name_skill
  })) || [];

  const convertedKnowledge = competency?.knowledge?.map(knowledge => ({
    id: knowledge.id.toString(),
    name_knowledge: knowledge.name_knowledge
  })) || [];

  const convertedOccupational = competency?.occupational?.map(occ => ({
    id: occ.id.toString(),
    name_occupational: occ.name_occupational
  })) || [];

  return (
    <>
      <OverviewSection overall={competency?.overall} />
      <NotesSection note={competency?.note} />
      {convertedSkills.length > 0 && <TpqiSkillsSection skills={convertedSkills} />}
      {convertedKnowledge.length > 0 && <TpqiKnowledgeSection knowledge={convertedKnowledge} />}
      {convertedOccupational.length > 0 && <TpqiOccupationalSection occupational={convertedOccupational} />}
    </>
  );
};

export default TpqiContainer;
