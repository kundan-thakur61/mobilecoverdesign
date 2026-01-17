import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import OptimizedImage from '../components/OptimizedImage';

const PremiumCard = ({ image, title, subtitle, badge, delay, priority = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className={`group relative overflow-hidden rounded-3xl cursor-pointer animate-fade-in-up`}
      // style={{ animationDelay: `${delay}ms` }}
    >
      {/* Gradient border effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>

      {/* Main card container */}
      <div className="relative ">
        {/* Image container with parallax */}
        <div className="relative ">
          <OptimizedImage
            src={image}
            alt={title}
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            sizes="(min-width: 1024px) 45vw, 90vw"
            className="w-full h-full"
          />

          {/* Gradient overlay */}
          <div className="absolute "></div>

          {/* Animated shine effect */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(255,255,255,0.2), transparent 50%)`
            }}
          ></div>

          {/* Badge */}
          

          {/* Content overlay */}
          

          {/* Floating particles */}
          
        </div>

        {/* Bottom feature highlights */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-full group-hover:translate-y-0">
          <div className="flex items-center justify-between text-white text-sm">
           
            
          </div>
        </div>
      </div>
    </div>
  );
};

function PremiumCardSection() {
  const [activeCard, setActiveCard] = useState(null);

  return (
    <section className="py-20 bg-gradient-to-b from-white via-purple-50/30 to-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header with animation */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text text-sm font-bold uppercase tracking-wider">
              Choose Your Style
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Two Ways to Get Your
            <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-transparent bg-clip-text">
              Perfect Mobile Cover
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Choose from thousands of pre-designed themes or create your own custom phone case with our easy-to-use design tool
          </p>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-1 w-20 bg-gradient-to-r from-transparent to-purple-600 rounded-full"></div>
            <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
            <div className="h-1 w-20 bg-gradient-to-l from-transparent to-purple-600 rounded-full"></div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <Link to="/themes">
            <PremiumCard
              image="https://res.cloudinary.com/dwmytphop/image/upload/v1766311084/main_background_theame_ni9f5a.png"
              title="Pre-Designed Themes"
              subtitle="Explore 1000+ professionally crafted designs across anime, sports, nature, and abstract categories"
              badge="🎨 1000+ Designs"
              delay={0}
              priority
            />
          </Link>
          
          <Link to="/customizer">
            <PremiumCard
              image="https://res.cloudinary.com/dwmytphop/image/upload/v1766311082/Customised_theam_ghg4jm.png"
              title="Custom Design"
              subtitle="Upload your photos and create a one-of-a-kind mobile cover with our advanced design editor"
              badge="✨ Your Photos"
              delay={200}
            />
          </Link>
        </div>

        {/* Bottom features strip */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in animation-delay-800">
          {[
            { icon: '🎯', text: 'Perfect Fit', desc: 'All Models' },
            { icon: '⚡', text: 'Quick Print', desc: '24-48 Hours' },
            { icon: '🛡️', text: 'Durable', desc: 'Long Lasting' },
            { icon: '🚚', text: 'Fast Ship', desc: 'India Wide' }
          ].map((feature, i) => (
            <div 
              key={i}
              className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100"
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <div className="font-bold text-gray-900 mb-1">{feature.text}</div>
              <div className="text-sm text-gray-600">{feature.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) translateX(20px);
            opacity: 0;
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.05);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-800 {
          animation-delay: 0.8s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
}

// Hero component
function PremiumHero() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      <section className="relative text-white py-20 overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="space-y-6 animate-fade-in-up">
              <div className="inline-block">
                <span className="bg-yellow-400/20 text-yellow-300 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm border border-yellow-400/30 animate-pulse-slow">
                  ✨ Premium Quality Guaranteed
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="inline-block animate-slide-in-left bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                  Create Custom
                </span>
                <br />
                <span className="inline-block animate-slide-in-left animation-delay-200 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-200">
                  Mobile Covers
                </span>
                <br />
                <span className="block text-yellow-300 animate-slide-in-left animation-delay-400 drop-shadow-2xl">
                  Starting at ₹199
                </span>
              </h1>
              
              <p className="text-xl text-white/90 max-w-lg animate-fade-in animation-delay-600 leading-relaxed">
                Design personalized phone cases with your photos. Premium quality printing for all phone models. Fast delivery across India.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-800">
                {/* Design Your Cover */}
                <a
                  href="/customizer"
                  className="group inline-flex items-center justify-center bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 shadow-2xl hover:shadow-yellow-400/50 hover:scale-105 transform"
                >
                  <span>Design Your Cover</span>
                  <svg
                    className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </a>

                {/* Browse Designs */}
                <a
                  href="/products"
                  className="inline-flex items-center justify-center bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 border-2 border-white/30 hover:border-white/50 hover:scale-105 transform"
                >
                  Browse Designs
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/7827205492?text=Hi%20%F0%9F%91%8B%20CoverGhar%20Team%2C%0A%0AI%20want%20to%20design%20a%20custom%20mobile%20cover.%0APlease%20guide%20me%20with%20designs%2C%20price%20%26%20delivery%20details%20%F0%9F%98%8A"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-400 hover:to-emerald-400 transition-all duration-300 shadow-2xl hover:shadow-green-500/50 hover:scale-105 transform"
                >
                  <svg
                    className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                  </svg>
                  WhatsApp
                </a>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap gap-6 pt-6 animate-fade-in animation-delay-1000">
                {[
                  { icon: '🛡️', text: 'Premium Quality', color: 'from-blue-500 to-cyan-500' },
                  { icon: '🚚', text: 'Fast Delivery', color: 'from-purple-500 to-pink-500' },
                  { icon: '⭐', text: '4.8/5 Rating', color: 'from-yellow-500 to-orange-500' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 group cursor-pointer">
                    <div className={`p-3 bg-gradient-to-br ${item.color} rounded-xl backdrop-blur-sm group-hover:scale-110 transition-all shadow-lg`}>
                      <span className="text-2xl">{item.icon}</span>
                    </div>
                    <span className="text-sm font-semibold">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - placeholder for 3D canvas */}
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

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" fillOpacity="0.1"/>
            <path d="M0 120L60 112.5C120 105 240 90 360 82.5C480 75 600 75 720 78.75C840 82.5 960 90 1080 93.75C1200 97.5 1320 97.5 1380 97.5L1440 97.5V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      <PremiumCardSection />

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        
        .animate-blob { animation: blob 7s infinite; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .animate-slide-in-left { animation: slide-in-left 0.8s ease-out forwards; }
        .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-800 { animation-delay: 0.8s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}

export default PremiumHero;