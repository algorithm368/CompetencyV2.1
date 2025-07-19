import { useState, useMemo } from "react";
import { useAuth } from "@Contexts/AuthContext";
import { SfiaEvidenceService } from "../services/sfiaEvidenceService";
import { SubmitEvidenceRequest, EvidenceState } from "../types/sfia";

/**
 * Custom React hook for managing SFIA evidence submission workflow.
 * Handles URL input changes, submission status, validation, and errors per evidence item.
 *
 * @returns {object} - Object containing the evidence state and handler functions:
 *  - evidenceState: Current state of evidence inputs, submission flags, errors, and loading statuses.
 *  - handleUrlChange: Function to update URL input for a specific sub-skill ID.
 *  - handleRemove: Function to clear/reset evidence entry for a specific sub-skill ID.
 *  - handleSubmit: Function to validate and submit evidence for a specific sub-skill ID.
 */
export const useSfiaEvidence = () => {
  const [evidenceState, setEvidenceState] = useState<EvidenceState>({
    urls: {},
    submitted: {},
    loading: {},
    errors: {},
  });

  const { accessToken } = useAuth();
  const baseApi = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  /**
   * Memoized instance of SfiaEvidenceService for API interactions.
   */
  const evidenceService = useMemo(
    () => new SfiaEvidenceService(baseApi, accessToken),
    [baseApi, accessToken]
  );

  /**
   * Handles updating URL input state for a given sub-skill ID.
   *
   * @param {number} id - Sub-skill identifier.
   * @param {string} value - URL or description input.
   */
  const handleUrlChange = (id: number, value: string) => {
    setEvidenceState((prev) => ({
      ...prev,
      urls: { ...prev.urls, [id.toString()]: value },
      errors: { ...prev.errors, [id.toString()]: "" },
    }));
  };

  /**
   * Clears/removes evidence entry for a specific sub-skill ID.
   *
   * @param {number} id - Sub-skill identifier.
   */
  const handleRemove = (id: number) => {
    const idStr = id.toString();
    setEvidenceState((prev) => ({
      ...prev,
      urls: { ...prev.urls, [idStr]: "" },
      submitted: { ...prev.submitted, [idStr]: false },
      errors: { ...prev.errors, [idStr]: "" },
    }));
  };

  /**
   * Handles validation and evidence submission for a specific sub-skill ID.
   * Updates loading state, handles API errors, and marks submissions as complete.
   *
   * @param {number} id - Sub-skill identifier.
   */
  const handleSubmit = async (id: number) => {
    const idStr = id.toString();
    const evidenceUrl = evidenceState.urls[idStr];

    const validation = evidenceService.validateEvidenceUrl(evidenceUrl);
    if (!validation.isValid) {
      setEvidenceState((prev) => ({
        ...prev,
        errors: { ...prev.errors, [idStr]: validation.error || "" },
      }));
      return;
    }

    if (!accessToken) {
      setEvidenceState((prev) => ({
        ...prev,
        errors: { ...prev.errors, [idStr]: "Please log in to submit evidence" },
      }));
      return;
    }

    setEvidenceState((prev) => ({
      ...prev,
      loading: { ...prev.loading, [idStr]: true },
      errors: { ...prev.errors, [idStr]: "" },
    }));

    try {
      const isValidUrl = evidenceService.isValidUrl(evidenceUrl);

      const evidenceRequest: SubmitEvidenceRequest = {
        subSkillId: id,
        evidenceText: evidenceUrl,
        evidenceUrl: isValidUrl ? evidenceUrl : undefined,
      };

      const response = await evidenceService.submitEvidence(evidenceRequest);

      if (response.success) {
        setEvidenceState((prev) => ({
          ...prev,
          submitted: { ...prev.submitted, [idStr]: true },
        }));
        console.log("Evidence submitted successfully:", response.data);
      } else {
        setEvidenceState((prev) => ({
          ...prev,
          errors: {
            ...prev.errors,
            [idStr]: response.message || "Failed to submit evidence.",
          },
        }));
      }
    } catch (error: any) {
      console.error("Error submitting evidence:", error);
      setEvidenceState((prev) => ({
        ...prev,
        errors: {
          ...prev.errors,
          [idStr]:
            error.message || "Failed to submit evidence. Please try again.",
        },
      }));
    } finally {
      setEvidenceState((prev) => ({
        ...prev,
        loading: { ...prev.loading, [idStr]: false },
      }));
    }
  };

  return {
    evidenceState,
    handleUrlChange,
    handleRemove,
    handleSubmit,
  };
};
