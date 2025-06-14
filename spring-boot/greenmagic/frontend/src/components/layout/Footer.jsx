import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Leaf, 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Shield,
  Truck,
  Recycle,
  Award
} from 'lucide-react';
import './Footer.css';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { path: '/', label: 'Home' },
    { path: '/shop', label: 'Shop' },
    { path: '/about', label: 'About Us' },
    { path: '/contact', label: 'Contact' },
    { path: '/blog', label: 'Blog' },
  ];

  const customerService = [
    { path: '/help', label: 'Help Center' },
    { path: '/shipping', label: 'Shipping Info' },
    { path: '/returns', label: 'Returns & Exchanges' },
    { path: '/faq', label: 'FAQ' },
    { path: '/track-order', label: 'Track Your Order' },
  ];

  const policies = [
    { path: '/privacy', label: 'Privacy Policy' },
    { path: '/terms', label: 'Terms of Service' },
    { path: '/sustainability', label: 'Sustainability' },
    { path: '/wholesale', label: 'Wholesale' },
    { path: '/affiliate', label: 'Affiliate Program' },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Secure Payment',
      description: '100% secure transactions'
    },
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'On orders above ₹999'
    },
    {
      icon: Recycle,
      title: 'Eco-Friendly',
      description: 'Sustainable packaging'
    },
    {
      icon: Award,
      title: 'Quality Assured',
      description: 'Premium organic products'
    }
  ];

  return (
    <footer className="footer">
      {/* Features Section */}
      <div className="bg-primary-50 py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-4 text-center lg:text-left">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center">
                    <feature.icon className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-primary-600 py-12">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
              Join Our Green Community
            </h3>
            <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter for exclusive offers, eco-tips, and updates on sustainable living. 
              Get 10% off your first order!
            </p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-l-lg sm:rounded-r-none rounded-r-lg border-0 focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
              <button className="bg-secondary-500 hover:bg-secondary-600 text-white px-6 py-3 rounded-r-lg sm:rounded-l-none rounded-l-lg transition-colors duration-200 flex items-center justify-center space-x-2 mt-2 sm:mt-0">
                <span>Subscribe</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="bg-gray-900 text-white py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <Link to="/" className="flex items-center space-x-2 mb-6">
                <Leaf className="w-8 h-8 text-primary-400" />
                <span className="font-display font-bold text-xl">
                  Green<span className="text-primary-400">Magic</span>
                </span>
              </Link>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Your trusted partner for organic, eco-friendly products that make a positive impact 
                on your health and the environment. Committed to sustainable living since 2020.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-primary-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">
                    123 Green Street, Eco City, Mumbai 400001
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-primary-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">+91 98765 43210</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-primary-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">hello@greenmagic.com</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-display font-semibold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.path}>
                    <Link 
                      to={link.path} 
                      className="text-gray-300 hover:text-primary-400 transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="font-display font-semibold text-lg mb-6">Customer Service</h4>
              <ul className="space-y-3">
                {customerService.map((link) => (
                  <li key={link.path}>
                    <Link 
                      to={link.path} 
                      className="text-gray-300 hover:text-primary-400 transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Policies & Info */}
            <div>
              <h4 className="font-display font-semibold text-lg mb-6">Policies & Info</h4>
              <ul className="space-y-3">
                {policies.map((link) => (
                  <li key={link.path}>
                    <Link 
                      to={link.path} 
                      className="text-gray-300 hover:text-primary-400 transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-950 py-6">
        <div className="container">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="text-gray-400 text-sm text-center lg:text-left">
              <p>© {currentYear} GreenMagic. All rights reserved. Made with 💚 for a sustainable future.</p>
            </div>
            
            {/* Social Media Links */}
            <div className="flex items-center space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
                aria-label="Subscribe to our YouTube channel"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <span>Secure payments:</span>
              <div className="flex space-x-2">
                <span className="bg-gray-800 px-2 py-1 rounded text-xs">Visa</span>
                <span className="bg-gray-800 px-2 py-1 rounded text-xs">UPI</span>
                <span className="bg-gray-800 px-2 py-1 rounded text-xs">PayPal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}; 