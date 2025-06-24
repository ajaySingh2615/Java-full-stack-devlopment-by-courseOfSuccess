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
  Mail,
  MapPin,
  CreditCard,
  Info,
  BarChart2,
  TrendingUp,
  DollarSign,
  Truck,
  Users,
  PlusCircle,
  Database,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import vendorService from '../../services/vendorService';
import '../../pages/Dashboard.css';

/**
 * Vendor Dashboard Component
 * 
 * Dashboard for vendors to manage their store, products, orders,
 * and view sales analytics.
 */
const VendorDashboard = () => {
  const { currentUser, getVendorStatus, isVendorProfileComplete, updateVendorStatus } = useAuth();
  const [vendorProfile, setVendorProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusChangeNotification, setStatusChangeNotification] = useState(null);
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
  
  // Load vendor status and profile
  useEffect(() => {
    // Only fetch vendor profile if user is a vendor with completed profile
    if (currentUser && isVendorProfileComplete()) {
      // First, try to use the status from auth context if available
      const authStatus = getVendorStatus();
      if (authStatus) {
        // Create a minimal profile object with the auth status
        setVendorProfile(prevProfile => ({
          ...prevProfile,
          status: authStatus,
          businessName: currentUser?.name || 'Your Business'
        }));
      }
      
      // Then fetch full profile details from API
      fetchVendorProfile();
    }
  }, [currentUser, isVendorProfileComplete]);

  // Set up periodic refresh to check for status updates
  useEffect(() => {
    if (currentUser && isVendorProfileComplete() && vendorProfile?.status === 'PENDING') {
      // Check for status updates every 30 seconds if status is pending
      const interval = setInterval(() => {
        fetchVendorProfile();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [currentUser, isVendorProfileComplete, vendorProfile?.status]);

  const fetchVendorProfile = async () => {
    try {
      setLoading(true);
      const userId = currentUser.userId || currentUser.id || currentUser._id;
      
      if (!userId) {
        throw new Error("User ID not found");
      }
      
      const response = await vendorService.getVendorProfileByUserId(userId);
      
      if (response.success && response.data) {
        let profileData = response.data.data;
        
        // If the data contains a nested vendor profile object, use that instead
        if (response.data.data && response.data.data.vendorProfile) {
          profileData = response.data.data.vendorProfile;
        }
        
        setVendorProfile(profileData);
        
        // Update the auth context with the fresh status from the database
        const authStatus = getVendorStatus();
        
        // Only update if the API status is different and seems more recent
        // Priority: If auth context has APPROVED but API has PENDING, trust auth context
        if (profileData.status && profileData.status !== authStatus) {
          // If auth context has APPROVED but API returns PENDING, it might be stale data
          if (authStatus === 'APPROVED' && profileData.status === 'PENDING') {
            // Update the profile data to use the auth context status
            profileData.status = authStatus;
            setVendorProfile(profileData);
          } else {
            // For other cases, trust the API and update auth context
            const previousStatus = authStatus;
            updateVendorStatus(profileData.status);
            
            // Show notification for status change
            if (previousStatus === 'PENDING' && profileData.status === 'APPROVED') {
              setStatusChangeNotification({
                type: 'success',
                message: 'Congratulations! Your vendor application has been approved!'
              });
            } else if (previousStatus === 'PENDING' && profileData.status === 'REJECTED') {
              setStatusChangeNotification({
                type: 'error',
                message: 'Your vendor application has been rejected. Please check the details below.'
              });
            }
            
            // Clear notification after 5 seconds
            setTimeout(() => {
              setStatusChangeNotification(null);
            }, 5000);
          }
        }
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
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-4 w-4 mr-1" />
            Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <XCircle className="h-4 w-4 mr-1" />
            Rejected
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <AlertTriangle className="h-4 w-4 mr-1" />
            Pending Approval
          </span>
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  
  // Check if vendor profile is incomplete - redirect handled by ProtectedRoute
  if (!isVendorProfileComplete()) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {currentUser?.name || 'Vendor'}!</h1>
            <p className="text-gray-600">Please complete your vendor profile to continue.</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Incomplete</h2>
            <p className="text-gray-600 mb-8">You need to complete your vendor profile before you can access the vendor dashboard.</p>
            <Link 
              to="/vendor-registration" 
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 inline-block font-medium"
            >
              Complete Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Vendor-specific dashboard
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome, {currentUser?.name || 'Vendor'}!</h1>
              <p className="text-gray-600 mt-2">Manage your GreenMagic store and track your sales</p>
            </div>
            <div className="flex items-center space-x-4">
              {vendorProfile && getStatusBadge(vendorProfile.status)}
            </div>
          </div>
        </div>

        {/* Status Change Notification */}
        {statusChangeNotification && (
          <div className={`rounded-lg p-4 mb-8 border-l-4 ${
            statusChangeNotification.type === 'success' 
              ? 'bg-green-50 border-green-400' 
              : 'bg-red-50 border-red-400'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {statusChangeNotification.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-400 mr-3" />
                )}
                <span className={statusChangeNotification.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                  {statusChangeNotification.message}
                </span>
              </div>
              <button 
                onClick={() => setStatusChangeNotification(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Status-specific messages */}
        {vendorProfile && vendorProfile.status === 'PENDING' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <AlertTriangle className="h-6 w-6 text-yellow-400 mr-4 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Approval Pending</h3>
                <p className="text-yellow-700 mb-4">
                  Your vendor profile is under review by our team. This process typically takes 1-2 business days. 
                  You'll be able to sell products once approved.
                </p>
                <button 
                  onClick={fetchVendorProfile} 
                  disabled={loading}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 disabled:opacity-50"
                >
                  {loading ? 'Checking...' : 'Check Status'}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {vendorProfile && vendorProfile.status === 'APPROVED' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-400 mr-4 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-800 mb-2">Congratulations! Your Application is Approved</h3>
                <p className="text-green-700 mb-4">
                  Your vendor profile has been approved. You can now start listing and selling your products on GreenMagic.
                </p>
                <Link 
                  to="/vendor/products" 
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 inline-block"
                >
                  Start Selling
                </Link>
              </div>
            </div>
          </div>
        )}
        
        {vendorProfile && vendorProfile.status === 'REJECTED' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <XCircle className="h-6 w-6 text-red-400 mr-4 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Application Rejected</h3>
                <p className="text-red-700 mb-2">
                  <strong>Reason:</strong> {vendorProfile.rejectionReason || 'No specific reason provided'}
                </p>
                <p className="text-red-700 mb-4">
                  Please contact our support team at support@greenmagic.com for assistance.
                </p>
                <a 
                  href="mailto:support@greenmagic.com" 
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 inline-block"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Business Information - Always visible for all statuses */}
        {vendorProfile && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Building className="h-5 w-5 mr-2 text-gray-600" />
                Business Information
              </h2>
              {vendorProfile.status === 'APPROVED' && (
                <Link 
                  to="/vendor/edit-profile" 
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Edit Profile
                </Link>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Business Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide">Business Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Business Name</p>
                    <p className="text-sm font-medium text-gray-900">{vendorProfile.businessName || currentUser?.name || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Business Type</p>
                    <p className="text-sm font-medium text-gray-900">{vendorProfile.businessType || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">GST Number</p>
                    <p className="text-sm font-medium text-gray-900">{vendorProfile.gstNumber || "Not provided"}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide">Contact Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Business Email</p>
                    <p className="text-sm font-medium text-gray-900">{vendorProfile.businessEmail || currentUser?.email || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Business Phone</p>
                    <p className="text-sm font-medium text-gray-900">{vendorProfile.businessPhone || currentUser?.phoneNumber || "Not provided"}</p>
                  </div>
                  {vendorProfile.websiteUrl && (
                    <div>
                      <p className="text-sm text-gray-500">Website</p>
                      <a href={vendorProfile.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                        {vendorProfile.websiteUrl}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide">Address</h3>
                <div className="text-sm text-gray-900">
                  <p>{vendorProfile.addressLine1 || vendorProfile.address || "Address not provided"}</p>
                  {vendorProfile.addressLine2 && <p>{vendorProfile.addressLine2}</p>}
                  <p>{vendorProfile.city || ""}{vendorProfile.city && vendorProfile.state ? ", " : ""}{vendorProfile.state || ""}{(vendorProfile.city || vendorProfile.state) && vendorProfile.pincode ? " - " : ""}{vendorProfile.pincode || ""}</p>
                  <p>{vendorProfile.country || ""}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PENDING Status - Limited Dashboard View */}
        {vendorProfile && vendorProfile.status === 'PENDING' && (
          <div className="space-y-8">
            {/* What happens next section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Info className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">What happens next?</h3>
                  <p className="text-sm text-blue-700 mb-4">
                    Your application is being reviewed by our team. Here's the process:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-blue-800">1</span>
                      </div>
                      <div>
                        <p className="font-medium text-blue-900">Document Verification</p>
                        <p className="text-sm text-blue-700">We're reviewing your business documents</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-gray-600">2</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Business Validation</p>
                        <p className="text-sm text-gray-600">GST and business details verification</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-gray-600">3</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Approval Notification</p>
                        <p className="text-sm text-gray-600">You'll receive email confirmation (1-2 days)</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-blue-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-700">Review in progress...</span>
                      <button 
                        onClick={fetchVendorProfile} 
                        disabled={loading}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
                      >
                        {loading ? 'Checking...' : 'Check Status'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Limited feature preview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Package className="h-5 w-5 mr-2 text-gray-600" />
                Coming Soon - Your Vendor Features
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 opacity-60">
                  <div className="flex items-center mb-3">
                    <ShoppingBag className="h-6 w-6 text-gray-400 mr-3" />
                    <h3 className="text-lg font-medium text-gray-500">Product Management</h3>
                  </div>
                  <p className="text-sm text-gray-400">Add and manage your product catalog</p>
                  <div className="mt-3 text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded inline-block">
                    Available after approval
                  </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 opacity-60">
                  <div className="flex items-center mb-3">
                    <Package className="h-6 w-6 text-gray-400 mr-3" />
                    <h3 className="text-lg font-medium text-gray-500">Order Management</h3>
                  </div>
                  <p className="text-sm text-gray-400">Process and track customer orders</p>
                  <div className="mt-3 text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded inline-block">
                    Available after approval
                  </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 opacity-60">
                  <div className="flex items-center mb-3">
                    <BarChart2 className="h-6 w-6 text-gray-400 mr-3" />
                    <h3 className="text-lg font-medium text-gray-500">Sales Analytics</h3>
                  </div>
                  <p className="text-sm text-gray-400">Track your sales performance</p>
                  <div className="mt-3 text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded inline-block">
                    Available after approval
                  </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 opacity-60">
                  <div className="flex items-center mb-3">
                    <Users className="h-6 w-6 text-gray-400 mr-3" />
                    <h3 className="text-lg font-medium text-gray-500">Customer Management</h3>
                  </div>
                  <p className="text-sm text-gray-400">View customer information and feedback</p>
                  <div className="mt-3 text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded inline-block">
                    Available after approval
                  </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 opacity-60">
                  <div className="flex items-center mb-3">
                    <DollarSign className="h-6 w-6 text-gray-400 mr-3" />
                    <h3 className="text-lg font-medium text-gray-500">Payment & Billing</h3>
                  </div>
                  <p className="text-sm text-gray-400">Manage payments and billing</p>
                  <div className="mt-3 text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded inline-block">
                    Available after approval
                  </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 opacity-60">
                  <div className="flex items-center mb-3">
                    <Truck className="h-6 w-6 text-gray-400 mr-3" />
                    <h3 className="text-lg font-medium text-gray-500">Shipping & Logistics</h3>
                  </div>
                  <p className="text-sm text-gray-400">Configure shipping options</p>
                  <div className="mt-3 text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded inline-block">
                    Available after approval
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* APPROVED Status - Full Dashboard Features */}
        {vendorProfile && vendorProfile.status === 'APPROVED' && (
          <div className="space-y-8">
            {/* Sales Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Sales</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">₹{salesData.totalSales.toLocaleString()}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Monthly Revenue</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">₹{salesData.monthlyRevenue.toLocaleString()}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Package className="h-5 w-5 text-yellow-600" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Pending Orders</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">{salesData.pendingOrders}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Customers</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">{salesData.totalCustomers}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Package className="h-5 w-5 mr-2 text-gray-600" />
                  Recent Orders
                </h2>
                <Link to="/vendor/orders" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All Orders
                </Link>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{order.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Inventory Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Database className="h-5 w-5 mr-2 text-gray-600" />
                  Inventory Overview
                </h2>
                <Link to="/vendor/inventory" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Manage Inventory
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">42</div>
                  <div className="text-sm text-blue-800">Total Products</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">38</div>
                  <div className="text-sm text-green-800">In Stock</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">3</div>
                  <div className="text-sm text-yellow-800">Low Stock</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">1</div>
                  <div className="text-sm text-red-800">Out of Stock</div>
                </div>
              </div>
            </div>

            {/* Manage Your Store */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Settings className="h-5 w-5 mr-2 text-gray-600" />
                Manage Your Store
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link to="/vendor/products" className="group block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center mb-3">
                    <ShoppingBag className="h-6 w-6 text-blue-600 mr-3" />
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">Products</h3>
                  </div>
                  <p className="text-sm text-gray-600">Add, edit, and manage your product listings</p>
                </Link>

                <Link to="/vendor/orders" className="group block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center mb-3">
                    <Package className="h-6 w-6 text-green-600 mr-3" />
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-green-600">Orders</h3>
                  </div>
                  <p className="text-sm text-gray-600">View and manage customer orders</p>
                </Link>

                <Link to="/vendor/analytics" className="group block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center mb-3">
                    <BarChart2 className="h-6 w-6 text-purple-600 mr-3" />
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-purple-600">Analytics</h3>
                  </div>
                  <p className="text-sm text-gray-600">Track your sales and performance</p>
                </Link>

                <Link to="/vendor/customers" className="group block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center mb-3">
                    <Users className="h-6 w-6 text-indigo-600 mr-3" />
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600">Customers</h3>
                  </div>
                  <p className="text-sm text-gray-600">View customer information and feedback</p>
                </Link>

                <Link to="/vendor/settings" className="group block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center mb-3">
                    <Settings className="h-6 w-6 text-gray-600 mr-3" />
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-gray-600">Settings</h3>
                  </div>
                  <p className="text-sm text-gray-600">Configure your store settings and preferences</p>
                </Link>

                <Link to="/vendor/support" className="group block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center mb-3">
                    <Info className="h-6 w-6 text-orange-600 mr-3" />
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-orange-600">Support</h3>
                  </div>
                  <p className="text-sm text-gray-600">Get help and contact our support team</p>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* REJECTED Status - Support and Contact Information */}
        {vendorProfile && vendorProfile.status === 'REJECTED' && (
          <div className="space-y-8">
            {/* Support Contact Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Info className="h-5 w-5 mr-2 text-gray-600" />
                Need Help?
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center mb-4">
                    <Mail className="h-6 w-6 text-blue-600 mr-3" />
                    <h3 className="text-lg font-medium text-blue-900">Email Support</h3>
                  </div>
                  <p className="text-blue-700 mb-4">Get detailed assistance via email</p>
                  <a 
                    href="mailto:support@greenmagic.com?subject=Vendor Application - Assistance Required" 
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email Support
                  </a>
                </div>

                <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center mb-4">
                    <Building className="h-6 w-6 text-green-600 mr-3" />
                    <h3 className="text-lg font-medium text-green-900">Reapply</h3>
                  </div>
                  <p className="text-green-700 mb-4">Submit a new application with corrected information</p>
                  <Link 
                    to="/vendor-registration" 
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Start New Application
                  </Link>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
              
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Why was my application rejected?</h3>
                  <p className="text-gray-600">Applications are typically rejected due to incomplete documentation, invalid business information, or failure to meet our vendor requirements. Check the rejection reason above for specific details.</p>
                </div>
                
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Can I reapply?</h3>
                  <p className="text-gray-600">Yes, you can submit a new application. Please ensure all information is accurate and complete, and address the issues mentioned in the rejection reason.</p>
                </div>
                
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">How long does the review process take?</h3>
                  <p className="text-gray-600">Our review process typically takes 1-2 business days. You'll receive an email notification once your application status changes.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">What documents do I need?</h3>
                  <p className="text-gray-600">Required documents include GST certificate, PAN card, business registration proof, bank account details, and identity verification documents.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;
