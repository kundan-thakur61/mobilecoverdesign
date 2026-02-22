import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiYoutube, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-8 sm:py-10 lg:py-12">
        {/* Top Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 mb-8 sm:mb-10">

          {/* Brand Column */}
          <div className="space-y-3 sm:space-y-4 lg:col-span-2 col-span-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity"
              aria-label="CoverGhar - Custom Mobile Covers Home"
            >
              <img
                src="/logo.png"
                alt="CoverGhar Logo - Custom Mobile Covers"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg"
                width="40"
                height="40"
              />
              <span className="text-lg sm:text-xl font-bold">CoverGhar</span>
            </Link>

            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-xs">
              India's leading custom mobile cover store. Design personalized phone cases with premium quality printing and fast delivery across India.
            </p>

            {/* Social Media Links */}
            <div className="flex gap-3 sm:gap-4">
              <a
                href="https://www.facebook.com/profile.php?id=61584778613908"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow CoverGhar on Facebook"
                className="p-2 sm:p-2.5 bg-gray-800 rounded-lg hover:bg-primary-600 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <FiFacebook className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
              </a>

              <a
                href="https://www.instagram.com/gharcover"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow CoverGhar on Instagram"
                className="p-2 sm:p-2.5 bg-gray-800 rounded-lg hover:bg-primary-600 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <FiInstagram className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
              </a>

              <a
                href="https://youtube.com/@coverghar"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Subscribe to CoverGhar on YouTube"
                className="p-2 sm:p-2.5 bg-gray-800 rounded-lg hover:bg-primary-600 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <FiYoutube className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">Shop</h3>
            <ul className="space-y-1.5 sm:space-y-2.5">
              <li>
                <Link
                  to="/products"
                  className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm py-1 inline-block"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/themes"
                  className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm py-1 inline-block"
                >
                  Designer Themes
                </Link>
              </li>

              <li>
                <Link
                  to="/category/iphone"
                  className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm py-1 inline-block"
                >
                  iPhone Covers
                </Link>
              </li>
              <li>
                <Link
                  to="/category/samsung"
                  className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm py-1 inline-block"
                >
                  Samsung Covers
                </Link>
              </li>
              <li>
                <Link
                  to="/category/oneplus"
                  className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm py-1 inline-block"
                >
                  OnePlus Covers
                </Link>
              </li>
              <li className="hidden sm:block">
                <Link
                  to="/category/realme"
                  className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm py-1 inline-block"
                >
                  Realme Covers
                </Link>
              </li>
              <li className="hidden sm:block">
                <Link
                  to="/category/vivo"
                  className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm py-1 inline-block"
                >
                  Vivo Covers
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">Support</h3>
            <ul className="space-y-1.5 sm:space-y-2.5">
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm py-1 inline-block"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm py-1 inline-block"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping-policy"
                  className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm py-1 inline-block"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/returns-refunds"
                  className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm py-1 inline-block"
                >
                  Returns & Refunds
                </Link>
              </li>
              <li className="hidden sm:block">
                <Link
                  to="/privacy-policy"
                  className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm py-1 inline-block"
                >
                  Privacy Policy
                </Link>
              </li>
              <li className="hidden sm:block">
                <Link
                  to="/terms-conditions"
                  className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm py-1 inline-block"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">Contact</h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li>
                <a
                  href="mailto:coverghar@gmail.com"
                  className="text-gray-400 hover:text-white transition-colors flex items-start gap-2 py-1"
                  aria-label="Email CoverGhar support"
                >
                  <FiMail className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span className="break-all">coverghar@gmail.com</span>
                </a>
              </li>
              <li className="text-gray-400 flex items-start gap-2">
                <FiMapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-medium text-white mb-0.5 sm:mb-1 text-xs sm:text-sm">Address</p>
                  <p className="text-xs sm:text-sm">Ranchi, Jharkhand</p>
                  <p className="text-xs sm:text-sm">India - 825418</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Popular Searches - SEO Link Section */}
        <div className="border-t border-gray-800 pt-6 sm:pt-8 mb-6 sm:mb-8">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 sm:mb-4">
            Popular Searches
          </h3>
          <div className="flex flex-wrap gap-x-2 sm:gap-x-4 gap-y-1.5 sm:gap-y-2 text-[10px] sm:text-xs">
            <Link to="/products?search=iPhone%2015" className="text-gray-500 hover:text-primary-500 transition-colors">
              iPhone 15 Covers
            </Link>
            <span className="text-gray-700 hidden sm:inline">•</span>
            <Link to="/products?search=Samsung%20S24" className="text-gray-500 hover:text-primary-500 transition-colors">
              Samsung S24 Cases
            </Link>
            <span className="text-gray-700 hidden sm:inline">•</span>
            <Link to="/products?search=OnePlus%2012" className="text-gray-500 hover:text-primary-500 transition-colors">
              OnePlus 12 Covers
            </Link>
            <span className="text-gray-700 hidden sm:inline">•</span>
            <Link to="/themes?category=anime" className="text-gray-500 hover:text-primary-500 transition-colors">
              Anime Covers
            </Link>
            <span className="text-gray-700 hidden sm:inline">•</span>
            <Link to="/customizer" className="text-gray-500 hover:text-primary-500 transition-colors">
              Custom Photo Covers
            </Link>
            <span className="text-gray-700 hidden md:inline">•</span>
            <Link to="/themes?category=designer" className="text-gray-500 hover:text-primary-500 transition-colors hidden md:inline">
              Designer Cases
            </Link>
            <span className="text-gray-700 hidden md:inline">•</span>
            <Link to="/products?search=Realme" className="text-gray-500 hover:text-primary-500 transition-colors hidden md:inline">
              Realme Covers
            </Link>
            <span className="text-gray-700 hidden md:inline">•</span>
            <Link to="/products?search=Vivo" className="text-gray-500 hover:text-primary-500 transition-colors hidden md:inline">
              Vivo Covers
            </Link>
            <span className="text-gray-700 hidden lg:inline">•</span>
            <Link to="/products?search=Oppo" className="text-gray-500 hover:text-primary-500 transition-colors hidden lg:inline">
              Oppo Covers
            </Link>
            <span className="text-gray-700 hidden lg:inline">•</span>
            <Link to="/products?search=Xiaomi" className="text-gray-500 hover:text-primary-500 transition-colors hidden lg:inline">
              Xiaomi Covers
            </Link>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="border-t border-gray-800 pt-6 sm:pt-8 mb-6 sm:mb-8">
          <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-full flex items-center justify-center mb-1.5 sm:mb-2">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-400 font-medium">Premium Quality</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-full flex items-center justify-center mb-1.5 sm:mb-2">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-400 font-medium">Fast Delivery</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-full flex items-center justify-center mb-1.5 sm:mb-2">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-400 font-medium">Secure Payment</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-full flex items-center justify-center mb-1.5 sm:mb-2">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-400 font-medium">Easy Returns</p>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-800 pt-6 sm:pt-8 mb-6 sm:mb-8">
          <p className="text-[10px] sm:text-xs text-gray-400 text-center mb-2 sm:mb-3">We Accept</p>
          <div className="flex justify-center items-center gap-2 sm:gap-4 flex-wrap">
            <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-800 rounded text-[10px] sm:text-xs font-medium text-gray-400">
              UPI
            </span>
            <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-800 rounded text-[10px] sm:text-xs font-medium text-gray-400">
              Credit Card
            </span>
            <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-800 rounded text-[10px] sm:text-xs font-medium text-gray-400">
              Debit Card
            </span>
            <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-800 rounded text-[10px] sm:text-xs font-medium text-gray-400 hidden sm:inline-block">
              Net Banking
            </span>
            <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-800 rounded text-[10px] sm:text-xs font-medium text-gray-400 hidden sm:inline-block">
              Wallets
            </span>
            <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-800 rounded text-[10px] sm:text-xs font-medium text-gray-400">
              COD
            </span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-gray-500 text-xs sm:text-sm text-center sm:text-left">
              © {currentYear} CoverGhar. All rights reserved.
            </p>
            <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-gray-500">
              <span>Made with ❤️ in India</span>
              <span className="hidden sm:inline">•</span>
              <a
                href="https://www.coverghar.in/sitemap.xml"
                className="hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Schema.org Organization markup */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "CoverGhar",
          "url": "https://www.coverghar.in",
          "logo": "/logo.png",
          "description": "India's leading custom mobile cover store. Design personalized phone cases with premium quality printing.",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Ranchi",
            "addressRegion": "Jharkhand",
            "postalCode": "825418",
            "addressCountry": "IN"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "email": "coverghar@gmail.com",
            "contactType": "Customer Service",
            "areaServed": "IN",
            "availableLanguage": ["English", "Hindi"]
          },
          "sameAs": [
            "https://www.facebook.com/profile.php?id=61584778613908",
            "https://www.instagram.com/gharcover",
            "https://youtube.com/@coverghar"
          ]
        })}
      </script>
    </footer>
  );
};

export default Footer;