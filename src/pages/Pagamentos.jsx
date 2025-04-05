import React, { useState, useEffect } from 'react';
import { Modal, Table, Spinner, Badge, Button, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { pagamentoService } from '../services/pagamentoService';
import { clienteService } from '../services/clienteService'; // Alterado para clienteService
import PagamentoForm from '../components/pagamento/PagamentoForm';

const Pagamentos = () => {
  const [pagamentos, setPagamentos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [pagamentosFiltrados, setPagamentosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPagamento, setCurrentPagamento] = useState(null);
  
  // Estados para os filtros
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [filtroCliente, setFiltroCliente] = useState(''); // Alterado de filtroAgencia para filtroCliente
  const [filtroData, setFiltroData] = useState('');

  // Função para buscar pagamentos
  const fetchPagamentos = async () => {
    try {
      const data = await pagamentoService.getAll();
      setPagamentos(data);
      setPagamentosFiltrados(data);
      return data;
    } catch (error) {
      console.error('Erro ao carregar pagamentos:', error);
      setError('Erro ao carregar a lista de pagamentos.');
      return [];
    }
  };

  // Função para buscar clientes
  const fetchClientes = async () => {
    try {
      const data = await clienteService.getAll(); // Alterado para clienteService
      setClientes(data);
      return data;
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      setError('Erro ao carregar a lista de clientes.');
      return [];
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        await Promise.all([
          fetchPagamentos(),
          fetchClientes() // Alterado para fetchClientes
        ]);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setError('Erro ao carregar dados. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Aplica filtros quando eles mudam
  useEffect(() => {
    aplicarFiltros();
  }, [filtroStatus, filtroCliente, filtroData, pagamentos, clientes]);

  // Função para obter o nome do cliente pelo ID
  const getNomeCliente = (clienteId) => {
    if (!clienteId) return 'N/D';
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? cliente.nome : 'Cliente não encontrado';
  };

  const aplicarFiltros = () => {
    let resultado = [...pagamentos];
    
    // Filtro por status
    if (filtroStatus !== 'todos') {
      resultado = resultado.filter(pagamento => pagamento.status === filtroStatus);
    }
    
    // Filtro por cliente (nome)
    if (filtroCliente.trim() !== '') {
      const termo = filtroCliente.trim().toLowerCase();
      resultado = resultado.filter(pagamento => {
        const nomeCliente = getNomeCliente(pagamento.cliente_id).toLowerCase();
        return nomeCliente.includes(termo);
      });
    }
    
    // Filtro por data de pagamento
    if (filtroData) {
      const dataFiltro = new Date(filtroData);
      resultado = resultado.filter(pagamento => {
        if (!pagamento.data_pagamento) return false;
        const dataPagamento = new Date(pagamento.data_pagamento);
        return (
          dataPagamento.getFullYear() === dataFiltro.getFullYear() &&
          dataPagamento.getMonth() === dataFiltro.getMonth() &&
          dataPagamento.getDate() === dataFiltro.getDate()
        );
      });
    }
    
    setPagamentosFiltrados(resultado);
  };

  const limparFiltros = () => {
    setFiltroStatus('todos');
    setFiltroCliente('');
    setFiltroData('');
    setPagamentosFiltrados(pagamentos);
  };

  const handleOpenModal = (pagamento = null) => {
    setCurrentPagamento(pagamento);
    setIsModalOpen(true);
    setError(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPagamento(null);
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      if (formData.id) {
        await pagamentoService.update(formData.id, formData);
      } else {
        await pagamentoService.create(formData);
      }
      await fetchPagamentos();
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar pagamento:', error);
      setError(`Erro ao salvar pagamento: ${error.message || 'Tente novamente mais tarde.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este pagamento?')) {
      try {
        setLoading(true);
        await pagamentoService.delete(id);
        await fetchPagamentos();
      } catch (error) {
        console.error('Erro ao excluir pagamento:', error);
        setError(`Erro ao excluir pagamento: ${error.message || 'Tente novamente mais tarde.'}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const formatarData = (dataString) => {
    if (!dataString) return 'N/D';
    return new Date(dataString).toLocaleDateString('pt-BR');
  };

  const formatarMoeda = (valor) => {
    return valor?.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }) || 'R$ 0,00';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'concluido':
        return <Badge bg="success">Pago</Badge>;
      case 'processando':
        return <Badge bg="warning" text="dark">Processando</Badge>;
      case 'cancelado':
        return <Badge bg="danger">Cancelado</Badge>;
      default:
        return <Badge bg="secondary">Desconhecido</Badge>;
    }
  };

  return (
    <div className="page-container">
      <div className="page-header d-flex justify-content-between align-items-center mb-4">
        <h1>Gerenciar Pagamentos</h1>
        <Button variant="primary" onClick={() => handleOpenModal()}>
          Novo Pagamento
        </Button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Carregando...</span>
          </Spinner>
        </div>
      ) : (
        <>
          {/* Seção de Filtros */}
          <div className="mb-4 p-3 border rounded bg-light">
            <h5>Filtros</h5>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Select 
                    value={filtroStatus} 
                    onChange={(e) => setFiltroStatus(e.target.value)}
                  >
                    <option value="todos">Todos</option>
                    <option value="concluido">Concluído</option>
                    <option value="processando">Processando</option>
                    <option value="cancelado">Cancelado</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Cliente</Form.Label>
                  <InputGroup>
                    <Form.Control 
                      type="text" 
                      placeholder="Buscar por cliente"
                      value={filtroCliente} 
                      onChange={(e) => setFiltroCliente(e.target.value)}
                    />
                    {filtroCliente && (
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => setFiltroCliente('')}
                      >
                        ×
                      </Button>
                    )}
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Data de Pagamento</Form.Label>
                  <Form.Control 
                    type="date" 
                    value={filtroData} 
                    onChange={(e) => setFiltroData(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" size="sm" onClick={limparFiltros} className="me-2">
                Limpar Filtros
              </Button>
              <Button variant="primary" size="sm" onClick={aplicarFiltros}>
                Aplicar Filtros
              </Button>
            </div>
          </div>

          {/* Informação sobre resultados */}
          <div className="mb-3">
            Exibindo {pagamentosFiltrados.length} de {pagamentos.length} pagamentos
          </div>

          {/* Tabela de Pagamentos */}
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Valor</th>
                  <th>Data Pagamento</th>
                  <th>Status</th>
                  <th>Método</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {pagamentosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      Nenhum pagamento encontrado com os filtros selecionados.
                    </td>
                  </tr>
                ) : (
                  pagamentosFiltrados.map(pagamento => (
                    <tr key={pagamento.id}>
                      <td>{getNomeCliente(pagamento.cliente_id)}</td>
                      <td>{formatarMoeda(pagamento.valor)}</td>
                      <td>{formatarData(pagamento.data_pagamento)}</td>
                      <td>{getStatusBadge(pagamento.status)}</td>
                      <td>{pagamento.metodo_pagamento || 'N/D'}</td>
                      <td>
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          onClick={() => handleOpenModal(pagamento)}
                          className="me-2"
                        >
                          Editar
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          onClick={() => handleDelete(pagamento.id)}
                        >
                          Excluir
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </>
      )}

      {/* Modal para adicionar/editar pagamento */}
      <Modal show={isModalOpen} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {currentPagamento ? 'Editar Pagamento' : 'Novo Pagamento'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          <PagamentoForm 
            pagamento={currentPagamento} 
            clientes={clientes}
            onSubmit={handleSubmit}
            onCancel={handleCloseModal}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Pagamentos;