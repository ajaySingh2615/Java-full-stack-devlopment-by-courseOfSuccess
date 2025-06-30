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
  const { currentUser, setVendorProfileCompleted } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [profileExists, setProfileExists] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    businessName: '',
    legalBusinessName: '',
    businessType: 'INDIVIDUAL',
    gstNumber: '',
    panNumber: '',
    businessPhone: '',
    businessEmail: '',
    supportEmail: '',
    websiteUrl: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India', // Default to India
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    bankBranch: '',
    storeDescription: '',
    storeDisplayName: '',
    productCategories: '',
    logoUrl: '',
    gstCertificateUrl: '',
    cancelledChequeUrl: '',
    panCardUrl: '',
    identityProofUrl: '',
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
      if (!formData.gstNumber.trim()) newErrors.gstNumber = 'GST number is required';
      if (formData.gstNumber.trim() && !formData.gstNumber.startsWith('TEMP') && formData.gstNumber.length !== 15) {
        newErrors.gstNumber = 'GST number must be 15 characters';
      }
      if (!formData.panNumber.trim()) newErrors.panNumber = 'PAN number is required';
      if (!formData.websiteUrl.trim()) newErrors.websiteUrl = 'Website URL is required';
    } else if (step === 2) {
      if (!formData.businessPhone.trim()) newErrors.businessPhone = 'Business phone is required';
      if (formData.businessPhone.trim() && !/^\d{10}$/.test(formData.businessPhone)) {
        newErrors.businessPhone = 'Phone number must be 10 digits';
      }
      if (!formData.businessEmail.trim()) newErrors.businessEmail = 'Business email is required';
      if (formData.businessEmail.trim() && !/^\S+@\S+\.\S+$/.test(formData.businessEmail)) {
        newErrors.businessEmail = 'Invalid email format';
      }
      if (formData.supportEmail.trim() && !/^\S+@\S+\.\S+$/.test(formData.supportEmail)) {
        newErrors.supportEmail = 'Invalid email format';
      }
    } else if (step === 3) {
      if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.state.trim()) newErrors.state = 'State is required';
      if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
      if (formData.pincode.trim() && !/^\d{6}$/.test(formData.pincode)) {
        newErrors.pincode = 'Pincode must be 6 digits';
      }
      if (!formData.country.trim()) newErrors.country = 'Country is required';
    } else if (step === 4) {
      if (!formData.accountHolderName.trim()) newErrors.accountHolderName = 'Account holder name is required';
      if (!formData.accountNumber.trim()) newErrors.accountNumber = 'Account number is required';
      if (!formData.ifscCode.trim()) newErrors.ifscCode = 'IFSC code is required';
      if (!formData.bankName.trim()) newErrors.bankName = 'Bank name is required';
      if (!formData.bankBranch.trim()) newErrors.bankBranch = 'Bank branch is required';
    } else if (step === 5) {
      if (!formData.logoUrl.trim()) newErrors.logoUrl = 'Logo URL is required';
      if (!formData.gstCertificateUrl.trim()) newErrors.gstCertificateUrl = 'GST certificate URL is required';
      if (!formData.cancelledChequeUrl.trim()) newErrors.cancelledChequeUrl = 'Cancelled cheque URL is required';
      if (!formData.panCardUrl.trim()) newErrors.panCardUrl = 'PAN card URL is required';
      if (!formData.identityProofUrl.trim()) newErrors.identityProofUrl = 'Identity proof URL is required';
    } else if (step === 6) {
      // Store display name and product categories are optional
      if (!formData.storeDescription.trim()) newErrors.storeDescription = 'Store description is required';
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
      
      // Get the user ID
      const userId = currentUser.userId || currentUser.id || currentUser._id;
      
      if (!userId) {
        throw new Error("User ID not found. Please log out and log in again.");
      }
      
      // Map frontend field names to backend expected field names
      const vendorData = {
        businessName: formData.businessName,
        legalBusinessName: formData.legalBusinessName,
        businessType: formData.businessType,
        gstNumber: formData.gstNumber,
        panNumber: formData.panNumber,
        businessPhone: formData.businessPhone,
        businessEmail: formData.businessEmail,
        supportEmail: formData.supportEmail,
        websiteUrl: formData.websiteUrl,
        // Address fields - include both for backward compatibility
        address: formData.addressLine1, // Required by backend
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2 || '',
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        country: formData.country,
        // Bank details
        accountHolderName: formData.accountHolderName,
        accountNumber: formData.accountNumber,
        ifscCode: formData.ifscCode,
        bankName: formData.bankName,
        bankBranch: formData.bankBranch,
        // Store details
        storeDescription: formData.storeDescription || '',
        storeDisplayName: formData.storeDisplayName || '',
        productCategories: formData.productCategories || '',
        // Document URLs
        logoUrl: formData.logoUrl || '',
        gstCertificateUrl: formData.gstCertificateUrl || '',
        cancelledChequeUrl: formData.cancelledChequeUrl || '',
        panCardUrl: formData.panCardUrl || '',
        identityProofUrl: formData.identityProofUrl || ''
      };
      
      console.log("Sending vendor profile data to backend:", vendorData);
      
      let response;
      if (profileExists) {
        // First get the vendor profile to get the vendorId
        const profileResponse = await vendorService.getVendorProfileByUserId(userId);
        if (profileResponse.success && profileResponse.data) {
          response = await vendorService.updateVendorProfile(profileResponse.data.id, vendorData);
        } else {
          throw new Error('Could not find your vendor profile');
        }
      } else {
        response = await vendorService.createVendorProfile(userId, vendorData);
      }

      if (!response.success) {
        throw new Error(response.message || 'Failed to save vendor profile');
      }
      
      // Update the vendor profile completion status in the auth context
      setVendorProfileCompleted(true);
      console.log("Vendor profile marked as completed in auth context");
      
      // Update local storage
      localStorage.setItem('greenmagic_vendor_profile_complete', 'true');
      
      setSuccess(true);
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (error) {
      console.error("Error submitting vendor profile:", error);
      
      // Extract error message from the error object
      let errorMessage = '';
      
      if (error.response?.data?.message) {
        // Backend validation error with specific message
        errorMessage = error.response.data.message;
      } else if (error.message.includes('GST')) {
        // GST validation error
        errorMessage = error.message;
      } else if (error.message.includes('Network Error')) {
        // Network error
        errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
      } else {
        // Other errors
        errorMessage = error.message || 'An unexpected error occurred. Please try again.';
      }
      
      setSubmitError(errorMessage);
      
      // Scroll to error message
      const errorElement = document.querySelector('.submit-error');
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
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
            <div className={`progress-step ${currentStep >= 4 ? 'active' : ''} ${currentStep > 4 ? 'completed' : ''}`}>
              <div className="step-indicator">{currentStep > 4 ? <CheckIcon /> : 4}</div>
              <div className="step-label">Bank Details</div>
            </div>
            <div className={`progress-step ${currentStep >= 5 ? 'active' : ''} ${currentStep > 5 ? 'completed' : ''}`}>
              <div className="step-indicator">{currentStep > 5 ? <CheckIcon /> : 5}</div>
              <div className="step-label">Documents</div>
            </div>
            <div className={`progress-step ${currentStep >= 6 ? 'active' : ''}`}>
              <div className="step-indicator">6</div>
              <div className="step-label">Store Info</div>
            </div>
          </div>
          
          {submitError && (
            <div className="submit-error">
              <div className="error-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="error-content">
                <h3>Please fix the following errors:</h3>
                {submitError.toLowerCase().includes('gst') ? (
                  <div className="error-item gst-error">
                    <p>{submitError}</p>
                    <div className="error-help">
                      <p>A valid GST number should:</p>
                      <ul>
                        <li>Be 15 characters long</li>
                        <li>Start with 2 digits (state code)</li>
                        <li>Follow with 5 letters (PAN number)</li>
                        <li>Have 4 digits</li>
                        <li>End with 4 characters (1 letter, 1 number/letter, Z, 1 number/letter)</li>
                      </ul>
                      <p className="error-example">Example: 29ABCDE1234F1Z5</p>
                      <p className="error-tip">Tip: Make sure there are no spaces or special characters in your GST number.</p>
                    </div>
                  </div>
                ) : submitError.toLowerCase().includes('network') ? (
                  <div className="error-item network-error">
                    <p>{submitError}</p>
                    <div className="error-help">
                      <p>Troubleshooting steps:</p>
                      <ul>
                        <li>Check your internet connection</li>
                        <li>Try refreshing the page</li>
                        <li>If the problem persists, please try again later</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  submitError.split('\n').map((error, index) => (
                    <p key={index} className="error-item">{error}</p>
                  ))
                )}
              </div>
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
                  <label htmlFor="legalBusinessName">Legal Business Name (Optional)</label>
                  <div className="input-wrapper">
                    <span className="input-icon"><BusinessIcon /></span>
                    <input
                      type="text"
                      id="legalBusinessName"
                      name="legalBusinessName"
                      value={formData.legalBusinessName}
                      onChange={handleChange}
                      placeholder="Enter your legal business name"
                      className={errors.legalBusinessName ? 'input-error' : ''}
                    />
                  </div>
                  {errors.legalBusinessName && <span className="error-message">{errors.legalBusinessName}</span>}
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
                      <option value="PROPRIETORSHIP">Proprietorship</option>
                      <option value="PARTNERSHIP">Partnership</option>
                      <option value="PRIVATE_LIMITED">Private Limited</option>
                      <option value="LIMITED_COMPANY">Limited Company</option>
                      <option value="LLP">LLP</option>
                      <option value="DISTRIBUTOR">Distributor</option>
                      <option value="MANUFACTURER">Manufacturer</option>
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

                <div className="form-group">
                  <label htmlFor="panNumber">PAN Number</label>
                  <div className="input-wrapper">
                    <span className="input-icon"><IdIcon /></span>
                    <input
                      type="text"
                      id="panNumber"
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleChange}
                      placeholder="Enter your PAN number"
                      className={errors.panNumber ? 'input-error' : ''}
                    />
                  </div>
                  {errors.panNumber && <span className="error-message">{errors.panNumber}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="websiteUrl">Website URL</label>
                  <div className="input-wrapper">
                    <span className="input-icon"><BusinessIcon /></span>
                    <input
                      type="text"
                      id="websiteUrl"
                      name="websiteUrl"
                      value={formData.websiteUrl}
                      onChange={handleChange}
                      placeholder="Enter your website URL"
                      className={errors.websiteUrl ? 'input-error' : ''}
                    />
                  </div>
                  {errors.websiteUrl && <span className="error-message">{errors.websiteUrl}</span>}
                </div>
              </>
            )}
            
            {/* Step 2: Contact Information */}
            {currentStep === 2 && (
              <>
                <h2 className="step-title">Contact Information</h2>
                <div className="form-group">
                  <label htmlFor="businessPhone">Business Phone</label>
                  <div className="input-wrapper">
                    <span className="input-icon"><PhoneIcon /></span>
                    <input
                      type="tel"
                      id="businessPhone"
                      name="businessPhone"
                      value={formData.businessPhone}
                      onChange={handleChange}
                      placeholder="Enter your business phone"
                      className={errors.businessPhone ? 'input-error' : ''}
                    />
                  </div>
                  {errors.businessPhone && <span className="error-message">{errors.businessPhone}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="businessEmail">Business Email</label>
                  <div className="input-wrapper">
                    <span className="input-icon"><EmailIcon /></span>
                    <input
                      type="email"
                      id="businessEmail"
                      name="businessEmail"
                      value={formData.businessEmail}
                      onChange={handleChange}
                      placeholder="Enter your business email"
                      className={errors.businessEmail ? 'input-error' : ''}
                    />
                  </div>
                  {errors.businessEmail && <span className="error-message">{errors.businessEmail}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="supportEmail">Support Email (Optional)</label>
                  <div className="input-wrapper">
                    <span className="input-icon"><EmailIcon /></span>
                    <input
                      type="email"
                      id="supportEmail"
                      name="supportEmail"
                      value={formData.supportEmail}
                      onChange={handleChange}
                      placeholder="Enter your support email"
                      className={errors.supportEmail ? 'input-error' : ''}
                    />
                  </div>
                  {errors.supportEmail && <span className="error-message">{errors.supportEmail}</span>}
                </div>
              </>
            )}
            
            {/* Step 3: Address Information */}
            {currentStep === 3 && (
              <>
                <h2 className="step-title">Address Information</h2>
                <div className="form-group full-width">
                  <label htmlFor="addressLine1">Address Line 1</label>
                  <div className="textarea-wrapper">
                    <textarea
                      id="addressLine1"
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleChange}
                      placeholder="Enter your business address"
                      className={errors.addressLine1 ? 'textarea-error' : ''}
                    />
                  </div>
                  {errors.addressLine1 && <span className="error-message">{errors.addressLine1}</span>}
                </div>
                
                <div className="form-group full-width">
                  <label htmlFor="addressLine2">Address Line 2 (Optional)</label>
                  <div className="textarea-wrapper">
                    <textarea
                      id="addressLine2"
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleChange}
                      placeholder="Apartment, suite, unit, building, floor, etc."
                      className={errors.addressLine2 ? 'textarea-error' : ''}
                    />
                  </div>
                  {errors.addressLine2 && <span className="error-message">{errors.addressLine2}</span>}
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
                
                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <div className="input-wrapper">
                    <span className="input-icon"><LocationIcon /></span>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="Enter your country"
                      className={errors.country ? 'input-error' : ''}
                    />
                  </div>
                  {errors.country && <span className="error-message">{errors.country}</span>}
                </div>
              </>
            )}
            
            {/* Step 4: Bank Details */}
            {currentStep === 4 && (
              <>
                <h2 className="step-title">Bank Details</h2>
                <div className="form-group">
                  <label htmlFor="accountHolderName">Account Holder Name</label>
                  <div className="input-wrapper">
                    <span className="input-icon"><IdIcon /></span>
                    <input
                      type="text"
                      id="accountHolderName"
                      name="accountHolderName"
                      value={formData.accountHolderName}
                      onChange={handleChange}
                      placeholder="Enter your account holder name"
                      className={errors.accountHolderName ? 'input-error' : ''}
                    />
                  </div>
                  {errors.accountHolderName && <span className="error-message">{errors.accountHolderName}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="accountNumber">Account Number</label>
                  <div className="input-wrapper">
                    <span className="input-icon"><IdIcon /></span>
                    <input
                      type="text"
                      id="accountNumber"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleChange}
                      placeholder="Enter your account number"
                      className={errors.accountNumber ? 'input-error' : ''}
                    />
                  </div>
                  {errors.accountNumber && <span className="error-message">{errors.accountNumber}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="ifscCode">IFSC Code</label>
                  <div className="input-wrapper">
                    <span className="input-icon"><IdIcon /></span>
                    <input
                      type="text"
                      id="ifscCode"
                      name="ifscCode"
                      value={formData.ifscCode}
                      onChange={handleChange}
                      placeholder="Enter your IFSC code"
                      className={errors.ifscCode ? 'input-error' : ''}
                    />
                  </div>
                  {errors.ifscCode && <span className="error-message">{errors.ifscCode}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="bankName">Bank Name</label>
                  <div className="input-wrapper">
                    <span className="input-icon"><IdIcon /></span>
                    <input
                      type="text"
                      id="bankName"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleChange}
                      placeholder="Enter your bank name"
                      className={errors.bankName ? 'input-error' : ''}
                    />
                  </div>
                  {errors.bankName && <span className="error-message">{errors.bankName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="bankBranch">Bank Branch</label>
                  <div className="input-wrapper">
                    <span className="input-icon"><IdIcon /></span>
                    <input
                      type="text"
                      id="bankBranch"
                      name="bankBranch"
                      value={formData.bankBranch}
                      onChange={handleChange}
                      placeholder="Enter your bank branch"
                      className={errors.bankBranch ? 'input-error' : ''}
                    />
                  </div>
                  {errors.bankBranch && <span className="error-message">{errors.bankBranch}</span>}
                </div>
              </>
            )}
            
            {/* Step 5: Document URLs */}
            {currentStep === 5 && (
              <>
                <h2 className="step-title">Document URLs</h2>
                <div className="form-group">
                  <label htmlFor="logoUrl">Logo URL</label>
                  <div className="input-wrapper">
                    <span className="input-icon"><IdIcon /></span>
                    <input
                      type="text"
                      id="logoUrl"
                      name="logoUrl"
                      value={formData.logoUrl}
                      onChange={handleChange}
                      placeholder="Enter your logo URL"
                      className={errors.logoUrl ? 'input-error' : ''}
                    />
                  </div>
                  {errors.logoUrl && <span className="error-message">{errors.logoUrl}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="gstCertificateUrl">GST Certificate URL</label>
                  <div className="input-wrapper">
                    <span className="input-icon"><IdIcon /></span>
                    <input
                      type="text"
                      id="gstCertificateUrl"
                      name="gstCertificateUrl"
                      value={formData.gstCertificateUrl}
                      onChange={handleChange}
                      placeholder="Enter your GST certificate URL"
                      className={errors.gstCertificateUrl ? 'input-error' : ''}
                    />
                  </div>
                  {errors.gstCertificateUrl && <span className="error-message">{errors.gstCertificateUrl}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="cancelledChequeUrl">Cancelled Cheque URL</label>
                  <div className="input-wrapper">
                    <span className="input-icon"><IdIcon /></span>
                    <input
                      type="text"
                      id="cancelledChequeUrl"
                      name="cancelledChequeUrl"
                      value={formData.cancelledChequeUrl}
                      onChange={handleChange}
                      placeholder="Enter your cancelled cheque URL"
                      className={errors.cancelledChequeUrl ? 'input-error' : ''}
                    />
                  </div>
                  {errors.cancelledChequeUrl && <span className="error-message">{errors.cancelledChequeUrl}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="panCardUrl">PAN Card URL</label>
                  <div className="input-wrapper">
                    <span className="input-icon"><IdIcon /></span>
                    <input
                      type="text"
                      id="panCardUrl"
                      name="panCardUrl"
                      value={formData.panCardUrl}
                      onChange={handleChange}
                      placeholder="Enter your PAN card URL"
                      className={errors.panCardUrl ? 'input-error' : ''}
                    />
                  </div>
                  {errors.panCardUrl && <span className="error-message">{errors.panCardUrl}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="identityProofUrl">Identity Proof URL</label>
                  <div className="input-wrapper">
                    <span className="input-icon"><IdIcon /></span>
                    <input
                      type="text"
                      id="identityProofUrl"
                      name="identityProofUrl"
                      value={formData.identityProofUrl}
                      onChange={handleChange}
                      placeholder="Enter your identity proof URL"
                      className={errors.identityProofUrl ? 'input-error' : ''}
                    />
                  </div>
                  {errors.identityProofUrl && <span className="error-message">{errors.identityProofUrl}</span>}
                </div>
              </>
            )}
            
            {/* Step 6: Description and Terms */}
            {currentStep === 6 && (
              <>
                <h2 className="step-title">Store Information</h2>
                <div className="form-group">
                  <label htmlFor="storeDisplayName">Store Display Name (Optional)</label>
                  <div className="input-wrapper">
                    <span className="input-icon"><DescriptionIcon /></span>
                    <input
                      type="text"
                      id="storeDisplayName"
                      name="storeDisplayName"
                      value={formData.storeDisplayName}
                      onChange={handleChange}
                      placeholder="Enter your store display name"
                      className={errors.storeDisplayName ? 'input-error' : ''}
                    />
                  </div>
                  {errors.storeDisplayName && <span className="error-message">{errors.storeDisplayName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="productCategories">Product Categories (Optional)</label>
                  <div className="input-wrapper">
                    <span className="input-icon"><DescriptionIcon /></span>
                    <input
                      type="text"
                      id="productCategories"
                      name="productCategories"
                      value={formData.productCategories}
                      onChange={handleChange}
                      placeholder="Enter your product categories"
                      className={errors.productCategories ? 'input-error' : ''}
                    />
                  </div>
                  {errors.productCategories && <span className="error-message">{errors.productCategories}</span>}
                </div>

                <div className="form-group full-width">
                  <label htmlFor="storeDescription">Store Description</label>
                  <div className="textarea-wrapper">
                    <textarea
                      id="storeDescription"
                      name="storeDescription"
                      value={formData.storeDescription}
                      onChange={handleChange}
                      placeholder="Describe your store"
                      className={errors.storeDescription ? 'textarea-error' : ''}
                    />
                  </div>
                  {errors.storeDescription && <span className="error-message">{errors.storeDescription}</span>}
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
              
              {currentStep < 6 ? (
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