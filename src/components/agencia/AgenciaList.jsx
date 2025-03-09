// src/components/agencia/AgenciaList.jsx
import React from 'react';
import AgenciaItem from './AgenciaItem';

const AgenciaList = ({ agencias, onEdit, onDelete }) => {
  if (agencias.length === 0) {
    return <div className="empty-list">Nenhuma agência cadastrada.</div>;
  }
  
  return (
    <div className="list">
      {agencias.map(agencia => (
        <AgenciaItem
          key={agencia.id}
          agencia={agencia}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default AgenciaList;
