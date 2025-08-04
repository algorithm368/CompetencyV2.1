import React, { useMemo, useEffect, useCallback, memo } from "react";
import { FaCertificate } from "react-icons/fa";
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
        <UnitHeader unit={unit} itemCounts={itemCounts} />

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

const UnitHeader: React.FC<{
  unit: TpqiUnit;
  itemCounts: { skills: number; knowledge: number; total: number };
}> = memo(({ unit, itemCounts }) => (
  <div className="mb-4">
    <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center justify-between">
      <span>
        {unit.unit_code} - {unit.unit_name}
      </span>
      {itemCounts.total > 0 && (
        <span
          className="text-sm font-normal text-green-600 bg-green-100 px-3 py-1 rounded-full"
          aria-label={`${itemCounts.total} item${
            itemCounts.total !== 1 ? "s" : ""
          }`}
        >
          {itemCounts.skills} skills, {itemCounts.knowledge} knowledge
        </span>
      )}
    </h3>
  </div>
));
UnitHeader.displayName = "UnitHeader";

// Helper functions for approval status
const getApprovalStatusClass = (status: string): string => {
  switch (status) {
    case "APPROVED":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "REJECTED":
      return "bg-red-50 text-red-700 border border-red-200";
    default:
      return "bg-amber-50 text-amber-700 border border-amber-200";
  }
};

const getApprovalStatusLabel = (status: string): string => {
  switch (status) {
    case "APPROVED":
      return "Approved";
    case "REJECTED":
      return "Requires Revision";
    default:
      return "Under Review";
  }
};

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
        <div className="space-y-6">
          {skills.map((skill) => {
            const key = `skill-${skill.id}`;
            const isSubmitted = evidenceState.submitted[key] || false;
            const isLoading = evidenceState.loading[key] || false;
            const error = evidenceState.errors[key] || "";
            const url = evidenceState.urls[key] || "";
            const approvalStatus =
              evidenceState.approvalStatus[key] || "NOT_APPROVED";

            return (
              <div
                key={skill.id}
                className="bg-white/60 border border-green-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200"
              >
                {/* Skill Header */}
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-800 text-lg mb-1">
                        {skill.skill_name}
                      </h5>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        🔧 Skill Evidence
                      </span>
                    </div>
                    {isSubmitted && (
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium shadow-sm ${getApprovalStatusClass(
                          approvalStatus
                        )}`}
                      >
                        {getApprovalStatusLabel(approvalStatus)}
                      </span>
                    )}
                  </div>

                  {skill.skill_description && (
                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg mt-3">
                      <h6 className="text-sm font-medium text-slate-700 mb-2">
                        Skill Description
                      </h6>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {skill.skill_description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Evidence Input */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label
                      htmlFor={`skill-evidence-${skill.id}`}
                      className="text-sm font-medium text-slate-700"
                    >
                      Evidence Documentation
                    </label>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      Required
                    </span>
                  </div>

                  <UrlInputBox
                    url={url}
                    onChange={handleUrlChange(skill.id)}
                    onRemove={handleRemove(skill.id)}
                    onSubmit={handleSubmit(skill.id)}
                    placeholder="https://example.com/your-skill-evidence"
                    colorClass="border-blue-300"
                    disabled={isLoading}
                    readonly={isSubmitted && approvalStatus === "APPROVED"}
                    loading={isLoading}
                  />

                  {error && (
                    <div className="mt-3 flex items-start gap-3 text-red-700 text-sm bg-red-50 border border-red-200 rounded-lg p-3 shadow-sm">
                      <span className="text-red-500">⚠️</span>
                      <div>
                        <p className="font-medium">Submission Error</p>
                        <p className="text-red-600 mt-1">{error}</p>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-slate-500 mt-2">
                    Provide a link to portfolio, documentation, or other
                    evidence demonstrating this skill
                  </p>
                </div>
              </div>
            );
          })}
        </div>
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
        <div className="space-y-6">
          {knowledge.map((item) => {
            const key = `knowledge-${item.id}`;
            const isSubmitted = evidenceState.submitted[key] || false;
            const isLoading = evidenceState.loading[key] || false;
            const error = evidenceState.errors[key] || "";
            const url = evidenceState.urls[key] || "";
            const approvalStatus =
              evidenceState.approvalStatus[key] || "NOT_APPROVED";

            return (
              <div
                key={item.id}
                className="bg-white/60 border border-green-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200"
              >
                {/* Knowledge Header */}
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-800 text-lg mb-1">
                        {item.knowledge_name}
                      </h5>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                        📚 Knowledge Evidence
                      </span>
                    </div>
                    {isSubmitted && (
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium shadow-sm ${getApprovalStatusClass(
                          approvalStatus
                        )}`}
                      >
                        {getApprovalStatusLabel(approvalStatus)}
                      </span>
                    )}
                  </div>

                  {item.knowledge_description && (
                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg mt-3">
                      <h6 className="text-sm font-medium text-slate-700 mb-2">
                        Knowledge Description
                      </h6>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {item.knowledge_description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Evidence Input */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label
                      htmlFor={`knowledge-evidence-${item.id}`}
                      className="text-sm font-medium text-slate-700"
                    >
                      Evidence Documentation
                    </label>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      Required
                    </span>
                  </div>

                  <UrlInputBox
                    url={url}
                    onChange={handleUrlChange(item.id)}
                    onRemove={handleRemove(item.id)}
                    onSubmit={handleSubmit(item.id)}
                    placeholder="https://example.com/your-knowledge-evidence"
                    colorClass="border-purple-300"
                    disabled={isLoading}
                    readonly={isSubmitted && approvalStatus === "APPROVED"}
                    loading={isLoading}
                  />

                  {error && (
                    <div className="mt-3 flex items-start gap-3 text-red-700 text-sm bg-red-50 border border-red-200 rounded-lg p-3 shadow-sm">
                      <span className="text-red-500">⚠️</span>
                      <div>
                        <p className="font-medium">Submission Error</p>
                        <p className="text-red-600 mt-1">{error}</p>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-slate-500 mt-2">
                    Provide a link to documentation, research, or other evidence
                    demonstrating this knowledge
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);
KnowledgeList.displayName = "KnowledgeList";

export default TpqiSkillKnowledgeItems;
