import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Heart, 
  MapPin, 
  User, 
  Settings,
  Package,
  Clock
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import '../../pages/Dashboard.css';

/**
 * Customer Dashboard Component
 * 
 * Dashboard for regular customers to view their orders, wishlist,
 * addresses, and account settings.
 */
const CustomerDashboard = () => {
  const { currentUser } = useAuth();
  const [recentOrders, setRecentOrders] = useState([
    { id: 'ORD-2025001', date: '2025-06-15', total: 1200, status: 'Delivered' },
    { id: 'ORD-2025002', date: '2025-06-10', total: 850, status: 'Processing' },
  ]);

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-welcome">
          <h1>Welcome, {currentUser?.name || 'Customer'}!</h1>
          <p>Manage your orders and account settings.</p>
        </div>
        
        {/* Recent Orders */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Orders</h2>
            <Link to="/orders" className="view-all">View All</Link>
          </div>
          
          {recentOrders.length > 0 ? (
            <div className="orders-list">
              {recentOrders.map(order => (
                <div key={order.id} className="order-item">
                  <div className="order-info">
                    <h3>{order.id}</h3>
                    <div className="order-details">
                      <span className="order-date">
                        <Clock size={16} />
                        {order.date}
                      </span>
                      <span className="order-amount">
                        ₹{order.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="order-status-container">
                    <span className={`order-status ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                    <Link to={`/orders/${order.id}`} className="view-order">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Package size={48} />
              <p>You haven't placed any orders yet.</p>
              <Link to="/shop" className="btn-primary">Start Shopping</Link>
            </div>
          )}
        </div>
        
        {/* Quick Actions */}
        <h2 className="dashboard-section-title">Quick Actions</h2>
        <div className="dashboard-cards">
          <div className="dashboard-card">
            <ShoppingBag size={24} />
            <h2>My Orders</h2>
            <p>View and track your orders</p>
            <Link to="/orders" className="card-link">View Orders</Link>
          </div>
          
          <div className="dashboard-card">
            <Heart size={24} />
            <h2>Wishlist</h2>
            <p>Products you've saved</p>
            <Link to="/wishlist" className="card-link">View Wishlist</Link>
          </div>
          
          <div className="dashboard-card">
            <MapPin size={24} />
            <h2>Addresses</h2>
            <p>Manage delivery addresses</p>
            <Link to="/addresses" className="card-link">Manage Addresses</Link>
          </div>
          
          <div className="dashboard-card">
            <User size={24} />
            <h2>Account</h2>
            <p>Update your information</p>
            <Link to="/profile" className="card-link">Edit Profile</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard; 