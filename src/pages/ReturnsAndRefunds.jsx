import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const ReturnsAndRefunds = () => {
  // Enhanced schema markup for better SEO performance
  const structuredDataSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Returns & Refunds | Cover Ghar",
    "url": "https://www.coverghar.in/returns-refunds",
    "description": "Understand our returns and refunds policy for mobile covers and accessories.",
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
      "headline": "Returns & Refunds Policy",
      "description": "Comprehensive returns and refunds policy covering eligibility, process, and timelines."
    }
  };

  // Structured content data for enhanced maintainability and easy updates
  const returnsAndRefundsContent = [
    {
      sectionId: 'policy-overview',
      iconEmoji: '📋',
      sectionTitle: 'Returns & Refunds Policy',
      contentText: 'At Cover Ghar, we want you to be completely satisfied with your purchase. This policy outlines our returns and refunds process to ensure a smooth experience for our customers.',
      contentType: 'text'
    },
    {
      sectionId: 'return-eligibility',
      iconEmoji: '✅',
      sectionTitle: 'Return Eligibility',
      contentText: 'Items are eligible for return if they meet the following criteria:',
      listItems: [
        'Product is defective, damaged, or not as described',
        'Return request is made within 7 days of delivery',
        'Item is in original condition with all packaging and accessories',
        'Product has not been used or damaged by the customer',
        'Original invoice or order confirmation is available'
      ],
      contentType: 'bulleted-list'
    },
    {
      sectionId: 'non-returnable-items',
      iconEmoji: '❌',
      sectionTitle: 'Non-Returnable Items',
      contentText: 'The following items cannot be returned:',
      listItems: [
        'Products damaged due to misuse or normal wear and tear',
        'Items returned after 7 days of delivery',
        'Products without original packaging or accessories',
        'Customized or personalized products (if applicable)',
        'Items that have been tampered with or modified'
      ],
      contentType: 'bulleted-list'
    },
    {
      sectionId: 'return-process',
      iconEmoji: '🔄',
      sectionTitle: 'How to Return an Item',
      contentText: 'Follow these simple steps to return your product:',
      listItems: [
        'Contact our customer support at coverghar@gmail.com within 7 days',
        'Provide your order number and reason for return',
        'Wait for return authorization and instructions',
        'Pack the item securely in original packaging',
        'Ship the item using the provided return label (if applicable)',
        'Track your return shipment until it reaches our facility'
      ],
      contentType: 'numbered-list'
    },
    {
      sectionId: 'refund-process',
      iconEmoji: '💰',
      sectionTitle: 'Refund Process',
      contentText: 'Once we receive and inspect your returned item:',
      listItems: [
        'Inspection completed within 2-3 business days of receipt',
        'Refund approval notification sent via email',
        'Refund processed within 5-7 business days',
        'Amount credited to original payment method',
        'Refund confirmation sent via email and SMS'
      ],
      additionalInfo: 'Please note that shipping charges are non-refundable unless the return is due to our error.',
      contentType: 'numbered-list'
    },
    {
      sectionId: 'exchange-policy',
      iconEmoji: '🔁',
      sectionTitle: 'Exchange Policy',
      contentText: 'We offer exchanges for defective or incorrect products:',
      listItems: [
        'Exchange requests must be made within 7 days of delivery',
        'Replacement item must be of the same or higher value',
        'Original product must meet return eligibility criteria',
        'Exchange processing takes 7-10 business days',
        'Free exchange for defective or incorrect items'
      ],
      contentType: 'bulleted-list'
    },
    {
      sectionId: 'damaged-products',
      iconEmoji: '📦',
      sectionTitle: 'Damaged or Defective Products',
      contentText: 'If you receive a damaged or defective product:',
      listItems: [
        'Contact us immediately upon delivery',
        'Provide photos of the damaged product and packaging',
        'Do not use or attempt to repair the product',
        'We will arrange immediate replacement or full refund',
        'No return shipping charges for damaged/defective items'
      ],
      contentType: 'bulleted-list'
    },
    {
      sectionId: 'refund-timeline',
      iconEmoji: '⏰',
      sectionTitle: 'Refund Timeline',
      contentText: 'Refund processing times by payment method:',
      listItems: [
        'Credit/Debit Cards: 5-7 business days',
        'UPI/Digital Wallets: 3-5 business days',
        'Net Banking: 5-7 business days',
        'Cash on Delivery: Bank transfer within 7-10 business days'
      ],
      additionalInfo: 'Actual credit time may vary depending on your bank or payment provider.',
      contentType: 'bulleted-list'
    },
    {
      sectionId: 'cancellation-policy',
      iconEmoji: '🚫',
      sectionTitle: 'Order Cancellation',
      contentText: 'You can cancel your order under these conditions:',
      listItems: [
        'Order has not been shipped yet',
        'Cancellation request made within 24 hours of placing order',
        'Full refund processed for cancelled orders',
        'Cancellation not possible once item is shipped'
      ],
      contentType: 'bulleted-list'
    },
    {
      sectionId: 'customer-support',
      iconEmoji: '📞',
      sectionTitle: 'Customer Support',
      contentText: 'For any returns or refunds related queries, contact us:',
      listItems: [
        'Email: coverghar@gmail.com',
        'Response time: Within 24 hours',
        'Include order number in all communications'
      ],
      additionalInfo: 'Our customer support team is here to help make your return experience as smooth as possible.',
      contentType: 'bulleted-list'
    }
  ];

  /**
   * Reusable section component for consistent rendering across all policy sections
   * @param {Object} sectionData - The section data object containing all section information
   * @param {boolean} isMainHeading - Whether this section should use h1 (true) or h2 (false)
   * @returns {JSX.Element} Rendered section component
   */
  const PolicySectionComponent = ({ sectionData, isMainHeading = false }) => {
    // Determine heading tag based on section hierarchy for proper SEO
    const HeadingElement = isMainHeading ? 'h1' : 'h2';
    
    return (
      <section 
        id={sectionData.sectionId}
        className="scroll-mt-8"
        aria-labelledby={`${sectionData.sectionId}-heading`}
      >
        {/* Section heading with icon and proper hierarchy */}
        <HeadingElement 
          id={`${sectionData.sectionId}-heading`}
          className={`${isMainHeading ? 'text-2xl' : 'text-xl'} font-bold mb-3 flex items-center gap-2`}
        >
          <span role="img" aria-label={sectionData.sectionTitle.toLowerCase()}>
            {sectionData.iconEmoji}
          </span>
          {sectionData.sectionTitle}
        </HeadingElement>
        
        {/* Main content text */}
        {sectionData.contentText && (
          <p className="text-gray-700 mb-3">
            {sectionData.contentText}
          </p>
        )}
        
        {/* Render bulleted list for general information */}
        {sectionData.contentType === 'bulleted-list' && sectionData.listItems && (
          <ul className="text-gray-700 space-y-2 mb-3 ml-4">
            {sectionData.listItems.map((listItem, itemIndex) => (
              <li key={itemIndex} className="flex items-start">
                <span className="text-blue-600 mr-2 mt-1 flex-shrink-0">•</span>
                <span>{listItem}</span>
              </li>
            ))}
          </ul>
        )}
        
        {/* Render numbered list for step-by-step processes */}
        {sectionData.contentType === 'numbered-list' && sectionData.listItems && (
          <ol className="text-gray-700 space-y-2 mb-3 ml-4">
            {sectionData.listItems.map((listItem, itemIndex) => (
              <li key={itemIndex} className="flex items-start">
                <span className="text-blue-600 mr-3 mt-1 flex-shrink-0 font-semibold">
                  {itemIndex + 1}.
                </span>
                <span>{listItem}</span>
              </li>
            ))}
          </ol>
        )}
        
        {/* Additional information or notes */}
        {sectionData.additionalInfo && (
          <p className="text-gray-700 mt-3 italic">
            <strong>Note:</strong> {sectionData.additionalInfo}
          </p>
        )}
      </section>
    );
  };

  return (
    <>
      {/* Enhanced SEO component with structured data */}
      <SEO
        title="Returns & Refunds | Cover Ghar"
        description="Understand our returns and refunds policy."
        url="/returns-refunds"
        type="article"
        schema={structuredDataSchema}
      />

      {/* Main content container with proper semantic structure */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="prose prose-gray max-w-none">
          {/* Navigation table of contents for improved user experience */}
          <nav className="mb-8 p-4 bg-gray-50 rounded-lg" aria-label="Returns and refunds policy navigation">
            <h2 className="text-lg font-semibold mb-3">Policy Overview</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {returnsAndRefundsContent.map((contentSection) => (
                <li key={contentSection.sectionId}>
                  <a 
                    href={`#${contentSection.sectionId}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-2 p-2 rounded hover:bg-white transition-colors"
                    aria-label={`Navigate to ${contentSection.sectionTitle} section`}
                  >
                    <span role="img" aria-hidden="true">{contentSection.iconEmoji}</span>
                    <span className="truncate">{contentSection.sectionTitle}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Main policy content sections with consistent spacing */}
          <div className="space-y-8">
            {returnsAndRefundsContent.map((contentSection, sectionIndex) => (
              <PolicySectionComponent 
                key={contentSection.sectionId} 
                sectionData={contentSection} 
                isMainHeading={sectionIndex === 0}
              />
            ))}
          </div>

          {/* Footer with important notices and additional information */}
          <footer className="mt-12 pt-8 border-t border-gray-200">
            <div className="bg-yellow-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> This returns and refunds policy is subject to change. 
                Please review this page before making any return requests to ensure you have the most current information.
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-green-800">
                <strong>Customer Satisfaction:</strong> We are committed to ensuring your complete satisfaction. 
                If you have any concerns about our return policy, please don't hesitate to contact our support team.
              </p>
            </div>
            
            <p className="text-sm text-gray-600">
              <strong>Last updated:</strong> December 23, 2025
            </p>
            <p className="text-sm text-gray-600 mt-2">
              This returns and refunds policy applies to all purchases made through our website and is effective immediately.
            </p>
            
            {/* Cross-linking to related policies */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Related policies:{' '}
                <Link 
                  to="/shipping-policy" 
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Shipping Policy
                </Link>
                {' • '}
                <Link 
                  to="/terms-conditions" 
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Terms & Conditions
                </Link>
                {' • '}
                <Link 
                  to="/privacy-policy" 
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>
          </footer>
        </div>
      </main>
    </>
  );
};

export default ReturnsAndRefunds;