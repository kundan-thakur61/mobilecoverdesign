import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const TermsConditions = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Terms & Conditions | Cover Ghar",
    "url": "https://www.coverghar.in/terms-conditions",
    "description": "Read our terms and conditions for using Cover Ghar website and services.",
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
      "headline": "Terms & Conditions",
      "description": "Comprehensive terms and conditions governing the use of Cover Ghar website and services."
    }
  };

  // Structured content data for better maintainability
  const termsContent = [
    {
      id: 'intro',
      icon: '📋',
      title: 'Terms & Conditions',
      content: 'Welcome to Cover Ghar! These Terms and Conditions ("Terms") govern your use of our website and services. By accessing or using our website, you agree to be bound by these Terms.',
      type: 'text'
    },
    {
      id: 'acceptance',
      icon: '✅',
      title: 'Acceptance of Terms',
      content: 'By using our website, you confirm that you:',
      items: [
        'Are at least 18 years old or have parental consent',
        'Agree to comply with all applicable laws and regulations',
        'Accept these Terms and our Privacy Policy',
        'Understand that these Terms may be updated from time to time'
      ],
      type: 'list'
    },
    {
      id: 'services',
      icon: '🛍️',
      title: 'Our Services',
      content: 'Cover Ghar provides:',
      items: [
        'Online retail services for mobile covers and accessories',
        'Product information and specifications',
        'Order processing and delivery services',
        'Customer support and after-sales service'
      ],
      additionalText: 'We reserve the right to modify or discontinue any service without prior notice.',
      type: 'list'
    },
    {
      id: 'user-accounts',
      icon: '🔐',
      title: 'User Accounts',
      content: 'When creating an account, you agree to:',
      items: [
        'Provide accurate and complete information',
        'Keep your login credentials secure',
        'Notify us immediately of any unauthorized use',
        'Be responsible for all activities under your account'
      ],
      additionalText: 'We reserve the right to suspend or terminate accounts that violate these Terms.',
      type: 'list'
    },
    {
      id: 'orders-payments',
      icon: '💳',
      title: 'Orders and Payments',
      content: 'Order and payment terms:',
      items: [
        'All prices are in Indian Rupees (INR) and include applicable taxes',
        'Payment must be completed before order processing',
        'We accept various payment methods as displayed at checkout',
        'Order confirmation does not guarantee product availability',
        'We reserve the right to cancel orders due to pricing errors or stock unavailability'
      ],
      type: 'list'
    },
    {
      id: 'shipping-delivery',
      icon: '🚚',
      title: 'Shipping and Delivery',
      content: 'Delivery terms and conditions:',
      items: [
        'Delivery times are estimates and may vary based on location',
        'Risk of loss transfers to you upon delivery',
        'You must inspect products upon delivery',
        'Delivery address changes may not be possible after order confirmation',
        'Additional charges may apply for remote locations'
      ],
      type: 'list'
    },
    {
      id: 'returns-refunds',
      icon: '↩️',
      title: 'Returns and Refunds',
      content: 'Our return and refund policy:',
      items: [
        'Returns accepted within 7 days of delivery for defective products',
        'Products must be in original condition with packaging',
        'Refunds processed within 7-10 business days after return approval',
        'Return shipping costs may be borne by the customer unless product is defective',
        'Certain products may not be eligible for return due to hygiene reasons'
      ],
      additionalText: 'For detailed return procedures, please contact our customer support.',
      type: 'list'
    },
    {
      id: 'intellectual-property',
      icon: '©️',
      title: 'Intellectual Property',
      content: 'All content on this website, including but not limited to text, images, logos, and designs, is owned by Cover Ghar or our licensors and is protected by intellectual property laws.',
      additionalText: 'You may not reproduce, distribute, or create derivative works without our written permission.',
      type: 'text'
    },
    {
      id: 'prohibited-uses',
      icon: '🚫',
      title: 'Prohibited Uses',
      content: 'You agree not to:',
      items: [
        'Use the website for any unlawful purpose',
        'Attempt to gain unauthorized access to our systems',
        'Upload malicious code or viruses',
        'Interfere with the proper functioning of the website',
        'Impersonate any person or entity',
        'Collect user information without consent'
      ],
      type: 'list'
    },
    {
      id: 'limitation-liability',
      icon: '⚖️',
      title: 'Limitation of Liability',
      content: 'Cover Ghar shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our website or services. Our total liability shall not exceed the amount paid by you for the specific product or service.',
      type: 'text'
    },
    {
      id: 'indemnification',
      icon: '🛡️',
      title: 'Indemnification',
      content: 'You agree to indemnify and hold Cover Ghar harmless from any claims, damages, or expenses arising from your violation of these Terms or your use of our services.',
      type: 'text'
    },
    {
      id: 'governing-law',
      icon: '🏛️',
      title: 'Governing Law',
      content: 'These Terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in [Your City], India.',
      type: 'text'
    },
    {
      id: 'modifications',
      icon: '🔄',
      title: 'Modifications to Terms',
      content: 'We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on this page. Your continued use of the website constitutes acceptance of the modified Terms.',
      type: 'text'
    },
    {
      id: 'contact',
      icon: '📞',
      title: 'Contact Information',
      content: 'If you have any questions about these Terms & Conditions, please contact us:',
      items: [
        'Email: support@coverghar.com',
        'Phone: [Your Phone Number]',
        'Address: [Your Business Address]'
      ],
      type: 'list'
    }
  ];

  // Reusable section component
  const TermsSection = ({ section, isFirst = false }) => {
    const HeadingTag = isFirst ? 'h1' : 'h2';
    
    return (
      <section 
        id={section.id}
        className="scroll-mt-8"
        aria-labelledby={`${section.id}-heading`}
      >
        <HeadingTag 
          id={`${section.id}-heading`}
          className={`${isFirst ? 'text-2xl' : 'text-xl'} font-bold mb-3 flex items-center gap-2`}
        >
          <span role="img" aria-label={section.title.toLowerCase()}>
            {section.icon}
          </span>
          {section.title}
        </HeadingTag>
        
        {section.content && (
          <p className="text-gray-700 mb-3">
            {section.content}
          </p>
        )}
        
        {section.type === 'list' && section.items && (
          <ul className="text-gray-700 space-y-2 mb-3 ml-4">
            {section.items.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-600 mr-2 mt-1 flex-shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
        
        {section.additionalText && (
          <p className="text-gray-700 mt-3">
            {section.additionalText}
          </p>
        )}
      </section>
    );
  };

  return (
    <>
      <SEO
        title="Terms & Conditions | Cover Ghar"
        description="Read our terms and conditions for using Cover Ghar website and services."
        url="/terms-conditions"
        type="article"
        schema={schema}
      />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="prose prose-gray max-w-none">
          <nav className="mb-8 p-4 bg-gray-50 rounded-lg" aria-label="Terms and conditions navigation">
            <h2 className="text-lg font-semibold mb-3">Table of Contents</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {termsContent.map((section) => (
                <li key={section.id}>
                  <a 
                    href={`#${section.id}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-2 p-2 rounded hover:bg-white transition-colors"
                  >
                    <span role="img" aria-hidden="true">{section.icon}</span>
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-8">
            {termsContent.map((section, index) => (
              <TermsSection 
                key={section.id} 
                section={section} 
                isFirst={index === 0}
              />
            ))}
          </div>

          <footer className="mt-12 pt-8 border-t border-gray-200">
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-blue-800">
                <strong>Important:</strong> By using our website, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.
              </p>
            </div>
            
            <p className="text-sm text-gray-600">
              <strong>Last updated:</strong> December 23, 2025
            </p>
            <p className="text-sm text-gray-600 mt-2">
              These terms and conditions are effective immediately and apply to all users of our website and services.
            </p>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                For questions about these terms, please{' '}
                <Link 
                  to="/contact" 
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  contact us
                </Link>
                {' '}or review our{' '}
                <Link 
                  to="/privacy-policy" 
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </footer>
        </div>
      </main>
    </>
  );
};

export default TermsConditions;