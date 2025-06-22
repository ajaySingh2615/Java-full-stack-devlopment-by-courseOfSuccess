import React, { useState } from 'react';
import './PasswordModal.css';

// Icons
const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const PasswordModal = ({ isOpen, onClose, onSave, title = "Change Password", userId = null }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
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
    
    // Skip current password validation for admin changing other users' passwords
    if (!userId && !formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain at least one lowercase letter';
    } else if (!/(?=.*[A-Z])/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain at least one uppercase letter';
    } else if (!/(?=.*\d)/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain at least one number';
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      await onSave({
        userId,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      onClose();
    } catch (error) {
      setSubmitError(error.message || 'Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="password-modal-overlay" onClick={onClose}>
      <div className="password-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="password-modal-header">
          <h2 className="password-modal-title">{title}</h2>
          <button className="password-modal-close-button" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="password-modal-form">
          {submitError && (
            <div className="password-modal-submit-error">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {submitError}
            </div>
          )}
          
          {!userId && (
            <div className="password-modal-form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <div className="password-modal-input-wrapper">
                <span className="password-modal-input-icon"><LockIcon /></span>
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter your current password"
                  className={errors.currentPassword ? 'input-error' : ''}
                />
                <span 
                  className="password-modal-toggle-icon" 
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOffIcon /> : <EyeIcon />}
                </span>
              </div>
              {errors.currentPassword && <span className="password-modal-error-message">{errors.currentPassword}</span>}
            </div>
          )}
          
          <div className="password-modal-form-group">
            <label htmlFor="newPassword">New Password</label>
            <div className="password-modal-input-wrapper">
              <span className="password-modal-input-icon"><LockIcon /></span>
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                className={errors.newPassword ? 'input-error' : ''}
              />
              <span 
                className="password-modal-toggle-icon" 
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
              </span>
            </div>
            {errors.newPassword && <span className="password-modal-error-message">{errors.newPassword}</span>}
          </div>
          
          <div className="password-modal-form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <div className="password-modal-input-wrapper">
              <span className="password-modal-input-icon"><LockIcon /></span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                className={errors.confirmPassword ? 'input-error' : ''}
              />
              <span 
                className="password-modal-toggle-icon" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
              </span>
            </div>
            {errors.confirmPassword && <span className="password-modal-error-message">{errors.confirmPassword}</span>}
          </div>
          
          <div className="password-requirements">
            <h4>Password Requirements:</h4>
            <ul>
              <li className={formData.newPassword.length >= 8 ? 'valid' : 'invalid'}>
                At least 8 characters long
              </li>
              <li className={/(?=.*[a-z])/.test(formData.newPassword) ? 'valid' : 'invalid'}>
                At least one lowercase letter
              </li>
              <li className={/(?=.*[A-Z])/.test(formData.newPassword) ? 'valid' : 'invalid'}>
                At least one uppercase letter
              </li>
              <li className={/(?=.*\d)/.test(formData.newPassword) ? 'valid' : 'invalid'}>
                At least one number
              </li>
            </ul>
          </div>
          
          <div className="password-modal-actions">
            <button 
              type="button" 
              className="password-modal-cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="password-modal-submit-button"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal; 