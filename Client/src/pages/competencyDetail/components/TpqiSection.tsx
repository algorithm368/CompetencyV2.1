import React from "react";
import { TpqiSkills, TpqiKnowledge, TpqiOccupational } from "./TpqiSections";
import { OverviewSection, NotesSection } from "./OverviewAndNotes";

interface TpqiSectionProps {
  competency: {
    competency_id: string;
    competency_name: string | null;
    overall: string | null;
    note: string | null;
    occupational: Array<{
      id: number;
      name_occupational: string;
    }>;
    sector: Array<{
      id: number;
      name_sector: string;
    }>;
    skills: Array<{
      id: number;
      name_skill: string;
    }>;
    knowledge: Array<{
      id: number;
      name_knowledge: string;
    }>;
  };
}

const TpqiSection: React.FC<TpqiSectionProps> = ({ competency }) => {
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
      {convertedSkills.length > 0 && <TpqiSkills skills={convertedSkills} />}
      {convertedKnowledge.length > 0 && <TpqiKnowledge knowledge={convertedKnowledge} />}
      {convertedOccupational.length > 0 && <TpqiOccupational occupational={convertedOccupational} />}
    </>
  );
};

export default TpqiSection;
