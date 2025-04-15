import React, { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ImageUploadField from './ImageUpload';
import PostPreview from './PostPreview'; 
import { clienteService } from '../../services/clienteService';
import { webhookService } from '../../services/webhookService';
import { supabase } from '../../services/supabase';
import { DateTime } from 'luxon';

const HoraSelector = ({ value, onChange, error }) => {
  // Gera horários das 7:00 às 22:00 
  const horarios = [];
  for (let hora = 7; hora <= 22; hora++) {
    horarios.push(`${String(hora).padStart(2, '0')}:00`);  
    if (hora < 22) {
      horarios.push(`${String(hora).padStart(2, '0')}:30`);
    }
  }

  return (
    <div className="form-group">
      <label htmlFor="hora_publicacao" className="form-label">Horário da Publicação</label>
      <select
        id="hora_publicacao"
        name="hora_publicacao"
        value={value}
        onChange={(e) => onChange({ 
          target: { 
            name: 'hora_publicacao', 
            value: e.target.value
          } 
        })}
        className={`form-select ${error ? 'input-error' : ''}`}
        required
      >
        {horarios.map((horario) => (
          <option key={horario} value={horario}>
            {horario}
          </option>
        ))}
      </select>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};



let scheduled_time = DateTime.now().setZone('America/Sao_Paulo');

console.log("Horario para Initial State: ", scheduled_time.toString());

const PostForm = ({ agendamento = {}, onSubmit, onClose, isLoading = false, onChange }) => {
  const initialState = {
    cliente_id: '',
    plataforma: '',
    data_publicacao: scheduled_time.toString().split('T')[0],
    hora_publicacao: '08:00',
    status: 'agendado',
    descricao: '',
    hashtags: '',
    imagem: '',
    tipoImagem: 'url',
    tipoConteudo: 'Carrousel',
    imagem_nome: ''
  };

  const [formData, setFormData] = useState(initialState);
  const [clientes, setClientes] = useState([]);
  const [errors, setErrors] = useState({});
  const [loadingDependencies, setLoadingDependencies] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [carouselImages, setCarouselImages] = useState([]);
  const [postSuccess, setPostSuccess] = useState(false);
  // const [nextId, setNextId] = useState(1);

  // useEffect(() => {
  //   const fetchLastId = async () => {
  //     try {
  //       // Busca o último ID do Supabase
  //       const { data, error } = await supabase
  //         .from('agendamentos')
  //         .select('id_publicacao')
  //         .order('id_publicacao', { ascending: false })
  //         .limit(1);
        
  //       if (error) throw error;
        
  //       // Se encontrou algum registro, incrementa 1 para o próximo ID
  //       if (data && data.length > 0) {
  //         setNextId(data[0].id_publicacao + 1);
  //       }
  //     } catch (error) {
  //       console.error('Erro ao buscar último ID:', error);
  //     }
  //   };
    
  //   fetchLastId();
  // }, []);

  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        const [clientesData] = await Promise.all([
          clienteService.getAll(),
        ]);
        setClientes(clientesData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setError('Erro ao carregar dados necessários.');
      } finally {
        setLoadingDependencies(false);
      }
    };
    
    fetchDependencies();
  }, []);

  useEffect(() => {
    if (!agendamento || Object.keys(agendamento).length === 0) {
      setFormData(initialState);
      setCarouselImages([]);
      return;
    }

    // Formata data e hora
    let data = initialState.data_publicacao;
    let hora = '12:30';
    
    if (agendamento.data_publicacao) {
      const dataObj = DateTime.fromISO(agendamento.data_publicacao).setZone('America/Sao_Paulo');
      console.log("Data do agendamento: ", dataObj.toString());
      data = dataObj.toString().split('T')[0];
      const horas = dataObj.getHours();
      const minutos = dataObj.getMinutes();
      const ajusteMinutos = minutos < 30 ? '00' : '30';
      hora = `${String(horas).padStart(2, '0')}:${ajusteMinutos}`;
    }

    // Determina tipo de imagem
    const tipoImagem = agendamento.imagem?.startsWith('data:image') ? 'upload' : 'url';

    const updatedFormData = {
      ...initialState,
      ...agendamento,
      data_publicacao: data,
      hora_publicacao: hora,
      tipoImagem,
      imagem_nome: agendamento.imagem_nome || ''
    };

    setFormData(updatedFormData);

    // Se existirem imagens de carrossel, carregá-las
    if (agendamento.carouselImages) {
      setCarouselImages(agendamento.carouselImages);
    }

    // Comunica ao componente para atualizar o preview
    if (onChange) {
      onChange(updatedFormData, agendamento.carouselImages || []);
    }
  }, [agendamento, onChange]);

  // Atualiza o preview sempre que os dados do formulário mudarem
  useEffect(() => {
    if (onChange) {
      onChange(formData, carouselImages);
    }
  }, [formData, carouselImages, onChange]);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.cliente_id) newErrors.cliente_id = 'Cliente é obrigatório';
    if (!formData.plataforma) newErrors.plataforma = 'Plataforma é obrigatória';
    if (!formData.data_publicacao) newErrors.data_publicacao = 'Data é obrigatória';
    
    // Validação do horário
    if (!formData.hora_publicacao) {
      newErrors.hora_publicacao = 'Horário é obrigatório';
    } else {
      const [_, minutes] = formData.hora_publicacao.split(':');
      if (minutes !== '00' && minutes !== '30') {
        newErrors.hora_publicacao = 'O horário deve ser a cada 30 minutos (XX:00 ou XX:30)';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    
    if (onChange) {
      onChange(updatedFormData, carouselImages);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      setError(null);
      
      try {
        // Combina data e hora
        const dateString = new Date(`${formData.data_publicacao}T${formData.hora_publicacao}`);
        const combinedDateTime = DateTime.fromISO(dateString.toISOString()).setZone('America/Sao_Paulo');
        
        // Prepara dados para envio
        const submissionData = {
          ...formData,
          data_publicacao: combinedDateTime,
          // id_publicacao: nextId
        };

        // Remove campos auxiliares
        const { hora_publicacao, tipoImagem, imagem_nome, ...cleanData } = submissionData;
        
        await onSubmit(cleanData);

        console.log('Dados enviados:', cleanData);

        // Prepara dados para o webhook
        const webhookData = {
          ...cleanData,
          images: formData.tipoConteudo === 'Carrossel' 
            ? carouselImages.map(img => img.file)
            : [formData.imagem]
        };

        // Envia para o webhook
        await webhookService.sendPost(webhookData);

        setPostSuccess(true);

        setTimeout(() => {
          if (onClose) onClose();
        }, 2000);
      } catch (error) {
        console.error('Erro ao salvar post:', error);
        setError(error.message || 'Erro ao salvar o post. Tente novamente.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (loadingDependencies) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="split-layout">
      <div className="form-container">
        <form onSubmit={handleSubmit} className="agendamento-form">
          {error && (
            <div className="error-alert mb-4">
              {error}
            </div>
          )}

          {/* <div className="form-group">
            <label htmlFor="appointmentId" className="form-label">ID</label>
            <input 
              type="text" 
              id="appointmentId" 
              className="form-control" 
              value={nextId} 
              readOnly 
            />
          </div> */}

          {/* Campos do cliente */}
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

          <HoraSelector
            value={formData.hora_publicacao}
            onChange={handleChange}
            error={errors.hora_publicacao}
          />

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
            setFormData={(newFormData) => {
              setFormData(newFormData);
              
              if (onChange) {
                onChange(newFormData, carouselImages);
              }
            }}
            carouselImages={carouselImages}
            setCarouselImages={(newImages) => {
              setCarouselImages(newImages);
              if (onChange) {
                onChange(formData, newImages);
              }
            }}
            errors={errors}
          />

          

          <div className="form-actions">
            {postSuccess ? (
              <div className="success-message">Postagem agendada com sucesso!</div>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : agendamento?.id ? 'Atualizar' : 'Agendar Post'}
              </Button>
            )}
          </div>
        </form>
      </div>
      
      <div className="preview-section">
        <PostPreview 
          formData={formData} 
          carouselImages={carouselImages}
          clientes={clientes}
        />
      </div>
    </div>
  );
};

export default PostForm;