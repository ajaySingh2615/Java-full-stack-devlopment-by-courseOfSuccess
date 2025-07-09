import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/vendor';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

/**
 * Variant Service - handles all variant-related API calls
 */
export const variantService = {
  /**
   * Get all variants for a product
   */
  async getProductVariants(vendorId, productId) {
    try {
      const response = await api.get(`/products/${productId}/variants`, {
        params: { vendorId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching product variants:', error);
      throw error;
    }
  },

  /**
   * Create a new variant
   */
  async createVariant(vendorId, productId, variantData) {
    try {
      const response = await api.post(`/products/${productId}/variants`, variantData, {
        params: { vendorId }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating variant:', error);
      throw error;
    }
  },

  /**
   * Update an existing variant
   */
  async updateVariant(vendorId, productId, variantId, variantData) {
    try {
      const response = await api.put(`/products/${productId}/variants/${variantId}`, variantData, {
        params: { vendorId }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating variant:', error);
      throw error;
    }
  },

  /**
   * Delete a variant
   */
  async deleteVariant(vendorId, productId, variantId) {
    try {
      const response = await api.delete(`/products/${productId}/variants/${variantId}`, {
        params: { vendorId }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting variant:', error);
      throw error;
    }
  },

  /**
   * Bulk update variant prices
   */
  async bulkUpdateVariantPrices(vendorId, productId, variantIds, updateType, value) {
    try {
      const response = await api.post(`/products/${productId}/variants/bulk-price`, {
        variantIds,
        updateType,
        value
      }, {
        params: { vendorId }
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk updating variant prices:', error);
      throw error;
    }
  },

  /**
   * Bulk update variant stock
   */
  async bulkUpdateVariantStock(vendorId, productId, variantIds, updateType, value) {
    try {
      const response = await api.post(`/products/${productId}/variants/bulk-stock`, {
        variantIds,
        updateType,
        value
      }, {
        params: { vendorId }
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk updating variant stock:', error);
      throw error;
    }
  },

  /**
   * Bulk update variant status
   */
  async bulkUpdateVariantStatus(vendorId, productId, variantIds, status) {
    try {
      const response = await api.post(`/products/${productId}/variants/bulk-status`, {
        variantIds,
        status
      }, {
        params: { vendorId }
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk updating variant status:', error);
      throw error;
    }
  },

  /**
   * Combined bulk update for variants (price, stock, status)
   */
  async bulkUpdateVariants(vendorId, productId, variantIds, updateData) {
    try {
      const response = await api.post(`/products/${productId}/variants/bulk-update`, {
        variantIds,
        updateData
      }, {
        params: { vendorId }
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk updating variants:', error);
      throw error;
    }
  },

  /**
   * Create multiple variants from attribute combinations
   */
  async createVariantsFromAttributes(vendorId, productId, variants) {
    try {
      const promises = variants.map(variant => 
        this.createVariant(vendorId, productId, variant)
      );
      const results = await Promise.allSettled(promises);
      
      const successful = results.filter(r => r.status === 'fulfilled').map(r => r.value);
      const failed = results.filter(r => r.status === 'rejected').map(r => r.reason);
      
      return {
        successful,
        failed,
        total: variants.length
      };
    } catch (error) {
      console.error('Error creating variants from attributes:', error);
      throw error;
    }
  },

  /**
   * Transform frontend variant data to backend format
   */
  transformVariantForBackend(frontendVariant, productId) {
    return {
      product: { productId: parseInt(productId) },
      variantName: frontendVariant.name || frontendVariant.variantName,
      variantSku: frontendVariant.sku || frontendVariant.variantSku,
      
      // Attributes
      size: this.getAttributeValue(frontendVariant.attributes, 'Size') || frontendVariant.size,
      color: this.getAttributeValue(frontendVariant.attributes, 'Color') || frontendVariant.color,
      weight: this.getAttributeValue(frontendVariant.attributes, 'Weight') || frontendVariant.weight,
      flavor: this.getAttributeValue(frontendVariant.attributes, 'Flavor') || frontendVariant.flavor,
      packSize: this.getAttributeValue(frontendVariant.attributes, 'Pack Size') || frontendVariant.packSize,
      
      // Pricing
      price: parseFloat(frontendVariant.price),
      regularPrice: parseFloat(frontendVariant.mrp || frontendVariant.regularPrice),
      costPrice: parseFloat(frontendVariant.costPrice || frontendVariant.price * 0.7), // Default cost price
      
      // Inventory
      stockQuantity: parseInt(frontendVariant.stock || frontendVariant.stockQuantity),
      minStockAlert: parseInt(frontendVariant.minStockAlert || 5),
      trackInventory: frontendVariant.trackInventory !== false,
      allowBackorders: frontendVariant.allowBackorders || false,
      
      // Media
      imageUrl: frontendVariant.image || frontendVariant.imageUrl,
      
      // Physical Properties
      weightGrams: this.convertWeightToGrams(frontendVariant.weight),
      dimensions: frontendVariant.dimensions,
      
      // Status
      status: frontendVariant.status || 'ACTIVE',
      isDefault: frontendVariant.isDefault || false,
      sortOrder: frontendVariant.sortOrder || 0
    };
  },

  /**
   * Transform backend variant data to frontend format
   */
  transformVariantForFrontend(backendVariant) {
    return {
      id: backendVariant.variantId,
      name: backendVariant.variantName || backendVariant.getDisplayName?.() || this.generateDisplayName(backendVariant),
      sku: backendVariant.variantSku,
      
      // Attributes (for frontend display)
      attributes: this.buildAttributesFromVariant(backendVariant),
      
      // Pricing
      price: parseFloat(backendVariant.price),
      mrp: parseFloat(backendVariant.regularPrice || backendVariant.price),
      costPrice: parseFloat(backendVariant.costPrice || 0),
      
      // Inventory
      stock: parseInt(backendVariant.stockQuantity),
      minStockAlert: parseInt(backendVariant.minStockAlert || 5),
      trackInventory: backendVariant.trackInventory,
      allowBackorders: backendVariant.allowBackorders,
      
      // Media
      image: backendVariant.imageUrl,
      
      // Physical Properties
      weight: backendVariant.weight,
      dimensions: backendVariant.dimensions,
      
      // Status
      status: backendVariant.status,
      enabled: backendVariant.status === 'ACTIVE',
      isDefault: backendVariant.isDefault,
      sortOrder: backendVariant.sortOrder || 0,
      
      // Timestamps
      createdAt: backendVariant.createdAt,
      updatedAt: backendVariant.updatedAt
    };
  },

  /**
   * Helper method to get attribute value by name
   */
  getAttributeValue(attributes, attributeName) {
    if (!attributes || !Array.isArray(attributes)) return null;
    const attribute = attributes.find(attr => attr.attribute === attributeName);
    return attribute ? attribute.value : null;
  },

  /**
   * Helper method to build attributes array from variant
   */
  buildAttributesFromVariant(variant) {
    const attributes = [];
    
    if (variant.size) attributes.push({ attribute: 'Size', value: variant.size });
    if (variant.color) attributes.push({ attribute: 'Color', value: variant.color });
    if (variant.weight) attributes.push({ attribute: 'Weight', value: variant.weight });
    if (variant.flavor) attributes.push({ attribute: 'Flavor', value: variant.flavor });
    if (variant.packSize) attributes.push({ attribute: 'Pack Size', value: variant.packSize });
    
    return attributes;
  },

  /**
   * Helper method to generate display name from variant
   */
  generateDisplayName(variant) {
    const parts = [];
    if (variant.size) parts.push(variant.size);
    if (variant.color) parts.push(variant.color);
    if (variant.weight) parts.push(variant.weight);
    if (variant.flavor) parts.push(variant.flavor);
    if (variant.packSize) parts.push(variant.packSize);
    
    return parts.join(' / ') || 'Default Variant';
  },

  /**
   * Helper method to convert weight string to grams
   */
  convertWeightToGrams(weightStr) {
    if (!weightStr || typeof weightStr !== 'string') return null;
    
    const weight = parseFloat(weightStr.replace(/[^\d.]/g, ''));
    if (isNaN(weight)) return null;
    
    if (weightStr.toLowerCase().includes('kg')) {
      return weight * 1000;
    } else if (weightStr.toLowerCase().includes('g')) {
      return weight;
    }
    
    return weight; // Assume grams if no unit specified
  },

  /**
   * Generate variants from attribute combinations
   */
  generateVariantCombinations(attributes, baseProduct) {
    if (!attributes || attributes.length === 0) return [];

    const combinations = [];
    const generateCombos = (current, index) => {
      if (index === attributes.length) {
        combinations.push([...current]);
        return;
      }

      const attribute = attributes[index];
      const validValues = attribute.values.filter(v => v && v.trim());
      
      for (const value of validValues) {
        current.push({ attribute: attribute.name, value: value.trim() });
        generateCombos(current, index + 1);
        current.pop();
      }
    };

    generateCombos([], 0);

    return combinations.map((combo, index) => {
      const variantName = combo.map(c => c.value).join(' / ');
      const priceMultiplier = this.calculatePriceMultiplier(combo);
      
      return {
        name: variantName,
        attributes: combo,
        sku: `${baseProduct.id}_${index + 1}`,
        price: Math.round(baseProduct.basePrice * priceMultiplier),
        mrp: Math.round(baseProduct.baseMrp * priceMultiplier),
        stock: Math.floor(baseProduct.baseStock / Math.max(1, combinations.length)),
        status: 'ACTIVE',
        enabled: true,
        image: null,
        weight: this.getWeightFromCombo(combo),
        isDefault: index === 0
      };
    });
  },

  /**
   * Calculate price multiplier based on attributes
   */
  calculatePriceMultiplier(combo) {
    let multiplier = 1;
    
    combo.forEach(attr => {
      if (attr.attribute === 'Weight') {
        switch (attr.value) {
          case '1kg': multiplier *= 1; break;
          case '2kg': multiplier *= 1.8; break;
          case '5kg': multiplier *= 4.2; break;
          case '10kg': multiplier *= 8; break;
          case '250g': multiplier *= 0.3; break;
          case '500g': multiplier *= 0.6; break;
          default: multiplier *= 1; break;
        }
      }
      
      if (attr.attribute === 'Quality') {
        switch (attr.value) {
          case 'Premium': multiplier *= 1; break;
          case 'Super Premium': multiplier *= 1.3; break;
          case 'Organic': multiplier *= 1.2; break;
          default: multiplier *= 1; break;
        }
      }
      
      if (attr.attribute === 'Pack Size') {
        switch (attr.value) {
          case 'Single': multiplier *= 1; break;
          case 'Pack of 2': multiplier *= 1.9; break;
          case 'Pack of 5': multiplier *= 4.5; break;
          case 'Pack of 10': multiplier *= 8.5; break;
          default: multiplier *= 1; break;
        }
      }
    });
    
    return multiplier;
  },

  /**
   * Get weight from attribute combination
   */
  getWeightFromCombo(combo) {
    const weightAttr = combo.find(c => c.attribute === 'Weight');
    return weightAttr ? weightAttr.value : '1kg';
  }
};

export default variantService; 