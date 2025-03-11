// src/components/ui/Card.jsx
import React from 'react';

const Card = ({ title, children, className = '' }) => {
  return (
    <div className={`card ${className}`}>
      {title && <div className="card-header">{title}</div>}
      <div className="card-body">{children}</div>
    </div>
  );
};

const CardContent = React.forwardRef(({ className = '', children, ...props }, ref) => (
  <div ref={ref} className={`card-content ${className}`} {...props}>
    {children}
  </div>
));
CardContent.displayName = "CardContent";

// Manter export default para compatibilidade com código existente
export default Card;

// Adicionar exports nomeados para novos componentes
export { Card, CardContent };