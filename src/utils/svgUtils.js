/**
 * Utility functions for handling SVG attributes and preventing browser errors
 */

/**
 * Sanitizes SVG attributes to prevent browser errors
 * @param {Object} attributes - SVG attributes object
 * @returns {Object} - Sanitized attributes
 */
export const sanitizeSvgAttributes = (attributes = {}) => {
  const sanitized = { ...attributes };
  
  // Fix width and height attributes - replace 'auto' with valid values
  if (sanitized.width === 'auto' || sanitized.width === undefined) {
    sanitized.width = '100%';
  }
  if (sanitized.height === 'auto' || sanitized.height === undefined) {
    sanitized.height = '100%';
  }
  
  // Ensure numeric values are strings
  if (typeof sanitized.width === 'number') {
    sanitized.width = `${sanitized.width}px`;
  }
  if (typeof sanitized.height === 'number') {
    sanitized.height = `${sanitized.height}px`;
  }
  
  return sanitized;
};

/**
 * Creates safe SVG props for React components
 * @param {Object} props - Original props
 * @returns {Object} - Safe SVG props
 */
export const createSafeSvgProps = (props = {}) => {
  const { width, height, ...otherProps } = props;
  
  return {
    ...otherProps,
    ...sanitizeSvgAttributes({ width, height })
  };
};

/**
 * Prevents device motion/orientation API calls in cross-origin contexts
 */
export const safeDeviceMotion = {
  requestPermission: () => {
    try {
      // Check if we're in a cross-origin iframe
      if (window.self !== window.top) {
        console.warn('Device motion blocked in cross-origin iframe');
        return Promise.resolve('denied');
      }
      
      // Check if DeviceMotionEvent exists and has requestPermission
      if (typeof DeviceMotionEvent !== 'undefined' && 
          typeof DeviceMotionEvent.requestPermission === 'function') {
        return DeviceMotionEvent.requestPermission();
      }
      
      return Promise.resolve('granted');
    } catch (error) {
      console.warn('Device motion permission request failed:', error);
      return Promise.resolve('denied');
    }
  },
  
  addEventListener: (type, listener, options) => {
    try {
      // Only add listener if not in cross-origin iframe
      if (window.self === window.top) {
        window.addEventListener(type, listener, options);
      }
    } catch (error) {
      console.warn(`Failed to add ${type} listener:`, error);
    }
  }
};

/**
 * Safe vibration API wrapper
 */
export const safeVibrate = (pattern) => {
  try {
    // Check if we're in a cross-origin iframe
    if (window.self !== window.top) {
      console.warn('Vibration blocked in cross-origin iframe');
      return false;
    }
    
    // Check if vibrate API is available
    if ('vibrate' in navigator) {
      return navigator.vibrate(pattern);
    }
    
    return false;
  } catch (error) {
    console.warn('Vibration API call failed:', error);
    return false;
  }
};