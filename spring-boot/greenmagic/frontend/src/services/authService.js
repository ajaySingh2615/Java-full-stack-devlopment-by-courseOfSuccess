// Backend API base URL - update this based on your backend configuration
const API_BASE_URL = 'http://localhost:8080/api';

class AuthService {
  /**
   * Register a new customer user
   * @param {Object} userData - User registration data
   * @returns {Promise} API response
   */
  async registerCustomer(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      return {
        success: true,
        message: data.message || 'Registration successful',
        data: data.user
      };
    } catch (error) {
      console.error('Customer registration error:', error);
      throw error;
    }
  }

  /**
   * Register a new vendor (step 1)
   * @param {Object} userData - Vendor registration data
   * @returns {Promise} API response
   */
  async registerVendor(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/vendor-register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Vendor registration failed');
      }

      return {
        success: true,
        message: data.message || 'Vendor registration successful',
        data: data.user
      };
    } catch (error) {
      console.error('Vendor registration error:', error);
      throw error;
    }
  }

  /**
   * Register a new user (deprecated)
   * @param {Object} userData - User registration data
   * @returns {Promise} API response
   * @deprecated Use registerCustomer or registerVendor instead
   */
  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Login user
   * @param {Object} loginData - User login credentials
   * @returns {Promise} API response
   */
  async login(loginData) {
    try {
      console.log("Login request:", loginData);
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for session-based auth
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      console.log("Raw login response from server:", data);

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // For vendor users, extract vendor status and profile completion
      let vendorProfileComplete = false;
      let vendorStatus = null;
      
      // Extract vendor information
      if (data.user && data.user.roleName === 'VENDOR') {
        console.log("Extracted login data for vendor user:", data.user);
        
        // Check if profile data exists in response
        if (data.profileComplete !== undefined) {
          vendorProfileComplete = data.profileComplete;
          console.log("Vendor profile complete status from server:", vendorProfileComplete);
        }
        
        if (data.vendorStatus) {
          vendorStatus = data.vendorStatus;
          console.log("Vendor status from server:", vendorStatus);
        }
        
        // If vendor info is available in the user object directly
        if (data.user.vendorProfile) {
          console.log("Vendor profile found in user object:", data.user.vendorProfile);
          vendorStatus = data.user.vendorProfile.status || vendorStatus;
          vendorProfileComplete = true; // If we have a profile, it's complete
        }
      }

      // Check if the response contains the expected data structure
      if (!data.user && data.message === 'Login successful') {
        // If the backend returns a different structure than expected
        return {
          success: true,
          message: data.message || 'Login successful',
          data: data, // The entire response might contain the user object
          profileComplete: vendorProfileComplete,
          vendorStatus: vendorStatus
        };
      }

      return {
        success: true,
        message: data.message || 'Login successful',
        data: data.user || data,
        profileComplete: vendorProfileComplete,
        vendorStatus: vendorStatus
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Get user by email
   * @param {string} email - User email
   * @returns {Promise} API response
   */
  async getUserByEmail(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/email/${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get user');
      }

      return data;
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  }

  /**
   * Change user password
   * @param {number} userId - User ID
   * @param {Object} passwordData - Current and new password
   * @returns {Promise} API response
   */
  async changePassword(userId, passwordData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/users/${userId}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(passwordData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Password change failed');
      }

      return data;
    } catch (error) {
      console.error('Password change error:', error);
      throw error;
    }
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} Is valid email
   */
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {Object} Validation result
   */
  validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);

    const isValid = password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;

    return {
      isValid,
      errors: {
        minLength: password.length < minLength,
        hasUpperCase: !hasUpperCase,
        hasLowerCase: !hasLowerCase,
        hasNumbers: !hasNumbers,
        hasSpecialChar: !hasSpecialChar,
      }
    };
  }

  /**
   * Validate phone number format
   * @param {string} phoneNumber - Phone number to validate
   * @returns {boolean} Is valid phone number
   */
  validatePhoneNumber(phoneNumber) {
    const phoneRegex = /^[+]?[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber);
  }
}

// Export singleton instance
export default new AuthService(); 