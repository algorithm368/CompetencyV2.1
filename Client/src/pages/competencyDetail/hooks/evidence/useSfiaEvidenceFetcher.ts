import { useState, useEffect, useCallback } from "react";
import { GetSfiaEvidenceService } from "../../services/getSfiaEvidenceAPI";

interface EvidenceData {
  [subSkillId: number]: {
    url: string;
    approvalStatus?: string;
  };
}

export function useEvidenceFetcher(skillCode: string) {
  const [evidenceData, setEvidenceData] = useState<EvidenceData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvidence = useCallback(async () => {
    if (!skillCode) return;

    setLoading(true);
    setError(null);

    try {
      const evidenceService = new GetSfiaEvidenceService();

      const response = await evidenceService.getEvidence({
        skillCode,
      });

      if (response.success && response.data) {
        const transformedData: EvidenceData = Object.keys(response.data).reduce(
          (acc, key) => {
            const subSkillId = parseInt(key, 10);
            const evidenceItem =
              response.data![key as keyof typeof response.data];
            if (
              evidenceItem &&
              typeof evidenceItem === "object" &&
              !Array.isArray(evidenceItem) &&
              "url" in evidenceItem
            ) {
              acc[subSkillId] = {
                url: (evidenceItem as { url: string }).url,
                approvalStatus: (evidenceItem as { approvalStatus?: string })
                  .approvalStatus,
              };
            }
            if (
              evidenceItem &&
              typeof evidenceItem === "object" &&
              !Array.isArray(evidenceItem) &&
              "url" in evidenceItem
            ) {
              if (typeof (evidenceItem as { url: string }).url === "string") {
                acc[subSkillId] = {
                  url: (evidenceItem as { url: string }).url,
                  approvalStatus: (evidenceItem as { approvalStatus?: string })
                    .approvalStatus,
                };
              }
            }
            return acc;
          },
          {} as EvidenceData
        );
        setEvidenceData(transformedData);
      } else {
        setEvidenceData({});
        setError(response.message || "No evidence found");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch evidence");
      console.error("Evidence fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [skillCode]);

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
