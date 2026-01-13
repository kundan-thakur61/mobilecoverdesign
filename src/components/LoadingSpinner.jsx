import React from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable loading spinner component with accessibility features
 * @param {string} message - Optional loading message to display
 * @param {string} size - Size variant: 'sm', 'md', 'lg', 'xl'
 * @param {string} variant - Style variant: 'primary', 'secondary', 'white'
 * @param {boolean} fullScreen - Whether to display as full screen overlay
 * @param {string} className - Additional CSS classes
 */
export default function LoadingSpinner({ 
  message = 'Loading...', 
  size = 'md',
  variant = 'primary',
  fullScreen = false,
  className = ''
}) {
  // Size classes
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  // Variant classes
  const variantClasses = {
    primary: 'border-primary-600',
    secondary: 'border-gray-600',
    white: 'border-white'
  };

  // Text size classes
  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.md;
  const spinnerColor = variantClasses[variant] || variantClasses.primary;
  const textSize = textSizeClasses[size] || textSizeClasses.md;

  const content = (
    <div 
      className={`flex flex-col items-center justify-center ${
        fullScreen ? 'min-h-screen' : 'p-12'
      } ${className}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      {/* Spinner */}
      <div 
        className={`animate-spin rounded-full border-b-2 ${spinnerSize} ${spinnerColor} mb-4`}
        aria-hidden="true"
      ></div>
      
      {/* Loading Message */}
      {message && (
        <p className={`${textSize} ${variant === 'white' ? 'text-white' : 'text-gray-600'} font-medium`}>
          {message}
        </p>
      )}
      
      {/* Screen reader only text */}
      <span className="sr-only">Loading content, please wait...</span>
    </div>
  );

  // Full screen overlay version
  if (fullScreen) {
    return (
      <div 
        className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm z-50 flex items-center justify-center"
        aria-modal="true"
      >
        {content}
      </div>
    );
  }

  return content;
}

LoadingSpinner.propTypes = {
  message: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'white']),
  fullScreen: PropTypes.bool,
  className: PropTypes.string,
};

/**
 * Inline loading spinner for buttons or small spaces
 */
export function InlineSpinner({ size = 'sm', className = '' }) {
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
  };

  return (
    <div 
      className={`animate-spin rounded-full border-2 border-current border-t-transparent ${
        sizeClasses[size] || sizeClasses.sm
      } ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

InlineSpinner.propTypes = {
  size: PropTypes.oneOf(['xs', 'sm', 'md']),
  className: PropTypes.string,
};

/**
 * Skeleton loader for content placeholders
 */
export function SkeletonLoader({ 
  count = 1, 
  height = 'h-4', 
  width = 'w-full',
  className = '' 
}) {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`bg-gray-200 rounded ${height} ${width} ${className}`}
          role="status"
          aria-label="Loading content"
        >
          <span className="sr-only">Loading...</span>
        </div>
      ))}
    </div>
  );
}

SkeletonLoader.propTypes = {
  count: PropTypes.number,
  height: PropTypes.string,
  width: PropTypes.string,
  className: PropTypes.string,
};

/**
 * Dots loading animation
 */
export function DotsLoader({ size = 'md', variant = 'primary' }) {
  const sizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
  };

  const colorClasses = {
    primary: 'bg-primary-600',
    secondary: 'bg-gray-600',
    white: 'bg-white',
  };

  const dotSize = sizeClasses[size] || sizeClasses.md;
  const dotColor = colorClasses[variant] || colorClasses.primary;

  return (
    <div className="flex items-center justify-center space-x-2" role="status" aria-label="Loading">
      <div className={`${dotSize} ${dotColor} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
      <div className={`${dotSize} ${dotColor} rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
      <div className={`${dotSize} ${dotColor} rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

DotsLoader.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'white']),
};

/**
 * Page loader with logo (for brand consistency)
 */
export function PageLoader({ message = 'Loading...' }) {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      {/* Logo */}
      <img
        src="/logo.png"
        alt="CoverGhar Logo"
        className="w-16 h-16 mb-6 animate-pulse"
        width="64"
        height="64"
      />
      
      {/* Spinner */}
      <div 
        className="animate-spin rounded-full h-12 w-12 border-b-3 border-primary-600 mb-4"
        role="status"
        aria-hidden="true"
      ></div>
      
      {/* Message */}
      <p className="text-gray-600 text-lg font-medium animate-pulse">
        {message}
      </p>
      
      <span className="sr-only">Loading page content, please wait...</span>
    </div>
  );
}

PageLoader.propTypes = {
  message: PropTypes.string,
};