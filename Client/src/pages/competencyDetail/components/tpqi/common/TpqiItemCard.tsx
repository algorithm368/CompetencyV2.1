import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import UrlInputBox from "../../ui/UrlInputBox";
import type { TpqiItemColorScheme } from "../types";

interface TpqiItemCardProps {
  id: string;
  name: string;
  placeholder: string;
  colorScheme: TpqiItemColorScheme;
  hasUrlInput?: boolean;
  onSubmit?: (id: string) => void;
}

export const TpqiItemCard: React.FC<TpqiItemCardProps> = ({
  id,
  name,
  placeholder,
  colorScheme,
  hasUrlInput = true,
  onSubmit,
}) => {
  const [url, setUrl] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);

  const handleUrlChange = (value: string) => {
    setUrl(value);
  };

  const handleRemove = () => {
    setUrl("");
    setSubmitted(false);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    onSubmit?.(id);
  };

  const handleFocus = () => {
    setIsActive(true);
  };

  const handleBlur = () => {
    setIsActive(false);
  };

  return (
    <motion.div
      className={`flex flex-col p-4 bg-white/80 backdrop-blur-md rounded-2xl border ${colorScheme.border} gap-2 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden`}
      layout
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        scale: isActive ? 1.02 : 1,
        boxShadow: isActive ? colorScheme.shadow : 'none'
      }}
      onClick={handleFocus}
      onBlur={handleBlur}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.01 }}
    >
      {/* Decorative dot */}
      <div className={`absolute top-2 right-4 w-2 h-2 ${colorScheme.decorativeDot} rounded-full opacity-20`}></div>
      
      <div className="flex items-center flex-1 min-w-0 mb-2">
        <FaCheckCircle className={`w-5 h-5 ${colorScheme.accent} mr-3 flex-shrink-0`} />
        <span className="text-gray-800 truncate font-semibold text-lg">{name}</span>
      </div>
      
      {hasUrlInput && (
        <div className="flex-1 min-w-0">
          <UrlInputBox
            url={url}
            onChange={handleUrlChange}
            onRemove={handleRemove}
            onSubmit={handleSubmit}
            placeholder={placeholder}
            colorClass={colorScheme.borderClass}
          />
          {submitted && (
            <motion.span
              className={`${colorScheme.text} text-sm mt-1`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              Submitted!
            </motion.span>
          )}
        </div>
      )}
    </motion.div>
  );
};
