import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import vendorService from '../../services/vendorService';
import {
  FiSave,
  FiX,
  FiUpload,
  FiPlus,
  FiMinus,
  FiInfo,
  FiDollarSign,
  FiPackage,
  FiImage,
  FiTruck,
  FiFileText,
  FiShield,
  FiSearch
} from 'react-icons/fi';

/**
 * Product Add Component
 * Comprehensive product creation form based on product-form-structure.json
 */
const ProductAdd = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState({});
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 9;

  const vendorId = vendorService.getCurrentVendorId();

  // Form data state matching product-form-structure.json
  const [formData, setFormData] = useState({
    // Basic Information
    productTitle: '',
    brandName: '',
    skuCode: '',
    productType: 'SIMPLE',
    categoryId: '',
    subcategoryId: '',

    // Pricing Strategy
    mrp: '',
    sellingPrice: '',
    costPrice: '',
    offerStartDate: '',
    offerEndDate: '',
    bulkPricingTiers: [],

    // Inventory Management
    stockQuantity: '',
    unitOfMeasurement: 'kg',
    minimumOrderQuantity: 1,
    maximumOrderQuantity: '',
    minStockAlert: 10,
    trackQuantity: true,
    restockDate: '',

    // Media Gallery
    imageUrl: '',
    galleryImages: [],
    videoUrl: '',
    imageAltTags: [],

    // Shipping & Logistics
    weight: '',
    dimensions: '',
    deliveryTimeEstimate: '2-3 days',
    shippingClass: 'STANDARD',
    coldStorageRequired: false,
    specialPackaging: false,
    insuranceRequired: false,
    freeShipping: false,
    freeShippingThreshold: '',
    isReturnable: true,
    returnWindow: 'SEVEN_DAYS',
    returnConditions: [],
    isCodAvailable: true,

    // Product Descriptions
    shortDescription: '',
    fullDescription: '',
    keyFeatures: [],
    productHighlights: [],
    ingredientsList: '',
    nutritionalInfo: {},
    allergenInfo: [],

    // Certifications & Compliance
    fssaiLicense: '',
    organicCertification: {},
    qualityCertifications: [],
    countryOfOrigin: 'India',
    stateOfOrigin: '',
    farmName: '',
    harvestSeason: '',
    manufacturingDate: '',
    expiryDate: '',
    bestBeforeDate: '',
    shelfLifeDays: '',

    // SEO Optimization
    metaTitle: '',
    metaDescription: '',
    searchKeywords: [],
    urlSlug: '',
    structuredData: {},

    // Status
    status: 'DRAFT'
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    // Auto-generate URL slug from product title
    if (formData.productTitle && !formData.urlSlug) {
      const slug = formData.productTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, urlSlug: slug }));
    }
  }, [formData.productTitle]);

  const loadCategories = async () => {
    try {
      const response = await vendorService.getProductCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleArrayAdd = (field, value = '') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], value]
    }));
  };

  const handleArrayRemove = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleArrayUpdate = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const generateSku = async () => {
    try {
      const category = Object.keys(categories).find(key => 
        categories[key].subcategories && 
        Object.keys(categories[key].subcategories).includes(formData.subcategoryId)
      );
      
      const response = await vendorService.generateSku(vendorId, category, formData.subcategoryId);
      if (response.success) {
        handleInputChange('skuCode', response.data.sku);
      }
    } catch (err) {
      console.error('Error generating SKU:', err);
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1: // Basic Information
        if (!formData.productTitle) newErrors.productTitle = 'Product title is required';
        if (!formData.brandName) newErrors.brandName = 'Brand name is required';
        if (!formData.categoryId) newErrors.categoryId = 'Category is required';
        break;
      
      case 2: // Pricing Strategy
        if (!formData.mrp) newErrors.mrp = 'MRP is required';
        if (!formData.sellingPrice) newErrors.sellingPrice = 'Selling price is required';
        if (parseFloat(formData.sellingPrice) > parseFloat(formData.mrp)) {
          newErrors.sellingPrice = 'Selling price cannot be higher than MRP';
        }
        break;
      
      case 3: // Inventory Management
        if (!formData.stockQuantity) newErrors.stockQuantity = 'Stock quantity is required';
        if (!formData.unitOfMeasurement) newErrors.unitOfMeasurement = 'Unit of measurement is required';
        break;
      
      case 4: // Media Gallery
        if (!formData.imageUrl) newErrors.imageUrl = 'Main product image is required';
        break;
      
      case 5: // Shipping & Logistics
        if (!formData.weight) newErrors.weight = 'Weight is required for shipping';
        if (!formData.deliveryTimeEstimate) newErrors.deliveryTimeEstimate = 'Delivery time estimate is required';
        break;
      
      case 6: // Product Descriptions
        if (!formData.shortDescription) newErrors.shortDescription = 'Short description is required';
        if (!formData.fullDescription) newErrors.fullDescription = 'Full description is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (isDraft = false) => {
    if (!isDraft && !validateStep(currentStep)) return;

    try {
      setLoading(true);
      
      const productData = {
        ...formData,
        status: isDraft ? 'DRAFT' : 'ACTIVE'
      };

      const response = await vendorService.createProduct(vendorId, productData);
      
      if (response.success) {
        navigate('/vendor/products', {
          state: { message: 'Product created successfully!' }
        });
      }
    } catch (err) {
      console.error('Error creating product:', err);
      setErrors({ submit: 'Failed to create product. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step}
            </div>
            {step < totalSteps && (
              <div
                className={`w-12 h-1 mx-2 ${
                  step < currentStep ? 'bg-green-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-4">
        <h2 className="text-lg font-medium text-gray-900">
          Step {currentStep}: {getStepTitle(currentStep)}
        </h2>
        <p className="text-sm text-gray-600">{getStepDescription(currentStep)}</p>
      </div>
    </div>
  );

  const getStepTitle = (step) => {
    const titles = {
      1: 'Basic Information',
      2: 'Pricing Strategy',
      3: 'Inventory Management',
      4: 'Media Gallery',
      5: 'Shipping & Logistics',
      6: 'Product Descriptions',
      7: 'Certifications & Compliance',
      8: 'SEO Optimization',
      9: 'Review & Publish'
    };
    return titles[step];
  };

  const getStepDescription = (step) => {
    const descriptions = {
      1: 'Enter basic product information like title, brand, and category',
      2: 'Set pricing including MRP, selling price, and any offers',
      3: 'Manage inventory levels and stock settings',
      4: 'Upload product images and videos',
      5: 'Configure shipping options and logistics',
      6: 'Write compelling product descriptions and features',
      7: 'Add certifications and compliance information',
      8: 'Optimize for search engines',
      9: 'Review all information before publishing'
    };
    return descriptions[step];
  };

  const renderBasicInformation = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Title *
          </label>
          <input
            type="text"
            value={formData.productTitle}
            onChange={(e) => handleInputChange('productTitle', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-green-500 focus:border-green-500 ${
              errors.productTitle ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter product title (10-100 characters)"
          />
          {errors.productTitle && (
            <p className="mt-1 text-sm text-red-600">{errors.productTitle}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand Name *
          </label>
          <input
            type="text"
            value={formData.brandName}
            onChange={(e) => handleInputChange('brandName', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-green-500 focus:border-green-500 ${
              errors.brandName ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter brand name"
          />
          {errors.brandName && (
            <p className="mt-1 text-sm text-red-600">{errors.brandName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SKU Code
          </label>
          <div className="flex">
            <input
              type="text"
              value={formData.skuCode}
              onChange={(e) => handleInputChange('skuCode', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-green-500 focus:border-green-500"
              placeholder="Enter or generate SKU"
            />
            <button
              type="button"
              onClick={generateSku}
              className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200"
            >
              Generate
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Type
          </label>
          <select
            value={formData.productType}
            onChange={(e) => handleInputChange('productType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          >
            <option value="SIMPLE">Simple Product</option>
            <option value="VARIABLE">Variable Product (with variants)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            value={formData.categoryId}
            onChange={(e) => handleInputChange('categoryId', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-green-500 focus:border-green-500 ${
              errors.categoryId ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select Category</option>
            {Object.entries(categories).map(([key, category]) => (
              <option key={key} value={key}>{category.name}</option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
          )}
        </div>

        {formData.categoryId && categories[formData.categoryId]?.subcategories && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subcategory
            </label>
            <select
              value={formData.subcategoryId}
              onChange={(e) => handleInputChange('subcategoryId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select Subcategory</option>
              {Object.entries(categories[formData.categoryId].subcategories).map(([key, subcat]) => (
                <option key={key} value={key}>{subcat.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );

  const renderPricingStrategy = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            MRP (Maximum Retail Price) *
          </label>
          <div className="relative">
            <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              step="0.01"
              value={formData.mrp}
              onChange={(e) => handleInputChange('mrp', e.target.value)}
              className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-green-500 focus:border-green-500 ${
                errors.mrp ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
          </div>
          {errors.mrp && (
            <p className="mt-1 text-sm text-red-600">{errors.mrp}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selling Price *
          </label>
          <div className="relative">
            <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              step="0.01"
              value={formData.sellingPrice}
              onChange={(e) => handleInputChange('sellingPrice', e.target.value)}
              className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-green-500 focus:border-green-500 ${
                errors.sellingPrice ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
          </div>
          {errors.sellingPrice && (
            <p className="mt-1 text-sm text-red-600">{errors.sellingPrice}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cost Price
          </label>
          <div className="relative">
            <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              step="0.01"
              value={formData.costPrice}
              onChange={(e) => handleInputChange('costPrice', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              placeholder="0.00"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">For profit calculation (optional)</p>
        </div>
      </div>

      {/* Offer Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Offer Start Date
          </label>
          <input
            type="datetime-local"
            value={formData.offerStartDate}
            onChange={(e) => handleInputChange('offerStartDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Offer End Date
          </label>
          <input
            type="datetime-local"
            value={formData.offerEndDate}
            onChange={(e) => handleInputChange('offerEndDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      {/* Bulk Pricing Tiers */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Bulk Pricing Tiers
          </label>
          <button
            type="button"
            onClick={() => handleArrayAdd('bulkPricingTiers', { minQuantity: '', maxQuantity: '', price: '' })}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
          >
            <FiPlus className="mr-1 h-4 w-4" />
            Add Tier
          </button>
        </div>
        
        {formData.bulkPricingTiers.map((tier, index) => (
          <div key={index} className="flex items-center space-x-4 mb-3">
            <input
              type="number"
              placeholder="Min Qty"
              value={tier.minQuantity}
              onChange={(e) => handleArrayUpdate('bulkPricingTiers', index, { ...tier, minQuantity: e.target.value })}
              className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
            <input
              type="number"
              placeholder="Max Qty"
              value={tier.maxQuantity}
              onChange={(e) => handleArrayUpdate('bulkPricingTiers', index, { ...tier, maxQuantity: e.target.value })}
              className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              value={tier.price}
              onChange={(e) => handleArrayUpdate('bulkPricingTiers', index, { ...tier, price: e.target.value })}
              className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
            <button
              type="button"
              onClick={() => handleArrayRemove('bulkPricingTiers', index)}
              className="p-2 text-red-600 hover:text-red-800"
            >
              <FiMinus className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInventoryManagement = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stock Quantity *
          </label>
          <div className="relative">
            <FiPackage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              value={formData.stockQuantity}
              onChange={(e) => handleInputChange('stockQuantity', e.target.value)}
              className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-green-500 focus:border-green-500 ${
                errors.stockQuantity ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0"
            />
          </div>
          {errors.stockQuantity && (
            <p className="mt-1 text-sm text-red-600">{errors.stockQuantity}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Unit of Measurement *
          </label>
          <select
            value={formData.unitOfMeasurement}
            onChange={(e) => handleInputChange('unitOfMeasurement', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-green-500 focus:border-green-500 ${
              errors.unitOfMeasurement ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="kg">Kilogram (kg)</option>
            <option value="g">Gram (g)</option>
            <option value="l">Liter (l)</option>
            <option value="ml">Milliliter (ml)</option>
            <option value="piece">Piece</option>
            <option value="pack">Pack</option>
            <option value="box">Box</option>
            <option value="bag">Bag</option>
          </select>
          {errors.unitOfMeasurement && (
            <p className="mt-1 text-sm text-red-600">{errors.unitOfMeasurement}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Order Quantity
          </label>
          <input
            type="number"
            value={formData.minimumOrderQuantity}
            onChange={(e) => handleInputChange('minimumOrderQuantity', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            placeholder="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Order Quantity
          </label>
          <input
            type="number"
            value={formData.maximumOrderQuantity}
            onChange={(e) => handleInputChange('maximumOrderQuantity', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            placeholder="No limit"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Low Stock Alert
          </label>
          <input
            type="number"
            value={formData.minStockAlert}
            onChange={(e) => handleInputChange('minStockAlert', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            placeholder="10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Restock Date
          </label>
          <input
            type="date"
            value={formData.restockDate}
            onChange={(e) => handleInputChange('restockDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.trackQuantity}
            onChange={(e) => handleInputChange('trackQuantity', e.target.checked)}
            className="h-4 w-4 text-green-600 rounded border-gray-300"
          />
          <span className="ml-2 text-sm text-gray-700">Track quantity</span>
        </label>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderBasicInformation();
      case 2:
        return renderPricingStrategy();
      case 3:
        return renderInventoryManagement();
      case 4:
        return <div className="text-center py-8 text-gray-500">Media Gallery - Coming Soon</div>;
      case 5:
        return <div className="text-center py-8 text-gray-500">Shipping & Logistics - Coming Soon</div>;
      case 6:
        return <div className="text-center py-8 text-gray-500">Product Descriptions - Coming Soon</div>;
      case 7:
        return <div className="text-center py-8 text-gray-500">Certifications & Compliance - Coming Soon</div>;
      case 8:
        return <div className="text-center py-8 text-gray-500">SEO Optimization - Coming Soon</div>;
      case 9:
        return <div className="text-center py-8 text-gray-500">Review & Publish - Coming Soon</div>;
      default:
        return renderBasicInformation();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600">Create a new product listing for your store</p>
        </div>
        <button
          onClick={() => navigate('/vendor/products')}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <FiX className="mr-2 h-4 w-4" />
          Cancel
        </button>
      </div>

      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Form */}
      <div className="bg-white rounded-lg shadow p-6">
        {renderCurrentStep()}

        {/* Navigation Buttons */}
        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Save as Draft
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSubmit(false)}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
              >
                <FiSave className="mr-2 h-4 w-4" />
                {loading ? 'Publishing...' : 'Publish Product'}
              </button>
            )}
          </div>
        </div>

        {/* Error Display */}
        {errors.submit && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-800">{errors.submit}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductAdd;
