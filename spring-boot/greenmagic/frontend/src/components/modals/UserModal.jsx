import React from 'react';
import { X } from 'lucide-react';
import './UserModal.css';

const UserModal = ({ user, mode, onClose, onSave }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === 'view' ? 'User Details' : mode === 'edit' ? 'Edit User' : 'Create User'}</h2>
          <button onClick={onClose} className="modal-close-btn">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="modal-body">
          <p>User modal functionality coming soon...</p>
          {user && (
            <div>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.roleName}</p>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary">Close</button>
        </div>
      </div>
    </div>
  );
};

export default UserModal; 