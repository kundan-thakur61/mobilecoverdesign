import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from './Loader';

// Guest-only mode - no authentication required
const ProtectedRoute = ({ children }) => {
  const { loading } = useSelector((state) => state.auth);

  if (loading) {
    return <Loader />;
  }

  // Allow all access without login
  return children;
};

export default ProtectedRoute;