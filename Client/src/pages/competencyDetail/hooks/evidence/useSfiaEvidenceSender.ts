import { useState, useMemo, useCallback } from "react";
import { useAuth } from "@Contexts/AuthContext";
import { SfiaEvidenceService } from "../../services/postSfiaEvidenceAPI";
import { DeleteSfiaEvidenceService } from "../../services/deleteSfiaEvidenceAPI";
import { SubmitEvidenceRequest, EvidenceState } from "../../types/sfia";

/**
 * # SFIA Evidence Management Hook
 *
 * A React hook that manages evidence submission for SFIA (Skills Framework for the Information Age)
 * competency assessments. This hook provides a complete solution for handling multiple evidence
 * submissions with individual state tracking per sub-skill.
 *
 * ## State Management
 * Each sub-skill ID has its own independent state:
 * ```
 * evidenceState: {
 *   urls: { "123": "https://example.com", "124": "Description text" }
 *   submitted: { "123": true, "124": false }
 *   loading: { "123": false, "124": true }
 *   errors: { "123": "", "124": "Please enter evidence" }
 * }
 * ```
 *
 * ## Quick Usage
 * ```jsx
 * function EvidenceForm({ subSkillId }) {
 *   const { evidenceState, handleUrlChange, handleSubmit } = useSfiaEvidenceSender();
 *
 *   return (
 *     <div>
 *       <input
 *         value={evidenceState.urls[subSkillId] || ''}
 *         onChange={(e) => handleUrlChange(subSkillId, e.target.value)}
 *         placeholder="Enter evidence URL or description"
 *       />
 *       <button onClick={() => handleSubmit(subSkillId)}>
 *         {evidenceState.loading[subSkillId] ? 'Submitting...' : 'Submit'}
 *       </button>
 *       {evidenceState.errors[subSkillId] && (
 *         <p className="error">{evidenceState.errors[subSkillId]}</p>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 *
 * @returns {Object} Hook interface
 * @returns {EvidenceState} evidenceState - Complete state object for all sub-skills
 * @returns {Function} handleUrlChange - Updates evidence input: `(id: number, value: string) => void`
 * @returns {Function} handleRemove - Clears evidence data: `(id: number) => void`
 * @returns {Function} handleSubmit - Submits evidence: `(id: number) => Promise<void>`
 */
