import React, { useState, useMemo } from "react";
import { FaTools, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import UrlInputBox from "./UrlInputBox";

interface TpqiSkillsProps {
  skills: Array<{ id: string; name_skill: string }>;
  overall?: string;
}

export const TpqiSkills: React.FC<TpqiSkillsProps> = ({ skills, overall }) => {
  const [urls, setUrls] = useState<{ [id: string]: string }>({});
  const [submitted, setSubmitted] = useState<{ [id: string]: boolean }>({});
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  
  // Filter out skills with empty or null names
  const filteredSkills = useMemo(() => {
    return skills?.filter(skill => skill.name_skill?.trim()) || [];
  }, [skills]);

  // Function to handle when a skill is clicked/focused
  const handleSkillFocus = (id: string) => {
    setActiveSkill(id);
  };
  
  // Function to handle when a skill loses focus
  const handleSkillBlur = () => {
    setActiveSkill(null);
  };

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

  return filteredSkills.length > 0 ? (
    <motion.section 
      className="relative bg-gradient-to-b from-green-50 via-white to-green-25 backdrop-blur-xl rounded-3xl p-8 border border-green-100 shadow-1xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Decorative blurred shapes */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-green-200 rounded-full mix-blend-multiply filter blur-2xl opacity-20 pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-green-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20 pointer-events-none"></div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <FaTools className="w-6 h-6 mr-3 text-green-600" />
        Skills
      </h2>
      {overall && (
        <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-400 rounded">
          <h3 className="font-semibold text-green-700 mb-1">Overview</h3>
          <p className="text-gray-700 text-base whitespace-pre-line">{overall}</p>
        </div>
      )}
      <div className="flex flex-col gap-4">
        {filteredSkills.map((skill) => (
          <motion.div 
            key={skill.id} 
            className="flex flex-col p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-green-200 gap-2 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            layout
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              scale: activeSkill === skill.id ? 1.02 : 1,
              boxShadow: activeSkill === skill.id ? '0 6px 18px rgba(34,197,94,0.12)' : 'none'
            }}
            onClick={() => handleSkillFocus(skill.id)}
            onBlur={() => handleSkillBlur()}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.01 }}
          >
            {/* Decorative dot */}
            <div className="absolute top-2 right-4 w-2 h-2 bg-green-400 rounded-full opacity-20"></div>
            <div className="flex items-center flex-1 min-w-0 mb-2">
              <FaCheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
              <span className="text-gray-800 truncate font-semibold text-lg">{skill.name_skill}</span>
            </div>
            <div className="flex-1 min-w-0">
              <UrlInputBox
                url={urls[skill.id] || ''}
                onChange={val => handleUrlChange(skill.id, val)}
                onRemove={() => handleRemove(skill.id)}
                onSubmit={() => handleSubmit(skill.id)}
                placeholder="Enter URL to submit evidence for this skill"
                colorClass="border-green-300"
              />
              {submitted[skill.id] && (
                <motion.span 
                  className="text-green-600 text-sm mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  Submitted!
                </motion.span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  ) : null;
};

interface TpqiKnowledgeProps {
  knowledge: Array<{ id: string; name_knowledge: string }>;
  overall?: string;
}

export const TpqiKnowledge: React.FC<TpqiKnowledgeProps> = ({ knowledge, overall }) => {
  const [urls, setUrls] = useState<{ [id: string]: string }>({});
  const [submitted, setSubmitted] = useState<{ [id: string]: boolean }>({});
  const [activeKnowledge, setActiveKnowledge] = useState<string | null>(null);

  // Filter out knowledge with empty or null names
  const filteredKnowledge = useMemo(() => {
    return knowledge?.filter(k => k.name_knowledge?.trim()) || [];
  }, [knowledge]);

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
  
  const handleKnowledgeFocus = (id: string) => {
    setActiveKnowledge(id);
  };
  
  const handleKnowledgeBlur = () => {
    setActiveKnowledge(null);
  };

  return filteredKnowledge.length > 0 ? (
    <motion.section 
      className="relative bg-gradient-to-b from-purple-50 via-white to-purple-25 backdrop-blur-xl rounded-3xl p-8 border border-purple-100 shadow-1xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Decorative blurred shapes */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-20 pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20 pointer-events-none"></div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <FaTools className="w-6 h-6 mr-3 text-purple-600" />
        Knowledge Areas
      </h2>
      {overall && (
        <div className="mb-4 p-3 bg-purple-50 border-l-4 border-purple-400 rounded">
          <h3 className="font-semibold text-purple-700 mb-1">Overview</h3>
          <p className="text-gray-700 text-base whitespace-pre-line">{overall}</p>
        </div>
      )}
      <div className="flex flex-col gap-4">
        {filteredKnowledge.map((k) => (
          <motion.div 
            key={k.id} 
            className="flex flex-col p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-purple-200 gap-2 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            layout
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1, 
              scale: activeKnowledge === k.id ? 1.02 : 1,
              boxShadow: activeKnowledge === k.id ? '0 6px 18px rgba(168,85,247,0.12)' : 'none'
            }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.01 }}
            onClick={() => handleKnowledgeFocus(k.id)}
            onBlur={() => handleKnowledgeBlur()}
          >
            {/* Decorative dot */}
            <div className="absolute top-2 right-4 w-2 h-2 bg-purple-400 rounded-full opacity-20"></div>
            <div className="flex items-center flex-1 min-w-0 mb-2">
              <FaCheckCircle className="w-5 h-5 text-purple-500 mr-3 flex-shrink-0" />
              <span className="text-gray-800 truncate font-semibold text-lg">{k.name_knowledge}</span>
            </div>
            <div className="flex-1 min-w-0">
              <UrlInputBox
                url={urls[k.id] || ''}
                onChange={val => handleUrlChange(k.id, val)}
                onRemove={() => handleRemove(k.id)}
                onSubmit={() => handleSubmit(k.id)}
                placeholder="Enter URL to submit evidence for this knowledge area"
                colorClass="border-purple-300"
              />
              {submitted[k.id] && (
                <motion.span 
                  className="text-purple-600 text-sm mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  Submitted!
                </motion.span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  ) : null;
};

interface TpqiOccupationalProps {
  occupational: Array<{ id: string; name_occupational: string }>;
  overall?: string;
}

export const TpqiOccupational: React.FC<TpqiOccupationalProps> = ({ occupational, overall }) => {
  const [activeOcc, setActiveOcc] = useState<string | null>(null);
  
  // Filter out occupational items with empty or null names
  const filteredOccupational = useMemo(() => {
    return occupational?.filter(occ => occ.name_occupational?.trim()) || [];
  }, [occupational]);
  
  return filteredOccupational.length > 0 ? (
    <motion.section 
      className="relative bg-gradient-to-b from-indigo-50 via-white to-indigo-25 backdrop-blur-xl rounded-3xl p-8 border border-indigo-100 shadow-2xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Decorative blurred shapes */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-200 rounded-full mix-blend-multiply filter blur-2xl opacity-20 pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20 pointer-events-none"></div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <FaTools className="w-6 h-6 mr-3 text-indigo-600" />
        Occupational Areas
      </h2>
      {overall && (
        <div className="mb-4 p-3 bg-indigo-50 border-l-4 border-indigo-400 rounded">
          <h3 className="font-semibold text-indigo-700 mb-1">Overview</h3>
          <p className="text-gray-700 text-base whitespace-pre-line">{overall}</p>
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredOccupational.map((occ) => (
          <motion.div 
            key={occ.id} 
            className="flex items-center p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-indigo-200 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              scale: activeOcc === occ.id ? 1.05 : 1,
              boxShadow: activeOcc === occ.id ? '0 6px 18px rgba(99,102,241,0.12)' : 'none'
            }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setActiveOcc(occ.id)}
            onMouseLeave={() => setActiveOcc(null)}
          >
            {/* Decorative dot */}
            <div className="absolute top-2 right-4 w-2 h-2 bg-indigo-400 rounded-full opacity-20"></div>
            <FaCheckCircle className="w-5 h-5 text-indigo-500 mr-3 flex-shrink-0" />
            <span className="text-gray-800 font-semibold text-lg">{occ.name_occupational}</span>
          </motion.div>
        ))}
      </div>
    </motion.section>
  ) : null;
};
