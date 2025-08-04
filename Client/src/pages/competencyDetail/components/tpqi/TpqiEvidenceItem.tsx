import React, { memo, useState, useCallback, useMemo } from "react";
import {
  FaClock,
  FaTrash,
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaTimesCircle,
} from "react-icons/fa";
import { EvidenceType } from "../../hooks/evidence/useTpqiEvidenceSender";

// Types and Enums
enum EvidenceStatus {
  LOADING = "loading",
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
  PENDING = "PENDING",
  NOT_APPROVED = "NOT_APPROVED",
}

interface TpqiEvidenceItemProps {
  /** Evidence type information including skill/knowledge classification */
  evidence: EvidenceType;
  /** Item information including name and description */
  item: { id: number; name: string; description?: string };
  /** Current URL or description entered for this evidence */
  url: string;
  /** Approval status of the evidence */
  approvalStatus: string;
  /** Indicates whether the evidence has been successfully submitted */
  submitted: boolean;
  /** Indicates whether the submission process is currently in progress */
  loading: boolean;
  /** Error message related to the evidence submission (if any) */
  error: string;
  /** Callback to handle URL/description input changes */
  onUrlChange: (value: string) => void;
  /** Callback to handle removal/reset of the evidence input */
  onRemove: () => void;
  /** Callback to trigger evidence submission */
  onSubmit: () => void;
}

interface StatusConfig {
  icon: React.ReactNode;
  badgeClass: string;
  label: string;
  message?: React.ReactNode;
}

