import React, { useMemo, useEffect, useCallback, memo } from "react";
import {
  FaCertificate,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";
import {
  useTpqiEvidenceSender,
  TpqiEvidenceState,
  EvidenceType,
} from "../../hooks/evidence/useTpqiEvidenceSender";
import { useTpqiEvidenceFetcher } from "../../hooks/evidence/useTpqiEvidenceFetcher";
import { TpqiUnit, TpqiSkill, TpqiKnowledge } from "../../types/tpqi";
import {
  filterValidUnits,
  filterValidSkills,
  filterValidKnowledge,
  countTpqiItems,
} from "../../utils/tpqiUtils";
import UrlInputBox from "../ui/UrlInputBox";

// Types
interface TpqiSkillKnowledgeItemsProps {
  units: TpqiUnit[];
  unitCode: string;
}

interface EvidenceHandlers {
  onUrlChange: (evidence: EvidenceType, value: string) => void;
  onRemove: (evidence: EvidenceType) => void;
  onSubmit: (evidence: EvidenceType) => void;
}

interface UnitsListProps {
  filteredUnits: TpqiUnit[];
  evidenceState: TpqiEvidenceState;
  handlers: EvidenceHandlers;
}

interface UnitProps {
  unit: TpqiUnit;
  evidenceState: TpqiEvidenceState;
  handlers: EvidenceHandlers;
}

interface SkillsListProps {
  skills: TpqiSkill[];
  evidenceState: TpqiEvidenceState;
  handlers: EvidenceHandlers;
}

interface KnowledgeListProps {
  knowledge: TpqiKnowledge[];
  evidenceState: TpqiEvidenceState;
  handlers: EvidenceHandlers;
}

const TpqiSkillKnowledgeItems: React.FC<TpqiSkillKnowledgeItemsProps> = memo(
  ({ units, unitCode }) => {
    const {
      evidenceState,
      handleUrlChange,
      handleRemove,
      handleSubmit,
      initializeEvidenceUrls,
    } = useTpqiEvidenceSender();

    const {
      evidenceData,
      loading: evidenceLoading,
      error: evidenceError,
    } = useTpqiEvidenceFetcher(unitCode);

    useEffect(() => {
      if (evidenceData && (evidenceData.skills || evidenceData.knowledge)) {
        initializeEvidenceUrls(evidenceData);
      }
    }, [evidenceData, initializeEvidenceUrls]);

    const filteredUnits = useMemo(() => filterValidUnits(units), [units]);

    const handlers = useMemo<EvidenceHandlers>(
      () => ({
        onUrlChange: handleUrlChange,
        onRemove: handleRemove,
        onSubmit: (evidence: EvidenceType) => {
          void handleSubmit(evidence);
        },
      }),
      [handleUrlChange, handleRemove, handleSubmit]
    );

    if (filteredUnits.length === 0) {
      return <EmptyTpqiSection />;
    }

    return (
      <section
        className="relative bg-gradient-to-b from-green-50 via-white to-green-25 backdrop-blur-xl rounded-3xl p-8 border border-green-100 shadow-lg overflow-hidden"
        aria-labelledby="tpqi-units-heading"
      >
        <DecorativeBackground />
        <SectionHeader />

        <ErrorBoundary>
          <LoadingStates
            evidenceLoading={evidenceLoading}
            evidenceError={evidenceError}
          />

          <UnitsList
            filteredUnits={filteredUnits}
            evidenceState={evidenceState}
            handlers={handlers}
          />
        </ErrorBoundary>
      </section>
    );
  }
);

TpqiSkillKnowledgeItems.displayName = "TpqiSkillKnowledgeItems";

const LoadingStates: React.FC<{
  evidenceLoading: boolean;
  evidenceError: string | null;
}> = memo(({ evidenceLoading, evidenceError }) => (
  <>
    {evidenceLoading && (
      <output className="text-center py-4" aria-live="polite">
        <span className="text-green-600">🔄 Loading existing evidence...</span>
      </output>
    )}
    {evidenceError && (
      <div className="text-center py-4" role="alert" aria-live="assertive">
        <span className="text-red-600">
          ⚠️ Failed to load evidence: {evidenceError}
        </span>
      </div>
    )}
  </>
));
LoadingStates.displayName = "LoadingStates";

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("TpqiSkillKnowledgeItems Error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-8" role="alert">
          <p className="text-red-500 text-lg">
            Something went wrong while loading TPQI units.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

const EmptyTpqiSection: React.FC = memo(() => (
  <section
    className="relative bg-gradient-to-b from-green-50 via-white to-green-25 backdrop-blur-xl rounded-3xl p-8 border border-green-100 shadow-lg overflow-hidden"
    aria-labelledby="tpqi-units-heading"
  >
    <SectionHeader />
    <div className="text-center py-8">
      <p className="text-gray-500 text-lg">
        No TPQI unit information available for this competency.
      </p>
    </div>
  </section>
));
EmptyTpqiSection.displayName = "EmptyTpqiSection";

const SectionHeader: React.FC = memo(() => (
  <h2
    id="tpqi-units-heading"
    className="text-2xl font-bold text-gray-800 mb-6 flex items-center"
  >
    <FaCertificate className="w-6 h-6 mr-3 text-green-600" aria-hidden="true" />
    TPQI Units
  </h2>
));
SectionHeader.displayName = "SectionHeader";

const DecorativeBackground: React.FC = memo(() => (
  <>
    <div
      className="absolute -top-24 -right-24 w-48 h-48 bg-green-200 rounded-full mix-blend-multiply filter blur-2xl opacity-20 pointer-events-none"
      aria-hidden="true"
    />
    <div
      className="absolute -bottom-24 -left-24 w-48 h-48 bg-green-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20 pointer-events-none"
      aria-hidden="true"
    />
  </>
));
DecorativeBackground.displayName = "DecorativeBackground";

const UnitsList: React.FC<UnitsListProps> = memo(
  ({ filteredUnits, evidenceState, handlers }) => (
    <ul className="flex flex-col gap-6">
      {filteredUnits.map((unit) => (
        <Unit
          key={unit.id}
          unit={unit}
          evidenceState={evidenceState}
          handlers={handlers}
        />
      ))}
    </ul>
  )
);
UnitsList.displayName = "UnitsList";

const Unit: React.FC<UnitProps> = memo(({ unit, evidenceState, handlers }) => {
  const filteredSkills = useMemo(
    () => filterValidSkills(unit.skills),
    [unit.skills]
  );
  const filteredKnowledge = useMemo(
    () => filterValidKnowledge(unit.knowledge),
    [unit.knowledge]
  );
  const itemCounts = useMemo(() => countTpqiItems(unit), [unit]);

  if (filteredSkills.length === 0 && filteredKnowledge.length === 0)
    return null;

  return (
    <li className="mb-8">
      <div className="flex flex-col p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-green-200 gap-2 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden">
        <div className="space-y-6">
          {filteredSkills.length > 0 && (
            <SkillsList
              skills={filteredSkills}
              evidenceState={evidenceState}
              handlers={handlers}
            />
          )}

          {filteredKnowledge.length > 0 && (
            <KnowledgeList
              knowledge={filteredKnowledge}
              evidenceState={evidenceState}
              handlers={handlers}
            />
          )}
        </div>
      </div>
    </li>
  );
});
Unit.displayName = "Unit";

const SkillsList: React.FC<SkillsListProps> = memo(
  ({ skills, evidenceState, handlers }) => {
    const handleUrlChange = useCallback(
      (skillId: number) => (value: string) =>
        handlers.onUrlChange({ type: "skill", id: skillId }, value),
      [handlers]
    );
    const handleRemove = useCallback(
      (skillId: number) => () =>
        handlers.onRemove({ type: "skill", id: skillId }),
      [handlers]
    );
    const handleSubmit = useCallback(
      (skillId: number) => () =>
        handlers.onSubmit({ type: "skill", id: skillId }),
      [handlers]
    );

    return (
      <div>
        <h4 className="font-medium text-gray-800 mb-4 flex items-center">
          <FaCertificate className="w-4 h-4 mr-2 text-green-600" />
          Skills ({skills.length})
        </h4>
        <ul className="space-y-4">
          {skills.map((skill) => {
            const key = `skill-${skill.id}`;
            const isSubmitted = evidenceState.submitted[key] || false;
            const isLoading = evidenceState.loading[key] || false;
            const error = evidenceState.errors[key] || "";
            const url = evidenceState.urls[key] || "";
            const approvalStatus =
              evidenceState.approvalStatus[key] || "NOT_APPROVED";

            // Determine status for icon and badge
            const getStatusIcon = () => {
              if (isLoading)
                return (
                  <FaSpinner className="w-5 h-5 text-blue-500 animate-spin flex-shrink-0" />
                );
              if (error)
                return (
                  <FaExclamationTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                );
              if (isSubmitted) {
                if (approvalStatus === "APPROVED")
                  return (
                    <FaCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  );
                if (approvalStatus === "REJECTED")
                  return (
                    <FaTimesCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  );
                return (
                  <FaClock className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                );
              }
              return url ? (
                <div className="w-5 h-5 border-2 border-blue-300 rounded-full flex-shrink-0" />
              ) : (
                <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex-shrink-0" />
              );
            };

            const getStatusBadge = () => {
              if (isLoading)
                return (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    Submitting...
                  </span>
                );
              if (error)
                return (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                    Error
                  </span>
                );
              if (isSubmitted) {
                if (approvalStatus === "APPROVED")
                  return (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Approved
                    </span>
                  );
                if (approvalStatus === "REJECTED")
                  return (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                      Rejected
                    </span>
                  );
                return (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                    Pending Approval
                  </span>
                );
              }
              return url ? (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                  Ready to Submit
                </span>
              ) : (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                  No Evidence
                </span>
              );
            };

            return (
              <li
                key={skill.id}
                className="flex flex-col gap-3"
                aria-labelledby={`skill-${skill.id}`}
              >
                {/* Skill header with status indicator */}
                <div className="flex items-start gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    {getStatusIcon()}
                    {/* Skill text */}
                    <span
                      id={`skill-${skill.id}`}
                      className="text-gray-800 leading-relaxed"
                    >
                      {skill.skill_name}
                    </span>
                  </div>
                  {getStatusBadge()}
                </div>

                {/* Evidence input area */}
                <div className="ml-8 flex-1 min-w-0">
                  <UrlInputBox
                    url={url}
                    onChange={handleUrlChange(skill.id)}
                    onRemove={handleRemove(skill.id)}
                    onSubmit={handleSubmit(skill.id)}
                    placeholder="Enter skill evidence URL"
                    colorClass="border-blue-300"
                    disabled={isLoading}
                    readonly={isSubmitted && !isLoading}
                    loading={isLoading}
                  />

                  {/* Status messages */}
                  <div className="mt-2 space-y-1">
                    {/* Loading state */}
                    {isLoading && (
                      <div
                        className="flex items-center gap-2 text-blue-600 text-sm"
                        aria-live="polite"
                      >
                        <FaSpinner className="w-3 h-3 animate-spin" />
                        <span>Submitting your evidence...</span>
                      </div>
                    )}

                    {/* Error state */}
                    {error && !isLoading && (
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
                    {!isLoading && !error && (
                      <>
                        {isSubmitted && approvalStatus === "APPROVED" && (
                          <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 border border-green-200 rounded p-2">
                            <FaCheckCircle className="w-3 h-3" />
                            <span>Your evidence has been approved! ✨</span>
                          </div>
                        )}
                        {isSubmitted && approvalStatus === "REJECTED" && (
                          <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded p-2">
                            <FaTimesCircle className="w-3 h-3" />
                            <span>
                              Your evidence was not approved. Please submit new
                              evidence.
                            </span>
                          </div>
                        )}
                        {isSubmitted &&
                          approvalStatus !== "APPROVED" &&
                          approvalStatus !== "REJECTED" && (
                            <div className="flex items-center gap-2 text-yellow-600 text-sm bg-yellow-50 border border-yellow-200 rounded p-2">
                              <FaClock className="w-3 h-3" />
                              <span>
                                Your evidence is pending review by an
                                administrator.
                              </span>
                            </div>
                          )}
                        {!isSubmitted && url && (
                          <div className="text-blue-600 text-sm">
                            👍 Ready to submit! Click the submit button when
                            you're satisfied with your evidence.
                          </div>
                        )}
                        {!url && (
                          <div className="text-gray-500 text-sm">
                            💡 Add a URL to online evidence demonstrating this
                            skill
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
);
SkillsList.displayName = "SkillsList";

const KnowledgeList: React.FC<KnowledgeListProps> = memo(
  ({ knowledge, evidenceState, handlers }) => {
    const handleUrlChange = useCallback(
      (knowledgeId: number) => (value: string) =>
        handlers.onUrlChange({ type: "knowledge", id: knowledgeId }, value),
      [handlers]
    );
    const handleRemove = useCallback(
      (knowledgeId: number) => () =>
        handlers.onRemove({ type: "knowledge", id: knowledgeId }),
      [handlers]
    );
    const handleSubmit = useCallback(
      (knowledgeId: number) => () =>
        handlers.onSubmit({ type: "knowledge", id: knowledgeId }),
      [handlers]
    );

    return (
      <div>
        <h4 className="font-medium text-gray-800 mb-4 flex items-center">
          <FaCertificate className="w-4 h-4 mr-2 text-green-600" />
          Knowledge ({knowledge.length})
        </h4>
        <ul className="space-y-4">
          {knowledge.map((item) => {
            const key = `knowledge-${item.id}`;
            const isSubmitted = evidenceState.submitted[key] || false;
            const isLoading = evidenceState.loading[key] || false;
            const error = evidenceState.errors[key] || "";
            const url = evidenceState.urls[key] || "";
            const approvalStatus =
              evidenceState.approvalStatus[key] || "NOT_APPROVED";

            // Determine status for icon and badge
            const getStatusIcon = () => {
              if (isLoading)
                return (
                  <FaSpinner className="w-5 h-5 text-purple-500 animate-spin flex-shrink-0" />
                );
              if (error)
                return (
                  <FaExclamationTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                );
              if (isSubmitted) {
                if (approvalStatus === "APPROVED")
                  return (
                    <FaCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  );
                if (approvalStatus === "REJECTED")
                  return (
                    <FaTimesCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  );
                return (
                  <FaClock className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                );
              }
              return url ? (
                <div className="w-5 h-5 border-2 border-purple-300 rounded-full flex-shrink-0" />
              ) : (
                <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex-shrink-0" />
              );
            };

            const getStatusBadge = () => {
              if (isLoading)
                return (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                    Submitting...
                  </span>
                );
              if (error)
                return (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                    Error
                  </span>
                );
              if (isSubmitted) {
                if (approvalStatus === "APPROVED")
                  return (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Approved
                    </span>
                  );
                if (approvalStatus === "REJECTED")
                  return (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                      Rejected
                    </span>
                  );
                return (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                    Pending Approval
                  </span>
                );
              }
              return url ? (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                  Ready to Submit
                </span>
              ) : (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                  No Evidence
                </span>
              );
            };

            return (
              <li
                key={item.id}
                className="flex flex-col gap-3"
                aria-labelledby={`knowledge-${item.id}`}
              >
                {/* Knowledge header with status indicator */}
                <div className="flex items-start gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    {getStatusIcon()}
                    {/* Knowledge text */}
                    <span
                      id={`knowledge-${item.id}`}
                      className="text-gray-800 leading-relaxed"
                    >
                      {item.knowledge_name}
                    </span>
                  </div>
                  {getStatusBadge()}
                </div>

                {/* Evidence input area */}
                <div className="ml-8 flex-1 min-w-0">
                  <UrlInputBox
                    url={url}
                    onChange={handleUrlChange(item.id)}
                    onRemove={handleRemove(item.id)}
                    onSubmit={handleSubmit(item.id)}
                    placeholder="Enter knowledge evidence URL"
                    colorClass="border-purple-300"
                    disabled={isLoading}
                    readonly={isSubmitted && !isLoading}
                    loading={isLoading}
                  />

                  {/* Status messages */}
                  <div className="mt-2 space-y-1">
                    {/* Loading state */}
                    {isLoading && (
                      <div
                        className="flex items-center gap-2 text-purple-600 text-sm"
                        aria-live="polite"
                      >
                        <FaSpinner className="w-3 h-3 animate-spin" />
                        <span>Submitting your evidence...</span>
                      </div>
                    )}

                    {/* Error state */}
                    {error && !isLoading && (
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
                    {!isLoading && !error && (
                      <>
                        {isSubmitted && approvalStatus === "APPROVED" && (
                          <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 border border-green-200 rounded p-2">
                            <FaCheckCircle className="w-3 h-3" />
                            <span>Your evidence has been approved! ✨</span>
                          </div>
                        )}
                        {isSubmitted && approvalStatus === "REJECTED" && (
                          <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded p-2">
                            <FaTimesCircle className="w-3 h-3" />
                            <span>
                              Your evidence was not approved. Please submit new
                              evidence.
                            </span>
                          </div>
                        )}
                        {isSubmitted &&
                          approvalStatus !== "APPROVED" &&
                          approvalStatus !== "REJECTED" && (
                            <div className="flex items-center gap-2 text-yellow-600 text-sm bg-yellow-50 border border-yellow-200 rounded p-2">
                              <FaClock className="w-3 h-3" />
                              <span>
                                Your evidence is pending review by an
                                administrator.
                              </span>
                            </div>
                          )}
                        {!isSubmitted && url && (
                          <div className="text-purple-600 text-sm">
                            👍 Ready to submit! Click the submit button when
                            you're satisfied with your evidence.
                          </div>
                        )}
                        {!url && (
                          <div className="text-gray-500 text-sm">
                            💡 Add a URL to online evidence demonstrating this
                            knowledge
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
);
KnowledgeList.displayName = "KnowledgeList";

export default TpqiSkillKnowledgeItems;
