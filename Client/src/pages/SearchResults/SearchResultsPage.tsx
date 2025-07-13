import React, { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// Layout and Component Imports
import Layout from "@Layouts/Layout";
import BackgroundDecor from "./components/BackgroundDecor";
import SearchHeader from "./components/SearchHeader";
import SearchContent from "./components/SearchContent";
import ResultsSummary from "./components/ResultsSummary";

// Hooks
import { useCompetencyResults } from "./hooks/useCompetencyResults";

// Types
interface NavigationConfig {
  sfia: string;
  tpqi: string;
  fallback: string;
}

// Constants
const NAVIGATION_ROUTES: NavigationConfig = {
  sfia: "/competency/sfia",
  tpqi: "/competency/tpqi",
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
 * A comprehensive search results page that handles career/Competency search functionality
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
  } = useCompetencyResults();

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
      hasResults: !loading && !error && query && pageItems.length > 0,
    }),
    [loading, error, query, pageItems.length]
  );

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Handles navigation to specific career/Competency details page
   *
   * Navigation Logic:
   * 1. Finds the item in current page items by ID
   * 2. Determines framework type (sfia/tpqi)
   * 3. Routes to appropriate framework-specific page
   * 4. Falls back to home page if framework is unknown
   *
   * @param itemId - Unique identifier for the career/Competency item
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
   */
  const handleRetry = useCallback(() => {
    const retryTerm = searchTerm.trim() || query;
    console.debug(`Retrying search with term: "${retryTerm}"`);
    handleSearch(retryTerm);
  }, [searchTerm, query, handleSearch]);

  /**
   * Handles suggestion clicks from welcome state
   * Sets search term and executes search
   */
  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      setSearchTerm(suggestion);
      handleSearch(suggestion);
    },
    [setSearchTerm, handleSearch]
  );

  /**
   * Handles new search action from empty state
   * Clears search term and query
   */
  const handleNewSearch = useCallback(() => {
    setSearchTerm("");
    handleSearch("");
  }, [setSearchTerm, handleSearch]);

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
  // MAIN RENDER
  // ============================================================================

  return (
    <Layout>
      {/* Background decorative elements */}
      <BackgroundDecor />

      {/* Main content area with enhanced UX/UI */}
      <div className="relative pt-24 pb-20 px-4 md:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 min-h-screen">
        
        {/* Enhanced Search Section */}
        <SearchHeader
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSearch={handleSearchExecution}
          placeholder={UI_CONSTANTS.SEARCH_PLACEHOLDER}
          query={query}
        />

        {/* Enhanced Content Area */}
        <div className="max-w-6xl mx-auto">
          {/* Results Summary */}
          {renderConditions.hasResults && (
            <ResultsSummary
              query={query}
              itemsCount={pageItems.length}
              currentPage={currentPage}
              totalPages={totalPages}
            />
          )}

          {/* Dynamic content with enhanced container */}
          <SearchContent
            loading={loading}
            error={error}
            query={query}
            pageItems={pageItems}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onViewDetails={handleViewDetails}
            onRetry={handleRetry}
            onSuggestionClick={handleSuggestionClick}
            onNewSearch={handleNewSearch}
          />
        </div>
      </div>
    </Layout>
  );
};

export default ResultsPage;