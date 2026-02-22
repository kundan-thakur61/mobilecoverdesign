import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/ProductCard';
import { CardSkeleton } from '../components/Loader';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';
import { generateBreadcrumbSchema } from '../utils/seoHelpers';

// ─── Category data for all supported phone brands ─────────────────────────────
const CATEGORY_DATA = {
  iphone: {
    title: 'iPhone Mobile Covers Online India | Custom iPhone Cases — CoverGhar',
    description: 'Buy premium iPhone mobile covers online in India. Custom iPhone cases for iPhone 16, 15, 14, 13, SE. Perfect fit, premium protection with personalized designs starting ₹199.',
    keywords: 'iPhone mobile cover, iPhone cases online India, custom iPhone covers, iPhone 16 cover, iPhone 15 case, iPhone 14 cover, buy iPhone back cover',
    h1: 'Premium iPhone Mobile Covers Online India',
    label: 'iPhone',
    intro: 'Protect your iPhone with our extensive collection of custom iPhone covers. From iPhone 16 to classic models, we offer perfect-fit cases that combine style, protection, and personalization.',
    features: [
      'Perfect fit for all iPhone models (16, 15, 14, 13, SE)',
      'MagSafe & wireless charging compatible',
      'Precision camera cutouts with raised bezels',
      'Premium UV printing — scratch-resistant',
      'Drop-tested polycarbonate + TPU protection',
      'Fast shipping across India',
    ],
    faqs: [
      { question: 'Which iPhone models do you support?', answer: 'We support all iPhone models including iPhone 16 Pro Max, 16 Pro, 16, iPhone 15 series, iPhone 14 series, iPhone 13 series, iPhone SE, and older models.' },
      { question: 'Are your iPhone covers MagSafe compatible?', answer: 'Yes! All our iPhone covers are designed for wireless charging and MagSafe compatibility. The slim profile ensures perfect magnetic alignment.' },
      { question: 'How long does delivery take for iPhone covers?', answer: 'We deliver custom iPhone covers within 5-7 business days across India. Express delivery is available for select locations.' },
    ],
  },
  samsung: {
    title: 'Samsung Mobile Covers Online India | Galaxy Phone Cases — CoverGhar',
    description: 'Premium Samsung mobile covers online India. Custom Galaxy S25, S24, A series, Note cases. Designer covers for Samsung smartphones with perfect fit starting ₹199.',
    keywords: 'Samsung mobile cover, Galaxy phone cases, Samsung covers online India, custom Samsung cases, Galaxy S25 cover, Galaxy S24 cover, Samsung back cover',
    h1: 'Premium Samsung Mobile Covers Online India',
    label: 'Samsung',
    intro: 'Discover our comprehensive collection of Samsung mobile covers designed for Galaxy S, A, Note, and Z series. Custom cases that protect and personalize your Samsung device.',
    features: [
      'Compatible with Galaxy S25, S24, S23 & A series',
      'S Pen support for Note & Ultra models',
      'Wireless charging & Samsung Pay compatible',
      'Camera housing protection for multi-lens systems',
      'Foldable-friendly designs for Z Fold & Z Flip',
      'Premium quality with 6-month warranty',
    ],
    faqs: [
      { question: 'Do you have covers for Samsung Galaxy S25?', answer: 'Yes! We have custom covers for Galaxy S25 Ultra, S25+, and S25. All covers feature precision cutouts for the camera system and support wireless charging.' },
      { question: 'Can I get a custom cover for Samsung Galaxy A series?', answer: 'Absolutely! We support the entire Galaxy A lineup including A55, A54, A35, A15 and more. Affordable custom covers starting at ₹199.' },
      { question: 'Are your Samsung covers compatible with wireless charging?', answer: 'Yes, all our Samsung covers are designed to work with wireless charging and Samsung Pay without any interference.' },
    ],
  },
  oneplus: {
    title: 'OnePlus Mobile Covers Online India | Custom OnePlus Cases — CoverGhar',
    description: 'Buy custom OnePlus mobile covers online India. Premium OnePlus 13, 12, Nord CE cases with personalized designs. Perfect fit phone cases starting ₹199.',
    keywords: 'OnePlus mobile cover, OnePlus cases online India, custom OnePlus covers, OnePlus 13 cover, OnePlus 12 case, OnePlus Nord cover',
    h1: 'Custom OnePlus Mobile Covers Online India',
    label: 'OnePlus',
    intro: 'Elevate your OnePlus experience with our custom-designed mobile covers. Built for OnePlus flagship and Nord series with precision engineering and premium materials.',
    features: [
      'Perfect fit for OnePlus 13, 12, Nord CE & more',
      'Alert Slider accessible designs',
      'Dash/Warp charge compatible',
      'Camera-first protection with raised bezels',
      'Ultra-slim profile maintaining OnePlus aesthetics',
      'Vibrant UV printing on premium polycarbonate',
    ],
    faqs: [
      { question: 'Do you have covers for OnePlus 13?', answer: 'Yes! Our OnePlus 13 covers are designed with precision cutouts for the Hasselblad camera system and alert slider. Available in custom photo and themed designs.' },
      { question: 'Will your covers interfere with Dash charging?', answer: 'Not at all. Our OnePlus covers are designed to ensure full compatibility with Dash/Warp fast charging.' },
      { question: 'Do you support OnePlus Nord series?', answer: 'Yes, we support the full Nord lineup including Nord CE 4, Nord 3, and earlier models.' },
    ],
  },
  realme: {
    title: 'Realme Mobile Covers Online India | Custom Realme Cases — CoverGhar',
    description: 'Buy custom Realme mobile covers online India. Premium covers for Realme GT, Narzo, C series. Personalized phone cases with perfect fit starting ₹199.',
    keywords: 'Realme mobile cover, Realme cases online India, custom Realme covers, Realme GT cover, Realme Narzo case, Realme back cover',
    h1: 'Custom Realme Mobile Covers Online India',
    label: 'Realme',
    intro: 'Find the perfect custom cover for your Realme smartphone. From the GT flagship to the affordable C series, we have personalized cases for every Realme model.',
    features: [
      'Covers for Realme GT, Narzo, and C series',
      'Budget-friendly starting at ₹199',
      'Camera protection for multi-lens setups',
      'Fast charging compatible designs',
      'Durable polycarbonate with TPU bumper',
      'Custom photo & themed designs available',
    ],
    faqs: [
      { question: 'Which Realme models do you support?', answer: 'We support a wide range including Realme GT 6, Realme 12 Pro+, Narzo 70, Realme C67, and many more models.' },
      { question: 'What is the price of Realme mobile covers?', answer: 'Our custom Realme mobile covers start from just ₹199. The price may vary based on the specific model and case type.' },
      { question: 'How durable are your Realme covers?', answer: 'Our Realme covers use premium polycarbonate with TPU bumpers for excellent drop protection. The UV printing is scratch-resistant and long-lasting.' },
    ],
  },
  vivo: {
    title: 'Vivo Mobile Covers Online India | Custom Vivo Cases — CoverGhar',
    description: 'Buy custom Vivo mobile covers online India. Premium covers for Vivo V, Y, X series. Personalized designer phone cases with fast delivery starting ₹199.',
    keywords: 'Vivo mobile cover, Vivo cases online India, custom Vivo covers, Vivo V40 cover, Vivo Y series case, Vivo back cover',
    h1: 'Custom Vivo Mobile Covers Online India',
    label: 'Vivo',
    intro: 'Personalize your Vivo smartphone with our premium custom covers. Designed for Vivo V, Y, and X series with precision engineering for a perfect fit.',
    features: [
      'Compatible with Vivo V40, Y series, X series',
      'Camera-first protection design',
      'In-display fingerprint friendly',
      'Fast charging compatible',
      'Slim profile with textured grip',
      'Premium UV print quality',
    ],
    faqs: [
      { question: 'Do you have covers for Vivo V40?', answer: 'Yes! We have custom covers for Vivo V40, V40 Pro, and the entire V series with precision cutouts for all cameras and ports.' },
      { question: 'Will the cover interfere with in-display fingerprint?', answer: 'No, our Vivo covers are designed with precise back-only coverage, keeping the in-display fingerprint sensor fully functional.' },
      { question: 'What Vivo models do you support?', answer: 'We support Vivo V40 series, Y series (Y200, Y100, Y56), X series, and iQOO models.' },
    ],
  },
  oppo: {
    title: 'Oppo Mobile Covers Online India | Custom Oppo Cases — CoverGhar',
    description: 'Buy custom Oppo mobile covers online India. Premium covers for Oppo Reno, A, F series. Personalized designer phone cases with fast delivery starting ₹199.',
    keywords: 'Oppo mobile cover, Oppo cases online India, custom Oppo covers, Oppo Reno cover, Oppo A series case, Oppo back cover',
    h1: 'Custom Oppo Mobile Covers Online India',
    label: 'Oppo',
    intro: 'Upgrade your Oppo smartphone with our custom-designed mobile covers. Built for Oppo Reno, A, and F series with premium materials and vibrant printing.',
    features: [
      'Covers for Oppo Reno, A, and F series',
      'VOOC fast charging compatible',
      'Camera system protection',
      'Anti-slip textured edges',
      'Premium polycarbonate build',
      'Custom photo & designer themes',
    ],
    faqs: [
      { question: 'Which Oppo models do you support?', answer: 'We support Oppo Reno 12, Reno 11, A series (A80, A60, A38), F series, and Find series models.' },
      { question: 'Are your Oppo covers VOOC charging compatible?', answer: 'Yes, all our Oppo covers are designed with proper port cutouts ensuring full compatibility with VOOC and SuperVOOC fast charging.' },
      { question: 'Can I upload my own photo for an Oppo cover?', answer: 'Absolutely! Use our online design tool to upload your photos and create a personalized Oppo cover in minutes.' },
    ],
  },
  xiaomi: {
    title: 'Xiaomi / Redmi Mobile Covers Online India | Custom Mi Cases — CoverGhar',
    description: 'Buy custom Xiaomi & Redmi mobile covers online India. Premium covers for Redmi Note, Mi, Poco series. Personalized phone cases starting ₹199 with fast delivery.',
    keywords: 'Xiaomi mobile cover, Redmi covers online India, custom Mi cases, Redmi Note cover, Poco phone case, Xiaomi back cover',
    h1: 'Custom Xiaomi & Redmi Mobile Covers Online India',
    label: 'Xiaomi / Redmi',
    intro: 'Find the perfect cover for your Xiaomi, Redmi, or Poco smartphone. Our custom covers combine premium protection with personalized designs for every Mi model.',
    features: [
      'Covers for Redmi Note, Mi, and Poco series',
      'Turbo charging compatible designs',
      'Camera housing protection',
      'IR blaster accessible cutouts',
      'Budget-friendly starting at ₹199',
      'Vibrant UV printing on durable cases',
    ],
    faqs: [
      { question: 'Do you have covers for Redmi Note 13?', answer: 'Yes! We carry custom covers for the entire Redmi Note 13 lineup including Note 13 Pro+, Pro, and standard models.' },
      { question: 'Do you support Poco phones?', answer: 'Yes, we support Poco F6, X6, M6, and other Poco models with perfectly fitting custom covers.' },
      { question: 'What Xiaomi models do you cover?', answer: 'We support Xiaomi 14 series, Redmi Note series, Redmi series, Poco F/X/M series, and many more models.' },
    ],
  },
};

