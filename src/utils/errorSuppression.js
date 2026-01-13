/**
 * Console error suppression utility
 * Helps suppress known third-party errors that can't be fixed directly
 */

const SUPPRESSED_ERRORS = [
  'x-rtb-fingerprint-id',
  'Permissions policy violation: accelerometer',
  'devicemotion events are blocked',
  'deviceorientation events are blocked',
  'navigator.vibrate inside a cross-origin iframe',
  'Mixed Content: The page at',
  'attribute width: Expected length',
  'attribute height: Expected length'
];

const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

/**
 * Suppress specific console errors and warnings
 */
export const suppressKnownErrors = () => {
  console.error = (...args) => {
    const message = args.join(' ');
    const shouldSuppress = SUPPRESSED_ERRORS.some(error => 
      message.toLowerCase().includes(error.toLowerCase())
    );
    
    if (!shouldSuppress) {
      originalConsoleError.apply(console, args);
    }
  };

  console.warn = (...args) => {
    const message = args.join(' ');
    const shouldSuppress = SUPPRESSED_ERRORS.some(error => 
      message.toLowerCase().includes(error.toLowerCase())
    );
    
    if (!shouldSuppress) {
      originalConsoleWarn.apply(console, args);
    }
  };
};

/**
 * Restore original console methods
 */
export const restoreConsole = () => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
};

/**
 * Initialize error suppression in production
 */
export const initErrorSuppression = () => {
  if (process.env.NODE_ENV === 'production') {
    suppressKnownErrors();
  }
};