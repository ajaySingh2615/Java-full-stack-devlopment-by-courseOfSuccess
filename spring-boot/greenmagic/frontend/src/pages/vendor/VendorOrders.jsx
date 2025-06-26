import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Search, 
  Filter, 
  Eye, 
  MessageSquare, 
  Truck,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Download,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Vendor Orders Component - Phase 1 Foundation
 * 
 * Basic order management interface for vendors
 * Based on order-management-system.json specifications
 */
const VendorOrders = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Order statuses based on order-management-system.json
  const orderStatuses = {
    NEW: { label: 'New', color: 'blue', icon: Clock },
    ACCEPTED: { label: 'Accepted', color: 'green', icon: CheckCircle },
    PROCESSING: { label: 'Processing', color: 'yellow', icon: Package },
    READY_TO_SHIP: { label: 'Ready to Ship', color: 'purple', icon: Package },
    SHIPPED: { label: 'Shipped', color: 'indigo', icon: Truck },
    OUT_FOR_DELIVERY: { label: 'Out for Delivery', color: 'blue', icon: Truck },
    DELIVERED: { label: 'Delivered', color: 'green', icon: CheckCircle },
    CANCELLED: { label: 'Cancelled', color: 'red', icon: XCircle },
    RETURNED: { label: 'Returned', color: 'orange', icon: AlertTriangle }
  };

  // Mock data for Phase 1 - replace with API calls later
  const mockOrders = [
    {
      id: 'ORD-2025001',
      customerId: 'CUST-001',
      customerName: 'John Doe',
      customerEmail: 'john.doe@email.com',
      customerPhone: '+91 9876543210',
      status: 'NEW',
      orderDate: '2025-01-15T10:30:00Z',
      expectedDelivery: '2025-01-18T18:00:00Z',
      totalAmount: 2400,
      paymentStatus: 'PAID',
      items: [
        {
          productId: 1,
          productName: 'Organic Basmati Rice',
          sku: 'ORG-RICE-001',
          quantity: 2,
          price: 799,
          total: 1598
        },
        {
          productId: 2,
          productName: 'Pure Honey',
          sku: 'HONEY-001',
          quantity: 1,
          price: 450,
          total: 450
        }
      ],
      shippingAddress: {
        street: '123 Green Avenue',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
      }
    },
    {
      id: 'ORD-2025002',
      customerId: 'CUST-002',
      customerName: 'Sarah Smith',
      customerEmail: 'sarah.smith@email.com',
      customerPhone: '+91 9876543211',
      status: 'PROCESSING',
      orderDate: '2025-01-14T14:20:00Z',
      expectedDelivery: '2025-01-17T18:00:00Z',
      totalAmount: 1250,
      paymentStatus: 'PAID',
      items: [
        {
          productId: 3,
          productName: 'Organic Turmeric Powder',
          sku: 'TURMERIC-001',
          quantity: 5,
          price: 249,
          total: 1245
        }
      ],
      shippingAddress: {
        street: '456 Organic Street',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
        country: 'India'
      }
    },
    {
      id: 'ORD-2025003',
      customerId: 'CUST-003',
      customerName: 'Mike Johnson',
      customerEmail: 'mike.johnson@email.com',
      customerPhone: '+91 9876543212',
      status: 'DELIVERED',
      orderDate: '2025-01-10T09:15:00Z',
      expectedDelivery: '2025-01-13T18:00:00Z',
      totalAmount: 3200,
      paymentStatus: 'PAID',
      items: [
        {
          productId: 1,
          productName: 'Organic Basmati Rice',
          sku: 'ORG-RICE-001',
          quantity: 4,
          price: 799,
          total: 3196
        }
      ],
      shippingAddress: {
        street: '789 Health Colony',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        country: 'India'
      }
    }
  ];

  // Simulate API call
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setOrders(mockOrders);
        setError(null);
      } catch (err) {
        setError('Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Get status badge component
  const getStatusBadge = (status) => {
    const statusConfig = orderStatuses[status];
    if (!statusConfig) return null;

    const colorClasses = {
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      purple: 'bg-purple-100 text-purple-800',
      indigo: 'bg-indigo-100 text-indigo-800',
      red: 'bg-red-100 text-red-800',
      orange: 'bg-orange-100 text-orange-800'
    };

    const IconComponent = statusConfig.icon;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorClasses[statusConfig.color]}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {statusConfig.label}
      </span>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Open order details modal
  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  // Close order details modal
  const closeOrderDetails = () => {
    setSelectedOrder(null);
    setIsDetailModalOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading orders...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
              <p className="text-gray-600 mt-1">Manage and track your customer orders</p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Download className="w-4 h-4 mr-2" />
                Export Orders
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <p className="text-2xl font-semibold text-gray-900">{orders.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Orders</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {orders.filter(o => ['NEW', 'ACCEPTED', 'PROCESSING'].includes(o.status)).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Delivered</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {orders.filter(o => o.status === 'DELIVERED').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ₹{orders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()}
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
                  placeholder="Search orders by ID or customer name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="block w-40 px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Orders</option>
                {Object.entries(orderStatuses).map(([status, config]) => (
                  <option key={status} value={status}>{config.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500">
                {searchQuery || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Orders will appear here once customers start placing orders'
                }
              </p>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="col-span-2">Order ID</div>
                  <div className="col-span-2">Customer</div>
                  <div className="col-span-2">Order Date</div>
                  <div className="col-span-1">Amount</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Expected Delivery</div>
                  <div className="col-span-1">Actions</div>
                </div>
              </div>

              {/* Orders Table */}
              <div className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-2">
                        <div className="text-sm font-medium text-gray-900">{order.id}</div>
                      </div>
                      
                      <div className="col-span-2">
                        <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-sm text-gray-500">{order.customerEmail}</div>
                      </div>
                      
                      <div className="col-span-2">
                        <div className="text-sm text-gray-900">
                          {formatDate(order.orderDate)}
                        </div>
                      </div>
                      
                      <div className="col-span-1">
                        <div className="text-sm font-medium text-gray-900">
                          ₹{order.totalAmount.toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="col-span-2">
                        {getStatusBadge(order.status)}
                      </div>
                      
                      <div className="col-span-2">
                        <div className="text-sm text-gray-900">
                          {formatDate(order.expectedDelivery)}
                        </div>
                      </div>
                      
                      <div className="col-span-1">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => openOrderDetails(order)}
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

        {/* Order Details Modal */}
        {isDetailModalOpen && selectedOrder && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">Order Details - {selectedOrder.id}</h2>
                  <button 
                    onClick={closeOrderDetails}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Order Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Order Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-500">Order ID:</span> {selectedOrder.id}</p>
                      <p><span className="text-gray-500">Order Date:</span> {formatDate(selectedOrder.orderDate)}</p>
                      <p><span className="text-gray-500">Status:</span> {getStatusBadge(selectedOrder.status)}</p>
                      <p><span className="text-gray-500">Payment:</span> {selectedOrder.paymentStatus}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Customer Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-500">Name:</span> {selectedOrder.customerName}</p>
                      <p><span className="text-gray-500">Email:</span> {selectedOrder.customerEmail}</p>
                      <p><span className="text-gray-500">Phone:</span> {selectedOrder.customerPhone}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Shipping Address</h3>
                    <div className="text-sm text-gray-600">
                      <p>{selectedOrder.shippingAddress.street}</p>
                      <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</p>
                      <p>{selectedOrder.shippingAddress.pincode}</p>
                      <p>{selectedOrder.shippingAddress.country}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Order Items</h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                      <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase">
                        <div className="col-span-6">Product</div>
                        <div className="col-span-2">Price</div>
                        <div className="col-span-2">Quantity</div>
                        <div className="col-span-2">Total</div>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="px-4 py-3">
                          <div className="grid grid-cols-12 gap-4 items-center">
                            <div className="col-span-6">
                              <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                              <div className="text-sm text-gray-500">SKU: {item.sku}</div>
                            </div>
                            <div className="col-span-2 text-sm text-gray-900">₹{item.price}</div>
                            <div className="col-span-2 text-sm text-gray-900">{item.quantity}</div>
                            <div className="col-span-2 text-sm font-medium text-gray-900">₹{item.total}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900">Total Amount</span>
                        <span className="text-lg font-bold text-gray-900">₹{selectedOrder.totalAmount}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3">
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    Contact Customer
                  </button>
                  <button className="px-4 py-2 border border-green-300 rounded-md text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100">
                    Update Status
                  </button>
                  <button className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700">
                    Generate Invoice
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorOrders; 