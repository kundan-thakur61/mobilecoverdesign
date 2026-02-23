import { useRef, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import OptimizedImage from '../components/OptimizedImage';
import SEO from '../components/SEO';
import './Home.css';

const PremiumCard = memo(({ image, title, subtitle, badge, priority = false }) => {
  const cardRef = useRef(null);
  const overlayRef = useRef(null);
  const rafRef = useRef(null);

  // Mouse tracking with direct DOM manipulation (no re-renders)
  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current || !overlayRef.current || window.innerWidth < 768) return;
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      if (!cardRef.current || !overlayRef.current) { rafRef.current = null; return; }
      const rect = cardRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      overlayRef.current.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.2), transparent 50%)`;
      rafRef.current = null;
    });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="group relative overflow-hidden rounded-2xl sm:rounded-3xl cursor-pointer animate-fade-in-up"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
      <div className="relative">
        <div className="relative" style={{ aspectRatio: '16/10' }}>
          <OptimizedImage
            src={image}
            alt={title}
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            sizes="(min-width: 1024px) 45vw, (min-width: 640px) 90vw, 100vw"
            aspectRatio="16/10"
            className="w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          <div
            ref={overlayRef}
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden sm:block"
          ></div>
          {badge && (
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-white/90 backdrop-blur-sm text-gray-900 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
              {badge}
            </div>
          )}
          <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 text-white">
            <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2">{title}</h3>
            {subtitle && <p className="text-xs sm:text-sm opacity-90 line-clamp-2 sm:line-clamp-none">{subtitle}</p>}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/60 to-transparent backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-full group-hover:translate-y-0 hidden sm:block">
          <div className="flex items-center justify-between text-white text-sm">
            <span>Click to explore</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
});

PremiumCard.displayName = 'PremiumCard';

function PremiumCardSection() {
  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-b from-white via-purple-50/30 to-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 xl:gap-12">
          <Link to="/themes">
            <PremiumCard
              image="https://res.cloudinary.com/dwmytphop/image/upload/v1768802259/main_background_theame_aqmriv.png"
              title="Pre-Designed Themes"
              subtitle="Explore 1000+ professionally crafted designs across anime, sports, nature, and abstract categories"
              badge="🎨 1000+ Designs"
              priority
            />
          </Link>
          <Link to="/customizer">
            <PremiumCard
              image="https://res.cloudinary.com/dwmytphop/image/upload/v1768802258/Customised_theam_my15vv.png"
              title="Custom Design"
              subtitle="Upload your photos and create a one-of-a-kind mobile cover with our advanced design editor"
              badge="✨ Your Photos"
              priority
            />
          </Link>
        </div>

        <div className="mt-8 sm:mt-12 lg:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 animate-fade-in animation-delay-800">
          {[
            { icon: '🎯', text: 'Perfect Fit', desc: 'All Models' },
            { icon: '⚡', text: 'Quick Print', desc: '24-48 Hours' },
            { icon: '🛡️', text: 'Durable', desc: 'Long Lasting' },
            { icon: '🚚', text: 'Fast Ship', desc: 'India Wide' }
          ].map((feature, i) => (
            <div 
              key={i}
              className="text-center p-3 sm:p-4 md:p-6 bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100"
            >
              <div className="text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2 md:mb-3">{feature.icon}</div>
              <div className="font-bold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1">{feature.text}</div>
              <div className="text-xs sm:text-sm text-gray-600 hidden sm:block">{feature.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="relative text-white py-10 sm:py-16 md:py-20 overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      <div className="absolute inset-0 opacity-30 hidden sm:block">
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col gap-3 sm:gap-4 justify-center animate-fade-in-up animation-delay-800">
          {/* Primary CTA - Full width on mobile */}
          <Link
            to="/customizer"
            className="group inline-flex items-center justify-center bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base md:text-lg hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 shadow-xl sm:shadow-2xl hover:shadow-yellow-400/50 hover:scale-105 transform min-h-[44px]"
          >
            <span>Design Your Cover</span>
            <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          
          {/* Secondary CTAs - Row on tablet/desktop */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              to="/products"
              className="inline-flex items-center justify-center bg-white/10 backdrop-blur-md text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base md:text-lg hover:bg-white/20 transition-all duration-300 border-2 border-white/30 hover:border-white/50 hover:scale-105 transform min-h-[44px]"
            >
              Browse Designs
            </Link>
            <a
              href="https://wa.me/7827205492?text=Hi%20%F0%9F%91%8B%20CoverGhar%20Team%2C%0A%0AI%20want%20to%20design%20a%20custom%20mobile%20cover.%0APlease%20guide%20me%20with%20designs%2C%20price%20%26%20delivery%20details%20%F0%9F%98%8A"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base md:text-lg hover:from-green-400 hover:to-emerald-400 transition-all duration-300 shadow-xl sm:shadow-2xl hover:shadow-green-500/50 hover:scale-105 transform min-h-[44px]"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:rotate-12 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
              </svg>
              WhatsApp
            </a>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-6 pt-4 sm:pt-6 justify-center animate-fade-in animation-delay-1000">
          {[
            { icon: '🛡️', text: 'Premium Quality', color: 'from-blue-500 to-cyan-500' },
            { icon: '🚚', text: 'Fast Delivery', color: 'from-purple-500 to-pink-500' },
            { icon: '⭐', text: '4.8/5 Rating', color: 'from-yellow-500 to-orange-500' }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 sm:gap-3 group cursor-pointer">
              <div className={`p-2 sm:p-3 bg-gradient-to-br ${item.color} rounded-lg sm:rounded-xl backdrop-blur-sm group-hover:scale-110 transition-all shadow-md sm:shadow-lg`}>
                <span className="text-lg sm:text-xl md:text-2xl">{item.icon}</span>
              </div>
              <span className="text-xs sm:text-sm font-semibold">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PremiumHero() {
  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "CoverGhar — Custom Mobile Covers Online India",
    "description": "Create personalized mobile covers with your photos at ₹199. Premium quality phone cases for iPhone, Samsung, OnePlus & all brands. Fast shipping across India.",
    "url": "https://www.coverghar.in",
    "mainEntity": {
      "@type": "Product",
      "name": "Custom Mobile Cover",
      "brand": { "@type": "Brand", "name": "CoverGhar" },
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "INR",
        "lowPrice": "199",
        "highPrice": "599",
        "availability": "https://schema.org/InStock",
        "offerCount": "1000+"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "1250"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      <SEO
        title="Custom Mobile Covers Online @₹199 | Design Your Phone Case — CoverGhar"
        description="Create personalized mobile covers with your photos at ₹199. Premium quality phone cases for iPhone, Samsung, OnePlus & all brands. Fast shipping across India. Design now!"
        keywords="custom mobile covers, personalized phone cases, photo phone covers, design your own phone case, mobile cover online India, CoverGhar, custom phone case India, mobile back cover"
        url="/"
        type="website"
        schema={homeSchema}
      />
      <section className="relative text-white py-12 sm:py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-30 hidden sm:block">
          <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-4 sm:space-y-6 animate-fade-in-up text-center lg:text-left">
              <div className="inline-block">
                <span className="bg-yellow-400/20 text-yellow-300 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold backdrop-blur-sm border border-yellow-400/30 animate-pulse-slow">
                  ✨ Premium Quality Guaranteed
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="inline-block animate-slide-in-left bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                  Create Custom
                </span>
                <br />
                <span className="inline-block animate-slide-in-left animation-delay-200 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-200">
                  Mobile Covers
                </span>
                <br />
                <span className="block text-yellow-300 animate-slide-in-left animation-delay-400 drop-shadow-2xl text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                  Starting at ₹199
                </span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 max-w-lg animate-fade-in animation-delay-600 leading-relaxed mx-auto lg:mx-0">
                Design personalized phone cases with your photos. Premium quality printing for all phone models. Fast delivery across India.
              </p>
              
              {/* Mobile CTA buttons - visible only on mobile */}
              <div className="flex flex-col gap-3 mt-4 lg:hidden">
                <Link
                  to="/customizer"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-6 py-3 rounded-xl font-semibold text-sm hover:from-yellow-300 hover:to-yellow-400 transition-all min-h-[44px]"
                >
                  Design Your Cover
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-white/20 transition-all border border-white/30 min-h-[44px]"
                >
                  Browse Designs
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl p-8 backdrop-blur-sm border border-white/10">
                <div className="text-center text-white/80">
                  <div className="text-6xl mb-4">📱</div>
                  <h3 className="text-2xl font-bold mb-2">Interactive 3D Preview</h3>
                  <p className="text-white/70">Coming Soon - Real-time phone case visualization</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" fillOpacity="0.1"/>
            <path d="M0 120L60 112.5C120 105 240 90 360 82.5C480 75 600 75 720 78.75C840 82.5 960 90 1080 93.75C1200 97.5 1320 97.5 1380 97.5L1440 97.5V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      <PremiumCardSection />
      <CTASection />
    </div>
  );
}

export default PremiumHero;