import { useEffect, useState } from "react";
import type { CompetencyResponse } from "../types/CompetencyTypes";
import { fetchCompetenciesBySearchTerm } from "../services/searchCompetencyAPI";

/**
 * @constant DEBOUNCE_DELAY
 * @description Defines the debounce delay in milliseconds. This constant dictates the amount of time
 * the hook will wait after the user stops typing before it triggers the API call. This optimization
 * prevents excessive API requests while the user is actively typing, conserving network resources
 * and reducing server load. A value of 500ms provides a responsive user experience without being overly aggressive.
 */
const DEBOUNCE_DELAY = 500;

/**
 * @type {ItemType}
 * @description Represents the structured format for a single Competency item that will be displayed in the UI.
 * This type definition ensures that components consuming this hook receive a consistent data structure,
 * making the rendering logic predictable and type-safe.
 * @property {string} id - A unique identifier for the Competency item, crucial for key-based rendering in React and for handling item-specific actions like navigation or selection.
 * @property {string} name - The display name of the Competency, which is the primary piece of information shown to the user.
 * @property {string} framework - The source or category from which the Competency data was fetched (e.g., 'O*NET', 'University Database'). This provides context to the user about the origin of the information.
 */
export type ItemType = {
  id: string;
  name: string;
  framework: string;
};

/**
 * @function getStructuredErrorMessage
 * @description Handles new structured server error responses
 */
const getStructuredErrorMessage = (errorType: string, message: string): string => {
  switch (errorType) {
    case 'validation':
      if (message?.includes('Search term must be at least')) {
        return "คำค้นหาต้องมีอย่างน้อย 2 ตัวอักษร";
      }
      if (message?.includes('too long')) {
        return "คำค้นหายาวเกินไป (สูงสุด 100 ตัวอักษร)";
      }
      if (message?.includes('searchTerm')) {
        return "กรุณาใส่คำค้นหาที่ถูกต้อง";
      }
      return "ข้อมูลที่ป้อนไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่อีกครั้ง";
      
    case 'database_connection':
      return "ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้ กรุณาลองใหม่อีกครั้งในภายหลัง";
      
    case 'database_query':
      return "เกิดข้อผิดพลาดในการค้นหาข้อมูล กรุณาลองใหม่อีกครั้ง";
      
    case 'timeout':
      return "การค้นหาใช้เวลานานเกินไป กรุณาลองใหม่อีกครั้ง";
      
    default:
      return "เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง";
  }
};

/**
 * @function getHTTPErrorMessage
 * @description Handles HTTP status code errors
 */
const getHTTPErrorMessage = (status: number, responseData?: Record<string, unknown>): string => {
  switch (status) {
    case 400: {
      // Check if it's a specific validation error from server
      const serverMessage = responseData?.message;
      if (typeof serverMessage === 'string') {
        if (serverMessage.includes('Search term must be at least')) {
          return "คำค้นหาต้องมีอย่างน้อย 2 ตัวอักษร";
        }
        if (serverMessage.includes('too long')) {
          return "คำค้นหายาวเกินไป กรุณาใช้คำค้นหาที่สั้นกว่า";
        }
      }
      return "คำค้นหาไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่อีกครั้ง";
    }
    case 401:
      return "ไม่ได้รับอนุญาตให้เข้าถึงข้อมูล กรุณาเข้าสู่ระบบใหม่";
    case 403:
      return "ไม่มีสิทธิ์เข้าถึงข้อมูลนี้";
    case 404:
      return "ไม่พบข้อมูลที่ต้องการ";
    case 408:
    case 504:
      return "การเชื่อมต่อหมดเวลา กรุณาลองใหม่อีกครั้ง";
    case 429:
      return "ค้นหาบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่อีกครั้ง";
    case 500:
      return "เกิดข้อผิดพลาดในระบบเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้งในภายหลัง";
    case 502:
    case 503:
      return "เซิร์ฟเวอร์ไม่สามารถให้บริการได้ในขณะนี้ กรุณาลองใหม่อีกครั้งในภายหลัง";
    default:
      return `เกิดข้อผิดพลาดในการดึงข้อมูล (รหัสข้อผิดพลาด: ${status})`;
  }
};

// Helper functions for error handling
const handleAPIError = (error: { errorType?: string; message: string; status?: number }): string => {
  if (error.errorType) {
    return getStructuredErrorMessage(error.errorType, error.message);
  }
  if (error.status) {
    return getHTTPErrorMessage(error.status, { message: error.message });
  }
  return error.message;
};

