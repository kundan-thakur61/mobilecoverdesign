import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Loader from './Loader';
import { loadAdminReducers } from '../redux/store';

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  const [reducersLoaded, setReducersLoaded] = useState(false);

  // Lazy-load admin redux slices only when an admin visits admin pages
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin' && !reducersLoaded) {
      loadAdminReducers().then(() => setReducersLoaded(true));
    }
  }, [isAuthenticated, user, reducersLoaded]);

  if (loading || (isAuthenticated && user?.role === 'admin' && !reducersLoaded)) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  

  return children;
};

export default AdminRoute;