// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles, role }) => {
  if (!role) return <Navigate to="/" replace />; // not logged in
  if (!allowedRoles.includes(role)) return <Navigate to="/" replace />; // not authorized

  return children;
};

export default ProtectedRoute;