const handleResponseError = (response: Record<string, unknown>): string | null => {
  if (response.data && typeof response.data === 'object') {
    const data = response.data as Record<string, unknown>;
    if (data.errorType && typeof data.errorType === 'string' && 
        data.message && typeof data.message === 'string') {
      return getStructuredErrorMessage(data.errorType, data.message);
    }
  }
  
  if (typeof response.status === 'number') {
    return getHTTPErrorMessage(response.status, response.data as Record<string, unknown>);
  }
  
  return null;
};

const handleCommonErrors = (error: Record<string, unknown>): string | null => {
  // Handle legacy fetch-related TypeError
  if (error instanceof TypeError && typeof error.message === 'string' && error.message.includes("fetch")) {
    return "ไม่สามารถเชื่อมต่อเครือข่ายได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตและลองใหม่อีกครั้ง";
  }
  
  // Handle generic network errors
  if (error.name === "NetworkError" || error.code === "NETWORK_ERROR") {
    return "เกิดปัญหาเครือข่าย กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตและลองใหม่อีกครั้ง";
  }
  
  // Handle timeout and abort errors
  if (error.name === "TimeoutError" || error.name === "AbortError") {
    return "การเชื่อมต่อหมดเวลา กรุณาลองใหม่อีกครั้ง";
  }
  
  const message = typeof error.message === 'string' ? error.message.toLowerCase() : '';
  
  // Check for network-related messages
  if (message.includes("network") || message.includes("fetch") || message.includes("connection")) {
    return "ไม่สามารถเชื่อมต่อเครือข่ายได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตและลองใหม่อีกครั้ง";
  }
  
  // Check for timeout messages
  if (message.includes("timeout")) {
    return "การเชื่อมต่อหมดเวลา กรุณาลองใหม่อีกครั้ง";
  }
  
  // Check for empty search term
  if (message.includes("empty") || message.includes("searchterm")) {
    return "กรุณาใส่คำค้นหา";
  }
  
  return null;
};

/**
 * @function getErrorMessage
 * @description A robust error message translator that handles both new structured server errors
 * and legacy error formats. It inspects an error object and returns a specific, 
 * user-friendly, and localized (Thai) error message.
 * @param {unknown} err - The error object caught in a try-catch block.
 * @returns {string} A human-readable error message in Thai.
 */
const getErrorMessage = (err: unknown): string => {
  // Type guard for error objects
  if (!err || typeof err !== 'object') {
    return "เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง";
  }

  const error = err as Record<string, unknown>;

  // Handle APIError from our API service
  if (error.name === 'APIError' && 'errorType' in error && 'message' in error) {
    return handleAPIError(error as { errorType?: string; message: string; status?: number });
  }

  // Handle new structured server error responses (legacy format)
  if (error.response && typeof error.response === 'object') {
    const responseResult = handleResponseError(error.response as Record<string, unknown>);
    if (responseResult) return responseResult;
  }

  // Handle common error types
  const commonResult = handleCommonErrors(error);
  if (commonResult) return commonResult;
  
  // Fallback for errors that have a message property
  if (typeof error.message === 'string' && error.message) {
    return `เกิดข้อผิดพลาดในการดึงข้อมูล: ${error.message}`;
  }
  
  // The ultimate fallback for any unexpected error type.
  return "เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง";
};

/**
 * @function useCompetencyResults
 * @description A comprehensive custom React hook designed to manage the entire lifecycle of searching for Competency data.
 * It encapsulates state management, debounced data fetching, URL synchronization, error handling, and pagination logic.
 * By abstracting these concerns, it provides a clean and reusable interface for any component that needs to display Competency search results.
 *
 * @returns {object} An object containing the state and handlers necessary to power a search interface.
 * This includes the current search query, search term for the input, loading and error states, paginated results,
 * total page count, and functions to handle user actions like searching and clearing.
 */
