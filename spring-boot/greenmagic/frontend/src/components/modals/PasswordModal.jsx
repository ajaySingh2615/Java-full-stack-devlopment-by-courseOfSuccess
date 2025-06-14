import React from 'react';
import { X } from 'lucide-react';
import './PasswordModal.css';

const PasswordModal = ({ user, onClose, onSave }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container password-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Change Password</h2>
          <button onClick={onClose} className="modal-close-btn">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="modal-body">
          <p>Password change functionality coming soon...</p>
          {user && (
            <div>
              <p><strong>User:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
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

export default PasswordModal; 