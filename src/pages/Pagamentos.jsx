// src/pages/Pagamentos.jsx - Versão corrigida
import React, { useState, useEffect } from 'react';
import { pagamentoService } from '../services/pagamentoService';
import PagamentoList from '../components/pagamento/PagamentoList';
import PagamentoForm from '../components/pagamento/PagamentoForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';

const Pagamentos = () => {
  const [pagamentos, setPagamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPagamento, setCurrentPagamento] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchPagamentos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await pagamentoService.getAll();
      setPagamentos(data);
    } catch (error) {
      console.error('Erro ao carregar pagamentos:', error);
      setError('Erro ao carregar a lista de pagamentos.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPagamentos();
  }, []);
  
  const handleOpenModal = (pagamento = null) => {
    setCurrentPagamento(pagamento);
    setIsModalOpen(true);
    setError(null);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPagamento(null);
    setError(null);
  };
  
  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    try {
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
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async (id) => {
    setError(null);
    try {
      await pagamentoService.delete(id);
      await fetchPagamentos();
    } catch (error) {
      console.error('Erro ao excluir pagamento:', error);
      setError(`Erro ao excluir pagamento: ${error.message || 'Tente novamente mais tarde.'}`);
    }
  };
  
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Gerenciar Pagamentos</h1>
        <Button onClick={() => handleOpenModal()}>Novo Pagamento</Button>
      </div>
      
      {error && <div className="error-alert">{error}</div>}
      
      {loading ? (
        <div className="loading">Carregando pagamentos...</div>
      ) : (
        <PagamentoList 
          pagamentos={pagamentos} 
          onEdit={handleOpenModal} 
          onDelete={handleDelete} 
        />
      )}
      
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={currentPagamento ? 'Editar Pagamento' : 'Novo Pagamento'}
        size="lg"
      >
        {error && <div className="error-alert">{error}</div>}
        <PagamentoForm 
          pagamento={currentPagamento} 
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
};

export default Pagamentos;