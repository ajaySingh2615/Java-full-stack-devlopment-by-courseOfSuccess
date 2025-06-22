import React, { useState, useEffect } from 'react';
import './UserModal.css';

// Icons
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const RoleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const UserModal = ({ isOpen, onClose, user, onSave, title = "Edit User" }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'USER'
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'USER'
      });
    }
  }, [user]);
  
  if (!isOpen) return null;
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.role) {
      newErrors.role = 'Role is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setSubmitError('');
    
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      setSubmitError(error.message || 'Failed to save user. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="user-modal-overlay" onClick={onClose}>
      <div className="user-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="user-modal-header">
          <h2 className="user-modal-title">{title}</h2>
          <button className="user-modal-close-button" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="user-modal-form">
          {submitError && (
            <div className="user-modal-submit-error">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {submitError}
            </div>
          )}
          
          <div className="user-modal-form-group">
            <label htmlFor="name">Full Name</label>
            <div className="user-modal-input-wrapper">
              <span className="user-modal-input-icon"><UserIcon /></span>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter user's full name"
                className={errors.name ? 'input-error' : ''}
              />
            </div>
            {errors.name && <span className="user-modal-error-message">{errors.name}</span>}
          </div>
          
          <div className="user-modal-form-group">
            <label htmlFor="email">Email Address</label>
            <div className="user-modal-input-wrapper">
              <span className="user-modal-input-icon"><EmailIcon /></span>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter user's email"
                className={errors.email ? 'input-error' : ''}
              />
            </div>
            {errors.email && <span className="user-modal-error-message">{errors.email}</span>}
          </div>
          
          <div className="user-modal-form-group">
            <label htmlFor="role">Role</label>
            <div className="user-modal-input-wrapper">
              <span className="user-modal-input-icon"><RoleIcon /></span>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={errors.role ? 'input-error' : ''}
              >
                <option value="USER">User</option>
                <option value="VENDOR">Vendor</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            {errors.role && <span className="user-modal-error-message">{errors.role}</span>}
          </div>
          
          <div className="user-modal-actions">
            <button 
              type="button" 
              className="user-modal-cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="user-modal-submit-button"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal; 