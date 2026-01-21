import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import collectionAPI from '../api/collectionAPI';
import { FALLBACK_COLLECTIONS } from '../data/fallbackCollections';
import { resolveImageUrl } from '../utils/helpers';
import SEO from '../components/SEO';

const DEFAULT_ACCENT = '#0ea5e9';
const DEFAULT_TAGLINE = 'Fresh drop';

/* Fallback cards (local images only) */
const FALLBACK_CARDS = FALLBACK_COLLECTIONS.map((collection) => ({
  id: collection._id,
  handle: collection.handle,
  title: collection.title,
  image: (typeof collection.heroImage === 'string' ? collection.heroImage : collection.heroImage?.url) || collection.images?.[0]?.url || '',
  tagline: collection.tagline || DEFAULT_TAGLINE,
  accent: collection.accentColor || DEFAULT_ACCENT,
}));

const IMAGE_ERROR_FALLBACK =
  FALLBACK_CARDS[0]?.image || '/frames/frame-1-fixed.svg';

const Themes = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const fetchCollections = async () => {
      try {
        const res = await collectionAPI.listPublic();
        if (!cancelled) {
          setCollections(res?.data?.data?.collections || []);
        }
      } catch {
        if (!cancelled) setCollections([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchCollections();
    return () => {
      cancelled = true;
    };
  }, []);

  /* Build cards */
  const cards = useMemo(() => {
    return FALLBACK_CARDS;
  }, [collections]);

  const handleImgError = (e) => {
    e.currentTarget.src = IMAGE_ERROR_FALLBACK;
  };

  const handleKeyDown = (e, handle) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate(`/collection/${handle}`);
    }
  };

  // Enhanced Schema with ItemList
  const themesSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "name": "Mobile Cover Themes & Designer Collections - CoverGhar",
        "description": "Explore curated themes and collections for custom mobile covers. Anime, nature, abstract, minimalist designs for all phone brands.",
        "url": "https://www.coverghar.in/themes",
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://www.coverghar.in"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Themes & Collections",
              "item": "https://www.coverghar.in/themes"
            }
          ]
        }
      },
      {
        "@type": "ItemList",
        "name": "Mobile Cover Theme Collections",
        "numberOfItems": cards.length,
        "itemListElement": cards.slice(0, 10).map((card, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Collection",
            "name": card.title,
            "url": `https://www.coverghar.in/collection/${card.handle}`,
            "image": resolveImageUrl(card.image)
          }
        }))
      }
    ]
  };

  return (
    <>
      <SEO
        title="Mobile Cover Themes & Collections | Designer Phone Cases - CoverGhar"
        description="Browse 100+ curated mobile cover themes - anime, nature, abstract, minimalist designs. Premium quality custom phone cases for iPhone, Samsung, OnePlus. Shop themed collections now!"
        keywords="mobile cover themes, phone case collections, designer mobile covers, anime phone cases, themed mobile covers India, custom phone case designs, trending mobile covers, aesthetic phone cases"
        url="/themes"
        schema={themesSchema}
      />
      
      <section className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li>
                <Link to="/" className="hover:text-primary-600 transition-colors">
                  Home
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900 font-medium">
                Themes & Collections
              </li>
            </ol>
          </nav>

          {/* Hero Section with SEO Content */}
          <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl shadow-lg p-8 mb-12 text-white">
            <div className="max-w-4xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Mobile Cover Themes & Designer Collections
              </h1>
              <p className="text-lg text-white/90 mb-6">
                Explore our exclusive collection of themed mobile covers designed to match your unique style and personality. From trending anime designs to elegant minimalist patterns, discover premium phone cases that make a statement.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>100+ Designs</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>All Phone Models</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Premium Quality</span>
                </div>
              </div>
            </div>
          </div>

{/* Theme Collections Grid */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Browse All Theme Collections</h2>
                <p className="text-gray-600 mt-1">
                  {cards.length} unique collections available for all phone models
                </p>
              </div>
              <Link 
                to="/customizer"
                className="hidden md:inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Create Custom Design
              </Link>
            </div>

            <div className="bg-white/25 rounded-2xl p-3 ">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {loading
      ? Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-64 rounded-2xl"
          />
        ))
      : cards.map((card) => (
          <Link
            key={card.id}
            to={`/collection/${card.handle}`}
            onKeyDown={(e) => handleKeyDown(e, card.handle)}
            aria-label={`Browse ${card.title} mobile cover collection`}
            className="group relative h-64 rounded-2xl "
          >
            {/* Image with enhanced effects - Fixed to show full image */}
            <img
              src={resolveImageUrl(card.image) || IMAGE_ERROR_FALLBACK}
              alt={`${card.title} themed mobile covers and phone cases collection`}
              loading="lazy"
              onError={handleImgError}
              className="absolute inset-0 w-full h-full "
            />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                        {/* Badge */}
                        {/*  */}

                        {/* Text Content */}
                        <div className="relative z-10 h-full flex flex-col justify-end items-end p-6 text-white">
  <h3 
    className="text-5xl font-black mb-2 cursor-pointer select-none"
    style={{
      background: 'linear-gradient(45deg, #ff0000, #ff6b00, #ffd000, #ff0000)',
      backgroundSize: '200% 200%',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      textShadow: '0 0 20px rgba(255,0,0,0.5), 0 0 40px rgba(255,107,0,0.3)',
      filter: 'drop-shadow(4px 4px 0px rgba(0,0,0,0.4)) drop-shadow(8px 8px 0px rgba(0,0,0,0.2))',
      transform: 'perspective(800px) rotateY(-20deg) rotateX(10deg)',
      transformStyle: 'preserve-3d',
      animation: 'gradient 3s ease infinite, float 3s ease-in-out infinite',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(30px) scale(1.1)';
      e.currentTarget.style.filter = 'drop-shadow(6px 6px 0px rgba(255,0,0,0.6)) drop-shadow(12px 12px 20px rgba(255,107,0,0.4))';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'perspective(800px) rotateY(-20deg) rotateX(10deg)';
      e.currentTarget.style.filter = 'drop-shadow(4px 4px 0px rgba(0,0,0,0.4)) drop-shadow(8px 8px 0px rgba(0,0,0,0.2))';
    }}
  >
    ✨ Click Here ✨
  </h3>
  
  <style jsx>{`
    @keyframes gradient {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
    
    @keyframes float {
      0%, 100% { transform: perspective(800px) rotateY(-20deg) rotateX(10deg) translateY(0px); }
      50% { transform: perspective(800px) rotateY(-20deg) rotateX(10deg) translateY(-10px); }
    }
  `}</style>
</div>

                        {/* Hover Effect Border */}
                        {/* <div className="absolute inset-0 border-4 border-primary-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" /> */}
                      </Link>
                    ))}
              </div>
            </div>
          </div>



          {/* SEO-Rich Content Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-12">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Discover Themed Mobile Covers for Every Style
              </h2>
              
              <p className="text-gray-700 mb-4">
                Our curated collection of themed mobile covers brings together the best designs across multiple categories. Whether you're an anime enthusiast, nature lover, or minimalist design appreciator, our themed collections offer high-quality prints with premium smartphone protection.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
                Popular Theme Categories
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">🎌 Anime & Manga Covers</h4>
                  <p className="text-sm text-gray-600">
                    Express your love for anime with covers featuring popular characters and series. Perfect for otaku culture enthusiasts.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">🌿 Nature & Landscape Themes</h4>
                  <p className="text-sm text-gray-600">
                    Bring the beauty of nature to your phone with stunning landscapes, floral patterns, and wildlife designs.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">🎨 Abstract & Artistic Designs</h4>
                  <p className="text-sm text-gray-600">
                    Contemporary abstract patterns and artistic interpretations for the modern aesthetic enthusiast.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">✨ Minimalist & Clean Patterns</h4>
                  <p className="text-sm text-gray-600">
                    Simple, elegant designs with clean lines and subtle patterns for a sophisticated look.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
                Why Choose CoverGhar Themed Collections?
              </h3>
              
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 mt-1">✓</span>
                  <span><strong>Premium Quality Printing:</strong> UV printing technology ensures vibrant colors that last</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 mt-1">✓</span>
                  <span><strong>Perfect Fit Guarantee:</strong> Precision-cut designs for all major phone brands including iPhone, Samsung, OnePlus, Realme, Vivo, and Xiaomi</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 mt-1">✓</span>
                  <span><strong>Scratch-Resistant:</strong> Durable materials protect both your phone and the design</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 mt-1">✓</span>
                  <span><strong>Customizable:</strong> Add personal touches to any themed design</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 mt-1">✓</span>
                  <span><strong>Fast Delivery:</strong> Quick shipping across India within 5-7 days</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 mt-1">✓</span>
                  <span><strong>Regular Updates:</strong> New designs added weekly based on trending styles</span>
                </li>
              </ul>

              <p className="text-gray-700 mt-6">
                Each themed mobile cover in our collection is carefully designed by professional artists and optimized for smartphone protection. Browse through our exclusive collections and find the perfect design that represents your unique personality and style preferences.
              </p>

              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mt-6">
                <p className="text-primary-900 font-medium mb-2">
                  💡 Pro Tip: Can't find the exact theme you want?
                </p>
                <p className="text-primary-800 text-sm">
                  Use our custom design tool to upload your own images or create completely unique designs from scratch. Combine themed elements with personal photos for truly one-of-a-kind mobile covers!
                </p>
              </div>
            </div>
          </div>

          

          {/* FAQ Section for Themes */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Frequently Asked Questions About Themed Mobile Covers
            </h2>
            
            <div className="space-y-4 max-w-3xl mx-auto">
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="font-semibold text-gray-900">Can I customize themed mobile covers?</span>
                  <span className="text-primary-600 group-open:rotate-180 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 px-4 text-gray-600">
                  Yes! While our themed collections come with pre-designed patterns, you can add personal touches like text, names, or combine them with your own photos using our customization tool.
                </p>
              </details>

              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="font-semibold text-gray-900">Are themed covers available for all phone models?</span>
                  <span className="text-primary-600 group-open:rotate-180 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 px-4 text-gray-600">
                  Absolutely! Our themed designs are available for all major phone brands including iPhone (15, 14, 13, SE), Samsung Galaxy (S24, S23, A series), OnePlus, Realme, Vivo, Oppo, and Xiaomi models.
                </p>
              </details>

              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="font-semibold text-gray-900">How often are new themes added?</span>
                  <span className="text-primary-600 group-open:rotate-180 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 px-4 text-gray-600">
                  We add new themed designs weekly based on trending styles, seasonal themes, and customer requests. Follow us on social media to stay updated with the latest additions to our collections.
                </p>
              </details>

              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="font-semibold text-gray-900">What's the quality of themed print covers?</span>
                  <span className="text-primary-600 group-open:rotate-180 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 px-4 text-gray-600">
                  We use advanced UV printing technology that ensures vibrant, long-lasting colors that won't fade or scratch easily. All our themed covers are made with premium materials for durability and protection.
                </p>
              </details>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl shadow-lg p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Can't Find Your Perfect Theme?
            </h2>
            <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
              Create your own unique mobile cover design with our easy-to-use customization tool. Upload your photos, add text, and design something completely original!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/customizer"
                className="inline-flex items-center justify-center bg-white text-primary-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
              >
                Start Custom Design
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/20 transition-colors"
              >
                Browse All Products
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Themes;