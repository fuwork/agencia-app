import React from 'react';
import Button from '../ui/Button';

const AgendamentoItem = ({ agendamento, onEdit, onDelete }) => {
  const formatarData = (dataString) => {
    if (!dataString) return '';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };
  
  const formatarHorario = (dataString) => {
    if (!dataString) return '';
    const data = new Date(dataString);
    return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };
  
  const getStatusClass = (status) => {
    switch (status) {
      case 'agendado': return 'status-pending';
      case 'publicando': return 'status-processing';
      case 'publicado': return 'status-success';
      case 'falhou': return 'status-danger';
      default: return '';
    }
  };
  
  const getPlataformaIcon = (plataforma) => {
    switch (plataforma) {
      case 'instagram': return '📸'; // Emoji para Instagram
      case 'facebook': return '👍'; // Emoji para Facebook
      case 'ambos': return '📱'; // Emoji para ambas plataformas
      default: return '📱';
    }
  };
  
  return (
    <div className="list-item">
      <div className="list-item-content">
        <h3>
          {agendamento.cliente?.nome || 'Cliente não disponível'}
          <span className={`status-badge ${getStatusClass(agendamento.status)}`}>
            {agendamento.status.charAt(0).toUpperCase() + agendamento.status.slice(1)}
          </span>
        </h3>
        <div className="item-details">
          <p>
            <strong>Plataforma:</strong> {getPlataformaIcon(agendamento.plataforma)} {agendamento.plataforma.charAt(0).toUpperCase() + agendamento.plataforma.slice(1)}
          </p>
          <p><strong>Data:</strong> {formatarData(agendamento.data_publicacao)}</p>
          <p><strong>Horário:</strong> {formatarHorario(agendamento.data_publicacao)}</p>
          <p><strong>Agência:</strong> {agendamento.agencia?.nome || 'Não informado'}</p>
          {agendamento.descricao && <p><strong>Legenda:</strong> {agendamento.descricao}</p>}
          {agendamento.hashtags && <p><strong>Hashtags:</strong> {agendamento.hashtags}</p>}
        </div>
      </div>
      <div className="list-item-actions">
        <Button variant="secondary" size="sm" onClick={() => onEdit(agendamento)}>
          Editar
        </Button>
        <Button 
          variant="danger" 
          size="sm" 
          onClick={() => {
            if (window.confirm('Deseja realmente excluir este agendamento?')) {
              onDelete(agendamento.id);
            }
          }}
        >
          Excluir
        </Button>
      </div>
    </div>
  );
};

export default AgendamentoItem;