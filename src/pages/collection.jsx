import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { 
  FiArrowLeft, 
  FiCheckCircle, 
  FiImage, 
  FiSmartphone, 
  FiTrash2, 
  FiUpload,
  FiSearch,
  FiFilter,
  FiX,
  FiZoomIn,
  FiMaximize2,
  FiGrid,
  FiList,
  FiDownload
} from 'react-icons/fi';
import collectionAPI from '../api/collectionAPI';
import mobileAPI from '../api/mobileAPI';
import { FALLBACK_COLLECTION_MAP } from '../data/fallbackCollections';
import { FALLBACK_MOBILE_COMPANIES } from '../data/fallbackMobileCompanies';
import { resolveImageUrl } from '../utils/helpers';
import SEO from '../components/SEO';

const emptyMeta = {
  title: '',
  description: '',
  tagline: '',
  accentColor: '#0ea5e9',
};

const DEFAULT_FRAME = '/frames/frame-1-fixed.svg';
const COLLECTION_CASE_PRICE = 199;

const slugifyId = (value) => {
  const parsed = String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '') || 'x';
  return parsed;
};

const normalizeHandle = (value = '') => (
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
);

// Image Lightbox Component - Mobile Optimized
const ImageLightbox = ({ image, collection, onClose, onNext, onPrev, currentIndex, totalCount }) => {
  const imgSrc = resolveImageUrl(
    image?.url || image?.secure_url || image?.path || image?.publicUrl || ''
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  return (
    <div 
      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white hover:text-gray-300 transition z-10 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
      >
        <FiX className="w-6 h-6 sm:w-8 sm:h-8" />
      </button>

      {onPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition text-2xl sm:text-4xl p-2 sm:p-4 min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          ‹
        </button>
      )}

      {onNext && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition text-2xl sm:text-4xl p-2 sm:p-4 min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          ›
        </button>
      )}

      <div 
        className="max-w-6xl max-h-[90vh] flex flex-col items-center w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imgSrc}
          alt={image?.caption || collection?.title}
          className="max-w-full max-h-[70vh] sm:max-h-[80vh] object-contain rounded-lg shadow-2xl"
        />
        {image?.caption && (
          <p className="text-white mt-2 sm:mt-4 text-sm sm:text-lg text-center px-4">{image.caption}</p>
        )}
        <p className="text-gray-400 text-xs sm:text-sm mt-1 sm:mt-2">
          {currentIndex + 1} / {totalCount}
        </p>
      </div>
    </div>
  );
};

