import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Guards dashboard routes. Once Django REST Framework + JWT auth is
 * connected, `isAuthenticated` reflects a verified session rather than
 * the local demo session used during frontend development.
 */
export default function ProtectedRoute({ children, role }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  console.log("PROTECTED ROUTE RUNNING", { isAuthenticated, user, role });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user?.role !== role) {
    return (
      <Navigate
        to={
          user?.role === "client" ? "/client/dashboard" : "/student/dashboard"
        }
        replace
      />
    );
  }

  return children;
}
