import React, { useState, useMemo } from "react";
import { FaGraduationCap, FaCheckCircle } from "react-icons/fa";
import UrlInputBox from "./UrlInputBox";
import { useAuth } from "@Contexts/AuthContext";

interface SfiaSubSkill {
  id: number;
  subskill_text: string | null;
}

interface SfiaDescription {
  id: number;
  description_text: string | null;
  subskills: SfiaSubSkill[];
}

interface SfiaLevel {
  id: number;
  level_name: string | null;
  descriptions: SfiaDescription[];
}

interface SfiaSectionProps {
  levels: SfiaLevel[];
}

interface SubSkillItemProps {
  subskill: SfiaSubSkill;
  url: string;
  submitted: boolean;
  loading: boolean;
  error: string;
  onUrlChange: (value: string) => void;
  onRemove: () => void;
  onSubmit: () => void;
}

interface SubmitEvidenceRequest {
  subSkillId: number;
  evidenceText: string;
  evidenceUrl?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

const SubSkillItem: React.FC<SubSkillItemProps> = ({
  subskill,
  url,
  submitted,
  loading,
  error,
  onUrlChange,
  onRemove,
  onSubmit,
}) => (
  <li className="flex flex-col gap-1">
    <div className="flex items-start">
      <FaCheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
      <span className="text-gray-700">{subskill.subskill_text}</span>
    </div>
    <div className="flex-1 min-w-0">
      <UrlInputBox
        url={url}
        onChange={onUrlChange}
        onRemove={onRemove}
        onSubmit={onSubmit}
        placeholder="Enter evidence URL or description"
        colorClass="border-blue-300"
        disabled={loading || submitted}
      />

      {/* Loading indicator */}
      {loading && (
        <span className="text-blue-600 text-sm mt-1 block">
          🔄 Submitting evidence...
        </span>
      )}

      {/* Success message */}
      {submitted && !loading && (
        <span className="text-green-600 text-sm mt-1 block">
          ✅ Evidence submitted successfully!
        </span>
      )}

      {/* Error message */}
      {error && !loading && (
        <span className="text-red-600 text-sm mt-1 block">❌ {error}</span>
      )}
    </div>
  </li>
);

const SfiaSection: React.FC<SfiaSectionProps> = ({ levels }) => {
  const [urls, setUrls] = useState<{ [id: string]: string }>({});
  const [submitted, setSubmitted] = useState<{ [id: string]: boolean }>({});
  const [loading, setLoading] = useState<{ [id: string]: boolean }>({});
  const [errors, setErrors] = useState<{ [id: string]: string }>({});

  // Get authentication context
  const { accessToken } = useAuth();

  // API function to submit evidence
  const BASE_API = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  // API function to submit evidence
  const submitEvidence = async (
    request: SubmitEvidenceRequest
  ): Promise<ApiResponse> => {
    if (!accessToken) {
      throw new Error("User is not authenticated");
    }

    // Use correct API endpoint with BASE_API
    const response = await fetch(`${BASE_API}/api/sfia/evidence`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(request),
    });

    // Handle response properly
    let result;
    try {
      result = await response.json();
    } catch (e) {
      // Handle case where response is empty or not JSON
      if (response.ok) {
        result = { success: true, message: "Evidence submitted successfully" };
      } else {
        console.error("Error parsing response JSON:", e);
        result = {
          success: false,
          message: `HTTP ${response.status}: ${response.statusText}`,
        };
      }
    }

    if (!response.ok) {
      throw new Error(
        result.message || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return result;
  };

  // Helper function to check if a description has meaningful content
  const hasValidContent = (desc: SfiaDescription): boolean => {
    const hasDescriptionText = desc.description_text?.trim();
    const hasSubSkills = desc.subskills?.some((subskill) =>
      subskill.subskill_text?.trim()
    );
    return !!(hasDescriptionText || hasSubSkills);
  };

  // Filter out levels that have no meaningful content
  const filteredLevels = useMemo(() => {
    return levels.filter((level) => {
      if (!level.descriptions?.length) {
        return false;
      }
      const hasValidDescriptions = level.descriptions.some(hasValidContent);
      return hasValidDescriptions;
    });
  }, [levels]);

  const handleUrlChange = (id: number, value: string) => {
    setUrls((prev) => ({ ...prev, [id.toString()]: value }));
    // Clear any previous error when user starts typing
    if (errors[id.toString()]) {
      setErrors((prev) => ({ ...prev, [id.toString()]: "" }));
    }
  };

  const handleRemove = (id: number) => {
    setUrls((prev) => ({ ...prev, [id.toString()]: "" }));
    setSubmitted((prev) => ({ ...prev, [id.toString()]: false }));
    setErrors((prev) => ({ ...prev, [id.toString()]: "" }));
  };

  const handleSubmit = async (id: number) => {
    const idStr = id.toString();
    const evidenceUrl = urls[idStr];
    // Basic validation
    if (!evidenceUrl || evidenceUrl.trim() === "") {
      setErrors((prev) => ({
        ...prev,
        [idStr]: "Please enter evidence URL or description.",
      }));
      return;
    }

    // Check if user is authenticated
    if (!accessToken) {
      setErrors((prev) => ({
        ...prev,
        [idStr]: "Please log in to submit evidence",
      }));
      return;
    }

    // Set loading state
    setLoading((prev) => ({ ...prev, [idStr]: true }));
    setErrors((prev) => ({ ...prev, [idStr]: "" }));

    try {
      // Fix URL validation logic
      const isValidUrl =
        evidenceUrl.startsWith("http://") || evidenceUrl.startsWith("https://");

      // Prepare evidence data
      const evidenceRequest: SubmitEvidenceRequest = {
        subSkillId: id,
        evidenceText: evidenceUrl, // Using URL as evidence text for now
        evidenceUrl: isValidUrl ? evidenceUrl : undefined,
      };

      // Submit evidence
      const response = await submitEvidence(evidenceRequest);

      if (response.success) {
        setSubmitted((prev) => ({
          ...prev,
          [idStr]: true,
        }));
        console.log("Evidence submitted successfully:", response.data);
      } else {
        setErrors((prev) => ({
          ...prev,
          [idStr]: response.message || "Failed to submit evidence.",
        }));
      }
    } catch (error: any) {
      console.error("Error submitting evidence:", error);
      setErrors((prev) => ({
        ...prev,
        [idStr]:
          error.message || "Failed to submit evidence. Please try again.",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, [idStr]: false }));
    }
  };

  // Create callback functions to avoid deep nesting
  const createSubSkillCallbacks = useMemo(() => {
    return (subSkillId: number) => ({
      onUrlChange: (value: string) => handleUrlChange(subSkillId, value),
      onRemove: () => handleRemove(subSkillId),
      onSubmit: () => handleSubmit(subSkillId),
    });
  }, [accessToken]);

  // Don't render the section if no levels have content
  if (filteredLevels.length === 0) {
    return (
      <section className="relative bg-gradient-to-b from-blue-50 via-white to-blue-25 backdrop-blur-xl rounded-3xl p-8 border border-blue-100 shadow-1xl overflow-hidden">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <FaGraduationCap className="w-6 h-6 mr-3 text-blue-600" />
          Skill Levels
        </h2>
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">
            No skill level information available for this competency.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-gradient-to-b from-blue-50 via-white to-blue-25 backdrop-blur-xl rounded-3xl p-8 border border-blue-100 shadow-1xl overflow-hidden">
      {/* Decorative blurred shapes */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-20 pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20 pointer-events-none"></div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <FaGraduationCap className="w-6 h-6 mr-3 text-blue-600" />
        Skill Levels
      </h2>
      <div className="flex flex-col gap-6">
        {filteredLevels.map((level, index) => {
          // Filter descriptions that have content
          const filteredDescriptions =
            level.descriptions.filter(hasValidContent);

          // Don't render the level if no valid descriptions remain after filtering
          if (filteredDescriptions.length === 0) {
            return null;
          }

          // Count total subskills for this level
          const totalSubskills = filteredDescriptions.reduce((count, desc) => {
            return (
              count +
              (desc.subskills?.filter((subskill) =>
                subskill.subskill_text?.trim()
              ).length || 0)
            );
          }, 0);

          return (
            <div key={level.id} className="mb-8">
              <div className="flex flex-col p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-blue-200 gap-2 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                {/* Decorative dot */}
                <div className="absolute top-2 right-4 w-2 h-2 bg-blue-400 rounded-full opacity-20"></div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center justify-between">
                  <span>
                    {level.level_name
                      ? `Level ${level.level_name}`
                      : `Level ${index + 1}`}
                  </span>
                  {totalSubskills > 0 && (
                    <span className="text-sm font-normal text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                      {totalSubskills} subskill{totalSubskills !== 1 ? "s" : ""}
                    </span>
                  )}
                </h3>
                {filteredDescriptions.map((desc) => (
                  <div key={desc.id} className="mb-4">
                    {desc.description_text?.trim() && (
                      <p className="text-gray-700 mb-3">
                        {desc.description_text}
                      </p>
                    )}
                    {desc.subskills && desc.subskills.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">
                          SubSkills:
                        </h4>
                        <ul className="space-y-4">
                          {desc.subskills
                            .filter((subskill) =>
                              subskill.subskill_text?.trim()
                            )
                            .map((subskill) => {
                              const idStr = subskill.id.toString();

                              return (
                                <SubSkillItem
                                  key={subskill.id}
                                  subskill={subskill}
                                  url={urls[idStr] || ""}
                                  submitted={submitted[idStr] || false}
                                  loading={loading[idStr] || false}
                                  error={errors[idStr] || ""}
                                  onUrlChange={(value: string) =>
                                    handleUrlChange(subskill.id, value)
                                  }
                                  onRemove={() => handleRemove(subskill.id)}
                                  onSubmit={() => handleSubmit(subskill.id)}
                                />
                              );
                            })}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SfiaSection;
