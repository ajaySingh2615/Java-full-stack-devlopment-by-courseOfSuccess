import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save, 
  X, 
  Plus, 
  Minus, 
  Upload, 
  Eye, 
  AlertCircle,
  CheckCircle,
  Info,
  Package,
  DollarSign,
  Tag,
  Image as ImageIcon,
  Truck,
  FileText,
  Shield,
  Search,
  Copy,
  Grid
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Advanced Product Add/Edit Component - Phase 2
 * 
 * Comprehensive product form with variants, pricing, inventory management
 * Based on product-form-structure.json specifications
 */
const ProductAdd = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); // For edit mode
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');
  const [errors, setErrors] = useState({});

  // Product Categories from product-categories.json
  const productCategories = {
    organic_grains: {
      name: "Organic Grains & Cereals",
      subcategories: {
        wheat: { name: "Wheat & Wheat Products", hsn: "1001", gst: 0 },
        rice: { name: "Rice & Rice Products", hsn: "1006", gst: 0 },
        corn: { name: "Corn & Corn Products", hsn: "1005", gst: 0 },
        millets: { name: "Millets", hsn: "1008", gst: 0 },
        oats: { name: "Oats & Quinoa", hsn: "1008", gst: 0 }
      }
    },
    pulses_legumes: {
      name: "Pulses & Legumes",
      subcategories: {
        lentils: { name: "Lentils (Dal)", hsn: "0713", gst: 0 },
        whole_pulses: { name: "Whole Pulses", hsn: "0713", gst: 0 },
        specialty_beans: { name: "Specialty Beans", hsn: "0713", gst: 0 }
      }
    },
    dairy_products: {
      name: "Dairy & Milk Products",
      subcategories: {
        milk: { name: "Fresh Milk", hsn: "0401", gst: 5 },
        ghee_butter: { name: "Ghee & Butter", hsn: "0405", gst: 5 },
        cheese_paneer: { name: "Cheese & Paneer", hsn: "0406", gst: 5 },
        yogurt_curd: { name: "Yogurt & Curd", hsn: "0401", gst: 5 }
      }
    },
    fresh_vegetables: {
      name: "Fresh Vegetables",
      subcategories: {
        leafy_greens: { name: "Leafy Greens", hsn: "0701", gst: 0 },
        root_vegetables: { name: "Root Vegetables", hsn: "0702", gst: 0 },
        gourds: { name: "Gourds & Squash", hsn: "0703", gst: 0 },
        seasonal_vegetables: { name: "Seasonal Vegetables", hsn: "0704", gst: 0 },
        exotic_vegetables: { name: "Exotic Vegetables", hsn: "0705", gst: 0 }
      }
    },
    seasonal_fruits: {
      name: "Seasonal Fruits",
      subcategories: {
        citrus_fruits: { name: "Citrus Fruits", hsn: "0801", gst: 0 },
        tropical_fruits: { name: "Tropical Fruits", hsn: "0802", gst: 0 },
        berries: { name: "Berries", hsn: "0803", gst: 0 },
        dry_fruits: { name: "Dry Fruits & Nuts", hsn: "0804", gst: 0 },
        seasonal_fruits: { name: "Seasonal Fruits", hsn: "0801", gst: 0 }
      }
    },
    traditional_products: {
      name: "Traditional & Artisanal",
      subcategories: {
        sweeteners: { name: "Natural Sweeteners", hsn: "1701", gst: 5 },
        oils: { name: "Cooking Oils", hsn: "1507", gst: 5 },
        spices: { name: "Spices & Condiments", hsn: "0910", gst: 5 },
        pickles_preserves: { name: "Pickles & Preserves", hsn: "2005", gst: 12 },
        herbal_products: { name: "Herbal & Ayurvedic", hsn: "2106", gst: 12 }
      }
    }
  };

  // Form state
  const [productData, setProductData] = useState({
    // Basic Information
    productTitle: '',
    category: '',
    subcategory: '',
    brandName: '',
    customBrandName: '',
    skuCode: '',
    productType: 'simple',
    
    // Pricing
    mrp: '',
    sellingPrice: '',
    costPrice: '',
    discountPercentage: 0,
    offerStartDate: '',
    offerEndDate: '',
    bulkPricing: [],
    
    // Inventory
    stockQuantity: '',
    lowStockThreshold: '',
    trackInventory: true,
    allowBackorders: false,
    stockStatus: 'IN_STOCK',
    
    // Variants (for variable products)
    hasVariants: false,
    variantAttributes: [],
    variants: [],
    
    // Media
    images: [],
    videos: [],
    
    // Shipping
    weight: '',
    dimensions: { length: '', width: '', height: '' },
    shippingClass: '',
    freeShipping: false,
    
    // Product Details
    shortDescription: '',
    fullDescription: '',
    features: [],
    ingredients: '',
    nutritionalInfo: '',
    
    // Certifications
    certifications: [],
    hsnCode: '',
    gstRate: 0,
    fssaiLicense: '',
    
    // SEO
    metaTitle: '',
    metaDescription: '',
    keywords: [],
    
    // Settings
    status: 'DRAFT',
    featured: false,
    returnable: true,
    codAvailable: true,
    deliveryTime: '2-3 days'
  });

  // Form sections configuration
  const formSections = [
    { id: 'basic', label: 'Basic Information', icon: Package },
    { id: 'pricing', label: 'Pricing & Offers', icon: DollarSign },
    { id: 'inventory', label: 'Inventory Management', icon: Package },
    { id: 'variants', label: 'Product Variants', icon: Tag },
    { id: 'media', label: 'Images & Videos', icon: ImageIcon },
    { id: 'shipping', label: 'Shipping & Logistics', icon: Truck },
    { id: 'details', label: 'Product Details', icon: FileText },
    { id: 'certifications', label: 'Certifications', icon: Shield },
    { id: 'seo', label: 'SEO Optimization', icon: Search }
  ];

  // Auto-generate SKU when category and subcategory are selected
  useEffect(() => {
    if (productData.category && productData.subcategory && !isEditMode) {
      const categoryCode = productData.category.toUpperCase().substring(0, 2);
      const vendorId = currentUser?.id || '001';
      const productNumber = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
      const sku = `GM${categoryCode}${vendorId.toString().padStart(3, '0')}${productNumber}`;
      
      setProductData(prev => ({ ...prev, skuCode: sku }));
    }
  }, [productData.category, productData.subcategory, isEditMode, currentUser]);

  // Auto-calculate discount percentage
  useEffect(() => {
    if (productData.mrp && productData.sellingPrice) {
      const mrp = parseFloat(productData.mrp);
      const selling = parseFloat(productData.sellingPrice);
      if (mrp > 0 && selling > 0) {
        const discount = ((mrp - selling) / mrp) * 100;
        setProductData(prev => ({ ...prev, discountPercentage: Math.round(discount * 100) / 100 }));
      }
    }
  }, [productData.mrp, productData.sellingPrice]);

  // Auto-update HSN and GST when category/subcategory changes
  useEffect(() => {
    if (productData.category && productData.subcategory) {
      const categoryData = productCategories[productData.category];
      if (categoryData && categoryData.subcategories[productData.subcategory]) {
        const subcategoryData = categoryData.subcategories[productData.subcategory];
        setProductData(prev => ({
          ...prev,
          hsnCode: subcategoryData.hsn,
          gstRate: subcategoryData.gst
        }));
      }
    }
  }, [productData.category, productData.subcategory]);

  const handleInputChange = (field, value) => {
    setProductData(prev => ({ ...prev, [field]: value }));
    
    // Clear field-specific errors
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleNestedInputChange = (parentField, childField, value) => {
    setProductData(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [childField]: value
      }
    }));
  };

  const addBulkPricingTier = () => {
    if (productData.bulkPricing.length < 5) {
      setProductData(prev => ({
        ...prev,
        bulkPricing: [...prev.bulkPricing, {
          minQuantity: '',
          discountType: 'percentage',
          discountValue: ''
        }]
      }));
    }
  };

  const removeBulkPricingTier = (index) => {
    setProductData(prev => ({
      ...prev,
      bulkPricing: prev.bulkPricing.filter((_, i) => i !== index)
    }));
  };

  const addVariantAttribute = () => {
    setProductData(prev => ({
      ...prev,
      variantAttributes: [...prev.variantAttributes, {
        name: '',
        values: ['']
      }]
    }));
  };

  const addFeature = () => {
    setProductData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index) => {
    setProductData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic Information validation
    if (!productData.productTitle.trim()) {
      newErrors.productTitle = 'Product title is required';
    } else if (productData.productTitle.length < 10) {
      newErrors.productTitle = 'Product title must be at least 10 characters';
    }

    if (!productData.category) {
      newErrors.category = 'Category is required';
    }

    if (!productData.subcategory) {
      newErrors.subcategory = 'Subcategory is required';
    }

    if (!productData.brandName) {
      newErrors.brandName = 'Brand name is required';
    }

    // Pricing validation
    if (!productData.mrp || parseFloat(productData.mrp) <= 0) {
      newErrors.mrp = 'Valid MRP is required';
    }

    if (!productData.sellingPrice || parseFloat(productData.sellingPrice) <= 0) {
      newErrors.sellingPrice = 'Valid selling price is required';
    }

    if (parseFloat(productData.sellingPrice) > parseFloat(productData.mrp)) {
      newErrors.sellingPrice = 'Selling price cannot be greater than MRP';
    }

    // Inventory validation
    if (productData.trackInventory && (!productData.stockQuantity || parseInt(productData.stockQuantity) < 0)) {
      newErrors.stockQuantity = 'Valid stock quantity is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (status = 'DRAFT') => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      const productPayload = {
        ...productData,
        status,
        updatedAt: new Date().toISOString()
      };

      if (isEditMode) {
        productPayload.id = id;
        productPayload.updatedAt = new Date().toISOString();
      } else {
        productPayload.createdAt = new Date().toISOString();
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Product saved:', productPayload);
      navigate('/vendor/products', { 
        state: { 
          message: `Product ${isEditMode ? 'updated' : 'created'} successfully!` 
        }
      });
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setSaving(false);
    }
  };

  const renderBasicInformation = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Title *
          </label>
          <input
            type="text"
            value={productData.productTitle}
            onChange={(e) => handleInputChange('productTitle', e.target.value)}
            className={`block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 ${
              errors.productTitle ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="e.g., Organic Basmati Rice Premium Quality 5kg"
            maxLength={100}
          />
          {errors.productTitle && (
            <p className="mt-1 text-sm text-red-600">{errors.productTitle}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Clear, descriptive title that customers will see ({productData.productTitle.length}/100)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            value={productData.category}
            onChange={(e) => {
              handleInputChange('category', e.target.value);
              handleInputChange('subcategory', ''); // Reset subcategory
            }}
            className={`block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 ${
              errors.category ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select Category</option>
            {Object.entries(productCategories).map(([key, category]) => (
              <option key={key} value={key}>{category.name}</option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subcategory *
          </label>
          <select
            value={productData.subcategory}
            onChange={(e) => handleInputChange('subcategory', e.target.value)}
            disabled={!productData.category}
            className={`block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 ${
              errors.subcategory ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select Subcategory</option>
            {productData.category && productCategories[productData.category] && 
              Object.entries(productCategories[productData.category].subcategories).map(([key, subcategory]) => (
                <option key={key} value={key}>{subcategory.name}</option>
              ))
            }
          </select>
          {errors.subcategory && (
            <p className="mt-1 text-sm text-red-600">{errors.subcategory}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand Name *
          </label>
          <select
            value={productData.brandName}
            onChange={(e) => handleInputChange('brandName', e.target.value)}
            className={`block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 ${
              errors.brandName ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select Brand</option>
            <option value="local_brand">Local/Homemade Brand</option>
            <option value="organic_india">Organic India</option>
            <option value="patanjali">Patanjali</option>
            <option value="24_mantra">24 Mantra Organic</option>
            <option value="custom">Other (Please specify)</option>
          </select>
          {errors.brandName && (
            <p className="mt-1 text-sm text-red-600">{errors.brandName}</p>
          )}
        </div>

        {productData.brandName === 'custom' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Brand Name *
            </label>
            <input
              type="text"
              value={productData.customBrandName}
              onChange={(e) => handleInputChange('customBrandName', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="Enter brand name"
              maxLength={50}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SKU Code
          </label>
          <input
            type="text"
            value={productData.skuCode}
            readOnly
            className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
            placeholder="Auto-generated"
          />
          <p className="mt-1 text-sm text-gray-500">Unique product identifier (auto-generated)</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Type
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="simple"
                checked={productData.productType === 'simple'}
                onChange={(e) => handleInputChange('productType', e.target.value)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Simple Product</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="variable"
                checked={productData.productType === 'variable'}
                onChange={(e) => {
                  handleInputChange('productType', e.target.value);
                  handleInputChange('hasVariants', e.target.value === 'variable');
                }}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Variable Product (with variants)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Auto-filled fields display */}
      {productData.category && productData.subcategory && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Auto-filled Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-blue-700 font-medium">HSN Code:</span>
              <span className="ml-2 text-blue-900">{productData.hsnCode}</span>
            </div>
            <div>
              <span className="text-blue-700 font-medium">GST Rate:</span>
              <span className="ml-2 text-blue-900">{productData.gstRate}%</span>
            </div>
            <div>
              <span className="text-blue-700 font-medium">SKU:</span>
              <span className="ml-2 text-blue-900">{productData.skuCode}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderPricing = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Retail Price (MRP) * ₹
          </label>
          <input
            type="number"
            value={productData.mrp}
            onChange={(e) => handleInputChange('mrp', e.target.value)}
            className={`block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 ${
              errors.mrp ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="0.00"
            min="1"
            max="100000"
            step="0.01"
          />
          {errors.mrp && (
            <p className="mt-1 text-sm text-red-600">{errors.mrp}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Selling Price * ₹
          </label>
          <input
            type="number"
            value={productData.sellingPrice}
            onChange={(e) => handleInputChange('sellingPrice', e.target.value)}
            className={`block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 ${
              errors.sellingPrice ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="0.00"
            min="1"
            step="0.01"
          />
          {errors.sellingPrice && (
            <p className="mt-1 text-sm text-red-600">{errors.sellingPrice}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Discount %
          </label>
          <input
            type="number"
            value={productData.discountPercentage}
            readOnly
            className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
            placeholder="0.00"
          />
          <p className="mt-1 text-sm text-gray-500">Automatically calculated</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Cost Price (Optional) ₹
          </label>
          <input
            type="number"
            value={productData.costPrice}
            onChange={(e) => handleInputChange('costPrice', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            placeholder="0.00"
            min="0"
            step="0.01"
          />
          <p className="mt-1 text-sm text-gray-500">For internal profit calculation (private)</p>
        </div>
      </div>

      {/* Bulk Pricing */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium text-gray-900">Bulk Pricing Tiers (Optional)</h4>
          <button
            type="button"
            onClick={addBulkPricingTier}
            disabled={productData.bulkPricing.length >= 5}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Tier
          </button>
        </div>

        {productData.bulkPricing.map((tier, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border border-gray-200 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Quantity
              </label>
              <input
                type="number"
                value={tier.minQuantity}
                onChange={(e) => {
                  const newTiers = [...productData.bulkPricing];
                  newTiers[index].minQuantity = e.target.value;
                  setProductData(prev => ({ ...prev, bulkPricing: newTiers }));
                }}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                placeholder="1"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Type
              </label>
              <select
                value={tier.discountType}
                onChange={(e) => {
                  const newTiers = [...productData.bulkPricing];
                  newTiers[index].discountType = e.target.value;
                  setProductData(prev => ({ ...prev, bulkPricing: newTiers }));
                }}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              >
                <option value="percentage">Percentage Off</option>
                <option value="fixed_amount">Fixed Amount Off</option>
                <option value="fixed_price">Fixed Price Per Unit</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Value
              </label>
              <input
                type="number"
                value={tier.discountValue}
                onChange={(e) => {
                  const newTiers = [...productData.bulkPricing];
                  newTiers[index].discountValue = e.target.value;
                  setProductData(prev => ({ ...prev, bulkPricing: newTiers }));
                }}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => removeBulkPricingTier(index)}
                className="w-full px-3 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50"
              >
                <Minus className="w-4 h-4 mx-auto" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInventory = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={productData.trackInventory}
          onChange={(e) => handleInputChange('trackInventory', e.target.checked)}
          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
        />
        <label className="text-sm font-medium text-gray-700">
          Track inventory for this product
        </label>
      </div>

      {productData.trackInventory && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Quantity *
            </label>
            <input
              type="number"
              value={productData.stockQuantity}
              onChange={(e) => handleInputChange('stockQuantity', e.target.value)}
              className={`block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 ${
                errors.stockQuantity ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0"
              min="0"
            />
            {errors.stockQuantity && (
              <p className="mt-1 text-sm text-red-600">{errors.stockQuantity}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Low Stock Threshold
            </label>
            <input
              type="number"
              value={productData.lowStockThreshold}
              onChange={(e) => handleInputChange('lowStockThreshold', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="5"
              min="0"
            />
            <p className="mt-1 text-sm text-gray-500">Alert when stock falls below this number</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Status
            </label>
            <select
              value={productData.stockStatus}
              onChange={(e) => handleInputChange('stockStatus', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option value="IN_STOCK">In Stock</option>
              <option value="LOW_STOCK">Low Stock</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
              <option value="DISCONTINUED">Discontinued</option>
            </select>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={productData.allowBackorders}
          onChange={(e) => handleInputChange('allowBackorders', e.target.checked)}
          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
        />
        <label className="text-sm font-medium text-gray-700">
          Allow backorders (customers can order when out of stock)
        </label>
      </div>
    </div>
  );

  const renderVariants = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <Info className="h-5 w-5 text-blue-500 mr-2" />
          <div>
            <h4 className="text-sm font-medium text-blue-900">Product Variants</h4>
            <p className="text-sm text-blue-700 mt-1">
              {productData.productType === 'variable' ? 
                'Variable product type selected. You can manage variants after creating the product.' : 
                'Switch to Variable Product type to enable variants.'
              }
            </p>
          </div>
        </div>
      </div>

      {productData.productType === 'variable' && (
        <div className="text-center py-8">
          <Grid className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Advanced Variant Management</h3>
          <p className="text-gray-500 mb-4">
            Create the product first, then use our advanced variant manager to set up size, weight, color, and other variations.
          </p>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50"
            disabled
          >
            <Tag className="w-4 h-4 mr-2" />
            Manage Variants (Available after creation)
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditMode ? 'Edit Product' : 'Add New Product'}
              </h1>
              <p className="text-gray-600 mt-1">
                {isEditMode ? 'Update your product information' : 'Create a comprehensive product listing'}
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate('/vendor/products')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
              <button
                onClick={() => handleSave('DRAFT')}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Save Draft
              </button>
              <button
                onClick={() => handleSave('ACTIVE')}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save & Publish'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Section Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-1 sticky top-8">
              {formSections.map((section) => {
                const IconComponent = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeSection === section.id
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="mr-3 h-5 w-5" />
                    {section.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Form Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {activeSection === 'basic' && renderBasicInformation()}
              {activeSection === 'pricing' && renderPricing()}
              {activeSection === 'inventory' && renderInventory()}
              {activeSection === 'variants' && renderVariants()}
              {(activeSection === 'media' || activeSection === 'shipping' || activeSection === 'details' || 
                activeSection === 'certifications' || activeSection === 'seo') && (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {formSections.find(s => s.id === activeSection)?.label}
                  </h3>
                  <p className="text-gray-500">This section will be implemented in Phase 2.1</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductAdd;
