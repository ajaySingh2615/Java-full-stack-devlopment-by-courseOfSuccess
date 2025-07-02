import axios from 'axios';

// Create axios instance for category operations
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('greenmagic_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('greenmagic_token');
      localStorage.removeItem('greenmagic_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Category Service
 * Handles all category-related API operations for admin dashboard
 */
const categoryService = {
  
  // ===========================
  // CATEGORY CRUD OPERATIONS
  // ===========================

  /**
   * Get all categories
   */
  async getAllCategories() {
    try {
      const response = await apiClient.get('/api/categories');
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch categories'
      };
    }
  },

  /**
   * Get category by ID
   */
  async getCategoryById(categoryId) {
    try {
      const response = await apiClient.get(`/api/categories/${categoryId}`);
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Error fetching category:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch category'
      };
    }
  },

  /**
   * Create new category
   */
  async createCategory(categoryData) {
    try {
      const response = await apiClient.post('/api/categories', categoryData);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Category created successfully'
      };
    } catch (error) {
      console.error('Error creating category:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to create category'
      };
    }
  },

  /**
   * Update existing category
   */
  async updateCategory(categoryId, categoryData) {
    try {
      const response = await apiClient.put(`/api/categories/${categoryId}`, categoryData);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Category updated successfully'
      };
    } catch (error) {
      console.error('Error updating category:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to update category'
      };
    }
  },

  /**
   * Delete category
   */
  async deleteCategory(categoryId) {
    try {
      const response = await apiClient.delete(`/api/categories/${categoryId}`);
      return {
        success: true,
        message: response.data.message || 'Category deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting category:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to delete category'
      };
    }
  },

  // ===========================
  // UTILITY METHODS
  // ===========================

  /**
   * Validate category name
   */
  validateCategoryName(name) {
    if (!name || name.trim().length === 0) {
      return 'Category name is required';
    }
    if (name.trim().length < 2) {
      return 'Category name must be at least 2 characters long';
    }
    if (name.trim().length > 100) {
      return 'Category name must not exceed 100 characters';
    }
    // Check for valid characters (letters, numbers, spaces, hyphens, ampersands)
    const validPattern = /^[a-zA-Z0-9\s\-&]+$/;
    if (!validPattern.test(name.trim())) {
      return 'Category name can only contain letters, numbers, spaces, hyphens, and ampersands';
    }
    return null;
  },

  /**
   * Format category for display
   */
  formatCategory(category) {
    return {
      ...category,
      displayName: category.name,
      createdDate: category.createdAt ? new Date(category.createdAt).toLocaleDateString() : 'N/A'
    };
  },

  /**
   * Sort categories by name
   */
  sortCategories(categories, ascending = true) {
    return [...categories].sort((a, b) => {
      const nameA = (a.name || '').toLowerCase();
      const nameB = (b.name || '').toLowerCase();
      return ascending ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
  }
};

export default categoryService; 