import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Store, 
  User, 
  CreditCard, 
  Bell, 
  Shield,
  Truck,
  Tag,
  Save,
  Upload,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Vendor Settings Component - Phase 1 Foundation
 * 
 * Basic store configuration and settings for vendors
 * Based on store-configuration.json specifications
 */
const VendorSettings = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('store');
  const [showPassword, setShowPassword] = useState(false);
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'Green Organic Store',
    storeDescription: 'Premium organic products for healthy living',
    storeEmail: 'store@example.com',
    storePhone: '+91 9876543210',
    storeAddress: '123 Green Street, Mumbai, Maharashtra 400001',
    storeWebsite: 'https://greenorganic.com',
    storeLogoUrl: '',
    storeBannerUrl: '',
    businessHours: {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '10:00', close: '16:00', closed: false },
      sunday: { open: '', close: '', closed: true }
    },
    currency: 'INR',
    taxSettings: {
      gstEnabled: true,
      gstNumber: 'GST123456789',
      includeTaxInPrice: false
    }
  });

  const [shippingSettings, setShippingSettings] = useState({
    freeShippingThreshold: 500,
    standardShippingRate: 50,
    expressShippingRate: 100,
    shippingZones: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai'],
    processingTime: '1-2 business days',
    returnPolicy: '30 days return policy',
    exchangePolicy: '7 days exchange policy'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    newOrderEmail: true,
    newOrderSMS: true,
    lowStockEmail: true,
    lowStockSMS: false,
    customerReviewEmail: true,
    customerReviewSMS: false,
    promotionalEmail: true,
    promotionalSMS: false
  });

  const [accountSettings, setAccountSettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorAuth: false,
    loginNotifications: true
  });

  const tabs = [
    { id: 'store', label: 'Store Information', icon: Store },
    { id: 'shipping', label: 'Shipping & Returns', icon: Truck },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'account', label: 'Account & Security', icon: Shield }
  ];

  const handleStoreSettingsChange = (field, value) => {
    setStoreSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBusinessHoursChange = (day, field, value) => {
    setStoreSettings(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day],
          [field]: value
        }
      }
    }));
  };

  const handleShippingSettingsChange = (field, value) => {
    setShippingSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (field, value) => {
    setNotificationSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAccountSettingsChange = (field, value) => {
    setAccountSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async (section) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    // Show success message
    alert(`${section} settings saved successfully!`);
  };

  const renderStoreSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Store Name *
            </label>
            <input
              type="text"
              value={storeSettings.storeName}
              onChange={(e) => handleStoreSettingsChange('storeName', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Store Email *
            </label>
            <input
              type="email"
              value={storeSettings.storeEmail}
              onChange={(e) => handleStoreSettingsChange('storeEmail', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Store Phone *
            </label>
            <input
              type="tel"
              value={storeSettings.storePhone}
              onChange={(e) => handleStoreSettingsChange('storePhone', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website URL
            </label>
            <input
              type="url"
              value={storeSettings.storeWebsite}
              onChange={(e) => handleStoreSettingsChange('storeWebsite', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
              placeholder="https://example.com"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Store Description
          </label>
          <textarea
            rows="4"
            value={storeSettings.storeDescription}
            onChange={(e) => handleStoreSettingsChange('storeDescription', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
            placeholder="Describe your store and what makes it special..."
          />
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Store Address
          </label>
          <textarea
            rows="3"
            value={storeSettings.storeAddress}
            onChange={(e) => handleStoreSettingsChange('storeAddress', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Business Hours</h3>
        <div className="space-y-4">
          {Object.entries(storeSettings.businessHours).map(([day, hours]) => (
            <div key={day} className="flex items-center space-x-4">
              <div className="w-24">
                <span className="text-sm font-medium text-gray-700 capitalize">{day}</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={!hours.closed}
                  onChange={(e) => handleBusinessHoursChange(day, 'closed', !e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-600">Open</span>
              </div>
              {!hours.closed && (
                <>
                  <input
                    type="time"
                    value={hours.open}
                    onChange={(e) => handleBusinessHoursChange(day, 'open', e.target.value)}
                    className="block w-24 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  />
                  <span className="text-sm text-gray-500">to</span>
                  <input
                    type="time"
                    value={hours.close}
                    onChange={(e) => handleBusinessHoursChange(day, 'close', e.target.value)}
                    className="block w-24 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Tax Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={storeSettings.taxSettings.gstEnabled}
              onChange={(e) => handleStoreSettingsChange('taxSettings', {
                ...storeSettings.taxSettings,
                gstEnabled: e.target.checked
              })}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label className="text-sm font-medium text-gray-700">Enable GST</label>
          </div>
          
          {storeSettings.taxSettings.gstEnabled && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GST Number
              </label>
              <input
                type="text"
                value={storeSettings.taxSettings.gstNumber}
                onChange={(e) => handleStoreSettingsChange('taxSettings', {
                  ...storeSettings.taxSettings,
                  gstNumber: e.target.value
                })}
                className="block w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => handleSave('Store')}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );

  const renderShippingSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Rates</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Free Shipping Threshold (₹)
            </label>
            <input
              type="number"
              value={shippingSettings.freeShippingThreshold}
              onChange={(e) => handleShippingSettingsChange('freeShippingThreshold', parseInt(e.target.value))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Standard Shipping Rate (₹)
            </label>
            <input
              type="number"
              value={shippingSettings.standardShippingRate}
              onChange={(e) => handleShippingSettingsChange('standardShippingRate', parseInt(e.target.value))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Express Shipping Rate (₹)
            </label>
            <input
              type="number"
              value={shippingSettings.expressShippingRate}
              onChange={(e) => handleShippingSettingsChange('expressShippingRate', parseInt(e.target.value))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Processing & Policies</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Processing Time
            </label>
            <input
              type="text"
              value={shippingSettings.processingTime}
              onChange={(e) => handleShippingSettingsChange('processingTime', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Return Policy
            </label>
            <input
              type="text"
              value={shippingSettings.returnPolicy}
              onChange={(e) => handleShippingSettingsChange('returnPolicy', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => handleSave('Shipping')}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Order Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">New Order Email</label>
              <p className="text-sm text-gray-500">Get notified via email when new orders are placed</p>
            </div>
            <input
              type="checkbox"
              checked={notificationSettings.newOrderEmail}
              onChange={(e) => handleNotificationChange('newOrderEmail', e.target.checked)}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">New Order SMS</label>
              <p className="text-sm text-gray-500">Get notified via SMS when new orders are placed</p>
            </div>
            <input
              type="checkbox"
              checked={notificationSettings.newOrderSMS}
              onChange={(e) => handleNotificationChange('newOrderSMS', e.target.checked)}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Inventory Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Low Stock Email</label>
              <p className="text-sm text-gray-500">Get notified via email when products are running low</p>
            </div>
            <input
              type="checkbox"
              checked={notificationSettings.lowStockEmail}
              onChange={(e) => handleNotificationChange('lowStockEmail', e.target.checked)}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Low Stock SMS</label>
              <p className="text-sm text-gray-500">Get notified via SMS when products are running low</p>
            </div>
            <input
              type="checkbox"
              checked={notificationSettings.lowStockSMS}
              onChange={(e) => handleNotificationChange('lowStockSMS', e.target.checked)}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => handleSave('Notification')}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={accountSettings.currentPassword}
                onChange={(e) => handleAccountSettingsChange('currentPassword', e.target.value)}
                className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={accountSettings.newPassword}
              onChange={(e) => handleAccountSettingsChange('newPassword', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={accountSettings.confirmPassword}
              onChange={(e) => handleAccountSettingsChange('confirmPassword', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Two-Factor Authentication</label>
              <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
            </div>
            <input
              type="checkbox"
              checked={accountSettings.twoFactorAuth}
              onChange={(e) => handleAccountSettingsChange('twoFactorAuth', e.target.checked)}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Login Notifications</label>
              <p className="text-sm text-gray-500">Get notified of new login attempts</p>
            </div>
            <input
              type="checkbox"
              checked={accountSettings.loginNotifications}
              onChange={(e) => handleAccountSettingsChange('loginNotifications', e.target.checked)}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => handleSave('Account')}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Store Settings</h1>
              <p className="text-gray-600 mt-1">Configure your store preferences and settings</p>
            </div>
            <div className="flex items-center space-x-2">
              <Settings className="h-6 w-6 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="mr-3 h-5 w-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {activeTab === 'store' && renderStoreSettings()}
              {activeTab === 'shipping' && renderShippingSettings()}
              {activeTab === 'notifications' && renderNotificationSettings()}
              {activeTab === 'account' && renderAccountSettings()}
            </div>
          </div>
        </div>

        {/* Phase 1 Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Settings className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-blue-900">Phase 1 Foundation</h3>
              <p className="text-blue-700 mt-1">
                This is the foundational settings interface. Advanced features like payment gateway configuration, 
                advanced shipping rules, and integration settings will be added in upcoming phases.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorSettings; 