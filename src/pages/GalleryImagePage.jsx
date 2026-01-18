import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { FiArrowLeft, FiSmartphone, FiShoppingBag, FiCheck } from 'react-icons/fi';
import collectionAPI from '../api/collectionAPI';
import mobileAPI from '../api/mobileAPI';
import { resolveImageUrl, formatPrice } from '../utils/helpers';
import { addToCart } from '../redux/slices/cartSlice';
import { FALLBACK_COLLECTION_MAP } from '../data/fallbackCollections';
import { FALLBACK_MOBILE_COMPANIES } from '../data/fallbackMobileCompanies';
import { createSafeSvgProps } from '../utils/svgUtils';
import ErrorBoundary from '../components/ErrorBoundary';
import SEO from '../components/SEO';

const DEFAULT_FRAME = '/frames/frame-1-fixed.svg';

const normalizeHandle = (value = '') => (
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
);

const slugifyId = (value) => {
  const parsed = String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '') || 'x';
  return parsed;
};

/* -------------------- material options -------------------- */
const materialOptions = [
  {
    id: 'matte',
    price: 1,
    label: 'Glossy Metal',
    blurb: 'Smooth aur shiny look. Strong & durable',
    features: ['Scratch resistant', 'Smooth finish', 'Slim profile']
  },
  {
    id: 'gloss',
    price: 1,
    label: 'Glossy Metal + Gel',
    blurb: 'Extra shine. 3D premium protection',
    features: ['Enhanced grip', '3D protection', 'Premium finish']
  },
];

