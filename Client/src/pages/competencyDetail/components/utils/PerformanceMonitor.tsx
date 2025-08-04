import { useEffect } from 'react';

interface PerformanceMonitorProps {
  enabled?: boolean;
}

/**
 * Performance monitoring component for development
 * Helps identify performance issues and memory leaks
 */
export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ 
  enabled = process.env.NODE_ENV === 'development' 
}) => {
  useEffect(() => {
    if (!enabled) return;

    let animationId: number;
    
    const monitorPerformance = () => {
      // Monitor will-change usage
      const elementsWithWillChange = document.querySelectorAll('[style*="will-change"]');
      if (elementsWithWillChange.length > 10) {
        console.warn(`🚨 High will-change usage detected: ${elementsWithWillChange.length} elements`);
      }
      
      // Monitor memory usage (if available)
      if ('memory' in performance) {
        const memory = (performance as Performance & { 
          memory: {
            usedJSHeapSize: number;
            totalJSHeapSize: number;
            jsHeapSizeLimit: number;
          }
        }).memory;
        const memoryUsage = {
          used: Math.round(memory.usedJSHeapSize / 1048576),
          total: Math.round(memory.totalJSHeapSize / 1048576),
          limit: Math.round(memory.jsHeapSizeLimit / 1048576)
        };
        
        if (memoryUsage.used > memoryUsage.limit * 0.8) {
          console.warn('🚨 High memory usage detected:', memoryUsage);
        }
      }
      
      animationId = requestAnimationFrame(monitorPerformance);
    };
    
    // Start monitoring after a delay to avoid initial load noise
    const timeoutId = setTimeout(() => {
      animationId = requestAnimationFrame(monitorPerformance);
    }, 2000);
    
    return () => {
      clearTimeout(timeoutId);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [enabled]);

  return null;
};

export default PerformanceMonitor;
