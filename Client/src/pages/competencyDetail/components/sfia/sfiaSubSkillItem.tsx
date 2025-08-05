import React, { useEffect, useState, useCallback } from "react";
import { EvidenceItem } from "../shared/EvidenceItem";
import { SfiaSubSkill } from "../../types/sfia";
import { useAuth } from "@Contexts/AuthContext";
import { GetSfiaEvidenceService } from "../../services/getSfiaEvidenceAPI";

interface SubSkillItemProps {
  /** Sub-skill information including description text. */
  subskill: SfiaSubSkill;
  /** Unique identifier for the sub-skill, used for tracking evidence submission. */
  skillCode: string;
  /** Current URL or description entered for this sub-skill. */
  url: string;
  /** Approval status of the evidence */
  approvalStatus?: string | null;
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
  /** Optional callback for when evidence is successfully loaded. */
  onEvidenceLoaded?: (evidence: string) => void;
}

// Custom hook for evidence fetching
const useEvidenceFetcher = (
  skillCode: string,
  subskillId: number,
  onUrlChange: (value: string) => void,
  onEvidenceLoaded?: (evidence: string) => void
) => {
  const { accessToken } = useAuth();
  const [evidenceLoading, setEvidenceLoading] = useState(false);
  const [evidenceLoaded, setEvidenceLoaded] = useState(false);

  const fetchExistingEvidence = useCallback(async () => {
    if (!accessToken || !skillCode || evidenceLoaded) return;

    setEvidenceLoading(true);
    try {
      const baseApi = import.meta.env.VITE_API_BASE_URL;
      const evidenceService = new GetSfiaEvidenceService(baseApi, accessToken);

      const response = await evidenceService.getEvidence({
        skillCode,
      });

      if (response.success && response.data) {
        const subSkillEvidence = response.data.evidences?.find(
          (evidence: unknown) => evidence.id === subskillId
        );

        if (subSkillEvidence?.url) {
          onEvidenceLoaded?.(subSkillEvidence.url);
          onUrlChange(subSkillEvidence.url);
        }
      }
      setEvidenceLoaded(true);
    } catch (error) {
      console.error("Failed to fetch existing evidence:", error);
      setEvidenceLoaded(true);
    } finally {
      setEvidenceLoading(false);
    }
  }, [
    accessToken,
    skillCode,
    subskillId,
    evidenceLoaded,
    onEvidenceLoaded,
    onUrlChange,
  ]);

  useEffect(() => {
    fetchExistingEvidence();
  }, [fetchExistingEvidence]);

  return { evidenceLoading, evidenceLoaded };
};

/**
 * SubSkillItem Component
 *
 * Displays an individual SFIA sub-skill with evidence submission functionality.
 * Optimized for performance with proper state management.
 */
const SubSkillItem: React.FC<SubSkillItemProps> = ({
  subskill,
  skillCode,
  url,
  approvalStatus,
  submitted,
  loading,
  error,
  onUrlChange,
  onRemove,
  onSubmit,
  onEvidenceLoaded,
}) => {
  // Custom hook for evidence fetching
  const { evidenceLoading } = useEvidenceFetcher(
    skillCode,
    subskill.id,
    onUrlChange,
    onEvidenceLoaded
  );

  return (
    <EvidenceItem
      id={`subskill-${subskill.id}`}
      text={subskill.subskill_text}
      url={url}
      approvalStatus={approvalStatus}
      submitted={submitted}
      loading={loading}
      error={error}
      evidenceLoading={evidenceLoading}
      colorVariant="blue"
      skillType="skill"
      placeholder="Enter evidence URL"
      onUrlChange={onUrlChange}
      onRemove={onRemove}
      onSubmit={onSubmit}
    />
  );
};

export default SubSkillItem;
