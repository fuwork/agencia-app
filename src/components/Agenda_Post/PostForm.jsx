import React, { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ImageUploadField from './ImageUpload';
import { clienteService } from '../../services/clienteService';
import { agenciaService } from '../../services/agenciaService';

const AgendamentoForm = ({ agendamento = {}, onSubmit, isLoading = false }) => {
  // Estado inicial centralizado
  const initialState = {
    cliente_id: '',
    agencia_id: '',
    plataforma: '',
    data_publicacao: new Date().toISOString().split('T')[0],
    hora_publicacao: '12:00',
    status: 'agendado',
    descricao: '',
    hashtags: '',
    imagem: '',
    tipoImagem: 'url',
    imagem_nome: ''
  };

  const [formData, setFormData] = useState(initialState);
  const [clientes, setClientes] = useState([]);
  const [agencias, setAgencias] = useState([]);
  const [errors, setErrors] = useState({});
  const [loadingDependencies, setLoadingDependencies] = useState(true);

  // Carrega clientes e agências
  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        const [clientesData, agenciasData] = await Promise.all([
          clienteService.getAll(),
          agenciaService.getAll()
        ]);
        setClientes(clientesData);
        setAgencias(agenciasData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoadingDependencies(false);
      }
    };
    
    fetchDependencies();
  }, []);

  // Atualiza formData quando o agendamento prop muda
  useEffect(() => {
    if (!agendamento || Object.keys(agendamento).length === 0) {
      setFormData(initialState);
      return;
    }

    // Formata data e hora
    let data = initialState.data_publicacao;
    let hora = initialState.hora_publicacao;
    
    if (agendamento.data_publicacao) {
      const dataObj = new Date(agendamento.data_publicacao);
      data = dataObj.toISOString().split('T')[0];
      hora = `${String(dataObj.getHours()).padStart(2, '0')}:${String(dataObj.getMinutes()).padStart(2, '0')}`;
    }

    // Determina tipo de imagem
    const tipoImagem = agendamento.imagem?.startsWith('data:image') ? 'upload' : 'url';

    setFormData({
      ...initialState,
      ...agendamento,
      data_publicacao: data,
      hora_publicacao: hora,
      tipoImagem,
      // Garante que campos não-undefined sejam mantidos
      imagem_nome: agendamento.imagem_nome || ''
    });
  }, [agendamento]);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.cliente_id) newErrors.cliente_id = 'Cliente é obrigatório';
    if (!formData.plataforma) newErrors.plataforma = 'Plataforma é obrigatória';
    if (!formData.data_publicacao) newErrors.data_publicacao = 'Data é obrigatória';
    if (!formData.hora_publicacao) newErrors.hora_publicacao = 'Horário é obrigatório';
    if (!formData.imagem) newErrors.imagem = 'É necessário fornecer uma imagem';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Combina data e hora
      const combinedDateTime = new Date(`${formData.data_publicacao}T${formData.hora_publicacao}`);
      
      // Prepara dados para envio
      const submissionData = {
        ...formData,
        data_publicacao: combinedDateTime.toISOString(),
        // Garante que o ID seja passado na edição
        id: agendamento?.id || undefined
      };

      // Remove campos auxiliares
      const { hora_publicacao, tipoImagem, imagem_nome, ...cleanData } = submissionData;
      
      onSubmit(cleanData);
    }
  };

  if (loadingDependencies) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="agendamento-form">
      {/* Campos do cliente e agência */}
      <div className="form-group">
        <label htmlFor="cliente_id" className="form-label">Cliente</label>
        <select
          id="cliente_id"
          name="cliente_id"
          value={formData.cliente_id}
          onChange={handleChange}
          className={`form-select ${errors.cliente_id ? 'input-error' : ''}`}
          required
        >
          <option value="">Selecione um cliente</option>
          {clientes.map(cliente => (
            <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
          ))}
        </select>
        {errors.cliente_id && <div className="error-message">{errors.cliente_id}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="agencia_id" className="form-label">Agência</label>
        <select
          id="agencia_id"
          name="agencia_id"
          value={formData.agencia_id}
          onChange={handleChange}
          className="form-select"
        >
          <option value="">Selecione uma agência (opcional)</option>
          {agencias.map(agencia => (
            <option key={agencia.id} value={agencia.id}>{agencia.nome}</option>
          ))}
        </select>
      </div>

      {/* Restante dos campos do formulário permanecem iguais */}
      <div className="form-group">
        <label htmlFor="plataforma" className="form-label">Plataforma</label>
        <select
          id="plataforma"
          name="plataforma"
          value={formData.plataforma}
          onChange={handleChange}
          className={`form-select ${errors.plataforma ? 'input-error' : ''}`}
          required
        >
          <option value="">Selecione uma plataforma</option>
          <option value="instagram">Instagram</option>
          <option value="facebook">Facebook</option>
          <option value="ambos">Instagram e Facebook</option>
        </select>
        {errors.plataforma && <div className="error-message">{errors.plataforma}</div>}
      </div>

      <Input
        label="Data da Publicação"
        type="date"
        id="data_publicacao"
        name="data_publicacao"
        value={formData.data_publicacao}
        onChange={handleChange}
        required
        error={errors.data_publicacao}
      />

      <Input
        label="Horário da Publicação"
        type="time"
        id="hora_publicacao"
        name="hora_publicacao"
        value={formData.hora_publicacao}
        onChange={handleChange}
        required
        error={errors.hora_publicacao}
      />

      <div className="form-group">
        <label htmlFor="status" className="form-label">Status</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="form-select"
        >
          <option value="agendado">Agendado</option>
          <option value="publicando">Publicando</option>
          <option value="publicado">Publicado</option>
          <option value="falhou">Falhou</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="descricao" className="form-label">Legenda/Descrição</label>
        <textarea
          id="descricao"
          name="descricao"
          value={formData.descricao}
          onChange={handleChange}
          placeholder="Texto da legenda do post"
          className="form-textarea"
          rows="4"
        />
      </div>

      <div className="form-group">
        <label htmlFor="hashtags" className="form-label">Hashtags</label>
        <textarea
          id="hashtags"
          name="hashtags"
          value={formData.hashtags}
          onChange={handleChange}
          placeholder="#exemplo #hashtags #marketing"
          className="form-textarea"
          rows="2"
        />
      </div>

      <ImageUploadField 
        formData={formData}
        setFormData={setFormData}
        errors={errors}
      />

      <div className="form-actions">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : agendamento?.id ? 'Atualizar' : 'Agendar Post'}
        </Button>
      </div>
    </form>
  );
};

export default AgendamentoForm;