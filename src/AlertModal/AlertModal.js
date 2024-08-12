import React from 'react';
import './AlertModal.css';

const AlertModal = ({ message, onClose }) => {
  return (
    <div className="alert-modal">
      <div className="modal-content">
        <p>{message}</p>
        <button className="close-modal" onClick={onClose}>Close</button> 
      </div>
    </div>
  );
};

export default AlertModal;
