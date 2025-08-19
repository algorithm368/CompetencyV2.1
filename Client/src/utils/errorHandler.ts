/**
 * @fileoverview Global error handling utilities for development and production
 * 
 * This module provides comprehensive error handling for common development issues
 * including source map errors, React DevTools issues, and malformed URLs.
 * 
 * @author Siriwat Chairak
 * @version 2.1.0
 * @since 2025-01-04
 */

/**
 * Initialize global error handlers for common development issues
 * This function should be called early in the application lifecycle
 */
export const initializeGlobalErrorHandlers = () => {
  if (typeof window === 'undefined') return;

  // Handle global errors
  window.addEventListener('error', (event) => {
    // Check for source map related errors
    if (
      event.filename?.includes('installHook.js') ||
      event.filename?.includes('.map') ||
      event.message?.includes('Source map error') ||
      event.message?.includes('JSON.parse: unexpected character')
    ) {
      event.preventDefault();
      return;
    }

    // Check for malformed URL errors
    if (
      event.message?.includes('%3Canonymous%20code%3E') ||
      event.message?.includes('<anonymous code>')
    ) {
      event.preventDefault();
      console.warn('Malformed URL detected and handled');
      return;
    }
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    
    // Handle source map promise rejections
    if (
      reason?.message?.includes('Source map') ||
      reason?.message?.includes('installHook.js') ||
      reason?.message?.includes('JSON.parse: unexpected character') ||
      reason?.stack?.includes('.map')
    ) {
      event.preventDefault();
      return;
    }

    // Handle fetch errors for source maps
    if (
      reason?.name === 'TypeError' &&
      reason?.message?.includes('Failed to fetch') &&
      reason?.stack?.includes('.map')
    ) {
      event.preventDefault();
      return;
    }
  });

  // Override fetch for source map requests
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
    
    // Intercept problematic source map requests
    if (url?.includes('.map') && (
      url.includes('installHook') ||
      url.includes('%3Canonymous%20code%3E') ||
      url.includes('<anonymous')
    )) {
      // Return a successful empty response to prevent errors
      return new Response('{}', {
        status: 200,
        statusText: 'OK',
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return originalFetch.apply(window, args);
  };

  if (process.env.NODE_ENV === 'development') {
    console.info('🛡️ Global error handlers initialized for development');
  }
};

/**
 * Validate and sanitize URL parameters to prevent malformed URLs
 * @param params - Object containing URL parameters
 * @returns Sanitized parameters object
 */
export const sanitizeUrlParams = (params: Record<string, string | undefined>) => {
  const sanitized: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(params)) {
    if (value) {
      // Remove potentially dangerous characters and decode common issues
      const cleanValue = value
        .replace(/%3C/g, '') // Remove URL-encoded <
        .replace(/%3E/g, '') // Remove URL-encoded >
        .replace(/%20/g, ' ') // Decode spaces
        .replace(/[<>]/g, '') // Remove raw < >
        .trim();
        
      // Check for common problematic patterns
      if (
        cleanValue === 'anonymous code' ||
        cleanValue === '' ||
        cleanValue.includes('undefined')
      ) {
        continue; // Skip invalid parameters
      }
      
      sanitized[key] = cleanValue;
    }
  }
  
  return sanitized;
};

/**
 * Check if a URL parameter appears to be malformed or problematic
 * @param param - The parameter value to check
 * @returns True if the parameter appears malformed
 */
export const isMalformedParam = (param: string | undefined): boolean => {
  if (!param) return true;
  
  const problematicPatterns = [
    'anonymous code',
    '%3Canonymous%20code%3E',
    '<anonymous',
    'undefined',
    'null',
    ''
  ];
  
  return problematicPatterns.some(pattern => 
    param.toLowerCase().includes(pattern.toLowerCase())
  );
};
