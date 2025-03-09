// src/components/agencia/AgenciaItem.jsx
import React from 'react';
import Button from '../ui/Button';

const AgenciaItem = ({ agencia, onEdit, onDelete }) => {
  return (
    <div className="list-item">
      <div className="list-item-content">
        <h3>{agencia.nome}</h3>
        <div className="item-details">
          <p><strong>Código:</strong> {agencia.codigo}</p>
          <p><strong>Gerente:</strong> {agencia.gerente || 'Não informado'}</p>
          <p><strong>Telefone:</strong> {agencia.telefone || 'Não informado'}</p>
        </div>
      </div>
      <div className="list-item-actions">
        <Button variant="secondary" size="sm" onClick={() => onEdit(agencia)}>
          Editar
        </Button>
        <Button 
          variant="danger" 
          size="sm" 
          onClick={() => {
            if (window.confirm(`Deseja realmente excluir a agência ${agencia.nome}?`)) {
              onDelete(agencia.id);
            }
          }}
        >
          Excluir
        </Button>
      </div>
    </div>
  );
};

export default AgenciaItem;
