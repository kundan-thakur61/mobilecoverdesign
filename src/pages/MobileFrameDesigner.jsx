import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  FiX, 
  FiUpload, 
  FiZoomIn, 
  FiZoomOut, 
  FiRefreshCw,
  FiSearch,
  FiFilter,
  FiHeart,
  FiDownload,
  FiShare2,
  FiGrid,
  FiList,
  FiChevronLeft,
  FiChevronRight,
  FiStar,
  FiTrendingUp,
  FiClock,
  FiEdit,
  FiTrash2,
  FiCopy,
  FiEye,
  FiCheckCircle,
  FiAlertCircle,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import mobileAPI from '../api/mobileAPI';
import MobileFrameMockup from '../components/MobileFrameMockup';
import Loader from '../components/Loader';
import SEO from '../components/SEO';

// Design History Item Component
const DesignHistoryItem = ({ design, onLoad, onDelete, onDuplicate }) => {
  return (
    <div className="border border-gray-200 rounded-xl p-4 hover:border-primary-500 transition-colors">
      <div className="aspect-[9/16] bg-gray-100 rounded-lg mb-3 overflow-hidden">
        <img 
          src={design.thumbnail} 
          alt={design.name}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="font-semibold text-gray-900 truncate mb-1">{design.name}</h3>
      <p className="text-xs text-gray-500 mb-3">
        {new Date(design.timestamp).toLocaleDateString()}
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onLoad(design)}
          className="flex-1 px-3 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700"
        >
          Load
        </button>
        <button
          onClick={() => onDuplicate(design)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
          title="Duplicate"
        >
          <FiCopy />
        </button>
        <button
          onClick={() => onDelete(design.id)}
          className="px-3 py-2 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50"
          title="Delete"
        >
          <FiTrash2 />
        </button>
      </div>
    </div>
  );
};

