/**
 * SEO utility functions for CoverGhar
 * Generates structured data, meta tags, and canonical URLs
 */

const SITE_URL = 'https://www.coverghar.in';
const BRAND_NAME = 'CoverGhar';
const DEFAULT_IMAGE = 'https://res.cloudinary.com/dwmytphop/image/upload/v1766473299/ChatGPT_Image_Dec_23_2025_12_30_26_PM_oyeb3g.jpg';

/**
 * Generate Product JSON-LD schema
 */
export function generateProductSchema(product) {
  if (!product) return null;
  
  const image = product.images?.[0]?.url || product.image || DEFAULT_IMAGE;
  
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name || product.title,
    "description": product.description || `Custom ${product.name} mobile cover from CoverGhar`,
    "image": image,
    "brand": {
      "@type": "Brand",
      "name": BRAND_NAME
    },
    "offers": {
      "@type": "Offer",
      "url": `${SITE_URL}/products/${product._id}`,
      "priceCurrency": "INR",
      "price": product.price || "199",
      "priceValidUntil": "2026-12-31",
      "availability": product.inStock !== false
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": BRAND_NAME
      }
    },
    ...(product.rating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.rating,
        "reviewCount": product.reviewCount || 1
      }
    })
  };
}

/**
 * Generate CollectionPage + ItemList JSON-LD schema
 */
export function generateCollectionSchema(collection, images = []) {
  if (!collection) return null;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${collection.title} Mobile Covers`,
    "description": collection.description || `Shop ${collection.title} themed mobile covers`,
    "url": `${SITE_URL}/collection/${collection.handle}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": images.length,
      "itemListElement": images.slice(0, 30).map((img, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "url": `${SITE_URL}/collection/${collection.handle}`,
        "name": img.alt || img.title || `${collection.title} Design ${idx + 1}`,
        "image": img.url || img.secure_url || img.path || ''
      }))
    }
  };
}

/**
 * Generate BreadcrumbList JSON-LD schema
 */
export function generateBreadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": item.name,
      "item": item.url ? `${SITE_URL}${item.url}` : undefined
    }))
  };
}

/**
 * Generate Article/BlogPosting JSON-LD schema
 */
export function generateArticleSchema(post) {
  if (!post) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt || post.description,
    "image": post.image || post.featuredImage || DEFAULT_IMAGE,
    "author": {
      "@type": "Organization",
      "name": BRAND_NAME,
      "url": SITE_URL
    },
    "publisher": {
      "@type": "Organization",
      "name": BRAND_NAME,
      "logo": {
        "@type": "ImageObject",
        "url": DEFAULT_IMAGE
      }
    },
    "datePublished": post.createdAt || post.publishedAt,
    "dateModified": post.updatedAt || post.createdAt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`
    },
    "url": `${SITE_URL}/blog/${post.slug}`
  };
}

/**
 * Generate FAQ JSON-LD schema
 */
export function generateFAQSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

/**
 * Generate SEO-friendly title with brand suffix
 */
export function seoTitle(title, includeBrand = true) {
  const maxLen = includeBrand ? 50 : 60;
  const truncated = title.length > maxLen ? title.substring(0, maxLen) + '...' : title;
  return includeBrand ? `${truncated} | ${BRAND_NAME}` : truncated;
}

/**
 * Generate SEO-friendly meta description
 */
export function seoDescription(text, maxLen = 155) {
  if (!text) return `Custom mobile covers & phone cases from CoverGhar. Starting ₹199. Fast delivery across India.`;
  return text.length > maxLen ? text.substring(0, maxLen - 3) + '...' : text;
}

/**
 * Sanitize and format keyword string
 */
export function formatKeywords(keywords = []) {
  return keywords
    .filter(Boolean)
    .map(k => k.toLowerCase().trim())
    .filter((k, i, arr) => arr.indexOf(k) === i) // unique
    .join(', ');
}

export default {
  generateProductSchema,
  generateCollectionSchema,
  generateBreadcrumbSchema,
  generateArticleSchema,
  generateFAQSchema,
  seoTitle,
  seoDescription,
  formatKeywords,
  SITE_URL,
  BRAND_NAME,
  DEFAULT_IMAGE
};
