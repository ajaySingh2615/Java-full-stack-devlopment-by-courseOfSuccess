import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Get redirect path from location state or default to dashboard
  const from = location.state?.from || '/dashboard';

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!authService.validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      console.log("Attempting login with:", formData.email);
      const response = await authService.login(formData);
      console.log("Login response:", response);
      
      // Check if we have a successful response with user data
      if (response && response.success && response.data) {
        console.log("Login successful, user data:", response.data);
        
        // For vendor users, check profile completion status
        if (response.data.roleName === 'VENDOR') {
          console.log("Vendor login detected");
          
          // Get profile status from response
          const profileComplete = response.profileComplete || false;
          const vendorStatus = response.vendorStatus || null;
          
          console.log("Profile complete:", profileComplete);
          console.log("Vendor status:", vendorStatus);
          
          // Force values for debugging if needed - comment out in production
          // const forcedProfileComplete = true;
          // const forcedVendorStatus = 'APPROVED';
          // console.log("FORCING profile complete to:", forcedProfileComplete);
          // console.log("FORCING vendor status to:", forcedVendorStatus);
          
          // Login with vendor status info
          login(response.data, vendorStatus, profileComplete);
          
          // Store vendor status directly for more reliable access
          localStorage.setItem('greenmagic_vendor_status', vendorStatus || 'PENDING');
          localStorage.setItem('greenmagic_vendor_profile_complete', String(profileComplete));
          
          // Redirect based on profile completion status
          if (!profileComplete) {
            console.log("Redirecting to vendor registration");
            navigate('/vendor-registration');
            return;
          } else {
            console.log("Vendor profile is complete, redirecting to dashboard");
          }
        } else {
          // Regular login for non-vendor users
          console.log("Non-vendor login, storing user data");
          login(response.data);
        }
        
        // Redirect to intended destination or dashboard
        console.log("Redirecting to:", from);
        navigate(from);
      } else {
        // Handle error case when response structure is unexpected
        console.error("Login response format error:", response);
        setErrors({ 
          submit: response.message || 'Login failed. Unexpected response format.' 
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ submit: error.message || 'Login failed. Please check your credentials.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Welcome Back</h1>
            <p>Sign in to your GreenMagic account</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={20} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'input-error' : ''}
                  placeholder="Enter your email address"
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'input-error' : ''}
                  placeholder="Enter your password"
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="submit-error">
                <XCircle size={20} />
                <span>{errors.submit}</span>
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              className="btn-primary login-btn"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="login-options">
            <Link to="/forgot-password" className="forgot-password-link">
              Forgot your password?
            </Link>
          </div>

          <div className="login-footer">
            <div className="register-options">
              <p>
                Don't have an account?{' '}
                <Link to="/register" className="register-link">
                  Register as Customer
                </Link>
              </p>
              <p>
                Want to sell on GreenMagic?{' '}
                <Link to="/vendor-register" className="register-link">
                  Register as Vendor
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="demo-credentials">
          <h3>Demo Credentials</h3>
          <p>For testing purposes, you can use:</p>
          <div className="demo-info">
            <p><strong>Email:</strong> test@greenmagic.com</p>
            <p><strong>Password:</strong> TestUser123!</p>
          </div>
          <p className="demo-note">
            Note: Please register a new account to test the full registration flow.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 