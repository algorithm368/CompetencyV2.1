import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@Contexts/AuthContext";

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
export const useTpqiEvidenceFetcher = (
  unitCode: string
): UseTpqiEvidenceFetcherResult => {
  const [evidenceData, setEvidenceData] = useState<TpqiEvidenceData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { accessToken } = useAuth();

  const fetchEvidence = useCallback(async () => {
    if (!unitCode || !accessToken) {
      console.log("Missing unitCode or accessToken:", {
        unitCode,
        hasToken: !!accessToken,
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const baseApi = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${baseApi}/api/tpqi/evidence/get`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ unitCode }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response not OK:", response.status, errorText);
        throw new Error(`Failed to fetch evidence: ${response.status}`);
      }

      const responseData = await response.json();

      // Check if the response is successful and has data
      if (!responseData.success || !responseData.data) {
        setEvidenceData({
          skills: {},
          knowledge: {},
        });
        return;
      }

      const { data } = responseData;

      // Transform the service response to match the expected format
      const transformedData: TpqiEvidenceData = {
        skills: {},
        knowledge: {},
      };

      // Transform skill evidences
      if (data.skillEvidences && Array.isArray(data.skillEvidences)) {
        data.skillEvidences.forEach((evidence: any) => {
          if (evidence.id && evidence.evidenceUrl) {
            transformedData.skills![evidence.id] = {
              evidenceUrl: evidence.evidenceUrl,
              approvalStatus: evidence.approvalStatus || null,
            };
          }
        });
      }

      // Transform knowledge evidences
      if (data.knowledgeEvidences && Array.isArray(data.knowledgeEvidences)) {
        data.knowledgeEvidences.forEach((evidence: unknown) => {
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
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch evidence";
      setError(errorMessage);
      console.error("Failed to fetch TPQI evidence:", err);

      // Set empty data on error to prevent null state
      setEvidenceData({
        skills: {},
        knowledge: {},
      });
    } finally {
      setLoading(false);
    }
  }, [unitCode, accessToken]);

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
