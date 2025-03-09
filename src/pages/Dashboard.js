// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { clienteService } from '../services/clienteService';
import { agenciaService } from '../services/agenciaService';
import { pagamentoService } from '../services/pagamentoService';
import Card from '../components/ui/Card';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalAgencias: 0,
    totalPagamentos: 0,
    valorTotalPagamentos: 0,
    pagamentosPendentes: 0,
    pagamentosConcluidos: 0
  });
  
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientes, agencias, pagamentos] = await Promise.all([
          clienteService.getAll(),
          agenciaService.getAll(),
          pagamentoService.getAll()
        ]);
        
        const valorTotal = pagamentos.reduce((acc, p) => acc + (parseFloat(p.valor) || 0), 0);
        const pendentes = pagamentos.filter(p => p.status === 'pendente').length;
        const concluidos = pagamentos.filter(p => p.status === 'concluido').length;
        
        setStats({
          totalClientes: clientes.length,
          totalAgencias: agencias.length,
          totalPagamentos: pagamentos.length,
          valorTotalPagamentos: valorTotal,
          pagamentosPendentes: pendentes,
          pagamentosConcluidos: concluidos
        });
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) {
    return <div className="loading">Carregando dashboard...</div>;
  }
  
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      <div className="stats-grid">
        <Card title="Clientes" className="stat-card">
          <div className="stat-value">{stats.totalClientes}</div>
          <div className="stat-label">Total de clientes</div>
        </Card>
        
        <Card title="Agências" className="stat-card">
          <div className="stat-value">{stats.totalAgencias}</div>
          <div className="stat-label">Total de agências</div>
        </Card>
        
        <Card title="Pagamentos" className="stat-card">
          <div className="stat-value">{stats.totalPagamentos}</div>
          <div className="stat-label">Total de pagamentos</div>
        </Card>
        
        <Card title="Valor Total" className="stat-card">
          <div className="stat-value">
            {stats.valorTotalPagamentos.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}
          </div>
          <div className="stat-label">Valor total dos pagamentos</div>
        </Card>
      </div>
      
      <div className="dashboard-row">
        <Card title="Status dos Pagamentos" className="status-card">
          <div className="status-container">
            <div className="status-item">
              <div className="status-badge status-pending">{stats.pagamentosPendentes}</div>
              <div className="status-label">Pendentes</div>
            </div>
            
            <div className="status-item">
              <div className="status-badge status-success">{stats.pagamentosConcluidos}</div>
              <div className="status-label">Concluídos</div>
            </div>
            
            <div className="status-item">
              <div className="status-badge">{stats.totalPagamentos - stats.pagamentosPendentes - stats.pagamentosConcluidos}</div>
              <div className="status-label">Outros</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;