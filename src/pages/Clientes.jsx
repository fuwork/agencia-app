// src/pages/Clientes.jsx - Versão corrigida
import React, { useState, useEffect } from 'react';
import { clienteService } from '../services/clienteService';
import ClienteList from '../components/cliente/ClienteList';
import ClienteForm from '../components/cliente/ClienteForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCliente, setCurrentCliente] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchClientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await clienteService.getAll();
      setClientes(data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      setError('Erro ao carregar a lista de clientes.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchClientes();
  }, []);
  
  const handleOpenModal = (cliente = null) => {
    setCurrentCliente(cliente);
    setIsModalOpen(true);
    setError(null);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentCliente(null);
    setError(null);
  };
  
  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (formData.id) {
        await clienteService.update(formData.id, formData);
      } else {
        await clienteService.create(formData);
      }
      await fetchClientes();
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      setError(`Erro ao salvar cliente: ${error.message || 'Tente novamente mais tarde.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async (id) => {
    setError(null);
    try {
      await clienteService.delete(id);
      await fetchClientes();
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      setError(`Erro ao excluir cliente: ${error.message || 'Tente novamente mais tarde.'}`);
    }
  };
  
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Gerenciar Clientes</h1>
        <Button onClick={() => handleOpenModal()}>Novo Cliente</Button>
      </div>
      
      {error && <div className="error-alert">{error}</div>}
      
      {loading ? (
        <div className="loading">Carregando clientes...</div>
      ) : (
        <ClienteList 
          clientes={clientes} 
          onEdit={handleOpenModal} 
          onDelete={handleDelete} 
        />
      )}
      
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={currentCliente ? 'Editar Cliente' : 'Novo Cliente'}
      >
        {error && <div className="error-alert">{error}</div>}
        <ClienteForm 
          cliente={currentCliente} 
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
};

export default Clientes;