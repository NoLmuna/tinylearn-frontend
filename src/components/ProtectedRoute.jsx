import { Navigate } from "react-router-dom";
import { useAdmin } from "../contexts/adminContext";

/**
 * ProtectedRoute
 * Redirects unauthenticated users to login.
 * If `allowedRoles` is provided, also enforces role-based access.
 *
 * @param {React.ReactNode} children - The component to render when access is granted.
 * @param {string[]} [allowedRoles] - e.g. ['admin'] or ['teacher', 'admin']
 * @param {string} [redirectTo] - Login path to redirect to (defaults to /login).
 */
function ProtectedRoute({ children, allowedRoles, redirectTo = "/login" }) {
  const { isAuthenticated, role } = useAdmin();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Redirect to the appropriate dashboard based on the user's actual role
    const dashboardByRole = {
      student: "/student/dashboard",
      teacher: "/teacher/dashboard",
      parent: "/parent/dashboard",
      admin: "/admin/dashboard",
    };
    return <Navigate to={dashboardByRole[role] ?? "/login"} replace />;
  }

  return children;
}

export default ProtectedRoute;
