import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, 
  ShoppingBag, 
  Settings, 
  BarChart2, 
  Package,
  Search,
  Filter,
  ChevronDown,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Download,
  MessageSquare,
  UserCheck,
  UserX,
  RefreshCw
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
  const [vendorFilter, setVendorFilter] = useState('all');
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
  
  // Filter vendors based on status and search query
  const filteredVendors = vendors.filter(vendor => {
    // Filter by status
    if (vendorFilter !== 'all' && vendor.status.toLowerCase() !== vendorFilter) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !vendor.businessName.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !vendor.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !vendor.gstNumber.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Handle vendor status change
  const handleStatusChange = async (vendorId, newStatus) => {
    try {
      const response = await vendorService.updateVendorStatus(vendorId, newStatus);
      
      if (response.success) {
        // Update local vendors state
        setVendors(vendors.map(vendor => {
          if (vendor.id === vendorId) {
            return {
              ...vendor,
              status: newStatus
            };
          }
          return vendor;
        }));
        
        // Refresh vendor counts
        const countsResponse = await vendorService.getVendorCounts();
        if (countsResponse.success) {
          setVendorCounts(countsResponse.data);
        }
      }
    } catch (err) {
      console.error(`Failed to update vendor status to ${newStatus}:`, err);
      // You could add a toast notification here
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
                                <td>{new Date(vendor.createdAt).toLocaleDateString()}</td>
                                <td>{vendor.gstNumber}</td>
                                <td className="action-buttons">
                                  <button 
                                    className="action-btn view-btn"
                                    onClick={() => console.log(`View vendor ${vendor.id}`)}
                                  >
                                    <Eye size={16} />
                                  </button>
                                  <button 
                                    className="action-btn approve-btn"
                                    onClick={() => handleStatusChange(vendor.id, 'APPROVED')}
                                  >
                                    <CheckCircle size={16} />
                                  </button>
                                  <button 
                                    className="action-btn reject-btn"
                                    onClick={() => handleStatusChange(vendor.id, 'REJECTED')}
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
                <div className="toolbar">
                  <div className="search-box">
                    <Search size={18} />
                    <input 
                      type="text" 
                      placeholder="Search vendors..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className="filter-dropdown">
                    <button className="filter-button">
                      <Filter size={18} />
                      <span>
                        {vendorFilter === 'all' ? 'All Vendors' : 
                         vendorFilter === 'approved' ? 'Approved' : 
                         vendorFilter === 'pending' ? 'Pending' : 'Rejected'}
                      </span>
                      <ChevronDown size={16} />
                    </button>
                    
                    <div className="filter-menu">
                      <button 
                        className={vendorFilter === 'all' ? 'active' : ''}
                        onClick={() => setVendorFilter('all')}
                      >
                        All Vendors
                      </button>
                      <button 
                        className={vendorFilter === 'approved' ? 'active' : ''}
                        onClick={() => setVendorFilter('approved')}
                      >
                        Approved
                      </button>
                      <button 
                        className={vendorFilter === 'pending' ? 'active' : ''}
                        onClick={() => setVendorFilter('pending')}
                      >
                        Pending
                      </button>
                      <button 
                        className={vendorFilter === 'rejected' ? 'active' : ''}
                        onClick={() => setVendorFilter('rejected')}
                      >
                        Rejected
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="vendors-list">
                  {filteredVendors.length > 0 ? (
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Business Name</th>
                          <th>Owner</th>
                          <th>Contact</th>
                          <th>GST Number</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredVendors.map(vendor => (
                          <tr key={vendor.id}>
                            <td>{vendor.businessName}</td>
                            <td>{vendor.ownerName}</td>
                            <td>
                              <div>{vendor.email || vendor.user?.email}</div>
                              <div className="secondary-text">{vendor.phoneNumber}</div>
                            </td>
                            <td>{vendor.gstNumber}</td>
                            <td>{getStatusBadge(vendor.status)}</td>
                            <td className="action-buttons">
                              <button 
                                className="action-btn view-btn"
                                title="View Details"
                                onClick={() => console.log(`View vendor ${vendor.id}`)}
                              >
                                <Eye size={16} />
                              </button>
                              
                              <button 
                                className="action-btn download-btn"
                                title="Download Documents"
                                onClick={() => console.log(`Download docs for vendor ${vendor.id}`)}
                              >
                                <Download size={16} />
                              </button>
                              
                              <button 
                                className="action-btn message-btn"
                                title="Send Message"
                                onClick={() => console.log(`Message vendor ${vendor.id}`)}
                              >
                                <MessageSquare size={16} />
                              </button>
                              
                              {vendor.status !== 'APPROVED' && (
                                <button 
                                  className="action-btn approve-btn"
                                  title="Approve Vendor"
                                  onClick={() => handleStatusChange(vendor.id, 'APPROVED')}
                                >
                                  <UserCheck size={16} />
                                </button>
                              )}
                              
                              {vendor.status !== 'REJECTED' && (
                                <button 
                                  className="action-btn reject-btn"
                                  title="Reject Vendor"
                                  onClick={() => handleStatusChange(vendor.id, 'REJECTED')}
                                >
                                  <UserX size={16} />
                                </button>
                              )}
                              
                              {vendor.status === 'REJECTED' && (
                                <button 
                                  className="action-btn reset-btn"
                                  title="Reset Status"
                                  onClick={() => handleStatusChange(vendor.id, 'PENDING')}
                                >
                                  <RefreshCw size={16} />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="empty-state">
                      <Users size={48} />
                      <p>No vendors found matching your filters</p>
                      <button 
                        className="reset-filters"
                        onClick={() => {
                          setVendorFilter('all');
                          setSearchQuery('');
                        }}
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
    </div>
  );
};

export default AdminDashboard; 