// Company Card Component
const CompanyCard = ({ company, isSelected, onClick, modelCount, isFavorite, onToggleFavorite }) => {
  return (
    <button
      onClick={onClick}
      className={`border rounded-xl p-4 text-left transition-all ${
        isSelected
          ? 'border-primary-500 bg-primary-50 shadow-md'
          : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <div className="font-semibold text-gray-900">{company.name}</div>
          <div className="text-sm text-gray-500 mt-1">
            {modelCount} model{modelCount !== 1 ? 's' : ''}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(company._id);
          }}
          className="p-1 hover:bg-white rounded-lg transition-colors"
        >
          <FiHeart 
            className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
          />
        </button>
      </div>
      {company.popularModels && (
        <div className="flex items-center gap-1 text-xs text-primary-600 mt-2">
          <FiTrendingUp className="w-3 h-3" />
          <span>Popular</span>
        </div>
      )}
    </button>
  );
};

// Model Card Component
const ModelCard = ({ model, isSelected, onClick, isFavorite, onToggleFavorite }) => {
  const frameCount = model.images?.length || 0;
  
  return (
    <button
      onClick={onClick}
      className={`border rounded-xl p-4 text-left transition-all ${
        isSelected
          ? 'border-primary-500 bg-primary-50 shadow-md'
          : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <div className="font-semibold text-gray-900">{model.name}</div>
          <div className="text-sm text-gray-500 mt-1">
            {frameCount} frame{frameCount !== 1 ? 's' : ''} available
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(model._id);
          }}
          className="p-1 hover:bg-white rounded-lg transition-colors"
        >
          <FiHeart 
            className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
          />
        </button>
      </div>
      
      {frameCount > 0 && (
        <div className="mt-3">
          <div className="flex gap-1">
            {model.images.slice(0, 3).map((img, idx) => (
              <div key={idx} className="w-8 h-12 bg-gray-200 rounded border border-gray-300 overflow-hidden">
                <img 
                  src={typeof img === 'string' ? img : img.url} 
                  alt="" 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {frameCount > 3 && (
              <div className="w-8 h-12 bg-gray-100 rounded border border-gray-300 flex items-center justify-center text-xs text-gray-600">
                +{frameCount - 3}
              </div>
            )}
          </div>
        </div>
      )}
    </button>
  );
};

// Main Component
const MobileFrameDesigner = () => {
  // State management
  const [companies, setCompanies] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [loadingModels, setLoadingModels] = useState(false);
  const [activeTab, setActiveTab] = useState('design');
  
  // Advanced features state
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('name'); // 'name', 'popular', 'recent'
  const [filterBy, setFilterBy] = useState('all'); // 'all', 'favorites', 'recent'
  const [favorites, setFavorites] = useState({ companies: [], models: [] });
  const [designHistory, setDesignHistory] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [currentDesign, setCurrentDesign] = useState(null);
  const [quickPreview, setQuickPreview] = useState(null);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState([]);
  const [stats, setStats] = useState({
    totalDesigns: 0,
    favoriteCompanies: 0,
    favoriteModels: 0,
  });

  // Load saved data from localStorage
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('frameDesignerFavorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }

      const savedHistory = localStorage.getItem('frameDesignerHistory');
      if (savedHistory) {
        setDesignHistory(JSON.parse(savedHistory));
      }

      const savedRecent = localStorage.getItem('frameDesignerRecent');
      if (savedRecent) {
        setRecentlyViewed(JSON.parse(savedRecent));
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  }, []);

  // Update stats
  useEffect(() => {
    setStats({
      totalDesigns: designHistory.length,
      favoriteCompanies: favorites.companies.length,
      favoriteModels: favorites.models.length,
    });
  }, [designHistory, favorites]);

  // Fetch companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoadingCompanies(true);
        const response = await mobileAPI.getCompanies({ limit: 100 });
        const items = response?.data?.data?.companies || [];
        setCompanies(items);
      } catch (error) {
        console.error('Error fetching companies:', error);
        toast.error('Failed to load companies');
        setCompanies([]);
      } finally {
        setLoadingCompanies(false);
      }
    };

    fetchCompanies();
  }, []);

  // Fetch models when company changes
  useEffect(() => {
    if (!selectedCompany) {
      setModels([]);
      setSelectedModel(null);
      return;
    }

    const fetchModels = async () => {
      try {
        setLoadingModels(true);
        const response = await mobileAPI.getModels({ 
          company: selectedCompany._id, 
          limit: 200 
        });
        const fetchedModels = response?.data?.data?.models || [];
        setModels(fetchedModels);
        
        // Auto-select first model if available
        if (fetchedModels.length > 0 && !selectedModel) {
          setSelectedModel(fetchedModels[0]);
        }
      } catch (error) {
        console.error('Error fetching models:', error);
        toast.error('Failed to load models');
        setModels([]);
        setSelectedModel(null);
      } finally {
        setLoadingModels(false);
      }
    };

    fetchModels();
  }, [selectedCompany]);

  // Filter and sort companies
  const filteredCompanies = useMemo(() => {
    let filtered = [...companies];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(company =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Favorites filter
    if (filterBy === 'favorites') {
      filtered = filtered.filter(company => 
        favorites.companies.includes(company._id)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'popular':
          // Prioritize companies with more models
          const aModels = models.filter(m => m.company._id === a._id).length;
          const bModels = models.filter(m => m.company._id === b._id).length;
          return bModels - aModels;
        default:
          return 0;
      }
    });

    return filtered;
  }, [companies, searchQuery, filterBy, sortBy, favorites, models]);

  // Filter and sort models
  const filteredModels = useMemo(() => {
    let filtered = [...models];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(model =>
        model.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Favorites filter
    if (filterBy === 'favorites') {
      filtered = filtered.filter(model => 
        favorites.models.includes(model._id)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'popular':
          // Prioritize models with more frames
          return (b.images?.length || 0) - (a.images?.length || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [models, searchQuery, filterBy, sortBy, favorites]);

  // Handlers
  const handleCompanySelect = useCallback((company) => {
    setSelectedCompany(company);
    setSelectedModel(null);
    
    // Add to recently viewed
    setRecentlyViewed(prev => {
      const updated = [
        { type: 'company', data: company, timestamp: Date.now() },
        ...prev.filter(item => !(item.type === 'company' && item.data._id === company._id))
      ].slice(0, 10);
      
      localStorage.setItem('frameDesignerRecent', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleModelSelect = useCallback((model) => {
    setSelectedModel(model);
    setActiveTab('design');
    
    // Add to recently viewed
    setRecentlyViewed(prev => {
      const updated = [
        { type: 'model', data: model, timestamp: Date.now() },
        ...prev.filter(item => !(item.type === 'model' && item.data._id === model._id))
      ].slice(0, 10);
      
      localStorage.setItem('frameDesignerRecent', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const toggleFavoriteCompany = useCallback((companyId) => {
    setFavorites(prev => {
      const isCurrentlyFavorite = prev.companies.includes(companyId);
      const updated = {
        ...prev,
        companies: isCurrentlyFavorite
          ? prev.companies.filter(id => id !== companyId)
          : [...prev.companies, companyId]
      };
      
      localStorage.setItem('frameDesignerFavorites', JSON.stringify(updated));
      toast.success(isCurrentlyFavorite ? 'Removed from favorites' : 'Added to favorites');
      return updated;
    });
  }, []);

  const toggleFavoriteModel = useCallback((modelId) => {
    setFavorites(prev => {
      const isCurrentlyFavorite = prev.models.includes(modelId);
      const updated = {
        ...prev,
        models: isCurrentlyFavorite
          ? prev.models.filter(id => id !== modelId)
          : [...prev.models, modelId]
      };
      
      localStorage.setItem('frameDesignerFavorites', JSON.stringify(updated));
      toast.success(isCurrentlyFavorite ? 'Removed from favorites' : 'Added to favorites');
      return updated;
    });
  }, []);

  const handleDesignComplete = useCallback((designData) => {
    const design = {
      id: Date.now(),
      name: `${selectedCompany?.name} ${selectedModel?.name} Design`,
      thumbnail: designData.image,
      company: selectedCompany?.name,
      model: selectedModel?.name,
      timestamp: Date.now(),
      data: designData,
    };

    setDesignHistory(prev => {
      const updated = [design, ...prev].slice(0, 50); // Keep last 50 designs
      localStorage.setItem('frameDesignerHistory', JSON.stringify(updated));
      return updated;
    });

    setCurrentDesign(design);
    toast.success('Design saved successfully!');
  }, [selectedCompany, selectedModel]);

  const handleLoadDesign = useCallback((design) => {
    // Find the company and model
    const company = companies.find(c => c.name === design.company);
    const model = models.find(m => m.name === design.model);
    
    if (company) setSelectedCompany(company);
    if (model) setSelectedModel(model);
    
    setCurrentDesign(design);
    setActiveTab('design');
    toast.success('Design loaded!');
  }, [companies, models]);

  const handleDuplicateDesign = useCallback((design) => {
    const duplicate = {
      ...design,
      id: Date.now(),
      name: `${design.name} (Copy)`,
      timestamp: Date.now(),
    };

    setDesignHistory(prev => {
      const updated = [duplicate, ...prev].slice(0, 50);
      localStorage.setItem('frameDesignerHistory', JSON.stringify(updated));
      return updated;
    });

    toast.success('Design duplicated!');
  }, []);

  const handleDeleteDesign = useCallback((designId) => {
    const confirmed = window.confirm('Are you sure you want to delete this design?');
    if (!confirmed) return;

    setDesignHistory(prev => {
      const updated = prev.filter(d => d.id !== designId);
      localStorage.setItem('frameDesignerHistory', JSON.stringify(updated));
      return updated;
    });

    toast.success('Design deleted');
  }, []);

  const handleExportDesign = useCallback((design) => {
    const dataStr = JSON.stringify(design, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${design.name.replace(/\s+/g, '-')}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Design exported!');
  }, []);

  const handleShareDesign = useCallback(async (design) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: design.name,
          text: `Check out my mobile cover design for ${design.company} ${design.model}!`,
          url: window.location.href,
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          toast.error('Failed to share design');
        }
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  }, []);

  const clearAllHistory = useCallback(() => {
    const confirmed = window.confirm('Are you sure you want to clear all design history?');
    if (!confirmed) return;

    setDesignHistory([]);
    localStorage.removeItem('frameDesignerHistory');
    toast.success('History cleared');
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([]);
    localStorage.removeItem('frameDesignerRecent');
    toast.success('Recently viewed cleared');
  }, []);

  const toggleComparisonMode = useCallback(() => {
    setComparisonMode(prev => !prev);
    setSelectedForComparison([]);
    toast.info(comparisonMode ? 'Comparison mode disabled' : 'Comparison mode enabled - Select up to 4 models to compare');
  }, [comparisonMode]);

  const handleComparisonSelect = useCallback((model) => {
    setSelectedForComparison(prev => {
      if (prev.find(m => m._id === model._id)) {
        return prev.filter(m => m._id !== model._id);
      } else if (prev.length < 4) {
        return [...prev, model];
      } else {
        toast.warning('You can only compare up to 4 models');
        return prev;
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Design Your Custom Mobile Cover Online | CoverGhar Frame Designer"
        description="Use our free Mobile Frame Designer to create custom phone covers. Upload your photo, choose your phone model, and preview your personalized mobile case design."
        keywords="custom mobile cover designer, design phone case online, personalized mobile cover, custom phone case maker, CoverGhar designer"
        url="/design"
        type="website"
      />
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Design Your Custom Mobile Cover</h1>
              <p className="text-sm text-gray-500 mt-1">
                Upload your design and preview it on any phone model
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              {/* Stats */}
              <div className="flex items-center gap-4 px-4 py-2 bg-gray-100 rounded-lg text-sm">
                <div className="flex items-center gap-1">
                  <FiGrid className="w-4 h-4 text-gray-600" />
                  <span className="font-semibold">{stats.totalDesigns}</span>
                  <span className="text-gray-600">designs</span>
                </div>
                <div className="flex items-center gap-1">
                  <FiHeart className="w-4 h-4 text-red-500" />
                  <span className="font-semibold">{stats.favoriteCompanies + stats.favoriteModels}</span>
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                  title="Grid view"
                >
                  <FiGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                  title="List view"
                >
                  <FiList className="w-4 h-4" />
                </button>
              </div>

              {/* History Toggle */}
              <button
                onClick={() => setShowHistoryPanel(!showHistoryPanel)}
                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                  showHistoryPanel
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FiClock className="w-4 h-4" />
                History
              </button>

              {/* Tab Buttons */}
              <button
                onClick={() => setActiveTab('catalog')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === 'catalog'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Catalog
              </button>
              <button
                onClick={() => setActiveTab('design')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === 'design'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                disabled={!selectedModel}
              >
                Designer
              </button>
            </div>
          </div>

          {/* Search and Filter Bar */}
          {activeTab === 'catalog' && (
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="flex-1 relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search companies or models..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="name">Sort by Name</option>
                <option value="popular">Sort by Popular</option>
              </select>

              {/* Filter */}
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Items</option>
                <option value="favorites">Favorites Only</option>
              </select>

              {/* Comparison Toggle */}
              <button
                onClick={toggleComparisonMode}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                  comparisonMode
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {comparisonMode ? 'Compare Mode On' : 'Compare Models'}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* History Sidebar */}
          {showHistoryPanel && (
            <div className="w-80 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Design History</h3>
                  <button
                    onClick={() => setShowHistoryPanel(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                {designHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FiClock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No designs yet</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
                      {designHistory.map((design) => (
                        <DesignHistoryItem
                          key={design.id}
                          design={design}
                          onLoad={handleLoadDesign}
                          onDelete={handleDeleteDesign}
                          onDuplicate={handleDuplicateDesign}
                        />
                      ))}
                    </div>
                    <button
                      onClick={clearAllHistory}
                      className="w-full mt-4 px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50"
                    >
                      Clear All History
                    </button>
                  </>
                )}

                {/* Recently Viewed */}
                {recentlyViewed.length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-sm font-semibold text-gray-700">Recently Viewed</h4>
                      <button
                        onClick={clearRecentlyViewed}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="space-y-2">
                      {recentlyViewed.slice(0, 5).map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            if (item.type === 'company') {
                              handleCompanySelect(item.data);
                              setActiveTab('catalog');
                            } else {
                              handleModelSelect(item.data);
                            }
                          }}
                          className="w-full text-left px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm"
                        >
                          <span className="font-medium">{item.data.name}</span>
                          <span className="text-xs text-gray-500 ml-2">
                            ({item.type})
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1">
            {activeTab === 'catalog' ? (
              <div className="space-y-6">
                {/* Comparison Selection Info */}
                {comparisonMode && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FiCheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-900">
                          Comparison Mode Active
                        </span>
                        <span className="text-sm text-green-700">
                          ({selectedForComparison.length}/4 selected)
                        </span>
                      </div>
                      {selectedForComparison.length >= 2 && (
                        <button
                          onClick={() => {
                            // Here you would implement the comparison view
                            toast.info('Comparison view coming soon!');
                          }}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                        >
                          Compare Selected
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Companies Section */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Mobile Companies</h2>
                      <p className="text-sm text-gray-500 mt-1">
                        {filteredCompanies.length} of {companies.length} companies
                      </p>
                    </div>
                    {selectedCompany && (
                      <button
                        onClick={() => setSelectedCompany(null)}
                        className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                      >
                        <FiX className="w-4 h-4" />
                        Clear selection
                      </button>
                    )}
                  </div>
                  
                  {loadingCompanies ? (
                    <div className="py-12 flex justify-center">
                      <Loader size="lg" />
                    </div>
                  ) : filteredCompanies.length === 0 ? (
                    <div className="text-center py-12">
                      <FiAlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-gray-500">
                        {searchQuery ? 'No companies found matching your search' : 'No companies available'}
                      </p>
                    </div>
                  ) : (
                    <div className={`grid gap-4 ${
                      viewMode === 'grid'
                        ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                        : 'grid-cols-1'
                    }`}>
                      {filteredCompanies.map((company) => (
                        <CompanyCard
                          key={company._id}
                          company={company}
                          isSelected={selectedCompany?._id === company._id}
                          onClick={() => handleCompanySelect(company)}
                          modelCount={models.filter(m => m.company._id === company._id).length}
                          isFavorite={favorites.companies.includes(company._id)}
                          onToggleFavorite={toggleFavoriteCompany}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Models Section */}
                {selectedCompany && (
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                          Models - {selectedCompany.name}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                          {filteredModels.length} of {models.length} models
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedCompany(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {loadingModels ? (
                      <div className="py-12 flex justify-center">
                        <Loader size="lg" />
                      </div>
                    ) : filteredModels.length === 0 ? (
                      <div className="text-center py-12">
                        <FiAlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-gray-500">
                          {searchQuery 
                            ? 'No models found matching your search' 
                            : 'No models available for this company'}
                        </p>
                      </div>
                    ) : (
                      <div className={`grid gap-4 ${
                        viewMode === 'grid'
                          ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                          : 'grid-cols-1'
                      }`}>
                        {filteredModels.map((model) => {
                          const isSelectedForComparison = selectedForComparison.find(m => m._id === model._id);
                          
                          return (
                            <div key={model._id} className="relative">
                              {comparisonMode && (
                                <div className="absolute top-2 right-2 z-10">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleComparisonSelect(model);
                                    }}
                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                      isSelectedForComparison
                                        ? 'bg-green-600 border-green-600'
                                        : 'bg-white border-gray-300'
                                    }`}
                                  >
                                    {isSelectedForComparison && (
                                      <FiCheckCircle className="w-4 h-4 text-white" />
                                    )}
                                  </button>
                                </div>
                              )}
                              <ModelCard
                                model={model}
                                isSelected={selectedModel?._id === model._id}
                                onClick={() => !comparisonMode && handleModelSelect(model)}
                                isFavorite={favorites.models.includes(model._id)}
                                onToggleFavorite={toggleFavoriteModel}
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Designer Tab */
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Design Your Mobile Cover</h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Use advanced tools to create stunning mobile frame mockups
                      </p>
                    </div>
                  </div>
                  
                  {/* Breadcrumb */}
                  <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-primary-50 rounded-xl">
                    <div className="flex items-center flex-wrap gap-2 text-sm">
                      <button
                        onClick={() => setActiveTab('catalog')}
                        className="text-primary-700 hover:text-primary-900 font-medium"
                      >
                        {selectedCompany ? selectedCompany.name : 'Select Company'}
                      </button>
                      <FiChevronRight className="text-gray-400" />
                      <button
                        onClick={() => setActiveTab('catalog')}
                        className="text-primary-700 hover:text-primary-900 font-medium"
                      >
                        {selectedModel ? selectedModel.name : 'Select Model'}
                      </button>
                      <FiChevronRight className="text-gray-400" />
                      <span className="text-gray-600 font-medium">Frame Designer</span>
                    </div>
                  </div>

                  {/* Designer Area */}
                  {selectedModel ? (
                    <div className="space-y-4">
                      {/* Action Buttons */}
                      <div className="flex gap-3 justify-end">
                        {currentDesign && (
                          <>
                            <button
                              onClick={() => handleExportDesign(currentDesign)}
                              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2"
                            >
                              <FiDownload className="w-4 h-4" />
                              Export
                            </button>
                            <button
                              onClick={() => handleShareDesign(currentDesign)}
                              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2"
                            >
                              <FiShare2 className="w-4 h-4" />
                              Share
                            </button>
                          </>
                        )}
                      </div>

                      {/* Mockup Component */}
                      <MobileFrameMockup 
                        selectedModel={selectedModel}
                        onDesignComplete={handleDesignComplete}
                      />
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <FiSmartphone className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500 mb-6">
                        Please select a company and model from the catalog first
                      </p>
                      <button
                        onClick={() => setActiveTab('catalog')}
                        className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 inline-flex items-center gap-2"
                      >
                        <FiGrid className="w-4 h-4" />
                        Browse Catalog
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MobileFrameDesigner;