import { Navigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute({ children, allowedRoles }) {
  const { userRole, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // If not authorized for this role, bounce back to their standard layout
    if (userRole === 'farmer') return <Navigate to="/farmer/dashboard" replace />;
    if (userRole === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (userRole === 'buyer') return <Navigate to="/buyer/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
}
