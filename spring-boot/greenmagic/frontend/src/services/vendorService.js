// Backend API base URL - update this based on your backend configuration
const API_BASE_URL = 'http://localhost:8080/api';

class VendorService {
  /**
   * Register a new vendor (step 1)
   * @param {Object} vendorData - Vendor registration data
   * @returns {Promise} API response
   */
  async registerVendor(vendorData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/vendor-register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(vendorData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to register vendor');
      }

      return {
        success: true,
        message: data.message || 'Vendor registered successfully',
        data: data.user
      };
    } catch (error) {
      console.error('Vendor registration error:', error);
      throw error;
    }
  }
  
  /**
   * Complete vendor profile (step 2)
   * @param {number} userId - User ID
   * @param {Object} profileData - Vendor profile completion data
   * @returns {Promise} API response
   */
  async completeVendorProfile(userId, profileData) {
    try {
      const response = await fetch(`${API_BASE_URL}/vendors/users/${userId}/complete-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to complete vendor profile');
      }

      return {
        success: true,
        message: data.message || 'Profile completed successfully',
        data: data
      };
    } catch (error) {
      console.error('Vendor profile completion error:', error);
      throw error;
    }
  }
  
  /**
   * Upload document for vendor profile
   * @param {number} userId - User ID
   * @param {string} documentType - Type of document (logo, gstCertificate, etc)
   * @param {File} file - Document file
   * @param {Function} progressCallback - Progress callback function
   * @returns {Promise} API response with file URL
   */
  async uploadDocument(userId, documentType, file, progressCallback) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        // Progress tracking
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable && progressCallback) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            progressCallback(percentComplete);
          }
        });
        
        xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve({
                success: true,
                data: response
              });
            } catch (error) {
              reject(new Error('Invalid response format'));
            }
          } else {
            try {
              const errorData = JSON.parse(xhr.responseText);
              reject(new Error(errorData.message || 'Upload failed'));
            } catch (error) {
              reject(new Error('Upload failed'));
            }
          }
        };
        
        xhr.onerror = function() {
          reject(new Error('Network error during upload'));
        };
        
        xhr.open('POST', `${API_BASE_URL}/vendors/users/${userId}/documents/${documentType}`);
        xhr.withCredentials = true;
        xhr.send(formData);
      });
    } catch (error) {
      console.error('Document upload error:', error);
      throw error;
    }
  }

  /**
   * Create vendor profile for a user
   * @param {number} userId - User ID
   * @param {Object} vendorData - Vendor profile data
   * @returns {Promise} API response
   */
  async createVendorProfile(userId, vendorData) {
    try {
      console.log("Creating vendor profile with data:", vendorData);
      console.log("Business type:", vendorData.businessType);
      
      const response = await fetch(`${API_BASE_URL}/vendors/users/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(vendorData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create vendor profile');
      }

      return {
        success: true,
        message: data.message || 'Vendor profile created successfully',
        data: data
      };
    } catch (error) {
      console.error('Vendor profile creation error:', error);
      throw error;
    }
  }

  /**
   * Get vendor profile by user ID
   * @param {number} userId - User ID
   * @returns {Promise} API response
   */
  async getVendorProfileByUserId(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
      
      const response = await fetch(`${API_BASE_URL}/vendors/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get vendor profile');
      }

      return {
        success: true,
        message: data.message || 'Vendor profile retrieved successfully',
        data: data
      };
    } catch (error) {
      console.error('Get vendor profile error:', error);
      throw error;
    }
  }

  /**
   * Check if vendor profile exists for a user
   * @param {number} userId - User ID
   * @returns {Promise} API response
   */
  async checkVendorProfileExists(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
      
      console.log(`Checking if vendor profile exists for user ID: ${userId}`);
      
      const response = await fetch(`${API_BASE_URL}/vendors/users/${userId}/exists`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',  // Include credentials for authenticated requests
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to check vendor profile');
      }

      return {
        success: true,
        exists: data.exists || false
      };
    } catch (error) {
      console.error('Check vendor profile error:', error);
      throw error;
    }
  }

  /**
   * Update vendor profile
   * @param {number} vendorId - Vendor profile ID
   * @param {Object} vendorData - Updated vendor profile data
   * @returns {Promise} API response
   */
  async updateVendorProfile(vendorId, vendorData) {
    try {
      if (!vendorId) {
        throw new Error('Vendor ID is required');
      }
      
      const response = await fetch(`${API_BASE_URL}/vendors/${vendorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(vendorData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update vendor profile');
      }

      return {
        success: true,
        message: data.message || 'Vendor profile updated successfully',
        data: data
      };
    } catch (error) {
      console.error('Update vendor profile error:', error);
      throw error;
    }
  }

  /**
   * Get all vendor profiles (paginated)
   * @param {number} page - Page number (0-based)
   * @param {number} size - Page size
   * @param {string} sortBy - Sort field
   * @param {string} sortDir - Sort direction ('asc' or 'desc')
   * @returns {Promise} API response
   */
  async getAllVendors(page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc') {
    try {
      const response = await fetch(
        `${API_BASE_URL}/vendors?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`, 
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch vendors');
      }

      return {
        success: true,
        message: data.message || 'Vendors retrieved successfully',
        data: data.data
      };
    } catch (error) {
      console.error('Get all vendors error:', error);
      throw error;
    }
  }

  /**
   * Get vendor counts by status
   * @returns {Promise} API response with counts
   */
  async getVendorCounts() {
    try {
      const response = await fetch(`${API_BASE_URL}/vendors/stats/counts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch vendor counts');
      }

      return {
        success: true,
        message: data.message || 'Vendor counts retrieved successfully',
        data: data.data
      };
    } catch (error) {
      console.error('Get vendor counts error:', error);
      throw error;
    }
  }

  /**
   * Get vendors by status (paginated)
   * @param {string} status - Vendor status ('PENDING', 'APPROVED', 'REJECTED')
   * @param {number} page - Page number (0-based)
   * @param {number} size - Page size
   * @returns {Promise} API response
   */
  async getVendorsByStatus(status, page = 0, size = 10) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/vendors/status/${status}?page=${page}&size=${size}`, 
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to fetch ${status} vendors`);
      }

      return {
        success: true,
        message: data.message || 'Vendors retrieved successfully',
        data: data.data
      };
    } catch (error) {
      console.error(`Get ${status} vendors error:`, error);
      throw error;
    }
  }

  /**
   * Get pending vendor applications
   * @returns {Promise} API response with list of pending vendor profiles
   */
  async getPendingVendors() {
    try {
      const response = await fetch(`${API_BASE_URL}/vendors/pending`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch pending vendors');
      }

      return {
        success: true,
        message: data.message || 'Pending vendors retrieved successfully',
        data: data.data
      };
    } catch (error) {
      console.error('Get pending vendors error:', error);
      throw error;
    }
  }

  /**
   * Update vendor profile status
   * @param {number} vendorId - Vendor profile ID
   * @param {string} status - New status ('APPROVED', 'REJECTED', 'PENDING')
   * @returns {Promise} API response with updated vendor profile
   */
  async updateVendorStatus(vendorId, status) {
    try {
      if (!vendorId) {
        throw new Error('Vendor ID is required');
      }
      
      const response = await fetch(`${API_BASE_URL}/vendors/${vendorId}/status/${status}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to update vendor status to ${status}`);
      }

      return {
        success: true,
        message: data.message || `Vendor status updated to ${status} successfully`,
        data: data.data
      };
    } catch (error) {
      console.error(`Update vendor status to ${status} error:`, error);
      throw error;
    }
  }

  /**
   * Validate GST number format
   * @param {string} gstNumber - GST number to validate
   * @returns {boolean} Is valid GST number
   */
  validateGstNumber(gstNumber) {
    // GST number format: 2 digits state code + 10 digits PAN + 1 entity number + 1 check digit + Z
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gstNumber);
  }

  /**
   * Safely fetch vendor counts with error handling
   * @returns {Promise} API response with counts or dummy data on error
   */
  async safeGetVendorCounts() {
    try {
      const response = await fetch(`${API_BASE_URL}/vendors/stats/counts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      console.log('Vendor counts response status:', response.status);
      
      if (!response.ok) {
        // If we get a 403, return dummy data for development
        if (response.status === 403) {
          console.warn('Using dummy vendor counts due to 403 error');
          return {
            success: true,
            message: 'Using dummy vendor counts (auth failed)',
            data: {
              PENDING: 2,
              APPROVED: 1,
              REJECTED: 1,
              TOTAL: 4
            }
          };
        }
        
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed with status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        message: data.message || 'Vendor counts retrieved successfully',
        data: data.data
      };
    } catch (error) {
      console.error('Safe get vendor counts error:', error);
      // Return dummy data for development
      return {
        success: true,
        message: 'Using fallback vendor counts',
        data: {
          PENDING: 2,
          APPROVED: 1, 
          REJECTED: 1,
          TOTAL: 4
        }
      };
    }
  }
  
  /**
   * Safely fetch vendors list with error handling
   * @returns {Promise} API response with vendors or dummy data on error
   */
  async safeGetAllVendors(page = 0, size = 10) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/vendors?page=${page}&size=${size}`, 
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );
      
      console.log('All vendors response status:', response.status);
      
      if (!response.ok) {
        // If we get a 403, return dummy data for development
        if (response.status === 403) {
          console.warn('Using dummy vendors due to 403 error');
          return {
            success: true,
            message: 'Using dummy vendors (auth failed)',
            data: {
              content: [
                { 
                  id: 1, 
                  businessName: 'Green Farms', 
                  ownerName: 'John Smith',
                  email: 'john@greenfarms.com',
                  phoneNumber: '9876543210',
                  gstNumber: 'GST1234567890',
                  status: 'APPROVED',
                  createdAt: '2025-05-10T10:30:00',
                  productsCount: 24,
                  ordersCount: 156,
                  revenue: 45600
                },
                { 
                  id: 2, 
                  businessName: 'Organic Valley', 
                  ownerName: 'Sarah Johnson',
                  email: 'sarah@organicvalley.com',
                  phoneNumber: '9876543211',
                  gstNumber: 'GST1234567891',
                  status: 'PENDING',
                  createdAt: '2025-06-05T14:20:00',
                  productsCount: 0,
                  ordersCount: 0,
                  revenue: 0
                },
                { 
                  id: 3, 
                  businessName: 'Nature\'s Basket', 
                  ownerName: 'Mike Williams',
                  email: 'mike@naturesbasket.com',
                  phoneNumber: '9876543212',
                  gstNumber: 'GST1234567892',
                  status: 'REJECTED',
                  rejectionReason: 'Invalid GST certificate',
                  createdAt: '2025-06-02T09:15:00',
                  productsCount: 0,
                  ordersCount: 0,
                  revenue: 0
                },
                { 
                  id: 4, 
                  businessName: 'Fresh Harvest', 
                  ownerName: 'Emily Brown',
                  email: 'emily@freshharvest.com',
                  phoneNumber: '9876543213',
                  gstNumber: 'GST1234567893',
                  status: 'PENDING',
                  createdAt: '2025-06-10T16:45:00',
                  productsCount: 0,
                  ordersCount: 0,
                  revenue: 0
                }
              ],
              totalElements: 4,
              totalPages: 1,
              size: 10,
              number: 0
            }
          };
        }
        
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed with status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        message: data.message || 'Vendors retrieved successfully',
        data: data.data
      };
    } catch (error) {
      console.error('Safe get all vendors error:', error);
      // Return dummy data for development
      return {
        success: true,
        message: 'Using fallback vendors',
        data: {
          content: [
            { 
              id: 1, 
              businessName: 'Green Farms', 
              ownerName: 'John Smith',
              email: 'john@greenfarms.com',
              phoneNumber: '9876543210',
              gstNumber: 'GST1234567890',
              status: 'APPROVED',
              createdAt: '2025-05-10T10:30:00',
              productsCount: 24,
              ordersCount: 156,
              revenue: 45600
            },
            { 
              id: 2, 
              businessName: 'Organic Valley', 
              ownerName: 'Sarah Johnson',
              email: 'sarah@organicvalley.com',
              phoneNumber: '9876543211',
              gstNumber: 'GST1234567891',
              status: 'PENDING',
              createdAt: '2025-06-05T14:20:00',
              productsCount: 0,
              ordersCount: 0,
              revenue: 0
            },
            { 
              id: 3, 
              businessName: 'Nature\'s Basket', 
              ownerName: 'Mike Williams',
              email: 'mike@naturesbasket.com',
              phoneNumber: '9876543212',
              gstNumber: 'GST1234567892',
              status: 'REJECTED',
              rejectionReason: 'Invalid GST certificate',
              createdAt: '2025-06-02T09:15:00',
              productsCount: 0,
              ordersCount: 0,
              revenue: 0
            },
            { 
              id: 4, 
              businessName: 'Fresh Harvest', 
              ownerName: 'Emily Brown',
              email: 'emily@freshharvest.com',
              phoneNumber: '9876543213',
              gstNumber: 'GST1234567893',
              status: 'PENDING',
              createdAt: '2025-06-10T16:45:00',
              productsCount: 0,
              ordersCount: 0,
              revenue: 0
            }
          ],
          totalElements: 4,
          totalPages: 1,
          size: 10,
          number: 0
        }
      };
    }
  }
}

// Export singleton instance
export default new VendorService(); 