// Enhanced Image Card Component - Mobile Optimized
const ImageCard = ({ 
  image, 
  index, 
  isSelected, 
  onSelect, 
  onDelete, 
  onZoom,
  collection,
  isAdmin,
  selectedCompany,
  selectedModel
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const tileSrc = resolveImageUrl(
    image.url || image.secure_url || image.path || image.publicUrl || ''
  );

  return (
    <div
      className={`relative group rounded-xl sm:rounded-2xl overflow-hidden border transition-all duration-300 transform ${
        isSelected 
          ? 'border-primary-500 ring-2 sm:ring-4 ring-primary-200 scale-[1.01] sm:scale-[1.02] shadow-xl' 
          : 'border-gray-200 hover:border-primary-300 hover:shadow-lg hover:scale-[1.005] sm:hover:scale-[1.01]'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        onClick={() => onSelect(image)}
        className="relative w-full aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 cursor-pointer"
        role="button"
        tabIndex="0"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(image);
          }
        }}
      >
        {/* Loading skeleton */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}

        {/* Image */}
        <div className="absolute inset-0 flex items-center justify-center p-1.5 sm:p-2">
          <img
            src={tileSrc}
            alt={image.caption || collection.title}
            className={`max-w-full max-h-full object-contain transition-all duration-500 ${
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            } ${isHovered ? 'scale-105' : ''}`}
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
          />
        </div>

        {/* Hover/Touch overlay */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-all duration-300 opacity-0 group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onZoom(image);
              }}
              className="bg-white/90 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg transition min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="View full size"
            >
              <FiMaximize2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
            </button>
          </div>
        </div>

        {/* Selected badge */}
        {isSelected && (
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 flex items-center gap-1 sm:gap-1.5 bg-white/95 text-primary-600 text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-lg backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-300">
            <FiCheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
            Selected
          </span>
        )}

        {/* Mobile Company Badge */}
        {selectedCompany && selectedModel && (
          <span className="absolute top-2 right-2 sm:top-3 sm:right-3 flex items-center gap-0.5 sm:gap-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-[10px] sm:text-xs font-medium px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-full shadow-lg">
            <FiSmartphone className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            <span className="truncate max-w-[60px] sm:max-w-none">{selectedCompany.name}</span>
          </span>
        )}

        {/* Bottom number badge */}
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white text-[10px] sm:text-sm font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-lg">
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Caption with model info */}
        {(image.caption || (selectedCompany && selectedModel)) && (
          <div className="absolute bottom-10 sm:bottom-12 left-1 right-1 sm:left-2 sm:right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/95 backdrop-blur-md rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 text-center shadow-xl">
              {image.caption && (
                <p className="text-[10px] sm:text-xs font-semibold text-gray-800 truncate">{image.caption}</p>
              )}
              {selectedCompany && selectedModel && (
                <p className="text-[10px] sm:text-xs text-gray-600 truncate mt-0.5">{selectedModel.name}</p>
              )}
            </div>
          </div>
        )}

        {/* Delete button (admin only) */}
        {isAdmin && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(image._id);
            }}
            className="absolute top-10 sm:top-14 right-2 sm:right-3 bg-red-500 hover:bg-red-600 rounded-full p-1.5 sm:p-2 text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 min-h-[32px] min-w-[32px] sm:min-h-[36px] sm:min-w-[36px] flex items-center justify-center"
            title="Delete image"
          >
            <FiTrash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

const CollectionPage = () => {
  const { handle } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.role === 'admin';

  const normalizedHandle = useMemo(() => normalizeHandle(handle), [handle]);
  const fallbackCollection = useMemo(
    () => FALLBACK_COLLECTION_MAP[normalizedHandle] || null,
    [normalizedHandle]
  );

  const galleryRef = useRef(null);

  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');
  const [metaDraft, setMetaDraft] = useState(emptyMeta);
  const [uploading, setUploading] = useState(false);
  const [savingMeta, setSavingMeta] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createDraft, setCreateDraft] = useState({
    ...emptyMeta,
    title: '',
    handle: handle || ''
  });
  const [selectedImage, setSelectedImage] = useState(null);

  // Mobile company and model state
  const [_companies, setCompanies] = useState([]);
  const [_models, setModels] = useState([]);
  const [selectedCompany, _setSelectedCompany] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [_loadingCompanies, setLoadingCompanies] = useState(true);
  const [_loadingModels, setLoadingModels] = useState(false);
  const [_catalogError, setCatalogError] = useState('');

  // New enhancement states
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filterCategory] = useState('all'); // 'all', 'art', 'photo'
  const [lightboxImage, setLightboxImage] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [sortBy, setSortBy] = useState('default'); // 'default', 'name', 'recent'

  const loadCollection = useCallback(async () => {
    if (!handle) return;

    if (isAdmin) {
      setCollection(null);
      setLoading(true);
      setError('');
      setNotFound(false);
      try {
        const res = await collectionAPI.getByHandle(handle);
        const data = res.data?.data?.collection;
        if (data) {
          setCollection(data);
          setNotFound(false);
          setError('');
          return;
        }
        if (fallbackCollection) {
          setCollection(fallbackCollection);
          setNotFound(false);
          setError('');
        } else {
          setNotFound(true);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          if (fallbackCollection) {
            setCollection(fallbackCollection);
            setNotFound(false);
            setError('');
          } else {
            setCollection(null);
            setNotFound(true);
          }
        } else {
          const message = err.response?.data?.message || err.message || 'Failed to load collection';
          setError(message);
          setNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    } else {
      // Always try API first for non-admin users
      setCollection(null);
      setLoading(true);
      setError('');
      setNotFound(false);
      
      try {
        const res = await collectionAPI.getByHandle(handle);
        const data = res.data?.data?.collection;
        if (data) {
          setCollection(data);
          setNotFound(false);
          setError('');
          return;
        }
        
        // Fall back to static collection if API returns no data
        if (fallbackCollection) {
          setCollection(fallbackCollection);
          setNotFound(false);
          setError('');
        } else {
          setNotFound(true);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          // Try fallback collection on 404
          if (fallbackCollection) {
            setCollection(fallbackCollection);
            setNotFound(false);
            setError('');
          } else {
            setCollection(null);
            setNotFound(true);
          }
        } else {
          // For other errors, try fallback as backup
          if (fallbackCollection) {
            setCollection(fallbackCollection);
            setNotFound(false);
            setError('');
          } else {
            const message = err.response?.data?.message || err.message || 'Failed to load collection';
            setError(message);
            setNotFound(true);
          }
        }
      } finally {
        setLoading(false);
      }
    }
  }, [handle, fallbackCollection, isAdmin]);

  useEffect(() => {
    loadCollection();
  }, [loadCollection]);

  useEffect(() => {
    if (collection) {
      setMetaDraft({
        title: collection.title || '',
        description: collection.description || '',
        tagline: collection.tagline || '',
        accentColor: collection.accentColor || '#0ea5e9',
      });
    }
  }, [collection]);

  const galleryImages = useMemo(() => collection?.images || [], [collection]);
  const accent = metaDraft.accentColor || '#0ea5e9';

  useEffect(() => {
    if (!galleryImages.length) {
      setSelectedImage(null);
      return;
    }
    setSelectedImage((prev) => {
      if (!prev) return galleryImages[0];
      const stillExists = galleryImages.find(
        (image) =>
          (image._id && prev?._id && image._id === prev._id) ||
          (!image._id && image.url === prev?.url)
      );
      return stillExists || galleryImages[0];
    });
  }, [galleryImages]);

  // Fetch mobile companies
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
    return () => {
      ignore = true;
    };
  }, []);

  // Fetch mobile models when company changes
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
        const response = await mobileAPI.getModels({
          company: selectedCompany._id,
          limit: 200
        });
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
    return () => {
      cancelled = true;
    };
  }, [selectedCompany]);

  // Filter and search logic
  const filteredImages = useMemo(() => {
    let filtered = [...galleryImages];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((img) => {
        const caption = (img.caption || '').toLowerCase();
        return caption.includes(query);
      });
    }

    // Category filter (example: you'd need to add category metadata to images)
    if (filterCategory !== 'all') {
      filtered = filtered.filter((img) => {
        // This is a placeholder - you'd implement based on your data structure
        return img.category === filterCategory;
      });
    }

    // Sort
    if (sortBy === 'name') {
      filtered.sort((a, b) => (a.caption || '').localeCompare(b.caption || ''));
    } else if (sortBy === 'recent') {
      filtered.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA;
      });
    }

    return filtered;
  }, [galleryImages, searchQuery, filterCategory, sortBy]);

  const handleMetaChange = (event) => {
    const { name, value } = event.target;
    setMetaDraft((prev) => ({ ...prev, [name]: value }));
  };

  const handleArtworkSelect = (image) => {
    setSelectedImage(image);
    if (!collection) return;
    const rawToken =
      image?._id ||
      image?.publicId ||
      image?.url ||
      image?.path ||
      image?.secure_url ||
      image?.caption;
    const token = rawToken ? slugifyId(rawToken) : '';
    const nextUrl = token
      ? `/collection/${handle}/gallery?imageId=${token}`
      : `/collection/${handle}/gallery`;
    navigate(nextUrl, { state: { selectedImage: image } });
  };

  const handleMetaSave = async (event) => {
    event.preventDefault();
    if (!collection?._id) return;
    setSavingMeta(true);
    try {
      await collectionAPI.adminUpdate(collection._id, metaDraft);
      toast.success('Collection updated');
      await loadCollection();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update collection');
    } finally {
      setSavingMeta(false);
    }
  };

  const handleUploadImages = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length || !collection?._id) return;

    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));

    setUploading(true);
    try {
      await collectionAPI.adminAddImages(collection._id, formData);
      toast.success('Images uploaded');
      await loadCollection();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload images');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleRemoveImage = async (imageId) => {
    if (!collection?._id) return;
    const confirmed = window.confirm('Remove this image from the collection?');
    if (!confirmed) return;

    try {
      await collectionAPI.adminRemoveImage(collection._id, imageId);
      toast.success('Image removed');
      await loadCollection();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove image');
    }
  };

  const handleCreateChange = (event) => {
    const { name, value } = event.target;
    setCreateDraft((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateCollection = async (event) => {
    event.preventDefault();
    if (!createDraft.title.trim()) {
      toast.error('Title is required');
      return;
    }

    setCreating(true);
    try {
      await collectionAPI.adminCreate({
        title: createDraft.title,
        description: createDraft.description,
        tagline: createDraft.tagline,
        accentColor: createDraft.accentColor,
        handle: createDraft.handle || handle,
      });
      toast.success('Collection created');
      await loadCollection();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create collection');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteCollection = async () => {
    if (!collection?._id) return;
    const confirmed = window.confirm(
      'Delete this entire collection? This cannot be undone.'
    );
    if (!confirmed) return;

    try {
      await collectionAPI.adminDelete(collection._id);
      toast.success('Collection deleted');
      setCollection(null);
      setNotFound(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete collection');
    }
  };

  const handleZoomImage = (image) => {
    const index = filteredImages.findIndex((img) => 
      (img._id && image._id && img._id === image._id) || 
      (!img._id && img.url === image.url)
    );
    setLightboxImage(image);
    setLightboxIndex(index);
  };

  const handleLightboxNext = () => {
    const nextIndex = (lightboxIndex + 1) % filteredImages.length;
    setLightboxIndex(nextIndex);
    setLightboxImage(filteredImages[nextIndex]);
  };

  const handleLightboxPrev = () => {
    const prevIndex = (lightboxIndex - 1 + filteredImages.length) % filteredImages.length;
    setLightboxIndex(prevIndex);
    setLightboxImage(filteredImages[prevIndex]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading collection...</p>
        </div>
      </div>
    );
  }

  if (notFound && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🎨</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Collection not found</h1>
          <p className="text-gray-600 mb-6">
            We could not find this collection. Please pick another theme from the library.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              to="/themes"
              className="px-6 py-3 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transition"
            >
              Browse Themes
            </Link>
            <Link
              to="/"
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition"
            >
              Back home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (notFound && isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <FiImage className="w-8 h-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">COLLECTOR</h1>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Create a new collection</h2>
            <p className="text-gray-600 mb-6">
              No collection exists for handle "{handle}". You can create one below.
            </p>

            <form onSubmit={handleCreateCollection} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={createDraft.title}
                  onChange={handleCreateChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Krishna Collection"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Handle / URL</label>
                <input
                  type="text"
                  name="handle"
                  value={createDraft.handle}
                  onChange={handleCreateChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                  placeholder="krishna-collection"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Full URL: http://localhost:3000/collection/{createDraft.handle || handle}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                <input
                  type="text"
                  name="tagline"
                  value={createDraft.tagline}
                  onChange={handleCreateChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="A brief, catchy description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={createDraft.description}
                  onChange={handleCreateChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Detailed description of this collection..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Accent color</label>
                <input
                  type="color"
                  name="accentColor"
                  value={createDraft.accentColor}
                  onChange={handleCreateChange}
                  className="w-24 h-10 rounded-lg cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full px-6 py-3 rounded-full bg-primary-600 text-white font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? 'Creating...' : 'Create collection'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-600">
        {error || 'Collection unavailable'}
      </div>
    );
  }

  // Build SEO schema for this collection
  const collectionSchema = collection ? {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${collection.title || handle} Mobile Covers`,
    "description": collection.description || `Shop ${collection.title || handle} themed mobile covers for all phone brands at CoverGhar.`,
    "url": `https://www.coverghar.in/collection/${normalizedHandle}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": filteredImages?.length || 0,
      "itemListElement": (filteredImages || []).slice(0, 20).map((img, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "url": `https://www.coverghar.in/collection/${normalizedHandle}`,
        "name": img.alt || img.title || `${collection.title} Design ${idx + 1}`,
        "image": resolveImageUrl(img?.url || img?.secure_url || img?.path || img?.publicUrl || '')
      }))
    }
  } : null;

  const seoTitle = collection
    ? `${collection.title} Mobile Covers | Phone Cases — CoverGhar`
    : `${handle} Mobile Covers | CoverGhar`;
  const seoDescription = collection?.description
    || `Shop ${collection?.title || handle} themed mobile covers for all phone brands. Premium printed phone cases starting ₹199 with fast delivery across India.`;

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={`${collection?.title || handle} mobile cover, ${collection?.title || handle} phone case, ${collection?.title || handle} back cover, themed phone cases India, CoverGhar`}
        url={`/collection/${normalizedHandle}`}
        type="website"
        schema={collectionSchema}
      />

      {/* Lightbox */}
      {lightboxImage && (
        <ImageLightbox
          image={lightboxImage}
          collection={collection}
          onClose={() => setLightboxImage(null)}
          onNext={handleLightboxNext}
          onPrev={handleLightboxPrev}
          currentIndex={lightboxIndex}
          totalCount={filteredImages.length}
        />
      )}

      {/* Header */}
      <div className="border-b bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 min-w-0">
            <Link
              to="/themes"
              className="flex items-center gap-1 sm:gap-2 text-primary-600 font-semibold hover:text-primary-700 transition min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0"
            >
              <FiArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Themes</span>
            </Link>
            <span className="hidden sm:inline">/</span>
            <span className="text-gray-900 font-semibold truncate max-w-[50vw] sm:max-w-[45vw] md:max-w-none text-xs sm:text-sm">{collection.title}</span>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center ${
                viewMode === 'grid'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Grid view"
            >
              <FiGrid className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center ${
                viewMode === 'list'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="List view"
            >
              <FiList className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 mt-4 sm:mt-6 lg:mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Main content */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6">
            {/* Collection header */}
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl p-4 sm:p-5 md:p-8">
              <p className="uppercase text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.4em] text-gray-400 mb-1 sm:mb-2">Collection</p>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">{collection.title}</h1>
              {collection.tagline && (
                <p className="text-sm sm:text-base md:text-lg text-gray-600 mt-1 sm:mt-2">{collection.tagline}</p>
              )}
              {collection.description && (
                <p className="text-gray-600 mt-2 sm:mt-4 text-sm sm:text-base leading-relaxed">{collection.description}</p>
              )}
            </div>

            {/* Search and filters */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg p-3 sm:p-4">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Search */}
                  <div className="flex-1 relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by caption..."
                      className="w-full pl-9 sm:pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base min-h-[44px]"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base min-h-[44px]"
                  >
                    <option value="default">Default order</option>
                    <option value="name">By name</option>
                    <option value="recent">Most recent</option>
                  </select>
                </div>

                {/* Upload button (admin) - Full width on mobile */}
                {isAdmin && (
                  <label
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg sm:rounded-xl border-2 cursor-pointer font-semibold hover:bg-gray-50 transition min-h-[44px] text-sm sm:text-base"
                    style={{ borderColor: accent, color: accent }}
                  >
                    <FiUpload className="w-4 h-4" />
                    {uploading ? 'Uploading...' : 'Upload Images'}
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*"
                      onChange={handleUploadImages}
                      disabled={uploading}
                    />
                  </label>
                )}
              </div>

              {/* Results count */}
              <p className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3">
                Showing {filteredImages.length} of {galleryImages.length} images
              </p>
            </div>

            {/* Gallery */}
            <div ref={galleryRef} className="bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl p-3 sm:p-4 md:p-6">
              {filteredImages.length === 0 ? (
                <div className="border-2 border-dashed border-gray-300 rounded-xl sm:rounded-2xl p-8 sm:p-12 md:p-16 text-center">
                  <FiImage className="w-10 h-10 sm:w-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                  <p className="text-gray-500 text-sm sm:text-base md:text-lg font-medium">
                    {searchQuery ? 'No images match your search' : 'No images yet'}
                  </p>
                  {isAdmin && !searchQuery && (
                    <p className="text-gray-400 text-xs sm:text-sm mt-2">
                      Upload your first images to bring this collection to life.
                    </p>
                  )}
                </div>
              ) : (
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'
                      : 'space-y-4'
                  }
                >
                  {filteredImages.map((image) => {
                    const isChosen =
                      selectedImage &&
                      ((image._id && selectedImage._id === image._id) ||
                        (!image._id && selectedImage.url === image.url));

                    return (
                      <ImageCard
                        key={image._id || image.publicId || image.url}
                        image={image}
                        index={galleryImages.findIndex((img) => 
                          (img._id && image._id && img._id === image._id) || 
                          (!img._id && img.url === image.url)
                        )}
                        isSelected={isChosen}
                        onSelect={handleArtworkSelect}
                        onDelete={handleRemoveImage}
                        onZoom={handleZoomImage}
                        collection={collection}
                        isAdmin={isAdmin}
                        selectedCompany={selectedCompany}
                        selectedModel={selectedModel}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Device selector */}
          

            {/* Admin panel */}
            {isAdmin && (
              <div className="bg-white rounded-2xl shadow-lg p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <h3 className="text-sm font-semibold text-gray-900">ADMIN PANEL</h3>
                </div>

                <form onSubmit={handleMetaSave} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                    <input
                      name="title"
                      value={metaDraft.title}
                      onChange={handleMetaChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Tagline</label>
                    <input
                      name="tagline"
                      value={metaDraft.tagline}
                      onChange={handleMetaChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={metaDraft.description}
                      onChange={handleMetaChange}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Accent</label>
                    <input
                      type="color"
                      name="accentColor"
                      value={metaDraft.accentColor}
                      onChange={handleMetaChange}
                      className="w-20 h-8 rounded cursor-pointer"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={savingMeta}
                    className="w-full rounded-lg py-2 text-sm font-semibold text-white transition"
                    style={{ backgroundColor: accent }}
                  >
                    {savingMeta ? 'Saving...' : 'Save'}
                  </button>
                </form>

                <div className="mt-4 pt-4 border-t">
                  <button
                    onClick={handleDeleteCollection}
                    className="w-full flex items-center justify-center gap-2 rounded-lg border-2 border-red-200 text-red-600 py-2 text-sm font-semibold hover:bg-red-50 transition"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    Delete Collection
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionPage;