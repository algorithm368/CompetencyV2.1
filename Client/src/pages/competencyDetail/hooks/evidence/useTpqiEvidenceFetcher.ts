import { useState, useEffect, useCallback } from "react";
import api from "@Services/api";

interface TpqiEvidenceData {
  skills?: {
    [skillId: number]: { evidenceUrl: string; approvalStatus: string | null };
  };
  knowledge?: {
    [knowledgeId: number]: {
      evidenceUrl: string;
      approvalStatus: string | null;
    };
  };
}
interface ApiEvidenceItem {
  id: number;
  evidenceUrl: string;
  approvalStatus?: string | null;
}
interface UseTpqiEvidenceFetcherResult {
  evidenceData: TpqiEvidenceData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching existing TPQI evidence data
 * Follows the same pattern as useSfiaEvidenceFetcher
 */
export const useTpqiEvidenceFetcher = (unitCode: string): UseTpqiEvidenceFetcherResult => {
  const [evidenceData, setEvidenceData] = useState<TpqiEvidenceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvidence = useCallback(async () => {
    if (!unitCode) return;

    setLoading(true);
    setError(null);

    try {
      const { data: responseData } = await api.post("/tpqi/evidence/get", { unitCode });

      if (!responseData.success || !responseData.data) {
        setEvidenceData({ skills: {}, knowledge: {} });
        return;
      }

      const { data } = responseData;
      const transformedData: TpqiEvidenceData = { skills: {}, knowledge: {} };

      if (Array.isArray(data.skillEvidences)) {
        data.skillEvidences.forEach((evidence: ApiEvidenceItem) => {
          if (evidence.id && evidence.evidenceUrl) {
            transformedData.skills![evidence.id] = {
              evidenceUrl: evidence.evidenceUrl,
              approvalStatus: evidence.approvalStatus || null,
            };
          }
        });
      }

      if (Array.isArray(data.knowledgeEvidences)) {
        data.knowledgeEvidences.forEach((evidence: ApiEvidenceItem) => {
          if (evidence.id && evidence.evidenceUrl) {
            transformedData.knowledge![evidence.id] = {
              evidenceUrl: evidence.evidenceUrl,
              approvalStatus: evidence.approvalStatus || null,
            };
          }
        });
      }

      setEvidenceData(transformedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch evidence");
      setEvidenceData({ skills: {}, knowledge: {} });
      console.error("Failed to fetch TPQI evidence:", err);
    } finally {
      setLoading(false);
    }
  }, [unitCode]);

  useEffect(() => {
    fetchEvidence();
  }, [fetchEvidence]);

  return {
    evidenceData,
    loading,
    error,
    refetch: fetchEvidence,
  };
};
