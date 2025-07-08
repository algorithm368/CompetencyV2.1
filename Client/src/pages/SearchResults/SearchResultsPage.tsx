import React, { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Layout and Component Imports
import Layout from "@Layouts/Layout";
import SearchBanner from "./components/SearchBanner";
import SearchBox from "./components/SearchBox";
import BackgroundDecor from "./components/BackgroundDecor";

// State Components
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import NoQueryState from "./components/NoQueryState";
import EmptyState from "./components/EmptyState";
import SuccessState from "./components/SuccessState";

// Hooks
import { useJobResults } from "./hooks/useJobResults";

// Types
interface NavigationConfig {
  sfia: string;
  tpqi: string;
  fallback: string;
}

// Constants
const NAVIGATION_ROUTES: NavigationConfig = {
  sfia: "/occupation/sfia",
  tpqi: "/occupation/tpqi",
  fallback: "/home",
} as const;

const UI_CONSTANTS = {
  SEARCH_PLACEHOLDER: "พิมพ์คำค้นหา เช่น Software",
  PAGE_TITLE: "ผลลัพธ์การค้นหา",
  ANIMATION_MODE: "wait" as const,
} as const;

/**
 * ResultsPage Component
 *
 * A comprehensive search results page that handles career/job search functionality
 * across multiple frameworks (SFIA and TPQI). This component provides:
 *
 * Features:
 * - Real-time search with debouncing
 * - Pagination support
 * - Error handling with retry functionality
 * - Loading states with smooth animations
 * - Framework-specific navigation routing
 * - Responsive design with gradient backgrounds
 *
 * State Management:
 * - Search term synchronization with URL parameters
 * - Page state management for pagination
 * - Loading and error state handling
 *
 * Navigation:
 * - Dynamic routing based on career framework type
 * - Graceful fallback for unknown frameworks
 * - Optimized navigation with memoized callbacks
 */
const ResultsPage: React.FC = () => {
  // ============================================================================
  // HOOKS & STATE MANAGEMENT
  // ============================================================================

  /**
   * Custom hook that manages all career search functionality
   * Handles: search state, pagination, API calls, error handling
   */
  const {
    query, // Current search query from URL/state
    searchTerm, // Current input value in search box
    setSearchTerm, // Function to update search term
    currentPage, // Current pagination page
    setCurrentPage, // Function to update current page
    pageItems, // Current page items to display
    totalPages, // Total number of pages available
    loading, // Loading state for API calls
    error, // Error state with user-friendly messages
    handleSearch, // Function to execute search with debouncing
  } = useJobResults();

  // React Router navigation hook
  const navigate = useNavigate();

  // ============================================================================
  // MEMOIZED VALUES
  // ============================================================================

  /**
   * Memoized render conditions to prevent unnecessary re-computations
   * These conditions determine which component state to render
   */
  const renderConditions = useMemo(
    () => ({
      isLoading: loading,
      hasError: error && !loading,
      hasNoQuery: !loading && !error && !query,
      isEmpty: !loading && !error && query && pageItems.length === 0,
      hasResults: !loading && !error && query && pageItems.length > 0,
    }),
    [loading, error, query, pageItems.length]
  );

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Handles navigation to specific career/job details page
   *
   * Navigation Logic:
   * 1. Finds the item in current page items by ID
   * 2. Determines framework type (sfia/tpqi)
   * 3. Routes to appropriate framework-specific page
   * 4. Falls back to home page if framework is unknown
   *
   * @param itemId - Unique identifier for the career/job item
   */
  const handleViewDetails = useCallback(
    (itemId: string) => {
      // Find the specific item to get its framework information
      const targetItem = pageItems.find((item) => item.id === itemId);
      const framework = targetItem?.framework;

      // Log navigation for debugging (remove in production)
      console.debug(
        `Navigating to details for item: ${itemId}, framework: ${framework}`
      );

      // Route based on framework type with type-safe navigation
      switch (framework) {
        case "sfia":
          navigate(`${NAVIGATION_ROUTES.sfia}/${itemId}`);
          break;
        case "tpqi":
          navigate(`${NAVIGATION_ROUTES.tpqi}/${itemId}`);
          break;
        default:
          // Fallback for unknown frameworks or missing items
          console.warn(
            `Unknown framework type: ${framework}, redirecting to home`
          );
          navigate(NAVIGATION_ROUTES.fallback);
          break;
      }
    },
    [pageItems, navigate]
  );

  /**
   * Handles retry functionality for failed searches
   *
   * Retry Logic:
   * 1. Uses current search term if available
   * 2. Falls back to last successful query
   * 3. Clears error state and reinitializes search
   */
  const handleRetry = useCallback(() => {
    const retryTerm = searchTerm.trim() || query;
    console.debug(`Retrying search with term: "${retryTerm}"`);
    handleSearch(retryTerm);
  }, [searchTerm, query, handleSearch]);

  /**
   * Handles search execution with input validation
   *
   * Search Logic:
   * 1. Uses provided term or falls back to current search term
   * 2. Passes cleaned input to search handler
   * 3. Triggers debounced API call through hook
   *
   * @param term - Search term from search box input
   */
  const handleSearchExecution = useCallback(
    (term: string) => {
      const searchInput = term || searchTerm;
      console.debug(`Executing search with term: "${searchInput}"`);
      handleSearch(searchInput);
    },
    [searchTerm, handleSearch]
  );

  // ============================================================================
  // RENDER LOGIC
  // ============================================================================

  /**
   * Renders the appropriate component based on current application state
   * Uses AnimatePresence for smooth transitions between states
   *
   * State Priority (highest to lowest):
   * 1. Loading - Shows loading spinner
   * 2. Error - Shows error message with retry option
   * 3. No Query - Shows initial state prompt
   * 4. Empty Results - Shows no results found message
   * 5. Success - Shows paginated results
   */
  const renderContent = () => (
    <AnimatePresence mode={UI_CONSTANTS.ANIMATION_MODE}>
      {renderConditions.isLoading && <LoadingState key="loading" />}

      {renderConditions.hasError && (
        <ErrorState key="error" error={error} onRetry={handleRetry} />
      )}

      {renderConditions.hasNoQuery && <NoQueryState key="no-query" />}

      {renderConditions.isEmpty && <EmptyState key="empty" query={query} />}

      {renderConditions.hasResults && (
        <SuccessState
          key="success"
          query={query}
          items={pageItems}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onViewDetails={handleViewDetails}
        />
      )}
    </AnimatePresence>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <Layout>
      {/* Background decorative elements */}
      <BackgroundDecor />

      {/* Page header with title */}
      <SearchBanner title={UI_CONSTANTS.PAGE_TITLE} />

      {/* Main content area with responsive padding and gradient background */}
      <div className="relative pt-8 pb-16 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-teal-25 via-white to-teal-25/50 min-h-screen">
        {/* Search input component */}
        <SearchBox
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSearch={handleSearchExecution}
          placeholder={UI_CONSTANTS.SEARCH_PLACEHOLDER}
        />

        {/* Dynamic content based on application state */}
        {renderContent()}
      </div>
    </Layout>
  );
};

export default ResultsPage;
