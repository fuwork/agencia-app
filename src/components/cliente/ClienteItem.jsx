// src/components/cliente/ClienteItem.jsx
import React from 'react';
import Button from '../ui/Button';

const ClienteItem = ({ cliente, onEdit, onDelete }) => {
  return (
    <div className="list-item">
      <div className="list-item-content">
        <h3>{cliente.nome}</h3>
        <div className="item-details">
          <p><strong>Email:</strong> {cliente.email}</p>
          <p><strong>Telefone:</strong> {cliente.telefone || 'Não informado'}</p>
          <p><strong>CPF/CNPJ:</strong> {cliente.cpf_cnpj}</p>
        </div>
      </div>
      <div className="list-item-actions">
        <Button variant="secondary" size="sm" onClick={() => onEdit(cliente)}>
          Editar
        </Button>
        <Button 
          variant="danger" 
          size="sm" 
          onClick={() => {
            if (window.confirm(`Deseja realmente excluir o cliente ${cliente.nome}?`)) {
              onDelete(cliente.id);
            }
          }}
        >
          Excluir
        </Button>
      </div>
    </div>
  );
};

export default ClienteItem;
