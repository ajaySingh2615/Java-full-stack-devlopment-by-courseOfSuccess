import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  MessageSquare, 
  Mail,
  Phone,
  Star,
  MapPin,
  Calendar,
  Package,
  TrendingUp,
  Download
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Vendor Customers Component - Phase 1 Foundation
 * 
 * Basic customer management interface for vendors
 * Based on customer-management.json specifications
 */
const VendorCustomers = () => {
  const { currentUser } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSegment, setFilterSegment] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Mock data for Phase 1 - replace with API calls later
  const mockCustomers = [
    {
      id: 'CUST-001',
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+91 9876543210',
      city: 'Mumbai',
      state: 'Maharashtra',
      joinDate: '2024-12-15',
      totalOrders: 12,
      totalSpent: 18500,
      avgOrderValue: 1542,
      lastOrderDate: '2025-01-15',
      segment: 'VIP',
      rating: 4.8,
      status: 'ACTIVE'
    },
    {
      id: 'CUST-002',
      name: 'Sarah Smith',
      email: 'sarah.smith@email.com',
      phone: '+91 9876543211',
      city: 'Delhi',
      state: 'Delhi',
      joinDate: '2024-11-20',
      totalOrders: 8,
      totalSpent: 12300,
      avgOrderValue: 1538,
      lastOrderDate: '2025-01-10',
      segment: 'REGULAR',
      rating: 4.5,
      status: 'ACTIVE'
    },
    {
      id: 'CUST-003',
      name: 'Mike Johnson',
      email: 'mike.johnson@email.com',
      phone: '+91 9876543212',
      city: 'Bangalore',
      state: 'Karnataka',
      joinDate: '2025-01-05',
      totalOrders: 3,
      totalSpent: 4200,
      avgOrderValue: 1400,
      lastOrderDate: '2025-01-12',
      segment: 'NEW',
      rating: 4.2,
      status: 'ACTIVE'
    }
  ];

  // Customer segments
  const customerSegments = {
    VIP: { label: 'VIP Customer', color: 'purple' },
    REGULAR: { label: 'Regular Customer', color: 'blue' },
    NEW: { label: 'New Customer', color: 'green' },
    INACTIVE: { label: 'Inactive', color: 'gray' }
  };

  // Simulate API call
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCustomers(mockCustomers);
        setError(null);
      } catch (err) {
        setError('Failed to load customers. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Filter customers based on search and segment
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSegment = filterSegment === 'all' || customer.segment === filterSegment;
    return matchesSearch && matchesSegment;
  });

  // Get segment badge
  const getSegmentBadge = (segment) => {
    const segmentConfig = customerSegments[segment];
    if (!segmentConfig) return null;

    const colorClasses = {
      purple: 'bg-purple-100 text-purple-800',
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      gray: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorClasses[segmentConfig.color]}`}>
        {segmentConfig.label}
      </span>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Open customer details modal
  const openCustomerDetails = (customer) => {
    setSelectedCustomer(customer);
    setIsDetailModalOpen(true);
  };

  // Close customer details modal
  const closeCustomerDetails = () => {
    setSelectedCustomer(null);
    setIsDetailModalOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
              <p className="text-gray-600 mt-1">View and manage your customer relationships</p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Download className="w-4 h-4 mr-2" />
                Export Customers
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700">
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Newsletter
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Customers</p>
                <p className="text-2xl font-semibold text-gray-900">{customers.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">VIP Customers</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {customers.filter(c => c.segment === 'VIP').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Average Rating</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {(customers.reduce((sum, c) => sum + c.rating, 0) / customers.length).toFixed(1)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {customers.reduce((sum, c) => sum + c.totalOrders, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customers by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={filterSegment}
                onChange={(e) => setFilterSegment(e.target.value)}
                className="block w-40 px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Segments</option>
                {Object.entries(customerSegments).map(([segment, config]) => (
                  <option key={segment} value={segment}>{config.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Customers List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
              <p className="text-gray-500">
                {searchQuery || filterSegment !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Customers will appear here once they start purchasing from you'
                }
              </p>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="col-span-3">Customer</div>
                  <div className="col-span-2">Location</div>
                  <div className="col-span-2">Orders</div>
                  <div className="col-span-2">Total Spent</div>
                  <div className="col-span-2">Segment</div>
                  <div className="col-span-1">Actions</div>
                </div>
              </div>

              {/* Customers Table */}
              <div className="divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <div key={customer.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-3">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-green-600">
                                {customer.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                            <div className="text-sm text-gray-500">{customer.email}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-span-2">
                        <div className="text-sm text-gray-900">{customer.city}</div>
                        <div className="text-sm text-gray-500">{customer.state}</div>
                      </div>
                      
                      <div className="col-span-2">
                        <div className="text-sm font-medium text-gray-900">{customer.totalOrders}</div>
                        <div className="text-sm text-gray-500">Last: {formatDate(customer.lastOrderDate)}</div>
                      </div>
                      
                      <div className="col-span-2">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(customer.totalSpent)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Avg: {formatCurrency(customer.avgOrderValue)}
                        </div>
                      </div>
                      
                      <div className="col-span-2">
                        {getSegmentBadge(customer.segment)}
                        <div className="flex items-center mt-1">
                          <Star className="w-3 h-3 text-yellow-400 mr-1" />
                          <span className="text-sm text-gray-500">{customer.rating}</span>
                        </div>
                      </div>
                      
                      <div className="col-span-1">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => openCustomerDetails(customer)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-gray-400 hover:text-green-600">
                            <MessageSquare className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Customer Details Modal */}
        {isDetailModalOpen && selectedCustomer && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">Customer Details</h2>
                  <button 
                    onClick={closeCustomerDetails}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Customer Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Personal Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-500">Name:</span> {selectedCustomer.name}</p>
                      <p><span className="text-gray-500">Email:</span> {selectedCustomer.email}</p>
                      <p><span className="text-gray-500">Phone:</span> {selectedCustomer.phone}</p>
                      <p><span className="text-gray-500">Location:</span> {selectedCustomer.city}, {selectedCustomer.state}</p>
                      <p><span className="text-gray-500">Join Date:</span> {formatDate(selectedCustomer.joinDate)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Purchase History</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-500">Total Orders:</span> {selectedCustomer.totalOrders}</p>
                      <p><span className="text-gray-500">Total Spent:</span> {formatCurrency(selectedCustomer.totalSpent)}</p>
                      <p><span className="text-gray-500">Average Order:</span> {formatCurrency(selectedCustomer.avgOrderValue)}</p>
                      <p><span className="text-gray-500">Last Order:</span> {formatDate(selectedCustomer.lastOrderDate)}</p>
                      <p><span className="text-gray-500">Rating:</span> {selectedCustomer.rating} ⭐</p>
                    </div>
                  </div>
                </div>

                {/* Customer Segment */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Customer Segment</h3>
                  <div className="flex items-center space-x-2">
                    {getSegmentBadge(selectedCustomer.segment)}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <Mail className="w-4 h-4 mr-2 inline" />
                    Send Email
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <Phone className="w-4 h-4 mr-2 inline" />
                    Call Customer
                  </button>
                  <button className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700">
                    View Orders
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Phase 1 Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-blue-900">Phase 1 Foundation</h3>
              <p className="text-blue-700 mt-1">
                This is the foundational customer management interface. Advanced features like customer 
                segmentation tools, automated campaigns, and detailed analytics will be added in upcoming phases.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorCustomers; 