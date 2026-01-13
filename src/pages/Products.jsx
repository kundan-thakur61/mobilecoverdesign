import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts, setFilters, clearFilters, setSortBy, setPage } from '../redux/slices/productSlice';
import { FiFilter, FiSearch, FiX, FiGrid, FiList } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import Loader, { CardSkeleton } from '../components/Loader';
import SEO from '../components/SEO';

const Products = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading, error, pagination, filters, sortBy } = useSelector((state) => state.products);

  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  // Initialize filters from URL params
  useEffect(() => {
    const urlFilters = {
      brand: searchParams.get('brand') || '',
      model: searchParams.get('model') || '',
      category: searchParams.get('category') || '',
      search: searchParams.get('search') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      inStock: searchParams.get('inStock') !== 'false',
    };
    dispatch(setFilters(urlFilters));
    dispatch(setSortBy(searchParams.get('sortBy') || '-createdAt'));
    dispatch(setPage(parseInt(searchParams.get('page')) || 1));
  }, [dispatch, searchParams]);

  // Fetch products when filters change
  useEffect(() => {
    const params = {
      ...filters,
      sortBy,
      page: pagination.currentPage,
      limit: 12,
    };
    dispatch(fetchProducts(params));
  }, [dispatch, filters, sortBy, pagination.currentPage]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    dispatch(setFilters(newFilters));

    // Update URL params
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const handleSortChange = (value) => {
    dispatch(setSortBy(value));
    const params = new URLSearchParams(searchParams);
    params.set('sortBy', value);
    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    dispatch(setPage(page));
    const params = new URLSearchParams(searchParams);
    params.set('page', page);
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    handleFilterChange('search', searchQuery);
  };

  const clearAllFilters = () => {
    dispatch(clearFilters());
    setSearchQuery('');
    setSearchParams({});
  };

  const activeFiltersCount = Object.values(filters).filter(value =>
    value !== '' && value !== null && value !== undefined && value !== false
  ).length;

  // Dynamic SEO based on category
  const getCategorySEO = () => {
    const category = filters.category;
    const brand = filters.brand;

    if (category === 'Customizable' || brand === 'Custom') {
      return {
        title: "Custom Mobile Covers Online India | Design Your Own Phone Case | CoverGhar.in",
        description: "Create custom mobile covers online in India. Design personalized phone cases with photos, text, and patterns. Premium quality custom covers for all models.",
        keywords: "custom mobile cover, personalized mobile covers, design your own phone case, custom phone covers online India"
      };
    } else if (brand === 'Apple' || category === 'iPhone') {
      return {
        title: "iPhone Mobile Covers Online India | Custom iPhone Cases | CoverGhar.in",
        description: "Buy iPhone mobile covers online in India. Custom iPhone cases for iPhone 15, 14, 13, SE. Premium protection with personalized designs.",
        keywords: "iPhone mobile cover, iPhone cases online India, custom iPhone covers, iPhone 15 cover"
      };
    } else if (brand === 'Samsung') {
      return {
        title: "Samsung Mobile Covers Online India | Galaxy Phone Cases | CoverGhar.in",
        description: "Premium Samsung mobile covers online in India. Custom Galaxy S, A, Note series cases. Designer covers for Samsung smartphones.",
        keywords: "Samsung mobile cover, Galaxy phone cases, Samsung covers online India, custom Samsung cases"
      };
    } else if (category === 'Designer' || category === 'Anime') {
      return {
        title: "Designer Mobile Covers Online India | Anime & Pop Culture Cases | CoverGhar.in",
        description: "Buy designer mobile covers online in India. Anime-inspired cases, pop culture designs, artistic patterns. Premium quality designer phone covers.",
        keywords: "designer mobile covers, anime mobile covers, pop culture phone cases, artistic mobile covers"
      };
    } else {
      return {
        title: "Mobile Covers Online India | Custom Phone Cases | CoverGhar.in",
        description: "Buy mobile covers online in India. Custom phone cases, designer covers for iPhone, Samsung & more. Premium quality, fast shipping.",
        keywords: "mobile cover online India, phone cases online, custom mobile covers, designer phone covers"
      };
    }
  };

  const categorySEO = getCategorySEO();

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": categorySEO.title,
    "description": categorySEO.description
  };

  return (
    <>
      <SEO
        title={categorySEO.title}
        description={categorySEO.description}
        keywords={categorySEO.keywords}
        url={`/products${searchParams.toString() ? `?${searchParams.toString()}` : ''}`}
        schema={productSchema}
      />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
          <p className="text-gray-600">Discover our collection of custom mobile covers</p>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </form>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="-createdAt">Newest</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="-rating.average">Highest Rated</option>
              </select>
            </div>

            {/* View Mode */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <FiGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <FiList className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                showFilters ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FiFilter className="w-5 h-5" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Brand Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                  <select
                    value={filters.brand}
                    onChange={(e) => handleFilterChange('brand', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">All Brands</option>
                    <option value="Samsung">Samsung</option>
                    <option value="Apple">Apple</option>
                    <option value="OnePlus">OnePlus</option>
                    <option value="Google">Google</option>
                    <option value="Xiaomi">Xiaomi</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    <option value="Customizable">Customizable</option>
                    <option value="Designer">Designer</option>
                    <option value="Basic">Basic</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                  <input
                    type="number"
                    placeholder="5000"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={clearAllFilters}
                    className="flex items-center space-x-2 text-sm text-red-600 hover:text-red-800"
                  >
                    <FiX className="w-4 h-4" />
                    <span>Clear all filters</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {products.length} of {pagination.totalProducts} products
          </p>
        </div>

        {/* Category SEO Content */}
        {filters.category && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="prose max-w-none">
              {filters.category === 'Customizable' && (
                <>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Custom Mobile Covers - Design Your Own Phone Case</h2>
                  <p className="text-gray-700 mb-4">
                    Create personalized mobile covers with your favorite photos, text, and designs. Our custom phone cases are made with premium materials and advanced UV printing technology for vibrant, long-lasting prints. Perfect for gifts or personal use, design your unique mobile cover in minutes and get it delivered across India.
                  </p>
                  <p className="text-gray-700">
                    Choose from various case types including slim cases, rugged protection, and transparent covers. All custom covers come with precise cutouts for buttons and ports, ensuring full functionality while showcasing your design. Upload high-resolution images for best results and preview your design before ordering.
                  </p>
                </>
              )}
              {filters.category === 'Designer' && (
                <>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Designer Mobile Covers - Premium Artistic Phone Cases</h2>
                  <p className="text-gray-700 mb-4">
                    Explore our curated collection of designer mobile covers featuring exclusive artwork, trending patterns, and artistic designs. From minimalist aesthetics to bold statements, our designer phone cases combine style with protection. Each design is carefully crafted to complement your personality and lifestyle.
                  </p>
                  <p className="text-gray-700">
                    Our designer collection includes anime-inspired covers, abstract art, nature themes, and pop culture references. All covers feature high-quality printing with scratch-resistant coating and raised edges for screen protection. Stand out with unique designs that aren't available anywhere else.
                  </p>
                </>
              )}
              {(filters.brand === 'Apple' || filters.category === 'iPhone') && (
                <>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">iPhone Mobile Covers - Premium Cases for Apple Devices</h2>
                  <p className="text-gray-700 mb-4">
                    Protect your iPhone with our premium mobile covers designed specifically for Apple devices. Available for iPhone 15, 14, 13, 12, SE, and older models. Our iPhone cases feature precise cutouts, wireless charging compatibility, and slim profiles that maintain the elegant design of your device.
                  </p>
                  <p className="text-gray-700">
                    Choose from clear cases to showcase your iPhone's original color, or opt for custom designs with photos and artwork. All iPhone covers include raised bezels for camera and screen protection, anti-slip grip, and shock-absorbing corners for drop protection.
                  </p>
                </>
              )}
              {filters.brand === 'Samsung' && (
                <>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Samsung Mobile Covers - Galaxy Phone Cases Online</h2>
                  <p className="text-gray-700 mb-4">
                    Find the perfect mobile cover for your Samsung Galaxy smartphone. We offer cases for Galaxy S series, A series, M series, and Note devices. Our Samsung covers provide excellent protection while maintaining the sleek design of your phone. Available in various styles from slim to rugged protection.
                  </p>
                  <p className="text-gray-700">
                    All Samsung cases feature precise button cutouts, support for wireless charging, and military-grade drop protection. Choose from transparent, matte, or glossy finishes, or create your own custom design with personal photos and text.
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <CardSkeleton count={12} />
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Error loading products: {error}</p>
            <button
              onClick={() => dispatch(fetchProducts({ ...filters, sortBy, page: pagination.currentPage, limit: 12 }))}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
            >
              Try Again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No products found matching your criteria.</p>
            <button
              onClick={clearAllFilters}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1'
          }`}>
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 rounded-lg border ${
                    page === pagination.currentPage
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
                className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Products;
