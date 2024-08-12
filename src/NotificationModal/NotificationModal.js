import React, { useEffect, useRef } from 'react';
import './NotificationModal.css';
import { useNavigate } from 'react-router-dom';

const NotificationModal = ({ message, type, onClose }) => {
  const modalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const modalElement = modalRef.current;

    if (modalElement) {
      modalElement.style.left = '20px'; 

      return () => {
        modalElement.style.left = '-300px'; 
      };
    }
  }, []);

  const handleModalClick = () => {
    navigate('/notifications');
    onClose();
  };

  const handleCloseButtonClick = (event) => {
    event.stopPropagation();
    onClose();
  };

  return (
    <div ref={modalRef} className="notification-modal" onClick={handleModalClick}>
      <div className="notif-modal-content">
        <p>{message}</p>
        <button className="close-modal-notif" onClick={handleCloseButtonClick}>x</button>
      </div>
    </div>
  );
};

export default NotificationModal;
