import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * ProtectedRoute Component
 * Protects routes that require authentication and role-based access
 */
const ProtectedRoute = ({ children, allowedRoles = null }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access if required
  if (allowedRoles && Array.isArray(allowedRoles)) {
    if (!allowedRoles.includes(user?.role)) {
      // Redirect to appropriate dashboard based on user role
      const dashboardMap = {
        admin: '/admin',
        teacher: '/teacher', 
        parent: '/parent',
        student: '/student'
      };
      
      const redirectPath = dashboardMap[user.role] || '/dashboard';
      return <Navigate to={redirectPath} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
