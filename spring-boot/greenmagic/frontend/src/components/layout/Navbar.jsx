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
  Mail
} from 'lucide-react';
import './Navbar.css';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
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

              {/* User Account */}
              <button className="p-2 text-gray-600 hover:text-primary-600 transition-colors">
                <User className="w-5 h-5" />
              </button>
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
                <button className="flex flex-col items-center space-y-1 text-gray-600 hover:text-primary-600 transition-colors">
                  <User className="w-5 h-5" />
                  <span className="text-xs">Account</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}; 