// Utility function to determine status
const getEvidenceStatus = (
  loading: boolean,
  error: string,
  url: string,
  submitted: boolean,
  approvalStatus: string
): EvidenceStatus => {
  if (loading) return EvidenceStatus.SUBMITTING;
  if (error) return EvidenceStatus.ERROR;

  if (url && submitted) {
    switch (approvalStatus) {
      case ApprovalStatus.APPROVED:
        return EvidenceStatus.APPROVED;
      case ApprovalStatus.REJECTED:
        return EvidenceStatus.REJECTED;
      case ApprovalStatus.PENDING:
        return EvidenceStatus.PENDING;
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
    icon: <FaCheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />,
    badgeClass: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    label: "Approved",
    message: (
      <div className="flex items-start gap-3 text-emerald-700 text-sm bg-emerald-50 border border-emerald-200 rounded-lg p-3 shadow-sm">
        <FaCheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium">Evidence Approved</p>
          <p className="text-emerald-600 mt-1">Your submission has been reviewed and meets the required standards.</p>
        </div>
      </div>
    ),
  },
  [EvidenceStatus.PENDING]: {
    icon: <FaClock className="w-5 h-5 text-amber-500 flex-shrink-0" />,
    badgeClass: "bg-amber-50 text-amber-700 border border-amber-200",
    label: "Under Review",
    message: (
      <div className="flex items-start gap-3 text-amber-700 text-sm bg-amber-50 border border-amber-200 rounded-lg p-3 shadow-sm">
        <FaClock className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium">Review in Progress</p>
          <p className="text-amber-600 mt-1">Your evidence is currently being evaluated by our assessment team.</p>
        </div>
      </div>
    ),
  },
  [EvidenceStatus.REJECTED]: {
    icon: <FaTimesCircle className="w-5 h-5 text-red-500 flex-shrink-0" />,
    badgeClass: "bg-red-50 text-red-700 border border-red-200",
    label: "Requires Revision",
    message: (
      <div className="flex items-start gap-3 text-red-700 text-sm bg-red-50 border border-red-200 rounded-lg p-3 shadow-sm">
        <FaTimesCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium">Evidence Needs Improvement</p>
          <p className="text-red-600 mt-1">Please provide additional or clearer evidence to meet the assessment criteria.</p>
        </div>
      </div>
    ),
  },
  [EvidenceStatus.SUBMITTED]: {
    icon: <FaCheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />,
    badgeClass: "bg-blue-50 text-blue-700 border border-blue-200",
    label: "Submitted",
    message: (
      <div className="flex items-start gap-3 text-blue-700 text-sm bg-blue-50 border border-blue-200 rounded-lg p-3 shadow-sm">
        <FaCheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium">Successfully Submitted</p>
          <p className="text-blue-600 mt-1">Your evidence has been received and queued for evaluation.</p>
        </div>
      </div>
    ),
  },
  [EvidenceStatus.LOADING]: {
    icon: (
      <FaSpinner className="w-5 h-5 text-slate-500 animate-spin flex-shrink-0" />
    ),
    badgeClass: "bg-slate-50 text-slate-700 border border-slate-200",
    label: "Loading",
  },
  [EvidenceStatus.SUBMITTING]: {
    icon: (
      <FaSpinner className="w-5 h-5 text-blue-500 animate-spin flex-shrink-0" />
    ),
    badgeClass: "bg-blue-50 text-blue-700 border border-blue-200",
    label: "Processing",
  },
  [EvidenceStatus.ERROR]: {
    icon: (
      <FaExclamationTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
    ),
    badgeClass: "bg-red-50 text-red-700 border border-red-200",
    label: "Error",
  },
  [EvidenceStatus.READY]: {
    icon: (
      <div className="w-5 h-5 border-2 border-blue-400 rounded-full flex-shrink-0 bg-blue-50" />
    ),
    badgeClass: "bg-blue-50 text-blue-700 border border-blue-200",
    label: "Ready to Submit",
    message: (
      <div className="flex items-start gap-3 text-blue-700 text-sm bg-blue-50 border border-blue-200 rounded-lg p-3 shadow-sm">
        <div className="w-4 h-4 border-2 border-blue-400 rounded-full mt-0.5 flex-shrink-0 bg-blue-100" />
        <div>
          <p className="font-medium">Evidence Prepared</p>
          <p className="text-blue-600 mt-1">Please review your submission and click "Submit Evidence" when ready.</p>
        </div>
      </div>
    ),
  },
  [EvidenceStatus.EMPTY]: {
    icon: (
      <div className="w-5 h-5 border-2 border-slate-300 rounded-full flex-shrink-0 bg-slate-50" />
    ),
    badgeClass: "bg-slate-50 text-slate-600 border border-slate-200",
    label: "Awaiting Evidence",
    message: (
      <div className="flex items-start gap-3 text-slate-600 text-sm bg-slate-50 border border-slate-200 rounded-lg p-3 shadow-sm">
        <div className="w-4 h-4 border-2 border-slate-300 rounded-full mt-0.5 flex-shrink-0 bg-slate-100" />
        <div>
          <p className="font-medium">Evidence Required</p>
          <p className="text-slate-500 mt-1">Please provide a URL linking to documentation or portfolio evidence that demonstrates this competency.</p>
        </div>
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
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium shadow-sm ${config.badgeClass}`}
      aria-live="polite"
    >
      {config.label}
    </span>
  );
};

// Status Messages Component
const StatusMessages: React.FC<{
  status: EvidenceStatus;
  loading: boolean;
  error: string;
}> = ({ status, loading, error }) => {
  const config = getStatusConfig(status);

  return (
    <div className="space-y-3">
      {/* Loading state */}
      {loading && (
        <div
          className="flex items-center gap-3 text-blue-700 text-sm bg-blue-50 border border-blue-200 rounded-lg p-3"
          aria-live="polite"
        >
          <FaSpinner className="w-4 h-4 animate-spin flex-shrink-0" />
          <div>
            <p className="font-medium">Processing Submission</p>
            <p className="text-blue-600 mt-1">Please wait while we save your evidence...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div
          className="flex items-start gap-3 text-red-700 text-sm bg-red-50 border border-red-200 rounded-lg p-3 shadow-sm"
          role="alert"
          aria-live="assertive"
        >
          <FaExclamationTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Submission Error</p>
            <p className="text-red-600 mt-1">{error}</p>
            <p className="text-red-500 text-xs mt-2">Please check your connection and try again.</p>
          </div>
        </div>
      )}

      {/* Status-specific messages */}
      {!loading && !error && config.message}
    </div>
  );
};

/**
 * TpqiEvidenceItem Component
 *
 * Displays an individual TPQI evidence item with submission functionality.
 * Optimized for performance with proper state management and consistent UI patterns.
 */
const TpqiEvidenceItem: React.FC<TpqiEvidenceItemProps> = memo(({
  evidence,
  item,
  url,
  approvalStatus,
  submitted,
  loading,
  error,
  onUrlChange,
  onRemove,
  onSubmit,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  // Memoized status calculation
  const status = useMemo(
    () => getEvidenceStatus(loading, error, url, submitted, approvalStatus),
    [loading, error, url, submitted, approvalStatus]
  );

  // Memoized evidence type configuration
  const evidenceTypeConfig = useMemo(() => {
    const isSkill = evidence.type === 'skill';
    return {
      badge: isSkill ? 'Skill Evidence' : 'Knowledge Evidence',
      color: isSkill 
        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' 
        : 'bg-purple-50 text-purple-700 border border-purple-200',
      icon: isSkill ? '🔧' : '📚'
    };
  }, [evidence.type]);

  // Memoized input properties
  const inputProps = useMemo(
    () => ({
      value: url,
      onChange: onUrlChange,
      placeholder: "https://example.com/your-evidence",
      disabled: loading || (submitted && status === EvidenceStatus.APPROVED),
      readonly: submitted && status !== EvidenceStatus.REJECTED,
    }),
    [url, onUrlChange, loading, submitted, status]
  );

  return (
    <li 
      className="group border border-slate-200 rounded-xl p-6 bg-white hover:bg-slate-50/50 hover:border-slate-300 hover:shadow-md transition-all duration-300 ease-in-out"
      aria-labelledby={`evidence-${evidence.type}-${item.id}`}
    >
      <div className="space-y-4">
        {/* Header with item name, type badge, and status */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <StatusIcon status={status} />
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full shadow-sm ${evidenceTypeConfig.color}`}>
                <span>{evidenceTypeConfig.icon}</span>
                {evidenceTypeConfig.badge}
              </span>
            </div>
            
            <h5 
              id={`evidence-${evidence.type}-${item.id}`}
              className="text-base font-semibold text-slate-800 leading-tight mb-2"
            >
              {item.name}
            </h5>
            
            {item.description && (
              <button
                onClick={handleToggleExpanded}
                className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 px-2 py-1 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                type="button"
                aria-expanded={isExpanded}
                aria-controls={`description-${evidence.type}-${item.id}`}
              >
                <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
                <svg 
                  className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
          </div>

          <StatusBadge status={status} />
        </div>

        {/* Description (collapsible) */}
        {item.description && isExpanded && (
          <div 
            id={`description-${evidence.type}-${item.id}`}
            className="bg-slate-50 border border-slate-200 p-4 rounded-lg"
          >
            <h6 className="text-sm font-medium text-slate-700 mb-2">Competency Description</h6>
            <p className="text-sm text-slate-600 leading-relaxed">
              {item.description}
            </p>
          </div>
        )}

        {/* Evidence URL Input Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label 
              htmlFor={`evidence-url-${evidence.type}-${item.id}`}
              className="text-sm font-medium text-slate-700"
            >
              Evidence Documentation
            </label>
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Required</span>
          </div>
          
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                id={`evidence-url-${evidence.type}-${item.id}`}
                type="url"
                {...inputProps}
                className="w-full px-4 py-3 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors duration-200"
                aria-describedby={error ? `error-${evidence.type}-${item.id}` : `status-${evidence.type}-${item.id}`}
              />
              <p className="text-xs text-slate-500 mt-2">
                Provide a link to portfolio, documentation, or other evidence demonstrating this competency
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              {url && !submitted && (
                <button
                  onClick={onRemove}
                  disabled={loading}
                  className="flex items-center justify-center w-10 h-10 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-300"
                  type="button"
                  title="Clear evidence"
                  aria-label="Clear evidence"
                >
                  <FaTrash className="w-3.5 h-3.5" />
                </button>
              )}
              
              {url && !submitted && (
                <button
                  onClick={onSubmit}
                  disabled={loading || !url.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 border border-blue-600 rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm hover:shadow-md"
                  type="button"
                  aria-label="Submit evidence"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="w-3.5 h-3.5" />
                      <span>Submit Evidence</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Status Messages */}
        <div id={`status-${evidence.type}-${item.id}`}>
          <StatusMessages
            status={status}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </li>
  );
});

TpqiEvidenceItem.displayName = "TpqiEvidenceItem";

export default TpqiEvidenceItem;
