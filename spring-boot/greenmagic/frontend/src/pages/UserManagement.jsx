import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Key, 
  Filter,
  Download,
  RefreshCw,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  Shield,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import userService from '../services/userService';
import UserModal from '../components/modals/UserModal';
import PasswordModal from '../components/modals/PasswordModal';
import ConfirmModal from '../components/modals/ConfirmModal';
import './UserManagement.css';

const UserManagement = () => {
  const { user: currentUser, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [stats, setStats] = useState({ totalUsers: 0, activeUsers: 0, inactiveUsers: 0 });
  
  // Modal states
  const [showUserModal, setShowUserModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'edit', 'create'

  // Load users on component mount and when dependencies change
  useEffect(() => {
    loadUsers();
    loadStats();
  }, [currentPage, pageSize]);

  // Search users when search query changes
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery.trim()) {
        searchUsers();
      } else {
        loadUsers();
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await userService.getAllUsers(currentPage, pageSize);
      
      if (response.success && response.data) {
        setUsers(response.data.content || []);
        setTotalPages(response.data.totalPages || 0);
        setTotalElements(response.data.totalElements || 0);
      } else {
        setError('Failed to load users');
      }
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await userService.searchUsers(searchQuery, currentPage, pageSize);
      
      if (response.success && response.data) {
        setUsers(response.data.content || []);
        setTotalPages(response.data.totalPages || 0);
        setTotalElements(response.data.totalElements || 0);
      }
    } catch (err) {
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const userStats = await userService.getUserStats();
      setStats(userStats);
    } catch (err) {
      console.error('Failed to load user stats:', err);
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setModalMode('view');
    setShowUserModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalMode('edit');
    setShowUserModal(true);
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setModalMode('create');
    setShowUserModal(true);
  };

  const handleChangePassword = (user) => {
    setSelectedUser(user);
    setShowPasswordModal(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowConfirmModal(true);
  };

  const confirmDeleteUser = async () => {
    try {
      await userService.deleteUser(selectedUser.userId);
      setShowConfirmModal(false);
      setSelectedUser(null);
      loadUsers();
      loadStats();
      alert('User deleted successfully');
    } catch (err) {
      alert(err.message || 'Failed to delete user');
    }
  };

  const handleUserSaved = () => {
    setShowUserModal(false);
    setSelectedUser(null);
    loadUsers();
    loadStats();
  };

  const handlePasswordChanged = () => {
    setShowPasswordModal(false);
    setSelectedUser(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleBadgeClass = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'role-badge role-admin';
      case 'user':
        return 'role-badge role-user';
      case 'vendor':
        return 'role-badge role-vendor';
      default:
        return 'role-badge role-default';
    }
  };

  return (
    <div className="user-management">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <div className="header-text">
              <h1>User Management</h1>
              <p>Manage users, roles, and permissions</p>
            </div>
            <div className="header-actions">
              <button 
                onClick={loadUsers}
                className="btn-secondary"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              {isAdmin() && (
                <button 
                  onClick={handleCreateUser}
                  className="btn-primary"
                >
                  <Plus className="w-4 h-4" />
                  Add User
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon total">
              <Users className="w-6 h-6" />
            </div>
            <div className="stat-content">
              <h3>{stats.totalUsers}</h3>
              <p>Total Users</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon active">
              <UserCheck className="w-6 h-6" />
            </div>
            <div className="stat-content">
              <h3>{stats.activeUsers}</h3>
              <p>Active Users</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon inactive">
              <UserX className="w-6 h-6" />
            </div>
            <div className="stat-content">
              <h3>{stats.inactiveUsers}</h3>
              <p>Inactive Users</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon admin">
              <Shield className="w-6 h-6" />
            </div>
            <div className="stat-content">
              <h3>{users.filter(u => u.roleName === 'ADMIN').length}</h3>
              <p>Administrators</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="filters-section">
          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-actions">
            <select 
              value={pageSize} 
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="page-size-select"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
            <button className="btn-secondary">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {/* Users Table */}
        <div className="table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Contact</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="loading-cell">
                    <div className="loading-spinner">
                      <RefreshCw className="w-6 h-6 animate-spin" />
                      <span>Loading users...</span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-cell">
                    <div className="empty-state">
                      <Users className="w-12 h-12" />
                      <h3>No users found</h3>
                      <p>Try adjusting your search criteria</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.userId}>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">
                          {user.profilePicture ? (
                            <img src={user.profilePicture} alt={user.name} />
                          ) : (
                            <div className="avatar-placeholder">
                              {user.name?.charAt(0)?.toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="user-details">
                          <h4>{user.name}</h4>
                          <span className="user-id">ID: {user.userId}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="contact-info">
                        <div className="contact-item">
                          <Mail className="w-4 h-4" />
                          <span>{user.email}</span>
                        </div>
                        {user.phoneNumber && (
                          <div className="contact-item">
                            <Phone className="w-4 h-4" />
                            <span>{user.phoneNumber}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={getRoleBadgeClass(user.roleName)}>
                        {user.roleName || 'USER'}
                      </span>
                    </td>
                    <td>
                      <div className="date-info">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(user.createdAt)}</span>
                      </div>
                    </td>
                    <td>
                      <span className="status-badge status-active">
                        Active
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="action-btn view"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {(isAdmin() || currentUser?.userId === user.userId) && (
                          <button
                            onClick={() => handleEditUser(user)}
                            className="action-btn edit"
                            title="Edit User"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        {(isAdmin() || currentUser?.userId === user.userId) && (
                          <button
                            onClick={() => handleChangePassword(user)}
                            className="action-btn password"
                            title="Change Password"
                          >
                            <Key className="w-4 h-4" />
                          </button>
                        )}
                        {isAdmin() && currentUser?.userId !== user.userId && (
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="action-btn delete"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <div className="pagination-info">
              Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} users
            </div>
            <div className="pagination-controls">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 0}
                className="pagination-btn"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              
              <div className="page-numbers">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(0, Math.min(totalPages - 5, currentPage - 2)) + i;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className="pagination-btn"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showUserModal && (
        <UserModal
          user={selectedUser}
          mode={modalMode}
          onClose={() => setShowUserModal(false)}
          onSave={handleUserSaved}
        />
      )}

      {showPasswordModal && (
        <PasswordModal
          user={selectedUser}
          onClose={() => setShowPasswordModal(false)}
          onSave={handlePasswordChanged}
        />
      )}

      {showConfirmModal && (
        <ConfirmModal
          title="Delete User"
          message={`Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`}
          onConfirm={confirmDeleteUser}
          onCancel={() => setShowConfirmModal(false)}
          type="danger"
        />
      )}
    </div>
  );
};

export default UserManagement; 