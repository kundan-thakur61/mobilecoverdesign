import SEO from '../components/SEO';

const PrivacyPolicy = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Privacy Policy | Cover Ghar",
    "url": "https://www.coverghar.in/privacy-policy",
    "description": "Read our privacy policy to understand how we collect, use, and protect your personal information.",
    "dateModified": "2025-12-23",
    "inLanguage": "en"
  };

  return (
    <>
      <SEO
        title="Privacy Policy | mobile cover"
        description="Read our privacy policy to understand how we collect, use, and protect your personal information."
        url="/privacy-policy"
        type="article"
        schema={schema}
      />
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div>
          <h3 className="text-xl font-bold mb-2">🔐 Privacy Policy</h3>
          <p className="text-gray-700">
            At Cover Ghar, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit or make a purchase from our website.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-2">📌 Information We Collect</h3>
          <p className="text-gray-700 whitespace-pre-line">
            When you use our website, we may collect the following information:
            {'\n'}
            Name, phone number, email address
            {'\n'}
            Shipping and billing address
            {'\n'}
            Payment details (processed securely via third-party payment gateways)
            {'\n'}
            Device information, IP address, and browser details
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-2">🛒 How We Use Your Information</h3>
          <p className="text-gray-700 whitespace-pre-line">
            We use your information to:
            {'\n'}
            Process and fulfill orders
            {'\n'}
            Communicate order updates and support queries
            {'\n'}
            Improve our website and customer experience
            {'\n'}
            Prevent fraud and unauthorized transactions
            {'\n'}
            Comply with legal requirements
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-2">💳 Payment Security</h3>
          <p className="text-gray-700">
            All payments are processed through secure third-party payment gateways.
            Cover Ghar does not store your card, UPI, or banking details.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-2">🚚 Third-Party Services</h3>
          <p className="text-gray-700 whitespace-pre-line">
            We may share necessary information with trusted third-party services such as:
            {'\n'}
            Courier & logistics partners (for order delivery)
            {'\n'}
            Payment gateways (for payment processing)
            {'\n'}
            Technology and analytics providers (to improve services)
            {'\n'}
            These third parties are obligated to protect your information.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-2">🍪 Cookies</h3>
          <p className="text-gray-700 whitespace-pre-line">
            Our website uses cookies to:
            {'\n'}
            Enhance user experience
            {'\n'}
            Analyze website traffic
            {'\n'}
            Remember user preferences
            {'\n'}
            You may disable cookies in your browser settings if you prefer.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-2">🔒 Data Protection</h3>
          <p className="text-gray-700">
            We implement appropriate security measures to protect your personal data against unauthorized access, misuse, or disclosure.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-2">🧾 Data Retention</h3>
          <p className="text-gray-700">
            We retain your personal information only as long as necessary to fulfill orders, comply with legal obligations, or resolve disputes.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-2">🧑‍⚖️ User Rights</h3>
          <p className="text-gray-700 whitespace-pre-line">
            You have the right to:
            {'\n'}
            Access, update, or delete your personal data
            {'\n'}
            Withdraw consent for marketing communications
            {'\n'}
            To exercise these rights, contact us using the details below.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-2">🔄 Changes to This Policy</h3>
          <p className="text-gray-700">
            Cover Ghar reserves the right to update or modify this Privacy Policy at any time. Changes will be posted on this page.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-2">📞 Contact Us</h3>
          <p className="text-gray-700 whitespace-pre-line">
            If you have any questions about this Privacy Policy, please contact us:
            {'\n'}
            Email: support@coverghar.com
          </p>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;