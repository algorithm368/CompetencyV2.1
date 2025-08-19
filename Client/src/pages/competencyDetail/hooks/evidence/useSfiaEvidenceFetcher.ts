import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@Contexts/AuthContext";
import { GetSfiaEvidenceService } from "../../services/getSfiaEvidenceAPI";

interface EvidenceData {
  [subSkillId: number]: {
    evidence: string;
    approvalStatus?: string;
  };
}

export function useEvidenceFetcher(skillCode: string) {
  const { accessToken } = useAuth();
  const [evidenceData, setEvidenceData] = useState<EvidenceData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvidence = useCallback(async () => {
    if (!accessToken || !skillCode) return;

    setLoading(true);
    setError(null);

    try {
      const baseApi = import.meta.env.VITE_API_BASE_URL;
      const evidenceService = new GetSfiaEvidenceService(baseApi, accessToken);

      const response = await evidenceService.getEvidence({
        skillCode,
      });

      if (response.success && response.data?.evidences) {
        const evidenceMap: EvidenceData = {};
        response.data.evidences.forEach((evidence: unknown) => {
          if (evidence.evidenceUrl) {
            evidenceMap[evidence.id] = {
              url: evidence.evidenceUrl,
              approvalStatus: evidence.approvalStatus,
            };
          }
        });
        setEvidenceData(evidenceMap);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch evidence");
      console.error("Evidence fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [accessToken, skillCode]);

  useEffect(() => {
    fetchEvidence();
  }, [fetchEvidence]);

  return {
    evidenceData,
    loading,
    error,
    refetch: fetchEvidence,
  };
}
