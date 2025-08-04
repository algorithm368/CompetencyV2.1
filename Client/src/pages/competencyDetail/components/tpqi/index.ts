// Main container
export { default as TpqiContainer } from './TpqiContainer';

// Individual section components
export { TpqiSkillsSection } from './sections/TpqiSkillsSection';
export { TpqiKnowledgeSection } from './sections/TpqiKnowledgeSection';
export { TpqiOccupationalSection } from './sections/TpqiOccupationalSection';

// Common reusable components
export { TpqiBaseSection } from './common/TpqiBaseSection';
export { TpqiItemCard } from './common/TpqiItemCard';
export { TpqiOccupationalCard } from './common/TpqiOccupationalCard';

// Constants and types
export { COLOR_SCHEMES } from './constants/colorSchemes';
export type * from './types';

// Legacy exports for backward compatibility (deprecated)
export { TpqiSkillsSection as TpqiSkills } from './sections/TpqiSkillsSection';
export { TpqiKnowledgeSection as TpqiKnowledge } from './sections/TpqiKnowledgeSection';
export { TpqiOccupationalSection as TpqiOccupational } from './sections/TpqiOccupationalSection';
