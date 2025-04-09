import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

const Alert = ({ 
  type = 'info', 
  title, 
  message, 
  onClose,
  showClose = true,
  className = ''
}) => {
  const alertStyles = {
    success: {
      containerClass: 'border-green-500 bg-green-50',
      iconClass: 'text-green-500',
      Icon: CheckCircle2
    },
    error: {
      containerClass: 'border-red-500 bg-red-50',
      iconClass: 'text-red-500',
      Icon: AlertCircle
    },
    warning: {
      containerClass: 'border-yellow-500 bg-yellow-50',
      iconClass: 'text-yellow-500',
      Icon: AlertTriangle
    },
    info: {
      containerClass: 'border-blue-500 bg-blue-50',
      iconClass: 'text-blue-500',
      Icon: Info
    }
  };

  const { containerClass, iconClass, Icon } = alertStyles[type] || alertStyles.info;

  return (
    <div className={`relative flex items-center p-4 border rounded-lg ${containerClass} ${className}`}>
      <Icon className={`h-5 w-5 ${iconClass}`} />
      <div className="ml-3 flex-1">
        {title && (
          <h5 className="font-semibold text-sm mb-1">{title}</h5>
        )}
        <p className="text-sm text-gray-700">
          {message}
        </p>
      </div>
      {showClose && onClose && (
        <button
          onClick={onClose}
          className={`absolute right-2 top-2 rounded-full p-1 hover:bg-black/5 ${iconClass}`}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

// Exemplo de uso
export const AlertDemo = () => {
  return (
    <div className="space-y-4 p-4">
      <Alert
        type="success"
        title="Sucesso!"
        message="Operação realizada com sucesso."
        onClose={() => console.log('Fechou alert de sucesso')}
      />
      
      <Alert
        type="error"
        title="Erro!"
        message="Ocorreu um erro ao processar sua solicitação."
        onClose={() => console.log('Fechou alert de erro')}
      />
      
      <Alert
        type="warning"
        title="Atenção!"
        message="Esta ação não pode ser desfeita."
        onClose={() => console.log('Fechou alert de warning')}
      />
      
      <Alert
        type="info"
        message="Esta é uma mensagem informativa sem título."
        showClose={false}
      />
    </div>
  );
};

export default Alert;