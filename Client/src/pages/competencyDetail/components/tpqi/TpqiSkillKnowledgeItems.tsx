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
import TpqiEvidenceItem from "./TpqiEvidenceItem";

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
        <h4 className="font-medium text-gray-800 mb-2 flex items-center">
          <FaCertificate className="w-4 h-4 mr-2 text-green-600" />
          Skills:
        </h4>
        <ul className="space-y-4">
          {skills.map((skill) => {
            const key = `skill-${skill.id}`;
            return (
              <TpqiEvidenceItem
                key={skill.id}
                evidence={{ type: "skill", id: skill.id }}
                item={{
                  id: skill.id,
                  name: skill.skill_name,
                  description: skill.skill_description,
                }}
                url={evidenceState.urls[key] || ""}
                approvalStatus={
                  evidenceState.approvalStatus[key] || "NOT_APPROVED"
                }
                submitted={evidenceState.submitted[key] || false}
                loading={evidenceState.loading[key] || false}
                error={evidenceState.errors[key] || ""}
                onUrlChange={handleUrlChange(skill.id)}
                onRemove={handleRemove(skill.id)}
                onSubmit={handleSubmit(skill.id)}
              />
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
        <h4 className="font-medium text-gray-800 mb-2 flex items-center">
          <FaCertificate className="w-4 h-4 mr-2 text-green-600" />
          Knowledge:
        </h4>
        <ul className="space-y-4">
          {knowledge.map((item) => {
            const key = `knowledge-${item.id}`;
            return (
              <TpqiEvidenceItem
                key={item.id}
                evidence={{ type: "knowledge", id: item.id }}
                item={{
                  id: item.id,
                  name: item.knowledge_name,
                  description: item.knowledge_description,
                }}
                url={evidenceState.urls[key] || ""}
                approvalStatus={
                  evidenceState.approvalStatus[key] || "NOT_APPROVED"
                }
                submitted={evidenceState.submitted[key] || false}
                loading={evidenceState.loading[key] || false}
                error={evidenceState.errors[key] || ""}
                onUrlChange={handleUrlChange(item.id)}
                onRemove={handleRemove(item.id)}
                onSubmit={handleSubmit(item.id)}
              />
            );
          })}
        </ul>
      </div>
    );
  }
);
KnowledgeList.displayName = "KnowledgeList";

export default TpqiSkillKnowledgeItems;
