import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import Button from '../ui/Button';

const AgendamentoItem = ({ agendamento, onEdit, onDelete }) => {
  const scheduledTime = agendamento.payload?.scheduled_time;
  const [clienteNome, setClienteNome] = useState('');
  const [loadingCliente, setLoadingCliente] = useState(false);
  
  useEffect(() => {
    const fetchCliente = async () => {      
      const clientId = agendamento.payload?.client_id;
      if (!clientId) {
        setClienteNome('Cliente não disponível');
        return;
      }

      setLoadingCliente(true);
      try {
        const { data, error } = await supabase
          .from('clientes')
          .select('nome')
          .eq('id', clientId)
          .single();
        
        if (error) throw error;
        
        setClienteNome(data?.nome || `Cliente ID: ${clientId}`);
      } catch (error) {
        console.error('Erro ao buscar cliente:', error);
        setClienteNome(`Cliente ID: ${clientId}`);
      } finally {
        setLoadingCliente(false);
      }
    };
    
    fetchCliente();
  }, [agendamento]);

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
  
  const plataforma = agendamento.payload?.platform || 'N/A';
  const legenda = agendamento.payload?.caption || '';
  const status = agendamento.payload?.status || 'Desconhecido';
  
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'agendado': return '#FFC107'; 
      case 'publicado': return '#2ECC71'; 
      case 'falhou': return '#E74C3C'; 
      default: return '#95A5A6'; 
    }
  };
  
  const statusColor = getStatusColor(status);
  
  return (
    <tr className="agendamento-row">
      <td className="table-cell">
        {loadingCliente ? (
          <span style={{ color: '#999' }}>Carregando...</span>
        ) : (
          clienteNome || 'Cliente não disponível'
        )}
      </td>
      <td className="table-cell">{plataforma}</td>
      <td className="table-cell">{formatarData(scheduledTime)}</td>
      <td className="table-cell">{formatarHorario(scheduledTime)}</td>
      <td className="table-cell">
        <span 
          className="status-badge" 
          style={{ 
            backgroundColor: statusColor,
            color: '#FFFFFF',
            padding: '4px 8px',
            borderRadius: '4px',
            fontWeight: 'bold',
            display: 'inline-block'
          }}
        >
          {status}
        </span>
      </td>
      <td className="table-cell legenda-cell">{legenda}</td>
      {/* <td className="table-cell action-cell">
        <Button 
          className="edit-button"
          onClick={() => onEdit(agendamento)}
          style={{
            backgroundColor: '#3498DB',
            color: 'white',
            marginRight: '8px',
            padding: '6px 12px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Editar
        </Button>
        <Button 
          className="delete-button"
          onClick={() => {
            if (window.confirm('Deseja realmente excluir este agendamento?')) {
              onDelete(agendamento.id);
            }
          }}
          style={{
            backgroundColor: '#E74C3C',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Excluir
        </Button> 
      </td>*/}
      
      <style jsx>{`
        .agendamento-row {
          border-bottom: 1px solid #e0e0e0;
        }
        
        .agendamento-row:hover {
          background-color: #f5f5f5;
        }
        
        .table-cell {
          padding: 12px 8px;
          vertical-align: middle;
        }
        
        .cliente-cell {
          width: 15%;
        }
        
        .plataforma-cell {
          width: 10%;
        }
        
        .data-cell, .horario-cell {
          width: 10%;
        }
        
        .status-cell {
          width: 10%;
        }
        
        .legenda-cell {
          width: 35%;  /* Aumentada para dar mais espaço à legenda */
        }
        
        .legenda-container {
          min-width: 250px;  /* Largura mínima do contêiner */
          max-width: 400px;  /* Largura máxima do contêiner */
          line-height: 1.4;
          overflow-wrap: break-word;  /* Permite quebra de palavras longas */
          word-break: break-word;  /* Quebra palavras longas */
        }
        
        .action-cell {
          width: 10%;
          white-space: nowrap;
        }
      `}</style>
    </tr>
  );
};

export default AgendamentoItem;