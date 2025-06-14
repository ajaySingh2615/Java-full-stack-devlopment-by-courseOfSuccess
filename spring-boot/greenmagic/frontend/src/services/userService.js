// Backend API base URL - update this based on your backend configuration
const API_BASE_URL = 'http://localhost:8080/api';

class UserService {
  /**
   * Get all users with pagination
   * @param {number} page - Page number (0-based)
   * @param {number} size - Page size
   * @returns {Promise} API response
   */
  async getAllUsers(page = 0, size = 10) {
    try {
      const response = await fetch(`${API_BASE_URL}/users?page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch users');
      }

      return data;
    } catch (error) {
      console.error('Get all users error:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   * @param {number} userId - User ID
   * @returns {Promise} API response
   */
  async getUserById(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user');
      }

      return data;
    } catch (error) {
      console.error('Get user by ID error:', error);
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
      const response = await fetch(`${API_BASE_URL}/users/email/${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user');
      }

      return data;
    } catch (error) {
      console.error('Get user by email error:', error);
      throw error;
    }
  }

  /**
   * Get active users
   * @returns {Promise} API response
   */
  async getActiveUsers() {
    try {
      const response = await fetch(`${API_BASE_URL}/users/active`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch active users');
      }

      return data;
    } catch (error) {
      console.error('Get active users error:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   * @param {number} userId - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise} API response
   */
  async updateUser(userId, userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update user');
      }

      return data;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  }

  /**
   * Delete user (Admin only)
   * @param {number} userId - User ID
   * @returns {Promise} API response
   */
  async deleteUser(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete user');
      }

      return { success: true, message: 'User deleted successfully' };
    } catch (error) {
      console.error('Delete user error:', error);
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
        body: JSON.stringify(passwordData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password');
      }

      return data;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  /**
   * Admin reset password
   * @param {number} userId - User ID
   * @param {Object} passwordData - New password
   * @returns {Promise} API response
   */
  async adminResetPassword(userId, passwordData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin/users/${userId}/reset-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      return data;
    } catch (error) {
      console.error('Admin reset password error:', error);
      throw error;
    }
  }

  /**
   * Search users by name or email
   * @param {string} query - Search query
   * @param {number} page - Page number
   * @param {number} size - Page size
   * @returns {Promise} Filtered users
   */
  async searchUsers(query, page = 0, size = 10) {
    try {
      // For now, we'll get all users and filter client-side
      // In a real application, you'd want server-side search
      const response = await this.getAllUsers(page, size);
      
      if (response.success && response.data) {
        const filteredUsers = response.data.content.filter(user => 
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase())
        );
        
        return {
          ...response,
          data: {
            ...response.data,
            content: filteredUsers,
            totalElements: filteredUsers.length
          }
        };
      }
      
      return response;
    } catch (error) {
      console.error('Search users error:', error);
      throw error;
    }
  }

  /**
   * Get user statistics
   * @returns {Promise} User statistics
   */
  async getUserStats() {
    try {
      const [allUsersResponse, activeUsersResponse] = await Promise.all([
        this.getAllUsers(0, 1), // Just get first page to get total count
        this.getActiveUsers()
      ]);

      const totalUsers = allUsersResponse.data?.totalElements || 0;
      const activeUsers = activeUsersResponse.data?.length || 0;

      return {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers
      };
    } catch (error) {
      console.error('Get user stats error:', error);
      return {
        totalUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0
      };
    }
  }
}

// Export singleton instance
export default new UserService(); 