// src/components/ui/Modal.jsx
import React, { useEffect } from 'react';

// Estilos inline para garantir que o modal funcione corretamente
// Você pode mover esses estilos para um arquivo CSS separado depois
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
    minWidth: '300px',
    maxHeight: '90vh',
    overflow: 'auto',
    position: 'relative',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
    margin: '1.75rem auto'
  },
  modalSm: {
    maxWidth: '400px'
  },
  modalMd: {
    maxWidth: '600px'
  },
  modalLg: {
    maxWidth: '800px'
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
    fontSize: '1.25rem'
  },
  modalClose: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#666'
  },
  modalBody: {
    padding: '20px'
  },
  modalFooter: {
    padding: '16px 20px',
    borderTop: '1px solid #eee',
    display: 'flex',
    justifyContent: 'flex-end'
  }
};

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  size = 'md'
}) => {
  useEffect(() => {
    // Impedir rolagem do body quando o modal estiver aberto
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
      case 'sm': return styles.modalSm;
      case 'md': return styles.modalMd;
      case 'lg': return styles.modalLg;
      default: return styles.modalMd;
    }
  };

  // Prevenindo propagação do clique para evitar que o modal feche quando clicar no conteúdo
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={{...styles.modal, ...getSizeStyle()}} onClick={handleModalContentClick}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>{title}</h3>
          <button style={styles.modalClose} onClick={onClose}>&times;</button>
        </div>
        <div style={styles.modalBody}>{children}</div>
        {footer && <div style={styles.modalFooter}>{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;