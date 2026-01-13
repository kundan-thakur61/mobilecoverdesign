import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  FiChevronDown,
  FiImage,
  FiMinus,
  FiPlus,
  FiShield,
  FiSmartphone,
  FiStar,
  FiTruck,
  FiUpload,
  FiZap,
  FiX,
  FiRotateCw,
  FiCrop,
  FiSliders,
  FiLayers,
  FiEye,
  FiGrid,
  FiHeart,
  FiShare2,
  FiDownload,
  FiAlertCircle,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import mobileAPI from '../api/mobileAPI';
import uploadAPI from '../api/uploadAPI';
import Loader from '../components/Loader';
import SEO from '../components/SEO';
import MobileFrameMockup from '../components/MobileFrameMockup';
import { formatPrice, resolveImageUrl } from '../utils/helpers';
import { createCustomOrder, createCustomPayment, verifyCustomPayment } from '../redux/slices/customSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { FALLBACK_MOBILE_COMPANIES } from '../data/fallbackMobileCompanies';

const MATERIAL_OPTIONS = [
  {
    id: 'polycarbonate',
    label: 'Glossy Metal',
    subtitle: 'metal finish Smooth shiny look Strong & durable',
    price: 1,
    originalPrice: 400,
    features: ['Scratch-resistant', 'Lightweight', 'Slim profile'],
  },
  {
    id: 'tempered-glass',
    label: 'Glossy Metal + Gel',
    subtitle: 'Transparent layer Extra shine Design premium',
    price: 1,
    originalPrice: 600,
    features: ['Premium finish', 'Extra protection', 'Crystal clear'],
  },
  
];

const DESIGN_TEMPLATES = [
  { id: 'minimal', name: 'Minimal', preview: '/templates/minimal.jpg', category: 'professional' },
  { id: 'gradient', name: 'Gradient', preview: '/templates/gradient.jpg', category: 'artistic' },
  { id: 'geometric', name: 'Geometric', preview: '/templates/geometric.jpg', category: 'modern' },
  { id: 'nature', name: 'Nature', preview: '/templates/nature.jpg', category: 'artistic' },
  { id: 'abstract', name: 'Abstract', preview: '/templates/abstract.jpg', category: 'modern' },
  { id: 'vintage', name: 'Vintage', preview: '/templates/vintage.jpg', category: 'classic' },
];

const FEATURE_HIGHLIGHTS = [
  {
    icon: FiShield,
    title: '360° Protection',
    description: 'Raised edges for camera + screen with shock-absorbing TPU corners.',
  },
  {
    icon: FiImage,
    title: 'Edge-to-edge Print',
    description: '3D sublimation printing wraps artwork across every single curve.',
  },
  {
    icon: FiSmartphone,
    title: 'Perfect Fit',
    description: 'Laser-cut ports, tactile buttons and MagSafe friendliness guaranteed.',
  },
  {
    icon: FiTruck,
    title: 'Dispatch in 24H',
    description: 'Printed, QC-ed and shipped from our Neemuch (M.P.) studio within a day.',
  },
];

const TIMELINE_STEPS = [
  {
    title: 'Upload your photo',
    description: 'Share a high-resolution image or artwork. JPG, PNG and HEIC supported.',
    meta: 'Takes 1 minute',
  },
  {
    title: 'Designer polish',
    description: 'Our team cleans, crops and aligns your image to your phone template.',
    meta: 'Within 2 hours',
  },
  {
    title: 'UV print & QC',
    description: 'Industrial UV printers transfer the design with scratch-proof coating.',
    meta: 'Print takes 15 min',
  },
  {
    title: 'Express shipping',
    description: 'We bubble-wrap, box and handover to Bluedart, Delhivery or DTDC.',
    meta: '3-5 day delivery',
  },
];

const FAQS = [
  {
    id: 'quality',
    question: 'What image quality do you need?',
    answer: 'Upload a file above 1MB for crisp results. If the image is low resolution, our designer will reach out on WhatsApp before printing.',
  },
  {
    id: 'shipping',
    question: 'How fast can you deliver?',
    answer: 'Orders placed before 2 PM are typically dispatched the same day. Metro cities receive the case in 2-3 working days, others in 3-5 days.',
  },
  {
    id: 'changes',
    question: 'Can I preview before printing?',
    answer: 'Absolutely! We share a digital mockup on WhatsApp for approval. You can request edits, change placement or try a different image for free.',
  },
  {
    id: 'return',
    question: 'What if there is an issue with my order?',
    answer: 'We replace manufacturing defects at zero cost. Just share an unpacking video/picture within 48 hours so we can recreate it instantly.',
  },
];

const DEFAULT_FRAME = '/frames/frame-1-fixed.svg';
const ACTIONS_DISABLED = false;

