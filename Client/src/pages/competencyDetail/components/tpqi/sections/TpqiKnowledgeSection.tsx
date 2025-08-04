import React, { useMemo } from "react";
import { TpqiBaseSection } from "../common/TpqiBaseSection";
import { TpqiItemCard } from "../common/TpqiItemCard";
import { COLOR_SCHEMES } from "../constants/colorSchemes";
import type { TpqiKnowledgeProps } from "../types";

export const TpqiKnowledgeSection: React.FC<TpqiKnowledgeProps> = ({ knowledge, overall }) => {
  const filteredKnowledge = useMemo(() => {
    return knowledge?.filter(k => k.name_knowledge?.trim()) || [];
  }, [knowledge]);

  const handleKnowledgeSubmit = (id: string) => {
    // Add API call here
    console.log(`Submitting knowledge evidence for ID: ${id}`);
  };

  if (filteredKnowledge.length === 0) return null;

  return (
    <TpqiBaseSection
      title="Knowledge Areas"
      overall={overall}
      colorScheme={COLOR_SCHEMES.knowledge}
    >
      <div className="flex flex-col gap-4">
        {filteredKnowledge.map((k) => (
          <TpqiItemCard
            key={k.id}
            id={k.id}
            name={k.name_knowledge}
            placeholder="Enter URL to submit evidence for this knowledge area"
            colorScheme={{
              accent: COLOR_SCHEMES.knowledge.itemAccent,
              border: COLOR_SCHEMES.knowledge.itemBorder,
              shadow: COLOR_SCHEMES.knowledge.itemShadow,
              decorativeDot: COLOR_SCHEMES.knowledge.itemDecorativeDot,
              text: COLOR_SCHEMES.knowledge.itemText,
              borderClass: COLOR_SCHEMES.knowledge.itemBorderClass,
            }}
            onSubmit={handleKnowledgeSubmit}
          />
        ))}
      </div>
    </TpqiBaseSection>
  );
};
