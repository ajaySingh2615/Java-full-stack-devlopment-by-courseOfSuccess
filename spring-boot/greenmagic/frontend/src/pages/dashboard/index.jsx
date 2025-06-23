import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Dashboard Router Component
 * 
 * This component acts as a router for the /dashboard path.
 * It redirects users to the appropriate dashboard based on their role:
 * - Admins go to /admin/dashboard
 * - Vendors go to /vendor/dashboard
 * - Regular users go to /customer/dashboard
 */
const DashboardRouter = () => {
  const { isAdmin, isVendor, isAuthenticated } = useAuth();
  
  useEffect(() => {
    console.log("Dashboard router - redirecting based on role");
  }, []);
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  if (isAdmin()) {
    console.log("User is admin, redirecting to admin dashboard");
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  if (isVendor()) {
    console.log("User is vendor, redirecting to vendor dashboard");
    return <Navigate to="/vendor/dashboard" replace />;
  }
  
  console.log("User is customer, redirecting to customer dashboard");
  return <Navigate to="/customer/dashboard" replace />;
};

export default DashboardRouter; 