const ALL_CATEGORIES = Object.keys(CATEGORY_DATA);

const CategoryPage = () => {
  const { category } = useParams();
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);
  const [loaded, setLoaded] = useState(false);

  const normalizedCategory = (category || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const data = CATEGORY_DATA[normalizedCategory];

  useEffect(() => {
    if (normalizedCategory) {
      dispatch(fetchProducts({ category: normalizedCategory, limit: 20 }));
      setLoaded(true);
    }
  }, [dispatch, normalizedCategory]);

  // Build schemas
  const breadcrumbItems = useMemo(() => [
    { name: 'Home', url: '/' },
    { name: 'Categories', url: '/products' },
    { name: data?.label || category, url: `/category/${normalizedCategory}` },
  ], [data, category, normalizedCategory]);

  const pageSchema = useMemo(() => {
    if (!data) return null;
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": data.faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer,
        },
      })),
    };
    return [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": data.h1,
        "description": data.description,
        "url": `https://www.coverghar.in/category/${normalizedCategory}`,
        "breadcrumb": generateBreadcrumbSchema(breadcrumbItems),
      },
      faqSchema,
    ];
  }, [data, normalizedCategory, breadcrumbItems]);

  // Unknown category fallback
  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Category Not Found</h1>
          <p className="text-gray-600 mb-6">We couldn&apos;t find covers for &quot;{category}&quot;.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {ALL_CATEGORIES.map(cat => (
              <Link
                key={cat}
                to={`/category/${cat}`}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors capitalize"
              >
                {CATEGORY_DATA[cat].label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Head */}
      <SEO
        title={data.title}
        description={data.description}
        keywords={data.keywords}
        url={`/category/${normalizedCategory}`}
        type="website"
        schema={pageSchema?.[0]}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} light />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-4">{data.h1}</h1>
          <p className="text-lg text-white/80 max-w-2xl">{data.intro}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/customizer"
              className="inline-flex items-center px-6 py-3 bg-yellow-400 text-gray-900 rounded-xl font-semibold hover:bg-yellow-300 transition-colors"
            >
              Design Your {data.label} Cover
            </Link>
            <Link
              to="/themes"
              className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl font-semibold hover:bg-white/20 transition-colors"
            >
              Browse Themes
            </Link>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          {data.label} Mobile Covers
        </h2>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : products?.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : loaded ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-4">No {data.label} covers found at the moment.</p>
            <Link
              to="/customizer"
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
            >
              Design a Custom {data.label} Cover
            </Link>
          </div>
        ) : null}
      </section>

      {/* Features Section */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Why Choose CoverGhar for {data.label} Covers?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.features.map((feature, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-green-500 mt-0.5 flex-shrink-0">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse Other Brands */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Browse Covers by Brand
        </h2>
        <div className="flex flex-wrap gap-3">
          {ALL_CATEGORIES.filter(c => c !== normalizedCategory).map(cat => (
            <Link
              key={cat}
              to={`/category/${cat}`}
              className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-all shadow-sm"
            >
              {CATEGORY_DATA[cat].label} Covers
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-12 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Frequently Asked Questions — {data.label} Covers
          </h2>
          <div className="space-y-4">
            {data.faqs.map((faq, i) => (
              <details key={i} className="group bg-white rounded-xl border border-gray-200 overflow-hidden">
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50 transition-colors">
                  <span>{faq.question}</span>
                  <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Schema (separate from page schema) */}
      {pageSchema?.[1] && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema[1]) }}
        />
      )}
    </div>
  );
};

export default CategoryPage;
