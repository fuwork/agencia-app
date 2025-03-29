import React, { useEffect } from 'react';

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    overflow: 'auto'
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '8px',
    width: 'auto',
    minWidth: '400px', 
    maxHeight: '90vh',
    overflow: 'auto',
    position: 'relative',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
    margin: '1.75rem auto'
  },
  modalXs: {
    maxWidth: '450px'
  },
  modalSm: {
    maxWidth: '650px'
  },
  modalMd: {
    maxWidth: '850px' 
  },
  modalLg: {
    maxWidth: '95vw', 
    width: '800px'   
  },
  modalXl: {
    maxWidth: '95vw',
    width: '800'   
  },
  modalFull: {
    maxWidth: '95vw',
    width: '95vw',
    height: '95vh'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid #eee'
  },
  modalTitle: {
    margin: 0,
    fontSize: '1.5rem', 
    fontWeight: '600'
  },
  modalClose: {
    background: 'none',
    border: 'none',
    fontSize: '28px', 
    cursor: 'pointer',
    color: '#666',
    padding: '0 10px'
  },
  modalBody: {
    padding: '25px', 
    fontSize: '1.05rem' 
  },
  modalFooter: {
    padding: '20px',
    borderTop: '1px solid #eee',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px' 
  }
};

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  size = 'lg' 
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
  
  const getSizeStyle = () => {
    switch (size) {
      case 'xs': return styles.modalXs;
      case 'sm': return styles.modalSm;
      case 'md': return styles.modalMd;
      case 'lg': return styles.modalLg;
      case 'xl': return styles.modalXl;
      case 'full': return styles.modalFull;
      default: return styles.modalLg; 
    }
  };

  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={{...styles.modal, ...getSizeStyle()}} onClick={handleModalContentClick}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>{title}</h3>
          <button style={styles.modalClose} onClick={onClose} aria-label="Fechar modal">
            &times;
          </button>
        </div>
        <div style={styles.modalBody}>{children}</div>
        {footer && <div style={styles.modalFooter}>{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;