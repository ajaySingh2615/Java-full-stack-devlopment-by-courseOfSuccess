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
  Info,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Import services
import vendorService from '../../services/vendorService';
import categoryService from '../../services/categoryService';

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
  
  // Category management state
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryModalMode, setCategoryModalMode] = useState('add'); // 'add' or 'edit'
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] = useState(false);
  
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
    fetchCategories();
  }, [isAuthenticated, isAdmin]);

  // Fetch categories for category management
  const fetchCategories = async () => {
    try {
      if (!isAuthenticated() || !isAdmin()) {
        return;
      }
      
      setCategoriesLoading(true);
      const response = await categoryService.getAllCategories();
      if (response.success) {
        setCategories(response.data);
      } else {
        console.error('Failed to fetch categories:', response.error);
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };
  
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
          case 'week': {
            // Check if date is within the last 7 days
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(now.getDate() - 7);
            if (vendorDate < oneWeekAgo) {
              return false;
            }
            break;
          }
          case 'month': {
            // Check if date is within the last 30 days
            const oneMonthAgo = new Date();
            oneMonthAgo.setDate(now.getDate() - 30);
            if (vendorDate < oneMonthAgo) {
              return false;
            }
            break;
          }
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
            Pending
          </span>
        );
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

  // ===========================
  // CATEGORY MANAGEMENT FUNCTIONS
  // ===========================

  const openCategoryModal = (mode, category = null) => {
    setCategoryModalMode(mode);
    setSelectedCategory(category);
    setIsCategoryModalOpen(true);
  };

  const closeCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setSelectedCategory(null);
    setCategoryModalMode('add');
  };

  const openDeleteCategoryModal = (category) => {
    setCategoryToDelete(category);
    setIsDeleteCategoryModalOpen(true);
  };

  const closeDeleteCategoryModal = () => {
    setIsDeleteCategoryModalOpen(false);
    setCategoryToDelete(null);
  };

  const handleCategorySubmit = async (categoryData) => {
    try {
      let response;
      if (categoryModalMode === 'add') {
        response = await categoryService.createCategory(categoryData);
      } else {
        response = await categoryService.updateCategory(selectedCategory.categoryId, categoryData);
      }

      if (response.success) {
        await fetchCategories(); // Refresh the list
        closeCategoryModal();
        // You could add a success toast here
      } else {
        // Handle error - you could show an error toast here
        console.error('Category operation failed:', response.error);
      }
    } catch (error) {
      console.error('Error in category operation:', error);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      const response = await categoryService.deleteCategory(categoryToDelete.categoryId);
      if (response.success) {
        await fetchCategories(); // Refresh the list
        closeDeleteCategoryModal();
        // You could add a success toast here
      } else {
        // Handle error - you could show an error toast here
        console.error('Category deletion failed:', response.error);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  // Filter categories based on search query
  const getFilteredCategories = () => {
    return categories.filter(category => {
      if (categorySearchQuery) {
        const query = categorySearchQuery.toLowerCase();
        return category.name?.toLowerCase().includes(query);
      }
      return true;
    }).sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  };
  
  // Vendor detail modal component
  const VendorDetailModal = ({ vendor, onClose }) => {
    if (!vendor) return null;
    
    const vendorId = vendor.vendorId || vendor.id || vendor._id;
    
    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col">
          {/* Modal Header - Fixed */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Vendor Details</h2>
                <p className="text-sm text-gray-500">Comprehensive vendor information</p>
              </div>
            </div>
            <button 
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" 
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Modal Body - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-8">
              {/* Vendor Header Section */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-2xl font-bold text-gray-900 truncate">{vendor.businessName}</h3>
                      <div className="flex-shrink-0">
                        {getStatusBadge(vendor.status)}
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 space-x-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Registered: {formatDate(vendor.createdAt)}</span>
                      </div>
                      {vendor.storeDisplayName && (
                        <div className="flex items-center">
                          <Store className="h-4 w-4 mr-2" />
                          <span>Store: {vendor.storeDisplayName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Information Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Business Information */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
                  <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Store className="h-4 w-4 text-blue-600" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900">Business Information</h4>
                  </div>
                  <dl className="space-y-4">
                    <div className="flex flex-col space-y-1">
                      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Business Name</dt>
                      <dd className="text-sm text-gray-900 font-medium">{vendor.businessName || 'N/A'}</dd>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Legal Business Name</dt>
                      <dd className="text-sm text-gray-900">{vendor.legalBusinessName || 'N/A'}</dd>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Business Type</dt>
                      <dd className="text-sm text-gray-900">
                        {vendor.businessType ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {vendor.businessType.replace(/_/g, ' ')}
                          </span>
                        ) : (
                          'N/A'
                        )}
                      </dd>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col space-y-1">
                        <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">GST Number</dt>
                        <dd className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded text-xs">{vendor.gstNumber || 'N/A'}</dd>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">PAN Number</dt>
                        <dd className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded text-xs">{vendor.panNumber || 'N/A'}</dd>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Website</dt>
                      <dd className="text-sm text-gray-900">
                        {vendor.websiteUrl ? (
                          <a 
                            href={vendor.websiteUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded text-xs"
                          >
                            <span className="truncate max-w-xs">{vendor.websiteUrl}</span>
                            <svg className="ml-1 w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </a>
                        ) : (
                          'N/A'
                        )}
                      </dd>
                    </div>
                  </dl>
                </div>
                
                {/* Contact Information */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
                  <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Mail className="h-4 w-4 text-green-600" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900">Contact Information</h4>
                  </div>
                  <dl className="space-y-4">
                    <div className="flex flex-col space-y-1">
                      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Business Email</dt>
                      <dd className="text-sm text-gray-900">
                        {vendor.businessEmail ? (
                          <a href={`mailto:${vendor.businessEmail}`} className="inline-flex items-center text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded text-xs">
                            <Mail className="h-3 w-3 mr-1" />
                            {vendor.businessEmail}
                          </a>
                        ) : (
                          'N/A'
                        )}
                      </dd>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Support Email</dt>
                      <dd className="text-sm text-gray-900">
                        {vendor.supportEmail ? (
                          <a href={`mailto:${vendor.supportEmail}`} className="inline-flex items-center text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded text-xs">
                            <Mail className="h-3 w-3 mr-1" />
                            {vendor.supportEmail}
                          </a>
                        ) : (
                          'N/A'
                        )}
                      </dd>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col space-y-1">
                        <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Business Phone</dt>
                        <dd className="text-sm text-gray-900">
                          {vendor.businessPhone ? (
                            <a href={`tel:${vendor.businessPhone}`} className="inline-flex items-center text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded text-xs">
                              <Phone className="h-3 w-3 mr-1" />
                              {vendor.businessPhone}
                            </a>
                          ) : (
                            'N/A'
                          )}
                        </dd>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Personal Phone</dt>
                        <dd className="text-sm text-gray-900">
                          {vendor.phoneNumber ? (
                            <a href={`tel:${vendor.phoneNumber}`} className="inline-flex items-center text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded text-xs">
                              <Phone className="h-3 w-3 mr-1" />
                              {vendor.phoneNumber}
                            </a>
                          ) : (
                            'N/A'
                          )}
                        </dd>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Personal Email</dt>
                      <dd className="text-sm text-gray-900">
                        {vendor.email ? (
                          <a href={`mailto:${vendor.email}`} className="inline-flex items-center text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded text-xs">
                            <Mail className="h-3 w-3 mr-1" />
                            {vendor.email}
                          </a>
                        ) : (
                          'N/A'
                        )}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Address and Banking Information Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Address Information */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
                  <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-4 w-4 text-yellow-600" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900">Address Information</h4>
                  </div>
                  <dl className="space-y-4">
                    <div className="flex flex-col space-y-1">
                      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Address Line 1</dt>
                      <dd className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">{vendor.addressLine1 || vendor.address || 'N/A'}</dd>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Address Line 2</dt>
                      <dd className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">{vendor.addressLine2 || 'N/A'}</dd>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col space-y-1">
                        <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">City</dt>
                        <dd className="text-sm text-gray-900 font-medium">{vendor.city || 'N/A'}</dd>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">State</dt>
                        <dd className="text-sm text-gray-900 font-medium">{vendor.state || 'N/A'}</dd>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col space-y-1">
                        <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Pincode</dt>
                        <dd className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded text-xs">{vendor.pincode || 'N/A'}</dd>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Country</dt>
                        <dd className="text-sm text-gray-900 font-medium">{vendor.country || 'India'}</dd>
                      </div>
                    </div>
                  </dl>
                </div>
                
                {/* Banking Information */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
                  <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-4 w-4 text-purple-600" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900">Banking Information</h4>
                  </div>
                  <dl className="space-y-4">
                    <div className="flex flex-col space-y-1">
                      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Account Holder Name</dt>
                      <dd className="text-sm text-gray-900 font-medium">{vendor.accountHolderName || 'N/A'}</dd>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Account Number</dt>
                      <dd className="text-sm text-gray-900 font-mono">
                        {vendor.accountNumber ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                            ******{vendor.accountNumber.slice(-4)}
                          </span>
                        ) : (
                          'N/A'
                        )}
                      </dd>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col space-y-1">
                        <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">IFSC Code</dt>
                        <dd className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded text-xs">{vendor.ifscCode || 'N/A'}</dd>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Bank Name</dt>
                        <dd className="text-sm text-gray-900 font-medium">{vendor.bankName || 'N/A'}</dd>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Bank Branch</dt>
                      <dd className="text-sm text-gray-900">{vendor.bankBranch || 'N/A'}</dd>
                    </div>
                  </dl>
                </div>
              </div>
              
              {/* Store and Document Information Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Store Information */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
                  <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Store className="h-4 w-4 text-indigo-600" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900">Store Information</h4>
                  </div>
                  <dl className="space-y-4">
                    <div className="flex flex-col space-y-1">
                      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Store Display Name</dt>
                      <dd className="text-sm text-gray-900 font-medium">{vendor.storeDisplayName || 'N/A'}</dd>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Product Categories</dt>
                      <dd className="text-sm text-gray-900">
                        {vendor.productCategories ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {vendor.productCategories}
                          </span>
                        ) : (
                          'N/A'
                        )}
                      </dd>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Store Description</dt>
                      <dd className="text-sm text-gray-900">
                        <div className="bg-gray-50 p-4 rounded-lg max-h-32 overflow-y-auto border border-gray-200">
                          <p className="whitespace-pre-line text-sm leading-relaxed">
                            {vendor.storeDescription || 'No description provided'}
                          </p>
                        </div>
                      </dd>
                    </div>
                  </dl>
                </div>
                
                {/* Document Information */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
                  <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-4 w-4 text-orange-600" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900">Document Information</h4>
                  </div>
                  <dl className="space-y-4">
                    {[
                      { label: 'Logo', url: vendor.logoUrl, name: 'View Logo' },
                      { label: 'GST Certificate', url: vendor.gstCertificateUrl, name: 'View Certificate' },
                      { label: 'Cancelled Cheque', url: vendor.cancelledChequeUrl, name: 'View Cheque' },
                      { label: 'PAN Card', url: vendor.panCardUrl, name: 'View PAN Card' },
                      { label: 'Identity Proof', url: vendor.identityProofUrl, name: 'View ID Proof' }
                    ].map((doc, index) => (
                      <div key={index} className="flex flex-col space-y-1">
                        <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">{doc.label}</dt>
                        <dd className="text-sm text-gray-900">
                          {doc.url ? (
                            <a 
                              href={doc.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="inline-flex items-center px-3 py-2 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 transition-colors"
                            >
                              <FileText className="h-3 w-3 mr-2" />
                              {doc.name}
                              <svg className="ml-1 w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </a>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-md">
                              Not uploaded
                            </span>
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
              
              {/* Rejection Reason */}
              {vendor.status === 'REJECTED' && vendor.rejectionReason && (
                <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <XCircle className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-red-800 mb-2">Rejection Reason</h4>
                      <p className="text-sm text-red-700 leading-relaxed">{vendor.rejectionReason}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Vendor Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-200 rounded-lg mx-auto mb-4">
                    <Package className="h-6 w-6 text-blue-700" />
                  </div>
                  <div className="text-3xl font-bold text-blue-900 mb-1">
                    {vendor.productsCount || 0}
                  </div>
                  <div className="text-sm font-medium text-blue-700 uppercase tracking-wide mb-1">
                    Products Listed
                  </div>
                  <div className="text-xs text-blue-600">
                    Active items in catalog
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6 text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-200 rounded-lg mx-auto mb-4">
                    <ShoppingBag className="h-6 w-6 text-green-700" />
                  </div>
                  <div className="text-3xl font-bold text-green-900 mb-1">
                    {vendor.ordersCount || 0}
                  </div>
                  <div className="text-sm font-medium text-green-700 uppercase tracking-wide mb-1">
                    Total Orders
                  </div>
                  <div className="text-xs text-green-600">
                    Completed transactions
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6 text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-200 rounded-lg mx-auto mb-4">
                    <TrendingUp className="h-6 w-6 text-purple-700" />
                  </div>
                  <div className="text-3xl font-bold text-purple-900 mb-1">
                    ₹{(vendor.revenue || 0).toLocaleString()}
                  </div>
                  <div className="text-sm font-medium text-purple-700 uppercase tracking-wide mb-1">
                    Total Revenue
                  </div>
                  <div className="text-xs text-purple-600">
                    Gross sales amount
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Modal Footer - Fixed */}
          <div className="flex-shrink-0 px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <button 
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                onClick={onClose}
              >
                <X className="h-4 w-4 mr-2" />
                Close
              </button>
              
              <div className="flex flex-col sm:flex-row gap-3">
                {vendor.status !== 'APPROVED' && (
                  <button 
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-sm transition-colors"
                    onClick={() => {
                      openConfirmModal({
                        type: 'approve',
                        vendorId: vendorId,
                        vendorName: vendor.businessName
                      });
                    }}
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    Approve Vendor
                  </button>
                )}
                
                {vendor.status !== 'REJECTED' && (
                  <button 
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-sm transition-colors"
                    onClick={() => {
                      openConfirmModal({
                        type: 'reject',
                        vendorId: vendorId,
                        vendorName: vendor.businessName
                      });
                    }}
                  >
                    <UserX className="h-4 w-4 mr-2" />
                    Reject Vendor
                  </button>
                )}
                
                {vendor.status === 'REJECTED' && (
                  <button 
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 shadow-sm transition-colors"
                    onClick={() => {
                      openConfirmModal({
                        type: 'reset',
                        vendorId: vendorId,
                        vendorName: vendor.businessName
                      });
                    }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset to Pending
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
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <button className="text-gray-400 hover:text-gray-600" onClick={onCancel}>
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="px-6 py-4">
            <p className="text-sm text-gray-600 mb-6">{message}</p>
            
            <div className="flex justify-end space-x-3">
              <button 
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button 
                className={`px-4 py-2 rounded-md text-white font-medium ${
                  confirmClass === 'approve' ? 'bg-green-600 hover:bg-green-700' :
                  confirmClass === 'reject' ? 'bg-red-600 hover:bg-red-700' :
                  'bg-gray-600 hover:bg-gray-700'
                }`}
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 hover:border-gray-300">        
        {/* Card Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">
                {vendor.businessName}
              </h3>
              <p className="text-sm text-gray-500 truncate">
                {vendor.storeDisplayName || 'Store name not set'}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0">
              {getStatusBadge(vendor.status)}
            </div>
          </div>
        </div>
        
        {/* Card Body */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Business Information Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Business Type</dt>
                <dd className="text-sm text-gray-900">
                  {vendor.businessType ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {vendor.businessType.replace(/_/g, ' ')}
                    </span>
                  ) : (
                    'N/A'
                  )}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Products</dt>
                <dd className="text-sm text-gray-900 font-medium">
                  {vendor.productsCount || 0} items
                </dd>
              </div>
            </div>
            
            {/* Contact Information Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</dt>
                <dd className="text-sm text-gray-900">
                  {vendor.businessPhone ? (
                    <a href={`tel:${vendor.businessPhone}`} className="text-blue-600 hover:text-blue-700">
                      {vendor.businessPhone}
                    </a>
                  ) : (
                    'N/A'
                  )}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</dt>
                <dd className="text-sm text-gray-900 truncate">
                  {vendor.businessEmail ? (
                    <a href={`mailto:${vendor.businessEmail}`} className="text-blue-600 hover:text-blue-700 truncate block">
                      {vendor.businessEmail}
                    </a>
                  ) : (
                    'N/A'
                  )}
                </dd>
              </div>
            </div>
            
            {/* Business Details Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">GST Number</dt>
                <dd className="text-sm text-gray-900 font-mono text-xs">
                  {vendor.gstNumber || 'N/A'}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Location</dt>
                <dd className="text-sm text-gray-900">
                  {(vendor.city && vendor.state) ? `${vendor.city}, ${vendor.state}` : 'N/A'}
                </dd>
              </div>
            </div>
            
            {/* Registration Date */}
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="h-3 w-3 mr-1" />
                <span>Registered: {formatDate(vendor.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Card Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-2">
            <button 
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex-1 sm:flex-none"
              onClick={() => onViewDetails(vendor)}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </button>
            
            <div className="flex gap-2 sm:ml-auto">
              {vendor.status === 'PENDING' && (
                <>
                  <button 
                    className="flex items-center justify-center px-3 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 hover:border-green-300 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    onClick={() => {
                      onApprove({
                        type: 'approve',
                        vendorId: vendorId,
                        vendorName: vendor.businessName
                      });
                    }}
                    title="Approve Vendor"
                  >
                    <UserCheck className="h-4 w-4" />
                    <span className="sr-only">Approve</span>
                  </button>
                  <button 
                    className="flex items-center justify-center px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 hover:border-red-300 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    onClick={() => {
                      onReject({
                        type: 'reject',
                        vendorId: vendorId,
                        vendorName: vendor.businessName
                      });
                    }}
                    title="Reject Vendor"
                  >
                    <UserX className="h-4 w-4" />
                    <span className="sr-only">Reject</span>
                  </button>
                </>
              )}
              
              {vendor.status === 'REJECTED' && (
                <button 
                  className="flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  onClick={() => {
                    onReset({
                      type: 'reset',
                      vendorId: vendorId,
                      vendorName: vendor.businessName
                    });
                  }}
                  title="Reset to Pending"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Display unauthorized message if not admin
  if (!isAuthenticated() || !isAdmin()) {
    return null; // Will be redirected by the first useEffect
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {currentUser?.name || 'Admin'}! Manage your platform from here.</p>
        </div>
        
        {/* Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8 overflow-hidden">
          <div className="flex flex-wrap">
            <button 
              className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'overview' 
                  ? 'bg-green-50 text-green-700 border-b-2 border-green-600' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              <BarChart2 className="h-5 w-5 mr-2" />
              Overview
            </button>
            <button 
              className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'vendors' 
                  ? 'bg-green-50 text-green-700 border-b-2 border-green-600' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('vendors')}
            >
              <Users className="h-5 w-5 mr-2" />
              Vendors
            </button>
            <button 
              className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'products' 
                  ? 'bg-green-50 text-green-700 border-b-2 border-green-600' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('products')}
            >
              <Package className="h-5 w-5 mr-2" />
              Products
            </button>
            <button 
              className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'categories' 
                  ? 'bg-green-50 text-green-700 border-b-2 border-green-600' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('categories')}
            >
              <Tag className="h-5 w-5 mr-2" />
              Categories
            </button>
            <button 
              className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'orders' 
                  ? 'bg-green-50 text-green-700 border-b-2 border-green-600' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('orders')}
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Orders
            </button>
            <button 
              className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'settings' 
                  ? 'bg-green-50 text-green-700 border-b-2 border-green-600' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings className="h-5 w-5 mr-2" />
              Settings
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">Loading dashboard data...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        ) : (
          <>
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Vendors Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Vendors</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">{vendorCounts.TOTAL || 0}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-3">
                  <div className="text-sm">
                    <div className="flex items-center justify-between text-gray-600">
                      <span className="flex items-center">
                        <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                        {vendorCounts.APPROVED || 0} Approved
                      </span>
                      <span className="flex items-center">
                        <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                        {vendorCounts.PENDING || 0} Pending
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Total Products Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Package className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {vendors.reduce((sum, vendor) => sum + (vendor.productsCount || 0), 0)}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-3">
                  <div className="text-sm text-gray-600">
                    From {vendors.filter(v => v.productsCount > 0).length} active vendors
                  </div>
                </div>
              </div>
              
              {/* Total Orders Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <ShoppingBag className="h-5 w-5 text-yellow-600" />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {vendors.reduce((sum, vendor) => sum + (vendor.ordersCount || 0), 0)}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-3">
                  <div className="text-sm text-gray-600">
                    Active marketplace
                  </div>
                </div>
              </div>

              {/* Total Revenue Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-purple-600" />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            ₹{vendors.reduce((sum, vendor) => sum + (vendor.revenue || 0), 0).toLocaleString()}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-3">
                  <div className="text-sm text-gray-600">
                    Platform earnings
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Vendor Applications */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-gray-600" />
                  Recent Vendor Applications
                </h2>
                <button 
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  onClick={() => setActiveTab('vendors')}
                >
                  View All
                </button>
              </div>
              
              {vendors.filter(v => v.status === 'PENDING').length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GST Number</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {vendors
                        .filter(vendor => vendor.status === 'PENDING')
                        .slice(0, 5)
                        .map(vendor => (
                          <tr key={vendor.vendorId || vendor.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vendor.businessName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vendor.ownerName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(vendor.createdAt)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vendor.gstNumber}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div className="flex space-x-2">
                                <button 
                                  className="text-blue-600 hover:text-blue-700"
                                  title="View Details"
                                  onClick={() => openVendorDetail(vendor)}
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button 
                                  className="text-green-600 hover:text-green-700"
                                  title="Approve Vendor"
                                  onClick={() => openConfirmModal({
                                    type: 'approve',
                                    vendorId: vendor.vendorId || vendor.id,
                                    vendorName: vendor.businessName
                                  })}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </button>
                                <button 
                                  className="text-red-600 hover:text-red-700"
                                  title="Reject Vendor"
                                  onClick={() => openConfirmModal({
                                    type: 'reject',
                                    vendorId: vendor.vendorId || vendor.id,
                                    vendorName: vendor.businessName
                                  })}
                                >
                                  <XCircle className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <p className="text-lg text-gray-600">No pending vendor applications</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Vendors Tab */}
        {activeTab === 'vendors' && (
          <div>
            {/* Filter Bar */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <div className="space-y-6">
                {/* Filter Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Filter Vendors</h3>
                  <button 
                    className="mt-3 sm:mt-0 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    onClick={resetFilters}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset All
                  </button>
                </div>
                
                {/* Search and Filters */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-4">
                  {/* Search Box */}
                  <div className="lg:col-span-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search Vendors
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                      <input 
                        type="text" 
                        placeholder="Search by name, email, GST..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  
                  {/* Status Filter */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select 
                      value={filters.status}
                      onChange={(e) => setFilters({...filters, status: e.target.value})}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  
                  {/* Date Range Filter */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Range
                    </label>
                    <select 
                      value={filters.dateRange}
                      onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                    </select>
                  </div>
                  
                  {/* Sort By Filter */}
                  <div className="lg:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort By
                    </label>
                    <select 
                      value={filters.sortBy}
                      onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="name-asc">Name (A-Z)</option>
                      <option value="name-desc">Name (Z-A)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
                
            {/* Filter Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900">
                    {filteredVendors.length} {filteredVendors.length === 1 ? 'vendor' : 'vendors'} found
                  </span>
                  {(filters.status !== 'all' || filters.dateRange !== 'all' || searchQuery) && (
                    <span className="ml-2 text-sm text-gray-500">
                      • Filtered results
                    </span>
                  )}
                </div>
                
                {/* Active Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  {filters.status !== 'all' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Status: {filters.status}
                      <button 
                        className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600 focus:outline-none focus:bg-blue-200 focus:text-blue-600"
                        onClick={() => setFilters({...filters, status: 'all'})}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  
                  {filters.dateRange !== 'all' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Date: {filters.dateRange === 'today' ? 'Today' : 
                             filters.dateRange === 'week' ? 'This Week' : 
                             'This Month'}
                      <button 
                        className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600 focus:outline-none focus:bg-blue-200 focus:text-blue-600"
                        onClick={() => setFilters({...filters, dateRange: 'all'})}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  
                  {searchQuery && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Search: "{searchQuery.length > 20 ? searchQuery.substring(0, 20) + '...' : searchQuery}"
                      <button 
                        className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600 focus:outline-none focus:bg-blue-200 focus:text-blue-600"
                        onClick={() => setSearchQuery('')}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            </div>
                
            {/* Vendors Grid */}
            {filteredVendors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-12 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No vendors found</h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    {searchQuery || filters.status !== 'all' || filters.dateRange !== 'all' 
                      ? 'No vendors match your current search criteria. Try adjusting your filters.'
                      : 'No vendors have registered yet. Check back later or invite vendors to join your platform.'
                    }
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button 
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      onClick={resetFilters}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reset Filters
                    </button>
                    {!searchQuery && filters.status === 'all' && filters.dateRange === 'all' && (
                      <button 
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        onClick={() => window.open('/vendor/register', '_blank')}
                      >
                        <Store className="h-4 w-4 mr-2" />
                        Invite Vendors
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Placeholder for other tabs */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-12 text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="h-10 w-10 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Products Management</h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Comprehensive product management features are currently under development. 
                Soon you'll be able to manage inventory, pricing, and product listings.
              </p>
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700">
                <Info className="h-4 w-4 mr-2" />
                Coming Soon
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-12 text-center">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="h-10 w-10 text-yellow-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Orders Management</h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Advanced order tracking, processing, and analytics tools are being developed. 
                Monitor sales, manage fulfillment, and track performance metrics.
              </p>
              <div className="inline-flex items-center px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-700">
                <Info className="h-4 w-4 mr-2" />
                Coming Soon
              </div>
            </div>
          </div>
        )}
        
        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div>
            {/* Categories Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Tag className="h-5 w-5 mr-2 text-gray-600" />
                    Categories Management
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Manage product categories that vendors can use for their products.
                  </p>
                </div>
                <button
                  onClick={() => openCategoryModal('add')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <Tag className="h-4 w-4 mr-2" />
                  Add Category
                </button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex-1 max-w-lg">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search categories..."
                      value={categorySearchQuery}
                      onChange={(e) => setCategorySearchQuery(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">
                    {getFilteredCategories().length} {getFilteredCategories().length === 1 ? 'category' : 'categories'}
                  </span>
                </div>
              </div>
            </div>

            {/* Categories Table */}
            {categoriesLoading ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading categories...</p>
              </div>
            ) : getFilteredCategories().length > 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Products Count
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created Date
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {getFilteredCategories().map((category) => (
                        <tr key={category.categoryId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8">
                                <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                                  <Tag className="h-4 w-4 text-green-600" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {category.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            #{category.categoryId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {category.productCount || 0} products
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {category.createdAt ? formatDate(category.createdAt) : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                            <button
                              onClick={() => openCategoryModal('edit', category)}
                              className="text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => openDeleteCategoryModal(category)}
                              className="text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-12 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Tag className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No categories found</h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    {categorySearchQuery 
                      ? 'No categories match your search criteria. Try adjusting your search terms.'
                      : 'No categories have been created yet. Add your first category to get started.'
                    }
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {categorySearchQuery && (
                      <button 
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        onClick={() => setCategorySearchQuery('')}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Clear Search
                      </button>
                    )}
                    <button 
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      onClick={() => openCategoryModal('add')}
                    >
                      <Tag className="h-4 w-4 mr-2" />
                      Add First Category
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-12 text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Settings className="h-10 w-10 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Admin Settings</h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Platform configuration, user management, and system settings will be available here. 
                Control permissions, customize features, and manage platform policies.
              </p>
              <div className="inline-flex items-center px-4 py-2 bg-purple-50 border border-purple-200 rounded-md text-sm text-purple-700">
                <Info className="h-4 w-4 mr-2" />
                Coming Soon
              </div>
            </div>
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
      
      {/* Category Modal */}
      {isCategoryModalOpen && (
        <CategoryModal 
          mode={categoryModalMode}
          category={selectedCategory}
          onSubmit={handleCategorySubmit}
          onCancel={closeCategoryModal}
        />
      )}
      
      {/* Delete Category Confirmation Modal */}
      {isDeleteCategoryModalOpen && (
        <DeleteCategoryModal 
          category={categoryToDelete}
          onConfirm={handleDeleteCategory}
          onCancel={closeDeleteCategoryModal}
        />
      )}
    </div>
  );

  // ===========================
  // CATEGORY MODAL COMPONENTS
  // ===========================

  // Category Add/Edit Modal
  function CategoryModal({ mode, category, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
      name: category?.name || ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      // Validate form
      const validationError = categoryService.validateCategoryName(formData.name);
      if (validationError) {
        setErrors({ name: validationError });
        return;
      }

      setIsSubmitting(true);
      setErrors({});

      try {
        await onSubmit(formData);
      } catch (error) {
        setErrors({ submit: 'Failed to save category. Please try again.' });
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
      // Clear errors on change
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: null }));
      }
    };

    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
          <form onSubmit={handleSubmit}>
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {mode === 'add' ? 'Add New Category' : 'Edit Category'}
              </h3>
              <button 
                type="button"
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter category name"
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-sm text-red-600">{errors.submit}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-3 px-6 py-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  mode === 'add' ? 'Add Category' : 'Update Category'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Delete Category Confirmation Modal
  function DeleteCategoryModal({ category, onConfirm, onCancel }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirm = async () => {
      setIsDeleting(true);
      try {
        await onConfirm();
      } finally {
        setIsDeleting(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Delete Category</h3>
            <button 
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="px-6 py-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Are you sure you want to delete this category?
                </h4>
                <p className="mt-1 text-sm text-gray-500">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Tag className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {category?.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    ID: #{category?.categoryId}
                  </p>
                </div>
              </div>
            </div>

            {/* Warning about products */}
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0" />
                <p className="text-sm text-yellow-700">
                  <strong>Warning:</strong> Products using this category will become uncategorized. 
                  Make sure to reassign products to other categories before deleting.
                </p>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end space-x-3 px-6 py-4 border-t border-gray-200">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isDeleting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </div>
              ) : (
                'Delete Category'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default AdminDashboard; 