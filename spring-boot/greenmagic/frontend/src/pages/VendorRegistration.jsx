import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Mail, Phone, FileText, MapPin, CreditCard, Upload, User, ArrowRight, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import vendorService from '../services/vendorService';
import './VendorRegistration.css';

const VendorRegistration = () => {
  const navigate = useNavigate();
  const { currentUser, setVendorProfileCompleted } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [formData, setFormData] = useState({
    // Business Details
    businessName: '',
    legalBusinessName: '',
    gstNumber: '',
    panNumber: '',
    businessType: 'PROPRIETORSHIP',

    // Business Contact
    businessPhone: '',
    businessEmail: '',
    supportEmail: '',
    websiteUrl: '',
    
    // Business Address
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    
    // Bank Details
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    bankBranch: '',
    
    // Store Info
    storeDisplayName: '',
    storeDescription: '',
    productCategories: '',
    
    // Documents
    logoUrl: '',
    gstCertificateUrl: '',
    cancelledChequeUrl: '',
    panCardUrl: '',
    identityProofUrl: ''
  });
  const [files, setFiles] = useState({
    logoFile: null,
    gstCertificateFile: null,
    cancelledChequeFile: null,
    panCardFile: null,
    identityProofFile: null
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  // Check if user is logged in and has vendor role
  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { state: { from: '/vendor-registration' } });
      return;
    }

    if (currentUser.roleName !== 'VENDOR') {
      navigate('/');
      return;
    }
    
    // Check if vendor profile exists
    const checkVendorProfile = async () => {
      try {
        setCheckingProfile(true);
        // First check if profile exists
        const profileExists = await vendorService.checkVendorProfileExists(currentUser.userId);
        
        if (profileExists.success && profileExists.data) {
          // Profile already exists, get the details
          const profileResponse = await vendorService.getVendorProfileByUserId(currentUser.userId);
          
          if (profileResponse.success && profileResponse.data) {
            // Pre-fill form with existing data
            const profile = profileResponse.data;
            setFormData(prevData => ({
              ...prevData,
              businessName: profile.businessName || '',
              legalBusinessName: profile.legalBusinessName || '',
              gstNumber: profile.gstNumber || '',
              panNumber: profile.panNumber || '',
              businessType: profile.businessType || 'PROPRIETORSHIP',
              businessPhone: profile.businessPhone || '',
              businessEmail: profile.businessEmail || '',
              supportEmail: profile.supportEmail || '',
              websiteUrl: profile.websiteUrl || '',
              addressLine1: profile.addressLine1 || '',
              addressLine2: profile.addressLine2 || '',
              city: profile.city || '',
              state: profile.state || '',
              pincode: profile.pincode || '',
              country: profile.country || 'India',
              storeDisplayName: profile.storeDisplayName || '',
              storeDescription: profile.storeDescription || ''
            }));
            
            // If profile is already complete, redirect to dashboard
            if (profile.status !== 'INCOMPLETE') {
              setVendorProfileCompleted();
              navigate('/dashboard');
            }
          }
        }
      } catch (error) {
        // Just log the error but don't block the user experience
        // This allows the form to be shown even if the check fails
        console.error('Error checking vendor profile:', error);
      } finally {
        setCheckingProfile(false);
      }
    };
    
    checkVendorProfile();
  }, [currentUser, navigate, setVendorProfileCompleted]);

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

  // Handle file input changes
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      const fileKey = `${name}File`;
      setFiles(prev => ({
        ...prev,
        [fileKey]: files[0]
      }));
      
      // Preview file (if it's an image)
      if (files[0].type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFormData(prev => ({
            ...prev,
            [`${name}Url`]: e.target.result
          }));
        };
        reader.readAsDataURL(files[0]);
      }
      
      // Clear errors
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    }
  };

  // Validate current step
  const validateStep = () => {
    const newErrors = {};

    if (currentStep === 1) {
      // Business Details validation
    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }

    if (!formData.gstNumber.trim()) {
      newErrors.gstNumber = 'GST number is required';
      } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstNumber)) {
      newErrors.gstNumber = 'Please enter a valid GST number';
    }

      if (formData.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)) {
        newErrors.panNumber = 'Please enter a valid PAN number';
      }
    }
    
    else if (currentStep === 2) {
      // Business Contact validation
    if (!formData.businessPhone.trim()) {
      newErrors.businessPhone = 'Business phone is required';
    }

    if (!formData.businessEmail.trim()) {
      newErrors.businessEmail = 'Business email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.businessEmail)) {
      newErrors.businessEmail = 'Please enter a valid email address';
    }

      if (formData.supportEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.supportEmail)) {
        newErrors.supportEmail = 'Please enter a valid email address';
      }
    }
    
    else if (currentStep === 3) {
      // Business Address validation
      if (!formData.addressLine1.trim()) {
        newErrors.addressLine1 = 'Address line 1 is required';
      }
      
      if (!formData.city.trim()) {
        newErrors.city = 'City is required';
      }
      
      if (!formData.state.trim()) {
        newErrors.state = 'State is required';
      }
      
      if (!formData.pincode.trim()) {
        newErrors.pincode = 'Pincode is required';
      } else if (!/^[0-9]{6}$/.test(formData.pincode)) {
        newErrors.pincode = 'Please enter a valid 6-digit pincode';
      }
      
      if (!formData.country.trim()) {
        newErrors.country = 'Country is required';
      }
    }
    
    else if (currentStep === 4) {
      // Store Info validation
      if (!formData.storeDisplayName.trim()) {
        newErrors.storeDisplayName = 'Store display name is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNextStep = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  // Handle file upload
  const uploadFiles = async () => {
    const filesToUpload = Object.entries(files).filter(([_, file]) => file !== null);
    
    if (filesToUpload.length === 0) {
      return true; // No files to upload
    }
    
    try {
      for (const [fileKey, file] of filesToUpload) {
        const documentType = fileKey.replace('File', '');
        
        setUploadProgress(prev => ({
          ...prev,
          [documentType]: 0
        }));
        
        // Upload file
        const uploadResult = await vendorService.uploadDocument(
          currentUser.userId,
          documentType,
          file,
          (progress) => {
            setUploadProgress(prev => ({
              ...prev,
              [documentType]: progress
            }));
          }
        );
        
        // Set URL in form data
        setFormData(prev => ({
          ...prev,
          [`${documentType}Url`]: uploadResult.fileUrl
        }));
      }
      
      return true;
    } catch (error) {
      setErrors({ submit: 'Failed to upload files. Please try again.' });
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep()) {
      return;
    }

    setLoading(true);

    try {
      // Upload files first
      const filesUploaded = await uploadFiles();
      
      if (!filesUploaded) {
        setLoading(false);
        return;
      }
      
      // Check if profile exists first
      const profileExists = await vendorService.checkVendorProfileExists(currentUser.userId);
      
      let response;
      if (profileExists.success && profileExists.data) {
        // Update existing profile
        const existingProfile = await vendorService.getVendorProfileByUserId(currentUser.userId);
        if (existingProfile.success && existingProfile.data) {
          response = await vendorService.updateVendorProfile(
            existingProfile.data.vendorId,
            formData
          );
        }
      } else {
        // Create new profile
        response = await vendorService.createVendorProfile(
          currentUser.userId,
          formData
        );
      }
      
      if (response && response.success) {
        setVendorProfileCompleted();
        setSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else {
        setErrors({ submit: (response && response.message) || 'Registration failed' });
      }
    } catch (error) {
      setErrors({ submit: error.message || 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="vendor-registration-page">
        <div className="vendor-registration-container">
          <div className="success-message">
            <CheckCircle size={50} />
            <h2>Vendor Profile Created Successfully!</h2>
            <p>Your profile has been created and is pending approval. You will be redirected to dashboard shortly.</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (checkingProfile) {
    return (
      <div className="vendor-registration-page">
        <div className="vendor-registration-container">
          <div className="loading-message">
            <div className="spinner"></div>
            <h2>Checking Profile Status...</h2>
            <p>Please wait while we check your vendor profile status.</p>
          </div>
        </div>
      </div>
    );
  }

  // Render progress bar
  const renderProgressBar = () => {
    const steps = ['Business Details', 'Business Contact', 'Address', 'Store Info', 'Documents'];

  return (
      <div className="progress-bar">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className={`progress-step ${index + 1 === currentStep ? 'active' : ''} 
                      ${index + 1 < currentStep ? 'completed' : ''}`}
          >
            <div className="step-indicator">{index + 1}</div>
            <div className="step-label">{step}</div>
          </div>
        ))}
            </div>
    );
  };

  // Render form based on current step
  const renderForm = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h2 className="step-title">Business Details</h2>
            
            {/* Business Name Field */}
            <div className="form-group">
              <label htmlFor="businessName">Business Name *</label>
              <div className="input-wrapper">
                <Building className="input-icon" size={20} />
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  className={errors.businessName ? 'input-error' : ''}
                  placeholder="Enter your business name"
                  disabled={loading}
                />
              </div>
              {errors.businessName && <span className="error-message">{errors.businessName}</span>}
            </div>
            
            {/* Legal Business Name Field */}
            <div className="form-group">
              <label htmlFor="legalBusinessName">Legal Business Name (if different)</label>
              <div className="input-wrapper">
                <Building className="input-icon" size={20} />
                <input
                  type="text"
                  id="legalBusinessName"
                  name="legalBusinessName"
                  value={formData.legalBusinessName}
                  onChange={handleChange}
                  placeholder="Enter legal business name (optional)"
                  disabled={loading}
                />
              </div>
            </div>

            {/* GST Number Field */}
            <div className="form-group">
              <label htmlFor="gstNumber">GST Number *</label>
              <div className="input-wrapper">
                <FileText className="input-icon" size={20} />
                <input
                  type="text"
                  id="gstNumber"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  className={errors.gstNumber ? 'input-error' : ''}
                  placeholder="Enter your GST number (e.g., 29ABCDE1234F1Z5)"
                  disabled={loading}
                />
              </div>
              {errors.gstNumber && <span className="error-message">{errors.gstNumber}</span>}
            </div>
            
            {/* PAN Number Field */}
            <div className="form-group">
              <label htmlFor="panNumber">PAN Number</label>
              <div className="input-wrapper">
                <FileText className="input-icon" size={20} />
                <input
                  type="text"
                  id="panNumber"
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleChange}
                  className={errors.panNumber ? 'input-error' : ''}
                  placeholder="Enter your PAN number (optional)"
                  disabled={loading}
                />
              </div>
              {errors.panNumber && <span className="error-message">{errors.panNumber}</span>}
            </div>
            
            {/* Business Type Field */}
            <div className="form-group">
              <label htmlFor="businessType">Business Type *</label>
              <div className="input-wrapper">
                <Building className="input-icon" size={20} />
                <select
                  id="businessType"
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="PROPRIETORSHIP">Proprietorship</option>
                  <option value="PARTNERSHIP">Partnership</option>
                  <option value="PRIVATE_LIMITED">Private Limited</option>
                  <option value="LIMITED_COMPANY">Limited Company</option>
                  <option value="LLP">LLP</option>
                  <option value="INDIVIDUAL">Individual</option>
                  <option value="DISTRIBUTOR">Distributor</option>
                  <option value="MANUFACTURER">Manufacturer</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
          </>
        );
        
      case 2:
        return (
          <>
            <h2 className="step-title">Business Contact Information</h2>

            {/* Business Phone Field */}
            <div className="form-group">
              <label htmlFor="businessPhone">Business Phone *</label>
              <div className="input-wrapper">
                <Phone className="input-icon" size={20} />
                <input
                  type="tel"
                  id="businessPhone"
                  name="businessPhone"
                  value={formData.businessPhone}
                  onChange={handleChange}
                  className={errors.businessPhone ? 'input-error' : ''}
                  placeholder="Enter your business phone number"
                  disabled={loading}
                />
              </div>
              {errors.businessPhone && <span className="error-message">{errors.businessPhone}</span>}
            </div>

            {/* Business Email Field */}
            <div className="form-group">
              <label htmlFor="businessEmail">Business Email *</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={20} />
                <input
                  type="email"
                  id="businessEmail"
                  name="businessEmail"
                  value={formData.businessEmail}
                  onChange={handleChange}
                  className={errors.businessEmail ? 'input-error' : ''}
                  placeholder="Enter your business email address"
                  disabled={loading}
                />
              </div>
              {errors.businessEmail && <span className="error-message">{errors.businessEmail}</span>}
            </div>

            {/* Support Email Field */}
            <div className="form-group">
              <label htmlFor="supportEmail">Support Email</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={20} />
                <input
                  type="email"
                  id="supportEmail"
                  name="supportEmail"
                  value={formData.supportEmail}
                  onChange={handleChange}
                  className={errors.supportEmail ? 'input-error' : ''}
                  placeholder="Enter support email address (optional)"
                  disabled={loading}
                />
              </div>
              {errors.supportEmail && <span className="error-message">{errors.supportEmail}</span>}
            </div>
            
            {/* Website URL Field */}
            <div className="form-group">
              <label htmlFor="websiteUrl">Website URL</label>
              <div className="input-wrapper">
                <Globe className="input-icon" size={20} />
                <input
                  type="url"
                  id="websiteUrl"
                  name="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={handleChange}
                  placeholder="Enter your website URL (optional)"
                  disabled={loading}
                />
              </div>
            </div>
          </>
        );
        
      case 3:
        return (
          <>
            <h2 className="step-title">Business Address</h2>
            
            {/* Address Line 1 Field */}
            <div className="form-group">
              <label htmlFor="addressLine1">Address Line 1 *</label>
              <div className="input-wrapper">
                <MapPin className="input-icon" size={20} />
                <input
                  type="text"
                  id="addressLine1"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  className={errors.addressLine1 ? 'input-error' : ''}
                  placeholder="Enter address line 1"
                  disabled={loading}
                />
              </div>
              {errors.addressLine1 && <span className="error-message">{errors.addressLine1}</span>}
            </div>
            
            {/* Address Line 2 Field */}
            <div className="form-group">
              <label htmlFor="addressLine2">Address Line 2</label>
              <div className="input-wrapper">
                <MapPin className="input-icon" size={20} />
                <input
                  type="text"
                  id="addressLine2"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleChange}
                  placeholder="Enter address line 2 (optional)"
                  disabled={loading}
                />
              </div>
            </div>
            
            {/* City Field */}
            <div className="form-group">
              <label htmlFor="city">City *</label>
              <div className="input-wrapper">
                <MapPin className="input-icon" size={20} />
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={errors.city ? 'input-error' : ''}
                  placeholder="Enter city"
                  disabled={loading}
                />
              </div>
              {errors.city && <span className="error-message">{errors.city}</span>}
            </div>
            
            {/* Two columns for State and Pincode */}
            <div className="form-row">
              <div className="form-group form-col">
                <label htmlFor="state">State *</label>
                <div className="input-wrapper">
                  <MapPin className="input-icon" size={20} />
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={errors.state ? 'input-error' : ''}
                    placeholder="Enter state"
                    disabled={loading}
                  />
                </div>
                {errors.state && <span className="error-message">{errors.state}</span>}
              </div>
              
              <div className="form-group form-col">
                <label htmlFor="pincode">Pincode *</label>
                <div className="input-wrapper">
                  <MapPin className="input-icon" size={20} />
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className={errors.pincode ? 'input-error' : ''}
                    placeholder="Enter pincode"
                    disabled={loading}
                  />
                </div>
                {errors.pincode && <span className="error-message">{errors.pincode}</span>}
              </div>
            </div>
            
            {/* Country Field */}
            <div className="form-group">
              <label htmlFor="country">Country *</label>
              <div className="input-wrapper">
                <MapPin className="input-icon" size={20} />
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className={errors.country ? 'input-error' : ''}
                  placeholder="Enter country"
                  disabled={loading}
                />
              </div>
              {errors.country && <span className="error-message">{errors.country}</span>}
            </div>
          </>
        );
        
      case 4:
        return (
          <>
            <h2 className="step-title">Store Details</h2>
            
            {/* Store Display Name Field */}
            <div className="form-group">
              <label htmlFor="storeDisplayName">Store Display Name *</label>
              <div className="input-wrapper">
                <Building className="input-icon" size={20} />
                <input
                  type="text"
                  id="storeDisplayName"
                  name="storeDisplayName"
                  value={formData.storeDisplayName}
                  onChange={handleChange}
                  className={errors.storeDisplayName ? 'input-error' : ''}
                  placeholder="Enter store display name"
                  disabled={loading}
                />
              </div>
              {errors.storeDisplayName && <span className="error-message">{errors.storeDisplayName}</span>}
            </div>

            {/* Store Description Field */}
            <div className="form-group">
              <label htmlFor="storeDescription">Store Description</label>
              <div className="textarea-wrapper">
                <textarea
                  id="storeDescription"
                  name="storeDescription"
                  value={formData.storeDescription}
                  onChange={handleChange}
                  placeholder="Describe your store (will be shown to customers)"
                  disabled={loading}
                  rows={4}
                />
              </div>
            </div>

            {/* Product Categories Field */}
            <div className="form-group">
              <label htmlFor="productCategories">Product Categories</label>
              <div className="input-wrapper">
                <Tag className="input-icon" size={20} />
                <input
                  type="text"
                  id="productCategories"
                  name="productCategories"
                  value={formData.productCategories}
                  onChange={handleChange}
                  placeholder="Enter product categories (comma separated)"
                  disabled={loading}
                />
              </div>
            </div>
            
            {/* Bank Details Section */}
            <h3 className="section-subtitle">Bank Details</h3>
            
            {/* Account Holder Name Field */}
            <div className="form-group">
              <label htmlFor="accountHolderName">Account Holder Name</label>
              <div className="input-wrapper">
                <User className="input-icon" size={20} />
                <input
                  type="text"
                  id="accountHolderName"
                  name="accountHolderName"
                  value={formData.accountHolderName}
                  onChange={handleChange}
                  placeholder="Enter account holder name"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Account Number Field */}
            <div className="form-group">
              <label htmlFor="accountNumber">Account Number</label>
              <div className="input-wrapper">
                <CreditCard className="input-icon" size={20} />
                <input
                  type="text"
                  id="accountNumber"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  placeholder="Enter account number"
                  disabled={loading}
                />
              </div>
            </div>

            {/* IFSC Code Field */}
            <div className="form-group">
              <label htmlFor="ifscCode">IFSC Code</label>
              <div className="input-wrapper">
                <Building className="input-icon" size={20} />
                <input
                  type="text"
                  id="ifscCode"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleChange}
                  className={errors.ifscCode ? 'input-error' : ''}
                  placeholder="Enter IFSC code"
                  disabled={loading}
                />
              </div>
              {errors.ifscCode && <span className="error-message">{errors.ifscCode}</span>}
            </div>
            
            {/* Two columns for Bank Name and Branch */}
            <div className="form-row">
              <div className="form-group form-col">
                <label htmlFor="bankName">Bank Name</label>
                <div className="input-wrapper">
                  <Building className="input-icon" size={20} />
                  <input
                    type="text"
                    id="bankName"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    placeholder="Enter bank name"
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="form-group form-col">
                <label htmlFor="bankBranch">Bank Branch</label>
                <div className="input-wrapper">
                  <Building className="input-icon" size={20} />
                  <input
                    type="text"
                    id="bankBranch"
                    name="bankBranch"
                    value={formData.bankBranch}
                    onChange={handleChange}
                    placeholder="Enter bank branch"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </>
        );
        
      case 5:
        return (
          <>
            <h2 className="step-title">Upload Documents</h2>
            <p className="step-description">Upload supporting documents for your business verification</p>
            
            {/* Logo Upload */}
            <div className="form-group">
              <label htmlFor="logo">Business Logo</label>
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  id="logo"
                  name="logo"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={loading}
                />
                <div className="file-upload-box">
                  {formData.logoUrl ? (
                    <img src={formData.logoUrl} alt="Logo Preview" className="file-preview" />
                  ) : (
                    <>
                      <Upload size={40} />
                      <span>Upload Logo</span>
                    </>
                  )}
                </div>
              </div>
              {uploadProgress.logo > 0 && uploadProgress.logo < 100 && (
                <div className="upload-progress">
                  <div className="progress-bar" style={{ width: `${uploadProgress.logo}%` }}></div>
                </div>
              )}
            </div>
            
            {/* GST Certificate Upload */}
            <div className="form-group">
              <label htmlFor="gstCertificate">GST Certificate</label>
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  id="gstCertificate"
                  name="gstCertificate"
                  accept=".pdf,image/*"
                  onChange={handleFileChange}
                  disabled={loading}
                />
                <div className="file-upload-box">
                  {formData.gstCertificateUrl ? (
                    <div className="file-uploaded">
                      <CheckCircle size={30} />
                      <span>File uploaded</span>
                    </div>
                  ) : (
                    <>
                      <Upload size={40} />
                      <span>Upload GST Certificate</span>
                    </>
                  )}
                </div>
              </div>
              {uploadProgress.gstCertificate > 0 && uploadProgress.gstCertificate < 100 && (
                <div className="upload-progress">
                  <div className="progress-bar" style={{ width: `${uploadProgress.gstCertificate}%` }}></div>
                </div>
              )}
            </div>
            
            {/* Cancelled Cheque Upload */}
            <div className="form-group">
              <label htmlFor="cancelledCheque">Cancelled Cheque or Passbook</label>
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  id="cancelledCheque"
                  name="cancelledCheque"
                  accept=".pdf,image/*"
                  onChange={handleFileChange}
                  disabled={loading}
                />
                <div className="file-upload-box">
                  {formData.cancelledChequeUrl ? (
                    <div className="file-uploaded">
                      <CheckCircle size={30} />
                      <span>File uploaded</span>
                    </div>
                  ) : (
                    <>
                      <Upload size={40} />
                      <span>Upload Cancelled Cheque</span>
                    </>
                  )}
                </div>
              </div>
              {uploadProgress.cancelledCheque > 0 && uploadProgress.cancelledCheque < 100 && (
                <div className="upload-progress">
                  <div className="progress-bar" style={{ width: `${uploadProgress.cancelledCheque}%` }}></div>
                </div>
              )}
            </div>
            
            {/* PAN Card Upload */}
            <div className="form-group">
              <label htmlFor="panCard">PAN Card (Optional)</label>
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  id="panCard"
                  name="panCard"
                  accept=".pdf,image/*"
                  onChange={handleFileChange}
                  disabled={loading}
                />
                <div className="file-upload-box">
                  {formData.panCardUrl ? (
                    <div className="file-uploaded">
                      <CheckCircle size={30} />
                      <span>File uploaded</span>
                    </div>
                  ) : (
                    <>
                      <Upload size={40} />
                      <span>Upload PAN Card</span>
                    </>
                  )}
                </div>
              </div>
              {uploadProgress.panCard > 0 && uploadProgress.panCard < 100 && (
                <div className="upload-progress">
                  <div className="progress-bar" style={{ width: `${uploadProgress.panCard}%` }}></div>
                </div>
              )}
            </div>
            
            {/* Identity Proof Upload */}
            <div className="form-group">
              <label htmlFor="identityProof">Identity Proof (Optional)</label>
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  id="identityProof"
                  name="identityProof"
                  accept=".pdf,image/*"
                  onChange={handleFileChange}
                  disabled={loading}
                />
                <div className="file-upload-box">
                  {formData.identityProofUrl ? (
                    <div className="file-uploaded">
                      <CheckCircle size={30} />
                      <span>File uploaded</span>
                    </div>
                  ) : (
                    <>
                      <Upload size={40} />
                      <span>Upload Identity Proof</span>
                    </>
                  )}
                </div>
              </div>
              {uploadProgress.identityProof > 0 && uploadProgress.identityProof < 100 && (
                <div className="upload-progress">
                  <div className="progress-bar" style={{ width: `${uploadProgress.identityProof}%` }}></div>
                </div>
              )}
            </div>
            
            {errors.submit && (
              <div className="error-alert">
                <AlertCircle size={20} />
                <span>{errors.submit}</span>
              </div>
            )}
          </>
        );
        
      default:
        return null;
    }
  };

  // Render navigation buttons
  const renderNavButtons = () => {
    return (
      <div className="form-actions">
        {currentStep > 1 && (
          <button
            type="button"
            className="btn-secondary"
            onClick={handlePrevStep}
            disabled={loading}
          >
            <ArrowLeft size={18} />
            Back
          </button>
        )}
        
        {currentStep < 5 ? (
          <button
            type="button"
            className="btn-primary"
            onClick={handleNextStep}
            disabled={loading}
          >
            Next
            <ArrowRight size={18} />
          </button>
        ) : (
            <button 
              type="submit" 
            className="btn-primary"
              disabled={loading}
            >
            {loading ? 'Submitting...' : 'Complete Registration'}
            </button>
        )}
      </div>
    );
  };

  return (
    <div className="vendor-registration-page">
      <div className="vendor-registration-container">
        <div className="vendor-registration-card">
          <div className="vendor-registration-header">
            <h1>Complete Your Vendor Profile</h1>
            <p>Provide your business details to start selling on GreenMagic</p>
          </div>

          <div className="status-info pending">
            <AlertCircle size={24} />
            <div className="status-text">
              <h3>Approval Required</h3>
              <p>Your vendor profile will be reviewed by our team before you can start selling.</p>
            </div>
          </div>

          {renderProgressBar()}

          <form onSubmit={handleSubmit} className="vendor-registration-form">
            {renderForm()}
            {renderNavButtons()}
          </form>
        </div>
      </div>
    </div>
  );
};

export default VendorRegistration; 