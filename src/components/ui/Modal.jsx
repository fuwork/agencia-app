// src/components/ui/Modal.jsx
import React, { useEffect } from 'react';
import Button from './Button';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  size = 'md'
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'modal-sm';
      case 'md': return 'modal-md';
      case 'lg': return 'modal-lg';
      default: return 'modal-md';
    }
  };

  return (
    <div className="modal-overlay">
      <div className={`modal ${getSizeClass()}`}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;