// Image Editor Component
const ImageEditor = ({ imageData, onSave, onCancel }) => {
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(100);
  const canvasRef = useRef(null);

  const applyFilters = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(scale / 100, scale / 100);
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();
    };
    
    img.src = imageData;
  }, [imageData, brightness, contrast, saturation, rotation, scale]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const editedImage = canvas.toDataURL('image/jpeg', 0.95);
      onSave(editedImage);
    }
  };

  const resetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setRotation(0);
    setScale(100);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Edit Your Design</h3>
            <p className="text-sm text-gray-500 mt-1">Adjust filters and transformations</p>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-gray-100 rounded-2xl p-4 flex items-center justify-center min-h-[400px]">
                <canvas ref={canvasRef} className="max-w-full h-auto rounded-lg shadow-lg" />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <FiSliders className="w-4 h-4" />
                  Brightness
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{brightness}%</span>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <FiSliders className="w-4 h-4" />
                  Contrast
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{contrast}%</span>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <FiSliders className="w-4 h-4" />
                  Saturation
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={saturation}
                  onChange={(e) => setSaturation(Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{saturation}%</span>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <FiRotateCw className="w-4 h-4" />
                  Rotation
                </label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={rotation}
                  onChange={(e) => setRotation(Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{rotation}°</span>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <FiCrop className="w-4 h-4" />
                  Scale
                </label>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{scale}%</span>
              </div>

              <button
                onClick={resetFilters}
                className="w-full py-2 px-4 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-6 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 px-6 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// Design Templates Modal
const TemplatesModal = ({ onSelect, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'professional', 'artistic', 'modern', 'classic'];
  
  const filteredTemplates = selectedCategory === 'all' 
    ? DESIGN_TEMPLATES 
    : DESIGN_TEMPLATES.filter(t => t.category === selectedCategory);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Design Templates</h3>
            <p className="text-sm text-gray-500 mt-1">Choose a pre-made design or start from scratch</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 border-b border-gray-200">
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl font-medium text-sm capitalize transition ${
                  selectedCategory === cat
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => onSelect(template)}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-primary-500 transition"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-purple-600" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-semibold">{template.name}</span>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                  <FiEye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Image Quality Analyzer
const analyzeImageQuality = (file) => {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      const width = img.width;
      const height = img.height;
      const megapixels = (width * height) / 1000000;
      const fileSize = file.size / (1024 * 1024); // MB
      
      let quality = 'excellent';
      let warnings = [];
      
      if (width < 1000 || height < 1000) {
        quality = 'poor';
        warnings.push('Image resolution is too low for quality printing');
      } else if (width < 1500 || height < 1500) {
        quality = 'fair';
        warnings.push('Image resolution is acceptable but may show some pixelation');
      } else if (width < 2000 || height < 2000) {
        quality = 'good';
      }
      
      if (fileSize < 0.5) {
        warnings.push('File size is small - image may be compressed');
      }
      
      URL.revokeObjectURL(url);
      
      resolve({
        width,
        height,
        megapixels: megapixels.toFixed(1),
        fileSize: fileSize.toFixed(2),
        quality,
        warnings,
      });
    };
    
    img.src = url;
  });
};

// Main Component
const CustomMobilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // State management
  const [companies, setCompanies] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(MATERIAL_OPTIONS[0]);
  const [quantity, setQuantity] = useState(1);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadedAsset, setUploadedAsset] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [loadingModels, setLoadingModels] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [openFaq, setOpenFaq] = useState(FAQS[0]?.id || null);
  const [shipping, setShipping] = useState({
    name: user?.name || '',
    phone: user?.phone ? String(user.phone).replace(/[^0-9]/g, '') : '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });
  const [shippingErrors, setShippingErrors] = useState({});
  const [submittingAction, setSubmittingAction] = useState(null);
  const [orderFeedback, setOrderFeedback] = useState(null);
  const [specialNotes, setSpecialNotes] = useState('');
  const [showMockup, setShowMockup] = useState(false);
  
  // New advanced features state
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [imageQuality, setImageQuality] = useState(null);
  const [savedDesigns, setSavedDesigns] = useState([]);
  const [previewMode, setPreviewMode] = useState('2d'); // '2d' or '3d'
  const [recentSearches, setRecentSearches] = useState([]);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  
  const builderRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSaveEnabled) return;
    
    const timer = setTimeout(() => {
      const designState = {
        imagePreview,
        selectedCompany,
        selectedModel,
        selectedMaterial,
        quantity,
        specialNotes,
        timestamp: Date.now(),
      };
      
      localStorage.setItem('customDesignDraft', JSON.stringify(designState));
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [imagePreview, selectedCompany, selectedModel, selectedMaterial, quantity, specialNotes, autoSaveEnabled]);

  // Load saved draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('customDesignDraft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        const hoursSinceLastSave = (Date.now() - draft.timestamp) / (1000 * 60 * 60);
        
        if (hoursSinceLastSave < 24) {
          const shouldRestore = window.confirm('We found a saved design. Would you like to restore it?');
          if (shouldRestore) {
            setImagePreview(draft.imagePreview);
            setQuantity(draft.quantity);
            setSpecialNotes(draft.specialNotes);
            toast.success('Design restored from draft');
          }
        }
      } catch (error) {
        console.error('Failed to restore draft:', error);
      }
    }
  }, []);

  // Existing useEffects
  useEffect(() => {
    if (user) {
      setShipping((prev) => ({
        ...prev,
        name: user.name || prev.name,
        phone: user.phone ? String(user.phone).replace(/[^0-9]/g, '') : prev.phone,
      }));
    }
  }, [user]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoadingCompanies(true);
        const response = await mobileAPI.getCompanies({ limit: 100 });
        const items = response?.data?.data?.companies || [];
        if (items.length) {
          setCompanies(items);
        } else {
          setCompanies(FALLBACK_MOBILE_COMPANIES);
        }
      } catch (error) {
        setCompanies(FALLBACK_MOBILE_COMPANIES);
        setErrorMessage('Unable to reach the catalog right now. Showing our most ordered models instead.');
      } finally {
        setLoadingCompanies(false);
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    if (!selectedCompany) {
      setModels([]);
      setSelectedModel(null);
      return;
    }

    // Save to recent searches
    setRecentSearches(prev => {
      const updated = [selectedCompany, ...prev.filter(c => c._id !== selectedCompany._id)].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    });

    if (selectedCompany.__isFallback) {
      setModels(selectedCompany.models || []);
      setSelectedModel((selectedCompany.models || [])[0] || null);
      return;
    }

    const fetchModels = async () => {
      try {
        setLoadingModels(true);
        const response = await mobileAPI.getModels({ company: selectedCompany._id, limit: 200 });
        const fetchedModels = response?.data?.data?.models || [];
        setModels(fetchedModels);
        setSelectedModel(fetchedModels[0] || null);
      } catch (error) {
        toast.error('Unable to load models for this brand. Try again in a bit.');
        setModels([]);
        setSelectedModel(null);
      } finally {
        setLoadingModels(false);
      }
    };

    fetchModels();
  }, [selectedCompany]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load recent searches:', error);
      }
    }
  }, []);

  const priceSummary = useMemo(() => {
    const total = (selectedMaterial?.price || 0) * quantity;
    const original = (selectedMaterial?.originalPrice || 0) * quantity;
    const savings = Math.max(original - total, 0);
    const discount = original ? Math.round((savings / original) * 100) : 0;
    return { total, original, savings, discount };
  }, [selectedMaterial, quantity]);

  const shippingReady = Boolean(
    shipping.name.trim() &&
    shipping.phone.trim() &&
    shipping.street.trim() &&
    shipping.city.trim() &&
    shipping.state.trim() &&
    shipping.postalCode.trim()
  );

  const canCheckout = Boolean(selectedCompany && selectedModel && imagePreview && shippingReady);

  // Handlers
  const handleCompanyChange = (event) => {
    const companyId = event.target.value;
    if (!companyId) {
      setSelectedCompany(null);
      return;
    }
    const company = companies.find((item) => item._id === companyId);
    setSelectedCompany(company || null);
  };

  const handleModelChange = (event) => {
    const modelId = event.target.value;
    const model = models.find((item) => item._id === modelId);
    setSelectedModel(model || null);
    
    if (model && model.images && model.images.length > 0) {
      setShowMockup(true);
    } else {
      setShowMockup(false);
    }
  };

  const handleQuantityChange = (direction) => {
    setQuantity((prev) => {
      const next = prev + direction;
      if (next < 1) return 1;
      if (next > 10) {
        toast.info('For bulk orders above 10 units, please contact us via WhatsApp');
        return 10;
      }
      return next;
    });
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file.');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error('Image must be under 8MB.');
      return;
    }

    // Analyze image quality
    toast.info('Analyzing image quality...');
    const quality = await analyzeImageQuality(file);
    setImageQuality(quality);

    if (quality.warnings.length > 0) {
      toast.warning(quality.warnings[0], { autoClose: 5000 });
    } else {
      toast.success('Image quality looks great!');
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedAsset(null);
      setImagePreview(e.target.result);
    };
    reader.onerror = () => toast.error('Failed to read image file.');
    reader.readAsDataURL(file);
  };

  const handleFileInput = (event) => {
    const file = event.target.files?.[0];
    handleImageUpload(file);
  };

  const handleTemplateSelect = (template) => {
    // In a real app, this would load the template design
    toast.success(`Selected ${template.name} template`);
    setShowTemplates(false);
    // Simulate template loading
    setImagePreview('/placeholder-template.jpg');
  };

  const handleSaveDesign = () => {
    const design = {
      id: Date.now(),
      imagePreview,
      company: selectedCompany?.name,
      model: selectedModel?.name,
      material: selectedMaterial?.label,
      timestamp: new Date().toISOString(),
    };
    
    setSavedDesigns(prev => [...prev, design]);
    localStorage.setItem('savedDesigns', JSON.stringify([...savedDesigns, design]));
    toast.success('Design saved to your collection');
  };

  const handleShareDesign = async () => {
    if (!imagePreview) {
      toast.error('Please upload a design first');
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out my custom mobile cover design!',
          text: `Custom ${selectedCompany?.name} ${selectedModel?.name} cover`,
          url: window.location.href,
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          toast.error('Failed to share design');
        }
      }
    } else {
      // Fallback: copy link
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const scrollToBuilder = () => {
    builderRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const showOrderFeedback = (payload) => {
    setOrderFeedback(payload);
  };

  const dismissOrderFeedback = () => {
    setOrderFeedback(null);
  };

  const updateShippingField = (field, value) => {
    setShipping((prev) => ({ ...prev, [field]: value }));
    setShippingErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateShipping = () => {
    const errors = {};
    const trimmedPhone = shipping.phone.trim();
    const trimmedName = shipping.name.trim();
    if (!trimmedName) errors.name = 'Name is required';
    else if (trimmedName.length < 2) errors.name = 'Name too short';
    if (!/^[0-9]{7,15}$/.test(trimmedPhone)) errors.phone = 'Phone must be 7-15 digits';
    if (!shipping.street.trim()) errors.street = 'Street address is required';
    if (!shipping.city.trim()) errors.city = 'City is required';
    if (!shipping.state.trim()) errors.state = 'State is required';
    if (!/^[0-9]{3,10}$/.test(shipping.postalCode.trim())) errors.postalCode = 'Enter a valid postal code';
    if (!shipping.country.trim()) errors.country = 'Country is required';
    setShippingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const loadRazorpayScript = () => new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window is not available'));
      return;
    }
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
    document.body.appendChild(script);
  });

  const uploadDesignToCloudinary = async () => {
    if (uploadedAsset?.url) return uploadedAsset;
    if (!imagePreview) throw new Error('Upload an image first');
    setUploadingImage(true);
    try {
      const result = await uploadAPI.uploadBase64Image({ image: imagePreview });
      const data = result?.data?.data || result?.data;
      const url = data?.url || data?.secure_url;
      const publicId = data?.publicId || data?.public_id;
      if (!result?.success || !url) {
        throw new Error('Image upload failed');
      }
      const asset = { url, publicId };
      setUploadedAsset(asset);
      return asset;
    } catch (error) {
      toast.error(error.message || 'Failed to upload image');
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  const initiatePayment = async (customOrder) => {
    try {
      await loadRazorpayScript();

      const paymentResponse = await dispatch(
        createCustomPayment(customOrder._id)
      ).unwrap();

      const paymentData = paymentResponse?.data?.data || paymentResponse?.data || paymentResponse;

      const razorpayOrderId = paymentData?.razorpayOrderId || paymentData?.orderId || paymentData?.id;
      const amount = paymentData?.amount;

      if (!razorpayOrderId || !amount) {
        console.error("Invalid payment data:", paymentData);
        throw new Error("Invalid payment data from backend");
      }

      const options = {
        key: paymentData.keyId || paymentData.key || import.meta.env.VITE_RAZORPAY_KEY,
        amount: amount,
        currency: paymentData.currency || "INR",
        order_id: razorpayOrderId,
        name: "Copad Custom Cover",
        description: `Custom order #${customOrder._id}`,
        prefill: {
          name: shipping.name,
          contact: shipping.phone,
        },
        notes: {
          customOrderId: customOrder._id,
          brand: selectedCompany?.name,
          model: selectedModel?.name,
        },
        theme: { color: "#2563eb" },
        handler: async (response) => {
          try {
            await dispatch(
              verifyCustomPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                customOrderId: customOrder._id,
              })
            ).unwrap();

            toast.success("Payment successful!");
            
            // Clear draft after successful order
            localStorage.removeItem('customDesignDraft');
            
            navigate("/custom-orders");
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error(error?.message || "Payment verification failed. Please contact support.");
          }
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", (err) => {
        toast.error(err?.error?.description || "Payment failed");
      });

      razorpay.open();
    } catch (error) {
      toast.error(error.message || "Unable to initiate payment");
    }
  };

  const handleSubmit = async (action) => {
    if (!isAuthenticated) {
      toast.error('Please log in to continue');
      const redirectUrl = encodeURIComponent(window.location.pathname + window.location.search);
      navigate(`/login?redirect=${redirectUrl}`);
      return;
    }
    if (!selectedCompany) {
      toast.error('Choose your phone brand first.');
      return;
    }
    if (!selectedModel) {
      toast.error('Pick the exact model to continue.');
      return;
    }
    if (!imagePreview) {
      toast.error('Upload a high quality image for the print.');
      return;
    }
    if (uploadingImage) {
      toast.error('Image upload in progress. Please wait.');
      return;
    }

    // Show image quality warning if needed
    if (imageQuality && imageQuality.quality === 'poor') {
      const proceed = window.confirm(
        'The uploaded image has low resolution and may not print well. Do you want to continue anyway?'
      );
      if (!proceed) return;
    }

    if (action === 'cart') {
      setSubmittingAction(action);
      try {
        const asset = await uploadDesignToCloudinary();
        
        const customProduct = {
          _id: `custom_${Date.now()}`,
          title: `Custom ${selectedCompany.name} ${selectedModel.name}`,
          brand: selectedCompany.name,
          model: selectedModel.name,
          design: {
            imgSrc: asset.url,
            meta: {
              company: selectedCompany.name,
              model: selectedModel.name,
              material: selectedMaterial.label,
            }
          }
        };

        const customVariant = {
          _id: `variant_${Date.now()}`,
          name: selectedMaterial.label,
          color: selectedMaterial.label,
          price: selectedMaterial.price,
        };

        dispatch(addToCart({ product: customProduct, variant: customVariant, quantity }));
        toast.success('Added to cart!');
        navigate('/cart');
      } catch (error) {
        toast.error(error.message || 'Failed to add to cart');
      } finally {
        setSubmittingAction(null);
      }
      return;
    }

    if (!validateShipping()) {
      toast.error('Please review your shipping details.');
      return;
    }

    setSubmittingAction(action);
    let asset;
    try {
      asset = await uploadDesignToCloudinary();
    } catch {
      setSubmittingAction(null);
      return;
    }

    const payload = {
      variant: {
        name: selectedMaterial?.label || 'Custom Case',
        color: selectedMaterial?.label || 'Custom',
        price: selectedMaterial?.price || 0,
        sku: `custom-${selectedMaterial?.id || 'generic'}`,
      },
      quantity,
      imageUrls: [asset.url],
      mockupUrl: asset.url,
      mockupPublicId: asset.publicId,
      instructions: specialNotes || '',
      designData: {
        companyId: selectedCompany._id,
        companyName: selectedCompany.name,
        modelId: selectedModel._id,
        modelName: selectedModel.name,
        material: selectedMaterial.label,
        imageQuality: imageQuality,
      },
      shippingAddress: {
        name: shipping.name.trim(),
        phone: shipping.phone.trim(),
        address1: shipping.street.trim(),
        city: shipping.city.trim(),
        state: shipping.state.trim(),
        postalCode: shipping.postalCode.trim(),
        country: shipping.country.trim() || 'India',
      },
    };

    let createdOrder = null;
    try {
      const response = await dispatch(createCustomOrder(payload)).unwrap();
      createdOrder = response?.data?.customOrder || response?.customOrder || response?.data;
      if (!createdOrder?._id) {
        throw new Error('Unexpected response from server');
      }

      await initiatePayment(createdOrder);
    } catch (error) {
      const message = createdOrder
        ? error?.response?.data?.message || error?.message || 'Failed to initiate payment'
        : error?.response?.data?.message || error?.message || 'Failed to create custom order';
      toast.error(message);
      showOrderFeedback({
        status: 'error',
        title: 'Something went wrong',
        message,
        orderId: createdOrder?._id,
        ctaLabel: createdOrder ? 'Try payment again' : undefined,
        onCta: createdOrder ? () => handleSubmit('buy') : undefined,
      });
    } finally {
      setSubmittingAction(null);
    }
  };

  const customDesignSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Custom Mobile Cover Design",
    "description": "Create your own custom mobile cover with premium UV printing",
    "offers": {
      "@type": "Offer",
      "price": selectedMaterial.price,
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <>
      <SEO
        title="Design Your Own Custom Mobile Cover | Premium UV Printing"
        description="Create personalized mobile covers with our easy-to-use design tool. Upload your image, choose your phone model, and get premium UV printed covers delivered in 24 hours."
        keywords="custom mobile cover, design phone case, personalized cover, UV printing, custom design"
        url="/custom"
        schema={customDesignSchema}
      />

      {showImageEditor && (
        <ImageEditor
          imageData={imagePreview}
          onSave={(editedImage) => {
            setImagePreview(editedImage);
            setUploadedAsset(null);
            setShowImageEditor(false);
            toast.success('Image edited successfully');
          }}
          onCancel={() => setShowImageEditor(false)}
        />
      )}

      {showTemplates && (
        <TemplatesModal
          onSelect={handleTemplateSelect}
          onClose={() => setShowTemplates(false)}
        />
      )}

      <div className="bg-gray-50 min-h-screen">
        <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="text-sm uppercase tracking-[0.3em] text-primary-100">#Trending • Made-to-order</p>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  Design Your Dream <span className="text-yellow-300">Cover</span>
                </h1>
                <p className="text-lg text-blue-100 max-w-xl">
                  Craft a one-of-a-kind mobile case with our advanced design tools, premium UV printing, 
                  and support for 700+ phone models.
                </p>
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <FiStar className="w-5 h-5 text-yellow-300" />
                    <div>
                      <span className="font-semibold">4.9/5</span>
                      <p className="text-blue-100 text-xs">12k+ customer ratings</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiShield className="w-5 h-5 text-green-200" />
                    <span className="text-sm">Premium Protection</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={scrollToBuilder}
                    className="bg-white text-primary-700 px-6 py-3 rounded-lg font-semibold shadow-lg hover:-translate-y-0.5 transition-transform"
                  >
                    Start Designing
                  </button>
                  <button
                    onClick={() => setShowTemplates(true)}
                    className="bg-transparent border border-white/60 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 flex items-center gap-2"
                  >
                    <FiGrid className="w-4 h-4" />
                    Browse Templates
                  </button>
                  <button
                    onClick={() => window.open('https://wa.me/9999999999', '_blank')}
                    className="bg-transparent border border-white/60 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10"
                  >
                    Chat with Designer
                  </button>
                </div>

                {recentSearches.length > 0 && (
                  <div className="pt-4">
                    <p className="text-sm text-blue-100 mb-2">Recent searches:</p>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.slice(0, 3).map((company) => (
                        <button
                          key={company._id}
                          onClick={() => setSelectedCompany(company)}
                          className="px-3 py-1 bg-white/20 rounded-full text-xs hover:bg-white/30 transition"
                        >
                          {company.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
          {errorMessage && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
              <FiAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {showMockup && selectedModel ? (
            <div className="max-w-6xl mx-auto p-6">
              <MobileFrameMockup 
                selectedModel={selectedModel}
                onDesignComplete={(designData) => {
                  setImagePreview(designData.image);
                  setUploadedAsset(null);
                  setShowMockup(false);
                }}
              />
              <div className="mt-4 text-center">
                <button 
                  onClick={() => setShowMockup(false)}
                  className="text-sm font-semibold text-primary-600 hover:text-primary-700"
                >
                  ← Back to Simple Upload
                </button>
              </div>
            </div>
          ) : (
            <section ref={builderRef} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Left Column - Preview */}
              <div className="space-y-6">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm uppercase tracking-wide text-gray-500">Live Preview</p>
                      {imageQuality && (
                        <div className="mt-1 flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            imageQuality.quality === 'excellent' ? 'bg-green-100 text-green-700' :
                            imageQuality.quality === 'good' ? 'bg-blue-100 text-blue-700' :
                            imageQuality.quality === 'fair' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {imageQuality.quality.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500">
                            {imageQuality.width}×{imageQuality.height}px
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {imagePreview && (
                        <>
                          <button
                            onClick={() => setShowImageEditor(true)}
                            className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
                            title="Edit Image"
                          >
                            <FiSliders className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleSaveDesign}
                            className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
                            title="Save Design"
                          >
                            <FiHeart className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleShareDesign}
                            className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
                            title="Share Design"
                          >
                            <FiShare2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {selectedModel && selectedModel.images && selectedModel.images.length > 0 && (
                        <button 
                          onClick={() => setShowMockup(true)}
                          className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
                        >
                          <FiLayers className="w-4 h-4" />
                          3D View
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="relative mx-auto w-64 aspect-[9/19]">
                    <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-slate-100 via-white to-slate-100 shadow-2xl" />
                    <div className="absolute inset-[18px] rounded-[24px] bg-gray-200 overflow-hidden">
                      {imagePreview ? (
                        <img 
                          src={typeof imagePreview === 'string' ? imagePreview : resolveImageUrl(imagePreview)} 
                          alt="Uploaded preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center px-6 text-center">
                          <div className="space-y-3">
                            <FiImage className="w-12 h-12 text-gray-400 mx-auto" />
                            <p className="text-gray-500 text-sm">
                              Upload a photo to preview your custom design
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {imagePreview && imageQuality && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                      <p className="text-xs font-semibold text-gray-700 mb-2">Image Details</p>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">Resolution</span>
                          <p className="font-semibold">{imageQuality.width}×{imageQuality.height}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Megapixels</span>
                          <p className="font-semibold">{imageQuality.megapixels}MP</p>
                        </div>
                        <div>
                          <span className="text-gray-500">File Size</span>
                          <p className="font-semibold">{imageQuality.fileSize}MB</p>
                        </div>
                      </div>
                      {imageQuality.warnings.length > 0 && (
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-xs text-yellow-800">{imageQuality.warnings[0]}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <p className="mt-4 text-sm text-gray-500 text-center">
                    Upload high quality image (min 1500×1500px) for best print results
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-primary-50 p-4">
                      <p className="text-xs uppercase text-primary-600">Total</p>
                      <p className="text-2xl font-bold text-primary-900">{formatPrice(priceSummary.total)}</p>
                      <p className="text-xs text-primary-700">For {quantity} case(s)</p>
                    </div>
                    <div className="rounded-2xl border border-gray-200 p-4">
                      <p className="text-xs uppercase text-gray-500">You save</p>
                      <p className="text-xl font-semibold text-green-600">{formatPrice(priceSummary.savings)}</p>
                      <p className="text-xs text-gray-500">{priceSummary.discount}% off MRP</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Form */}
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 space-y-8">
                {/* Material Selection */}
                <div className="space-y-4">
                  <p className="text-sm font-semibold text-gray-700">Choose Material</p>
                  <div className="grid grid-cols-1 gap-3">
                    {MATERIAL_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setSelectedMaterial(option)}
                        className={`rounded-2xl border p-4 text-left transition ${
                          selectedMaterial.id === option.id
                            ? 'border-primary-500 bg-primary-50 shadow-sm ring-2 ring-primary-200'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{option.label}</p>
                            <p className="text-sm text-gray-500 mt-1">{option.subtitle}</p>
                            <div className="flex items-center gap-2 mt-3">
                              <span className="text-lg font-bold text-primary-700">{formatPrice(option.price)}</span>
                              <span className="text-sm text-gray-400 line-through">{formatPrice(option.originalPrice)}</span>
                            </div>
                          </div>
                          {selectedMaterial.id === option.id && (
                            <div className="w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {option.features.map((feature) => (
                            <span key={feature} className="text-xs rounded-full bg-white/80 px-2 py-1 border border-gray-200 text-gray-600">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brand Selection */}
                <div className="space-y-4">
                  <label className="text-sm font-semibold text-gray-700" htmlFor="companySelect">
                    Phone Brand
                  </label>
                  {loadingCompanies ? (
                    <div className="py-6 flex justify-center">
                      <Loader size="sm" />
                    </div>
                  ) : (
                    <select
                      id="companySelect"
                      className="w-full p-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                      value={selectedCompany?._id || ''}
                      onChange={handleCompanyChange}
                    >
                      <option value="">Select your phone brand</option>
                      {companies.map((company) => (
                        <option key={company._id} value={company._id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Model Selection */}
                {selectedCompany && (
                  <div className="space-y-4">
                    <label className="text-sm font-semibold text-gray-700" htmlFor="modelSelect">
                      Phone Model
                    </label>
                    {loadingModels ? (
                      <div className="py-6 flex justify-center">
                        <Loader size="sm" />
                      </div>
                    ) : models.length ? (
                      <select
                        id="modelSelect"
                        className="w-full p-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                        value={selectedModel?._id || ''}
                        onChange={handleModelChange}
                      >
                        {models.map((model) => (
                          <option key={model._id} value={model._id}>
                            {model.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-sm text-gray-500 p-4 bg-gray-50 rounded-2xl">
                        No models found for this brand yet.
                      </p>
                    )}
                  </div>
                )}

                {/* Upload Section */}
                <div className="space-y-4">
                  <label className="text-sm font-semibold text-gray-700">Upload Your Design</label>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/30 transition-all"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileInput}
                    />
                    <FiUpload className="w-12 h-12 text-primary-600 mx-auto mb-3" />
                    <p className="font-semibold text-gray-900 mb-1">Click or drag to upload</p>
                    <p className="text-sm text-gray-500">High resolution JPG/PNG up to 8MB</p>
                    <p className="text-xs text-gray-400 mt-2">Recommended: 1500×1500px or higher</p>
                    
                    {imagePreview && (
                      <div className="mt-4 flex justify-center gap-2">
                        <button
                          type="button"
                          className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
                          onClick={(event) => {
                            event.stopPropagation();
                            setShowImageEditor(true);
                          }}
                        >
                          <FiSliders className="w-4 h-4" />
                          Edit Image
                        </button>
                        <button
                          type="button"
                          className="text-sm font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
                          onClick={(event) => {
                            event.stopPropagation();
                            setImagePreview('');
                            setUploadedAsset(null);
                            setImageQuality(null);
                          }}
                        >
                          <FiX className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowTemplates(true)}
                      className="flex-1 py-2 px-4 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                    >
                      <FiGrid className="w-4 h-4" />
                      Templates
                    </button>
                    <button
                      type="button"
                      onClick={() => window.open('https://wa.me/9999999999', '_blank')}
                      className="flex-1 py-2 px-4 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      Share via WhatsApp
                    </button>
                  </div>
                </div>

                {/* Quantity */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Quantity</label>
                    <div className="mt-2 flex items-center rounded-2xl border border-gray-200 overflow-hidden">
                      <button 
                        type="button" 
                        onClick={() => handleQuantityChange(-1)} 
                        disabled={quantity <= 1} 
                        className="p-4 text-gray-700 disabled:opacity-40 hover:bg-gray-50 transition"
                      >
                        <FiMinus className="w-5 h-5" />
                      </button>
                      <span className="flex-1 text-center font-bold text-lg">{quantity}</span>
                      <button 
                        type="button" 
                        onClick={() => handleQuantityChange(1)} 
                        disabled={quantity >= 10} 
                        className="p-4 text-gray-700 disabled:opacity-40 hover:bg-gray-50 transition"
                      >
                        <FiPlus className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Max 10 units per order • For bulk orders, contact us
                    </p>
                  </div>

                  {/* Special Notes */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Design Notes (Optional)</label>
                    <textarea
                      className="mt-2 w-full h-24 p-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                      placeholder="Any special instructions for our designers? (color adjustments, text placement, etc.)"
                      maxLength={220}
                      value={specialNotes}
                      onChange={(event) => setSpecialNotes(event.target.value)}
                    />
                    <p className="text-xs text-right text-gray-400 mt-1">{specialNotes.length}/220</p>
                  </div>
                </div>

                {/* Shipping Details */}
                <div className="space-y-4">
                  <div className="border-t pt-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">Shipping Information</h3>
                    <p className="text-sm text-gray-500">We deliver pan-India within 3-5 working days</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Full Name *</label>
                      <input
                        type="text"
                        value={shipping.name}
                        onChange={(event) => updateShippingField('name', event.target.value)}
                        className={`mt-2 w-full rounded-2xl border px-4 py-3 focus:outline-none focus:ring-2 transition ${
                          shippingErrors.name ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-primary-500'
                        }`}
                        placeholder="John Doe"
                      />
                      {shippingErrors.name && <p className="text-xs text-red-600 mt-1">{shippingErrors.name}</p>}
                    </div>
                    
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Phone Number *</label>
                      <input
                        type="tel"
                        value={shipping.phone}
                        onChange={(event) => updateShippingField('phone', event.target.value.replace(/[^0-9]/g, ''))}
                        className={`mt-2 w-full rounded-2xl border px-4 py-3 focus:outline-none focus:ring-2 transition ${
                          shippingErrors.phone ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-primary-500'
                        }`}
                        placeholder="10 digit mobile"
                      />
                      {shippingErrors.phone && <p className="text-xs text-red-600 mt-1">{shippingErrors.phone}</p>}
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="text-sm font-semibold text-gray-700">Street Address *</label>
                      <input
                        type="text"
                        value={shipping.street}
                        onChange={(event) => updateShippingField('street', event.target.value)}
                        className={`mt-2 w-full rounded-2xl border px-4 py-3 focus:outline-none focus:ring-2 transition ${
                          shippingErrors.street ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-primary-500'
                        }`}
                        placeholder="House number, street, locality"
                      />
                      {shippingErrors.street && <p className="text-xs text-red-600 mt-1">{shippingErrors.street}</p>}
                    </div>
                    
                    <div>
                      <label className="text-sm font-semibold text-gray-700">City *</label>
                      <input
                        type="text"
                        value={shipping.city}
                        onChange={(event) => updateShippingField('city', event.target.value)}
                        className={`mt-2 w-full rounded-2xl border px-4 py-3 focus:outline-none focus:ring-2 transition ${
                          shippingErrors.city ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-primary-500'
                        }`}
                        placeholder="Mumbai"
                      />
                      {shippingErrors.city && <p className="text-xs text-red-600 mt-1">{shippingErrors.city}</p>}
                    </div>
                    
                    <div>
                      <label className="text-sm font-semibold text-gray-700">State *</label>
                      <input
                        type="text"
                        value={shipping.state}
                        onChange={(event) => updateShippingField('state', event.target.value)}
                        className={`mt-2 w-full rounded-2xl border px-4 py-3 focus:outline-none focus:ring-2 transition ${
                          shippingErrors.state ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-primary-500'
                        }`}
                        placeholder="Maharashtra"
                      />
                      {shippingErrors.state && <p className="text-xs text-red-600 mt-1">{shippingErrors.state}</p>}
                    </div>
                    
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Postal Code *</label>
                      <input
                        type="text"
                        value={shipping.postalCode}
                        onChange={(event) => updateShippingField('postalCode', event.target.value.replace(/[^0-9]/g, ''))}
                        className={`mt-2 w-full rounded-2xl border px-4 py-3 focus:outline-none focus:ring-2 transition ${
                          shippingErrors.postalCode ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-primary-500'
                        }`}
                        placeholder="400001"
                      />
                      {shippingErrors.postalCode && <p className="text-xs text-red-600 mt-1">{shippingErrors.postalCode}</p>}
                    </div>
                    
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Country *</label>
                      <input
                        type="text"
                        value={shipping.country}
                        onChange={(event) => updateShippingField('country', event.target.value)}
                        className={`mt-2 w-full rounded-2xl border px-4 py-3 focus:outline-none focus:ring-2 transition ${
                          shippingErrors.country ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-primary-500'
                        }`}
                        placeholder="India"
                      />
                      {shippingErrors.country && <p className="text-xs text-red-600 mt-1">{shippingErrors.country}</p>}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => handleSubmit('cart')}
                    disabled={ACTIONS_DISABLED || !canCheckout || !!submittingAction}
                    className={`w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 text-white transition-all shadow-lg ${
                      !ACTIONS_DISABLED && canCheckout && !submittingAction
                        ? 'bg-primary-600 hover:bg-primary-700 hover:shadow-xl hover:-translate-y-0.5'
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    {submittingAction === 'cart' ? (
                      <>
                        <Loader size="sm" />
                        <span>Adding to Cart...</span>
                      </>
                    ) : (
                      <>
                        <FiShield className="w-5 h-5" />
                        <span>{ACTIONS_DISABLED ? 'Temporarily Unavailable' : 'Add to Cart'}</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleSubmit('buy')}
                    disabled={ACTIONS_DISABLED || !canCheckout || !!submittingAction}
                    className={`w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 text-white transition-all shadow-lg ${
                      !ACTIONS_DISABLED && canCheckout && !submittingAction
                        ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 hover:shadow-xl hover:-translate-y-0.5'
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    {submittingAction === 'buy' ? (
                      <>
                        <Loader size="sm" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <FiZap className="w-5 h-5" />
                        <span>{ACTIONS_DISABLED ? 'Checkout Disabled' : 'Buy Now'}</span>
                      </>
                    )}
                  </button>
                  
                  <p className="text-xs text-center text-gray-500">
                    {ACTIONS_DISABLED
                      ? 'Custom checkout is undergoing maintenance. Please revisit shortly.'
                      : '🔒 Secure payment via UPI, Cards, Netbanking & Wallets'}
                  </p>

                  {autoSaveEnabled && (
                    <p className="text-xs text-center text-green-600 flex items-center justify-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Your design is being auto-saved
                    </p>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Feature Highlights */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURE_HIGHLIGHTS.map((feature) => (
              <div key={feature.title} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex gap-4 hover:shadow-md transition-shadow">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
                <div>
                  <p className="text-xl font-semibold text-gray-900">{feature.title}</p>
                  <p className="text-gray-600 mt-1">{feature.description}</p>
                </div>
              </div>
            ))}
          </section>

          {/* FAQ Section */}
          <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <div className="text-center mb-8">
              <p className="text-sm uppercase text-gray-500 tracking-wide">Questions</p>
              <h2 className="text-3xl font-semibold text-gray-900 mt-2">Frequently Asked Questions</h2>
              <p className="text-gray-600 mt-2">Everything you need to know about custom covers</p>
            </div>
            <div className="space-y-4 max-w-3xl mx-auto">
              {FAQS.map((faq) => (
                <div key={faq.id} className="border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 transition">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between p-5 text-left"
                    onClick={() => setOpenFaq((prev) => (prev === faq.id ? null : faq.id))}
                  >
                    <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                    <FiChevronDown 
                      className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${
                        openFaq === faq.id ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  {openFaq === faq.id && (
                    <div className="px-5 pb-5">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Order Feedback Modal */}
        {orderFeedback && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div
              className={`relative rounded-3xl border p-8 shadow-2xl bg-white max-w-md w-full ${
                orderFeedback.status === 'success' ? 'border-emerald-200' : 'border-red-200'
              }`}
            >
              <button
                type="button"
                aria-label="Close"
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                onClick={dismissOrderFeedback}
              >
                <FiX className="w-6 h-6" />
              </button>
              
              <div className="text-center mb-6">
                <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                  orderFeedback.status === 'success' ? 'bg-emerald-100' : 'bg-red-100'
                }`}>
                  {orderFeedback.status === 'success' ? (
                    <svg className="w-8 h-8 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <FiAlertCircle className="w-8 h-8 text-red-600" />
                  )}
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{orderFeedback.title}</h3>
                <p className="text-gray-600">{orderFeedback.message}</p>
                
                {orderFeedback.orderId && (
                  <p className="text-sm font-mono text-gray-500 mt-3 bg-gray-100 px-3 py-2 rounded-lg inline-block">
                    Order: {orderFeedback.orderId}
                  </p>
                )}
              </div>
              
              {orderFeedback.ctaLabel && orderFeedback.onCta && (
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    className={`w-full px-6 py-3 rounded-xl font-semibold text-white ${
                      orderFeedback.status === 'success' 
                        ? 'bg-emerald-600 hover:bg-emerald-700' 
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                    onClick={() => {
                      orderFeedback.onCta?.();
                      dismissOrderFeedback();
                    }}
                  >
                    {orderFeedback.ctaLabel}
                  </button>
                  <button
                    type="button"
                    className="w-full px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold"
                    onClick={dismissOrderFeedback}
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CustomMobilePage;