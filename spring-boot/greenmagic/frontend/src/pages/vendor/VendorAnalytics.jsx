import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  TrendingUp, 
  DollarSign, 
  Package, 
  Users, 
  Eye,
  Download,
  Calendar,
  Filter,
  RefreshCw,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Vendor Analytics Component - Phase 1 Foundation
 * 
 * Basic analytics dashboard for vendors
 * Based on analytics-dashboard.json specifications
 */
const VendorAnalytics = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('30days');
  const [analyticsData, setAnalyticsData] = useState({
    revenue: {
      current: 24500,
      previous: 18200,
      change: 34.6
    },
    orders: {
      current: 142,
      previous: 95,
      change: 49.5
    },
    customers: {
      current: 78,
      previous: 52,
      change: 50.0
    },
    avgOrderValue: {
      current: 1725,
      previous: 1916,
      change: -10.0
    }
  });

  const [topProducts, setTopProducts] = useState([
    { id: 1, name: 'Organic Basmati Rice', sales: 45, revenue: 35955, growth: 23.5 },
    { id: 2, name: 'Pure Honey', sales: 32, revenue: 14400, growth: -5.2 },
    { id: 3, name: 'Organic Turmeric Powder', sales: 28, revenue: 6972, growth: 15.8 },
    { id: 4, name: 'Whole Wheat Flour', sales: 25, revenue: 4975, growth: 8.3 },
    { id: 5, name: 'Organic Ghee', sales: 18, revenue: 10782, growth: 12.1 }
  ]);

  const [salesTrend, setSalesTrend] = useState([
    { period: 'Week 1', revenue: 5200, orders: 28 },
    { period: 'Week 2', revenue: 6800, orders: 35 },
    { period: 'Week 3', revenue: 4900, orders: 24 },
    { period: 'Week 4', revenue: 7600, orders: 42 }
  ]);

  // Simulate API call
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setError(null);
      } catch (err) {
        setError('Failed to load analytics data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [dateRange]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get change indicator
  const getChangeIndicator = (change) => {
    if (change > 0) {
      return (
        <span className="inline-flex items-center text-sm font-medium text-green-600">
          <ArrowUp className="w-4 h-4 mr-1" />
          {change.toFixed(1)}%
        </span>
      );
    } else if (change < 0) {
      return (
        <span className="inline-flex items-center text-sm font-medium text-red-600">
          <ArrowDown className="w-4 h-4 mr-1" />
          {Math.abs(change).toFixed(1)}%
        </span>
      );
    } else {
      return (
        <span className="text-sm font-medium text-gray-500">
          No change
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading analytics...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Sales Analytics</h1>
              <p className="text-gray-600 mt-1">Track your sales performance and business metrics</p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="block w-32 px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
              >
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="90days">Last 90 days</option>
                <option value="1year">Last year</option>
              </select>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Revenue */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {formatCurrency(analyticsData.revenue.current)}
                    </div>
                    <div className="ml-2">
                      {getChangeIndicator(analyticsData.revenue.change)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          {/* Orders */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {analyticsData.orders.current}
                    </div>
                    <div className="ml-2">
                      {getChangeIndicator(analyticsData.orders.change)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          {/* Customers */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Customers</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {analyticsData.customers.current}
                    </div>
                    <div className="ml-2">
                      {getChangeIndicator(analyticsData.customers.change)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          {/* Average Order Value */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg. Order Value</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {formatCurrency(analyticsData.avgOrderValue.current)}
                    </div>
                    <div className="ml-2">
                      {getChangeIndicator(analyticsData.avgOrderValue.change)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales Trend Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Sales Trend</h3>
              <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                View Details
              </button>
            </div>
            
            <div className="space-y-4">
              {salesTrend.map((data, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{data.period}</div>
                    <div className="text-sm text-gray-500">{data.orders} orders</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(data.revenue)}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">📊 Interactive charts coming soon in Phase 2</p>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Top Performing Products</h3>
              <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-medium text-green-600">#{index + 1}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.sales} sales</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(product.revenue)}</div>
                    <div className={`text-sm ${product.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.growth >= 0 ? '+' : ''}{product.growth.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Performance Insights</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-2">92%</div>
              <div className="text-sm text-green-800">Order Fulfillment Rate</div>
              <div className="text-xs text-green-600 mt-1">+3% from last month</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-2">4.8</div>
              <div className="text-sm text-blue-800">Average Rating</div>
              <div className="text-xs text-blue-600 mt-1">Based on 156 reviews</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-2">2.3 days</div>
              <div className="text-sm text-purple-800">Avg. Processing Time</div>
              <div className="text-xs text-purple-600 mt-1">-0.5 days from last month</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Quick Actions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <BarChart className="w-4 h-4 mr-2" />
              Product Performance
            </button>
            
            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Users className="w-4 h-4 mr-2" />
              Customer Analysis
            </button>
            
            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <TrendingUp className="w-4 h-4 mr-2" />
              Sales Forecast
            </button>
            
            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </button>
          </div>
        </div>

        {/* Phase 1 Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-blue-900">Phase 1 Foundation</h3>
              <p className="text-blue-700 mt-1">
                This is the foundational analytics dashboard. Advanced features like interactive charts, 
                detailed reports, and predictive analytics will be added in upcoming phases.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorAnalytics; 