import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  ShoppingCart, 
  User, 
  Users,
  Search,
  Leaf,
  Heart,
  Phone,
  Mail,
  LogOut,
  Settings,
  Package,
  Store
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const { currentUser, logout, isAuthenticated, isAdmin, isVendor } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsOpen(false);
    setShowUserMenu(false);
  }, [location]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    // Optional: redirect to home page
    // navigate('/');
  };

  const navigationLinks = [
    { path: '/', label: 'Home' },
    { path: '/shop', label: 'Shop' },
    { path: '/about', label: 'About' },
    { path: '/blog', label: 'Blog' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  // User menu for authenticated users
  const UserMenu = () => (
    <div className="user-menu">
      <div className="user-info">
        <p className="user-name">{currentUser?.name}</p>
        <p className="user-email">{currentUser?.email}</p>
      </div>
      <div className="user-menu-links">
        <Link to="/dashboard" className="user-menu-link">
          <Package size={16} />
          <span>Dashboard</span>
        </Link>
        <Link to="/profile" className="user-menu-link">
          <Settings size={16} />
          <span>Profile</span>
        </Link>
        <Link to="/orders" className="user-menu-link">
          <Package size={16} />
          <span>Orders</span>
        </Link>
        {isAdmin() && (
          <Link to="/admin/users" className="user-menu-link">
            <Users size={16} />
            <span>User Management</span>
          </Link>
        )}
        <button onClick={handleLogout} className="user-menu-link logout-btn">
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary-600 text-white py-2 text-sm">
        <div className="container">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="hidden md:flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>hello@greenmagic.com</span>
              </div>
            </div>
            <div className="hidden md:flex items-center">
              <span className="mr-4">🌱 Free shipping on orders above ₹999</span>
              {!isAuthenticated() && (
                <Link to="/vendor-register" className="flex items-center text-white hover:text-yellow-200 transition-colors">
                  <Store className="w-4 h-4 mr-1" />
                  <span>Become a Vendor</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={`navbar sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'navbar-scrolled' : 'navbar-transparent'
      }`}>
        <div className="container">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
              <div className="logo-container">
                <Leaf className="w-8 h-8 lg:w-10 lg:h-10 text-primary-600" />
              </div>
              <span className="font-display font-bold text-xl lg:text-2xl text-gray-900">
                Green<span className="text-primary-600">Magic</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navigationLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link ${isActiveLink(link.path) ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Search */}
              <button className="p-2 text-gray-600 hover:text-primary-600 transition-colors">
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <button className="p-2 text-gray-600 hover:text-primary-600 transition-colors relative">
                <Heart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                  0
                </span>
              </button>

              {/* Cart */}
              <button className="p-2 text-gray-600 hover:text-primary-600 transition-colors relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                  0
                </span>
              </button>

              {/* User Authentication */}
              {isAuthenticated() ? (
                <div className="user-menu-container relative">
                  <button 
                    onClick={toggleUserMenu}
                    className="p-2 text-gray-600 hover:text-primary-600 transition-colors flex items-center space-x-2"
                  >
                    <User className="w-5 h-5" />
                    <span className="hidden xl:block text-sm font-medium">
                      {currentUser?.name?.split(' ')[0]}
                    </span>
                  </button>
                  {showUserMenu && <UserMenu />}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary btn-sm"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
              
              {/* Become a Vendor button (desktop) */}
              {!isAuthenticated() && (
                <Link
                  to="/vendor-register"
                  className="hidden xl:flex items-center px-4 py-2 text-sm font-medium bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition-colors"
                >
                  <Store className="w-4 h-4 mr-2" />
                  Become a Vendor
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-4">
              {/* Mobile Cart */}
              <button className="p-2 text-gray-600 hover:text-primary-600 transition-colors relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                  0
                </span>
              </button>

              {/* Menu Toggle */}
              <button
                onClick={toggleMenu}
                className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu lg:hidden ${isOpen ? 'mobile-menu-open' : ''}`}>
          <div className="mobile-menu-content">
            <div className="px-4 pt-2 pb-3 space-y-1">
              {navigationLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`mobile-nav-link ${isActiveLink(link.path) ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Become a Vendor button (mobile) */}
              {!isAuthenticated() && (
                <Link
                  to="/vendor-register"
                  className="mobile-nav-link flex items-center"
                  onClick={closeMenu}
                >
                  <Store className="w-5 h-5 mr-2" />
                  Become a Vendor
                </Link>
              )}
            </div>

            {!isAuthenticated() && (
              <div className="px-4 py-3 border-t border-gray-200">
                <div className="flex flex-col space-y-3">
                  <Link
                    to="/login"
                    className="w-full py-2 text-center border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50"
                    onClick={closeMenu}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="w-full py-2 text-center bg-primary-600 rounded-md text-white font-medium hover:bg-primary-700"
                    onClick={closeMenu}
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            )}

            {isAuthenticated() && (
              <div className="px-4 py-3 border-t border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
                      {currentUser?.name?.charAt(0)}
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{currentUser?.name}</div>
                    <div className="text-sm font-medium text-gray-500">{currentUser?.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link
                    to="/dashboard"
                    className="mobile-menu-user-link"
                    onClick={closeMenu}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="mobile-menu-user-link"
                    onClick={closeMenu}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="mobile-menu-user-link"
                    onClick={closeMenu}
                  >
                    Orders
                  </Link>
                  {isAdmin() && (
                    <Link
                      to="/admin/users"
                      className="mobile-menu-user-link"
                      onClick={closeMenu}
                    >
                      User Management
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="mobile-menu-user-link text-left w-full"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar; 