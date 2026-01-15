import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch, FiHeart, FiTruck } from 'react-icons/fi';
import { logout } from '../redux/slices/authSlice';
import { selectCartItemCount } from '../redux/slices/cartSlice';
import { selectWishlistCount } from '../redux/slices/wishlistSlice';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const cartItemCount = useSelector(selectCartItemCount);
  const wishlistCount = useSelector(selectWishlistCount);

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsMenuOpen(false);
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden" 
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
      
      <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo - SEO Optimized */}
            <Link 
              to="/" 
              className="flex items-center gap-2" 
              onClick={closeMenu}
              aria-label="CoverGhar - Custom Mobile Covers Home"
            >
              <img
                src="/logo.png"
                alt="CoverGhar Logo - Custom Mobile Covers India"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg"
                width="40"
                height="40"
              />
              <span className="text-lg sm:text-xl font-bold text-gray-900">
                COVER GHAR
              </span>
            </Link>

            {/* Desktop Navigation - SEO Optimized */}
            <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                aria-label="Home - Custom Mobile Covers"
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                aria-label="Browse All Mobile Covers"
              >
                Products
              </Link>
              <Link 
                to="/themes" 
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                aria-label="Designer Mobile Cover Themes"
              >
                Themes
              </Link>
              <Link 
                to="/customizer" 
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                aria-label="Design Custom Mobile Cover"
              >
                Customize
              </Link>
              {isAuthenticated && (
                <Link 
                  to="/my-designs" 
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                  aria-label="My Saved Designs"
                >
                  My Designs
                </Link>
              )}
            </nav>

            {/* Search Bar - SEO Optimized */}
            <form 
              onSubmit={handleSearch} 
              className="hidden md:flex items-center flex-1 max-w-md mx-8"
              role="search"
              aria-label="Search mobile covers"
            >
              <div className="relative w-full">
                <label htmlFor="desktop-search" className="sr-only">
                  Search mobile covers
                </label>
                <input
                  id="desktop-search"
                  type="search"
                  placeholder="Search mobile covers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  aria-label="Search for mobile covers by brand, model, or design"
                />
                <FiSearch className="absolute left-3 top-2.5 text-gray-400" aria-hidden="true" />
              </div>
            </form>

            {/* User Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Track Order */}
              <Link 
                to="/track-order" 
                className="p-1.5 sm:p-2 text-gray-700 hover:text-primary-600 transition-colors hidden sm:block" 
                onClick={closeMenu}
                aria-label="Track your order"
                title="Track Order"
              >
                <FiTruck className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
              </Link>

              {/* Cart */}
              <Link 
                to="/cart" 
                className="relative p-1.5 sm:p-2 text-gray-700 hover:text-primary-600 transition-colors" 
                onClick={closeMenu}
                aria-label={`Shopping cart with ${cartItemCount} items`}
              >
                <FiShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
                {cartItemCount > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-semibold"
                    aria-label={`${cartItemCount} items in cart`}
                  >
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* Wishlist */}
              <Link 
                to="/wishlist" 
                className="relative p-1.5 sm:p-2 text-gray-700 hover:text-primary-600 hidden sm:block transition-colors" 
                onClick={closeMenu}
                aria-label={`Wishlist with ${wishlistCount} items`}
              >
                <FiHeart className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
                {wishlistCount > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-semibold"
                    aria-label={`${wishlistCount} items in wishlist`}
                  >
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative group hidden md:block">
                  <button 
                    className="flex items-center space-x-2 p-2 text-gray-700 hover:text-primary-600 transition-colors"
                    aria-label="User account menu"
                    aria-haspopup="true"
                  >
                    <FiUser className="w-6 h-6" aria-hidden="true" />
                    <span className="hidden md:block text-sm font-medium">
                      {user?.name || 'Account'}
                    </span>
                  </button>
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                    role="menu"
                    aria-label="User menu"
                  >
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg transition-colors"
                      role="menuitem"
                    >
                      Profile
                    </Link>
                    <Link 
                      to="/orders" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      role="menuitem"
                    >
                      Orders
                    </Link>
                    <Link 
                      to="/my-designs" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      role="menuitem"
                    >
                      My Designs
                    </Link>
                    {user?.role === 'admin' && (
                      <Link 
                        to="/admin" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        role="menuitem"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg transition-colors"
                      role="menuitem"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                /* Guest mode - no login buttons */
                null
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-700 hover:text-primary-600 transition-colors"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMenuOpen ? (
                  <FiX className="w-6 h-6" aria-hidden="true" />
                ) : (
                  <FiMenu className="w-6 h-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div 
              id="mobile-menu"
              className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg"
              role="navigation"
              aria-label="Mobile navigation"
            >
              <nav className="flex flex-col py-2">
                <Link 
                  to="/" 
                  className="px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600 font-medium active:bg-gray-100 transition-colors" 
                  onClick={closeMenu}
                >
                  Home
                </Link>
                <Link 
                  to="/products" 
                  className="px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600 font-medium active:bg-gray-100 transition-colors" 
                  onClick={closeMenu}
                >
                  Products
                </Link>
                <Link 
                  to="/themes" 
                  className="px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600 font-medium active:bg-gray-100 transition-colors" 
                  onClick={closeMenu}
                >
                  Themes
                </Link>
                <Link 
                  to="/customizer" 
                  className="px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600 font-medium active:bg-gray-100 transition-colors" 
                  onClick={closeMenu}
                >
                  Customize
                </Link>
                <Link 
                  to="/track-order" 
                  className="px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600 font-medium active:bg-gray-100 transition-colors flex items-center gap-2" 
                  onClick={closeMenu}
                >
                  <FiTruck className="w-5 h-5" aria-hidden="true" />
                  Track Order
                </Link>

                {isAuthenticated && (
                  <>
                    <Link 
                      to="/my-designs" 
                      className="px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600 font-medium active:bg-gray-100 transition-colors" 
                      onClick={closeMenu}
                    >
                      My Designs
                    </Link>
                    <Link 
                      to="/wishlist" 
                      className="px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600 font-medium active:bg-gray-100 flex items-center justify-between transition-colors" 
                      onClick={closeMenu}
                    >
                      <span>Wishlist</span>
                      {wishlistCount > 0 && (
                        <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-0.5 font-semibold">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>
                    <Link 
                      to="/profile" 
                      className="px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600 font-medium active:bg-gray-100 transition-colors" 
                      onClick={closeMenu}
                    >
                      Profile
                    </Link>
                    <Link 
                      to="/orders" 
                      className="px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600 font-medium active:bg-gray-100 transition-colors" 
                      onClick={closeMenu}
                    >
                      Orders
                    </Link>
                    {user?.role === 'admin' && (
                      <Link 
                        to="/admin" 
                        className="px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600 font-medium active:bg-gray-100 transition-colors" 
                        onClick={closeMenu}
                      >
                        Admin Panel
                      </Link>
                    )}
                  </>
                )}
                
                {/* Mobile Search */}
                <form 
                  onSubmit={handleSearch} 
                  className="px-4 py-3 border-t border-gray-100"
                  role="search"
                >
                  <label htmlFor="mobile-search" className="sr-only">
                    Search mobile covers
                  </label>
                  <div className="relative">
                    <input
                      id="mobile-search"
                      type="search"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <FiSearch className="absolute left-3 top-3 text-gray-400" aria-hidden="true" />
                  </div>
                </form>

                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="mx-4 mt-2 mb-3 px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium active:bg-red-200 transition-colors"
                  >
                    Logout
                  </button>
                ) : (
                  /* Guest mode - no login buttons */
                  null
                )}
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;