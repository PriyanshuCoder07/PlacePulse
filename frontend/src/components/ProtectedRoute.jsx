import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, dbUser } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (adminOnly && !dbUser?.isAdmin) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;