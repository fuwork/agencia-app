import React, { useState } from 'react';
import AgendamentoItem from './PostItem';

const AgendamentoList = ({ agendamentos = [], onEdit, onDelete }) => {
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroPlataforma, setFiltroPlataforma] = useState('');

  const listaAgendamentos = Array.isArray(agendamentos) ? agendamentos : [];

  const agendamentosFiltrados = listaAgendamentos
    .filter(a => {
      const status = a.payload?.status || '';
      return filtroStatus ? status === filtroStatus : true;
    })
    .filter(a => {
      const plataforma = a.payload?.platform || '';
      return filtroPlataforma ? plataforma === filtroPlataforma : true;
    });

  if (listaAgendamentos.length === 0) {
    return <div className="empty-list">Nenhum agendamento registrado.</div>;
  }

  return (
    <div>
      <div className="filter-container mb-4 flex gap-4">
        <div className="filter-group">
          <label htmlFor="filtro-status">Filtrar por status:</label>
          <select
            id="filtro-status"
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="filter-select border px-2 py-1 rounded"
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
            className="filter-select border px-2 py-1 rounded"
          >
            <option value="">Todas</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="ambos">Instagram e Facebook</option>
          </select>
        </div>
      </div>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-3 py-2 text-left">Cliente</th>
            <th className="border px-3 py-2 text-left">Plataforma</th>
            <th className="border px-3 py-2 text-left">Data</th>
            <th className="border px-3 py-2 text-left">Hora</th>
            <th className="border px-3 py-2 text-left">Status</th>
            <th className="border px-3 py-2 text-left">Legenda</th>
          </tr>
        </thead>
        <tbody>
          {agendamentosFiltrados.map((agendamento) => (
            <AgendamentoItem
              key={agendamento.id}
              agendamento={agendamento}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AgendamentoList;
