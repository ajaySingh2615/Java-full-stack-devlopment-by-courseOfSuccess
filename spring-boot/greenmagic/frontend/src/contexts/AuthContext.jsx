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

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('greenmagic_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('greenmagic_user');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('greenmagic_user', JSON.stringify(userData));
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('greenmagic_user');
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

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    getUserRole,
    isAdmin,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 