import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AuthGuard = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // If the AuthContext is still checking for a saved user, show nothing or a spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // replace={true} prevents the user from hitting "back" to the locked page
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};