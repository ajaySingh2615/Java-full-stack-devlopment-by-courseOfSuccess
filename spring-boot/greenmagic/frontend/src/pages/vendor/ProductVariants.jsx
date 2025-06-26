import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Plus, 
  Minus, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  Copy,
  Package,
  DollarSign,
  Image as ImageIcon,
  AlertTriangle,
  CheckCircle,
  Eye,
  Upload,
  Grid3X3,
  Tag,
  Settings
} from 'lucide-react';

/**
 * Product Variants Management Component - Phase 2
 * 
 * Advanced variant system for managing product attributes and combinations
 * Supports size, weight, color, flavor and custom attributes
 */
const ProductVariants = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Product and variants state
  const [product, setProduct] = useState(null);
  const [attributes, setAttributes] = useState([]);
  const [variants, setVariants] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [showBulkEdit, setShowBulkEdit] = useState(false);

  // Bulk edit state
  const [bulkEditData, setBulkEditData] = useState({
    priceAdjustment: { type: 'none', value: 0 },
    stockUpdate: { type: 'none', value: 0 },
    status: 'no_change'
  });

  // Common attribute templates
  const attributeTemplates = {
    size: {
      name: 'Size',
      values: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    },
    weight: {
      name: 'Weight',
      values: ['250g', '500g', '1kg', '2kg', '5kg']
    },
    color: {
      name: 'Color',
      values: ['Red', 'Green', 'Blue', 'Yellow', 'White', 'Black']
    },
    flavor: {
      name: 'Flavor',
      values: ['Original', 'Spicy', 'Sweet', 'Mild', 'Extra Hot']
    },
    pack_size: {
      name: 'Pack Size',
      values: ['Single', 'Pack of 2', 'Pack of 5', 'Pack of 10']
    }
  };

  useEffect(() => {
    loadProductData();
  }, [productId]);

  const loadProductData = async () => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock product data
      const mockProduct = {
        id: productId,
        title: 'Organic Basmati Rice Premium Quality',
        category: 'organic_grains',
        subcategory: 'rice',
        basePrice: 299,
        baseMrp: 349,
        baseStock: 100,
        productType: 'variable'
      };

      // Mock attributes
      const mockAttributes = [
        {
          id: 1,
          name: 'Weight',
          values: ['1kg', '2kg', '5kg', '10kg']
        },
        {
          id: 2,
          name: 'Quality',
          values: ['Premium', 'Super Premium']
        }
      ];

      // Generate variants from attributes
      const mockVariants = generateVariantCombinations(mockAttributes, mockProduct);

      setProduct(mockProduct);
      setAttributes(mockAttributes);
      setVariants(mockVariants);
    } catch (error) {
      console.error('Error loading product data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateVariantCombinations = (attrs, baseProduct) => {
    if (attrs.length === 0) return [];

    const combinations = [];
    const generateCombos = (current, index) => {
      if (index === attrs.length) {
        combinations.push([...current]);
        return;
      }

      for (const value of attrs[index].values) {
        current.push({ attribute: attrs[index].name, value });
        generateCombos(current, index + 1);
        current.pop();
      }
    };

    generateCombos([], 0);

    return combinations.map((combo, index) => {
      const variantName = combo.map(c => c.value).join(' / ');
      const priceMultiplier = calculatePriceMultiplier(combo);
      
      return {
        id: `variant_${index + 1}`,
        name: variantName,
        attributes: combo,
        sku: `${baseProduct.id}_${index + 1}`,
        price: Math.round(baseProduct.basePrice * priceMultiplier),
        mrp: Math.round(baseProduct.baseMrp * priceMultiplier),
        stock: Math.floor(baseProduct.baseStock / combinations.length),
        status: 'ACTIVE',
        image: null,
        weight: getWeightFromCombo(combo),
        enabled: true
      };
    });
  };

  const calculatePriceMultiplier = (combo) => {
    let multiplier = 1;
    
    combo.forEach(attr => {
      // Price adjustments based on attributes
      if (attr.attribute === 'Weight') {
        switch (attr.value) {
          case '1kg': multiplier *= 1; break;
          case '2kg': multiplier *= 1.8; break;
          case '5kg': multiplier *= 4.2; break;
          case '10kg': multiplier *= 8; break;
        }
      }
      if (attr.attribute === 'Quality') {
        switch (attr.value) {
          case 'Premium': multiplier *= 1; break;
          case 'Super Premium': multiplier *= 1.3; break;
        }
      }
    });
    
    return multiplier;
  };

  const getWeightFromCombo = (combo) => {
    const weightAttr = combo.find(c => c.attribute === 'Weight');
    return weightAttr ? weightAttr.value : '1kg';
  };

  const addAttribute = () => {
    const newAttribute = {
      id: Date.now(),
      name: '',
      values: ['']
    };
    setAttributes([...attributes, newAttribute]);
  };

  const updateAttribute = (id, field, value) => {
    setAttributes(attributes.map(attr => 
      attr.id === id ? { ...attr, [field]: value } : attr
    ));
  };

  const addAttributeValue = (attributeId) => {
    setAttributes(attributes.map(attr => 
      attr.id === attributeId 
        ? { ...attr, values: [...attr.values, ''] }
        : attr
    ));
  };

  const updateAttributeValue = (attributeId, valueIndex, value) => {
    setAttributes(attributes.map(attr => 
      attr.id === attributeId 
        ? { 
            ...attr, 
            values: attr.values.map((v, i) => i === valueIndex ? value : v)
          }
        : attr
    ));
  };

  const removeAttributeValue = (attributeId, valueIndex) => {
    setAttributes(attributes.map(attr => 
      attr.id === attributeId 
        ? { ...attr, values: attr.values.filter((_, i) => i !== valueIndex) }
        : attr
    ));
  };

  const removeAttribute = (id) => {
    setAttributes(attributes.filter(attr => attr.id !== id));
  };

  const updateVariant = (variantId, field, value) => {
    setVariants(variants.map(variant => 
      variant.id === variantId ? { ...variant, [field]: value } : variant
    ));
  };

  const toggleVariantEnabled = (variantId) => {
    setVariants(variants.map(variant => 
      variant.id === variantId 
        ? { ...variant, enabled: !variant.enabled }
        : variant
    ));
  };

  const regenerateVariants = () => {
    if (attributes.length === 0) {
      setVariants([]);
      return;
    }

    const newVariants = generateVariantCombinations(attributes, product);
    setVariants(newVariants);
  };

  const handleBulkEdit = () => {
    if (selectedVariants.length === 0) return;

    const updatedVariants = variants.map(variant => {
      if (!selectedVariants.includes(variant.id)) return variant;

      let updatedVariant = { ...variant };

      // Price adjustment
      if (bulkEditData.priceAdjustment.type !== 'none') {
        const adjustment = parseFloat(bulkEditData.priceAdjustment.value);
        switch (bulkEditData.priceAdjustment.type) {
          case 'percentage_increase':
            updatedVariant.price = Math.round(variant.price * (1 + adjustment / 100));
            updatedVariant.mrp = Math.round(variant.mrp * (1 + adjustment / 100));
            break;
          case 'percentage_decrease':
            updatedVariant.price = Math.round(variant.price * (1 - adjustment / 100));
            updatedVariant.mrp = Math.round(variant.mrp * (1 - adjustment / 100));
            break;
          case 'fixed_increase':
            updatedVariant.price += adjustment;
            updatedVariant.mrp += adjustment;
            break;
          case 'fixed_decrease':
            updatedVariant.price = Math.max(1, variant.price - adjustment);
            updatedVariant.mrp = Math.max(1, variant.mrp - adjustment);
            break;
        }
      }

      // Stock update
      if (bulkEditData.stockUpdate.type !== 'none') {
        const stockValue = parseInt(bulkEditData.stockUpdate.value);
        switch (bulkEditData.stockUpdate.type) {
          case 'set':
            updatedVariant.stock = stockValue;
            break;
          case 'add':
            updatedVariant.stock += stockValue;
            break;
          case 'subtract':
            updatedVariant.stock = Math.max(0, variant.stock - stockValue);
            break;
        }
      }

      // Status update
      if (bulkEditData.status !== 'no_change') {
        updatedVariant.status = bulkEditData.status;
      }

      return updatedVariant;
    });

    setVariants(updatedVariants);
    setSelectedVariants([]);
    setShowBulkEdit(false);
    setBulkEditData({
      priceAdjustment: { type: 'none', value: 0 },
      stockUpdate: { type: 'none', value: 0 },
      status: 'no_change'
    });
  };

  const saveVariants = async () => {
    try {
      setSaving(true);
      
      const payload = {
        productId,
        attributes,
        variants: variants.filter(v => v.enabled)
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Variants saved:', payload);
      navigate('/vendor/products', { 
        state: { message: 'Product variants updated successfully!' }
      });
    } catch (error) {
      console.error('Error saving variants:', error);
    } finally {
      setSaving(false);
    }
  };

  const addTemplateAttribute = (templateKey) => {
    const template = attributeTemplates[templateKey];
    const newAttribute = {
      id: Date.now(),
      name: template.name,
      values: [...template.values]
    };
    setAttributes([...attributes, newAttribute]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product variants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Product Variants</h1>
              <p className="text-gray-600 mt-1">
                Manage variations for: <span className="font-medium">{product?.title}</span>
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
                onClick={saveVariants}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Variants'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Attributes Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Attributes</h2>
                <button
                  onClick={addAttribute}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </button>
              </div>

              {/* Template Attributes */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Templates</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(attributeTemplates).map(([key, template]) => (
                    <button
                      key={key}
                      onClick={() => addTemplateAttribute(key)}
                      className="px-2 py-1 text-xs border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      {template.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {attributes.map((attribute) => (
                  <div key={attribute.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <input
                        type="text"
                        value={attribute.name}
                        onChange={(e) => updateAttribute(attribute.id, 'name', e.target.value)}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                        placeholder="Attribute name (e.g., Size, Color)"
                      />
                      <button
                        onClick={() => removeAttribute(attribute.id)}
                        className="ml-2 p-1 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      {attribute.values.map((value, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => updateAttributeValue(attribute.id, index, e.target.value)}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                            placeholder="Value"
                          />
                          {attribute.values.length > 1 && (
                            <button
                              onClick={() => removeAttributeValue(attribute.id, index)}
                              className="p-1 text-red-600 hover:text-red-800"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => addAttributeValue(attribute.id)}
                        className="text-sm text-green-600 hover:text-green-800"
                      >
                        + Add value
                      </button>
                    </div>
                  </div>
                ))}

                {attributes.length === 0 && (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm">No attributes added yet</p>
                    <p className="text-gray-400 text-xs mt-1">Add attributes to create variants</p>
                  </div>
                )}
              </div>

              {attributes.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={regenerateVariants}
                    className="w-full px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 text-sm font-medium"
                  >
                    <Grid3X3 className="w-4 h-4 mr-2 inline" />
                    Generate Variants
                  </button>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    This will create {attributes.reduce((acc, attr) => acc * attr.values.filter(v => v.trim()).length, 1)} variants
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Variants Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Variants ({variants.filter(v => v.enabled).length})
                  </h2>
                  {selectedVariants.length > 0 && (
                    <span className="text-sm text-gray-600">
                      {selectedVariants.length} selected
                    </span>
                  )}
                </div>
                
                {selectedVariants.length > 0 && (
                  <button
                    onClick={() => setShowBulkEdit(true)}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Edit3 className="w-4 h-4 mr-1" />
                    Bulk Edit
                  </button>
                )}
              </div>

              {variants.length > 0 ? (
                <div className="space-y-4">
                  {/* Select All */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedVariants.length === variants.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedVariants(variants.map(v => v.id));
                          } else {
                            setSelectedVariants([]);
                          }
                        }}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        Select All Variants
                      </span>
                    </label>
                    
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">
                        Total: {variants.length} | Enabled: {variants.filter(v => v.enabled).length}
                      </span>
                    </div>
                  </div>

                  {variants.map((variant) => (
                    <div
                      key={variant.id}
                      className={`border rounded-lg p-4 transition-colors ${
                        variant.enabled 
                          ? selectedVariants.includes(variant.id)
                            ? 'border-green-300 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                          : 'border-gray-200 bg-gray-50 opacity-60'
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <input
                          type="checkbox"
                          checked={selectedVariants.includes(variant.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedVariants([...selectedVariants, variant.id]);
                            } else {
                              setSelectedVariants(selectedVariants.filter(id => id !== variant.id));
                            }
                          }}
                          className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />

                        <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Variant Name
                            </label>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-900">
                                {variant.name}
                              </span>
                              <input
                                type="checkbox"
                                checked={variant.enabled}
                                onChange={() => toggleVariantEnabled(variant.id)}
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                title="Enable/Disable variant"
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">SKU: {variant.sku}</p>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              MRP (₹)
                            </label>
                            <input
                              type="number"
                              value={variant.mrp}
                              onChange={(e) => updateVariant(variant.id, 'mrp', parseInt(e.target.value))}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                              disabled={!variant.enabled}
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Price (₹)
                            </label>
                            <input
                              type="number"
                              value={variant.price}
                              onChange={(e) => updateVariant(variant.id, 'price', parseInt(e.target.value))}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                              disabled={!variant.enabled}
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Stock
                            </label>
                            <input
                              type="number"
                              value={variant.stock}
                              onChange={(e) => updateVariant(variant.id, 'stock', parseInt(e.target.value))}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                              disabled={!variant.enabled}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Weight: {variant.weight}</span>
                          <span>Status: {variant.status}</span>
                          <span>Discount: {Math.round(((variant.mrp - variant.price) / variant.mrp) * 100)}%</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateVariant(variant.id, 'status', variant.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')}
                            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                              variant.status === 'ACTIVE'
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {variant.status}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Variants</h3>
                  <p className="text-gray-500">Add attributes and generate variants to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bulk Edit Modal */}
        {showBulkEdit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Bulk Edit ({selectedVariants.length} variants)
                </h3>
                <button
                  onClick={() => setShowBulkEdit(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Price Adjustment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Adjustment
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={bulkEditData.priceAdjustment.type}
                      onChange={(e) => setBulkEditData(prev => ({
                        ...prev,
                        priceAdjustment: { ...prev.priceAdjustment, type: e.target.value }
                      }))}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                    >
                      <option value="none">No Change</option>
                      <option value="percentage_increase">Increase %</option>
                      <option value="percentage_decrease">Decrease %</option>
                      <option value="fixed_increase">Increase ₹</option>
                      <option value="fixed_decrease">Decrease ₹</option>
                    </select>
                    <input
                      type="number"
                      value={bulkEditData.priceAdjustment.value}
                      onChange={(e) => setBulkEditData(prev => ({
                        ...prev,
                        priceAdjustment: { ...prev.priceAdjustment, value: e.target.value }
                      }))}
                      disabled={bulkEditData.priceAdjustment.type === 'none'}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500 disabled:bg-gray-50"
                      placeholder="Value"
                    />
                  </div>
                </div>

                {/* Stock Update */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Update
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={bulkEditData.stockUpdate.type}
                      onChange={(e) => setBulkEditData(prev => ({
                        ...prev,
                        stockUpdate: { ...prev.stockUpdate, type: e.target.value }
                      }))}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                    >
                      <option value="none">No Change</option>
                      <option value="set">Set Stock</option>
                      <option value="add">Add Stock</option>
                      <option value="subtract">Reduce Stock</option>
                    </select>
                    <input
                      type="number"
                      value={bulkEditData.stockUpdate.value}
                      onChange={(e) => setBulkEditData(prev => ({
                        ...prev,
                        stockUpdate: { ...prev.stockUpdate, value: e.target.value }
                      }))}
                      disabled={bulkEditData.stockUpdate.type === 'none'}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500 disabled:bg-gray-50"
                      placeholder="Quantity"
                    />
                  </div>
                </div>

                {/* Status Update */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={bulkEditData.status}
                    onChange={(e) => setBulkEditData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                  >
                    <option value="no_change">No Change</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowBulkEdit(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkEdit}
                  className="flex-1 px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  Apply Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductVariants; 