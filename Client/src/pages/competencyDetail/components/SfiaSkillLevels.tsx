import React, { useState, useMemo } from "react";
import { FaGraduationCap, FaCheckCircle } from "react-icons/fa";
import UrlInputBox from "./UrlInputBox";

interface SfiaSubSkill {
  id: number;
  subskill_text: string | null;
}

interface SfiaDescription {
  id: number;
  description_text: string | null;
  subskills: SfiaSubSkill[];
}

interface SfiaLevel {
  id: number;
  level_name: string | null;
  descriptions: SfiaDescription[];
}

interface SfiaSectionProps {
  levels: SfiaLevel[];
}

interface SubSkillItemProps {
  subskill: SfiaSubSkill;
  url: string;
  submitted: boolean;
  onUrlChange: (value: string) => void;
  onRemove: () => void;
  onSubmit: () => void;
}

const SubSkillItem: React.FC<SubSkillItemProps> = ({ 
  subskill, 
  url, 
  submitted, 
  onUrlChange, 
  onRemove, 
  onSubmit 
}) => (
  <li className="flex flex-col gap-1">
    <div className="flex items-start">
      <FaCheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
      <span className="text-gray-700">{subskill.subskill_text}</span>
    </div>
    <div className="flex-1 min-w-0">
      <UrlInputBox
        url={url}
        onChange={onUrlChange}
        onRemove={onRemove}
        onSubmit={onSubmit}
        placeholder="Enter URL to submit evidence for this skill"
        colorClass="border-blue-300"
      />
      {submitted && (
        <span className="text-blue-600 text-sm mt-1 block">Submitted!</span>
      )}
    </div>
  </li>
);

const SfiaSection: React.FC<SfiaSectionProps> = ({ levels }) => {
  const [urls, setUrls] = useState<{ [id: string]: string }>({});
  const [submitted, setSubmitted] = useState<{ [id: string]: boolean }>({});

  // Helper function to check if a description has meaningful content
  const hasValidContent = (desc: SfiaDescription): boolean => {
    const hasDescriptionText = desc.description_text?.trim();
    const hasSubSkills = desc.subskills?.some(subskill => subskill.subskill_text?.trim());
    return !!(hasDescriptionText || hasSubSkills);
  };

  // Filter out levels that have no meaningful content
  const filteredLevels = useMemo(() => {
    return levels.filter(level => {
      // Must have descriptions array
      if (!level.descriptions?.length) {
        return false;
      }
      
      // Check if any description has meaningful content
      const hasValidDescriptions = level.descriptions.some(hasValidContent);
      
      // Only show levels that have valid descriptions
      return hasValidDescriptions;
    });
  }, [levels]);

  // Create callback functions to avoid deep nesting
  const createSubSkillCallbacks = useMemo(() => {
    return (subSkillId: number) => ({
      onUrlChange: (value: string) => handleUrlChange(subSkillId, value),
      onRemove: () => handleRemove(subSkillId),
      onSubmit: () => handleSubmit(subSkillId)
    });
  }, []);

  const handleUrlChange = (id: number, value: string) => {
    setUrls((prev) => ({ ...prev, [id.toString()]: value }));
  };
  
  const handleRemove = (id: number) => {
    setUrls((prev) => ({ ...prev, [id.toString()]: "" }));
    setSubmitted((prev) => ({ ...prev, [id.toString()]: false }));
  };
  
  const handleSubmit = (id: number) => {
    setSubmitted((prev) => ({ ...prev, [id.toString()]: true }));
    // You can add API call here
  };

  // Don't render the section if no levels have content
  if (filteredLevels.length === 0) {
    return (
      <section className="relative bg-gradient-to-b from-blue-50 via-white to-blue-25 backdrop-blur-xl rounded-3xl p-8 border border-blue-100 shadow-1xl overflow-hidden">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <FaGraduationCap className="w-6 h-6 mr-3 text-blue-600" />
          Skill Levels
        </h2>
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No skill level information available for this competency.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-gradient-to-b from-blue-50 via-white to-blue-25 backdrop-blur-xl rounded-3xl p-8 border border-blue-100 shadow-1xl overflow-hidden">
      {/* Decorative blurred shapes */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-20 pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20 pointer-events-none"></div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <FaGraduationCap className="w-6 h-6 mr-3 text-blue-600" />
        Skill Levels
      </h2>
      <div className="flex flex-col gap-6">
        {filteredLevels.map((level, index) => {
          // Filter descriptions that have content
          const filteredDescriptions = level.descriptions.filter(hasValidContent);

          // Don't render the level if no valid descriptions remain after filtering
          if (filteredDescriptions.length === 0) {
            return null;
          }

          // Count total subskills for this level
          const totalSubskills = filteredDescriptions.reduce((count, desc) => {
            return count + (desc.subskills?.filter(subskill => subskill.subskill_text?.trim()).length || 0);
          }, 0);

          return (
            <div key={level.id} className="mb-8">
              <div className="flex flex-col p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-blue-200 gap-2 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                {/* Decorative dot */}
                <div className="absolute top-2 right-4 w-2 h-2 bg-blue-400 rounded-full opacity-20"></div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center justify-between">
                  <span>{level.level_name ? `Level ${level.level_name}` : `Level ${index + 1}`}</span>
                  {totalSubskills > 0 && (
                    <span className="text-sm font-normal text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                      {totalSubskills} subskill{totalSubskills !== 1 ? 's' : ''}
                    </span>
                  )}
                </h3>
                {filteredDescriptions.map((desc) => (
                  <div key={desc.id} className="mb-4">
                    {desc.description_text?.trim() && (
                      <p className="text-gray-700 mb-3">{desc.description_text}</p>
                    )}
                    {desc.subskills && desc.subskills.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">SubSkills:</h4>
                        <ul className="space-y-4">
                          {desc.subskills
                            .filter(subskill => subskill.subskill_text?.trim())
                            .map((subskill) => {
                              const callbacks = createSubSkillCallbacks(subskill.id);
                              return (
                                <SubSkillItem 
                                  key={subskill.id}
                                  subskill={subskill}
                                  url={urls[subskill.id.toString()] || ''}
                                  submitted={submitted[subskill.id.toString()] || false}
                                  onUrlChange={callbacks.onUrlChange}
                                  onRemove={callbacks.onRemove}
                                  onSubmit={callbacks.onSubmit}
                                />
                              );
                            })}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SfiaSection;
