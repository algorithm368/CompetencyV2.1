/**
 * Standard API response interface used across the application.
 * Provides consistent structure for all API responses.
 */
export interface ApiResponse {
  /**
   * Indicates whether the API request was successful.
   */
  success: boolean;

  /**
   * Optional message providing additional information about the response.
   * Typically used for error messages or success notifications.
   */
  message?: string;

  /**
   * Optional data payload returned by the API.
   * The structure varies depending on the specific endpoint.
   */
  data?: unknown;
}

/**
 * Generic API response interface with typed data.
 * Allows for type-safe handling of API responses.
 */
export interface TypedApiResponse<T> extends ApiResponse {
  /**
   * Typed data payload returned by the API.
   */
  data?: T;
}

/**
 * API error response interface for error handling.
 */
export interface ApiErrorResponse extends ApiResponse {
  success: false;
  message: string;
  error?: {
    code?: string;
    details?: unknown;
  };
}

/**
 * API success response interface for successful requests.
 */
export interface ApiSuccessResponse<T = unknown> extends ApiResponse {
  success: true;
  data: T;
  message?: string;
}
