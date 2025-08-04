import { SubmitEvidenceRequest, ApiResponse } from "../types/sfia";

/**
 * Service class for managing SFIA evidence submissions.
 * Handles authenticated API requests and basic client-side validations.
 */
export class SfiaEvidenceService {
  private readonly baseApiUrl: string;
  private readonly accessToken: string | null;

  /**
   * Creates an instance of SfiaEvidenceService.
   *
   * @param baseApiUrl - The base URL of the backend API.
   * @param accessToken - The Bearer token for authenticated API access.
   */
  constructor(baseApiUrl: string, accessToken: string | null) {
    this.baseApiUrl = baseApiUrl;
    this.accessToken = accessToken;
  }

  /**
   * Submits evidence data to the backend API.
   *
   * @param request - The evidence data conforming to SubmitEvidenceRequest.
   * @returns A promise resolving to ApiResponse indicating the result.
   * @throws Error if the user is unauthenticated or the API request fails.
   */
  async submitEvidence(request: SubmitEvidenceRequest): Promise<ApiResponse> {
    if (!this.accessToken) {
      throw new Error("User is not authenticated");
    }

    const response = await fetch(`${this.baseApiUrl}/api/sfia/evidence`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.accessToken}`,
      },
      body: JSON.stringify(request),
    });

    let result;
    try {
      result = await response.json();
    } catch (e) {
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
  }

  /**
   * Validates whether the given evidence URL or description is provided.
   *
   * @param url - The evidence URL or description.
   * @returns An object indicating validity and an optional error message.
   */
  validateEvidenceUrl(url: string): { isValid: boolean; error?: string } {
    if (!url || url.trim() === "") {
      return {
        isValid: false,
        error: "Please enter evidence URL or description.",
      };
    }
    return { isValid: true };
  }

  /**
   * Checks if the provided URL is a valid HTTP or HTTPS URL.
   *
   * @param url - The URL to validate.
   * @returns True if the URL starts with 'http://' or 'https://', otherwise false.
   */
  isValidUrl(url: string): boolean {
    return url.startsWith("http://") || url.startsWith("https://");
  }
}
