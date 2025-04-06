import React, { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { clienteService } from '../../services/clienteService';
import { agenciaService } from '../../services/agenciaService';

const PagamentoForm = ({ pagamento = {}, onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    cliente_id: '',
    agencia_id: '',
    valor: '',
    data_pagamento: new Date().toISOString().split('T')[0],
    metodo_pagamento: '',
    status: 'pendente',
    descricao: '',
    ...pagamento
  });
  
  const [valorFormatado, setValorFormatado] = useState('');
  const [clientes, setClientes] = useState([]);
  const [agencias, setAgencias] = useState([]);
  const [errors, setErrors] = useState({});
  const [loadingDependencies, setLoadingDependencies] = useState(true);
  
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
  
  useEffect(() => {
    setFormData({
      cliente_id: '',
      agencia_id: '',
      valor: '',
      data_pagamento: new Date().toISOString().split('T')[0],
      metodo_pagamento: '',
      status: 'pendente',
      descricao: '',
      ...pagamento
    });
    
    // Formatar o valor inicial quando o componente é carregado com dados existentes
    if (pagamento?.valor) {
      setValorFormatado(formatarValorParaExibicao(pagamento.valor));
    }
  }, [pagamento]);
  
  const formatarValorParaExibicao = (valor) => {
    if (!valor && valor !== 0) return '';
    
    // Converter para string e garantir que seja um número válido
    const valorNumerico = parseFloat(valor);
    if (isNaN(valorNumerico)) return '';
    
    // Formatar como moeda brasileira (sem o símbolo de R$)
    return valorNumerico.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  const formatarValorParaArmazenamento = (valor) => {
    if (!valor) return '';
    
    // Remove todos os caracteres não numéricos exceto o ponto ou vírgula decimal
    const apenasNumerosEVirgula = valor.replace(/[^\d.,]/g, '');
    
    // Substitui vírgula por ponto para garantir que o valor seja um número válido em JavaScript
    const valorFormatado = apenasNumerosEVirgula.replace(',', '.');
    
    return valorFormatado;
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.cliente_id) newErrors.cliente_id = 'Cliente é obrigatório';
    if (!formData.valor || formData.valor <= 0) newErrors.valor = 'Valor deve ser maior que zero';
    if (!formData.data_pagamento) newErrors.data_pagamento = 'Data é obrigatória';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (name === 'valor') {
      // Tratamento especial para o campo de valor
      handleValorChange(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) : value
      }));
    }
  };
  
  const handleValorChange = (valor) => {
    // Remove qualquer formatação existente para obter apenas os dígitos
    const apenasDigitos = valor.replace(/\D/g, '');
    
    // Se não houver dígitos, limpa o campo
    if (!apenasDigitos) {
      setValorFormatado('');
      setFormData(prev => ({ ...prev, valor: '' }));
      return;
    }
    
    // Converte para centavos e depois para o formato de moeda
    const valorEmCentavos = parseInt(apenasDigitos, 10);
    const valorDecimal = valorEmCentavos / 100;
    
    // Atualiza o estado do valor formatado para exibição
    const novoValorFormatado = valorDecimal.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    setValorFormatado(novoValorFormatado);
    
    // Atualiza o valor no formData para o valor numérico
    setFormData(prev => ({ ...prev, valor: valorDecimal }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };
  
  if (loadingDependencies) {
    return <div className="loading">Carregando...</div>;
  }
  
  return (
    <form onSubmit={handleSubmit}>
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
          <option value="">Selecione sua agência</option>
          {agencias.map(agencia => (
            <option key={agencia.id} value={agencia.id}>{agencia.nome}</option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="valor" className="form-label">Valor</label>
        <div className="input-group">
          <span className="input-group-text">R$</span>
          <input
            type="text"
            id="valor"
            name="valor"
            value={valorFormatado}
            onChange={handleChange}
            placeholder="0,00"
            className={`form-input ${errors.valor ? 'input-error' : ''}`}
            required
          />
        </div>
        {errors.valor && <div className="error-message">{errors.valor}</div>}
      </div>
      
      <Input
        label="Data do Pagamento"
        type="date"
        id="data_pagamento"
        name="data_pagamento"
        value={formData.data_pagamento}
        onChange={handleChange}
        required
        error={errors.data_pagamento}
      />
      
      <div className="form-group">
        <label htmlFor="metodo_pagamento" className="form-label">Método de Pagamento</label>
        <select
          id="metodo_pagamento"
          name="metodo_pagamento"
          value={formData.metodo_pagamento}
          onChange={handleChange}
          className="form-select"
        >
          <option value="">Selecione um método</option>
          <option value="pix">PIX</option>
          <option value="cartao">Cartão de Crédito</option>
          <option value="boleto">Boleto</option>
          <option value="dinheiro">Dinheiro</option>
          <option value="transferencia">Transferência</option>
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="status" className="form-label">Status</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="form-select"
        >
          <option value="pendente">Pendente</option>
          <option value="processando">Processando</option>
          <option value="concluido">Concluído</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="descricao" className="form-label">Descrição</label>
        <textarea
          id="descricao"
          name="descricao"
          value={formData.descricao}
          onChange={handleChange}
          placeholder="Descrição do pagamento"
          className="form-textarea"
        />
      </div>
      
      <div className="form-actions">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : pagamento?.id ? 'Atualizar' : 'Cadastrar'}
        </Button>
      </div>
    </form>
  );
};

export default PagamentoForm;