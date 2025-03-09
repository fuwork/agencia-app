// src/components/pagamento/PagamentoList.jsx
import React, { useState } from 'react';
import PagamentoItem from './PagamentoItem';

const PagamentoList = ({ pagamentos, onEdit, onDelete }) => {
  const [filtroStatus, setFiltroStatus] = useState('');
  
  const pagamentosFiltrados = filtroStatus 
    ? pagamentos.filter(p => p.status === filtroStatus)
    : pagamentos;
  
  if (pagamentos.length === 0) {
    return <div className="empty-list">Nenhum pagamento registrado.</div>;
  }
  
  return (
    <div>
      <div className="filter-container">
        <label htmlFor="filtro-status">Filtrar por status:</label>
        <select 
          id="filtro-status" 
          value={filtroStatus} 
          onChange={(e) => setFiltroStatus(e.target.value)}
          className="filter-select"
        >
          <option value="">Todos</option>
          <option value="pendente">Pendente</option>
          <option value="processando">Processando</option>
          <option value="concluido">Concluído</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>
      
      <div className="list">
        {pagamentosFiltrados.length > 0 ? (
          pagamentosFiltrados.map(pagamento => (
            <PagamentoItem
              key={pagamento.id}
              pagamento={pagamento}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        ) : (
          <div className="empty-list">Nenhum pagamento encontrado com esse filtro.</div>
        )}
      </div>
    </div>
  );
};

export default PagamentoList;