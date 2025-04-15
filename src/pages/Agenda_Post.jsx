import React, { useState, useEffect } from 'react';
import { agendaPostService } from '../services/agendamentoSerivce';
import PostList from '../components/Agenda_Post/PostList';
import PostForm from '../components/Agenda_Post/PostForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { webhookService } from '../services/webhookService';

const AgendaPost = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAgendamento, setCurrentAgendamento] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchAgendamentos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await agendaPostService.getAll();
      setAgendamentos(data);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      setError('Erro ao carregar a lista de agendamentos.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAgendamentos();
  }, []);
  
  const handleOpenModal = (agendamento = null) => {
    setCurrentAgendamento(agendamento);
    setIsModalOpen(true);
    setError(null);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentAgendamento(null);
    setError(null);
  };
  
  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      console.log('PostData:', formData);
      await webhookService.sendPost(formData);

      fetchAgendamentos(); 
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
      setError(`Erro ao salvar agendamento: ${error.message || 'Tente novamente mais tarde.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async (id) => {
    setError(null);
    if (window.confirm('Tem certeza que deseja excluir este agendamento?')) {
      try {
        await agendaPostService.delete(id);
        fetchAgendamentos();
      } catch (error) {
        console.error('Erro ao excluir agendamento:', error);
        setError(`Erro ao excluir agendamento: ${error.message || 'Tente novamente mais tarde.'}`);
      }
    }
  };
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Agendamento de Post</h1>
        <Button onClick={() => handleOpenModal()}>Agendar Post</Button>
      </div>
      
      {error && <div className="error-alert">{error}</div>}
      
      {loading ? (
        <div className="loading">Carregando agendamentos...</div>
      ) : (
        <PostList 
          agendamentos={agendamentos} 
          onEdit={handleOpenModal} 
          onDelete={handleDelete} 
        />
      )}
      
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={currentAgendamento ? 'Editar Agendamento' : 'Novo Agendamento'}
        size="fullscreen"
      >
        {error && <div className="error-alert">{error}</div>}
        <PostForm 
          agendamento={currentAgendamento} 
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
};

export default AgendaPost;