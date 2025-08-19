/* Source map and development optimization utilities */

// Suppress source map warnings in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Override console.warn to filter source map warnings
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (args[0]?.includes?.('Source map error') || 
        args[0]?.includes?.('map is undefined') ||
        args[0]?.includes?.('installHook.js.map') ||
        args[0]?.includes?.('JSON.parse: unexpected character')) {
      return; // Suppress source map warnings
    }
    originalWarn.apply(console, args);
  };

  // Override console.error to filter React DevTools source map errors
  const originalError = console.error;
  console.error = (...args) => {
    if (args[0]?.includes?.('Source map error') ||
        args[0]?.includes?.('installHook.js.map') ||
        args[0]?.includes?.('JSON.parse: unexpected character') ||
        args[0]?.includes?.('%3Canonymous%20code%3E')) {
      return; // Suppress React DevTools source map errors
    }
    originalError.apply(console, args);
  };

  // Handle unhandled promise rejections that might be related to source maps
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason?.message?.includes?.('Source map') ||
        event.reason?.message?.includes?.('JSON.parse') ||
        event.reason?.message?.includes?.('installHook.js.map')) {
      event.preventDefault(); // Prevent console spam
    }
  });

  // Handle fetch errors for source maps
  const originalFetch = window.fetch;
  window.fetch = (...args) => {
    const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
    if (url?.includes?.('.map') && url?.includes?.('installHook')) {
      // Return a resolved promise to prevent errors
      return Promise.resolve(new Response('{}', { status: 200, statusText: 'OK' }));
    }
    return originalFetch.apply(window, args);
  };
}

export const suppressSourceMapWarnings = () => {
  if (process.env.NODE_ENV === 'development') {
    console.info('Source map warnings suppressed for cleaner development experience');
  }
};
