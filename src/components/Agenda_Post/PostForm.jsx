import React, { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ImageUploadField from './ImageUpload';
import PostPreview from './PostPreview'; 
import { clienteService } from '../../services/clienteService';
import { webhookService } from '../../services/webhookService';
import { supabase } from '../../services/supabase';
import { DateTime } from 'luxon';

const HoraSelector = ({ value, onChange, error, dataPublicacao }) => {
  const agora = DateTime.now().setZone('America/Sao_Paulo');
  const dataAtual = agora.toISODate();
  
  // Determina se a data selecionada é o dia atual
  const isToday = dataPublicacao === dataAtual;
  
  // Gera horários das 7:00 às 22:00
  const horarios = [];
  const horaAtual = agora.hour;
  const minutoAtual = agora.minute;
  
  for (let hora = 7; hora <= 22; hora++) {
    // Para o dia atual, só mostra horários futuros
    if (!isToday || hora > horaAtual || (hora === horaAtual && minutoAtual < 30)) {
      horarios.push(`${String(hora).padStart(2, '0')}:00`);
    }
    
    if (hora < 22) {
      // Para o dia atual, só mostra horários futuros
      if (!isToday || hora > horaAtual || (hora === horaAtual && minutoAtual < 30)) {
        horarios.push(`${String(hora).padStart(2, '0')}:30`);
      }
    }
  }

  // Se não houver horários disponíveis, adiciona uma mensagem
  if (horarios.length === 0) {
    horarios.push("Sem horários disponíveis para hoje");
  }

  // Verifica se o valor atual está na lista de horários disponíveis
  useEffect(() => {
    if (isToday && value && !horarios.includes(value)) {
      // Se o horário selecionado não estiver disponível, seleciona o primeiro disponível
      if (horarios.length > 0 && horarios[0] !== "Sem horários disponíveis para hoje") {
        onChange({ target: { name: 'hora_publicacao', value: horarios[0] } });
      }
    }
  }, [isToday, value, horarios]);

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
        disabled={horarios[0] === "Sem horários disponíveis para hoje"}
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

const DateSelector = ({ value, onChange, error }) => {
  const hoje = DateTime.now().setZone('America/Sao_Paulo').toISODate();
  
  return (
    <div className="form-group">
      <label htmlFor="data_publicacao" className="form-label">Data da Publicação</label>
      <input
        type="date"
        id="data_publicacao"
        name="data_publicacao"
        value={value}
        onChange={onChange}
        min={hoje}
        className={`form-control ${error ? 'input-error' : ''}`}
        required
      />
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
    data_publicacao: scheduled_time.toISODate(), 
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
      
      // Verifica se a data é no passado, se for, usa a data atual
      const agora = DateTime.now().setZone('America/Sao_Paulo');
      if (dataObj < agora) {
        data = agora.toISODate();
        // Ajusta hora também para próximo slot disponível
        const horaAtual = agora.hour;
        const minutoAtual = agora.minute;
        if (minutoAtual < 30) {
          hora = `${String(horaAtual).padStart(2, '0')}:30`;
        } else {
          hora = `${String(horaAtual + 1).padStart(2, '0')}:00`;
        }
      } else {
        data = dataObj.toISODate();
        const horas = dataObj.hour;
        const minutos = dataObj.minute;
        const ajusteMinutos = minutos < 30 ? '00' : '30';
        hora = `${String(horas).padStart(2, '0')}:${ajusteMinutos}`;
      }
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
    const agora = DateTime.now().setZone('America/Sao_Paulo');
    const dataPublicacao = DateTime.fromISO(formData.data_publicacao);
    
    if (!formData.cliente_id) newErrors.cliente_id = 'Cliente é obrigatório';
    if (!formData.plataforma) newErrors.plataforma = 'Plataforma é obrigatória';
    
    // Validação da data
    if (!formData.data_publicacao) {
      newErrors.data_publicacao = 'Data é obrigatória';
    } else if (dataPublicacao < agora.startOf('day')) {
      newErrors.data_publicacao = 'A data não pode ser no passado';
    }
    
    // Validação do horário
    if (!formData.hora_publicacao) {
      newErrors.hora_publicacao = 'Horário é obrigatório';
    } else {
      const [horaStr, minutosStr] = formData.hora_publicacao.split(':');
      const hora = parseInt(horaStr, 10);
      const minutos = parseInt(minutosStr, 10);
      
      if (minutos !== 0 && minutos !== 30) {
        newErrors.hora_publicacao = 'O horário deve ser a cada 30 minutos (XX:00 ou XX:30)';
      }
      
      // Verifica se a data e hora combinadas são no passado
      if (dataPublicacao.equals(agora.startOf('day'))) {
        const horaAtual = agora.hour;
        const minutoAtual = agora.minute;
        
        if (hora < horaAtual || (hora === horaAtual && minutos <= minutoAtual)) {
          newErrors.hora_publicacao = 'O horário não pode ser no passado';
        }
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

          <DateSelector
            value={formData.data_publicacao}
            onChange={handleChange}
            error={errors.data_publicacao}
          />

          <HoraSelector
            value={formData.hora_publicacao}
            onChange={handleChange}
            error={errors.hora_publicacao}
            dataPublicacao={formData.data_publicacao}
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