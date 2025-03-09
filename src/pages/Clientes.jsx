// src/pages/Clientes.jsx
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
  
  const fetchClientes = async () => {
    setLoading(true);
    try {
      const data = await clienteService.getAll();
      setClientes(data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      alert('Erro ao carregar a lista de clientes.');
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
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentCliente(null);
  };
  
  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (formData.id) {
        await clienteService.update(formData.id, formData);
      } else {
        await clienteService.create(formData);
      }
      fetchClientes();
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      alert('Erro ao salvar cliente.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async (id) => {
    try {
      await clienteService.delete(id);
      fetchClientes();
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      alert('Erro ao excluir cliente.');
    }
  };
  
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Gerenciar Clientes</h1>
        <Button onClick={() => handleOpenModal()}>Novo Cliente</Button>
      </div>
      
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