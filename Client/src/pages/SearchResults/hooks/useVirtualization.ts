import { useState, useEffect, useMemo } from "react";

interface UseVirtualizationProps {
  items: any[];
  containerHeight: number;
  itemHeight: number;
  overscan?: number;
}

export const useVirtualization = ({
  items,
  containerHeight,
  itemHeight,
  overscan = 5,
}: UseVirtualizationProps) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleItems = useMemo(() => {
    const startIndex = Math.max(
      0,
      Math.floor(scrollTop / itemHeight) - overscan
    );
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    return {
      items: items.slice(startIndex, endIndex + 1),
      startIndex,
      totalHeight: items.length * itemHeight,
      offsetY: startIndex * itemHeight,
    };
  }, [items, scrollTop, containerHeight, itemHeight, overscan]);

  return {
    ...visibleItems,
    setScrollTop,
  };
};
