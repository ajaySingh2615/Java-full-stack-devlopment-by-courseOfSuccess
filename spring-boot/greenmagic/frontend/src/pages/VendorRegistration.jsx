import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import vendorService from '../services/vendorService';
import './VendorRegistration.css';

// Icons for the form
const BusinessIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const IdIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const DescriptionIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const VendorRegistration = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [profileExists, setProfileExists] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: 'INDIVIDUAL',
    gstNumber: '',
    contactPhone: '',
    contactEmail: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    description: '',
    acceptTerms: false
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Debug the currentUser object
    console.log("Current user:", currentUser);
    
    // Get the user ID (could be id, userId, or _id depending on your backend)
    const userId = currentUser.userId || currentUser.id || currentUser._id;
    
    if (!userId) {
      console.error("User ID not found in currentUser object:", currentUser);
      setSubmitError("User ID not found. Please log out and log in again.");
      setLoading(false);
      return;
    }

    const checkProfile = async () => {
      try {
        setLoading(true);
        const response = await vendorService.checkVendorProfileExists(userId);
        setProfileExists(response.exists || false);
        
        if (response.exists) {
          // If profile exists, fetch it and populate the form
          // For now, we'll just set a placeholder message
          console.log("Vendor profile exists, would fetch details here");
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error checking vendor profile:", error);
        setLoading(false);
      }
    };

    checkProfile();
  }, [currentUser, navigate]);

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
      if (!formData.businessType) newErrors.businessType = 'Business type is required';
      if (!formData.gstNumber.trim()) newErrors.gstNumber = 'GST number is required';
      if (formData.gstNumber.trim() && !formData.gstNumber.startsWith('TEMP') && formData.gstNumber.length !== 15) {
        newErrors.gstNumber = 'GST number must be 15 characters';
      }
    } else if (step === 2) {
      if (!formData.contactPhone.trim()) newErrors.contactPhone = 'Contact phone is required';
      if (formData.contactPhone.trim() && !/^\d{10}$/.test(formData.contactPhone)) {
        newErrors.contactPhone = 'Phone number must be 10 digits';
      }
      if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Contact email is required';
      if (formData.contactEmail.trim() && !/^\S+@\S+\.\S+$/.test(formData.contactEmail)) {
        newErrors.contactEmail = 'Invalid email format';
      }
    } else if (step === 3) {
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.state.trim()) newErrors.state = 'State is required';
      if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
      if (formData.pincode.trim() && !/^\d{6}$/.test(formData.pincode)) {
        newErrors.pincode = 'Pincode must be 6 digits';
      }
    } else if (step === 4) {
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (!formData.acceptTerms) newErrors.acceptTerms = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }
    
    try {
      setLoading(true);
      setSubmitError('');
      
      // Get the user ID (could be id, userId, or _id depending on your backend)
      const userId = currentUser.userId || currentUser.id || currentUser._id;
      
      if (!userId) {
        throw new Error("User ID not found. Please log out and log in again.");
      }
      
      const vendorData = {
        businessName: formData.businessName,
        businessType: formData.businessType,
        gstNumber: formData.gstNumber,
        contactPhone: formData.contactPhone,
        contactEmail: formData.contactEmail,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        description: formData.description
      };
      
      if (profileExists) {
        // First get the vendor profile to get the vendorId
        const profileResponse = await vendorService.getVendorProfileByUserId(userId);
        if (profileResponse.success && profileResponse.data) {
          await vendorService.updateVendorProfile(profileResponse.data.id, vendorData);
        } else {
          throw new Error('Could not find your vendor profile');
        }
      } else {
        await vendorService.createVendorProfile(userId, vendorData);
      }
      
      setSuccess(true);
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (error) {
      console.error("Error submitting vendor profile:", error);
      setSubmitError(error.message || 'An error occurred while submitting your profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="vendor-registration-page">
        <div className="vendor-registration-container">
          <div className="loading-message">
            <div className="spinner"></div>
            <h2>Loading...</h2>
            <p>Please wait while we prepare your registration form.</p>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="vendor-registration-page">
        <div className="vendor-registration-container">
          <div className="success-message">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2>Registration Successful!</h2>
            <p>Your vendor profile has been {profileExists ? 'updated' : 'created'} successfully.</p>
            <button 
              className="btn-primary" 
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="vendor-registration-page">
      <div className="vendor-registration-container">
        <div className="vendor-registration-card">
          <div className="vendor-registration-header">
            <h1>{profileExists ? 'Complete Your Vendor Profile' : 'Vendor Registration'}</h1>
            <p>Please provide your business details to register as a vendor</p>
          </div>
          
          {/* Progress Bar */}
          <div className="progress-bar">
            <div className={`progress-step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
              <div className="step-indicator">{currentStep > 1 ? <CheckIcon /> : 1}</div>
              <div className="step-label">Business Info</div>
            </div>
            <div className={`progress-step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
              <div className="step-indicator">{currentStep > 2 ? <CheckIcon /> : 2}</div>
              <div className="step-label">Contact Details</div>
            </div>
            <div className={`progress-step ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
              <div className="step-indicator">{currentStep > 3 ? <CheckIcon /> : 3}</div>
              <div className="step-label">Address</div>
            </div>
            <div className={`progress-step ${currentStep >= 4 ? 'active' : ''}`}>
              <div className="step-indicator">4</div>
              <div className="step-label">Description & Terms</div>
            </div>
          </div>
          
          {submitError && (
            <div className="submit-error">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {submitError}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Step 1: Business Information */}
            {currentStep === 1 && (
              <>
                <h2 className="step-title">Business Information</h2>
                <div className="form-group">
                  <label htmlFor="businessName">Business Name</label>
                  <div className="input-wrapper">
                    <span className="input-icon"><BusinessIcon /></span>
                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      placeholder="Enter your business name"
                      className={errors.businessName ? 'input-error' : ''}
                    />
                  </div>
                  {errors.businessName && <span className="error-message">{errors.businessName}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="businessType">Business Type</label>
                  <div className="input-wrapper">
                    <span className="input-icon"><BusinessIcon /></span>
                    <select
                      id="businessType"
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                      className={errors.businessType ? 'input-error' : ''}
                    >
                      <option value="INDIVIDUAL">Individual</option>
                      <option value="PARTNERSHIP">Partnership</option>
                      <option value="CORPORATION">Corporation</option>
                      <option value="LLC">LLC</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  {errors.businessType && <span className="error-message">{errors.businessType}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="gstNumber">GST Number</label>
                  <div className="input-wrapper">
                    <span className="input-icon"><IdIcon /></span>
                    <input
                      type="text"
                      id="gstNumber"
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleChange}
                      placeholder="Enter your GST number"
                      className={errors.gstNumber ? 'input-error' : ''}
                    />
                  </div>
                  {errors.gstNumber && <span className="error-message">{errors.gstNumber}</span>}
                </div>
              </>
            )}
            
            {/* Step 2: Contact Information */}
            {currentStep === 2 && (
              <>
                <h2 className="step-title">Contact Information</h2>
                <div className="form-group">
                  <label htmlFor="contactPhone">Contact Phone</label>
                  <div className="input-wrapper">
                    <span className="input-icon"><PhoneIcon /></span>
                    <input
                      type="tel"
                      id="contactPhone"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      placeholder="Enter your contact phone"
                      className={errors.contactPhone ? 'input-error' : ''}
                    />
                  </div>
                  {errors.contactPhone && <span className="error-message">{errors.contactPhone}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="contactEmail">Contact Email</label>
                  <div className="input-wrapper">
                    <span className="input-icon"><EmailIcon /></span>
                    <input
                      type="email"
                      id="contactEmail"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      placeholder="Enter your contact email"
                      className={errors.contactEmail ? 'input-error' : ''}
                    />
                  </div>
                  {errors.contactEmail && <span className="error-message">{errors.contactEmail}</span>}
                </div>
              </>
            )}
            
            {/* Step 3: Address Information */}
            {currentStep === 3 && (
              <>
                <h2 className="step-title">Address Information</h2>
                <div className="form-group full-width">
                  <label htmlFor="address">Address</label>
                  <div className="textarea-wrapper">
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter your business address"
                      className={errors.address ? 'textarea-error' : ''}
                    />
                  </div>
                  {errors.address && <span className="error-message">{errors.address}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <div className="input-wrapper">
                    <span className="input-icon"><LocationIcon /></span>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter your city"
                      className={errors.city ? 'input-error' : ''}
                    />
                  </div>
                  {errors.city && <span className="error-message">{errors.city}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="state">State</label>
                  <div className="input-wrapper">
                    <span className="input-icon"><LocationIcon /></span>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Enter your state"
                      className={errors.state ? 'input-error' : ''}
                    />
                  </div>
                  {errors.state && <span className="error-message">{errors.state}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="pincode">Pincode</label>
                  <div className="input-wrapper">
                    <span className="input-icon"><LocationIcon /></span>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="Enter your pincode"
                      className={errors.pincode ? 'input-error' : ''}
                    />
                  </div>
                  {errors.pincode && <span className="error-message">{errors.pincode}</span>}
                </div>
              </>
            )}
            
            {/* Step 4: Description and Terms */}
            {currentStep === 4 && (
              <>
                <h2 className="step-title">Description & Terms</h2>
                <div className="form-group full-width">
                  <label htmlFor="description">Business Description</label>
                  <div className="textarea-wrapper">
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe your business"
                      className={errors.description ? 'textarea-error' : ''}
                    />
                  </div>
                  {errors.description && <span className="error-message">{errors.description}</span>}
                </div>
                
                <div className="form-group full-width">
                  <div className="checkbox-group">
                    <label className="checkbox-wrapper">
                      <input
                        type="checkbox"
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleChange}
                      />
                      <span className="custom-checkbox">
                        {formData.acceptTerms && <CheckIcon />}
                      </span>
                      <span>I accept the terms and conditions</span>
                    </label>
                  </div>
                  {errors.acceptTerms && <span className="error-message">{errors.acceptTerms}</span>}
                </div>
              </>
            )}
            
            <div className="form-nav-buttons">
              {currentStep > 1 && (
                <button 
                  type="button" 
                  onClick={handlePrevious}
                  className="nav-btn prev"
                >
                  <ArrowLeftIcon /> Previous
                </button>
              )}
              
              {currentStep < 4 ? (
                <button 
                  type="button" 
                  onClick={handleNext}
                  className="nav-btn next"
                >
                  Next <ArrowRightIcon />
                </button>
              ) : (
                <button 
                  type="submit" 
                  className="nav-btn next"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VendorRegistration; 