import React, { useMemo } from "react";
import { TpqiBaseSection } from "../common/TpqiBaseSection";
import { TpqiItemCard } from "../common/TpqiItemCard";
import { COLOR_SCHEMES } from "../constants/colorSchemes";
import type { TpqiSkillsProps } from "../types";

export const TpqiSkillsSection: React.FC<TpqiSkillsProps> = ({ skills, overall }) => {
  const filteredSkills = useMemo(() => {
    return skills?.filter(skill => skill.name_skill?.trim()) || [];
  }, [skills]);

  const handleSkillSubmit = (id: string) => {
    // Add API call here
    console.log(`Submitting skill evidence for ID: ${id}`);
  };

  if (filteredSkills.length === 0) return null;

  return (
    <TpqiBaseSection
      title="Skills"
      overall={overall}
      colorScheme={COLOR_SCHEMES.skills}
    >
      <div className="flex flex-col gap-4">
        {filteredSkills.map((skill) => (
          <TpqiItemCard
            key={skill.id}
            id={skill.id}
            name={skill.name_skill}
            placeholder="Enter URL to submit evidence for this skill"
            colorScheme={{
              accent: COLOR_SCHEMES.skills.itemAccent,
              border: COLOR_SCHEMES.skills.itemBorder,
              shadow: COLOR_SCHEMES.skills.itemShadow,
              decorativeDot: COLOR_SCHEMES.skills.itemDecorativeDot,
              text: COLOR_SCHEMES.skills.itemText,
              borderClass: COLOR_SCHEMES.skills.itemBorderClass,
            }}
            onSubmit={handleSkillSubmit}
          />
        ))}
      </div>
    </TpqiBaseSection>
  );
};
