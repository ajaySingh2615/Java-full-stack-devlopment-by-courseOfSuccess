import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ 
  children, 
  requireAuth = false,
  requireAdmin = false, 
  requireVendor = false,
  requireCompleteVendorProfile = false,
  redirectTo = '/login' 
}) => {
  const { 
    isAuthenticated, 
    isAdmin, 
    isVendor, 
    isVendorProfileComplete,
    getDashboardUrl,
    loading 
  } = useAuth();
  
  const location = useLocation();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if ((requireAuth || requireAdmin || requireVendor) && !isAuthenticated()) {
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  // Redirect if admin access required but user is not admin
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/unauthorized" state={{ message: "This area is restricted to administrators only." }} replace />;
  }

  // Redirect if vendor access required but user is not vendor
  if (requireVendor && !isVendor()) {
    return <Navigate to="/unauthorized" state={{ message: "This area is restricted to vendors only." }} replace />;
  }
  
  // Redirect vendor to profile completion if profile is not complete
  if (requireCompleteVendorProfile && isVendor() && !isVendorProfileComplete()) {
    return <Navigate to="/vendor-registration" replace />;
  }

  // Render children if all checks pass
  return children;
};

export default ProtectedRoute; 