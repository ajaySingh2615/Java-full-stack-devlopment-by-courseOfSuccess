import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Package, 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Building,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Info
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import vendorService from '../services/vendorService';
import './Dashboard.css';

const Dashboard = () => {
  const { currentUser, isVendor, getVendorStatus, isVendorProfileComplete } = useAuth();
  const [vendorProfile, setVendorProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only fetch vendor profile if user is a vendor with completed profile
    if (currentUser && isVendor() && isVendorProfileComplete()) {
      fetchVendorProfile();
    }
  }, [currentUser, isVendor, isVendorProfileComplete]);

  const fetchVendorProfile = async () => {
    try {
      setLoading(true);
      const response = await vendorService.getVendorProfileByUserId(currentUser.userId);
      if (response.success) {
        setVendorProfile(response.data);
      } else {
        setError('Failed to fetch vendor profile');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching vendor profile');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return (
          <div className="status-badge approved">
            <CheckCircle size={16} />
            <span>Approved</span>
          </div>
        );
      case 'REJECTED':
        return (
          <div className="status-badge rejected">
            <XCircle size={16} />
            <span>Rejected</span>
          </div>
        );
      case 'PENDING':
      default:
        return (
          <div className="status-badge pending">
            <AlertTriangle size={16} />
            <span>Pending Approval</span>
          </div>
        );
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  if (!isVendor()) {
    // Customer Dashboard
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <div className="dashboard-welcome">
            <h1>Welcome, {currentUser?.name || 'User'}!</h1>
            <p>This is your GreenMagic customer dashboard.</p>
          </div>
          
          <div className="dashboard-cards">
            <div className="dashboard-card">
              <ShoppingBag size={24} />
              <h2>Your Orders</h2>
              <p>View and track your orders</p>
              <Link to="/orders" className="card-link">View Orders</Link>
            </div>
            
            <div className="dashboard-card">
              <Settings size={24} />
              <h2>Account Settings</h2>
              <p>Update your profile information</p>
              <Link to="/profile" className="card-link">Edit Profile</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Check if vendor profile is incomplete
  if (isVendor() && !isVendorProfileComplete()) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <div className="dashboard-welcome">
            <h1>Welcome, {currentUser?.name || 'Vendor'}!</h1>
            <p>Please complete your vendor profile to continue.</p>
          </div>
          
          <div className="vendor-incomplete-profile">
            <AlertTriangle size={48} className="warning-icon" />
            <h2>Profile Incomplete</h2>
            <p>You need to complete your vendor profile before you can access the vendor dashboard.</p>
            <Link to="/vendor-registration" className="btn-primary">
              Complete Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Vendor-specific dashboard
  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-welcome">
          <h1>Welcome, {currentUser?.name || 'Vendor'}!</h1>
          <p>This is your GreenMagic vendor dashboard.</p>
          
          {vendorProfile && getStatusBadge(vendorProfile.status)}
        </div>
        
        {/* Status-specific messages */}
        {vendorProfile && vendorProfile.status === 'PENDING' && (
          <div className="vendor-approval-message">
            <AlertTriangle size={24} />
            <div>
              <h3>Approval Pending</h3>
              <p>Your vendor profile is under review by our team. This process typically takes 1-2 business days. 
              You'll be able to sell products once approved.</p>
            </div>
          </div>
        )}
        
        {vendorProfile && vendorProfile.status === 'REJECTED' && (
          <div className="vendor-approval-message rejected">
            <XCircle size={24} />
            <div>
              <h3>Application Rejected</h3>
              <p><strong>Reason:</strong> {vendorProfile.rejectionReason || 'No specific reason provided'}</p>
              <p>Please contact our support team at support@greenmagic.com for assistance.</p>
              <a href="mailto:support@greenmagic.com" className="btn-outline">Contact Support</a>
            </div>
          </div>
        )}
        
        {vendorProfile && vendorProfile.status === 'APPROVED' && (
          <div className="vendor-approval-message approved">
            <CheckCircle size={24} />
            <div>
              <h3>Account Approved</h3>
              <p>Your vendor account is active. You can now add products and start selling on GreenMagic!</p>
            </div>
          </div>
        )}
        
        {/* Show vendor details if profile exists */}
        {vendorProfile && (
          <div className="vendor-profile-summary">
            <div className="summary-header">
              <h2>Business Information</h2>
              {vendorProfile.status === 'APPROVED' && (
                <Link to="/vendor/edit-profile" className="edit-profile-link">
                  <Settings size={16} />
                  <span>Edit Profile</span>
                </Link>
              )}
            </div>
            
            <div className="vendor-profile-sections">
              <div className="vendor-section">
                <h3>
                  <Building size={18} />
                  <span>Business Details</span>
                </h3>
                <div className="vendor-profile-details">
                  <p><strong>Business Name:</strong> {vendorProfile.businessName}</p>
                  {vendorProfile.legalBusinessName && <p><strong>Legal Name:</strong> {vendorProfile.legalBusinessName}</p>}
                  <p><strong>Business Type:</strong> {vendorProfile.businessType}</p>
                  <p><strong>GST Number:</strong> {vendorProfile.gstNumber}</p>
                  {vendorProfile.panNumber && <p><strong>PAN Number:</strong> {vendorProfile.panNumber}</p>}
                </div>
              </div>
              
              <div className="vendor-section">
                <h3>
                  <Mail size={18} />
                  <span>Contact Information</span>
                </h3>
                <div className="vendor-profile-details">
                  <p><strong>Business Email:</strong> {vendorProfile.businessEmail}</p>
                  <p><strong>Business Phone:</strong> {vendorProfile.businessPhone}</p>
                  {vendorProfile.supportEmail && <p><strong>Support Email:</strong> {vendorProfile.supportEmail}</p>}
                  {vendorProfile.websiteUrl && <p><strong>Website:</strong> <a href={vendorProfile.websiteUrl} target="_blank" rel="noopener noreferrer">{vendorProfile.websiteUrl}</a></p>}
                </div>
              </div>
              
              <div className="vendor-section">
                <h3>
                  <MapPin size={18} />
                  <span>Address</span>
                </h3>
                <div className="vendor-profile-details">
                  <p>{vendorProfile.addressLine1}</p>
                  {vendorProfile.addressLine2 && <p>{vendorProfile.addressLine2}</p>}
                  <p>{vendorProfile.city}, {vendorProfile.state} - {vendorProfile.pincode}</p>
                  <p>{vendorProfile.country}</p>
                </div>
              </div>
              
              {vendorProfile.accountHolderName && (
                <div className="vendor-section">
                  <h3>
                    <CreditCard size={18} />
                    <span>Bank Details</span>
                  </h3>
                  <div className="vendor-profile-details">
                    <p><strong>Account Holder:</strong> {vendorProfile.accountHolderName}</p>
                    <p><strong>Bank:</strong> {vendorProfile.bankName} {vendorProfile.bankBranch && `(${vendorProfile.bankBranch})`}</p>
                  </div>
                </div>
              )}
              
              {vendorProfile.storeDescription && (
                <div className="vendor-section">
                  <h3>
                    <Info size={18} />
                    <span>Store Information</span>
                  </h3>
                  <div className="vendor-profile-details">
                    <p><strong>Store Name:</strong> {vendorProfile.storeDisplayName || vendorProfile.businessName}</p>
                    <p><strong>Description:</strong> {vendorProfile.storeDescription}</p>
                    {vendorProfile.productCategories && <p><strong>Categories:</strong> {vendorProfile.productCategories}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Only show action cards if vendor is approved */}
        {vendorProfile && vendorProfile.status === 'APPROVED' && (
          <>
            <h2 className="dashboard-section-title">Manage Your Store</h2>
            <div className="dashboard-cards">
              <div className="dashboard-card">
                <Package size={24} />
                <h2>Your Products</h2>
                <p>Manage your product listings</p>
                <Link to="/vendor/products" className="card-link">Manage Products</Link>
              </div>
              
              <div className="dashboard-card">
                <ShoppingBag size={24} />
                <h2>Orders</h2>
                <p>View and process customer orders</p>
                <Link to="/vendor/orders" className="card-link">View Orders</Link>
              </div>
              
              <div className="dashboard-card">
                <Settings size={24} />
                <h2>Store Settings</h2>
                <p>Update your store information</p>
                <Link to="/vendor/settings" className="card-link">Edit Store</Link>
              </div>
            </div>
          </>
        )}
        
        {/* Show error if any */}
        {error && (
          <div className="dashboard-error">
            <XCircle size={20} />
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 