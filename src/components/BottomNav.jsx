import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiHome, FiPackage, FiImage, FiEdit3, FiShoppingCart, FiGrid } from 'react-icons/fi';
import { selectCartItemCount } from '../redux/slices/cartSlice';

const BottomNav = () => {
  const location = useLocation();
  const cartItemCount = useSelector(selectCartItemCount);

  const navItems = [
    {
      to: '/',
      icon: FiHome,
      label: 'Home',
      active: location.pathname === '/',
    },
    {
      to: '/products',
      icon: FiPackage,
      label: 'Products',
      active: location.pathname === '/products',
    },
    {
      to: '/themes',
      icon: FiGrid,
      label: 'Themes',
      active: location.pathname === '/themes',
    },
    {
      to: '/customizer',
      icon: FiEdit3,
      label: 'Customize',
      active: location.pathname === '/customizer',
    },
    {
      to: '/cart',
      icon: FiShoppingCart,
      label: 'Cart',
      active: location.pathname === '/cart',
      badge: cartItemCount > 0 ? cartItemCount : null,
    },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center flex-1 py-2 px-1 rounded-lg transition-colors ${
                item.active
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
              }`}
              aria-label={item.label}
            >
              <div className="relative">
                <Icon className="w-5 h-5" aria-hidden="true" />
                {item.badge && (
                  <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
