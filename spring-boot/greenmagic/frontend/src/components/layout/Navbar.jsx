import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  ShoppingCart, 
  User, 
  Search,
  Leaf,
  Heart,
  Phone,
  Mail,
  LogOut,
  Settings,
  Package
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

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
        <p className="user-name">{user?.name}</p>
        <p className="user-email">{user?.email}</p>
      </div>
      <div className="user-menu-links">
        <Link to="/profile" className="user-menu-link">
          <Settings size={16} />
          <span>Profile</span>
        </Link>
        <Link to="/orders" className="user-menu-link">
          <Package size={16} />
          <span>Orders</span>
        </Link>
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
            <div className="hidden md:block">
              <span>🌱 Free shipping on orders above ₹999</span>
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
                      {user?.name?.split(' ')[0]}
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
            </div>

            {/* Mobile Authentication */}
            {isAuthenticated() ? (
              <div className="px-4 py-3 border-t border-gray-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Link
                    to="/profile"
                    className="mobile-nav-link"
                    onClick={closeMenu}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="mobile-nav-link"
                    onClick={closeMenu}
                  >
                    Orders
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMenu();
                    }}
                    className="mobile-nav-link text-red-600 w-full text-left"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-4 py-3 border-t border-gray-200">
                <div className="space-y-2">
                  <Link
                    to="/login"
                    className="mobile-nav-link"
                    onClick={closeMenu}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="mobile-nav-link"
                    onClick={closeMenu}
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            )}

            {/* Mobile Actions */}
            <div className="px-4 py-3 border-t border-gray-200">
              <div className="flex items-center justify-around">
                <button className="flex flex-col items-center space-y-1 text-gray-600 hover:text-primary-600 transition-colors">
                  <Search className="w-5 h-5" />
                  <span className="text-xs">Search</span>
                </button>
                <button className="flex flex-col items-center space-y-1 text-gray-600 hover:text-primary-600 transition-colors relative">
                  <Heart className="w-5 h-5" />
                  <span className="text-xs">Wishlist</span>
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                    0
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar; 