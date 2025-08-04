// Client/src/pages/SearchResults/components/SearchResultsWithLazyLoad.tsx
// Optimized for smooth animations with reduced motion support and no-blink transitions
import React, { useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Loader2, ArrowUp } from "lucide-react";
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
}

// Animation variants - Optimized to prevent blinking with minimal motion
const containerVariants = {
  hidden: { opacity: 0.95 }, // Very high starting opacity
  visible: {
    opacity: 1,
    transition: {
      duration: 0.1, // Extremely fast
      ease: "easeOut",
    },
  },
};

const loadingVariants = {
  hidden: { opacity: 0.7 }, // Start with partial opacity to prevent harsh appearance
  visible: {
    opacity: 1,
    transition: {
      duration: 0.1,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0.7, // Exit to partial opacity instead of 0
    transition: {
      duration: 0.08,
    },
  },
};

const SearchResultsWithLazyLoad: React.FC<SearchResultsWithLazyLoadProps> = ({
  items,
  onViewDetails,
  query,
}) => {
  const shouldReduceMotion = useReducedMotion();
  
  // For now, let's bypass lazy loading and show all items to fix the "only 3 items" issue
  const displayedItems = items; // Show all items
  const hasMore = false; // No pagination needed
  const isLoading = false; // No loading state needed
  const loadMoreItems = () => {}; // No-op function
  const sentinelRef = { current: null }; // Dummy ref

  // Original lazy loading (commented out for debugging)
  // const { displayedItems, hasMore, isLoading, loadMoreItems, sentinelRef } =
  //   useLazyLoading({
  //     items,
  //     initialLoad: 12, // Increased from 8 for better initial load
  //     loadMore: 8, // Increased from 6 for smoother progression
  //     threshold: 0.3, // Reduced from 0.5 for earlier loading
  //   });

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
      // Instant scroll for users who prefer reduced motion
      window.scrollTo(0, 0);
    } else {
      // Use requestAnimationFrame for smoother scrolling performance
      const scrollStep = () => {
        if (window.pageYOffset > 0) {
          window.scrollTo(0, window.pageYOffset - window.pageYOffset * 0.1);
          requestAnimationFrame(scrollStep);
        }
      };
      requestAnimationFrame(scrollStep);
    }
  };

  return (
    <motion.div
      key={`search-results-${query}`} // Add key to prevent component reuse causing blinks
      variants={shouldReduceMotion ? {} : containerVariants}
      initial={shouldReduceMotion ? false : "hidden"}
      animate={shouldReduceMotion ? false : "visible"}
      className="w-full"
      style={{ willChange: 'opacity, transform' }} // Optimize for GPU acceleration
    >
      {/* Results Header with Stats */}
      <div className="mb-6 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Search Results for "{query}"
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <span>
                Showing {stats.displayed} of {stats.total} results
              </span>
              {stats.sfiaCount > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  {stats.sfiaCount} SFIA
                </span>
              )}
              {stats.tpqiCount > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  {stats.tpqiCount} TPQI
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        <ResultsList items={displayedItems} onViewDetails={onViewDetails} />

        {/* Loading State - Improved with smaller, more subtle indicator */}
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              key="loading-indicator"
              variants={shouldReduceMotion ? {} : loadingVariants}
              initial={shouldReduceMotion ? false : "hidden"}
              animate={shouldReduceMotion ? false : "visible"}
              exit={shouldReduceMotion ? false : "exit"}
              className="flex items-center justify-center p-6"
              style={{ willChange: 'opacity' }}
            >
              <div className="flex items-center gap-2 text-gray-500 bg-white/60 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-200/50">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm font-medium">
                  Loading...
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Load More Trigger (Intersection Observer Sentinel) - Moved higher for better UX */}
        {hasMore && !isLoading && (
          <div 
            ref={sentinelRef} 
            className="h-2 bg-transparent" 
            aria-hidden="true"
          />
        )}

        {/* Manual Load More Button (fallback) - Reduced hover effects */}
        {hasMore && !isLoading && (
          <div className="flex justify-center pt-6">
            <button
              onClick={loadMoreItems}
              className="px-6 py-3 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl text-gray-700 font-medium transition-all duration-150 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Load More Results
            </button>
          </div>
        )}

        {/* End of Results - Smoother animation */}
        {!hasMore && items.length > 12 && (
          <motion.div
            key="end-of-results"
            initial={shouldReduceMotion ? false : { opacity: 0.8 }}
            animate={shouldReduceMotion ? false : { opacity: 1 }}
            transition={shouldReduceMotion ? {} : { 
              duration: 0.15,
              ease: "easeOut"
            }}
            className="flex flex-col items-center gap-3 p-6 text-center"
            style={{ willChange: 'opacity' }}
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
