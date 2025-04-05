import React, { useState } from 'react';
import AgendamentoItem from './PostItem';

const AgendamentoList = ({ agendamentos = [], onEdit, onDelete }) => {
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroPlataforma, setFiltroPlataforma] = useState('');
  
  // Garantir que agendamentos seja sempre um array
  const listaAgendamentos = Array.isArray(agendamentos) ? agendamentos : [];
  
  // Aplicar filtros em cascata
  const agendamentosFiltrados = listaAgendamentos
    .filter(a => filtroStatus ? a.status === filtroStatus : true)
    .filter(a => filtroPlataforma ? a.plataforma === filtroPlataforma : true);
  
  if (listaAgendamentos.length === 0) {
    return <div className="empty-list">Nenhum agendamento registrado.</div>;
  }
  
  return (
    <div>
      <div className="filter-container">
        <div className="filter-group">
          <label htmlFor="filtro-status">Filtrar por status:</label>
          <select 
            id="filtro-status" 
            value={filtroStatus} 
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="filter-select"
          >
            <option value="">Todos</option>
            <option value="agendado">Agendado</option>
            <option value="publicando">Publicando</option>
            <option value="publicado">Publicado</option>
            <option value="falhou">Falhou</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="filtro-plataforma">Filtrar por plataforma:</label>
          <select 
            id="filtro-plataforma" 
            value={filtroPlataforma} 
            onChange={(e) => setFiltroPlataforma(e.target.value)}
            className="filter-select"
          >
            <option value="">Todas</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="ambos">Instagram e Facebook</option>
          </select>
        </div>
      </div>
      
      <div className="list">
        {agendamentosFiltrados.length > 0 ? (
          agendamentosFiltrados.map(agendamento => (
            <AgendamentoItem
              key={agendamento.id}
              agendamento={agendamento}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        ) : (
          <div className="empty-list">Nenhum agendamento encontrado com esses filtros.</div>
        )}
      </div>
    </div>
  );
};

export default AgendamentoList;