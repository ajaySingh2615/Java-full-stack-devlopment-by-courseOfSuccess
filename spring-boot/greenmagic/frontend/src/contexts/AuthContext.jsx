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
        setUser(JSON.parse(storedUser));
        
        if (storedVendorStatus) {
          setVendorProfileStatus(storedVendorStatus);
        }
        
        if (storedProfileComplete) {
          setVendorProfileComplete(storedProfileComplete === 'true');
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
    setUser(userData);
    localStorage.setItem('greenmagic_user', JSON.stringify(userData));
    
    if (userData.roleName === 'VENDOR') {
      setVendorProfileStatus(vendorStatus);
      setVendorProfileComplete(profileComplete);
      
      if (vendorStatus) {
        localStorage.setItem('greenmagic_vendor_status', vendorStatus);
      }
      
      localStorage.setItem('greenmagic_vendor_profile_complete', profileComplete);
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
  
  // Check if vendor profile is complete
  const isVendorProfileComplete = () => {
    return vendorProfileComplete;
  };
  
  // Get vendor status
  const getVendorStatus = () => {
    return vendorProfileStatus;
  };

  const value = {
    currentUser: user,
    login,
    logout,
    isAuthenticated,
    getUserRole,
    isAdmin,
    isVendor,
    vendorProfileStatus,
    vendorProfileComplete,
    isVendorProfileComplete,
    getVendorStatus,
    updateVendorStatus,
    setVendorProfileCompleted,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 