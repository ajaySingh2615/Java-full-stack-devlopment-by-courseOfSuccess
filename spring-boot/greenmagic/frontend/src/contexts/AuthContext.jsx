import React, { createContext, useContext, useState, useEffect } from 'react';

// Create Authentication Context
const AuthContext = createContext();

// Hook to use authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Authentication Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vendorProfileStatus, setVendorProfileStatus] = useState(null);
  const [vendorProfileComplete, setVendorProfileComplete] = useState(false);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('greenmagic_user');
    const storedVendorStatus = localStorage.getItem('greenmagic_vendor_status');
    const storedProfileComplete = localStorage.getItem('greenmagic_vendor_profile_complete');
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        if (storedVendorStatus) {
          setVendorProfileStatus(storedVendorStatus);
        }
        
        if (storedProfileComplete) {
          const isComplete = storedProfileComplete === 'true';
          setVendorProfileComplete(isComplete);
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('greenmagic_user');
        localStorage.removeItem('greenmagic_vendor_status');
        localStorage.removeItem('greenmagic_vendor_profile_complete');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (userData, vendorStatus = null, profileComplete = false) => {
    if (!userData) {
      console.error("Attempted to login with null/undefined user data");
      return;
    }
    
    // Ensure we have a userId property
    if (!userData.userId && (userData.id || userData._id)) {
      userData.userId = userData.id || userData._id;
    }
    
    setUser(userData);
    localStorage.setItem('greenmagic_user', JSON.stringify(userData));
    
    if (userData.roleName === 'VENDOR') {
      setVendorProfileStatus(vendorStatus);
      setVendorProfileComplete(profileComplete);
      
      if (vendorStatus) {
        localStorage.setItem('greenmagic_vendor_status', vendorStatus);
      }
      
      localStorage.setItem('greenmagic_vendor_profile_complete', String(profileComplete));
    }
  };

  // Update vendor profile status
  const updateVendorStatus = (status) => {
    setVendorProfileStatus(status);
    localStorage.setItem('greenmagic_vendor_status', status);
  };
  
  // Set vendor profile as complete
  const setVendorProfileCompleted = () => {
    setVendorProfileComplete(true);
    localStorage.setItem('greenmagic_vendor_profile_complete', 'true');
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setVendorProfileStatus(null);
    setVendorProfileComplete(false);
    localStorage.removeItem('greenmagic_user');
    localStorage.removeItem('greenmagic_vendor_status');
    localStorage.removeItem('greenmagic_vendor_profile_complete');
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return user !== null;
  };

  // Get user role
  const getUserRole = () => {
    return user?.roleName || null;
  };

  // Check if user is admin
  const isAdmin = () => {
    return user?.roleName === 'ADMIN';
  };

  // Check if user is vendor
  const isVendor = () => {
    return user?.roleName === 'VENDOR';
  };
  
  // Check if user is a regular customer
  const isCustomer = () => {
    return isAuthenticated() && !isAdmin() && !isVendor();
  };
  
  // Check if vendor profile is complete
  const isVendorProfileComplete = () => {
    return vendorProfileComplete;
  };
  
  // Get vendor status
  const getVendorStatus = () => {
    return vendorProfileStatus;
  };
  
  // Get dashboard URL based on user role
  const getDashboardUrl = () => {
    if (isAdmin()) {
      return '/admin/dashboard';
    } else if (isVendor()) {
      return '/vendor/dashboard';
    } else {
      return '/customer/dashboard';
    }
  };

  const value = {
    currentUser: user,
    login,
    logout,
    isAuthenticated,
    getUserRole,
    isAdmin,
    isVendor,
    isCustomer,
    vendorProfileStatus,
    vendorProfileComplete,
    isVendorProfileComplete,
    getVendorStatus,
    updateVendorStatus,
    setVendorProfileCompleted,
    getDashboardUrl,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 