export function useCompetencyResults() {
  // --- STATE MANAGEMENT ---
  // The bedrock of our hook, these state variables track every aspect of the search UI's status.

  /**
   * @state {CompetencyResponse[]} results - Stores the raw, successful response from the Competency API.
   * It's structured as an array of groups, where each group contains a list of Competencies.
   * Initialized as an empty array to prevent rendering errors on the initial load.
   */
  const [results, setResults] = useState<CompetencyResponse[]>([]);

  /**
   * @state {boolean} loading - A boolean flag that indicates whether an API request is currently in flight.
   * This is essential for providing user feedback, such as displaying a loading spinner,
   * and preventing duplicate requests.
   */
  const [loading, setLoading] = useState(false);

  /**
   * @state {string | null} error - Holds a user-friendly error message if an API request fails.
   * A null value signifies that no error has occurred. This state is critical for communicating
   * issues (e.g., network failures, server errors) to the user.
   */
  const [error, setError] = useState<string | null>(null);

  /**
   * @state {string} searchTerm - Represents the live value from the search input field, as typed by the user.
   * It is initialized by reading the 'query' parameter from the current URL, which allows for deep linking
   * and preserves the search state across page reloads. This state is the primary trigger for the debounced search effect.
   */
  const [searchTerm, setSearchTerm] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("query") ?? "";
  });

  /**
   * @state {string} query - Stores the most recently *executed* search term. This is distinct from `searchTerm`,
   * which updates on every keystroke. `query` only updates *after* a search is successfully initiated,
   * making it the stable "source of truth" for what the current results are based on. It's useful for display purposes (e.g., "Results for 'developer'").
   */
  const [query, setQuery] = useState(searchTerm);

  /**
   * @state {number} currentPage - Tracks the currently viewed page of the search results.
   * It's fundamental for the pagination logic, determining which slice of the `allItems` array to display.
   */
  const [currentPage, setCurrentPage] = useState(1);

  /**
   * @constant {string} safeSearchTerm
   * @description A sanitized version of `searchTerm`. This ensures that any non-string value (which, while unlikely with standard input, is a good defensive practice)
   * is converted to an empty string, preventing runtime errors in subsequent string operations like `.trim()`.
   */
  const safeSearchTerm = typeof searchTerm === "string" ? searchTerm : "";

  // --- ERROR HANDLING UTILITY ---

  // --- SIDE EFFECTS ---

  /**
   * @effect Debounced Data Fetching
   * @description This is the core reactive part of the hook. It listens for changes to `safeSearchTerm`.
   * When the term changes, it doesn't fetch immediately. Instead, it schedules the fetch to run after
   * `DEBOUNCE_DELAY` milliseconds. This ensures the API is only called when the user pauses typing.
   * It also handles the complete fetching lifecycle: setting loading state, clearing previous errors,
   * making the API call, and updating state based on the result (success or failure).
   *
   * @dependency {string} safeSearchTerm - The effect re-runs whenever this value changes.
   */
  useEffect(() => {
    // If the search term is empty or just whitespace, reset the state to its initial, clean slate.
    // This provides an immediate, crisp response when the user clears the search input.
    if (!safeSearchTerm.trim()) {
      setResults([]);
      setError(null);
      setLoading(false);
      setQuery("");
      setCurrentPage(1);
      return; // Exit the effect early.
    }

    // A new search is about to begin. Set the loading state to true and clear any previous errors.
    setLoading(true);
    setError(null);

    // Set up the debounced execution using setTimeout.
    const handler = setTimeout(async () => {
      try {
        // Execute the search
        const data = await fetchCompetenciesBySearchTerm(safeSearchTerm.trim());
        
        // Ensure the API response is an array before setting it to state to prevent crashes.
        setResults(Array.isArray(data) ? data : []);
        // The search was successful; update the 'query' to reflect this executed term.
        setQuery(safeSearchTerm.trim());
        // Reset to the first page for the new set of results.
        setCurrentPage(1);
      } catch (err) {
        // If an error occurs during the fetch, log it for debugging purposes.
        console.error("Error fetching Competency data:", err);
        // Translate the technical error into a user-friendly message and set the error state.
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
        // Clear any stale results to ensure the UI doesn't show old data alongside the error message.
        setResults([]);
      } finally {
        // Regardless of success or failure, the loading process is complete.
        setLoading(false);
      }
    }, DEBOUNCE_DELAY);

    // This is the crucial cleanup function for the effect. If `safeSearchTerm` changes again
    // before the timeout completes, this function will run, clearing the previously scheduled
    // timeout. This is the heart of the debounce mechanism.
    return () => clearTimeout(handler);
  }, [safeSearchTerm]); // The effect is solely dependent on the sanitized search term.

  /**
   * @effect URL Synchronization
   * @description This effect keeps the browser's URL query parameter in sync with the `safeSearchTerm`.
   * When a search term is present, it adds `?query=...` to the URL. When the term is cleared, it removes
   * the parameter. This is done using `history.replaceState` to avoid adding to the browser's history stack,
   * providing a seamless user experience for refreshes and sharing links.
   *
   * @dependency {string} safeSearchTerm - The effect re-runs whenever the search term changes.
   */
  useEffect(() => {
    const url = new URL(window.location.href);
    const trimmedTerm = safeSearchTerm.trim();

    if (trimmedTerm) {
      url.searchParams.set("query", trimmedTerm);
    } else {
      url.searchParams.delete("query");
    }
    // Update the URL in the address bar without reloading the page.
    window.history.replaceState({}, "", url.toString());
  }, [safeSearchTerm]);

  // --- ACTION HANDLERS ---
  // These functions are returned by the hook to be connected to UI elements (e.g., buttons, inputs).

  /**
   * @function handleSearch
   * @description A handler to programmatically initiate a new search. It trims the input term,
   * resets pagination, and updates both `searchTerm` (to trigger the fetch effect) and `query`
   * (for immediate UI feedback).
   * @param {string} term - The search term to execute.
   */
  const handleSearch = (term: string) => {
    const trimmed = term.trim();
    // If the term is empty, delegate to the clear search handler for a consistent state reset.
    if (!trimmed) {
      handleClearSearch();
      return;
    }
    setCurrentPage(1); // Reset to the first page for the new search.
    setSearchTerm(trimmed); // This change will trigger the main data-fetching useEffect.
    setQuery(trimmed); // Update query immediately for responsive UI display.
  };

  /**
   * @function handleClearSearch
   * @description Resets the entire search state to its default values. This is typically
   * connected to a "Clear" or "X" button in the search input.
   */
  const handleClearSearch = () => {
    setSearchTerm("");
    setQuery("");
    setResults([]);
    setError(null);
    setCurrentPage(1);
  };

  /**
   * @function handleViewDetails
   * @description A placeholder handler for when a user clicks to view the details of a specific Competency.
   * In a real application, this would likely navigate the user to a new page or open a modal.
   * @param {string} itemId - The unique ID of the item to view.
   */
  const handleViewDetails = (itemId: string) => {
    // In a full implementation, this might look like:
    // navigate(`/Competencies/${itemId}`);
    // placeholder function
    console.log(`View details for item ID: ${itemId}`);
  };

  // --- DATA TRANSFORMATION & PAGINATION ---
  // This section processes the raw API data into a format suitable for rendering and calculates pagination variables.

  /**
   * @constant {ItemType[]} allItems
   * @description A flattened and transformed list of all Competency items from the raw `results`.
   * The API returns data grouped by `source`, but the UI needs a single, flat list to paginate.
   * `flatMap` is used to iterate over each group and then map over the Competencies within that group,
   * creating a unified array of `ItemType` objects. The optional chaining (`?.`) and nullish coalescing (`?? []`)
   * operators provide resilience against malformed or missing data in the API response.
   */
  const allItems: ItemType[] = (results ?? []).flatMap(
    (group) =>
      group?.Competencies?.map((CompetencyItem) => ({
        id: CompetencyItem.id,
        name: CompetencyItem.name,
        framework: group.source, // The 'source' from the parent group is applied to each Competency.
      })) ?? [] // If group.Competencies is null/undefined, return an empty array to prevent flatMap from crashing.
  );

  /**
   * @constant {number} itemsPerPage
   * @description The number of items to display on a single page of results.
   */
  const itemsPerPage = 9;

  /**
   * @constant {number} totalPages
   * @description The total number of pages required to display all items, calculated based on
   * the total number of items and the items per page. `Math.ceil` ensures that any partial
   * final page is accounted for.
   */
  const totalPages = Math.ceil(allItems.length / itemsPerPage);

  /**
   * @constant {ItemType[]} pageItems
   * @description The specific subset of `allItems` that should be rendered for the `currentPage`.
   * The `slice` method creates a new array containing only the items for the current view,
   * powering the pagination logic.
   */
  const pageItems = allItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /**
   * @constant {boolean} isEmptySearch
   * @description A derived boolean state that is true only when the search input is empty AND no search is currently loading.
   * This is useful for rendering a distinct initial state or a "start searching" prompt, differentiating it from a "no results found" state.
   */
  const isEmptySearch = !safeSearchTerm.trim() && !loading;

  // --- RETURNED API ---
  // The public interface of the hook, providing all necessary state and handlers to the consuming component.
  return {
    query, // The executed search term for display.
    searchTerm, // The live value of the search input, to be bound to it.
    setSearchTerm, // The setter for the search term.
    results, // The raw results from the API.
    loading, // The loading state flag.
    error, // The user-friendly error message.
    currentPage, // The current page number.
    setCurrentPage, // The function to change the current page.
    pageItems, // The array of items for the current page to be rendered.
    totalPages, // The total number of pages.
    isEmptySearch, // Flag for the initial "empty" state.
    handleSearch, // Function to trigger a search.
    handleClearSearch, // Function to clear the search.
    handleViewDetails, // Function to handle item clicks.
  };
}