/**
 * Web Vitals reporting utility
 * Reports Core Web Vitals metrics for monitoring
 * Uses dynamic import to avoid blocking initial load
 */

const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB, onINP }) => {
      onCLS(onPerfEntry);
      onFID?.(onPerfEntry);
      onFCP(onPerfEntry);
      onLCP(onPerfEntry);
      onTTFB(onPerfEntry);
      onINP?.(onPerfEntry);
    }).catch(() => {
      // web-vitals not installed, skip
    });
  }
};

export default reportWebVitals;
