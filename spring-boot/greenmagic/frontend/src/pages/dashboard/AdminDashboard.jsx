import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, 
  ShoppingBag, 
  Settings, 
  BarChart2, 
  Package,
  Search,
  Filter as FilterIcon,
  ChevronDown,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Download,
  MessageSquare,
  UserCheck,
  UserX,
  RefreshCw,
  Calendar,
  Sliders,
  Phone,
  Mail,
  Store,
  FileText,
  Tag,
  X,
  Info
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './AdminDashboard.css';

// Import the vendor service
import vendorService from '../../services/vendorService';

/**
 * Admin Dashboard Component
 * 
 * Dashboard for administrators with vendor management features
 */
const AdminDashboard = () => {
  const { currentUser, isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [vendors, setVendors] = useState([]);
  const [vendorCounts, setVendorCounts] = useState({
    TOTAL: 0,
    PENDING: 0,
    APPROVED: 0,
    REJECTED: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters state
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    sortBy: 'newest'
  });
  
  // Vendor detail modal
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  // Confirmation modal
  const [confirmAction, setConfirmAction] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  
  // Check if user is authenticated and has admin role
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: '/admin/dashboard', message: 'Please login to access the admin dashboard' } });
    } else if (!isAdmin()) {
      navigate('/unauthorized', { state: { message: 'You do not have permission to access the admin dashboard' } });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Fetch all vendors and counts on component mount
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        // Don't fetch data if not authenticated or not admin
        if (!isAuthenticated() || !isAdmin()) {
          return;
        }
        
        setLoading(true);
        setError(null);
        
        // Fetch vendor counts with fallback to dummy data if needed
        const countsResponse = await vendorService.safeGetVendorCounts();
        if (countsResponse.success) {
          setVendorCounts(countsResponse.data);
        }
        
        // Fetch all vendors with fallback to dummy data if needed
        const vendorsResponse = await vendorService.safeGetAllVendors(0, 50);
        if (vendorsResponse.success) {
          setVendors(vendorsResponse.data.content);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch vendor data:', err);
        if (err.message === 'Forbidden') {
          setError('You do not have permission to access vendor data. Please make sure you are logged in with admin privileges.');
        } else {
          setError('Failed to load vendor data. Please try again.');
        }
        setLoading(false);
      }
    };
    
    fetchVendors();
  }, [isAuthenticated, isAdmin]);
  
  // Filter vendors based on status, search query, and date range
  const getFilteredVendors = () => {
    return vendors.filter(vendor => {
      // Filter by status
      if (filters.status !== 'all' && vendor.status.toLowerCase() !== filters.status) {
        return false;
      }
      
      // Filter by search query (business name, owner name, GST number, email)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !vendor.businessName?.toLowerCase().includes(query) && 
          !vendor.ownerName?.toLowerCase().includes(query) && 
          !vendor.gstNumber?.toLowerCase().includes(query) &&
          !vendor.email?.toLowerCase().includes(query) &&
          !vendor.phoneNumber?.includes(query)
        ) {
          return false;
        }
      }
      
      // Filter by date range
      if (filters.dateRange !== 'all') {
        const vendorDate = new Date(vendor.createdAt);
        const now = new Date();
        
        switch (filters.dateRange) {
          case 'today':
            // Check if date is today
            if (vendorDate.toDateString() !== now.toDateString()) {
              return false;
            }
            break;
          case 'week':
            // Check if date is within the last 7 days
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(now.getDate() - 7);
            if (vendorDate < oneWeekAgo) {
              return false;
            }
            break;
          case 'month':
            // Check if date is within the last 30 days
            const oneMonthAgo = new Date();
            oneMonthAgo.setDate(now.getDate() - 30);
            if (vendorDate < oneMonthAgo) {
              return false;
            }
            break;
          default:
            break;
        }
      }
      
      return true;
    }).sort((a, b) => {
      // Sort vendors
      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'name-asc':
          return a.businessName.localeCompare(b.businessName);
        case 'name-desc':
          return b.businessName.localeCompare(a.businessName);
        default:
          return 0;
      }
    });
  };
  
  const filteredVendors = getFilteredVendors();
  
  // Reset all filters
  const resetFilters = () => {
    setFilters({
      status: 'all',
      dateRange: 'all',
      sortBy: 'newest'
    });
    setSearchQuery('');
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Handle vendor status change
  const handleStatusChange = async (vendorId, newStatus) => {
    setIsConfirmModalOpen(false);
    
    if (!vendorId) {
      console.error('Cannot update vendor status: Vendor ID is missing', { vendorId, newStatus });
      return;
    }
    
    try {
      const response = await vendorService.updateVendorStatus(vendorId, newStatus);
      
      if (response.success) {
        // Update local vendors state
        setVendors(vendors.map(vendor => {
          if ((vendor.vendorId || vendor.id || vendor._id) === vendorId) {
            return {
              ...vendor,
              status: newStatus
            };
          }
          return vendor;
        }));
        
        // Refresh vendor counts
        const countsResponse = await vendorService.safeGetVendorCounts();
        if (countsResponse.success) {
          setVendorCounts(countsResponse.data);
        }
      }
    } catch (err) {
      console.error(`Failed to update vendor status to ${newStatus}:`, err);
    }
  };
  
  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return <span className="status-badge approved"><CheckCircle size={14} /> Approved</span>;
      case 'REJECTED':
        return <span className="status-badge rejected"><XCircle size={14} /> Rejected</span>;
      case 'PENDING':
      default:
        return <span className="status-badge pending"><AlertTriangle size={14} /> Pending</span>;
    }
  };
  
  // Open vendor detail modal
  const openVendorDetail = (vendor) => {
    setSelectedVendor(vendor);
    setIsDetailModalOpen(true);
  };
  
  // Close vendor detail modal
  const closeVendorDetail = () => {
    setSelectedVendor(null);
    setIsDetailModalOpen(false);
  };
  
  // Open confirmation modal for status changes
  const openConfirmModal = (action) => {
    if (!action || !action.vendorId) {
      console.error('Invalid action or missing vendorId:', action);
      return;
    }
    
    setConfirmAction(action);
    setIsConfirmModalOpen(true);
  };
  
  // Vendor detail modal component
  const VendorDetailModal = ({ vendor, onClose }) => {
    if (!vendor) return null;
    
    const vendorId = vendor.vendorId || vendor.id || vendor._id;
    
    return (
      <div className="modal-overlay">
        <div className="vendor-detail-modal">
          <div className="modal-header">
            <h2>Vendor Details</h2>
            <button className="close-button" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
          
          <div className="modal-content">
            <div className="vendor-header">
              <div className="vendor-name-section">
                <h3>{vendor.businessName}</h3>
                {getStatusBadge(vendor.status)}
              </div>
              <div className="vendor-meta">
                <div className="created-date">
                  <Calendar size={14} />
                  <span>Registered: {formatDate(vendor.createdAt)}</span>
                </div>
              </div>
            </div>
            
            <div className="vendor-details-grid">
              <div className="detail-group">
                <h4>Business Information</h4>
                <div className="detail-item">
                  <span className="detail-label"><Store size={16} /> Business Name</span>
                  <span className="detail-value">{vendor.businessName || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><Store size={16} /> Legal Business Name</span>
                  <span className="detail-value">{vendor.legalBusinessName || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><Store size={16} /> Business Type</span>
                  <span className="detail-value">{vendor.businessType ? vendor.businessType.replace(/_/g, ' ') : 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><FileText size={16} /> GST Number</span>
                  <span className="detail-value">{vendor.gstNumber || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><FileText size={16} /> PAN Number</span>
                  <span className="detail-value">{vendor.panNumber || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><Tag size={16} /> Website</span>
                  <span className="detail-value">
                    {vendor.websiteUrl ? 
                      <a href={vendor.websiteUrl} target="_blank" rel="noopener noreferrer">{vendor.websiteUrl}</a> 
                      : 'N/A'}
                  </span>
                </div>
              </div>
              
              <div className="detail-group">
                <h4>Contact Information</h4>
                <div className="detail-item">
                  <span className="detail-label"><Mail size={16} /> Business Email</span>
                  <span className="detail-value">{vendor.businessEmail || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><Mail size={16} /> Support Email</span>
                  <span className="detail-value">{vendor.supportEmail || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><Phone size={16} /> Business Phone</span>
                  <span className="detail-value">{vendor.businessPhone || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><Phone size={16} /> Phone</span>
                  <span className="detail-value">{vendor.phoneNumber || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><Mail size={16} /> Email</span>
                  <span className="detail-value">{vendor.email || 'N/A'}</span>
                </div>
              </div>
            </div>
            
            <div className="vendor-details-grid">
              <div className="detail-group">
                <h4>Address Information</h4>
                <div className="detail-item">
                  <span className="detail-label"><FileText size={16} /> Address Line 1</span>
                  <span className="detail-value">{vendor.addressLine1 || vendor.address || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><FileText size={16} /> Address Line 2</span>
                  <span className="detail-value">{vendor.addressLine2 || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><FileText size={16} /> City</span>
                  <span className="detail-value">{vendor.city || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><FileText size={16} /> State</span>
                  <span className="detail-value">{vendor.state || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><FileText size={16} /> Pincode</span>
                  <span className="detail-value">{vendor.pincode || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><FileText size={16} /> Country</span>
                  <span className="detail-value">{vendor.country || 'N/A'}</span>
                </div>
              </div>
              
              <div className="detail-group">
                <h4>Banking Information</h4>
                <div className="detail-item">
                  <span className="detail-label"><FileText size={16} /> Account Holder Name</span>
                  <span className="detail-value">{vendor.accountHolderName || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><FileText size={16} /> Account Number</span>
                  <span className="detail-value">{vendor.accountNumber ? '******' + vendor.accountNumber.slice(-4) : 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><FileText size={16} /> IFSC Code</span>
                  <span className="detail-value">{vendor.ifscCode || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><FileText size={16} /> Bank Name</span>
                  <span className="detail-value">{vendor.bankName || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><FileText size={16} /> Bank Branch</span>
                  <span className="detail-value">{vendor.bankBranch || 'N/A'}</span>
                </div>
              </div>
            </div>
            
            <div className="vendor-details-grid">
              <div className="detail-group">
                <h4>Store Information</h4>
                <div className="detail-item">
                  <span className="detail-label"><Store size={16} /> Store Display Name</span>
                  <span className="detail-value">{vendor.storeDisplayName || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><Tag size={16} /> Product Categories</span>
                  <span className="detail-value">{vendor.productCategories || 'N/A'}</span>
                </div>
                <div className="detail-item col-span-2">
                  <span className="detail-label"><FileText size={16} /> Store Description</span>
                  <span className="detail-value description-text">{vendor.storeDescription || 'N/A'}</span>
                </div>
              </div>
              
              <div className="detail-group">
                <h4>Document Information</h4>
                <div className="detail-item">
                  <span className="detail-label"><FileText size={16} /> Logo</span>
                  <span className="detail-value link-text">
                    {vendor.logoUrl ? 
                      <a href={vendor.logoUrl} target="_blank" rel="noopener noreferrer">View Logo</a> 
                      : 'N/A'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><FileText size={16} /> GST Certificate</span>
                  <span className="detail-value link-text">
                    {vendor.gstCertificateUrl ? 
                      <a href={vendor.gstCertificateUrl} target="_blank" rel="noopener noreferrer">View Certificate</a> 
                      : 'N/A'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><FileText size={16} /> Cancelled Cheque</span>
                  <span className="detail-value link-text">
                    {vendor.cancelledChequeUrl ? 
                      <a href={vendor.cancelledChequeUrl} target="_blank" rel="noopener noreferrer">View Cheque</a> 
                      : 'N/A'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><FileText size={16} /> PAN Card</span>
                  <span className="detail-value link-text">
                    {vendor.panCardUrl ? 
                      <a href={vendor.panCardUrl} target="_blank" rel="noopener noreferrer">View PAN Card</a> 
                      : 'N/A'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><FileText size={16} /> Identity Proof</span>
                  <span className="detail-value link-text">
                    {vendor.identityProofUrl ? 
                      <a href={vendor.identityProofUrl} target="_blank" rel="noopener noreferrer">View ID Proof</a> 
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
            
            {vendor.status === 'REJECTED' && vendor.rejectionReason && (
              <div className="rejection-reason">
                <h4>Rejection Reason:</h4>
                <p>{vendor.rejectionReason}</p>
              </div>
            )}
            
            <div className="vendor-stats">
              <div className="stat-box">
                <span className="stat-value">{vendor.productsCount || 0}</span>
                <span className="stat-label">Products</span>
              </div>
              <div className="stat-box">
                <span className="stat-value">{vendor.ordersCount || 0}</span>
                <span className="stat-label">Orders</span>
              </div>
              <div className="stat-box">
                <span className="stat-value">₹{(vendor.revenue || 0).toLocaleString()}</span>
                <span className="stat-label">Revenue</span>
              </div>
            </div>
            
            <div className="modal-actions">
              <button className="secondary-button" onClick={onClose}>
                Close
              </button>
              
              <div className="action-buttons">
                {vendor.status !== 'APPROVED' && (
                  <button 
                    className="action-button approve"
                    onClick={() => {
                      openConfirmModal({
                        type: 'approve',
                        vendorId: vendorId,
                        vendorName: vendor.businessName
                      });
                    }}
                  >
                    <UserCheck size={16} />
                    <span>Approve Vendor</span>
                  </button>
                )}
                
                {vendor.status !== 'REJECTED' && (
                  <button 
                    className="action-button reject"
                    onClick={() => {
                      openConfirmModal({
                        type: 'reject',
                        vendorId: vendorId,
                        vendorName: vendor.businessName
                      });
                    }}
                  >
                    <UserX size={16} />
                    <span>Reject Vendor</span>
                  </button>
                )}
                
                {vendor.status === 'REJECTED' && (
                  <button 
                    className="action-button reset"
                    onClick={() => {
                      openConfirmModal({
                        type: 'reset',
                        vendorId: vendorId,
                        vendorName: vendor.businessName
                      });
                    }}
                  >
                    <RefreshCw size={16} />
                    <span>Reset to Pending</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Confirmation modal component
  const ConfirmModal = ({ action, onConfirm, onCancel }) => {
    if (!action) return null;
    
    let title = '';
    let message = '';
    let confirmText = 'Confirm';
    let confirmClass = 'primary';
    
    switch (action.type) {
      case 'approve':
        title = 'Approve Vendor';
        message = `Are you sure you want to approve "${action.vendorName}"? The vendor will be able to list and sell products.`;
        confirmText = 'Approve';
        confirmClass = 'approve';
        break;
      case 'reject':
        title = 'Reject Vendor';
        message = `Are you sure you want to reject "${action.vendorName}"? The vendor will not be able to list or sell products.`;
        confirmText = 'Reject';
        confirmClass = 'reject';
        break;
      case 'reset':
        title = 'Reset Vendor Status';
        message = `Are you sure you want to reset "${action.vendorName}" to pending status?`;
        confirmText = 'Reset';
        confirmClass = 'reset';
        break;
      default:
        break;
    }
    
    const handleConfirm = () => {
      if (!action || !action.vendorId) {
        console.error('Missing vendor ID in action:', action);
        onCancel();
        return;
      }
      
      switch (action.type) {
        case 'approve':
          onConfirm(action.vendorId, 'APPROVED');
          break;
        case 'reject':
          onConfirm(action.vendorId, 'REJECTED');
          break;
        case 'reset':
          onConfirm(action.vendorId, 'PENDING');
          break;
        default:
          onCancel();
          break;
      }
    };
    
    return (
      <div className="modal-overlay">
        <div className="confirm-modal">
          <div className="modal-header">
            <h2>{title}</h2>
            <button className="close-button" onClick={onCancel}>
              <X size={20} />
            </button>
          </div>
          
          <div className="modal-content">
            <p className="confirm-message">{message}</p>
            
            <div className="modal-actions">
              <button className="secondary-button" onClick={onCancel}>
                Cancel
              </button>
              <button 
                className={`action-button ${confirmClass}`}
                onClick={handleConfirm}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Vendor card component
  const VendorCard = ({ vendor, onViewDetails, onApprove, onReject, onReset }) => {    
    const vendorId = vendor.vendorId || vendor.id || vendor._id;
    
    return (
      <div className="vendor-card">
        <div className="vendor-card-header">
          <h3 className="vendor-name">{vendor.businessName}</h3>
          {getStatusBadge(vendor.status)}
        </div>
        
        <div className="vendor-card-body">
          <div className="vendor-info-grid">
            <div className="vendor-info-item">
              <span className="info-label">Store Name</span>
              <span className="info-value truncate">{vendor.storeDisplayName || 'N/A'}</span>
            </div>
            <div className="vendor-info-item">
              <span className="info-label">Business Type</span>
              <span className="info-value">{vendor.businessType ? vendor.businessType.replace(/_/g, ' ') : 'N/A'}</span>
            </div>
            <div className="vendor-info-item">
              <span className="info-label">Phone</span>
              <span className="info-value">{vendor.businessPhone || 'N/A'}</span>
            </div>
            <div className="vendor-info-item">
              <span className="info-label">Email</span>
              <span className="info-value truncate">{vendor.businessEmail || 'N/A'}</span>
            </div>
            <div className="vendor-info-item">
              <span className="info-label">GST Number</span>
              <span className="info-value">{vendor.gstNumber || 'N/A'}</span>
            </div>
            <div className="vendor-info-item">
              <span className="info-label">Location</span>
              <span className="info-value">{(vendor.city && vendor.state) ? `${vendor.city}, ${vendor.state}` : 'N/A'}</span>
            </div>
            <div className="vendor-info-item">
              <span className="info-label">Registered On</span>
              <span className="info-value">{formatDate(vendor.createdAt)}</span>
            </div>
            <div className="vendor-info-item">
              <span className="info-label">Products</span>
              <span className="info-value">{vendor.productsCount || 0}</span>
            </div>
          </div>
        </div>
        
        <div className="vendor-card-footer">
          <button className="vendor-action-btn view" onClick={() => onViewDetails(vendor)}>
            <Eye size={14} />
            <span>View Details</span>
          </button>
          
          {vendor.status === 'PENDING' && (
            <>
              <button 
                className="vendor-action-btn approve" 
                onClick={() => {
                  onApprove({
                    type: 'approve',
                    vendorId: vendorId,
                    vendorName: vendor.businessName
                  });
                }}
              >
                <UserCheck size={14} />
                <span>Approve</span>
              </button>
              <button 
                className="vendor-action-btn reject"
                onClick={() => {
                  onReject({
                    type: 'reject',
                    vendorId: vendorId,
                    vendorName: vendor.businessName
                  });
                }}
              >
                <UserX size={14} />
                <span>Reject</span>
              </button>
            </>
          )}
          
          {vendor.status === 'REJECTED' && (
            <button 
              className="vendor-action-btn reset"
              onClick={() => {
                onReset({
                  type: 'reset',
                  vendorId: vendorId,
                  vendorName: vendor.businessName
                });
              }}
            >
              <RefreshCw size={14} />
              <span>Reset to Pending</span>
            </button>
          )}
        </div>
      </div>
    );
  };
  
  // Display unauthorized message if not admin
  if (!isAuthenticated() || !isAdmin()) {
    return null; // Will be redirected by the first useEffect
  }
  
  return (
    <div className="admin-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-welcome">
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {currentUser?.name || 'Admin'}</p>
        </div>
        
        {/* Dashboard Navigation */}
        <div className="admin-nav">
          <button 
            className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <BarChart2 size={20} />
            <span>Overview</span>
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'vendors' ? 'active' : ''}`}
            onClick={() => setActiveTab('vendors')}
          >
            <Users size={20} />
            <span>Vendors</span>
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Package size={20} />
            <span>Products</span>
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingBag size={20} />
            <span>Orders</span>
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </div>
        
        {loading ? (
          <div className="admin-placeholder">
            <p>Loading dashboard data...</p>
          </div>
        ) : error ? (
          <div className="admin-placeholder">
            <XCircle size={48} />
            <h2>Error Loading Data</h2>
            <p>{error}</p>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="admin-overview">
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon vendor-icon">
                      <Users size={24} />
                    </div>
                    <div className="stat-content">
                      <h3>Total Vendors</h3>
                      <div className="stat-value">{vendorCounts.TOTAL || 0}</div>
                      <div className="stat-detail">
                        <span className="approved">{vendorCounts.APPROVED || 0} Approved</span>
                        <span className="pending">{vendorCounts.PENDING || 0} Pending</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon product-icon">
                      <Package size={24} />
                    </div>
                    <div className="stat-content">
                      <h3>Total Products</h3>
                      <div className="stat-value">
                        {vendors.reduce((sum, vendor) => sum + (vendor.productsCount || 0), 0)}
                      </div>
                      <div className="stat-detail">
                        <span>From {vendors.filter(v => v.productsCount > 0).length} vendors</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon order-icon">
                      <ShoppingBag size={24} />
                    </div>
                    <div className="stat-content">
                      <h3>Total Orders</h3>
                      <div className="stat-value">
                        {vendors.reduce((sum, vendor) => sum + (vendor.ordersCount || 0), 0)}
                      </div>
                      <div className="stat-detail">
                        <span>₹{vendors.reduce((sum, vendor) => sum + (vendor.revenue || 0), 0).toLocaleString()} Revenue</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="admin-section">
                  <div className="section-header">
                    <h2>Recent Vendor Applications</h2>
                    <Link to="/admin/vendors?filter=pending" className="view-all">View All</Link>
                  </div>
                  
                  <div className="vendor-applications">
                    {vendors.filter(v => v.status === 'PENDING').length > 0 ? (
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Business Name</th>
                            <th>Owner</th>
                            <th>Registration Date</th>
                            <th>GST Number</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {vendors
                            .filter(vendor => vendor.status === 'PENDING')
                            .slice(0, 5)
                            .map(vendor => (
                              <tr key={vendor.id}>
                                <td>{vendor.businessName}</td>
                                <td>{vendor.ownerName}</td>
                                <td>{formatDate(vendor.createdAt)}</td>
                                <td>{vendor.gstNumber}</td>
                                <td className="action-buttons">
                                  <button 
                                    className="action-btn view-btn"
                                    title="View Details"
                                    onClick={() => openVendorDetail(vendor)}
                                  >
                                    <Eye size={16} />
                                  </button>
                                  <button 
                                    className="action-btn approve-btn"
                                    title="Approve Vendor"
                                    onClick={() => openConfirmModal({
                                      type: 'approve',
                                      vendorId: vendor.id,
                                      vendorName: vendor.businessName
                                    })}
                                  >
                                    <CheckCircle size={16} />
                                  </button>
                                  <button 
                                    className="action-btn reject-btn"
                                    title="Reject Vendor"
                                    onClick={() => openConfirmModal({
                                      type: 'reject',
                                      vendorId: vendor.id,
                                      vendorName: vendor.businessName
                                    })}
                                  >
                                    <XCircle size={16} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="empty-state">
                        <CheckCircle size={48} />
                        <p>No pending vendor applications</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Vendors Tab */}
            {activeTab === 'vendors' && (
              <div className="admin-vendors">
                <div className="filter-bar">
                  <div className="search-box">
                    <Search size={18} />
                    <input 
                      type="text" 
                      placeholder="Search vendors by name, email, GST..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className="filters">
                    <div className="filter-group">
                      <label>Status:</label>
                      <select 
                        value={filters.status}
                        onChange={(e) => setFilters({...filters, status: e.target.value})}
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                    
                    <div className="filter-group">
                      <label>Date:</label>
                      <select 
                        value={filters.dateRange}
                        onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                      >
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                      </select>
                    </div>
                    
                    <div className="filter-group">
                      <label>Sort By:</label>
                      <select 
                        value={filters.sortBy}
                        onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="name-asc">Name (A-Z)</option>
                        <option value="name-desc">Name (Z-A)</option>
                      </select>
                    </div>
                    
                    <button 
                      className="filter-reset-btn"
                      onClick={resetFilters}
                    >
                      <RefreshCw size={14} />
                      Reset
                    </button>
                  </div>
                </div>
                
                <div className="filter-summary">
                  <div className="filter-tags">
                    <div className="results-count">
                      {filteredVendors.length} {filteredVendors.length === 1 ? 'vendor' : 'vendors'} found
                    </div>
                    
                    {filters.status !== 'all' && (
                      <div className="filter-tag">
                        Status: {filters.status}
                        <button 
                          className="remove-filter"
                          onClick={() => setFilters({...filters, status: 'all'})}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}
                    
                    {filters.dateRange !== 'all' && (
                      <div className="filter-tag">
                        Date: {filters.dateRange === 'today' ? 'Today' : 
                               filters.dateRange === 'week' ? 'This Week' : 
                               'This Month'}
                        <button 
                          className="remove-filter"
                          onClick={() => setFilters({...filters, dateRange: 'all'})}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}
                    
                    {searchQuery && (
                      <div className="filter-tag">
                        Search: {searchQuery}
                        <button 
                          className="remove-filter"
                          onClick={() => setSearchQuery('')}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="vendors-container">
                  {filteredVendors.length > 0 ? (
                    <div className="vendors-grid">
                      {filteredVendors.map(vendor => {
                        return (
                          <VendorCard 
                            key={vendor.vendorId || vendor.id || vendor._id || Math.random()}
                            vendor={vendor}
                            onViewDetails={openVendorDetail}
                            onApprove={openConfirmModal}
                            onReject={openConfirmModal}
                            onReset={openConfirmModal}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <Users size={48} />
                      <p>No vendors found matching your filters</p>
                      <button 
                        className="reset-filters"
                        onClick={resetFilters}
                      >
                        Reset Filters
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Placeholder for other tabs */}
            {activeTab === 'products' && (
              <div className="admin-placeholder">
                <Package size={48} />
                <h2>Products Management</h2>
                <p>This section is under development</p>
              </div>
            )}
            
            {activeTab === 'orders' && (
              <div className="admin-placeholder">
                <ShoppingBag size={48} />
                <h2>Orders Management</h2>
                <p>This section is under development</p>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="admin-placeholder">
                <Settings size={48} />
                <h2>Admin Settings</h2>
                <p>This section is under development</p>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Vendor Detail Modal */}
      {isDetailModalOpen && (
        <VendorDetailModal 
          vendor={selectedVendor} 
          onClose={closeVendorDetail} 
        />
      )}
      
      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <ConfirmModal 
          action={confirmAction}
          onConfirm={handleStatusChange}
          onCancel={() => setIsConfirmModalOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard; 