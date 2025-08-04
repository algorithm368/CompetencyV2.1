import React from "react";
import { AnimatePresence } from "framer-motion";

// State Components
import {
  SearchLoadingState,
  SearchErrorState,
  SearchWelcomeState,
  SearchEmptyState,
  SearchSuccessState,
} from "./states";

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
      <AnimatePresence mode="sync" initial={false}>
        {renderConditions.isLoading && (
          <SearchLoadingState key="loading" />
        )}

        {renderConditions.hasError && (
          <SearchErrorState key="error" error={error!} onRetry={onRetry} />
        )}

        {renderConditions.hasNoQuery && (
          <SearchWelcomeState key="welcome" onSuggestionClick={onSuggestionClick} />
        )}

        {renderConditions.isEmpty && (
          <SearchEmptyState key="empty" query={query} onNewSearch={onNewSearch} />
        )}

        {renderConditions.hasResults && (
          <SearchSuccessState
            key={`success-${query}`} // Include query in key for better transitions
            query={query}
            items={pageItems}
            onViewDetails={onViewDetails}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchContent;