const GalleryImagePage = () => {
  const { handle } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [search] = useSearchParams();
  const fallback = useMemo(() => FALLBACK_COLLECTION_MAP[normalizeHandle(handle)] || null, [handle]);
  const [collection, setCollection] = useState(fallback);
  const [loading, setLoading] = useState(!fallback);
  const [selectedImage, setSelectedImage] = useState(() => location.state?.selectedImage || null);
  const [selectedMaterial, setSelectedMaterial] = useState(materialOptions[0].id);
  const [companies, setCompanies] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [loadingModels, setLoadingModels] = useState(false);
  const [catalogError, setCatalogError] = useState('');

  /* -------------------- material price -------------------- */
  const selectedMaterialPrice = useMemo(() => {
    return (
      materialOptions.find((m) => m.id === selectedMaterial)?.price || 199
    );
  }, [selectedMaterial]);

  useEffect(() => {
    let ignore = false;
    const assignFromData = (data) => {
      setCollection(data);
      const fromQuery = search.get('imageId');
      if (fromQuery) {
        const image = data?.images?.find((img) => slugifyId(img._id || img.publicId || img.url) === fromQuery);
        if (image) {
          setSelectedImage(image);
          return;
        }
      }
      if (!selectedImage && data?.images?.length) {
        setSelectedImage(data.images[0]);
      }
    };

    if (fallback) {
      assignFromData(fallback);
    }

    const fetchCollection = async () => {
      if (!handle) return;
      try {
        const res = await collectionAPI.getByHandle(handle);
        const data = res?.data?.data?.collection;
        if (!ignore && data) {
          assignFromData(data);
        }
      } catch (err) {
        if (!ignore) setCatalogError(err.response?.data?.message || 'Unable to load collection');
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    if (!fallback || (!selectedImage && search.get('imageId'))) {
      fetchCollection();
    } else {
      setLoading(false);
    }
    return () => { ignore = true; };
  }, [handle, fallback, selectedImage, search]);

  useEffect(() => {
    let ignore = false;
    const fetchCompanies = async () => {
      try {
        setLoadingCompanies(true);
        const response = await mobileAPI.getCompanies({ limit: 100 });
        if (ignore) return;
        const fetched = response?.data?.data?.companies || [];
        if (fetched.length) {
          setCompanies(fetched);
        } else {
          setCompanies(FALLBACK_MOBILE_COMPANIES);
          setCatalogError('Live catalog is offline, showing most requested devices.');
        }
      } catch (err) {
        if (ignore) return;
        setCompanies(FALLBACK_MOBILE_COMPANIES);
        setCatalogError('Live catalog is offline, showing most requested devices.');
      } finally {
        if (!ignore) setLoadingCompanies(false);
      }
    };
    fetchCompanies();
    return () => { ignore = true; };
  }, []);

  useEffect(() => {
    if (!selectedCompany) {
      setModels([]);
      setSelectedModel(null);
      setLoadingModels(false);
      return;
    }
    if (selectedCompany.__isFallback) {
      const fallbackModels = selectedCompany.models || [];
      setModels(fallbackModels);
      setSelectedModel(fallbackModels[0] || null);
      setLoadingModels(false);
      return;
    }
    let cancelled = false;
    const fetchModels = async () => {
      try {
        setLoadingModels(true);
        const response = await mobileAPI.getModels({ company: selectedCompany._id, limit: 200 });
        const fetchedModels = response?.data?.data?.models || [];
        if (!cancelled) {
          setModels(fetchedModels);
          setSelectedModel(fetchedModels[0] || null);
        }
      } catch (err) {
        if (!cancelled) {
          setModels([]);
          setSelectedModel(null);
          toast.error('Unable to load models for this brand. Please try again.');
        }
      } finally {
        if (!cancelled) setLoadingModels(false);
      }
    };
    fetchModels();
    return () => { cancelled = true; };
  }, [selectedCompany]);

  const selectedImageUrl = useMemo(() => {
    if (!selectedImage) return '';
    const source = typeof selectedImage === 'string'
      ? selectedImage
      : selectedImage.url || selectedImage.secure_url || selectedImage.path || selectedImage.publicUrl || selectedImage.previewUrl || '';
    return resolveImageUrl(source);
  }, [selectedImage]);

  const selectedFrame = useMemo(() => {
    const candidate = selectedModel?.framePath
      || (selectedModel?.images?.[0] || null)
      || selectedCompany?.previewFrame
      || DEFAULT_FRAME;
    const resolved = resolveImageUrl(candidate);
    return resolved || DEFAULT_FRAME;
  }, [selectedModel, selectedCompany]);

  const builderReady = Boolean(selectedImage && selectedCompany && selectedModel);

  const buildCartBlueprint = () => {
    if (!collection || !selectedImage || !selectedCompany || !selectedModel) return null;
    const baseId = slugifyId(collection._id || collection.handle || 'collection').slice(-6);
    const modelKey = slugifyId(selectedModel._id || selectedModel.slug || selectedModel.name || 'model').slice(-6);
    const imageKey = slugifyId(selectedImage._id || selectedImage.publicId || selectedImage.url || selectedImage.caption || 'art').slice(-6);
    const matKey = slugifyId(selectedMaterial).slice(0, 5);
    const productId = `cc_${baseId}_${modelKey}_${imageKey}_${matKey}`;
    const variantId = `${productId}_v`;
    const product = {
      _id: productId,
      title: `${collection.title} - Custom Case`,
      brand: selectedCompany.name,
      model: selectedModel.name,
      material: selectedMaterial,
      design: {
        imgSrc: selectedImageUrl,
        frame: selectedFrame,
        transform: { x: 0, y: 0, scale: 1 },
        meta: {
          collectionId: collection._id,
          collectionHandle: collection.handle,
          collectionTitle: collection.title,
          imageId: selectedImage._id || selectedImage.publicId || selectedImage.url || imageKey,
          company: selectedCompany.name,
          model: selectedModel.name,
          material: materialOptions.find((m) => m.id === selectedMaterial)?.label || selectedMaterial,
        },
      },
    };
    const variant = {
      _id: variantId,
      sku: variantId,
      price: selectedMaterialPrice,
      stock: 50,
      weight: 0.2,
      color: selectedModel.color || 'Matte Black',
      name: 'Custom Print',
    };
    return { product, variant };
  };

  const handleCartAction = (mode = 'cart') => {
    try {
      const blueprint = buildCartBlueprint();
      if (!blueprint) {
        toast.info('Pick an artwork, material, brand, and model to continue.');
        return;
      }
      dispatch(addToCart({ ...blueprint, quantity: 1 }));
      if (mode === 'buy') {
        toast.success('Design locked! Redirecting to checkout.');
        navigate('/checkout');
      } else {
        toast.success('Design added to your cart.');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart. Please try again.');
    }
  };

  // Generate dynamic SEO content
  const pageTitle = useMemo(() => {
    if (selectedCompany && selectedModel && collection) {
      return `${collection.title} Mobile Cover for ${selectedCompany.name} ${selectedModel.name} | CoverGhar`;
    }
    if (collection) {
      return `${collection.title} Custom Mobile Cover | Choose Your Phone Model - CoverGhar`;
    }
    return 'Customize Mobile Cover | Select Phone Model & Material - CoverGhar';
  }, [collection, selectedCompany, selectedModel]);

  const pageDescription = useMemo(() => {
    if (selectedCompany && selectedModel && collection) {
      return `Create ${collection.title} custom mobile cover for ${selectedCompany.name} ${selectedModel.name}. Premium quality printing from ₹${selectedMaterialPrice}. Choose material, customize design. Fast delivery across India.`;
    }
    if (collection) {
      return `Customize ${collection.title} mobile cover for your phone. Select from iPhone, Samsung, OnePlus, Realme models. Premium materials starting at ₹199. Order now!`;
    }
    return 'Create custom mobile cover with your choice of design, phone model, and material. Premium quality printing for all major brands. Fast delivery across India.';
  }, [collection, selectedCompany, selectedModel, selectedMaterialPrice]);

  // Product Schema
  const productSchema = useMemo(() => {
    if (!collection) return null;

    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": collection.title + " Custom Mobile Cover",
      "description": pageDescription,
      "image": selectedImageUrl || collection.images?.[0]?.url || "",
      "brand": {
        "@type": "Brand",
        "name": "CoverGhar"
      },
      "offers": {
        "@type": "Offer",
        "url": `https://www.coverghar.in/collection/${handle}/customize`,
        "priceCurrency": "INR",
        "price": selectedMaterialPrice,
        "priceValidUntil": "2025-12-31",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": "CoverGhar"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.7",
        "reviewCount": "850"
      }
    };
  }, [collection, handle, selectedMaterialPrice, selectedImageUrl, pageDescription]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p>Loading customization options...</p>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <>
        <Helmet>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <p className="text-2xl font-semibold text-gray-900">Collection unavailable</p>
          <p className="text-gray-600 mt-2">Try heading back to the collection page.</p>
          <button
            type="button"
            className="mt-4 px-6 py-3 rounded-full bg-primary-600 text-white font-semibold"
            onClick={() => navigate(`/collection/${handle}`)}
          >
            Back to collection
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title={pageTitle}
        description={pageDescription}
        keywords={`${collection.title} mobile cover, ${selectedCompany?.name || ''} ${selectedModel?.name || ''} case, custom phone cover, designer mobile case, premium phone protection`}
        url={`/collection/${handle}/customize`}
        image={selectedImageUrl || collection.images?.[0]?.url}
        schema={productSchema}
      />

      <div className="bg-gray-50 min-h-screen pb-16">
        {/* Header with Breadcrumb */}
        <div className="border-b bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-4">
              <ol className="flex items-center space-x-2 text-sm text-gray-600">
                <li>
                  <button onClick={() => navigate('/')} className="hover:text-primary-600 transition-colors">
                    Home
                  </button>
                </li>
                <li className="text-gray-400">/</li>
                <li>
                  <button onClick={() => navigate('/themes')} className="hover:text-primary-600 transition-colors">
                    Themes
                  </button>
                </li>
                <li className="text-gray-400">/</li>
                <li>
                  <button onClick={() => navigate(`/collection/${handle}`)} className="hover:text-primary-600 transition-colors">
                    {collection.title}
                  </button>
                </li>
                <li className="text-gray-400">/</li>
                <li className="text-gray-900 font-medium">Customize</li>
              </ol>
            </nav>

            {/* Back Button */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate(-1)} 
                className="flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
              >
                <FiArrowLeft className="h-4 w-4" />
                Back
              </button>
            </div>
          </div>
        </div>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-10 space-y-8">
          {/* Page Title & Progress */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Customize Your {collection.title} Mobile Cover
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select your phone model and material to create the perfect custom case
            </p>
            
            {/* Progress Indicator */}
            <div className="mt-6 flex items-center justify-center gap-4 text-sm">
              <div className={`flex items-center gap-2 ${selectedImage ? 'text-green-600' : 'text-gray-400'}`}>
                {selectedImage ? <FiCheck className="w-5 h-5" /> : <span className="w-5 h-5 rounded-full border-2 border-current" />}
                <span className="font-medium">Design Selected</span>
              </div>
              <span className="text-gray-300">→</span>
              <div className={`flex items-center gap-2 ${selectedCompany ? 'text-green-600' : 'text-gray-400'}`}>
                {selectedCompany ? <FiCheck className="w-5 h-5" /> : <span className="w-5 h-5 rounded-full border-2 border-current" />}
                <span className="font-medium">Brand Selected</span>
              </div>
              <span className="text-gray-300">→</span>
              <div className={`flex items-center gap-2 ${selectedModel ? 'text-green-600' : 'text-gray-400'}`}>
                {selectedModel ? <FiCheck className="w-5 h-5" /> : <span className="w-5 h-5 rounded-full border-2 border-current" />}
                <span className="font-medium">Model Selected</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-4xl shadow-xl p-6 sm:p-8">
            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              {/* Left Column - Design & Material */}
              <div className="space-y-6">
                {/* Selected Artwork */}
                <div className="rounded-3xl border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Selected Design</p>
                    {selectedImage && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        <FiCheck className="w-3 h-3" />
                        Selected
                      </span>
                    )}
                  </div>
                  {selectedImage ? (
                    <>
                      <div className="mt-4 rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50 aspect-[3/4] flex items-center justify-center">
                        <img
                          src={selectedImageUrl}
                          alt={`${collection.title} mobile cover design${selectedImage.caption ? ' - ' + selectedImage.caption : ''}`}
                          className="max-h-full max-w-full object-contain"
                          loading="lazy"
                        />
                      </div>
                      {selectedImage.caption && (
                        <p className="mt-3 text-sm text-gray-600 font-medium">{selectedImage.caption}</p>
                      )}
                      <button
                        type="button"
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                        onClick={() => navigate(`/collection/${handle}`)}
                      >
                        Change Design
                      </button>
                    </>
                  ) : (
                    <div className="mt-4 rounded-2xl bg-gray-50 p-6 text-center">
                      <p className="text-sm text-gray-600 mb-3">No design selected yet</p>
                      <button
                        onClick={() => navigate(`/collection/${handle}`)}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700"
                      >
                        Browse Designs
                      </button>
                    </div>
                  )}
                </div>

                {/* Material Selection */}
                <div className="rounded-3xl border border-gray-100 p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-2">Step 1</p>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Choose Material</h3>
                  <div className="space-y-3">
                    {materialOptions.map((option) => {
                      const active = selectedMaterial === option.id;
                      return (
                        <button
                          type="button"
                          key={option.id}
                          onClick={() => setSelectedMaterial(option.id)}
                          className={`w-full rounded-2xl border px-5 py-4 text-left transition-all ${
                            active 
                              ? 'border-primary-500 bg-primary-50 shadow-md' 
                              : 'border-gray-200 hover:border-primary-300 hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className={`font-semibold ${active ? 'text-primary-700' : 'text-gray-900'}`}>
                                  {option.label}
                                </p>
                                {active && <FiCheck className="w-4 h-4 text-primary-600" />}
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{option.blurb}</p>
                              <div className="flex flex-wrap gap-2">
                                {option.features?.map((feature, idx) => (
                                  <span key={idx} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <p className={`text-lg font-bold ${active ? 'text-primary-700' : 'text-gray-900'}`}>
                              ₹{option.price}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column - Phone Selection & Checkout */}
              <div className="space-y-6">
                <div className="rounded-3xl border border-gray-100 p-6 space-y-6">
                  {/* Brand Selection */}
                  <div>
                    <label className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
                      <FiSmartphone className="text-primary-500" />
                      Step 2: Choose Phone Brand
                    </label>
                    <select
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 transition-all"
                      value={selectedCompany?._id || ''}
                      onChange={(event) => {
                        const company = companies.find((item) => item._id === event.target.value) || null;
                        setSelectedCompany(company);
                      }}
                      disabled={loadingCompanies}
                    >
                      <option value="">
                        {loadingCompanies ? 'Loading brands...' : 'Select your phone brand'}
                      </option>
                      {companies.map((company) => (
                        <option key={company._id} value={company._id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Model Selection */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-3">
                      Step 3: Choose Phone Model
                    </label>
                    <select
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 transition-all"
                      value={selectedModel?._id || ''}
                      onChange={(event) => {
                        const model = models.find((item) => item._id === event.target.value) || null;
                        setSelectedModel(model);
                      }}
                      disabled={!selectedCompany || loadingModels}
                    >
                      <option value="">
                        {!selectedCompany 
                          ? 'Select a brand first' 
                          : loadingModels 
                          ? 'Loading models...' 
                          : models.length 
                          ? 'Select your phone model' 
                          : 'No models available for this brand'}
                      </option>
                      {models.map((model) => (
                        <option key={model._id} value={model._id}>
                          {model.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {catalogError && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
                      <p className="text-sm text-amber-800">{catalogError}</p>
                    </div>
                  )}

                  {/* Pricing & Actions */}
                  <div className="pt-6 border-t border-dashed border-gray-200 space-y-6">
                    <div className="bg-gray-50 rounded-2xl p-5">
                      <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-2">
                        Your Price
                      </p>
                      <div className="flex items-baseline justify-between">
                        <span className="text-4xl font-bold text-gray-900">
                          {formatPrice(selectedMaterialPrice)}
                        </span>
                        <span className="text-sm text-gray-600">
                          per cover
                        </span>
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
                        <FiCheck className="w-4 h-4" />
                        <span>Free delivery on prepaid orders</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={() => handleCartAction('buy')}
                        disabled={!builderReady}
                        className={`w-full inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 font-bold text-lg transition-all ${
                          builderReady 
                            ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl' 
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Buy Now - {formatPrice(selectedMaterialPrice)}
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => handleCartAction('cart')}
                        disabled={!builderReady}
                        className={`w-full inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 font-semibold text-lg border-2 transition-all ${
                          builderReady 
                            ? 'border-primary-600 text-primary-600 hover:bg-primary-50' 
                            : 'border-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <FiShoppingBag className="w-5 h-5" />
                        Add to Cart
                      </button>
                    </div>

                    {!builderReady && (
                      <p className="text-center text-sm text-gray-500">
                        Please select design, brand, and model to continue
                      </p>
                    )}
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="bg-primary-50 border border-primary-100 rounded-2xl p-5">
                  <h4 className="font-semibold text-primary-900 mb-3">
                    ✓ Why Choose CoverGhar?
                  </h4>
                  <ul className="space-y-2 text-sm text-primary-800">
                    <li className="flex items-start gap-2">
                      <FiCheck className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>Premium UV printing - colors that last</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FiCheck className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>Perfect fit guarantee for your phone model</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FiCheck className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>Fast delivery across India in 5-7 days</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FiCheck className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>Scratch-resistant & durable materials</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default GalleryImagePage;