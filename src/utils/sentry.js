import * as Sentry from '@sentry/react';

/**
 * Initialize Sentry error tracking for the frontend
 * Only initializes in production or if explicitly enabled
 */
export const initSentry = () => {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  const environment = import.meta.env.MODE || 'development';
  
  if (!dsn) {
    if (environment === 'production') {
      console.warn('Sentry DSN not configured. Error tracking disabled.');
    }
    return;
  }

  Sentry.init({
    dsn,
    environment,
    release: import.meta.env.VITE_APP_VERSION || '1.0.0',
    
    // Performance monitoring
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        // Only capture session replays in production with errors
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    
    // Performance sampling rate
    tracesSampleRate: environment === 'production' ? 0.1 : 1.0,
    
    // Session replay sampling
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    
    // Only send errors in production
    enabled: environment === 'production',
    
    // Filter out common non-actionable errors
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
      'Non-Error exception captured',
      'Non-Error promise rejection captured',
      /^Loading chunk \d+ failed/,
      /^ChunkLoadError/,
      'Network request failed',
      'Failed to fetch',
      'Load failed',
      'cancelled',
      'Abort',
    ],
    
    // Only capture errors from our domain
    allowUrls: [
      /https?:\/\/(www\.)?coverghar\.in/,
      /localhost/,
    ],
    
    // Don't capture errors from third-party scripts
    denyUrls: [
      /extensions\//i,
      /^chrome:\/\//i,
      /^chrome-extension:\/\//i,
      /^moz-extension:\/\//i,
      /googletagmanager/,
      /google-analytics/,
      /facebook/,
    ],
    
    // Scrub sensitive data
    beforeSend(event) {
      // Remove any PII from the event
      if (event.request?.headers) {
        delete event.request.headers.Authorization;
        delete event.request.headers.Cookie;
      }
      return event;
    },
  });

  console.info(`Sentry initialized for ${environment} environment`);
};

/**
 * Capture an exception with additional context
 * @param {Error} error - The error to capture
 * @param {Object} context - Additional context
 */
export const captureException = (error, context = {}) => {
  if (!import.meta.env.VITE_SENTRY_DSN) {
    console.error('Error captured (Sentry disabled):', error);
    return;
  }

  Sentry.withScope((scope) => {
    if (context.user) {
      scope.setUser({
        id: context.user.id || context.user._id,
        email: context.user.email,
      });
    }

    if (context.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }

    if (context.extra) {
      Object.entries(context.extra).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }

    Sentry.captureException(error);
  });
};

/**
 * Capture a message with severity level
 * @param {string} message - The message to capture
 * @param {string} level - Severity level
 */
export const captureMessage = (message, level = 'info') => {
  if (!import.meta.env.VITE_SENTRY_DSN) {
    console.log(`Message captured (Sentry disabled): ${message}`);
    return;
  }

  Sentry.captureMessage(message, level);
};

/**
 * Set user context for Sentry
 * @param {Object} user - User object
 */
export const setUser = (user) => {
  if (user) {
    Sentry.setUser({
      id: user.id || user._id,
      email: user.email,
      username: user.name,
    });
  } else {
    Sentry.setUser(null);
  }
};

/**
 * Sentry Error Boundary wrapper component
 */
export const SentryErrorBoundary = Sentry.ErrorBoundary;

export default Sentry;
