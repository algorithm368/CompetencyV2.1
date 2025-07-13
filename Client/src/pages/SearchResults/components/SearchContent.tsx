import React from "react";
import { AnimatePresence } from "framer-motion";

// State Components
import SearchLoadingState from "./SearchLoadingState";
import SearchErrorState from "./SearchErrorState";
import SearchWelcomeState from "./SearchWelcomeState";
import SearchEmptyState from "./SearchEmptyState";
import SuccessState from "./SuccessState";

interface CompetencyItem {
  id: string;
  framework: string;
  [key: string]: unknown;
}

interface SearchContentProps {
  loading: boolean;
  error: string | null;
  query: string;
  pageItems: CompetencyItem[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewDetails: (itemId: string) => void;
  onRetry: () => void;
  onSuggestionClick: (suggestion: string) => void;
  onNewSearch: () => void;
}

/**
 * SearchContent Component
 * 
 * Manages the display of different search states using AnimatePresence
 * for smooth transitions between loading, error, empty, and success states
 */
const SearchContent: React.FC<SearchContentProps> = ({
  loading,
  error,
  query,
  pageItems,
  currentPage,
  totalPages,
  onPageChange,
  onViewDetails,
  onRetry,
  onSuggestionClick,
  onNewSearch,
}) => {
  // Render conditions to determine which component state to show
  const renderConditions = {
    isLoading: loading,
    hasError: error && !loading,
    hasNoQuery: !loading && !error && !query,
    isEmpty: !loading && !error && query && pageItems.length === 0,
    hasResults: !loading && !error && query && pageItems.length > 0,
  };

  return (
    <div className="min-h-[400px]">
      <AnimatePresence mode="wait">
        {renderConditions.isLoading && <SearchLoadingState />}

        {renderConditions.hasError && (
          <SearchErrorState error={error!} onRetry={onRetry} />
        )}

        {renderConditions.hasNoQuery && (
          <SearchWelcomeState onSuggestionClick={onSuggestionClick} />
        )}

        {renderConditions.isEmpty && (
          <SearchEmptyState query={query} onNewSearch={onNewSearch} />
        )}

        {renderConditions.hasResults && (
          <SuccessState
            key="success"
            query={query}
            items={pageItems}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            onViewDetails={onViewDetails}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchContent;
