import { useState, useEffect, useCallback } from "react";
import { GetSfiaEvidenceService, EvidenceData as EvidenceDataType } from "../../services/getSfiaEvidenceAPI";

export function useEvidenceFetcher(skillCode: string, userId: string) {
  const [evidenceData, setEvidenceData] = useState<EvidenceDataType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvidence = useCallback(async () => {
    if (!skillCode || !userId) return;

    setLoading(true);
    setError(null);

    try {
      const evidenceService = new GetSfiaEvidenceService();

      const response = await evidenceService.getEvidence({
        skillCode,
        userId,
      });

      if (response.success && response.data) {
        setEvidenceData(response.data);
      } else {
        setEvidenceData(null);
        setError(response.message || "No evidence found");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch evidence");
      console.error("Evidence fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [skillCode, userId]);

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
