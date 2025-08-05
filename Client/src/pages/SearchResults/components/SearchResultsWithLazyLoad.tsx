import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Loader2, ArrowUp, Search } from "lucide-react";
import { ResultsList } from "./ui";

interface ItemType {
  id: string;
  name: string;
  framework: string;
}

interface SearchResultsWithLazyLoadProps {
  items: ItemType[];
  onViewDetails: (id: string) => void;
  query: string;
  isSearching?: boolean; // Add this prop to track search state
}

// Animation variants - Optimized to prevent blinking with minimal motion
const containerVariants = {
  hidden: { opacity: 0.95 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.1,
      ease: "easeOut",
    },
  },
};

const loadingVariants = {
  hidden: { opacity: 0.7 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.1,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0.7,
    transition: {
      duration: 0.08,
    },
  },
};

const SearchResultsWithLazyLoad: React.FC<SearchResultsWithLazyLoadProps> = ({
  items,
  onViewDetails,
  query,
  isSearching = false, // Default to false
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [hasSearched, setHasSearched] = useState(false);
  const [prevQuery, setPrevQuery] = useState(query);

  // Track when a search has been initiated
  useEffect(() => {
    if (query !== prevQuery) {
      if (query.length > 0) {
        setHasSearched(true);
      } else {
        setHasSearched(false);
      }
      setPrevQuery(query);
    }
  }, [query, prevQuery]);

  // For now, let's bypass lazy loading and show all items
  const displayedItems = items;
  const hasMore = false;
  const loadMoreItems = () => {};
  const sentinelRef = { current: null };

  // Memoized statistics
  const stats = useMemo(
    () => ({
      displayed: displayedItems.length,
      total: items.length,
      sfiaCount: items.filter((item) => item.framework.toLowerCase() === "sfia")
        .length,
      tpqiCount: items.filter((item) => item.framework.toLowerCase() === "tpqi")
        .length,
    }),
    [displayedItems.length, items]
  );

  const scrollToTop = () => {
    if (shouldReduceMotion) {
      window.scrollTo(0, 0);
    } else {
      const scrollStep = () => {
        if (window.pageYOffset > 0) {
          window.scrollTo(0, window.pageYOffset - window.pageYOffset * 0.1);
          requestAnimationFrame(scrollStep);
        }
      };
      requestAnimationFrame(scrollStep);
    }
  };

  // Show loading state when searching
  if (isSearching && query.length > 0) {
    return (
      <motion.div
        variants={shouldReduceMotion ? {} : containerVariants}
        initial={shouldReduceMotion ? false : "hidden"}
        animate={shouldReduceMotion ? false : "visible"}
        className="w-full"
      >
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center gap-3 text-gray-600 bg-white/80 backdrop-blur-sm rounded-lg px-6 py-4 border border-gray-200/50">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="font-medium">Searching for "{query}"...</span>
          </div>
        </div>
      </motion.div>
    );
  }

  // Show empty state only if search is complete and no results found
  const showEmptyState =
    hasSearched && !isSearching && items.length === 0 && query.length > 0;

  if (showEmptyState) {
    return (
      <motion.div
        variants={shouldReduceMotion ? {} : containerVariants}
        initial={shouldReduceMotion ? false : "hidden"}
        animate={shouldReduceMotion ? false : "visible"}
        className="w-full"
      >
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No results found
              </h3>
              <p className="text-gray-500 max-w-md">
                No competencies found for "
                <span className="font-medium text-gray-700">{query}</span>". Try
                different keywords or check your spelling.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Show initial state when no search has been performed
  if (!hasSearched && query.length === 0) {
    return (
      <motion.div
        variants={shouldReduceMotion ? {} : containerVariants}
        initial={shouldReduceMotion ? false : "hidden"}
        animate={shouldReduceMotion ? false : "visible"}
        className="w-full"
      >
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Search Competencies
              </h3>
              <p className="text-gray-500 max-w-md">
                Start typing to search for competencies across SFIA and TPQI
                frameworks.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Show results when search is complete and has results
  return (
    <motion.div
      key={`search-results-${query}`}
      variants={shouldReduceMotion ? {} : containerVariants}
      initial={shouldReduceMotion ? false : "hidden"}
      animate={shouldReduceMotion ? false : "visible"}
      className="w-full"
      style={{ willChange: "opacity, transform" }}
    >
      {/* Results List */}
      <div className="space-y-4">
        <ResultsList items={displayedItems} onViewDetails={onViewDetails} />

        {/* Manual Load More Button (fallback) */}
        {hasMore && (
          <div className="flex justify-center pt-6">
            <button
              onClick={loadMoreItems}
              className="px-6 py-3 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl text-gray-700 font-medium transition-all duration-150 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Load More Results
            </button>
          </div>
        )}

        {/* End of Results */}
        {!hasMore && items.length > 12 && (
          <motion.div
            key="end-of-results"
            initial={shouldReduceMotion ? false : { opacity: 0.8 }}
            animate={shouldReduceMotion ? false : { opacity: 1 }}
            transition={
              shouldReduceMotion
                ? {}
                : {
                    duration: 0.15,
                    ease: "easeOut",
                  }
            }
            className="flex flex-col items-center gap-3 p-6 text-center"
            style={{ willChange: "opacity" }}
          >
            <div className="p-2 bg-gray-50 rounded-full">
              <ArrowUp className="w-4 h-4 text-gray-400" />
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">
                You've reached the end of the results
              </p>
              <button
                onClick={scrollToTop}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-150 underline decoration-2 underline-offset-2 hover:no-underline"
              >
                Back to top
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default SearchResultsWithLazyLoad;
