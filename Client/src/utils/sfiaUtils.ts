// utils/sfiaUtils.ts
import { SfiaLevel, SfiaDescription } from "../pages/competencyDetail/types/sfia";

export const hasValidContent = (desc: SfiaDescription): boolean => {
  const hasDescriptionText = desc.description_text?.trim();
  const hasSubSkills = desc.subskills?.some((subskill) =>
    subskill.subskill_text?.trim()
  );
  return !!(hasDescriptionText || hasSubSkills);
};

export const filterValidLevels = (levels: SfiaLevel[]): SfiaLevel[] => {
  return levels.filter((level) => {
    if (!level.descriptions?.length) {
      return false;
    }
    const hasValidDescriptions = level.descriptions.some(hasValidContent);
    return hasValidDescriptions;
  });
};

export const countSubskills = (descriptions: SfiaDescription[]): number => {
  return descriptions.reduce((count, desc) => {
    return (
      count +
      (desc.subskills?.filter((subskill) => subskill.subskill_text?.trim())
        .length || 0)
    );
  }, 0);
};
