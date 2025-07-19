import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import UrlInputBox from "../ui/UrlInputBox";
import { SfiaSubSkill } from "../types/sfia";

interface SubSkillItemProps {
  /** Sub-skill information including description text. */
  subskill: SfiaSubSkill;

  /** Current URL or description entered for this sub-skill. */
  url: string;

  /** Indicates whether the evidence has been successfully submitted. */
  submitted: boolean;

  /** Indicates whether the submission process is currently in progress. */
  loading: boolean;

  /** Error message related to the evidence submission (if any). */
  error: string;

  /** Callback to handle URL/description input changes. */
  onUrlChange: (value: string) => void;

  /** Callback to handle removal/reset of the evidence input. */
  onRemove: () => void;

  /** Callback to trigger evidence submission. */
  onSubmit: () => void;
}

/**
 * SubSkillItem Component
 *
 * Displays an individual SFIA sub-skill along with input controls for submitting evidence.
 * Shows visual indicators for submission status, loading, and errors.
 *
 * @component
 * @param {SubSkillItemProps} props - Props containing sub-skill data and handler callbacks.
 * @returns {JSX.Element} The rendered sub-skill item with interactive controls.
 */
const SubSkillItem: React.FC<SubSkillItemProps> = ({
  subskill,
  url,
  submitted,
  loading,
  error,
  onUrlChange,
  onRemove,
  onSubmit,
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
        placeholder="Enter evidence URL or description"
        colorClass="border-blue-300"
        disabled={loading || submitted}
      />

      {loading && (
        <span className="text-blue-600 text-sm mt-1 block">
          🔄 Submitting evidence...
        </span>
      )}

      {submitted && !loading && (
        <span className="text-green-600 text-sm mt-1 block">
          ✅ Evidence submitted successfully!
        </span>
      )}

      {error && !loading && (
        <span className="text-red-600 text-sm mt-1 block">❌ {error}</span>
      )}
    </div>
  </li>
);

export default SubSkillItem;
