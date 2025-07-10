import React from "react";
import { TpqiSkills, TpqiKnowledge, TpqiOccupational } from "./TpqiSections";
import { OverviewSection, NotesSection } from "./OverviewAndNotes";

interface TpqiSectionProps {
  competency: {
    overall?: string;
    note?: string;
    skills?: Array<{ id: string; name_skill: string }>;
    knowledge?: Array<{ id: string; name_knowledge: string }>;
    occupational?: Array<{ id: string; name_occupational: string }>;
  };
}

const TpqiSection: React.FC<TpqiSectionProps> = ({ competency }) => {
  return (
    <>
      <OverviewSection overall={competency?.overall} />
      <NotesSection note={competency?.note} />
      {competency?.skills && <TpqiSkills skills={competency.skills} />}
      {competency?.knowledge && <TpqiKnowledge knowledge={competency.knowledge} />}
      {competency?.occupational && <TpqiOccupational occupational={competency.occupational} />}
    </>
  );
};

export default TpqiSection;
