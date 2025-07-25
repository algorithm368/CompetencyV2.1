import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";
import UrlInputBox from "../ui/UrlInputBox";
import { SfiaSubSkill } from "../../types/sfia";
import { useAuth } from "@Contexts/AuthContext";
import { GetSfiaEvidenceService } from "../../services/getSfiaEvidenceAPI";

// Types and Enums
enum EvidenceStatus {
  LOADING_EVIDENCE = "loading-evidence",
  SUBMITTING = "submitting",
  ERROR = "error",
  APPROVED = "approved",
  REJECTED = "rejected",
  PENDING = "pending",
  SUBMITTED = "submitted",
  READY = "ready",
  EMPTY = "empty",
}

enum ApprovalStatus {
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  NOT_APPROVED = "NOT_APPROVED",
}

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

interface StatusConfig {
  icon: React.ReactNode;
  badgeClass: string;
  label: string;
  message?: React.ReactNode;
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

// Utility function to determine status
const getEvidenceStatus = (
  evidenceLoading: boolean,
  loading: boolean,
  error: string,
  url: string,
  submitted: boolean,
  approvalStatus?: string | null
): EvidenceStatus => {
  if (evidenceLoading) return EvidenceStatus.LOADING_EVIDENCE;
  if (loading) return EvidenceStatus.SUBMITTING;
  if (error) return EvidenceStatus.ERROR;

  if (url && submitted) {
    switch (approvalStatus) {
      case ApprovalStatus.APPROVED:
        return EvidenceStatus.APPROVED;
      case ApprovalStatus.REJECTED:
        return EvidenceStatus.REJECTED;
      case ApprovalStatus.NOT_APPROVED:
        return EvidenceStatus.PENDING;
      default:
        return EvidenceStatus.SUBMITTED;
    }
  }

  return url ? EvidenceStatus.READY : EvidenceStatus.EMPTY;
};

// Status configuration mapping - moved outside component to prevent recreation
const STATUS_CONFIGS: Record<EvidenceStatus, StatusConfig> = {
  [EvidenceStatus.APPROVED]: {
    icon: <FaCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />,
    badgeClass: "bg-green-100 text-green-700",
    label: "Approved",
    message: (
      <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 border border-green-200 rounded p-2">
        <FaCheckCircle className="w-3 h-3" />
        <span>Your evidence has been approved! ✨</span>
      </div>
    ),
  },
  [EvidenceStatus.PENDING]: {
    icon: <FaClock className="w-5 h-5 text-yellow-500 flex-shrink-0" />,
    badgeClass: "bg-yellow-100 text-yellow-700",
    label: "Pending Approval",
    message: (
      <div className="flex items-center gap-2 text-yellow-600 text-sm bg-yellow-50 border border-yellow-200 rounded p-2">
        <FaClock className="w-3 h-3" />
        <span>Your evidence is pending review by an administrator.</span>
      </div>
    ),
  },
  [EvidenceStatus.REJECTED]: {
    icon: <FaTimesCircle className="w-5 h-5 text-red-500 flex-shrink-0" />,
    badgeClass: "bg-red-100 text-red-700",
    label: "Rejected",
    message: (
      <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded p-2">
        <FaTimesCircle className="w-3 h-3" />
        <span>Your evidence was not approved. Please submit new evidence.</span>
      </div>
    ),
  },
  [EvidenceStatus.SUBMITTED]: {
    icon: <FaCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />,
    badgeClass: "bg-blue-100 text-blue-700",
    label: "Completed",
  },
  [EvidenceStatus.LOADING_EVIDENCE]: {
    icon: (
      <FaSpinner className="w-5 h-5 text-blue-500 animate-spin flex-shrink-0" />
    ),
    badgeClass: "bg-blue-100 text-blue-700",
    label: "Loading...",
  },
  [EvidenceStatus.SUBMITTING]: {
    icon: (
      <FaSpinner className="w-5 h-5 text-blue-500 animate-spin flex-shrink-0" />
    ),
    badgeClass: "bg-blue-100 text-blue-700",
    label: "Submitting...",
  },
  [EvidenceStatus.ERROR]: {
    icon: (
      <FaExclamationTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
    ),
    badgeClass: "bg-red-100 text-red-700",
    label: "Error",
  },
  [EvidenceStatus.READY]: {
    icon: (
      <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex-shrink-0" />
    ),
    badgeClass: "bg-yellow-100 text-yellow-700",
    label: "Ready to Submit",
    message: (
      <div className="text-blue-600 text-sm">
        👍 Ready to submit! Click the submit button when you're satisfied with
        your evidence.
      </div>
    ),
  },
  [EvidenceStatus.EMPTY]: {
    icon: (
      <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex-shrink-0" />
    ),
    badgeClass: "bg-gray-100 text-gray-500",
    label: "No Evidence",
    message: (
      <div className="text-gray-500 text-sm">
        💡 Add a URL to online evidence with this skill
      </div>
    ),
  },
};

// Optimized helper function
const getStatusConfig = (status: EvidenceStatus): StatusConfig => {
  return STATUS_CONFIGS[status];
};

// Status Icon Component
const StatusIcon: React.FC<{ status: EvidenceStatus }> = ({ status }) => {
  const config = getStatusConfig(status);
  return <>{config.icon}</>;
};

// Status Badge Component
const StatusBadge: React.FC<{ status: EvidenceStatus }> = ({ status }) => {
  const config = getStatusConfig(status);
  return (
    <output
      className={`px-2 py-1 rounded-full text-xs font-medium ${config.badgeClass}`}
      aria-live="polite"
    >
      {config.label}
    </output>
  );
};

// Status Messages Component
const StatusMessages: React.FC<{
  status: EvidenceStatus;
  evidenceLoading: boolean;
  loading: boolean;
  error: string;
}> = ({ status, evidenceLoading, loading, error }) => {
  const config = getStatusConfig(status);

  return (
    <div className="mt-2 space-y-1">
      {/* Loading states */}
      {evidenceLoading && (
        <output
          className="flex items-center gap-2 text-blue-600 text-sm"
          aria-live="polite"
        >
          <FaSpinner className="w-3 h-3 animate-spin" />
          <span>Loading your existing evidence...</span>
        </output>
      )}

      {loading && (
        <output
          className="flex items-center gap-2 text-blue-600 text-sm"
          aria-live="polite"
        >
          <FaSpinner className="w-3 h-3 animate-spin" />
          <span>Submitting your evidence...</span>
        </output>
      )}

      {/* Error state */}
      {error && !loading && (
        <div
          className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded p-2"
          role="alert"
          aria-live="assertive"
        >
          <FaExclamationTriangle className="w-3 h-3" />
          <span>{error}</span>
        </div>
      )}

      {/* Status-specific messages */}
      {config.message}
    </div>
  );
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

  // Memoized status calculation
  const status = useMemo(
    () =>
      getEvidenceStatus(
        evidenceLoading,
        loading,
        error,
        url,
        submitted,
        approvalStatus
      ),
    [evidenceLoading, loading, error, url, submitted, approvalStatus]
  );

  // Memoized input props
  const inputProps = useMemo(
    () => ({
      url,
      onChange: onUrlChange,
      onRemove,
      onSubmit,
      placeholder: "Enter evidence URL",
      colorClass: "border-blue-300",
      disabled: evidenceLoading,
      readonly: submitted && !loading,
      loading,
    }),
    [url, onUrlChange, onRemove, onSubmit, evidenceLoading, submitted, loading]
  );

  return (
    <li
      className="flex flex-col gap-3"
      aria-labelledby={`subskill-${subskill.id}`}
    >
      {/* Sub-skill header with status indicator */}
      <div className="flex items-start gap-3">
        <div className="flex items-center gap-2 flex-1">
          <StatusIcon status={status} />

          {/* Sub-skill text */}
          <span
            id={`subskill-${subskill.id}`}
            className="text-gray-800 leading-relaxed"
          >
            {subskill.subskill_text}
          </span>
        </div>

        <StatusBadge status={status} />
      </div>

      {/* Evidence input area */}
      <div className="ml-8 flex-1 min-w-0">
        <UrlInputBox {...inputProps} />

        <StatusMessages
          status={status}
          evidenceLoading={evidenceLoading}
          loading={loading}
          error={error}
        />
      </div>
    </li>
  );
};

export default SubSkillItem;
