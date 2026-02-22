import { Link } from 'react-router-dom';
import { memo, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';
import { toast } from 'react-toastify';
import { FiShoppingCart, FiEye, FiStar, FiHeart } from 'react-icons/fi';
import { formatPrice, getProductImage, isInStock } from '../utils/helpers';
import OptimizedImage from './OptimizedImage';

import { selectWishlistItems } from '../redux/slices/wishlistSlice';

const ProductCard = memo(({ product }) => {
  const dispatch = useDispatch();
  const productImage = getProductImage(product);
  const available = isInStock(product);

  const wishlistItems = useSelector(selectWishlistItems);
  const isWishlisted = !!wishlistItems.find(p => p._id === product._id);

  // Memoize price calculations to avoid recalculating on every render
  const priceRange = useMemo(() => {
    if (!product.variants?.length) return null;
    const prices = product.variants.map(v => v.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [product.variants]);

  const handleAddToCart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!available) {
      toast.error('Product is currently out of stock');
      return;
    }

    const availableVariant = product.variants.find(v => v.stock > 0 && v.isActive);
    if (availableVariant) {
      dispatch(addToCart({
        product,
        variant: availableVariant,
        quantity: 1
      }));
      toast.success('Added to cart!');
    }
  }, [available, product, dispatch]);

  const handleWishlistToggle = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist(product._id));
    }
  }, [isWishlisted, product._id, dispatch]);

  return (
    <Link 
      to={`/products/${product._id}`} 
      className="block bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 group active:scale-[0.98]" 
      style={{ textDecoration: 'none' }}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100 cursor-pointer">
        <OptimizedImage
          src={productImage}
          alt={product.title}
          width={400}
          height={400}
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          loading="lazy"
          className="w-full h-full"
          imgClassName="group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Mobile Quick Actions - Always visible on mobile */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 sm:hidden">
          <button
            onClick={handleWishlistToggle}
            className={`bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md active:scale-95 transition-transform min-h-[36px] min-w-[36px] flex items-center justify-center ${isWishlisted ? 'text-primary-600' : 'text-gray-700'}`}
            title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <FiHeart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Desktop Overlay Actions - Hover only */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2">
            <span className="bg-white text-gray-900 p-2 rounded-full hover:bg-primary-600 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center" title="View Details">
              <FiEye className="w-5 h-5" />
            </span>
            <button
              onClick={handleWishlistToggle}
              className={`bg-white text-gray-900 p-2 rounded-full hover:bg-primary-600 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${isWishlisted ? 'text-primary-600' : ''}`}
              title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <FiHeart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleAddToCart}
              disabled={!available}
              className="bg-white text-gray-900 p-2 rounded-full hover:bg-primary-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Add to Cart"
            >
              <FiShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stock Badge */}
        {!available && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-medium">
            Out of Stock
          </div>
        )}

        {/* Featured Badge */}
        {product.featured && available && (
          <div className="absolute top-2 left-2 bg-primary-600 text-white px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-medium">
            Featured
          </div>
        )}

        {/* Category Badge - Hidden on mobile */}
        <div className="absolute top-2 right-2 bg-white bg-opacity-90 text-gray-700 px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-medium hidden sm:block">
          {product.category}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4 cursor-pointer">
        <div className="mb-1.5 sm:mb-2">
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2 mb-0.5 sm:mb-1">
            {product.title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-1">
            {product.brand} • {product.model}
          </p>
        </div>

        {/* Rating - Hidden on very small screens */}
        {product.rating?.average > 0 && (
          <div className="hidden sm:flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating.average)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-xs text-gray-600">
              {product.rating.average.toFixed(1)} ({product.rating.count})
            </span>
          </div>
        )}

        {/* Price and Type */}
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div>
            {product.variants && product.variants.length > 0 && (
              <div className="flex items-baseline space-x-1 sm:space-x-2">
                <span className="text-base sm:text-lg font-bold text-gray-900">
                  {formatPrice(priceRange.min)}
                </span>
                {product.variants.length > 1 && (
                  <span className="text-xs sm:text-sm text-gray-500">
                    - {formatPrice(priceRange.max)}
                  </span>
                )}
              </div>
            )}
          </div>
          <span className="text-[10px] sm:text-xs text-gray-500 bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
            {product.type}
          </span>
        </div>

        {/* Variants Preview - Hidden on mobile */}
        {product.variants && product.variants.length > 1 && (
          <div className="hidden sm:flex items-center space-x-1 mb-3">
            <span className="text-xs text-gray-600">Colors:</span>
            <div className="flex space-x-1">
              {product.variants.slice(0, 4).map((variant, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: (variant.color ? String(variant.color).toLowerCase() : '#e5e7eb') }}
                  title={variant.color}
                />
              ))}
              {product.variants.length > 4 && (
                <span className="text-xs text-gray-500">+{product.variants.length - 4}</span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <span className="flex-1 bg-gray-100 text-gray-700 py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-200 transition-colors text-center cursor-pointer min-h-[40px] sm:min-h-[44px] flex items-center justify-center">
            View Details
          </span>
          <button
            onClick={handleAddToCart}
            disabled={!available}
            className="bg-primary-600 text-white py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-1 min-h-[40px] sm:min-h-[44px]"
          >
            <FiShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </Link>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;