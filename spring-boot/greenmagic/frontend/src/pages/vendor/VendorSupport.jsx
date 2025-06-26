import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  MessageSquare, 
  Book, 
  Video,
  Phone,
  Mail,
  Search,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  ExternalLink,
  Star,
  ThumbsUp,
  Send
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Vendor Support Component - Phase 1 Foundation
 * 
 * Basic support system for vendors
 * Based on vendor-support-system.json specifications
 */
const VendorSupport = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('tickets');
  const [searchQuery, setSearchQuery] = useState('');
  const [tickets, setTickets] = useState([]);
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: '',
    category: '',
    priority: 'MEDIUM',
    description: ''
  });

  // Mock data for Phase 1
  const mockTickets = [
    {
      id: 'TKT-001',
      title: 'Unable to upload product images',
      category: 'Technical',
      priority: 'HIGH',
      status: 'OPEN',
      createdAt: '2025-01-15T10:30:00Z',
      updatedAt: '2025-01-15T14:20:00Z',
      assignedTo: 'Support Team',
      description: 'I am unable to upload product images. The upload keeps failing.',
      responses: [
        {
          id: 1,
          author: 'Support Agent',
          message: 'Hi! We are looking into this issue. Can you please share the file size and format of the images you are trying to upload?',
          timestamp: '2025-01-15T12:00:00Z',
          isFromSupport: true
        }
      ]
    },
    {
      id: 'TKT-002',
      title: 'Question about GST settings',
      category: 'Account',
      priority: 'MEDIUM',
      status: 'RESOLVED',
      createdAt: '2025-01-12T09:15:00Z',
      updatedAt: '2025-01-12T16:45:00Z',
      assignedTo: 'Support Team',
      description: 'How do I configure GST settings for my products?',
      responses: [
        {
          id: 1,
          author: 'Support Agent',
          message: 'You can configure GST settings in your Store Settings > Tax Settings section. Please follow the guide we have sent to your email.',
          timestamp: '2025-01-12T11:30:00Z',
          isFromSupport: true
        }
      ]
    }
  ];

  const knowledgeBase = [
    {
      id: 1,
      title: 'Getting Started with Your Vendor Account',
      category: 'Getting Started',
      views: 1234,
      rating: 4.8,
      lastUpdated: '2025-01-10'
    },
    {
      id: 2,
      title: 'How to Add Products to Your Store',
      category: 'Product Management',
      views: 987,
      rating: 4.9,
      lastUpdated: '2025-01-08'
    },
    {
      id: 3,
      title: 'Understanding Order Management',
      category: 'Order Management',
      views: 756,
      rating: 4.7,
      lastUpdated: '2025-01-05'
    },
    {
      id: 4,
      title: 'Setting Up Shipping and Returns',
      category: 'Shipping',
      views: 543,
      rating: 4.6,
      lastUpdated: '2025-01-03'
    }
  ];

  const trainingResources = [
    {
      id: 1,
      title: 'Vendor Onboarding Webinar',
      type: 'video',
      duration: '45 min',
      description: 'Complete guide to setting up your vendor account and store'
    },
    {
      id: 2,
      title: 'Product Photography Best Practices',
      type: 'video',
      duration: '30 min',
      description: 'Learn how to take professional product photos'
    },
    {
      id: 3,
      title: 'SEO for Organic Products',
      type: 'document',
      pages: 12,
      description: 'Guide to optimizing your product listings for search'
    }
  ];

  const supportChannels = [
    {
      id: 'email',
      name: 'Email Support',
      icon: Mail,
      description: 'Get detailed help via email',
      responseTime: '24 hours',
      availability: '24/7'
    },
    {
      id: 'phone',
      name: 'Phone Support',
      icon: Phone,
      description: 'Speak directly with our support team',
      responseTime: 'Immediate',
      availability: '9 AM - 6 PM (Mon-Fri)'
    },
    {
      id: 'chat',
      name: 'Live Chat',
      icon: MessageSquare,
      description: 'Quick chat support for urgent issues',
      responseTime: '< 5 minutes',
      availability: '9 AM - 6 PM (Mon-Fri)'
    }
  ];

  const tabs = [
    { id: 'tickets', label: 'Support Tickets', icon: MessageSquare },
    { id: 'knowledge', label: 'Knowledge Base', icon: Book },
    { id: 'training', label: 'Training Resources', icon: Video },
    { id: 'contact', label: 'Contact Support', icon: Phone }
  ];

  // Simulate API call
  useEffect(() => {
    setTickets(mockTickets);
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      OPEN: { label: 'Open', color: 'blue', icon: Clock },
      IN_PROGRESS: { label: 'In Progress', color: 'yellow', icon: AlertCircle },
      RESOLVED: { label: 'Resolved', color: 'green', icon: CheckCircle },
      CLOSED: { label: 'Closed', color: 'gray', icon: CheckCircle }
    };

    const config = statusConfig[status];
    if (!config) return null;

    const colorClasses = {
      blue: 'bg-blue-100 text-blue-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      green: 'bg-green-100 text-green-800',
      gray: 'bg-gray-100 text-gray-800'
    };

    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorClasses[config.color]}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const colorClasses = {
      LOW: 'bg-green-100 text-green-800',
      MEDIUM: 'bg-yellow-100 text-yellow-800',
      HIGH: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorClasses[priority]}`}>
        {priority}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleNewTicketSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    const ticket = {
      id: `TKT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      ...newTicket,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedTo: 'Support Team',
      responses: []
    };
    
    setTickets([ticket, ...tickets]);
    setNewTicket({ title: '', category: '', priority: 'MEDIUM', description: '' });
    setIsNewTicketModalOpen(false);
  };

  const renderTickets = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Your Support Tickets</h3>
          <p className="text-sm text-gray-500">Track and manage your support requests</p>
        </div>
        <button
          onClick={() => setIsNewTicketModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Ticket
        </button>
      </div>

      <div className="space-y-4">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-lg font-medium text-gray-900">{ticket.title}</h4>
                  {getStatusBadge(ticket.status)}
                  {getPriorityBadge(ticket.priority)}
                </div>
                <p className="text-sm text-gray-600 mb-3">{ticket.description}</p>
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <span>Ticket #{ticket.id}</span>
                  <span>Category: {ticket.category}</span>
                  <span>Created: {formatDate(ticket.createdAt)}</span>
                  <span>Last Updated: {formatDate(ticket.updatedAt)}</span>
                </div>
              </div>
              <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {tickets.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No support tickets</h3>
          <p className="text-gray-500 mb-6">You haven't created any support tickets yet</p>
          <button
            onClick={() => setIsNewTicketModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Ticket
          </button>
        </div>
      )}
    </div>
  );

  const renderKnowledgeBase = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Knowledge Base</h3>
          <p className="text-sm text-gray-500">Find answers to common questions</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {knowledgeBase.map((article) => (
          <div key={article.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <h4 className="text-lg font-medium text-gray-900 flex-1">{article.title}</h4>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {article.category}
              </span>
              <span>{article.views} views</span>
              <div className="flex items-center">
                <Star className="w-3 h-3 text-yellow-400 mr-1" />
                <span>{article.rating}</span>
              </div>
            </div>
            <p className="text-sm text-gray-500">Last updated: {new Date(article.lastUpdated).toLocaleDateString()}</p>
            <button className="mt-3 text-green-600 hover:text-green-700 text-sm font-medium">
              Read Article
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTrainingResources = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Training Resources</h3>
        <p className="text-sm text-gray-500">Learn how to maximize your success on our platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainingResources.map((resource) => (
          <div key={resource.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              {resource.type === 'video' ? (
                <Video className="w-6 h-6 text-blue-600 mr-2" />
              ) : (
                <FileText className="w-6 h-6 text-green-600 mr-2" />
              )}
              <h4 className="text-lg font-medium text-gray-900">{resource.title}</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {resource.type === 'video' ? resource.duration : `${resource.pages} pages`}
              </span>
              <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                {resource.type === 'video' ? 'Watch' : 'Read'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContactSupport = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Contact Support</h3>
        <p className="text-sm text-gray-500">Get in touch with our support team</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {supportChannels.map((channel) => {
          const IconComponent = channel.icon;
          return (
            <div key={channel.id} className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <IconComponent className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">{channel.name}</h4>
              <p className="text-sm text-gray-600 mb-4">{channel.description}</p>
              <div className="space-y-2 text-sm text-gray-500 mb-4">
                <p><strong>Response Time:</strong> {channel.responseTime}</p>
                <p><strong>Availability:</strong> {channel.availability}</p>
              </div>
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
                Contact Now
              </button>
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-blue-900 mb-2">Quick Tips</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Include detailed descriptions when creating support tickets</li>
          <li>• Check our Knowledge Base first for instant answers</li>
          <li>• Use phone support for urgent technical issues</li>
          <li>• Provide screenshots when reporting technical problems</li>
        </ul>
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
              <h1 className="text-2xl font-bold text-gray-900">Support Center</h1>
              <p className="text-gray-600 mt-1">Get help and support for your vendor account</p>
            </div>
            <div className="flex items-center space-x-2">
              <HelpCircle className="h-6 w-6 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Support Navigation */}
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

          {/* Support Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {activeTab === 'tickets' && renderTickets()}
              {activeTab === 'knowledge' && renderKnowledgeBase()}
              {activeTab === 'training' && renderTrainingResources()}
              {activeTab === 'contact' && renderContactSupport()}
            </div>
          </div>
        </div>

        {/* New Ticket Modal */}
        {isNewTicketModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Create New Support Ticket</h3>
              </div>
              <form onSubmit={handleNewTicketSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTicket.title}
                    onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    placeholder="Brief description of your issue"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Select a category</option>
                    <option value="Technical">Technical</option>
                    <option value="Account">Account</option>
                    <option value="Orders">Orders</option>
                    <option value="Products">Products</option>
                    <option value="Payments">Payments</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows="4"
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    placeholder="Please describe your issue in detail..."
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsNewTicketModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                  >
                    <Send className="w-4 h-4 mr-2 inline" />
                    Create Ticket
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Phase 1 Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <HelpCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-blue-900">Phase 1 Foundation</h3>
              <p className="text-blue-700 mt-1">
                This is the foundational support interface. Advanced features like live chat integration, 
                AI-powered responses, and video support will be added in upcoming phases.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorSupport; 