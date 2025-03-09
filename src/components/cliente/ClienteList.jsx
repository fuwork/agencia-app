
// src/components/cliente/ClienteList.jsx
import React from 'react';
import ClienteItem from './ClienteItem';

const ClienteList = ({ clientes, onEdit, onDelete }) => {
  if (clientes.length === 0) {
    return <div className="empty-list">Nenhum cliente cadastrado.</div>;
  }
  
  return (
    <div className="list">
      {clientes.map(cliente => (
        <ClienteItem
          key={cliente.id}
          cliente={cliente}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ClienteList;