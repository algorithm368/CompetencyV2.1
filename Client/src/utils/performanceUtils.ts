/**
 * Performance utilities for optimizing CSS animations and will-change properties
 */

// Track elements with will-change to prevent memory budget overflow
class WillChangeManager {
  private static readonly activeElements = new Set<HTMLElement>();
  private static readonly MAX_ELEMENTS = 10; // Conservative limit to stay within budget

  static applyWillChange(element: HTMLElement, properties: string): boolean {
    // Check if we're approaching the budget limit
    if (this.activeElements.size >= this.MAX_ELEMENTS) {
      console.warn('Will-change budget limit reached. Skipping will-change for performance.');
      return false;
    }

    element.style.willChange = properties;
    this.activeElements.add(element);
    return true;
  }

  static removeWillChange(element: HTMLElement): void {
    element.style.willChange = 'auto';
    this.activeElements.delete(element);
  }

  static clearAll(): void {
    this.activeElements.forEach(element => {
      element.style.willChange = 'auto';
    });
    this.activeElements.clear();
  }

  static getActiveCount(): number {
    return this.activeElements.size;
  }
}

// Hook for managing will-change in React components
export const useWillChange = () => {
  const applyWillChange = (element: HTMLElement | null, properties: string) => {
    if (!element) return false;
    return WillChangeManager.applyWillChange(element, properties);
  };

  const removeWillChange = (element: HTMLElement | null) => {
    if (!element) return;
    WillChangeManager.removeWillChange(element);
  };

  return { applyWillChange, removeWillChange };
};

// Utility to automatically manage will-change for animations
export const optimizedAnimation = {
  // Apply will-change only during actual animation
  start: (element: HTMLElement, properties: string = 'transform') => {
    WillChangeManager.applyWillChange(element, properties);
  },
  
  // Remove will-change when animation completes
  end: (element: HTMLElement) => {
    WillChangeManager.removeWillChange(element);
  }
};

// Font optimization utilities
export const fontOptimization = {
  // Preload critical fonts
  preloadFont: (fontUrl: string) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.href = fontUrl;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  },

  // Check if font is loaded
  isFontLoaded: async (fontFamily: string): Promise<boolean> => {
    if (!document.fonts) return true; // Fallback for older browsers
    
    try {
      await document.fonts.load(`1em ${fontFamily}`);
      return document.fonts.check(`1em ${fontFamily}`);
    } catch {
      return false;
    }
  }
};

export default {
  WillChangeManager,
  useWillChange,
  optimizedAnimation,
  fontOptimization
};
