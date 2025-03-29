import React from 'react';

// Componente Card básico
export const Card = ({ children, className = '' }) => (
  <div className={`border rounded-lg shadow-md ${className}`}>
    {children}
  </div>
);

// Cabeçalho do Card
export const CardHeader = ({ children, className = '' }) => (
  <div className={`p-4 border-b ${className}`}>
    {children}
  </div>
);

// Título do Card
export const CardTitle = ({ children, className = '' }) => (
  <h2 className={`text-xl font-semibold ${className}`}>
    {children}
  </h2>
);

// Conteúdo do Card
export const CardContent = ({ children, className = '' }) => (
  <div className={`p-4 ${className}`}>
    {children}
  </div>
);