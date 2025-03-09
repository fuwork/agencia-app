// src/components/pagamento/PagamentoItem.jsx
import React from 'react';
import Button from '../ui/Button';

const PagamentoItem = ({ pagamento, onEdit, onDelete }) => {
  const formatarData = (dataString) => {
    if (!dataString) return '';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };
  
  const formatarValor = (valor) => {
    return parseFloat(valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };
  
  const getStatusClass = (status) => {
    switch (status) {
      case 'pendente': return 'status-pending';
      case 'processando': return 'status-processing';
      case 'concluido': return 'status-success';
      case 'cancelado': return 'status-danger';
      default: return '';
    }
  };
  
  return (
    <div className="list-item">
      <div className="list-item-content">
        <h3>
          {pagamento.clientes?.nome || 'Cliente não disponível'}
          <span className={`status-badge ${getStatusClass(pagamento.status)}`}>
            {pagamento.status.charAt(0).toUpperCase() + pagamento.status.slice(1)}
          </span>
        </h3>
        <div className="item-details">
          <p><strong>Valor:</strong> {formatarValor(pagamento.valor)}</p>
          <p><strong>Data:</strong> {formatarData(pagamento.data_pagamento)}</p>
          <p><strong>Agência:</strong> {pagamento.agencias?.nome || 'Não informado'}</p>
          <p><strong>Método:</strong> {pagamento.metodo_pagamento || 'Não informado'}</p>
          {pagamento.descricao && <p><strong>Descrição:</strong> {pagamento.descricao}</p>}
        </div>
      </div>
      <div className="list-item-actions">
        <Button variant="secondary" size="sm" onClick={() => onEdit(pagamento)}>
          Editar
        </Button>
        <Button 
          variant="danger" 
          size="sm" 
          onClick={() => {
            if (window.confirm('Deseja realmente excluir este pagamento?')) {
              onDelete(pagamento.id);
            }
          }}
        >
          Excluir
        </Button>
      </div>
    </div>
  );
};

export default PagamentoItem;