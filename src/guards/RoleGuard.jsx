import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from "react-hot-toast";

export const RoleGuard = ({ children, allowedRoles }) => {
  const { hasRole, isAuthenticated, loading } = useAuth();

  // Wait for the AuthContext to finish loading the token from localStorage
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  if (!hasAccess) {
  toast.error("You are not allowed to view this page");
  return <Navigate to="/unauthorized" replace />;
  }
  // If not logged in, send to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if the user has at least one of the required roles
  const hasAccess = allowedRoles.some((role) => hasRole(role));

  // If logged in but doesn't have the right role, send to home (or an unauthorized page)
  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};