export const useSfiaEvidenceSender = () => {
  // Initialize state for tracking all evidence submissions
  const [evidenceState, setEvidenceState] = useState<EvidenceState>({
    urls: {}, // Evidence input values (URL or text)
    submitted: {}, // Submission completion status
    loading: {}, // API call loading states
    deleting: {}, // Evidence deletion loading states
    errors: {}, // Validation and submission errors
    approvalStatus: {}, // Approval status for each sub-skill
  });

  const initializeEvidenceUrls = useCallback((evidenceData: { [subSkillId: number]: { url: string; approvalStatus: string | null } }) => {
    setEvidenceState((prev) => ({
      ...prev,
      urls: {
        ...prev.urls,
        ...Object.fromEntries(
          Object.entries(evidenceData).map(([key, value]) => [
            key.toString(),
            {
              evidenceUrl: value.url, // Using evidenceUrl to match type definition
              approvalStatus: value.approvalStatus,
            },
          ])
        ),
      },
      submitted: {
        ...prev.submitted,
        ...Object.fromEntries(
          Object.entries(evidenceData).map(([key, value]) => [
            key.toString(),
            !!value.url, // Check if URL exists
          ])
        ),
      },
    }));
  }, []);

  /**
   * Service instance for API calls - memoized to prevent unnecessary re-creation
   * Recreates only when baseApi or accessToken changes
   */
  const evidenceService = useMemo(() => new SfiaEvidenceService(), []);

  /**
   * Updates the evidence input for a specific sub-skill
   *
   * @param {number} id - The sub-skill ID to update
   * @param {string} value - The evidence URL or description text
   *
   * Side effects:
   * - Updates the input value in state
   * - Clears any existing error for this sub-skill
   */
  const handleUrlChange = (id: number, value: string) => {
    setEvidenceState((prev) => ({
      ...prev,
      urls: { ...prev.urls, [id.toString()]: value },
      errors: { ...prev.errors, [id.toString()]: "" }, // Clear errors on input change
    }));
  };

  /**
   * Completely resets the evidence entry for a sub-skill
   *
   * @param {number} id - The sub-skill ID to reset
   *
   * Side effects:
   * - Clears the evidence input
   * - Resets submission status to false
   * - Clears any errors
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
   * Validates and submits evidence for a specific sub-skill
   *
   * @param {number} id - The sub-skill ID to submit evidence for
   *
   * Process:
   * 1. Validates evidence input (must not be empty)
   * 2. Checks user authentication
   * 3. Sets loading state
   * 4. Determines if input is URL or text description
   * 5. Calls API to submit evidence
   * 6. Updates state based on success/failure
   * 7. Always clears loading state
   */
  const handleSubmit = async (id: number) => {
    const idStr = id.toString();

    // Clear old status for this sub-skill before starting submission
    setEvidenceState((prev) => ({
      ...prev,
      errors: { ...prev.errors, [idStr]: "" },
      submitted: { ...prev.submitted, [idStr]: false },
      loading: { ...prev.loading, [idStr]: false },
    }));

    const evidenceUrl = evidenceState.urls[idStr];

    // Step 1: Validate evidence input
    if (!evidenceUrl || typeof evidenceUrl !== "string" || evidenceUrl.trim() === "") {
      setEvidenceState((prev) => ({
        ...prev,
        errors: { ...prev.errors, [idStr]: "Evidence URL cannot be empty." },
      }));
      return;
    }

    const isValidUrl = evidenceService.isValidUrl(evidenceUrl);
    if (!isValidUrl) {
      setEvidenceState((prev) => ({
        ...prev,
        errors: { ...prev.errors, [idStr]: "Please provide a valid URL." },
      }));
      return;
    }

    // Step 3: Set loading state and clear errors
    setEvidenceState((prev) => ({
      ...prev,
      loading: { ...prev.loading, [idStr]: true },
      errors: { ...prev.errors, [idStr]: "" },
    }));

    try {
      // Step 4: Prepare API request
      const evidenceRequest: SubmitEvidenceRequest = {
        subSkillId: id,
        evidenceText: evidenceUrl, // Always include as text
        evidenceUrl, // Include URL since it's valid
      };

      // Step 5: Submit to API
      const response = await evidenceService.submitEvidence(evidenceRequest);

      if (response.success) {
        // Success: Mark as submitted
        setEvidenceState((prev) => ({
          ...prev,
          submitted: { ...prev.submitted, [idStr]: true },
          approvalStatus: { ...prev.approvalStatus, [idStr]: "NOT_APPROVED" },
        }));
      } else {
        // API returned error
        setEvidenceState((prev) => ({
          ...prev,
          errors: {
            ...prev.errors,
            [idStr]: response.message || "Failed to submit evidence.",
          },
        }));
      }
    } catch (error: unknown) {
      // Network or other errors
      console.error("Error submitting evidence:", error);
      setEvidenceState((prev) => ({
        ...prev,
        errors: {
          ...prev.errors,
          [idStr]: error.message || "Failed to submit evidence. Please try again.",
        },
      }));
    } finally {
      // Step 6: Always clear loading state
      setEvidenceState((prev) => ({
        ...prev,
        loading: { ...prev.loading, [idStr]: false },
      }));
    }
  };

  /**
   * Handles evidence deletion for a specific sub-skill
   *
   * @param {number} id - The sub-skill ID to delete evidence for
   * @returns {Promise<boolean>} Promise that resolves to true if deletion was successful
   *
   * Process:
   * 1. Validates user authentication
   * 2. Sets deleting state to show UI feedback
   * 3. Calls delete API
   * 4. Updates state based on success/failure
   * 5. Clears deleting state
   */
  const handleDelete = useCallback(async (id: number): Promise<boolean> => {
    const idStr = id.toString();

    // Step 2: Set deleting state
    setEvidenceState((prev) => ({
      ...prev,
      deleting: { ...prev.deleting, [idStr]: true },
      errors: { ...prev.errors, [idStr]: "" }, // Clear any previous errors
    }));

    try {
      // Step 3: Create delete service and call API
      const deleteService = new DeleteSfiaEvidenceService();
      const result = await deleteService.deleteEvidence({
        subSkillId: id,
      });

      if (result.success) {
        // Step 4a: Successful deletion - reset evidence state
        console.log(`✅ SFIA evidence deleted successfully for subskill ID: ${id}`);
        setEvidenceState((prev) => ({
          ...prev,
          urls: {
            ...prev.urls,
            [idStr]: { evidenceUrl: "", approvalStatus: null },
          },
          submitted: { ...prev.submitted, [idStr]: false },
          errors: { ...prev.errors, [idStr]: "" },
          approvalStatus: { ...prev.approvalStatus, [idStr]: null },
        }));
        return true;
      } else {
        // Step 4b: API returned error
        const errorMessage = result.message || "Failed to delete evidence";
        console.error(`❌ SFIA evidence deletion failed:`, errorMessage);
        setEvidenceState((prev) => ({
          ...prev,
          errors: { ...prev.errors, [idStr]: errorMessage },
        }));
        return false;
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      console.error(`❌ Error deleting SFIA evidence:`, error);
      setEvidenceState((prev) => ({
        ...prev,
        errors: { ...prev.errors, [idStr]: errorMessage },
      }));
      return false;
    } finally {
      // Step 5: Always clear deleting state
      setEvidenceState((prev) => ({
        ...prev,
        deleting: { ...prev.deleting, [idStr]: false },
      }));
    }
  }, []);

  return {
    evidenceState,
    handleUrlChange,
    handleRemove,
    handleSubmit,
    handleDelete,
    initializeEvidenceUrls,
  };
};
