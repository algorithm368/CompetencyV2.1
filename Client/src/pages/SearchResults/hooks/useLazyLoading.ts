// Client/src/pages/SearchResults/hooks/useLazyLoading.ts
import { useState, useEffect, useCallback, useRef } from "react";

interface UseLazyLoadingOptions {
  items: any[];
  initialLoad?: number;
  loadMore?: number;
  threshold?: number;
}

interface UseLazyLoadingReturn {
  displayedItems: any[];
  hasMore: boolean;
  isLoading: boolean;
  loadMoreItems: () => void;
  sentinelRef: React.RefObject<HTMLDivElement>;
  reset: () => void;
}

export const useLazyLoading = ({
  items,
  initialLoad = 10,
  loadMore = 5,
  threshold = 0.8,
}: UseLazyLoadingOptions): UseLazyLoadingReturn => {
  const [displayedCount, setDisplayedCount] = useState(initialLoad);
  const [isLoading, setIsLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Calculate derived state
  const displayedItems = items.slice(0, displayedCount);
  const hasMore = displayedCount < items.length;

  // Load more items function
  const loadMoreItems = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    // Simulate network delay for better UX
    setTimeout(() => {
      setDisplayedCount((prev) => Math.min(prev + loadMore, items.length));
      setIsLoading(false);
    }, 300);
  }, [isLoading, hasMore, loadMore, items.length]);

  // Reset function to go back to initial state
  const reset = useCallback(() => {
    setDisplayedCount(initialLoad);
    setIsLoading(false);
  }, [initialLoad]);

  // Intersection Observer setup
  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoading) {
          loadMoreItems();
        }
      },
      {
        threshold,
        rootMargin: "50px", // Load a bit before the sentinel comes into view
      }
    );

    observerRef.current.observe(sentinelRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoading, loadMoreItems, threshold]);

  // Reset displayed count when items change
  useEffect(() => {
    reset();
  }, [items, reset]);

  return {
    displayedItems,
    hasMore,
    isLoading,
    loadMoreItems,
    sentinelRef,
    reset,
  };
};
