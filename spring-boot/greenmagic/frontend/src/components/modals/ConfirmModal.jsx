import React from 'react';
import { X, AlertTriangle, Trash2, Check } from 'lucide-react';
import './ConfirmModal.css';

const ConfirmModal = ({ title, message, onConfirm, onCancel, type = 'danger' }) => {
  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <AlertTriangle className="w-6 h-6" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6" />;
      case 'info':
        return <Check className="w-6 h-6" />;
      default:
        return <AlertTriangle className="w-6 h-6" />;
    }
  };

  const getIconClass = () => {
    switch (type) {
      case 'danger':
        return 'icon-danger';
      case 'warning':
        return 'icon-warning';
      case 'info':
        return 'icon-info';
      default:
        return 'icon-danger';
    }
  };

  const getConfirmButtonClass = () => {
    switch (type) {
      case 'danger':
        return 'btn-danger';
      case 'warning':
        return 'btn-warning';
      case 'info':
        return 'btn-primary';
      default:
        return 'btn-danger';
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-container confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <div className={`modal-icon ${getIconClass()}`}>
              {getIcon()}
            </div>
            <h2>{title}</h2>
          </div>
          <button onClick={onCancel} className="modal-close-btn">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="modal-body">
          <p className="confirm-message">{message}</p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            className={getConfirmButtonClass()}
          >
            {type === 'danger' && <Trash2 className="w-4 h-4" />}
            {type === 'danger' ? 'Delete' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal; 