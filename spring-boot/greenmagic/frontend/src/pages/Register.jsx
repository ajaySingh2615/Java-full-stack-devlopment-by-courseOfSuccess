import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Phone, Lock, CheckCircle, XCircle, UserCheck } from 'lucide-react';
import authService from '../services/authService';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    role: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState(null);
  const [availableRoles, setAvailableRoles] = useState([]);

  // Fetch available roles on component mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/users/roles');
        const data = await response.json();
        if (data.success) {
          setAvailableRoles(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch roles:', error);
      }
    };

    fetchRoles();
  }, []);

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

    // Real-time password validation
    if (name === 'password') {
      const validation = authService.validatePassword(value);
      setPasswordValidation(validation);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!authService.validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordValidation = authService.validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = 'Password does not meet requirements';
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Phone number validation
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!authService.validatePhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = 'Please select a role';
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

    try {
      // Remove confirmPassword from the data sent to backend
      const { confirmPassword, ...registrationData } = formData;
      
      const response = await authService.register(registrationData);
      
      if (response.success) {
        // Registration successful
        alert('Registration successful! Please login with your credentials.');
        navigate('/login');
      } else {
        setErrors({ submit: response.message || 'Registration failed' });
      }
    } catch (error) {
      setErrors({ submit: error.message || 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const PasswordStrengthIndicator = () => {
    if (!passwordValidation || !formData.password) return null;

    const requirements = [
      { key: 'minLength', text: 'At least 8 characters', valid: !passwordValidation.errors.minLength },
      { key: 'hasUpperCase', text: 'One uppercase letter', valid: !passwordValidation.errors.hasUpperCase },
      { key: 'hasLowerCase', text: 'One lowercase letter', valid: !passwordValidation.errors.hasLowerCase },
      { key: 'hasNumbers', text: 'One number', valid: !passwordValidation.errors.hasNumbers },
      { key: 'hasSpecialChar', text: 'One special character (@$!%*?&)', valid: !passwordValidation.errors.hasSpecialChar },
    ];

    return (
      <div className="password-strength">
        <p className="password-strength-title">Password Requirements:</p>
        <ul className="password-requirements">
          {requirements.map(req => (
            <li key={req.key} className={req.valid ? 'valid' : 'invalid'}>
              {req.valid ? <CheckCircle size={14} /> : <XCircle size={14} />}
              <span>{req.text}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <h1>Create Account</h1>
            <p>Join GreenMagic and start your sustainable journey</p>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            {/* Name Field */}
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-wrapper">
                <User className="input-icon" size={20} />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? 'input-error' : ''}
                  placeholder="Enter your full name"
                  disabled={loading}
                />
              </div>
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

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
                />
              </div>
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            {/* Phone Number Field */}
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <div className="input-wrapper">
                <Phone className="input-icon" size={20} />
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={errors.phoneNumber ? 'input-error' : ''}
                  placeholder="Enter your phone number"
                  disabled={loading}
                />
              </div>
              {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
            </div>

            {/* Role Selection Field */}
            <div className="form-group">
              <label htmlFor="role">Account Type</label>
              <div className="input-wrapper">
                <UserCheck className="input-icon" size={20} />
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={errors.role ? 'input-error' : ''}
                  disabled={loading}
                >
                  <option value="">Select your account type</option>
                  {availableRoles.map(role => (
                    <option key={role.roleId} value={role.roleName}>
                      {role.roleName === 'USER' ? 'Customer' : 'Vendor'}
                    </option>
                  ))}
                </select>
              </div>
              {errors.role && <span className="error-message">{errors.role}</span>}
              <div className="role-description">
                <p className="role-help-text">
                  <strong>Customer:</strong> Browse and purchase eco-friendly products<br/>
                  <strong>Vendor:</strong> Sell your sustainable products on our platform
                </p>
              </div>
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
                  placeholder="Create a strong password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
              <PasswordStrengthIndicator />
            </div>

            {/* Confirm Password Field */}
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? 'input-error' : ''}
                  placeholder="Confirm your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
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
              className="btn-primary register-btn"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="register-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="login-link">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 