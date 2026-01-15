import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, lazy, Suspense } from 'react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile, logout } from './redux/slices/authSlice';
import { fetchWishlist } from './redux/slices/wishlistSlice';
import { PageLoader } from './components/Loader';
import { initErrorSuppression } from './utils/errorSuppression';
import { runDevelopmentChecks } from './utils/devChecks';
import ErrorBoundary from './components/ErrorBoundary';

// Layout components - loaded immediately for shell
import Header from './components/Header';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';

// Critical pages - loaded immediately
import Home from './pages/Home';

// Lazy loaded pages - code splitting for faster initial load
const Products = lazy(() => import('./pages/Products'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Themes = lazy(() => import('./pages/Themes'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Login = lazy(() => import('./pages/Login'));
const CustomMobilePage = lazy(() => import('./pages/CustomMobilePage'));
const MobileCoverCustomizer = lazy(() => import('./components/App'));
const MyDesigns = lazy(() => import('./pages/MyDesigns'));
const Orders = lazy(() => import('./pages/Orders'));
const Profile = lazy(() => import('./pages/Profile'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const ThemeDetail = lazy(() => import('./pages/ThemeDetail'));
const Collection = lazy(() => import('./pages/collection.jsx'));
const GalleryImagePage = lazy(() => import('./pages/GalleryImagePage.jsx'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const MobileFrameDesigner = lazy(() => import('./pages/MobileFrameDesigner'));
const TrackOrder = lazy(() => import('./pages/TrackOrder'));

// Support pages - lazy loaded
const ShippingPolicy = lazy(() => import('./pages/ShippingPolicy.jsx'));
const ReturnsAndRefunds = lazy(() => import('./pages/ReturnsAndRefunds.jsx'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy.jsx'));
const TermsConditions = lazy(() => import('./pages/TermsConditions.jsx'));

// Admin pages - lazy loaded (only admins need these)
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/AdminProducts'));
const AdminCustomOrders = lazy(() => import('./pages/AdminCustomOrders'));
const AdminUsers = lazy(() => import('./pages/AdminUsers'));
const AdminMobileManagement = lazy(() => import('./pages/AdminMobileManagement'));
const AdminThemes = lazy(() => import('./pages/AdminThemes'));
const AdminShipments = lazy(() => import('./pages/AdminShipments'));
const CustomOrders = lazy(() => import('./pages/CustomOrders'));

// Protected route wrapper
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Suspense wrapper for lazy components
const LazyPage = ({ children }) => (
  <Suspense fallback={<PageLoader />}>
    {children}
  </Suspense>
);

function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  // Initialize error suppression on app start
  useEffect(() => {
    initErrorSuppression();
    runDevelopmentChecks();
  }, []);

  // On first mount, if a token exists but user isn't loaded yet, fetch profile
  useEffect(() => {
    if (token && !user) {
      dispatch(getUserProfile());
    }
    // when user is available, load wishlist
    if (token && user) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, token, user]);

  // Listen for unauthorized events (e.g., token expired)
  useEffect(() => {
    const handleUnauthorized = () => {
      dispatch(logout());
    };

    window.addEventListener('app:unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('app:unauthorized', handleUnauthorized);
    };
  }, [dispatch]);

  // If we have a token but are still loading the user profile, show a full-page loader
  if (token && loading && !user) {
    return <PageLoader />;
  }

  const Layout = () => (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-16 pb-16 md:pb-0">
          <Outlet />
        </main>
        <Footer />
        <BottomNav />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </ErrorBoundary>
  );

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: 'products', element: <LazyPage><Products /></LazyPage> },
        { path: 'products/:id', element: <LazyPage><ProductDetails /></LazyPage> },
        { path: 'themes', element: <LazyPage><Themes /></LazyPage> },
        { path: 'themes/:slug', element: <LazyPage><ThemeDetail /></LazyPage> },
        { path: 'theme', element: <Navigate to="/themes" replace /> },
        { path: 'collection/:handle', element: <LazyPage><Collection /></LazyPage> },
        { path: 'collection/:handle/gallery', element: <LazyPage><GalleryImagePage /></LazyPage> },
        { path: 'track-order', element: <LazyPage><TrackOrder /></LazyPage> },

// Support pages
        { path: 'privacy-policy', element: <LazyPage><PrivacyPolicy /></LazyPage> },
        { path: 'terms-conditions', element: <LazyPage><TermsConditions /></LazyPage> },
        { path: 'returns-refunds', element: <LazyPage><ReturnsAndRefunds /></LazyPage> },
        { path: 'shipping-policy', element: <LazyPage><ShippingPolicy /></LazyPage> },


        { path: 'cart', element: <LazyPage><Cart /></LazyPage> },
        { path: 'login', element: <LazyPage><Login /></LazyPage> },
        { path: 'register', element: <Navigate to="/" replace /> },
        { path: 'customizer', element: <LazyPage><CustomMobilePage /></LazyPage> },
        { path: 'customizer/:slug', element: <LazyPage><CustomMobilePage /></LazyPage> },
        { path: 'custom-mobile', element: <LazyPage><CustomMobilePage /></LazyPage> },
        { path: 'custom-mobile/:slug', element: <LazyPage><CustomMobilePage /></LazyPage> },
        { path: 'mobile-frame-designer', element: <LazyPage><MobileFrameDesigner /></LazyPage> },
        { path: 'order-success/:id', element: <LazyPage><OrderSuccess /></LazyPage> },

        { path: 'checkout', element: <LazyPage><Checkout /></LazyPage> },
        { path: 'profile', element: (
          <ProtectedRoute>
            <LazyPage><Profile /></LazyPage>
          </ProtectedRoute>
        ) },
        { path: 'orders', element: (
          <ProtectedRoute>
            <LazyPage><Orders /></LazyPage>
          </ProtectedRoute>
        ) },
        { path: 'wishlist', element: (
          <ProtectedRoute>
            <LazyPage><Wishlist /></LazyPage>
          </ProtectedRoute>
        ) },
        { path: 'my-designs', element: (
          <ProtectedRoute>
            <LazyPage><MyDesigns /></LazyPage>
          </ProtectedRoute>
        ) },
        { path: 'custom-designs', element: (
          <ProtectedRoute>
            <LazyPage><MyDesigns /></LazyPage>
          </ProtectedRoute>
        ) },

        { path: 'admin', element: (
          <AdminRoute>
            <LazyPage><AdminDashboard /></LazyPage>
          </AdminRoute>
        ) },
        { path: 'admin/products', element: (
          <AdminRoute>
            <LazyPage><AdminProducts /></LazyPage>
          </AdminRoute>
        ) },
        { path: 'admin/mobile/:type?', element: (
          <AdminRoute>
            <LazyPage><AdminMobileManagement /></LazyPage>
          </AdminRoute>
        ) },
        { path: 'admin/themes', element: (
          <AdminRoute>
            <LazyPage><AdminThemes /></LazyPage>
          </AdminRoute>
        ) },
        { path: 'admin/users', element: (
          <AdminRoute>
            <LazyPage><AdminUsers /></LazyPage>
          </AdminRoute>
        ) },
        { path: 'admin/custom-orders', element: (
          <AdminRoute>
            <LazyPage><AdminCustomOrders /></LazyPage>
          </AdminRoute>
        ) },
        { path: 'admin/shipments', element: (
          <AdminRoute>
            <LazyPage><AdminShipments /></LazyPage>
          </AdminRoute>
        ) },
        { path: 'custom-orders', element: (
          <ProtectedRoute>
            <LazyPage><CustomOrders /></LazyPage>
          </ProtectedRoute>
        ) },
      ],
    },
  ]);

  return (
    <RouterProvider router={router} future={{ v7_startTransition: true, v7_relativeSplatPath: true }} />
  );
}

export default App;