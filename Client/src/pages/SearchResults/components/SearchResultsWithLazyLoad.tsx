// Client/src/pages/SearchResults/components/SearchResultsWithLazyLoad.tsx
import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowUp } from "lucide-react";
import ResultsList from "./ResultsList";
import { useLazyLoading } from "../hooks/useLazyLoading";

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

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const loadingVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.2,
    },
  },
};

const SearchResultsWithLazyLoad: React.FC<SearchResultsWithLazyLoadProps> = ({
  items,
  onViewDetails,
  query,
}) => {
  const { displayedItems, hasMore, isLoading, loadMoreItems, sentinelRef } =
    useLazyLoading({
      items,
      initialLoad: 8,
      loadMore: 6,
      threshold: 0.5,
    });

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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
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

        {/* Loading State */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              variants={loadingVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex items-center justify-center p-8"
            >
              <div className="flex items-center gap-3 text-gray-600">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium">
                  Loading more results...
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Load More Trigger (Intersection Observer Sentinel) */}
        {hasMore && !isLoading && <div ref={sentinelRef} className="h-4" />}

        {/* Manual Load More Button (fallback) */}
        {hasMore && !isLoading && (
          <div className="flex justify-center pt-6">
            <button
              onClick={loadMoreItems}
              className="px-6 py-3 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl text-gray-700 font-medium transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Load More Results
            </button>
          </div>
        )}

        {/* End of Results */}
        {!hasMore && items.length > 8 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4 p-8 text-center"
          >
            <div className="p-3 bg-gray-50 rounded-full">
              <ArrowUp className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <p className="text-gray-600 mb-2">
                You've reached the end of the results
              </p>
              <button
                onClick={scrollToTop}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200 underline decoration-2 underline-offset-2"
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
