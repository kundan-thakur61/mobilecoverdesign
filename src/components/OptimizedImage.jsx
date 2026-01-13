import { useState, useRef, useEffect, memo } from 'react';

/**
 * OptimizedImage - High-performance image component
 * 
 * Features:
 * - Lazy loading with Intersection Observer
 * - Blur placeholder during load
 * - Error fallback handling
 * - WebP/AVIF format support detection
 * - Responsive srcSet generation for Cloudinary images
 */

const PLACEHOLDER_BLUR = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+';

// Cloudinary transformation helpers
const getCloudinaryUrl = (url, width, format = 'auto') => {
  if (!url || !url.includes('cloudinary.com')) return url;
  
  // Parse Cloudinary URL and add transformations
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;
  
  const transforms = `f_${format},q_auto,w_${width},c_limit`;
  return `${parts[0]}/upload/${transforms}/${parts[1]}`;
};

// Generate srcSet for responsive images
const generateSrcSet = (url) => {
  if (!url || !url.includes('cloudinary.com')) return '';
  
  const widths = [320, 640, 768, 1024, 1280];
  return widths
    .map(w => `${getCloudinaryUrl(url, w)} ${w}w`)
    .join(', ');
};

const OptimizedImage = memo(({
  src,
  alt = '',
  className = '',
  width,
  height,
  fallback = '/frames/frame-1-fixed.svg',
  loading = 'lazy',
  priority = false,
  sizes = '100vw',
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || loading !== 'lazy') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, loading]);

  const handleLoad = (e) => {
    setIsLoaded(true);
    onLoad?.(e);
  };

  const handleError = (e) => {
    setHasError(true);
    onError?.(e);
  };

  const imageSrc = hasError ? fallback : src;
  const srcSet = !hasError ? generateSrcSet(src) : '';

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* Placeholder/skeleton */}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-gray-100 animate-pulse"
          style={{
            backgroundImage: `url(${PLACEHOLDER_BLUR})`,
            backgroundSize: 'cover',
          }}
        />
      )}

      {/* Actual image */}
      {isInView && (
        <img
          src={imageSrc}
          srcSet={srcSet || undefined}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={`
            w-full h-full object-cover transition-opacity duration-300
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
          `}
          {...props}
        />
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;

// Export utility functions for use elsewhere
export { getCloudinaryUrl, generateSrcSet };
