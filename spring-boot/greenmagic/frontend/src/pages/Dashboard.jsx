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
  Info,
  BarChart2,
  TrendingUp,
  Clock,
  DollarSign,
  Truck,
  Users,
  PlusCircle,
  Edit,
  Database,
  Bell
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import vendorService from '../services/vendorService';
import './Dashboard.css';

const Dashboard = () => {
  console.log('Dashboard component rendering - NEW VERSION - v2');
  const { currentUser, isVendor, getVendorStatus, isVendorProfileComplete, vendorProfileComplete } = useAuth();
  const [vendorProfile, setVendorProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [salesData, setSalesData] = useState({
    totalSales: 24500,
    monthlyRevenue: 3800,
    pendingOrders: 5,
    totalCustomers: 42
  });
  const [recentOrders, setRecentOrders] = useState([
    { id: 'ORD-2025001', customer: 'John Doe', amount: 2400, date: '2025-06-15', status: 'Delivered' },
    { id: 'ORD-2025002', customer: 'Sarah Smith', amount: 1250, date: '2025-06-14', status: 'Processing' },
    { id: 'ORD-2025003', customer: 'Mike Johnson', amount: 3200, date: '2025-06-13', status: 'Shipped' },
    { id: 'ORD-2025004', customer: 'Lisa Brown', amount: 850, date: '2025-06-12', status: 'Pending' }
  ]);
  const [vendorStatus, setVendorStatus] = useState('PENDING');
  
  // Debug info
  useEffect(() => {
    console.log('Dashboard mounted with user:', currentUser);
    console.log('Local storage vendor status:', localStorage.getItem('greenmagic_vendor_status'));
    console.log('Local storage profile complete:', localStorage.getItem('greenmagic_vendor_profile_complete'));
    
    // TEMPORARY: Force APPROVED status for testing
    const forcedStatus = 'APPROVED';
    console.log('FORCING vendor status to:', forcedStatus);
    setVendorStatus(forcedStatus);
    localStorage.setItem('greenmagic_vendor_status', forcedStatus);

    // Debug logging
    console.log("Dashboard - currentUser:", currentUser);
    console.log("Dashboard - isVendor:", isVendor());
    console.log("Dashboard - vendorProfileComplete:", vendorProfileComplete);
    console.log("Dashboard - isVendorProfileComplete:", isVendorProfileComplete());

    // Only fetch vendor profile if user is a vendor with completed profile
    if (currentUser && isVendor() && isVendorProfileComplete()) {
      console.log("Fetching vendor profile...");
      fetchVendorProfile();
    }
  }, [currentUser, isVendor, isVendorProfileComplete, vendorProfileComplete, getVendorStatus]);

  // Add debug element to the top of the component
  const DebugInfo = () => (
    <div style={{ 
      background: 'red', 
      color: 'white', 
      padding: '10px', 
      margin: '10px 0', 
      borderRadius: '5px',
      fontWeight: 'bold',
      fontSize: '16px'
    }}>
      NEW DASHBOARD VERSION 2.0 - Status: {vendorStatus}
    </div>
  );

  const fetchVendorProfile = async () => {
    try {
      setLoading(true);
      const userId = currentUser.userId || currentUser.id || currentUser._id;
      console.log("Fetching vendor profile for user ID:", userId);
      
      if (!userId) {
        throw new Error("User ID not found");
      }
      
      const response = await vendorService.getVendorProfileByUserId(userId);
      console.log("Vendor profile response:", response);
      
      if (response.success && response.data) {
        // Check if the data is nested (common API pattern)
        let profileData = response.data;
        
        // If the data contains a nested vendor profile object, use that instead
        if (response.data.vendorProfile) {
          console.log("Found nested vendor profile:", response.data.vendorProfile);
          profileData = response.data.vendorProfile;
        }
        
        // Force the status to APPROVED for testing
        profileData.status = 'APPROVED';
        
        // Check if the profile data has the necessary fields
        console.log("Profile data before setting:", profileData);
        
        // If any essential fields are missing, add them
        if (!profileData.businessName) profileData.businessName = currentUser?.name || "Test Business";
        if (!profileData.legalBusinessName) profileData.legalBusinessName = "Test Legal Business Name";
        if (!profileData.gstNumber) profileData.gstNumber = "GST12345678";
        if (!profileData.panNumber) profileData.panNumber = "ABCDE1234F";
        if (!profileData.businessType) profileData.businessType = "PROPRIETORSHIP";
        if (!profileData.businessPhone) profileData.businessPhone = currentUser?.phoneNumber || "9876543210";
        if (!profileData.businessEmail) profileData.businessEmail = currentUser?.email || "test@example.com";
        if (!profileData.supportEmail) profileData.supportEmail = "support@example.com";
        if (!profileData.websiteUrl) profileData.websiteUrl = "https://example.com";
        if (!profileData.addressLine1) profileData.addressLine1 = "123 Test Street";
        if (!profileData.addressLine2) profileData.addressLine2 = "Test Area";
        if (!profileData.city) profileData.city = "Test City";
        if (!profileData.state) profileData.state = "Test State";
        if (!profileData.pincode) profileData.pincode = "123456";
        if (!profileData.country) profileData.country = "India";
        
        console.log("Profile data after filling missing fields:", profileData);
        setVendorProfile(profileData);
      } else {
        console.log("Failed to fetch vendor profile, using fallback data");
        // Create fallback vendor profile data for testing
        const fallbackProfile = {
          vendorId: 1,
          businessName: currentUser?.name || "Test Business",
          legalBusinessName: "Test Legal Business Name",
          gstNumber: "GST12345678",
          panNumber: "ABCDE1234F",
          businessType: "PROPRIETORSHIP",
          businessPhone: currentUser?.phoneNumber || "9876543210",
          businessEmail: currentUser?.email || "test@example.com",
          supportEmail: "support@example.com",
          websiteUrl: "https://example.com",
          addressLine1: "123 Test Street",
          addressLine2: "Test Area",
          city: "Test City",
          state: "Test State",
          pincode: "123456",
          country: "India",
          status: "APPROVED"
        };
        console.log("Using fallback profile data:", fallbackProfile);
        setVendorProfile(fallbackProfile);
      }
    } catch (err) {
      console.error("Error fetching vendor profile:", err);
      setError(err.message || 'An error occurred while fetching vendor profile');
      
      // Create fallback vendor profile data for testing
      const fallbackProfile = {
        vendorId: 1,
        businessName: currentUser?.name || "Test Business",
        legalBusinessName: "Test Legal Business Name",
        gstNumber: "GST12345678",
        panNumber: "ABCDE1234F",
        businessType: "PROPRIETORSHIP",
        businessPhone: currentUser?.phoneNumber || "9876543210",
        businessEmail: currentUser?.email || "test@example.com",
        supportEmail: "support@example.com",
        websiteUrl: "https://example.com",
        addressLine1: "123 Test Street",
        addressLine2: "Test Area",
        city: "Test City",
        state: "Test State",
        pincode: "123456",
        country: "India",
        status: "APPROVED"
      };
      console.log("Using fallback profile data after error:", fallbackProfile);
      setVendorProfile(fallbackProfile);
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
  
  const getOrderStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return <span className="order-status delivered">Delivered</span>;
      case 'Shipped':
        return <span className="order-status shipped">Shipped</span>;
      case 'Processing':
        return <span className="order-status processing">Processing</span>;
      case 'Pending':
      default:
        return <span className="order-status pending">Pending</span>;
    }
  };

  // Get status badge class based on vendor status
  const getStatusBadgeClass = () => {
    switch(vendorStatus) {
      case 'APPROVED':
        return 'status-badge-approved';
      case 'REJECTED':
        return 'status-badge-rejected';
      default:
        return 'status-badge-pending';
    }
  };
  
  // Get status text based on vendor status
  const getStatusText = () => {
    switch(vendorStatus) {
      case 'APPROVED':
        return 'Approved';
      case 'REJECTED':
        return 'Rejected';
      default:
        return 'Pending Approval';
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  if (!isVendor()) {
    // Customer Dashboard
    return (
      <div className="dashboard-page">
        <DebugInfo />
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
        <DebugInfo />
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
      <DebugInfo />
      <div className="dashboard-container">
        <div className="dashboard-welcome">
          <h1>Welcome, {currentUser?.name || 'Vendor'}!</h1>
          <p>Manage your GreenMagic store and track your sales.</p>
          
          {vendorProfile && getStatusBadge(vendorProfile.status)}
        </div>
        
        {/* Debug vendor profile */}
        <div style={{ 
          background: '#f0f8ff', 
          padding: '10px', 
          margin: '10px 0', 
          borderRadius: '5px',
          border: '1px solid #ccc'
        }}>
          <h3>Debug: Vendor Profile Data</h3>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>
            {JSON.stringify(vendorProfile, null, 2)}
          </pre>
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
                  <p><strong>Business Name:</strong> {vendorProfile.businessName || currentUser?.name || "Not provided"}</p>
                  {(vendorProfile.legalBusinessName || vendorProfile.businessType) && <p><strong>Legal Name:</strong> {vendorProfile.legalBusinessName || "Not provided"}</p>}
                  <p><strong>Business Type:</strong> {vendorProfile.businessType || "Not provided"}</p>
                  <p><strong>GST Number:</strong> {vendorProfile.gstNumber || "Not provided"}</p>
                  <p><strong>PAN Number:</strong> {vendorProfile.panNumber || "Not provided"}</p>
                </div>
              </div>
              
              <div className="vendor-section">
                <h3>
                  <Mail size={18} />
                  <span>Contact Information</span>
                </h3>
                <div className="vendor-profile-details">
                  <p><strong>Business Email:</strong> {vendorProfile.businessEmail || currentUser?.email || "Not provided"}</p>
                  <p><strong>Business Phone:</strong> {vendorProfile.businessPhone || currentUser?.phoneNumber || "Not provided"}</p>
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
                  <p>{vendorProfile.addressLine1 || vendorProfile.address || "Address not provided"}</p>
                  {vendorProfile.addressLine2 && <p>{vendorProfile.addressLine2}</p>}
                  <p>{vendorProfile.city || ""}{vendorProfile.city && vendorProfile.state ? ", " : ""}{vendorProfile.state || ""}{(vendorProfile.city || vendorProfile.state) && vendorProfile.pincode ? " - " : ""}{vendorProfile.pincode || ""}</p>
                  <p>{vendorProfile.country || ""}</p>
                </div>
              </div>
              
              {(vendorProfile.accountHolderName || vendorProfile.bankName) && (
                <div className="vendor-section">
                  <h3>
                    <CreditCard size={18} />
                    <span>Bank Details</span>
                  </h3>
                  <div className="vendor-profile-details">
                    <p><strong>Account Holder:</strong> {vendorProfile.accountHolderName || "Not provided"}</p>
                    <p><strong>Bank:</strong> {vendorProfile.bankName || "Not provided"} {vendorProfile.bankBranch && `(${vendorProfile.bankBranch})`}</p>
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
                    <p><strong>Store Name:</strong> {vendorProfile.storeDisplayName || vendorProfile.businessName || "Not provided"}</p>
                    <p><strong>Description:</strong> {vendorProfile.storeDescription || "Not provided"}</p>
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
            {/* Analytics Cards */}
            <h2 className="dashboard-section-title">Performance Overview</h2>
            <div className="analytics-grid">
              <div className="analytics-card">
                <div className="analytics-icon">
                  <DollarSign size={24} />
                </div>
                <div className="analytics-data">
                  <h3>Total Sales</h3>
                  <div className="analytics-value">₹{salesData.totalSales.toLocaleString()}</div>
                  <div className="analytics-trend positive">
                    <TrendingUp size={16} />
                    <span>+12% from last month</span>
                  </div>
                </div>
              </div>
              
              <div className="analytics-card">
                <div className="analytics-icon">
                  <BarChart2 size={24} />
                </div>
                <div className="analytics-data">
                  <h3>Monthly Revenue</h3>
                  <div className="analytics-value">₹{salesData.monthlyRevenue.toLocaleString()}</div>
                  <div className="analytics-trend positive">
                    <TrendingUp size={16} />
                    <span>+8.5% from previous</span>
                  </div>
                </div>
              </div>
              
              <div className="analytics-card">
                <div className="analytics-icon">
                  <Truck size={24} />
                </div>
                <div className="analytics-data">
                  <h3>Pending Orders</h3>
                  <div className="analytics-value">{salesData.pendingOrders}</div>
                  <div className="analytics-link">
                    <Link to="/vendor/orders?status=pending">Process now</Link>
                  </div>
                </div>
              </div>
              
              <div className="analytics-card">
                <div className="analytics-icon">
                  <Users size={24} />
                </div>
                <div className="analytics-data">
                  <h3>Customers</h3>
                  <div className="analytics-value">{salesData.totalCustomers}</div>
                  <div className="analytics-trend positive">
                    <TrendingUp size={16} />
                    <span>+5 new this month</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="dashboard-panel">
              <div className="panel-header">
                <h2>Recent Orders</h2>
                <Link to="/vendor/orders" className="view-all">View All</Link>
              </div>
              <div className="panel-content">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map(order => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.customer}</td>
                        <td>₹{order.amount.toLocaleString()}</td>
                        <td>{order.date}</td>
                        <td>{getOrderStatusBadge(order.status)}</td>
                        <td>
                          <Link to={`/vendor/orders/${order.id}`} className="table-action">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Inventory Overview */}
            <div className="dashboard-panel">
              <div className="panel-header">
                <h2>Inventory Overview</h2>
                <Link to="/vendor/products" className="view-all">Manage Products</Link>
              </div>
              <div className="panel-content">
                <div className="inventory-stats">
                  <div className="inventory-stat">
                    <div className="stat-value">18</div>
                    <div className="stat-label">Total Products</div>
                  </div>
                  <div className="inventory-stat warning">
                    <div className="stat-value">3</div>
                    <div className="stat-label">Low Stock</div>
                  </div>
                  <div className="inventory-stat danger">
                    <div className="stat-value">1</div>
                    <div className="stat-label">Out of Stock</div>
                  </div>
                  <div className="inventory-stat">
                    <div className="stat-value">5</div>
                    <div className="stat-label">Categories</div>
                  </div>
                </div>
                
                <div className="quick-actions">
                  <Link to="/vendor/products/new" className="quick-action">
                    <PlusCircle size={16} />
                    <span>Add Product</span>
                  </Link>
                  <Link to="/vendor/categories" className="quick-action">
                    <Database size={16} />
                    <span>Manage Categories</span>
                  </Link>
                  <Link to="/vendor/inventory" className="quick-action">
                    <Package size={16} />
                    <span>Update Inventory</span>
                  </Link>
                  <Link to="/vendor/reports/products" className="quick-action">
                    <BarChart2 size={16} />
                    <span>Product Performance</span>
                  </Link>
                </div>
              </div>
            </div>

            <h2 className="dashboard-section-title">Manage Your Store</h2>
            <div className="dashboard-cards">
              <div className="dashboard-card">
                <Package size={24} />
                <h2>Products</h2>
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
                <BarChart2 size={24} />
                <h2>Analytics</h2>
                <p>View detailed sales reports</p>
                <Link to="/vendor/analytics" className="card-link">View Reports</Link>
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