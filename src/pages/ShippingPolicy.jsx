import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const ShippingPolicy = () => {
  // Enhanced schema markup for better SEO
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Shipping Policy | Cover Ghar",
    "url": "https://www.coverghar.in/shipping-policy",
    "description": "Check our shipping policy for delivery timelines, charges, and courier partners.",
    "dateModified": "2025-12-23",
    "datePublished": "2025-12-23",
    "inLanguage": "en",
    "publisher": {
      "@type": "Organization",
      "name": "Cover Ghar",
      "url": "https://www.coverghar.in"
    },
    "mainEntity": {
      "@type": "Article",
      "headline": "Shipping Policy",
      "description": "Comprehensive shipping policy covering delivery timelines, charges, and courier partners."
    }
  };

  // Structured content data for better maintainability
  const shippingContent = [
    {
      id: 'intro',
      icon: '📦',
      title: 'Shipping Policy',
      content: 'Welcome to Cover Ghar. We aim to deliver your products safely and on time. Please read our shipping policy carefully.',
      type: 'text'
    },
    {
      id: 'shipping-locations',
      icon: '🚚',
      title: 'Shipping Locations',
      content: 'We ship across India to most serviceable PIN codes. Delivery to remote locations may take additional time.',
      type: 'text'
    },
    {
      id: 'order-processing',
      icon: '⏱️',
      title: 'Order Processing Time',
      items: [
        'Orders are processed within 1–2 business days.',
        'Delay may occur during festivals or sales.'
      ],
      type: 'ordered-list'
    },
    {
      id: 'shipping-charges',
      icon: '💰',
      title: 'Shipping Charges',
      content: 'Shipping charges depend on order value and location. Final charges are shown at checkout.',
      type: 'text'
    },
    {
      id: 'courier-partners',
      icon: '📦',
      title: 'Courier Partners',
      content: 'We use Delhivery, Ecom Express, Blue Dart, or other trusted partners.',
      type: 'text'
    },
    {
      id: 'order-tracking',
      icon: '🔍',
      title: 'Order Tracking',
      content: 'Tracking details are sent via SMS or Email after shipping.',
      type: 'text'
    },
    {
      id: 'delivery-delays',
      icon: '❌',
      title: 'Delivery Delays',
      content: 'Delays due to courier, weather, or wrong address are not our responsibility, but we will help as much as possible.',
      type: 'text'
    },
    {
      id: 'incorrect-address',
      icon: '🏠',
      title: 'Incorrect Address',
      content: 'Please enter the correct address. Re-delivery may cost extra if the address is wrong.',
      type: 'text'
    },
    {
      id: 'contact',
      icon: '📞',
      title: 'Contact Us',
      content: 'Email: coverghar@gmail.com',
      type: 'text'
    }
  ];

  /**
   * Reusable section component for consistent rendering
   * @param {Object} section - Section data object
   * @param {boolean} isFirst - Whether this is the first section (for h1 vs h2)
   */
  const ShippingSection = ({ section, isFirst = false }) => {
    // Use h1 for the first section, h2 for others to maintain proper heading hierarchy
    const HeadingTag = isFirst ? 'h1' : 'h2';
    
    return (
      <section 
        id={section.id}
        className="scroll-mt-8"
        aria-labelledby={`${section.id}-heading`}
      >
        <HeadingTag 
          id={`${section.id}-heading`}
          className={`${isFirst ? 'text-2xl' : 'text-xl'} font-bold mb-2 flex items-center gap-2`}
        >
          <span role="img" aria-label={section.title.toLowerCase()}>
            {section.icon}
          </span>
          {section.title}
        </HeadingTag>
        
        {/* Render content based on section type */}
        {section.type === 'text' && section.content && (
          <p className="text-gray-700">
            {section.content}
          </p>
        )}
        
        {/* Render ordered list for processing time section */}
        {section.type === 'ordered-list' && section.items && (
          <ol className="list-decimal list-inside text-gray-700 space-y-1">
            {section.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ol>
        )}
      </section>
    );
  };

  return (
    <>
      {/* Enhanced SEO with schema markup */}
      <SEO
        title="Shipping Policy | Cover Ghar"
        description="Check our shipping policy for delivery timelines, charges, and courier partners."
        url="/shipping-policy"
        type="article"
        schema={schema}
      />

      {/* Main content with proper semantic structure */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="prose prose-gray max-w-none">
          {/* Table of contents for better navigation */}
          <nav className="mb-8 p-4 bg-gray-50 rounded-lg" aria-label="Shipping policy navigation">
            <h2 className="text-lg font-semibold mb-3">Quick Navigation</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
              {shippingContent.map((section) => (
                <li key={section.id}>
                  <a 
                    href={`#${section.id}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-2 p-2 rounded hover:bg-white transition-colors"
                    aria-label={`Navigate to ${section.title} section`}
                  >
                    <span role="img" aria-hidden="true">{section.icon}</span>
                    <span className="truncate">{section.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Main content sections with consistent spacing */}
          <div className="space-y-8">
            {shippingContent.map((section, index) => (
              <ShippingSection 
                key={section.id} 
                section={section} 
                isFirst={index === 0}
              />
            ))}
          </div>

          {/* Footer with additional information */}
          <footer className="mt-12 pt-8 border-t border-gray-200">
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This shipping policy is subject to change. 
                Please check this page regularly for updates.
              </p>
            </div>
            
            <p className="text-sm text-gray-600">
              <strong>Last updated:</strong> December 23, 2025
            </p>
            <p className="text-sm text-gray-600 mt-2">
              For any shipping-related queries, please contact our customer support team.
            </p>
          </footer>
        </div>
      </main>
    </>
  );
};

export default ShippingPolicy;
