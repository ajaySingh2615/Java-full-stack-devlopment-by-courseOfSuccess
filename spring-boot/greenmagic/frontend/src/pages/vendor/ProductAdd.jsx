import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import vendorService from '../../services/vendorService';
import {
  FiPlus,
  FiMinus,
  FiX,
  FiImage,
  FiUpload,
  FiTrash2,
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiPackage,
  FiTag,
  FiSettings,
  FiGlobe,
  FiShoppingBag,
  FiTruck,
  FiCreditCard,
  FiPercent,
  FiBarChart,
  FiLayers,
  FiGrid,
  FiList,
  FiEdit,
  FiEye,
  FiSave,
  FiRotateCcw,
  FiArrowLeft,
  FiArrowRight,
  FiHelpCircle,
  FiAlertTriangle,
  FiClock,
  FiCalendar,
  FiMapPin,
  FiBox,
  FiAward,
  FiFileText,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiMoreVertical,
  FiShield
} from 'react-icons/fi';

/**
 * Product Add Component
 * Comprehensive product creation form based on product-form-structure.json
 */
const ProductAdd = () => {
  const navigate = useNavigate();
  const { id: productId } = useParams(); // Get product ID from URL for edit mode
  const isEditMode = Boolean(productId); // Determine if we're editing or adding
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode); // Loading for fetching existing product data
  const [categories, setCategories] = useState({});
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 9;

  const vendorId = vendorService.getCurrentVendorId();

  // Form data state matching comprehensive ProductCreateRequestDto
  const [formData, setFormData] = useState({
    // Basic Information (Section 1)
    productTitle: '',
    categoryId: '',
    brandName: '',
    customBrandName: '',
    skuCode: '',
    productType: 'SIMPLE',
    dimensions: { length: '', width: '', height: '', unit: 'cm' }, // Initialize dimensions object

    // Pricing Strategy (Section 2)
    mrp: '',
    sellingPrice: '',
    costPrice: '',
    offerStartDate: '',
    offerEndDate: '',
    bulkPricingTiers: [],

    // Inventory Management (Section 3)
    stockQuantity: '',
    unitOfMeasurement: 'pieces',
    minimumOrderQuantity: 1,
    maximumOrderQuantity: '',
    lowStockAlert: 10,
    trackQuantity: true,
    restockDate: '',

    // Product Variants (Section 4)
    hasVariants: false,
    variantAttributes: [],
    variants: [],

    // Media Gallery (Section 5)
    mainImageUrl: '',
    galleryImages: [],
    videoUrl: '',
    imageAltTags: [],

    // Shipping & Logistics (Section 6)
    weightForShipping: '',
    dimensions: { length: '', width: '', height: '', unit: 'cm' },
    deliveryTimeEstimate: '3-5_days',
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

    // Product Descriptions (Section 7)
    shortDescription: '',
    detailedDescription: '',
    keyFeatures: [],
    productHighlights: [],

    // Certifications & Compliance (Section 8)
    fssaiLicense: '',
    qualityCertifications: [],

    // SEO Optimization (Section 9)
    metaTitle: '',
    metaDescription: '',
    searchKeywords: [],
    urlSlug: '',
    structuredData: {},

    // System Fields
    status: 'DRAFT'
  });

  // Fetch existing product data when in edit mode
  useEffect(() => {
    const fetchProductData = async () => {
      if (!isEditMode || !productId) return;
      
      try {
        setInitialLoading(true);
        setErrors({});
        
        const response = await vendorService.getProductById(vendorId, productId);
        
                if (response.success && response.data) {
          // The API response structure is { success, data: { basic, pricing, inventory, media, shipping, descriptions, certifications, seo, analytics } }
          const productDetails = response.data.data || response.data;
          
          console.log('Detailed product data for mapping:', productDetails);
          console.log('Available sections:', Object.keys(productDetails));
          
          // Extract data from comprehensive nested structure
          const basic = productDetails.basic || {};
          const pricing = productDetails.pricing || {};
          const inventory = productDetails.inventory || {};
          const media = productDetails.media || {};
          const shipping = productDetails.shipping || {};
          const descriptions = productDetails.descriptions || {};
          const certifications = productDetails.certifications || {};
          const seo = productDetails.seo || {};
          
          console.log('Basic info:', basic);
          console.log('Pricing info:', pricing);
          console.log('Inventory info:', inventory);
          console.log('Shipping info:', shipping);
          console.log('Shipping dimensions specifically:', shipping.dimensions);
          console.log('SEO info:', seo);
          
          // Map the comprehensive product data to form fields
          setFormData({
            // Basic Information
            productTitle: basic.name || '',
            categoryId: basic.categoryId ? String(basic.categoryId) : '', // Will be resolved later by useEffect
            brandName: basic.brand || '',
            customBrandName: '', // Not in current model
            skuCode: basic.sku || '',
            productType: (basic.productType || 'SIMPLE').toUpperCase(),

            // Pricing Strategy
            mrp: pricing.mrp?.toString() || '',
            sellingPrice: pricing.price?.toString() || '',
            costPrice: pricing.costPrice?.toString() || '',
            offerStartDate: (() => {
              if (!pricing.offerStartDate) return '';
              try {
                // Convert ISO string to local datetime-local format
                const date = new Date(pricing.offerStartDate);
                if (!(date instanceof Date) || isNaN(date)) return '';
                
                // Format to YYYY-MM-DDTHH:mm
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                
                return `${year}-${month}-${day}T${hours}:${minutes}`;
              } catch (e) {
                console.warn('Error parsing offerStartDate:', e);
                return '';
              }
            })(),
            offerEndDate: (() => {
              if (!pricing.offerEndDate) return '';
              try {
                // Convert ISO string to local datetime-local format
                const date = new Date(pricing.offerEndDate);
                if (!(date instanceof Date) || isNaN(date)) return '';
                
                // Format to YYYY-MM-DDTHH:mm
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                
                return `${year}-${month}-${day}T${hours}:${minutes}`;
              } catch (e) {
                console.warn('Error parsing offerEndDate:', e);
                return '';
              }
            })(),
            bulkPricingTiers: (() => {
              try {
                // Handle both string and array formats
                let tiers = pricing.bulkPricingTiers || [];
                
                // If it's a string, try to parse it
                if (typeof tiers === 'string') {
                  tiers = JSON.parse(tiers);
                }
                
                // Ensure it's an array and transform to form format
                return Array.isArray(tiers) ? tiers.map(tier => ({
                  minQuantity: tier.minQuantity?.toString() || '',
                  maxQuantity: tier.maxQuantity?.toString() || '',
                  price: (() => {
                    const mrp = parseFloat(pricing.mrp);
                    const discountValue = parseFloat(tier.discountValue);
                    if (!isNaN(mrp) && !isNaN(discountValue)) {
                      return (mrp - discountValue).toString();
                    }
                    return '';
                  })(),
                  discountType: tier.discountType || 'fixed_amount',
                  discountValue: tier.discountValue?.toString() || ''
                })) : [];
              } catch (e) {
                console.warn('Error parsing bulkPricingTiers:', e);
                return [];
              }
            })(),

            // Inventory Management
            stockQuantity: inventory.stockQuantity?.toString() || '',
            unitOfMeasurement: inventory.unitOfMeasurement || 'pieces',
            minimumOrderQuantity: inventory.minimumOrderQuantity || 1,
            maximumOrderQuantity: inventory.maximumOrderQuantity?.toString() || '',
            lowStockAlert: inventory.minStockAlert || 10,
            trackQuantity: inventory.trackQuantity !== false,
            restockDate: inventory.restockDate || '',

            // Product Variants
            hasVariants: (inventory.variants && inventory.variants.length > 0) || false,
            variantAttributes: [], // Would need additional mapping
            variants: inventory.variants || [],

            // Media Gallery
            mainImageUrl: media.mainImageUrl || media.imageUrl || '', // Try mainImageUrl first, then fall back to imageUrl
            galleryImages: (() => {
              console.log('Raw gallery images from API:', media.galleryImages);
              try {
                // Handle various formats
                if (!media.galleryImages) return [];
                
                // If it's already an array, clean each URL
                if (Array.isArray(media.galleryImages)) {
                  return media.galleryImages.map(cleanupUrl).filter(url => url.trim() !== '');
                }
                
                // If it's a string, try to parse it
                if (typeof media.galleryImages === 'string') {
                  const cleanUrl = cleanupUrl(media.galleryImages);
                  return cleanUrl ? [cleanUrl] : [];
                }
                
                return [];
              } catch (e) {
                console.warn('Error parsing galleryImages:', e);
                return [];
              }
            })(),
            videoUrl: media.videoUrl || '',
            imageAltTags: media.imageAltTags || [],

            // Descriptions
            shortDescription: descriptions.shortDescription || '',
            detailedDescription: descriptions.detailedDescription || '',
            keyFeatures: descriptions.keyFeatures || [],
            productHighlights: descriptions.productHighlights || [],
            usageInstructions: descriptions.usageInstructions || '',
            storageInstructions: descriptions.storageInstructions || '',

            // Specifications
            weightForShipping: shipping.weightForShipping?.toString() || '',
            dimensions: (() => {
              const dimensionData = shipping.dimensions;
              console.log('Raw dimensions from API:', dimensionData);
              console.log('Type of dimensions:', typeof dimensionData);
              
              if (!dimensionData) {
                console.log('No dimensions data, returning empty object');
                return { length: '', width: '', height: '', unit: 'cm' };
              }
              
              try {
                // If it's a string, try to parse it as JSON
                const dimensionObj = typeof dimensionData === 'string' ? JSON.parse(dimensionData) : dimensionData;
                console.log('Parsed dimensions object:', dimensionObj);
                
                // Convert to form format
                const result = {
                  length: dimensionObj.length?.toString() || '',
                  width: dimensionObj.width?.toString() || '',
                  height: dimensionObj.height?.toString() || '',
                  unit: dimensionObj.unit || 'cm'
                };
                console.log('Converted dimensions for form:', result);
                return result;
              } catch (error) {
                console.error('Error parsing dimensions:', error);
                return { length: '', width: '', height: '', unit: 'cm' };
              }
            })(),
            ingredients: descriptions.ingredients || '',
            nutritionalInfo: descriptions.nutritionalInfo || '',
            shelfLife: descriptions.shelfLife || '',
            origin: descriptions.origin || '',

            // Shipping & Logistics
            deliveryTimeEstimate: shipping.deliveryTimeEstimate || '3-5_days',
            shippingClass: shipping.shippingClass || 'STANDARD',
            coldStorageRequired: shipping.coldStorageRequired || false,
            specialPackaging: shipping.specialPackaging || false,
            insuranceRequired: shipping.insuranceRequired || false,
            freeShipping: shipping.freeShipping || false,
            freeShippingThreshold: shipping.freeShippingThreshold?.toString() || '',

            // SEO & Marketing
            metaTitle: seo.metaTitle || '',
            metaDescription: seo.metaDescription || '',
            searchKeywords: seo.searchKeywords || [],
            socialMediaText: seo.socialMediaText || '',

            // Return & Warranty
            isReturnable: shipping.isReturnable !== false,
            returnWindow: shipping.returnWindow || 'SEVEN_DAYS',
            returnConditions: shipping.returnConditions || [],
            warrantyPeriod: '', // Not in current model
            isCodAvailable: shipping.isCodAvailable !== false,

            // Certifications
            fssaiLicense: certifications.fssaiLicense || '',
            organicCertification: certifications.organicCertification || '',
            isoCertification: certifications.isoCertification || '',
            qualityCertifications: (() => {
              try {
                console.log('Raw qualityCertifications from API:', certifications.qualityCertifications);
                
                // If it's already an array, return it
                if (Array.isArray(certifications.qualityCertifications)) {
                  return certifications.qualityCertifications;
                }
                
                // If it's a string, try to parse it
                if (typeof certifications.qualityCertifications === 'string') {
                  const parsed = JSON.parse(certifications.qualityCertifications || '[]');
                  return Array.isArray(parsed) ? parsed : [];
                }
                
                // If it's null, undefined, or any other type, return empty array
                return [];
              } catch (e) {
                console.warn('Error parsing qualityCertifications:', e);
                return [];
              }
            })(),

            // System Fields
            status: basic.status || 'ACTIVE'
          });
          
          console.log('Product data loaded for editing:', productDetails);
          console.log('Form data set with comprehensive values:', {
            productTitle: basic.name,
            categoryId: basic.categoryId,
            categoryIdAsString: basic.categoryId ? String(basic.categoryId) : '',
            productType: basic.productType,
            sellingPrice: pricing.price,
            stockQuantity: inventory.stockQuantity,
            mrp: pricing.mrp,
            weightForShipping: shipping.weightForShipping,
            deliveryTimeEstimate: shipping.deliveryTimeEstimate,
            metaTitle: seo.metaTitle,
            fssaiLicense: certifications.fssaiLicense,
            dimensions: shipping.dimensions
          });
          console.log('Categories available:', Object.keys(categories || {}));
        } else {
          throw new Error(response.message || 'Failed to fetch product data');
        }
      } catch (err) {
        console.error('Error fetching product data:', err);
        setErrors({ 
          fetch: err.message || 'Failed to load product data. Please try again.' 
        });
      } finally {
        setInitialLoading(false);
      }
    };

    fetchProductData();
  }, [isEditMode, productId, vendorId]);

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

  // Validate category selection
  useEffect(() => {
    if (categories && Object.keys(categories).length > 0 && formData.categoryId) {
      console.log('Category validation:');
      console.log('Form categoryId:', formData.categoryId, 'Type:', typeof formData.categoryId);
      console.log('Available category keys:', Object.keys(categories));
      
      if (categories[formData.categoryId]) {
        console.log('Valid category selected:', categories[formData.categoryId]);
      } else {
        console.warn('CategoryId not found in categories object!');
        // Clear invalid category
        setFormData(prev => ({ ...prev, categoryId: '' }));
      }
    }
  }, [formData.categoryId, categories]);

  // Ensure qualityCertifications is always an array
  useEffect(() => {
    if (!Array.isArray(formData.qualityCertifications)) {
      console.warn('qualityCertifications is not an array, fixing:', formData.qualityCertifications);
      setFormData(prev => ({
        ...prev,
        qualityCertifications: []
      }));
    }
  }, [formData.qualityCertifications]);

  const loadCategories = async () => {
    try {
      const response = await vendorService.getProductCategories();
      console.log('Categories response:', response);
      if (response.success) {
        console.log('Setting categories:', response.data);
        setCategories(response.data);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const handleInputChange = (field, value) => {
    console.log('handleInputChange called:', { field, value });
    
    setFormData(prev => {
      // Special handling for dimensions object
      if (field === 'dimensions' && typeof value === 'object') {
        const newData = {
          ...prev,
          dimensions: {
            ...prev.dimensions,
            ...value
          }
        };
        console.log('Updated form data (dimensions):', { 
          field, 
          oldValue: prev.dimensions, 
          newValue: newData.dimensions 
        });
        return newData;
      }
      
      const newData = { ...prev, [field]: value };
      console.log('Updated form data:', { field, oldValue: prev[field], newValue: value });
      return newData;
    });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleArrayAdd = (field, value = '') => {
    console.log('handleArrayAdd called:', { field, value });
    setFormData(prev => {
      // Ensure the field exists and is an array
      const currentArray = Array.isArray(prev[field]) ? prev[field] : [];
      
      // If value is provided, use it directly
      if (value && typeof value === 'object') {
        const newArray = [...currentArray, value];
        console.log('Updated array with provided value:', { field, newArray });
        return { ...prev, [field]: newArray };
      }
      
      // Otherwise, handle field-specific defaults
      let newValue = value;
      
      // Special handling for bulk pricing tiers
      if (field === 'bulkPricingTiers') {
        newValue = {
          minQuantity: '',
          discountType: 'percentage',
          discountValue: ''
        };
      }
      
      const newArray = [...currentArray, newValue];
      console.log('Updated array:', { field, newArray });
      return { ...prev, [field]: newArray };
    });
  };

  const handleArrayRemove = (field, index) => {
    setFormData(prev => {
      // Ensure the field exists and is an array
      const currentArray = Array.isArray(prev[field]) ? prev[field] : [];
      
      return {
        ...prev,
        [field]: currentArray.filter((_, i) => i !== index)
      };
    });
  };

  const handleArrayUpdate = (field, index, value) => {
    console.log('handleArrayUpdate called:', { field, index, value });
    console.log('Current formData[field]:', formData[field]);
    
    setFormData(prev => {
      // Ensure the field exists and is an array
      const currentArray = Array.isArray(prev[field]) ? prev[field] : [];
      console.log('Current array:', currentArray);
      
      // Create a copy of the array
      const newArray = [...currentArray];
      
      // Ensure the index exists
      if (index >= 0 && index < newArray.length) {
        // Special handling for bulk pricing tiers
        if (field === 'bulkPricingTiers') {
          const tier = newArray[index] || {};
          const updatedTier = { ...tier, ...value };
          newArray[index] = updatedTier;
        } else {
          // For other arrays, make sure to preserve existing object properties
          const currentItem = newArray[index] || {};
          newArray[index] = typeof value === 'object' ? { ...currentItem, ...value } : value;
        }
        
        console.log('Updated array item:', { field, index, oldValue: currentArray[index], newValue: newArray[index] });
      } else {
        console.warn('Invalid array index for field:', field, 'index:', index, 'array length:', newArray.length);
      }
      
      const updatedFormData = { ...prev, [field]: newArray };
      console.log('Updated formData:', updatedFormData);
      return updatedFormData;
    });

    // Clear errors for bulk pricing tiers when user updates values
    if (field === 'bulkPricingTiers' && errors.bulkPricingTiers?.[index]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        if (newErrors.bulkPricingTiers) {
          delete newErrors.bulkPricingTiers[index];
          if (Object.keys(newErrors.bulkPricingTiers).length === 0) {
            delete newErrors.bulkPricingTiers;
          }
        }
        return newErrors;
      });
    }
  };

  const generateSku = async () => {
    try {
      if (!formData.categoryId) {
        alert('Please select a category first');
        return;
      }
      
      const response = await vendorService.generateSku(vendorId, formData.categoryId);
      if (response.success) {
        handleInputChange('skuCode', response.data.sku);
      }
    } catch (err) {
      console.error('Error generating SKU:', err);
      // Generate a fallback SKU if API fails
      const timestamp = Date.now().toString().slice(-4);
      const categoryCode = formData.categoryId ? formData.categoryId.toString().padStart(3, '0') : '001';
      const fallbackSku = `GM${categoryCode}${timestamp}`;
      handleInputChange('skuCode', fallbackSku);
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1: // Basic Information
        if (!formData.productTitle.trim()) newErrors.productTitle = 'Product title is required';
        else if (formData.productTitle.length < 10) newErrors.productTitle = 'Product title must be at least 10 characters';
        else if (formData.productTitle.length > 100) newErrors.productTitle = 'Product title must not exceed 100 characters';
        
        if (!formData.brandName.trim() && !formData.customBrandName.trim()) newErrors.brandName = 'Brand name is required';
        if (!formData.categoryId || formData.categoryId === '') newErrors.categoryId = 'Category is required';
        
        // SKU validation - if provided, must match pattern
        if (formData.skuCode && !/^GM[A-Z0-9]{2}[0-9]{3}[0-9]{4}$/.test(formData.skuCode)) {
          newErrors.skuCode = 'SKU format should be GM[XX][000][0000] (e.g., GMFR0011234)';
        }
        break;
      
      case 2: // Pricing Strategy
        if (!formData.mrp || isNaN(parseFloat(formData.mrp)) || parseFloat(formData.mrp) <= 0) {
          newErrors.mrp = 'Please enter a valid MRP greater than 0';
        }

        if (!formData.sellingPrice || isNaN(parseFloat(formData.sellingPrice)) || parseFloat(formData.sellingPrice) <= 0) {
          newErrors.sellingPrice = 'Please enter a valid selling price greater than 0';
        } else if (parseFloat(formData.sellingPrice) > parseFloat(formData.mrp)) {
          newErrors.sellingPrice = 'Selling price cannot be greater than MRP';
        }

        if (formData.costPrice && (isNaN(parseFloat(formData.costPrice)) || parseFloat(formData.costPrice) < 0)) {
          newErrors.costPrice = 'Cost price must be a valid number greater than or equal to 0';
        }

        // Validate offer dates
        if (formData.offerStartDate && formData.offerEndDate) {
          const startDate = new Date(formData.offerStartDate);
          const endDate = new Date(formData.offerEndDate);
          
          if (!(startDate instanceof Date) || isNaN(startDate)) {
            newErrors.offerStartDate = 'Please enter a valid start date';
          }
          
          if (!(endDate instanceof Date) || isNaN(endDate)) {
            newErrors.offerEndDate = 'Please enter a valid end date';
          }
          
          if (startDate >= endDate) {
            newErrors.offerEndDate = 'End date must be after start date';
          }
        } else if ((formData.offerStartDate && !formData.offerEndDate) || (!formData.offerStartDate && formData.offerEndDate)) {
          newErrors.offerEndDate = 'Both start and end dates must be set for an offer';
        }

        // Validate bulk pricing tiers
        if (formData.bulkPricingTiers.length > 0) {
          let lastMinQty = 0;
          
          formData.bulkPricingTiers.forEach((tier, index) => {
            const minQty = parseInt(tier.minQuantity);
            const discountValue = parseFloat(tier.discountValue);
            const tierErrors = [];
            
            if (!minQty || isNaN(minQty) || minQty <= 0) {
              tierErrors.push('Min quantity must be greater than 0');
            }
            
            if (minQty && minQty <= lastMinQty) {
              tierErrors.push('Min quantity must be greater than previous tier\'s min quantity');
            }
            
            if (!tier.discountType || !['percentage', 'fixed_amount', 'fixed_price'].includes(tier.discountType)) {
              tierErrors.push('Please select a valid discount type');
            }
            
            if (!discountValue || isNaN(discountValue) || discountValue < 0) {
              tierErrors.push('Discount value must be greater than or equal to 0');
            }
            
            if (tier.discountType === 'percentage' && discountValue > 100) {
              tierErrors.push('Percentage discount cannot exceed 100%');
            }
            
            if (tier.discountType === 'fixed_price' && discountValue >= parseFloat(formData.mrp)) {
              tierErrors.push('Fixed price must be less than MRP');
            }
            
            if (tier.discountType === 'fixed_amount' && discountValue >= parseFloat(formData.mrp)) {
              tierErrors.push('Fixed amount discount cannot exceed MRP');
            }
            
            if (tierErrors.length > 0) {
              if (!newErrors.bulkPricingTiers) newErrors.bulkPricingTiers = {};
              newErrors.bulkPricingTiers[index] = tierErrors;
            }
            
            if (minQty) lastMinQty = minQty;
          });
        }
        break;
      
      case 3: // Inventory Management
        if (!formData.stockQuantity || formData.stockQuantity === '' || parseInt(formData.stockQuantity) < 0) newErrors.stockQuantity = 'Stock quantity is required and cannot be negative';
        if (!formData.unitOfMeasurement) newErrors.unitOfMeasurement = 'Unit of measurement is required';
        break;
      
      case 4: // Media Gallery
        if (!formData.mainImageUrl.trim()) newErrors.mainImageUrl = 'Main product image is required';
        break;
      
      case 5: // Shipping & Logistics
        if (!formData.weightForShipping || formData.weightForShipping === '' || parseFloat(formData.weightForShipping) <= 0) newErrors.weightForShipping = 'Shipping weight is required and must be greater than 0';
        break;
      
      case 6: // Product Descriptions
        if (!formData.shortDescription.trim()) newErrors.shortDescription = 'Short description is required';
        else if (formData.shortDescription.length < 50) newErrors.shortDescription = 'Short description must be at least 50 characters';
        else if (formData.shortDescription.length > 300) newErrors.shortDescription = 'Short description must not exceed 300 characters';
        
        if (!formData.detailedDescription.trim()) newErrors.detailedDescription = 'Detailed description is required';
        else if (formData.detailedDescription.length < 200) newErrors.detailedDescription = 'Detailed description must be at least 200 characters';
        else if (formData.detailedDescription.length > 5000) newErrors.detailedDescription = 'Detailed description must not exceed 5000 characters';
        break;

      case 7: // Certifications & Compliance
        // FSSAI license validation if provided
        if (formData.fssaiLicense && !/^[0-9]{14}$/.test(formData.fssaiLicense)) {
          newErrors.fssaiLicense = 'FSSAI license must be 14 digits';
        }
        break;

      case 8: // SEO Optimization
        // Optional validations for SEO fields
        if (formData.metaTitle && formData.metaTitle.length > 60) {
          newErrors.metaTitle = 'Meta title must not exceed 60 characters';
        }
        if (formData.metaDescription && formData.metaDescription.length > 160) {
          newErrors.metaDescription = 'Meta description must not exceed 160 characters';
        }
        break;

      case 9: // Review & Publish
        // Final validation - check all required fields
        if (!formData.productTitle.trim()) newErrors.productTitle = 'Product title is required';
        if (!formData.brandName.trim() && !formData.customBrandName.trim()) newErrors.brandName = 'Brand name is required';
        if (!formData.categoryId) newErrors.categoryId = 'Category is required';
        if (!formData.mrp || formData.mrp <= 0) newErrors.mrp = 'MRP is required';
        if (!formData.sellingPrice || formData.sellingPrice <= 0) newErrors.sellingPrice = 'Selling price is required';
        if (!formData.stockQuantity || formData.stockQuantity < 0) newErrors.stockQuantity = 'Stock quantity is required';
        if (!formData.mainImageUrl.trim()) newErrors.mainImageUrl = 'Main product image is required';
        if (!formData.weightForShipping || formData.weightForShipping <= 0) newErrors.weightForShipping = 'Shipping weight is required';
        if (!formData.shortDescription.trim()) newErrors.shortDescription = 'Short description is required';
        if (!formData.detailedDescription.trim()) newErrors.detailedDescription = 'Detailed description is required';
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

  // Utility function to clean up URL strings
  const cleanupUrl = (url) => {
    if (!url) return '';
    
    // If it's already a clean URL, return it
    if (typeof url === 'string' && !url.includes('[') && !url.includes('"')) {
      return url;
    }
    
    try {
      // Try to parse if it's a JSON string
      let parsed = url;
      while (typeof parsed === 'string' && (parsed.includes('[') || parsed.includes('"'))) {
        const temp = JSON.parse(parsed);
        if (temp === parsed) break;
        parsed = temp;
      }
      
      // If we got an array, take the first valid URL
      if (Array.isArray(parsed)) {
        const cleanUrl = parsed.find(item => typeof item === 'string' && !item.includes('[') && !item.includes('"'));
        return cleanUrl || '';
      }
      
      // If we got a string, return it
      return typeof parsed === 'string' ? parsed : '';
    } catch {
      // If parsing fails, try to clean up the string manually
      return url.replace(/[\[\]"\\]/g, '');
    }
  };

  const transformFormData = (data) => {
    console.log('Transform data input:', {
      offerStartDate: data.offerStartDate,
      offerEndDate: data.offerEndDate,
      bulkPricingTiers: data.bulkPricingTiers
    });
    
    // Clean up gallery images
    const cleanGalleryImages = data.galleryImages
      .map(cleanupUrl)
      .filter(url => url.trim() !== '');
    
    const categoryId = data.categoryId && data.categoryId !== '' && !isNaN(parseInt(data.categoryId)) ? parseInt(data.categoryId) : null;
    
    console.log('Transformed IDs:', { categoryId });
    
    // Format dates to match backend's expected format
    const formatDate = (dateStr) => {
      if (!dateStr) {
        console.log('formatDate: No date provided');
        return null;
      }
      try {
        console.log('formatDate input:', dateStr);
        const date = new Date(dateStr);
        if (!(date instanceof Date) || isNaN(date)) {
          console.log('formatDate: Invalid date');
          return null;
        }
        const isoString = date.toISOString();
        console.log('formatDate output:', isoString);
        return isoString;
      } catch (e) {
        console.warn('Error formatting date:', e);
        return null;
      }
    };

    // Format date for LocalDate fields (restock date)
    const formatLocalDate = (dateStr) => {
      if (!dateStr) return null;
      try {
        const date = new Date(dateStr);
        if (!(date instanceof Date) || isNaN(date)) return null;
        // Format as YYYY-MM-DD for LocalDate
        return date.toISOString().split('T')[0];
      } catch (e) {
        console.warn('Error formatting local date:', e);
        return null;
      }
    };

    // Generate URL slug from product title
    const generateUrlSlug = (title) => {
      if (!title) return '';
      return title
        .toLowerCase()
        .replace(/[–—]/g, '-') // Replace en/em dashes with hyphens
        .replace(/[^a-z0-9-]/g, '-') // Replace any non-alphanumeric chars with hyphens
        .replace(/-+/g, '-') // Replace multiple consecutive hyphens with single hyphen
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    };

    // Transform bulk pricing tiers to match backend DTO structure
    const transformedBulkPricingTiers = data.bulkPricingTiers
      .filter(tier => {
        // Validate tier has all required fields
        const minQty = parseInt(tier.minQuantity);
        const discountValue = parseFloat(tier.discountValue);
        return !isNaN(minQty) && !isNaN(discountValue) && 
               minQty > 0 && discountValue >= 0 &&
               tier.discountType && ['percentage', 'fixed_amount', 'fixed_price'].includes(tier.discountType);
      })
      .map(tier => ({
        minQuantity: parseInt(tier.minQuantity),
        discountType: tier.discountType,
        discountValue: parseFloat(tier.discountValue)
      }))
      .sort((a, b) => a.minQuantity - b.minQuantity);

    // Transform the data to match the backend DTO structure
    const transformedData = {
      ...data,
      productTitle: data.productTitle?.trim(),
      categoryId: categoryId,
      bulkPricing: transformedBulkPricingTiers, // Changed from bulkPricingTiers to bulkPricing to match backend DTO
      offerStartDate: formatDate(data.offerStartDate),
      offerEndDate: formatDate(data.offerEndDate),
      // Convert numeric fields
      mrp: data.mrp && data.mrp !== '' ? parseFloat(data.mrp) : null,
      sellingPrice: data.sellingPrice && data.sellingPrice !== '' ? parseFloat(data.sellingPrice) : null,
      costPrice: data.costPrice && data.costPrice !== '' ? parseFloat(data.costPrice) : null,
      
      // Inventory Management fields
      stockQuantity: data.stockQuantity && data.stockQuantity !== '' ? parseInt(data.stockQuantity) : null,
      unitOfMeasurement: data.unitOfMeasurement || 'pieces',
      minimumOrderQuantity: data.minimumOrderQuantity && data.minimumOrderQuantity !== '' ? parseInt(data.minimumOrderQuantity) : 1,
      maximumOrderQuantity: data.maximumOrderQuantity && data.maximumOrderQuantity !== '' ? parseInt(data.maximumOrderQuantity) : null,
      lowStockAlert: data.lowStockAlert && data.lowStockAlert !== '' ? parseInt(data.lowStockAlert) : 10,
      trackQuantity: data.trackQuantity !== undefined ? data.trackQuantity : true,
      restockDate: formatLocalDate(data.restockDate),
      
      // Shipping & Logistics fields
      weightForShipping: data.weightForShipping && data.weightForShipping !== '' ? parseFloat(data.weightForShipping) : null,
      dimensions: data.dimensions && (data.dimensions.length || data.dimensions.width || data.dimensions.height) ? {
        length: data.dimensions.length && data.dimensions.length !== '' ? parseFloat(data.dimensions.length) : null,
        width: data.dimensions.width && data.dimensions.width !== '' ? parseFloat(data.dimensions.width) : null,
        height: data.dimensions.height && data.dimensions.height !== '' ? parseFloat(data.dimensions.height) : null,
        unit: 'cm'
      } : null,
      deliveryTimeEstimate: data.deliveryTimeEstimate || '3-5_days',
      shippingClass: data.shippingClass || 'STANDARD',
      coldStorageRequired: data.coldStorageRequired !== undefined ? data.coldStorageRequired : false,
      specialPackaging: data.specialPackaging !== undefined ? data.specialPackaging : false,
      insuranceRequired: data.insuranceRequired !== undefined ? data.insuranceRequired : false,
      freeShipping: data.freeShipping !== undefined ? data.freeShipping : false,
      freeShippingThreshold: data.freeShippingThreshold && data.freeShippingThreshold !== '' ? parseFloat(data.freeShippingThreshold) : null,
      isReturnable: data.isReturnable !== undefined ? data.isReturnable : true,
      returnWindow: data.returnWindow || 'SEVEN_DAYS',
      isCodAvailable: data.isCodAvailable !== undefined ? data.isCodAvailable : true,
      
      // Product Descriptions
      shortDescription: data.shortDescription?.trim(),
      detailedDescription: data.detailedDescription?.trim(),
      keyFeatures: data.keyFeatures.filter(feature => feature.trim() !== ''),
      productHighlights: data.productHighlights.filter(highlight => highlight.title?.trim() !== '' || highlight.description?.trim() !== '').map(highlight => ({
        title: highlight.title?.trim() || '',
        description: highlight.description?.trim() || '',
        icon: highlight.icon || ''
      })),
      
      // Certifications & Compliance
      fssaiLicense: data.fssaiLicense?.trim() || null,
      qualityCertifications: Array.isArray(data.qualityCertifications) ? 
        data.qualityCertifications.filter(cert => 
          cert && (cert.type || cert.certificateNumber || cert.certificateFileUrl)
        ).map(cert => ({
          type: cert.type || '',
          certificateNumber: cert.certificateNumber || '',
          certificateFileUrl: cert.certificateFileUrl || ''
        })) : [],
      
      // Clean up gallery images
      imageUrls: cleanGalleryImages,
      // Set URL slug
      urlSlug: isEditMode ? `${generateUrlSlug(data.productTitle)}-${Date.now()}` : generateUrlSlug(data.productTitle)
    };

    console.log('Raw form data dates:', {
      offerStartDate: data.offerStartDate,
      offerEndDate: data.offerEndDate
    });

    console.log('Transformed data:', {
      dates: {
        offerStartDate: transformedData.offerStartDate,
        offerEndDate: transformedData.offerEndDate,
        restockDate: transformedData.restockDate
      },
      inventory: {
        stockQuantity: transformedData.stockQuantity,
        unitOfMeasurement: transformedData.unitOfMeasurement,
        minimumOrderQuantity: transformedData.minimumOrderQuantity,
        maximumOrderQuantity: transformedData.maximumOrderQuantity,
        lowStockAlert: transformedData.lowStockAlert,
        trackQuantity: transformedData.trackQuantity
      },
      bulkPricing: transformedData.bulkPricingTiers
    });

    return transformedData;
  };

  const handleSubmit = async (isDraft = false) => {
    console.log('Submitting form with data:', {
      offerStartDate: formData.offerStartDate,
      offerEndDate: formData.offerEndDate,
      bulkPricingTiers: formData.bulkPricingTiers
    });
    
    try {
      setLoading(true);
      setErrors({});

      // Validate all steps if not a draft
      if (!isDraft) {
        let isValid = true;
        for (let step = 1; step <= totalSteps; step++) {
          if (!validateStep(step)) {
            isValid = false;
            setCurrentStep(step);
            break;
          }
        }

        if (!isValid) {
          // Scroll to the first error message
          const firstErrorElement = document.querySelector('.text-red-600');
          if (firstErrorElement) {
            firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          return;
        }
      }

      // Set status based on isDraft
      const finalFormData = {
        ...formData,
        status: isDraft ? 'DRAFT' : 'ACTIVE'
      };

      // Generate SKU if not provided
      if (!finalFormData.skuCode || finalFormData.skuCode.trim() === '') {
        try {
          const skuResponse = await vendorService.generateSku(vendorId, finalFormData.categoryId);
          if (skuResponse.success) {
            finalFormData.skuCode = skuResponse.data.sku;
          } else {
            throw new Error('Failed to generate SKU');
          }
        } catch (err) {
          console.error('Error generating SKU:', err);
          // Generate a fallback SKU
          const timestamp = Date.now().toString().slice(-4);
          const categoryCode = finalFormData.categoryId ? finalFormData.categoryId.toString().padStart(3, '0') : '001';
          finalFormData.skuCode = `GM${categoryCode}${timestamp}`;
        }
      }

      // Transform data for API
      const transformedData = transformFormData(finalFormData);
      
      console.log('Data being sent to API:', {
        url: isEditMode ? `/api/vendor/products/${productId}?vendorId=${vendorId}` : `/api/vendor/products?vendorId=${vendorId}`,
        method: isEditMode ? 'PUT' : 'POST',
        data: transformedData
      });

      // Submit to API - either create or update
      let response;
      if (isEditMode) {
        response = await vendorService.updateProduct(vendorId, productId, transformedData);
      } else {
        response = await vendorService.createProduct(vendorId, transformedData);
      }
      
      if (response.success) {
        navigate('/vendor/products', {
          state: { 
            message: `Product ${isEditMode ? 'updated' : (isDraft ? 'saved as draft' : 'published')} successfully` 
          }
        });
      } else {
        setErrors({ submit: response.message || `Failed to ${isEditMode ? 'update' : 'create'} product` });
      }
    } catch (err) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} product:`, err);
      setErrors({ submit: err.message || 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="overflow-x-auto">
        <div className="flex items-center justify-between min-w-max">
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
                  className={`w-8 sm:w-12 h-1 mx-2 ${
                    step < currentStep ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Step {currentStep}: {getStepTitle(currentStep)}
        </h2>
        <p className="text-gray-600 mt-1">{getStepDescription(currentStep)}</p>
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
      1: 'Enter basic product information like title, brand, category and product type',
      2: 'Set pricing including MRP, selling price, offers and bulk discounts',
      3: 'Manage inventory levels, stock settings and order quantities',
      4: 'Upload product images, videos and add image descriptions for SEO',
      5: 'Configure shipping weight, dimensions, delivery options and return policies',
      6: 'Write compelling descriptions, key features and product highlights',
      7: 'Add FSSAI license and other quality certifications with images',
      8: 'Optimize product for search engines with meta tags and keywords',
      9: 'Review all product information and choose publishing status'
    };
    return descriptions[step];
  };

  const renderBasicInformation = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.productTitle}
            onChange={(e) => handleInputChange('productTitle', e.target.value)}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 ${
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
            Brand Name <span className="text-red-500">*</span>
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
              className={`flex-1 px-3 py-2 border rounded-l-md focus:ring-green-500 focus:border-green-500 ${
                errors.skuCode ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter or generate SKU (e.g., GMFR0011234)"
            />
            <button
              type="button"
              onClick={generateSku}
              className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200"
            >
              Generate
            </button>
          </div>
          {errors.skuCode && (
            <p className="mt-1 text-sm text-red-600">{errors.skuCode}</p>
          )}
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
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.categoryId}
            onChange={(e) => {
              console.log('Category selected:', e.target.value);
              handleInputChange('categoryId', e.target.value);
            }}
            className={`w-full px-3 py-2 border rounded-md focus:ring-green-500 focus:border-green-500 ${
              errors.categoryId ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select Category</option>
            {Object.entries(categories).map(([key, category]) => {
              console.log('Category option:', key, category);
              return <option key={key} value={key}>{category.name}</option>;
            })}
          </select>
          {errors.categoryId && (
            <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
          )}
        </div>


      </div>
    </div>
  );

  const renderPricingStrategy = () => {
    console.log('=== RENDER PRICING STRATEGY ===');
    console.log('Current formData state:', {
      offerStartDate: formData.offerStartDate,
      offerEndDate: formData.offerEndDate,
      bulkPricingTiers: formData.bulkPricingTiers,
      bulkPricingTiersLength: formData.bulkPricingTiers?.length
    });
    
    return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            MRP (Maximum Retail Price) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
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
            Selling Price <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
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
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
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
            value={formData.offerStartDate || ''}
            onChange={(e) => {
              console.log('=== OFFER START DATE CHANGE ===');
              console.log('Event target value:', e.target.value);
              console.log('Current formData.offerStartDate:', formData.offerStartDate);
              handleInputChange('offerStartDate', e.target.value);
              console.log('After handleInputChange call');
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          />
          {errors.offerStartDate && (
            <p className="mt-1 text-sm text-red-600">{errors.offerStartDate}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Offer End Date
          </label>
          <input
            type="datetime-local"
            value={formData.offerEndDate || ''}
            onChange={(e) => {
              console.log('=== OFFER END DATE CHANGE ===');
              console.log('Event target value:', e.target.value);
              console.log('Current formData.offerEndDate:', formData.offerEndDate);
              handleInputChange('offerEndDate', e.target.value);
              console.log('After handleInputChange call');
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          />
          {errors.offerEndDate && (
            <p className="mt-1 text-sm text-red-600">{errors.offerEndDate}</p>
          )}
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
            onClick={() => {
              console.log('=== ADD BULK PRICING TIER ===');
              console.log('Current bulkPricingTiers:', formData.bulkPricingTiers);
              handleArrayAdd('bulkPricingTiers', {
                minQuantity: '',
                discountType: 'percentage',
                discountValue: ''
              });
              console.log('After handleArrayAdd call');
            }}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
          >
            <FiPlus className="mr-1 h-4 w-4" />
            Add Tier
          </button>
        </div>
        
        {formData.bulkPricingTiers && formData.bulkPricingTiers.length > 0 ? (
          formData.bulkPricingTiers.map((tier, index) => {
            console.log(`=== RENDERING TIER ${index} ===`, tier);
            return (
              <div key={index} className="space-y-2 mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Min Qty"
                      value={tier.minQuantity || ''}
                      onChange={(e) => {
                        console.log(`=== TIER ${index} MIN QTY CHANGE ===`);
                        console.log('New value:', e.target.value);
                        console.log('Current tier:', tier);
                        handleArrayUpdate('bulkPricingTiers', index, { ...tier, minQuantity: e.target.value });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div className="flex-1">
                    <select
                      value={tier.discountType || 'percentage'}
                      onChange={(e) => {
                        handleArrayUpdate('bulkPricingTiers', index, { ...tier, discountType: e.target.value });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="percentage">Percentage Off</option>
                      <option value="fixed_amount">Fixed Amount Off</option>
                      <option value="fixed_price">Fixed Price</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      step="0.01"
                      placeholder={tier.discountType === 'percentage' ? 'Discount %' : 'Amount'}
                      value={tier.discountValue || ''}
                      onChange={(e) => {
                        handleArrayUpdate('bulkPricingTiers', index, { ...tier, discountValue: e.target.value });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      console.log(`=== REMOVE TIER ${index} ===`);
                      handleArrayRemove('bulkPricingTiers', index);
                    }}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  {tier.discountType === 'percentage' ? 
                    `${tier.discountValue || 0}% off for orders of ${tier.minQuantity || 0}+ units` :
                    tier.discountType === 'fixed_amount' ?
                    `₹${tier.discountValue || 0} off for orders of ${tier.minQuantity || 0}+ units` :
                    `Fixed price of ₹${tier.discountValue || 0} for orders of ${tier.minQuantity || 0}+ units`
                  }
                </p>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-gray-500">No bulk pricing tiers added yet.</p>
        )}
      </div>
    </div>
  );
  };

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
            value={formData.lowStockAlert}
            onChange={(e) => handleInputChange('lowStockAlert', e.target.value)}
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

  // Media Gallery (Section 4)
  const renderMediaGallery = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Main Product Image *
          </label>
          <div className="relative">
            <FiImage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="url"
              value={formData.mainImageUrl}
              onChange={(e) => handleInputChange('mainImageUrl', e.target.value)}
              className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-green-500 focus:border-green-500 ${
                errors.mainImageUrl ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          {errors.mainImageUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.mainImageUrl}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">Square format (1:1) recommended. Min 800x800px</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Video URL
          </label>
          <input
            type="url"
            value={formData.videoUrl}
            onChange={(e) => handleInputChange('videoUrl', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            placeholder="https://youtube.com/watch?v=..."
          />
          <p className="mt-1 text-sm text-gray-500">YouTube or Vimeo video link</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Gallery Images (Max 6)
        </label>
        <div className="space-y-2">
          {formData.galleryImages.map((image, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="url"
                value={image}
                onChange={(e) => handleArrayUpdate('galleryImages', index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                placeholder="https://example.com/gallery-image.jpg"
              />
              <button
                type="button"
                onClick={() => handleArrayRemove('galleryImages', index)}
                className="p-2 text-red-600 hover:text-red-800"
              >
                <FiMinus className="h-4 w-4" />
              </button>
            </div>
          ))}
          {formData.galleryImages.length < 6 && (
            <button
              type="button"
              onClick={() => handleArrayAdd('galleryImages', '')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <FiPlus className="mr-2 h-4 w-4" />
              Add Gallery Image
            </button>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image Alt Tags (for SEO)
        </label>
        <div className="space-y-2">
          {formData.imageAltTags.map((tag, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={tag}
                onChange={(e) => handleArrayUpdate('imageAltTags', index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                placeholder="Describe the image for accessibility"
                maxLength={100}
              />
              <button
                type="button"
                onClick={() => handleArrayRemove('imageAltTags', index)}
                className="p-2 text-red-600 hover:text-red-800"
              >
                <FiMinus className="h-4 w-4" />
              </button>
            </div>
          ))}
          {formData.imageAltTags.length < 6 && (
            <button
              type="button"
              onClick={() => handleArrayAdd('imageAltTags', '')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <FiPlus className="mr-2 h-4 w-4" />
              Add Alt Tag ({6 - formData.imageAltTags.length} remaining)
            </button>
          )}
          <p className="mt-1 text-sm text-gray-500">Add up to 6 alt tags to improve SEO and accessibility</p>
        </div>
      </div>
    </div>
  );

  // Shipping & Logistics (Section 5)
  const renderShippingLogistics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shipping Weight (kg) *
          </label>
          <div className="relative">
            <FiTruck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              step="0.01"
              min="0.01"
              max="50"
              value={formData.weightForShipping}
              onChange={(e) => handleInputChange('weightForShipping', e.target.value)}
              className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-green-500 focus:border-green-500 ${
                errors.weightForShipping ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0.50"
            />
          </div>
          {errors.weightForShipping && (
            <p className="mt-1 text-sm text-red-600">{errors.weightForShipping}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Package Dimensions (cm)
          </label>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="number"
              value={formData.dimensions?.length || ''}
              onChange={(e) => handleInputChange('dimensions', {...(formData.dimensions || {}), length: e.target.value})}
              className="px-2 py-2 border border-gray-300 rounded-md text-sm focus:ring-green-500 focus:border-green-500"
              placeholder="L"
            />
            <input
              type="number"
              value={formData.dimensions?.width || ''}
              onChange={(e) => handleInputChange('dimensions', {...(formData.dimensions || {}), width: e.target.value})}
              className="px-2 py-2 border border-gray-300 rounded-md text-sm focus:ring-green-500 focus:border-green-500"
              placeholder="W"
            />
            <input
              type="number"
              value={formData.dimensions?.height || ''}
              onChange={(e) => handleInputChange('dimensions', {...(formData.dimensions || {}), height: e.target.value})}
              className="px-2 py-2 border border-gray-300 rounded-md text-sm focus:ring-green-500 focus:border-green-500"
              placeholder="H"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Delivery Time *
          </label>
          <select
            value={formData.deliveryTimeEstimate}
            onChange={(e) => handleInputChange('deliveryTimeEstimate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          >
            <option value="same_day">Same Day (within city)</option>
            <option value="next_day">Next Day</option>
            <option value="2-3_days">2-3 Business Days</option>
            <option value="3-5_days">3-5 Business Days</option>
            <option value="5-7_days">5-7 Business Days</option>
            <option value="7-10_days">1-2 Weeks</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Shipping Class
        </label>
        <select
          value={formData.shippingClass}
          onChange={(e) => handleInputChange('shippingClass', e.target.value)}
          className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
        >
          <option value="STANDARD">Standard Items</option>
          <option value="FRAGILE">Fragile Items</option>
          <option value="PERISHABLE">Perishable/Fresh Items</option>
          <option value="LIQUID">Liquid Items</option>
          <option value="OVERSIZED">Oversized Items</option>
          <option value="HAZARDOUS">Hazardous Materials</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Special Requirements */}
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.coldStorageRequired}
            onChange={(e) => handleInputChange('coldStorageRequired', e.target.checked)}
            className="h-4 w-4 text-green-600 rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">Cold Storage Required</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.specialPackaging}
            onChange={(e) => handleInputChange('specialPackaging', e.target.checked)}
            className="h-4 w-4 text-green-600 rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">Special Packaging</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.insuranceRequired}
            onChange={(e) => handleInputChange('insuranceRequired', e.target.checked)}
            className="h-4 w-4 text-green-600 rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">Insurance Required</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.freeShipping}
            onChange={(e) => handleInputChange('freeShipping', e.target.checked)}
            className="h-4 w-4 text-green-600 rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">Offer Free Shipping</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.isReturnable}
            onChange={(e) => handleInputChange('isReturnable', e.target.checked)}
            className="h-4 w-4 text-green-600 rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">Allow Returns</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.isCodAvailable}
            onChange={(e) => handleInputChange('isCodAvailable', e.target.checked)}
            className="h-4 w-4 text-green-600 rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">Cash on Delivery</span>
        </label>
      </div>

      {formData.freeShipping && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Free Shipping Threshold (₹)
          </label>
          <input
            type="number"
            value={formData.freeShippingThreshold}
            onChange={(e) => handleInputChange('freeShippingThreshold', e.target.value)}
            className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            placeholder="500"
          />
        </div>
      )}

      {formData.isReturnable && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Return Window
          </label>
          <select
            value={formData.returnWindow}
            onChange={(e) => handleInputChange('returnWindow', e.target.value)}
            className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          >
            <option value="SEVEN_DAYS">7 Days</option>
            <option value="FIFTEEN_DAYS">15 Days</option>
            <option value="THIRTY_DAYS">30 Days</option>
          </select>
        </div>
      )}
         </div>
   );

   // Product Descriptions (Section 6)
   const renderProductDescriptions = () => (
     <div className="space-y-6">
       <div className="grid grid-cols-1 gap-6">
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">
             Short Description * (50-300 characters)
           </label>
           <div className="relative">
             <FiFileText className="absolute left-3 top-3 text-gray-400" />
             <textarea
               value={formData.shortDescription}
               onChange={(e) => handleInputChange('shortDescription', e.target.value)}
               className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-green-500 focus:border-green-500 ${
                 errors.shortDescription ? 'border-red-300' : 'border-gray-300'
               }`}
               rows={3}
               minLength={50}
               maxLength={300}
               placeholder="Brief, compelling description shown in product listings..."
             />
           </div>
           <div className="flex justify-between mt-1">
             {errors.shortDescription && (
               <p className="text-sm text-red-600">{errors.shortDescription}</p>
             )}
             <p className="text-sm text-gray-500 ml-auto">{formData.shortDescription.length}/300</p>
           </div>
         </div>

         <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">
             Detailed Description * (200-5000 characters)
           </label>
           <textarea
             value={formData.detailedDescription}
             onChange={(e) => handleInputChange('detailedDescription', e.target.value)}
             className={`w-full px-3 py-2 border rounded-md focus:ring-green-500 focus:border-green-500 ${
               errors.detailedDescription ? 'border-red-300' : 'border-gray-300'
             }`}
             rows={8}
             minLength={200}
             maxLength={5000}
             placeholder="Comprehensive product information for informed buying decisions. Include benefits, usage instructions, care instructions, etc."
           />
           <div className="flex justify-between mt-1">
             {errors.detailedDescription && (
               <p className="text-sm text-red-600">{errors.detailedDescription}</p>
             )}
             <p className="text-sm text-gray-500 ml-auto">{formData.detailedDescription.length}/5000</p>
           </div>
         </div>

         <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">
             Key Features (Max 10)
           </label>
           <div className="space-y-2">
             {formData.keyFeatures.map((feature, index) => (
               <div key={index} className="flex items-center space-x-2">
                 <input
                   type="text"
                   value={feature}
                   onChange={(e) => handleArrayUpdate('keyFeatures', index, e.target.value)}
                   className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                   placeholder="e.g., Organic, Chemical-free, Farm fresh"
                 />
                 <button
                   type="button"
                   onClick={() => handleArrayRemove('keyFeatures', index)}
                   className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                 >
                   <FiMinus className="h-4 w-4" />
                 </button>
               </div>
             ))}
             {formData.keyFeatures.length < 10 && (
               <button
                 type="button"
                 onClick={() => handleArrayAdd('keyFeatures', '')}
                 className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
               >
                 <FiPlus className="mr-2 h-4 w-4" />
                 Add Feature
               </button>
             )}
           </div>
         </div>

         <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">
             Product Highlights (Max 6)
           </label>
           <div className="space-y-3">
             {formData.productHighlights.map((highlight, index) => (
               <div key={index} className="border border-gray-200 rounded-lg p-4">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                   <input
                     type="text"
                     value={highlight.title || ''}
                     onChange={(e) => handleArrayUpdate('productHighlights', index, {...highlight, title: e.target.value})}
                     className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                     placeholder="Highlight Title (max 30 chars)"
                     maxLength={30}
                   />
                   <input
                     type="text"
                     value={highlight.description || ''}
                     onChange={(e) => handleArrayUpdate('productHighlights', index, {...highlight, description: e.target.value})}
                     className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                     placeholder="Description (max 100 chars)"
                     maxLength={100}
                   />
                   <button
                     type="button"
                     onClick={() => handleArrayRemove('productHighlights', index)}
                     className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                   >
                     Remove
                   </button>
                 </div>
               </div>
             ))}
             {formData.productHighlights.length < 6 && (
               <button
                 type="button"
                 onClick={() => handleArrayAdd('productHighlights', {title: '', description: '', icon: ''})}
                 className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
               >
                 <FiPlus className="mr-2 h-4 w-4" />
                 Add Highlight
               </button>
             )}
           </div>
         </div>


       </div>
     </div>
   );

   // Certifications & Compliance (Section 7)
   const renderCertificationsCompliance = () => (
     <div className="space-y-6">
       <div>
         <label className="block text-sm font-medium text-gray-700 mb-2">
           FSSAI License Number
           <span className="text-sm font-normal text-gray-500">(Required for food products)</span>
         </label>
         <div className="relative">
           <FiShield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
           <input
             type="text"
             value={formData.fssaiLicense || ''}
             onChange={(e) => handleInputChange('fssaiLicense', e.target.value)}
             className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-green-500 focus:border-green-500 ${
               errors.fssaiLicense ? 'border-red-300' : 'border-gray-300'
             }`}
             placeholder="14-digit FSSAI license number"
             pattern="[0-9]{14}"
             maxLength={14}
           />
         </div>
         {errors.fssaiLicense && (
           <p className="mt-1 text-sm text-red-600">{errors.fssaiLicense}</p>
         )}
       </div>

       <div>
         <label className="block text-sm font-medium text-gray-700 mb-2">
           Other Certifications (Quality Check Lab Test, ISI, etc.)
         </label>
         <div className="space-y-3">
           {Array.isArray(formData.qualityCertifications) && formData.qualityCertifications.map((cert, index) => (
             <div key={index} className="border border-gray-200 rounded-lg p-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                 <select
                   value={cert?.type || ''}
                   onChange={(e) => handleArrayUpdate('qualityCertifications', index, {...(cert || {}), type: e.target.value})}
                   className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                 >
                   <option value="">Select Certificate Type</option>
                   <option value="quality_check_lab">Quality Check Lab Test</option>
                   <option value="isi">ISI Mark</option>
                   <option value="iso_22000">ISO 22000 (Food Safety)</option>
                   <option value="haccp">HACCP</option>
                   <option value="gmp">Good Manufacturing Practice</option>
                   <option value="halal">Halal Certified</option>
                   <option value="jain_friendly">Jain Friendly</option>
                   <option value="vegan">Vegan Certified</option>
                   <option value="fair_trade">Fair Trade Certified</option>
                   <option value="organic">Organic Certification</option>
                   <option value="other">Other</option>
                 </select>
                 <input
                   type="text"
                   value={cert?.certificateNumber || ''}
                   onChange={(e) => handleArrayUpdate('qualityCertifications', index, {...(cert || {}), certificateNumber: e.target.value})}
                   className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                   placeholder="Certificate Number"
                 />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 <input
                   type="url"
                   value={cert?.certificateFileUrl || ''}
                   onChange={(e) => handleArrayUpdate('qualityCertifications', index, {...(cert || {}), certificateFileUrl: e.target.value})}
                   className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                   placeholder="Certificate Image URL (https://...)"
                 />
                 <button
                   type="button"
                   onClick={() => handleArrayRemove('qualityCertifications', index)}
                   className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                 >
                   Remove
                 </button>
               </div>
               {cert?.certificateFileUrl && (
                 <div className="mt-3">
                   <img
                     src={cert.certificateFileUrl}
                     alt="Certificate Preview"
                     className="max-w-xs h-24 object-cover rounded border"
                     onError={(e) => {
                       e.target.style.display = 'none';
                     }}
                   />
                 </div>
               )}
             </div>
           ))}
           <button
             type="button"
             onClick={() => handleArrayAdd('qualityCertifications', {type: '', certificateNumber: '', certificateFileUrl: ''})}
             className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
           >
             <FiPlus className="mr-2 h-4 w-4" />
             Add Certification
           </button>
         </div>
       </div>
     </div>
   );

   // SEO Optimization (Section 8)
   const renderSeoOptimization = () => (
     <div className="space-y-8">
       <div className="bg-white p-6 rounded-lg border border-gray-200">
         <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Optimization</h3>
         
         {/* URL Slug */}
         <div className="mb-6">
           <label className="block text-sm font-medium text-gray-700 mb-2">
             Custom URL Slug
             <span className="ml-1 text-gray-400">(Optional)</span>
           </label>
           <div className="flex items-center">
             <span className="text-sm text-gray-500 mr-2">https://greenmagic.com/products/</span>
             <input
               type="text"
               value={formData.urlSlug}
               onChange={(e) => handleInputChange('urlSlug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-'))}
               className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
               placeholder="your-custom-product-url"
               maxLength={100}
             />
           </div>
           <p className="mt-2 text-sm text-gray-500">
             By default, we'll generate a URL from your product title. You can provide a custom URL here if you want something different.
             Use only lowercase letters, numbers, and hyphens.
           </p>
           {errors.urlSlug && (
             <p className="mt-1 text-sm text-red-600">{errors.urlSlug}</p>
           )}
         </div>

         {/* Meta Title */}
         <div className="mb-6">
           <label className="block text-sm font-medium text-gray-700 mb-2">
             Meta Title
             <span className="text-gray-400 ml-1">(Recommended)</span>
           </label>
           <input
             type="text"
             value={formData.metaTitle}
             onChange={(e) => handleInputChange('metaTitle', e.target.value)}
             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
             placeholder="Enter SEO title (max 60 characters)"
             maxLength={60}
           />
           <p className="mt-1 text-sm text-gray-500">
             {formData.metaTitle ? `${formData.metaTitle.length}/60 characters` : '0/60 characters'}
           </p>
         </div>

         {/* Meta Description */}
         <div className="mb-6">
           <label className="block text-sm font-medium text-gray-700 mb-2">
             Meta Description
             <span className="text-gray-400 ml-1">(Recommended)</span>
           </label>
           <textarea
             value={formData.metaDescription}
             onChange={(e) => handleInputChange('metaDescription', e.target.value)}
             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
             rows={3}
             placeholder="Enter SEO description (max 160 characters)"
             maxLength={160}
           />
           <p className="mt-1 text-sm text-gray-500">
             {formData.metaDescription ? `${formData.metaDescription.length}/160 characters` : '0/160 characters'}
           </p>
         </div>

         {/* Search Keywords */}
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">
             Search Keywords
             <span className="text-gray-400 ml-1">(Optional)</span>
           </label>
           <div className="space-y-2">
             {formData.searchKeywords.map((keyword, index) => (
               <div key={index} className="flex items-center">
                 <input
                   type="text"
                   value={keyword}
                   onChange={(e) => handleArrayUpdate('searchKeywords', index, e.target.value)}
                   className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                   placeholder="Enter a keyword"
                 />
                 <button
                   type="button"
                   onClick={() => handleArrayRemove('searchKeywords', index)}
                   className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-md"
                 >
                   <FiMinus className="h-4 w-4" />
                 </button>
               </div>
             ))}
             <button
               type="button"
               onClick={() => handleArrayAdd('searchKeywords')}
               className="flex items-center text-green-600 hover:text-green-700"
             >
               <FiPlus className="h-4 w-4 mr-1" />
               Add Keyword
             </button>
           </div>
           <p className="mt-2 text-sm text-gray-500">Add keywords to help customers find your product</p>
         </div>
       </div>
     </div>
   );

   // Review & Publish (Section 9)
   const renderReviewPublish = () => (
     <div className="space-y-8">
       <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
         <h3 className="text-lg font-medium text-blue-900 mb-4">Review Your Product</h3>
         <p className="text-blue-700 mb-4">Please review all the information before publishing your product.</p>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
           <div>
             <h4 className="font-medium text-gray-900 mb-2">Basic Information</h4>
             <dl className="space-y-1">
               <div className="flex justify-between">
                 <dt className="text-gray-600">Product Title:</dt>
                 <dd className="text-gray-900">{formData.productTitle || 'Not set'}</dd>
               </div>
               <div className="flex justify-between">
                 <dt className="text-gray-600">Brand:</dt>
                 <dd className="text-gray-900">{formData.brandName || formData.customBrandName || 'Not set'}</dd>
               </div>
               <div className="flex justify-between">
                 <dt className="text-gray-600">SKU:</dt>
                 <dd className="text-gray-900">{formData.skuCode || 'Auto-generated'}</dd>
               </div>
             </dl>
           </div>

           <div>
             <h4 className="font-medium text-gray-900 mb-2">Pricing</h4>
             <dl className="space-y-1">
               <div className="flex justify-between">
                 <dt className="text-gray-600">MRP:</dt>
                 <dd className="text-gray-900">₹{formData.mrp || '0'}</dd>
               </div>
               <div className="flex justify-between">
                 <dt className="text-gray-600">Selling Price:</dt>
                 <dd className="text-gray-900">₹{formData.sellingPrice || '0'}</dd>
               </div>
               <div className="flex justify-between">
                 <dt className="text-gray-600">Stock:</dt>
                 <dd className="text-gray-900">{formData.stockQuantity || '0'} {formData.unitOfMeasurement}</dd>
               </div>
             </dl>
           </div>
         </div>
       </div>

       <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
         <h3 className="text-lg font-medium text-yellow-900 mb-2">Important Notes</h3>
         <ul className="text-yellow-700 space-y-1 text-sm">
           <li>• Once published, your product will be visible to customers</li>
           <li>• You can always edit product details later</li>
           <li>• Make sure all required fields are filled correctly</li>
           <li>• Product images should be high quality and represent the actual product</li>
         </ul>
       </div>

       <div>
         <label className="block text-sm font-medium text-gray-700 mb-2">
           Product Status
         </label>
         <select
           value={formData.status}
           onChange={(e) => handleInputChange('status', e.target.value)}
           className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
         >
           <option value="DRAFT">Save as Draft</option>
           <option value="ACTIVE">Publish Immediately</option>
         </select>
         <p className="mt-1 text-sm text-gray-500">
           {formData.status === 'DRAFT' ? 'Product will be saved but not visible to customers' : 'Product will be immediately available for purchase'}
         </p>
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
        return renderMediaGallery();
      case 5:
        return renderShippingLogistics();
      case 6:
        return renderProductDescriptions();
      case 7:
        return renderCertificationsCompliance();
      case 8:
        return renderSeoOptimization();
      case 9:
        return renderReviewPublish();
      default:
        return renderBasicInformation();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEditMode ? 'Edit Product' : 'Add New Product'}
              </h1>
              <p className="text-gray-600 mt-2">
                {isEditMode 
                  ? 'Update your product details and information' 
                  : 'Create a new product listing for your store'
                }
              </p>
            </div>
            <button
              onClick={() => navigate('/vendor/products')}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
            >
              <FiX className="mr-2 h-4 w-4 inline" />
              Cancel
            </button>
          </div>
        </div>

        {/* Loading state for fetching existing product data */}
        {initialLoading && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mr-3"></div>
              <span className="text-lg text-gray-600">Loading product data...</span>
            </div>
          </div>
        )}

        {/* Error state for fetching product data */}
        {errors.fetch && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Failed to Load Product Data</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{errors.fetch}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => navigate('/vendor/products')}
                    className="text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded-md"
                  >
                    Back to Products
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step Indicator */}
        {!initialLoading && !errors.fetch && renderStepIndicator()}

        {/* Form */}
        {!initialLoading && !errors.fetch && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {renderCurrentStep()}

        {/* Navigation Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            Previous
          </button>

          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            {currentStep === totalSteps && (
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                disabled={loading}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 disabled:opacity-50 w-full sm:w-auto"
              >
                <FiSave className="mr-2 h-4 w-4 inline" />
                Save as Draft
              </button>
            )}

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 font-medium w-full sm:w-auto"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSubmit(false)}
                disabled={loading}
                className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 font-medium disabled:opacity-50 w-full sm:w-auto"
              >
                <FiSave className="mr-2 h-4 w-4 inline" />
                {loading 
                  ? (isEditMode ? 'Updating...' : 'Publishing...') 
                  : (isEditMode ? 'Update Product' : 'Publish Product')
                }
              </button>
            )}
          </div>
        </div>

        {/* Error Display */}
        {errors.submit && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {errors.submit.includes('URL slug') ? 'Product Name Already Exists' : 'Error'}
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  {errors.submit.includes('URL slug') ? (
                    <div>
                      <p>A product with this name already exists. You can:</p>
                      <ul className="list-disc list-inside mt-2">
                        <li>Use a different product name</li>
                        <li>Add unique identifiers to your product name (e.g., size, brand, or variant)</li>
                        <li>Provide a custom URL slug in the SEO section</li>
                      </ul>
                    </div>
                  ) : (
                    <p>{errors.submit}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
        )}
      </div>
    </div>
  );
};

export default ProductAdd;
