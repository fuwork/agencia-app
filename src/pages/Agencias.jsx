// src/pages/Agencias.jsx - Versão corrigida
import React, { useState, useEffect } from 'react';
import { agenciaService } from '../services/agenciaService';
import AgenciaList from '../components/agencia/AgenciaList';
import AgenciaForm from '../components/agencia/AgenciaForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';

const Agencias = () => {
  const [agencias, setAgencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAgencia, setCurrentAgencia] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchAgencias = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await agenciaService.getAll();
      setAgencias(data);
    } catch (error) {
      console.error('Erro ao carregar agências:', error);
      setError('Erro ao carregar a lista de agências.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAgencias();
  }, []);
  
  const handleOpenModal = (agencia = null) => {
    setCurrentAgencia(agencia);
    setIsModalOpen(true);
    setError(null);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentAgencia(null);
    setError(null);
  };
  
  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (formData.id) {
        await agenciaService.update(formData.id, formData);
      } else {
        await agenciaService.create(formData);
      }
      await fetchAgencias();
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar agência:', error);
      setError(`Erro ao salvar agência: ${error.message || 'Tente novamente mais tarde.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async (id) => {
    setError(null);
    try {
      await agenciaService.delete(id);
      await fetchAgencias();
    } catch (error) {
      console.error('Erro ao excluir agência:', error);
      setError(`Erro ao excluir agência: ${error.message || 'Tente novamente mais tarde.'}`);
    }
  };
  
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Gerenciar Agências</h1>
        <Button onClick={() => handleOpenModal()}>Nova Agência</Button>
      </div>
      
      {error && <div className="error-alert">{error}</div>}
      
      {loading ? (
        <div className="loading">Carregando agências...</div>
      ) : (
        <AgenciaList 
          agencias={agencias} 
          onEdit={handleOpenModal} 
          onDelete={handleDelete} 
        />
      )}
      
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={currentAgencia ? 'Editar Agência' : 'Nova Agência'}
      >
        {error && <div className="error-alert">{error}</div>}
        <AgenciaForm 
          agencia={currentAgencia} 
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
};

export default Agencias;