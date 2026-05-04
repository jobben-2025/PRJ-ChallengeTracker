import { Navigate, Outlet } from "react-router-dom";

// In ProtectedRoute.tsx
export const ProtectedRoute = () => {
  const userString = localStorage.getItem("user");
  const isAuthenticated = userString && userString !== "undefined";

  if (!isAuthenticated) {
    // Nur wenn NICHT eingeloggt, ab zur Landingpage
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
