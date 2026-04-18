import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

export const RoleGuard = ({ children, allowedRoles }) => {
  const { hasRole, isAuthenticated, loading } = useAuth();

  // 1. Calculate access early to use in logic
  const hasAccess = allowedRoles.some((role) => hasRole(role));

  // 2. Use useEffect for side effects (Alerts) 
  // This prevents the alert from firing multiple times during re-renders
  useEffect(() => {
    if (!loading && isAuthenticated && !hasAccess) {
      Swal.fire({
        title: 'Access Denied',
        text: 'You do not have permission to view this page.',
        icon: 'error',
        confirmButtonColor: '#8aefbdff', // Matches your violet-600
        timer: 3000,
        timerProgressBar: true,
      });
    }
  }, [loading, isAuthenticated, hasAccess]);

  // Handle Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  // If not logged in, send to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If logged in but doesn't have the right role, redirect
  if (!hasAccess) {
    return <Navigate to="/Unauthorized" replace />;
  }

  return <>{children}</>;
};