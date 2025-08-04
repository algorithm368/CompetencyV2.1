import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";

// Layout and Component Imports
import Layout from "@Layouts/Layout";
import { WhiteTealBackground } from "@Components/Common/Background/WhiteTealBackground";
import { SearchHeader, SearchContent } from "./components";

// Hooks
import { useLazyCompetencyResults } from "./hooks/useCompetencyResults";

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
} as const;

/**
 * ResultsPage Component with Lazy Loading Support
 */
const ResultsPage: React.FC = () => {
  // ============================================================================
  // HOOKS & STATE MANAGEMENT
  // ============================================================================

  const {
    query,
    searchTerm,
    setSearchTerm,
    allItems,
    loading,
    error,
    handleSearch,
  } = useLazyCompetencyResults();

  const navigate = useNavigate();

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleViewDetails = useCallback(
    (itemId: string) => {
      const targetItem = allItems.find((item) => item.id === itemId);
      const framework = targetItem?.framework;

      console.debug(
        `Navigating to details for item: ${itemId}, framework: ${framework}`
      );

      switch (framework) {
        case "sfia":
          navigate(`${NAVIGATION_ROUTES.sfia}/${itemId}`);
          break;
        case "tpqi":
          navigate(`${NAVIGATION_ROUTES.tpqi}/${itemId}`);
          break;
        default:
          console.warn(
            `Unknown framework type: ${framework}, redirecting to home`
          );
          navigate(NAVIGATION_ROUTES.fallback);
          break;
      }
    },
    [allItems, navigate]
  );

  const handleRetry = useCallback(() => {
    const retryTerm = searchTerm.trim() || query;
    console.debug(`Retrying search with term: "${retryTerm}"`);
    handleSearch(retryTerm);
  }, [searchTerm, query, handleSearch]);

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      setSearchTerm(suggestion);
      handleSearch(suggestion);
    },
    [setSearchTerm, handleSearch]
  );

  const handleNewSearch = useCallback(() => {
    setSearchTerm("");
    handleSearch("");
  }, [setSearchTerm, handleSearch]);

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
      <WhiteTealBackground>
        <div className="relative pt-24 pb-20 px-4 md:px-6 lg:px-8 min-h-screen">
          <SearchHeader
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            onSearch={handleSearchExecution}
            placeholder={UI_CONSTANTS.SEARCH_PLACEHOLDER}
            query={query}
          />

          <div className="max-w-6xl mx-auto">
            <SearchContent
              loading={loading}
              error={error}
              query={query}
              pageItems={allItems}
              onViewDetails={handleViewDetails}
              onRetry={handleRetry}
              onSuggestionClick={handleSuggestionClick}
              onNewSearch={handleNewSearch}
            />
          </div>
        </div>
      </WhiteTealBackground>
    </Layout>
  );
};

export default ResultsPage;
