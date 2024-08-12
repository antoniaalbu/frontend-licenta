import React from 'react';
import '../AlertModal/AlertModal';

const RedirectModal = ({ message, onClose }) => {
  return (
    <div className="alert-modal">
      <div className="modal-content">
        <p>{message}</p>
        <button className="close-modal" onClick={onClose}>Add a new Incubator!</button> 
      </div>
    </div>
  );
};

export default RedirectModal;
