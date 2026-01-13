import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiCheckCircle, FiImage, FiSmartphone, FiTrash2, FiUpload } from 'react-icons/fi';
import collectionAPI from '../api/collectionAPI';
import mobileAPI from '../api/mobileAPI';
import { FALLBACK_COLLECTION_MAP } from '../data/fallbackCollections';
import { FALLBACK_MOBILE_COMPANIES } from '../data/fallbackMobileCompanies';
import { addToCart } from '../redux/slices/cartSlice';
import { resolveImageUrl, formatPrice } from '../utils/helpers';

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

const CollectionPage = () => {
  const { handle } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.role === 'admin';
  const normalizedHandle = useMemo(() => normalizeHandle(handle), [handle]);
  const fallbackCollection = useMemo(() => FALLBACK_COLLECTION_MAP[normalizedHandle] || null, [normalizedHandle]);

  const galleryRef = useRef(null);
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');
  const [metaDraft, setMetaDraft] = useState(emptyMeta);
  const [uploading, setUploading] = useState(false);
  const [savingMeta, setSavingMeta] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createDraft, setCreateDraft] = useState({ ...emptyMeta, title: '', handle: handle || '' });
  const [selectedImage, setSelectedImage] = useState(null);
  
  // Mobile company and model state
  const [companies, setCompanies] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [loadingModels, setLoadingModels] = useState(false);
  const [catalogError, setCatalogError] = useState('');

  const loadCollection = useCallback(async () => {
    if (!handle) return;
    
    // For admin users, try to fetch from database first to see if there's a real collection
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
        // If no collection found in database, fall back to fallback collection
        if (fallbackCollection) {
          setCollection(fallbackCollection);
          setNotFound(false);
          setError('');
        } else {
          setNotFound(true);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          // If no collection found in database, fall back to fallback collection
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
      // For non-admin users, continue with existing fallback-first logic
      const hasFallback = Boolean(fallbackCollection);

      if (hasFallback) {
        setCollection(fallbackCollection);
        setNotFound(false);
        setError('');
        setLoading(false);
      } else {
        setCollection(null);
        setLoading(true);
        setError('');
        setNotFound(false);
      }

      // Only try to fetch from API if no fallback exists
      if (!hasFallback) {
        try {
          const res = await collectionAPI.getByHandle(handle);
          const data = res.data?.data?.collection;
          if (data) {
            setCollection(data);
            setNotFound(false);
            setError('');
            return;
          }
          setNotFound(true);
        } catch (err) {
          if (err.response?.status === 404) {
            setCollection(null);
            setNotFound(true);
          } else {
            const message = err.response?.data?.message || err.message || 'Failed to load collection';
            setError(message);
          }
        } finally {
          setLoading(false);
        }
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
  const selectedImageUrl = useMemo(() => {
    if (!selectedImage) return '';
    const source = typeof selectedImage === 'string'
      ? selectedImage
      : selectedImage.url || selectedImage.secure_url || selectedImage.path || selectedImage.publicUrl || selectedImage.previewUrl || '';
    return resolveImageUrl(source);
  }, [selectedImage]);

  useEffect(() => {
    if (!galleryImages.length) {
      setSelectedImage(null);
      return;
    }
    setSelectedImage((prev) => {
      if (!prev) return galleryImages[0];
      const stillExists = galleryImages.find((image) => (image._id && prev?._id && image._id === prev._id) || (!image._id && image.url === prev?.url));
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
    return () => { ignore = true; };
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

  const handleMetaChange = (event) => {
    const { name, value } = event.target;
    setMetaDraft((prev) => ({ ...prev, [name]: value }));
  };

  const handleArtworkSelect = (image) => {
    setSelectedImage(image);
    if (!collection) return;
    const rawToken = image?._id || image?.publicId || image?.url || image?.path || image?.secure_url || image?.caption;
    const token = rawToken ? slugifyId(rawToken) : '';
    const nextUrl = token ? `/collection/${handle}/gallery?imageId=${token}` : `/collection/${handle}/gallery`;
    navigate(nextUrl, { state: { selectedImage: image } });
  };

  const handleCompanySelect = (event) => {
    const companyId = event.target.value;
    const company = companies.find((item) => item._id === companyId) || null;
    setSelectedCompany(company);
  };

  const handleModelSelect = (event) => {
    const modelId = event.target.value;
    const model = models.find((item) => item._id === modelId) || null;
    setSelectedModel(model);
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
    const confirmed = window.confirm('Delete this entire collection? This cannot be undone.');
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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-600">Loading collection...</div>
    );
  }

  if (notFound && !isAdmin) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="bg-white rounded-3xl shadow-xl px-10 py-12 max-w-lg">
          <p className="text-3xl font-semibold text-gray-900">Collection not found</p>
          <p className="text-gray-600 mt-3">
            We could not find this collection. Please pick another theme from the library.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            <Link to="/themes" className="px-6 py-3 rounded-full bg-primary-600 text-white font-semibold">Browse Themes</Link>
            <Link to="/" className="px-6 py-3 rounded-full bg-gray-100 text-gray-900 font-semibold">Back home</Link>
          </div>
        </div>
      </div>
    );
  }

  if (notFound && isAdmin) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="flex items-center gap-3 text-gray-500 text-sm uppercase tracking-[0.4em]">
            <FiImage />
            COLLECTOR
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 mt-4">Create a new collection</h1>
          <p className="text-gray-600 mt-2">No collection exists for handle "{handle}". You can create one below.</p>
          <form className="mt-6 space-y-4" onSubmit={handleCreateCollection}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input name="title" value={createDraft.title} onChange={handleCreateChange} className="w-full border rounded-xl px-4 py-2" placeholder="Marble Edition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Handle / URL</label>
              <input name="handle" value={createDraft.handle} onChange={handleCreateChange} className="w-full border rounded-xl px-4 py-2" placeholder="1" />
              <p className="text-xs text-gray-500 mt-1">Full URL: http://localhost:3000/collection/{createDraft.handle || handle}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
              <input name="tagline" value={createDraft.tagline} onChange={handleCreateChange} className="w-full border rounded-xl px-4 py-2" placeholder="Luxury swirls, golden streaks" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" value={createDraft.description} onChange={handleCreateChange} rows={4} className="w-full border rounded-2xl px-4 py-3" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Accent color</label>
              <input type="color" name="accentColor" value={createDraft.accentColor} onChange={handleCreateChange} className="w-24 h-10 rounded" />
            </div>
            <button type="submit" disabled={creating} className="px-6 py-3 rounded-full bg-primary-600 text-white font-semibold">
              {creating ? 'Creating...' : 'Create collection'}
            </button>
          </form>
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

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <div className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex items-center gap-3 text-sm text-gray-500">
          <Link to="/themes" className="flex items-center gap-2 text-primary-600 font-semibold">
            <FiArrowLeft className="h-4 w-4" />
            Themes
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">{collection.title}</span>
        </div>
      </div>

      <section className="w-full px-0 mt-10">
        <div className="space-y-6">
          <div ref={galleryRef} className="bg-white rounded-4xl shadow-xl p-8">
            <p className="uppercase text-xs tracking-[0.4em] text-gray-400">Collection</p>
            {/* <h1 className="text-4xl font-semibold text-gray-900 mt-3">{collection.title}</h1> */}
            {/* {collection.tagline && (
              <p className="text-lg text-gray-600 mt-3">{collection.tagline}</p>
            )} */}
            {/* {collection.description && (
              <p className="text-gray-600 mt-4 leading-relaxed">{collection.description}</p>
            )} */}

            <div className="mt-8">
              <div className="flex items-center justify-between m-10">
                {/* <div>
                  <p className="text-sm text-gray-500 uppercase tracking-[0.4em]">Step 1</p>
                  <h2 className="text-2xl font-semibold text-gray-900">Image board</h2>
                  <p className="text-sm text-gray-500 mt-1">Tap any artwork to move it into the builder below.</p>
                </div> */}
                {isAdmin && (
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer text-sm font-semibold" style={{ borderColor: accent, color: accent }}>
                    <FiUpload />
                    {uploading ? 'Uploading...' : 'Upload images'}
                    <input type="file" className="hidden" multiple accept="image/*" onChange={handleUploadImages} disabled={uploading} />
                  </label>
                )}
              </div>

              {/* Mobile Company & Model Selector */}
             
{/*    start  */}
           {galleryImages.length === 0 ? (
  <div className="border border-dashed rounded-xl p-10 text-center text-gray-500">
    No images yet. {isAdmin ? 'Upload your first shot to bring this page to life.' : 'Please check back soon.'}
  </div>
) : (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full">
    {galleryImages.map((image, index) => {
      const key = image._id || image.publicId || image.url;

      const tileSrc = resolveImageUrl(
        image.url ||
        image.secure_url ||
        image.path ||
        image.publicUrl ||
        ''
      );

      const isChosen =
        selectedImage &&
        ((image._id && selectedImage._id === image._id) ||
          (!image._id && selectedImage.url === image.url));

      return (
        <button
          key={key}
          type="button"
          onClick={() => handleArtworkSelect(image)}
          className={`relative group rounded-2xl overflow-hidden border transition
            ${isChosen
              ? 'border-primary-500 ring-2 ring-primary-200'
              : 'border-gray-200 hover:border-primary-300'}
          `}
        >
          <div className="relative w-full aspect-[3/4] bg-gray-50">

            {/* Image */}
            <div className="absolute inset-0 flex items-center justify-center p-2">
              <img
                src={tileSrc}
                alt={image.caption || collection.title}
                className="max-w-full max-h-full object-contain"
                loading="lazy"
              />
            </div>

            {/* Selected badge */}
            {isChosen && (
              <span className="absolute top-3 left-3 flex items-center gap-1
                               bg-white/90 text-primary-600 text-xs font-semibold
                               px-3 py-1 rounded-full">
                <FiCheckCircle className="h-4 w-4" />
                Selected
              </span>
            )}

            {/* Mobile Company & Model Badge */}
            {selectedCompany && selectedModel && (
              <span className="absolute top-3 right-3 flex items-center gap-1
                               bg-primary-600 text-white text-xs font-medium
                               px-2 py-1 rounded-full shadow-sm">
                <FiSmartphone className="h-3 w-3" />
                {selectedCompany.name}
              </span>
            )}

            {/* 🔢 Bottom unique number */}
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2
                             bg-black/80 text-white text-xs font-semibold
                             px-3 py-1 rounded-full">
              {String(index + 1).padStart(2, '0')}
            </span>

            {/* Caption with model info */}
            {(image.caption || (selectedCompany && selectedModel)) && (
              <div className="absolute bottom-10 left-2 right-2">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-center">
                  {image.caption && (
                    <p className="text-xs font-medium text-gray-800 truncate">{image.caption}</p>
                  )}
                  {selectedCompany && selectedModel && (
                    <p className="text-xs text-gray-600 truncate">{selectedModel.name}</p>
                  )}
                </div>
              </div>
            )}

            {/* Delete button (admin only) */}
            {isAdmin && (
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage(image._id);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemoveImage(image._id);
                  }
                }}
                className="absolute top-10 right-3 bg-white/90 rounded-full p-2
                           text-red-600 shadow opacity-0
                           group-hover:opacity-100 transition"
                title="Delete image"
              >
                <FiTrash2 />
              </span>
            )}

          </div>
        </button>
      );
    })}
  </div>
)}

{/*    end  */}





            </div>
          </div>




        </div>

        {isAdmin && (
          <aside className="bg-white rounded-4xl shadow-xl p-6 space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Admin tools</p>
              <h3 className="text-xl font-semibold text-gray-900 mt-2">Collection settings</h3>
            </div>
            <form className="space-y-4" onSubmit={handleMetaSave}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input name="title" value={metaDraft.title} onChange={handleMetaChange} className="w-full border rounded-xl px-4 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                <input name="tagline" value={metaDraft.tagline} onChange={handleMetaChange} className="w-full border rounded-xl px-4 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" value={metaDraft.description} onChange={handleMetaChange} rows={4} className="w-full border rounded-2xl px-4 py-3" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Accent color</label>
                <input type="color" name="accentColor" value={metaDraft.accentColor} onChange={handleMetaChange} className="w-24 h-10 rounded" />
              </div>
              <button type="submit" className="w-full rounded-full py-3 font-semibold text-white" style={{ backgroundColor: accent }} disabled={savingMeta}>
                {savingMeta ? 'Saving...' : 'Save changes'}
              </button>
            </form>
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-500 mb-2">Danger zone</p>
              <button type="button" onClick={handleDeleteCollection} className="w-full flex items-center justify-center gap-2 rounded-full border border-red-200 text-red-600 py-2 text-sm font-semibold">
                <FiTrash2 /> Delete collection
              </button>
            </div>
          </aside>
        )}
      </section>
    </div>
  );
};

export default CollectionPage;