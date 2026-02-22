/**
 * Google Analytics 4 (GA4) tracking utility for CoverGhar
 * 
 * Setup:
 * 1. Get your GA4 Measurement ID from https://analytics.google.com
 * 2. Set VITE_GA4_ID in your .env file (e.g., VITE_GA4_ID=G-XXXXXXXXXX)
 * 3. The gtag script is loaded in index.html
 * 4. Use these helpers to track custom events
 */

const GA_ID = import.meta.env.VITE_GA4_ID || '';

/**
 * Check if GA4 is loaded and available
 */
function isGA4Available() {
  return typeof window !== 'undefined' && typeof window.gtag === 'function' && GA_ID;
}

/**
 * Track a custom event
 * @param {string} eventName - GA4 event name
 * @param {object} params - Event parameters
 */
export function trackEvent(eventName, params = {}) {
  if (!isGA4Available()) return;
  window.gtag('event', eventName, params);
}

/**
 * Track page view (useful for SPA navigation)
 */
export function trackPageView(path, title) {
  if (!isGA4Available()) return;
  window.gtag('config', GA_ID, {
    page_path: path,
    page_title: title,
  });
}

// ─── eCommerce Event Helpers ──────────────────────────────────────────────────

/**
 * Track when a product is viewed
 */
export function trackViewItem(product) {
  trackEvent('view_item', {
    currency: 'INR',
    value: product.price || 199,
    items: [{
      item_id: product._id,
      item_name: product.title || product.name,
      item_category: product.category || 'Mobile Cover',
      price: product.price || 199,
    }],
  });
}

/**
 * Track add to cart
 */
export function trackAddToCart(product, variant, quantity = 1) {
  trackEvent('add_to_cart', {
    currency: 'INR',
    value: (variant?.price || product.price || 199) * quantity,
    items: [{
      item_id: product._id,
      item_name: product.title || product.name,
      item_variant: variant?.name || '',
      item_category: product.category || 'Mobile Cover',
      price: variant?.price || product.price || 199,
      quantity,
    }],
  });
}

/**
 * Track checkout begin
 */
export function trackBeginCheckout(cart, totalValue) {
  trackEvent('begin_checkout', {
    currency: 'INR',
    value: totalValue,
    items: cart.map(item => ({
      item_id: item.product?._id || item._id,
      item_name: item.product?.title || item.title || '',
      price: item.price || 199,
      quantity: item.quantity || 1,
    })),
  });
}

/**
 * Track purchase completion
 */
export function trackPurchase(order) {
  trackEvent('purchase', {
    transaction_id: order._id || order.orderId,
    currency: 'INR',
    value: order.totalAmount || order.total,
    shipping: order.shippingCost || 0,
    items: (order.items || []).map(item => ({
      item_id: item.product?._id || item._id,
      item_name: item.product?.title || item.title || '',
      price: item.price || 199,
      quantity: item.quantity || 1,
    })),
  });
}

/**
 * Track custom design start
 */
export function trackDesignStart(source = 'customizer') {
  trackEvent('custom_design_start', { source });
}

/**
 * Track search
 */
export function trackSearch(searchTerm) {
  trackEvent('search', { search_term: searchTerm });
}

/**
 * Track collection/theme view
 */
export function trackViewCollection(collectionName) {
  trackEvent('view_item_list', {
    item_list_name: collectionName,
  });
}

export default {
  trackEvent,
  trackPageView,
  trackViewItem,
  trackAddToCart,
  trackBeginCheckout,
  trackPurchase,
  trackDesignStart,
  trackSearch,
  trackViewCollection,
};
