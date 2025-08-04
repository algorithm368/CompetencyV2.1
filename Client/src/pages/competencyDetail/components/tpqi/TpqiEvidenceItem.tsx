import React, { memo, useState, useCallback } from "react";
import { FaCheck, FaClock, FaTimes, FaTrash, FaPaperPlane } from "react-icons/fa";
import { EvidenceType } from "../../hooks/useTpqiEvidenceSender";

interface TpqiEvidenceItemProps {
  evidence: EvidenceType;
  item: { id: number; name: string; description?: string };
  url: string;
  approvalStatus: string;
  submitted: boolean;
  loading: boolean;
  error: string;
  onUrlChange: (value: string) => void;
  onRemove: () => void;
  onSubmit: () => void;
}

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

  const getApprovalStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "text-green-600 bg-green-100";
      case "REJECTED":
        return "text-red-600 bg-red-100";
      case "PENDING":
        return "text-yellow-600 bg-yellow-100";
      case "NOT_APPROVED":
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getApprovalIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <FaCheck className="w-3 h-3" />;
      case "REJECTED":
        return <FaTimes className="w-3 h-3" />;
      case "PENDING":
        return <FaClock className="w-3 h-3" />;
      case "NOT_APPROVED":
      default:
        return null;
    }
  };

  const evidenceTypeBadge = evidence.type === 'skill' ? 'Skill' : 'Knowledge';
  const evidenceTypeColor = evidence.type === 'skill' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';

  return (
    <li className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors duration-200">
      <div className="space-y-3">
        {/* Header with item name and type badge */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${evidenceTypeColor}`}>
                {evidenceTypeBadge}
              </span>
              <h5 className="font-medium text-gray-800 text-sm leading-tight">
                {item.name}
              </h5>
            </div>
            
            {item.description && (
              <button
                onClick={handleToggleExpanded}
                className="text-xs text-gray-600 hover:text-gray-800 underline"
                type="button"
              >
                {isExpanded ? 'Hide description' : 'Show description'}
              </button>
            )}
          </div>

          {/* Approval Status Badge */}
          {submitted && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getApprovalStatusColor(approvalStatus)}`}>
              {getApprovalIcon(approvalStatus)}
              <span>{approvalStatus.replace('_', ' ')}</span>
            </div>
          )}
        </div>

        {/* Description (collapsible) */}
        {item.description && isExpanded && (
          <div className="bg-white/80 p-3 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-700 leading-relaxed">
              {item.description}
            </p>
          </div>
        )}

        {/* Evidence URL Input Section */}
        <div className="space-y-2">
          <label 
            htmlFor={`evidence-url-${evidence.type}-${item.id}`}
            className="block text-sm font-medium text-gray-700"
          >
            Evidence URL:
          </label>
          
          <div className="flex gap-2">
            <input
              id={`evidence-url-${evidence.type}-${item.id}`}
              type="url"
              value={url}
              onChange={(e) => onUrlChange(e.target.value)}
              placeholder="https://example.com/your-evidence"
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={loading || submitted}
              aria-describedby={error ? `error-${evidence.type}-${item.id}` : undefined}
            />
            
            {/* Action Buttons */}
            <div className="flex gap-1">
              {url && !submitted && (
                <button
                  onClick={onRemove}
                  disabled={loading}
                  className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  type="button"
                  title="Clear evidence"
                  aria-label="Clear evidence"
                >
                  <FaTrash className="w-3 h-3" />
                </button>
              )}
              
              {url && !submitted && (
                <button
                  onClick={onSubmit}
                  disabled={loading || !url.trim()}
                  className="px-3 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  type="button"
                  aria-label="Submit evidence"
                >
                  {loading ? (
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <FaPaperPlane className="w-3 h-3" />
                  )}
                  <span className="text-xs">{loading ? 'Submitting...' : 'Submit'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div 
            id={`error-${evidence.type}-${item.id}`}
            className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Success Message */}
        {submitted && !error && (
          <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg p-2">
            ✅ Evidence submitted successfully
          </div>
        )}
      </div>
    </li>
  );
});

TpqiEvidenceItem.displayName = "TpqiEvidenceItem";

export default TpqiEvidenceItem;
