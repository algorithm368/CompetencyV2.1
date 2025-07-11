/**
 * Animation utility functions and configurations for optimal performance
 * 
 * This file contains optimized animation variants and utilities to ensure
 * smooth animations across the application, especially for search results.
 */

// Check if user prefers reduced motion
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Optimized transition configurations
export const transitions = {
  fast: {
    duration: 0.2,
    ease: "easeOut" as const,
  },
  normal: {
    duration: 0.3,
    ease: "easeOut" as const,
  },
  slow: {
    duration: 0.5,
    ease: "easeOut" as const,
  },
  spring: {
    type: "spring" as const,
    stiffness: 200,
    damping: 20,
  },
} as const;

// Common animation variants that can be reused across components
export const commonVariants = {
  // Basic fade in/out
  fade: {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: transitions.normal,
    },
    exit: { 
      opacity: 0,
      transition: transitions.fast,
    },
  },

  // Slide up animation
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: transitions.normal,
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: transitions.fast,
    },
  },

  // Scale animation for icons
  scale: {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: 1,
      opacity: 1,
      transition: transitions.spring,
    },
    exit: { 
      scale: 0,
      opacity: 0,
      transition: transitions.fast,
    },
  },

  // Hover animations
  hover: {
    scale: 1.02,
    transition: transitions.fast,
  },

  // Tap animations
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },

  // Stagger container for lists
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.03,
        staggerDirection: -1,
      },
    },
  },

  // Stagger items
  staggerItem: {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: transitions.normal,
    },
    exit: {
      opacity: 0,
      y: -15,
      transition: transitions.fast,
    },
  },
} as const;

/**
 * Returns animation variants based on user's motion preferences
 * If user prefers reduced motion, returns simplified variants
 */
export const getAnimationVariants = (variantName: keyof typeof commonVariants) => {
  if (prefersReducedMotion()) {
    // Return minimal animation for accessibility
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 0.1 } },
      exit: { opacity: 0, transition: { duration: 0.1 } },
    };
  }
  
  return commonVariants[variantName];
};

/**
 * Optimized AnimatePresence props for better performance
 */
export const optimizedAnimatePresence = {
  mode: "wait" as const,
  initial: false, // Disable initial animations for better performance
};

/**
 * Performance-focused motion config for heavy animations
 */
export const performanceMotionConfig = {
  // Enable hardware acceleration with proper typing
  transformTemplate: ({ scale = 1, rotate = 0, x = 0, y = 0 }: { 
    scale?: number; 
    rotate?: number; 
    x?: number; 
    y?: number; 
  }) => `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotate(${rotate}deg)`,
  
  // Reduce animation complexity on slower devices
  reducedMotion: prefersReducedMotion() ? "always" : "never",
} as const;
