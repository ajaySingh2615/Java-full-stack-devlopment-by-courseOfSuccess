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
   * Validate GST number format
   * @param {string} gstNumber - GST number to validate
   * @returns {boolean} Is valid GST number
   */
  validateGstNumber(gstNumber) {
    // GST number format: 2 digits state code + 10 digits PAN + 1 entity number + 1 check digit + Z
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gstNumber);
  }
}

// Export singleton instance
export default new VendorService(); 