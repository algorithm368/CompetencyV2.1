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
 *   const { evidenceState, handleUrlChange, handleSubmit } = useSfiaEvidence();
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
export const useSfiaEvidence = () => {
  // Initialize state for tracking all evidence submissions
  const [evidenceState, setEvidenceState] = useState<EvidenceState>({
    urls: {}, // Evidence input values (URL or text)
    submitted: {}, // Submission completion status
    loading: {}, // API call loading states
    errors: {}, // Validation and submission errors
  });

  // Get authentication token from context
  const { accessToken } = useAuth();

  // API base URL from environment or fallback
  const baseApi = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  /**
   * Service instance for API calls - memoized to prevent unnecessary re-creation
   * Recreates only when baseApi or accessToken changes
   */
  const evidenceService = useMemo(
    () => new SfiaEvidenceService(baseApi, accessToken),
    [baseApi, accessToken]
  );

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
    const evidenceUrl = evidenceState.urls[idStr];

    // Step 1: Validate evidence input
    const validation = evidenceService.validateEvidenceUrl(evidenceUrl);
    if (!validation.isValid) {
      setEvidenceState((prev) => ({
        ...prev,
        errors: { ...prev.errors, [idStr]: validation.error || "" },
      }));
      return;
    }

    // Step 2: Check authentication
    if (!accessToken) {
      setEvidenceState((prev) => ({
        ...prev,
        errors: { ...prev.errors, [idStr]: "Please log in to submit evidence" },
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
      // Step 4: Check if input is a valid URL
      const isValidUrl = evidenceService.isValidUrl(evidenceUrl);

      // Step 5: Prepare API request
      const evidenceRequest: SubmitEvidenceRequest = {
        subSkillId: id,
        evidenceText: evidenceUrl, // Always include as text
        evidenceUrl: isValidUrl ? evidenceUrl : undefined, // Only include URL if valid
      };

      // Step 6: Submit to API
      const response = await evidenceService.submitEvidence(evidenceRequest);

      if (response.success) {
        // Success: Mark as submitted
        setEvidenceState((prev) => ({
          ...prev,
          submitted: { ...prev.submitted, [idStr]: true },
        }));
        console.log("Evidence submitted successfully:", response.data);
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
    } catch (error: any) {
      // Network or other errors
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
      // Step 7: Always clear loading state
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
