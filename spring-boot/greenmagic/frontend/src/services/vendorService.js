import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance with interceptors for session-based authentication
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies/session for authentication
});

// Request interceptor (no JWT token needed for session-based auth)
apiClient.interceptors.request.use(
  (config) => {
    // Session-based auth doesn't need Authorization header
    // Cookies are automatically included with withCredentials: true
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear user data and redirect to login
      localStorage.removeItem('greenmagic_user');
      localStorage.removeItem('greenmagic_vendor_status');
      localStorage.removeItem('greenmagic_vendor_profile_complete');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const vendorService = {
  // ===========================
  // VENDOR PROFILE MANAGEMENT
  // ===========================

  async getVendorProfileByUserId(userId) {
    const response = await apiClient.get(`/vendors/users/${userId}`);
    return response.data;
  },

  async createVendorProfile(profileData) {
    const response = await apiClient.post('/vendors', profileData);
    return response.data;
  },

  async updateVendorProfile(profileId, profileData) {
    const response = await apiClient.put(`/vendors/${profileId}`, profileData);
    return response.data;
  },

  // ===========================
  // VENDOR DASHBOARD
  // ===========================

  async getDashboardOverview(vendorId, days = 30) {
    const response = await apiClient.get(`/vendor/dashboard`, {
      params: { vendorId, days }
    });
    return response.data;
  },

  async getAnalytics(vendorId, startDate, endDate) {
    const response = await apiClient.get(`/vendor/analytics`, {
      params: { vendorId, startDate, endDate }
    });
    return response.data;
  },

  async getSalesTrend(vendorId, startDate, endDate) {
    const response = await apiClient.get(`/vendor/analytics/sales-trend`, {
      params: { vendorId, startDate, endDate }
    });
    return response.data;
  },

  // ===========================
  // PRODUCT MANAGEMENT
  // ===========================

  async getVendorProducts(vendorId, params = {}) {
    const {
      page = 0,
      size = 10,
      sortBy = 'createdAt',
      sortDir = 'desc',
      status,
      category,
      search
    } = params;

    const response = await apiClient.get(`/vendor/products`, {
      params: {
        vendorId,
        page,
        size,
        sortBy,
        sortDir,
        status,
        category,
        search
      }
    });
    return response.data;
  },

  async getProductStats(vendorId) {
    const response = await apiClient.get(`/vendor/products/stats`, {
      params: { vendorId }
    });
    return response.data;
  },

  async getProductById(vendorId, productId) {
    const response = await apiClient.get(`/vendor/products/${productId}`, {
      params: { vendorId }
    });
    return response.data;
  },

  async createProduct(vendorId, productData) {
    const response = await apiClient.post(`/vendor/products`, productData, {
      params: { vendorId }
    });
    return response.data;
  },

  async updateProduct(vendorId, productId, productData) {
    const response = await apiClient.put(`/vendor/products/${productId}`, productData, {
      params: { vendorId }
    });
    return response.data;
  },

  async deleteProduct(vendorId, productId) {
    const response = await apiClient.delete(`/vendor/products/${productId}`, {
      params: { vendorId }
    });
    return response.data;
  },

  async duplicateProduct(vendorId, productId, customizations = {}) {
    const response = await apiClient.post(`/vendor/products/${productId}/duplicate`, customizations, {
      params: { vendorId }
    });
    return response.data;
  },

  // ===========================
  // BULK OPERATIONS
  // ===========================

  async bulkUpdateProductStatus(vendorId, productIds, status) {
    const response = await apiClient.post(`/vendor/products/bulk-status`, {
      productIds,
      status
    }, {
      params: { vendorId }
    });
    return response.data;
  },

  async bulkUpdateProductPrices(vendorId, productIds, updateType, value) {
    const response = await apiClient.post(`/vendor/products/bulk-price`, {
      productIds,
      updateType,
      value
    }, {
      params: { vendorId }
    });
    return response.data;
  },

  async bulkUpdateProductStock(vendorId, productIds, updateType, value) {
    const response = await apiClient.post(`/vendor/products/bulk-stock`, {
      productIds,
      updateType,
      value
    }, {
      params: { vendorId }
    });
    return response.data;
  },

  // ===========================
  // PRODUCT UTILITIES
  // ===========================

  async exportProducts(vendorId, format = 'csv', filters = {}) {
    const { status, category, productIds } = filters;
    const response = await apiClient.get(`/vendor/products/export`, {
      params: {
        vendorId,
        format,
        status,
        category,
        productIds: productIds?.join(',')
      },
      responseType: 'blob'
    });
    return response.data;
  },

  async getProductCategories() {
    const response = await apiClient.get(`/vendor/products/categories`);
    return response.data;
  },

  async generateSku(vendorId, category, subcategory) {
    const response = await apiClient.post(`/vendor/products/generate-sku`, {
      vendorId,
      category,
      subcategory
    });
    return response.data;
  },

  // ===========================
  // ADMIN METHODS
  // ===========================

  async safeGetVendorCounts() {
    try {
      const response = await apiClient.get('/vendors/stats/counts');
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Failed to fetch vendor counts:', error);
      // Return fallback data if API fails
      return {
        success: true,
        data: {
          total: 0,
          pending: 0,
          approved: 0,
          rejected: 0
        }
      };
    }
  },

  async safeGetAllVendors(page = 0, size = 50) {
    try {
      const response = await apiClient.get('/vendors', {
        params: { page, size }
      });
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
      // Return fallback data if API fails
      return {
        success: true,
        data: {
          content: [],
          totalElements: 0,
          totalPages: 0
        }
      };
    }
  },

  async updateVendorStatus(vendorId, status) {
    try {
      const response = await apiClient.put(`/vendors/${vendorId}/status/${status}`);
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Failed to update vendor status:', error);
      throw error;
    }
  },

  // ===========================
  // UTILITY METHODS
  // ===========================

  getCurrentVendorId() {
    const user = JSON.parse(localStorage.getItem('greenmagic_user') || '{}');
    return user.userId;
  },

  isVendor() {
    const user = JSON.parse(localStorage.getItem('greenmagic_user') || '{}');
    return user.roleName === 'VENDOR';
  },

  formatCurrency(amount) {
    if (amount == null || isNaN(amount)) return '₹0.00';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  },

  formatNumber(number) {
    if (number == null || isNaN(number)) return '0';
    return new Intl.NumberFormat('en-IN').format(number);
  },

  getStatusBadgeClass(status) {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'inactive':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  },

  downloadFile(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export default vendorService; 