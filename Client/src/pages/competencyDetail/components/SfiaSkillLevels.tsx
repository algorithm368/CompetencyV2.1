import React, { useState, KeyboardEvent } from "react";
import { FaGraduationCap, FaCheckCircle } from "react-icons/fa";
import UrlInputBox from "./UrlInputBox";

interface SfiaSkill {
  id: string;
  skill_text: string;
}

interface SfiaDescription {
  id: string;
  description_text?: string;
  skills?: SfiaSkill[];
}

interface SfiaLevel {
  id: string;
  level_name: string;
  descriptions?: SfiaDescription[];
}

interface SfiaSectionProps {
  levels: SfiaLevel[];
}

const SfiaSection: React.FC<SfiaSectionProps> = ({ levels }) => {
  const [urls, setUrls] = useState<{ [id: string]: string }>({});
  const [submitted, setSubmitted] = useState<{ [id: string]: boolean }>({});
  const [activeLevel, setActiveLevel] = useState<string | null>(null);

  const handleUrlChange = (id: string, value: string) => {
    setUrls((prev) => ({ ...prev, [id]: value }));
  };

  const handleRemove = (id: string) => {
    setUrls((prev) => ({ ...prev, [id]: "" }));
    setSubmitted((prev) => ({ ...prev, [id]: false }));
  };

  const handleSubmit = (id: string) => {
    setSubmitted((prev) => ({ ...prev, [id]: true }));
    // You can add API call here
  };

  const handleLevelFocus = (id: string) => {
    setActiveLevel(id);
  };

  const handleLevelBlur = () => {
    setActiveLevel(null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleLevelFocus(id);
    }
  };

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
        {levels.map((level, index) => (
          <div key={level.id} className="mb-8">
            <div className="flex flex-col p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-blue-200 gap-2 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              {/* Decorative dot */}
              <div className="absolute top-2 right-4 w-2 h-2 bg-blue-400 rounded-full opacity-20"></div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                {`Level ${index + 1}`}
              </h3>
              {level.descriptions?.map((desc) => (
                <div key={desc.id} className="mb-4">
                  {desc.description_text && (
                    <p className="text-gray-700 mb-3">{desc.description_text}</p>
                  )}
                  {desc.skills && desc.skills.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Skills:</h4>
                      <ul className="space-y-4">
                        {desc.skills.map((skill) => (
                          <li key={skill.id} className="flex flex-col gap-1">
                            <div className="flex items-start">
                              <FaCheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{skill.skill_text}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <UrlInputBox
                                url={urls[skill.id] || ''}
                                onChange={val => handleUrlChange(skill.id, val)}
                                onRemove={() => handleRemove(skill.id)}
                                onSubmit={() => handleSubmit(skill.id)}
                                placeholder="Enter URL to submit evidence for this skill"
                                colorClass="border-blue-300"
                              />
                              {submitted[skill.id] && (
                                <span className="text-blue-600 text-sm mt-1 block">Submitted!</span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SfiaSection;
