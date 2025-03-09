// src/components/cliente/ClienteForm.jsx
import React, { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

const ClienteForm = ({ cliente = {}, onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    cpf_cnpj: '',
    ...cliente
  });
  
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      endereco: '',
      cpf_cnpj: '',
      ...cliente
    });
  }, [cliente]);
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.cpf_cnpj.trim()) newErrors.cpf_cnpj = 'CPF/CNPJ é obrigatório';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Nome"
        id="nome"
        name="nome"
        value={formData.nome}
        onChange={handleChange}
        placeholder="Nome completo"
        required
        error={errors.nome}
      />
      
      <Input
        label="Email"
        type="email"
        id="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="email@exemplo.com"
        required
        error={errors.email}
      />
      
      <Input
        label="Telefone"
        id="telefone"
        name="telefone"
        value={formData.telefone}
        onChange={handleChange}
        placeholder="(00) 00000-0000"
      />
      
      <Input
        label="Endereço"
        id="endereco"
        name="endereco"
        value={formData.endereco}
        onChange={handleChange}
        placeholder="Endereço completo"
      />
      
      <Input
        label="CPF/CNPJ"
        id="cpf_cnpj"
        name="cpf_cnpj"
        value={formData.cpf_cnpj}
        onChange={handleChange}
        placeholder="000.000.000-00 ou 00.000.000/0000-00"
        required
        error={errors.cpf_cnpj}
      />
      
      <div className="form-actions">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : cliente.id ? 'Atualizar' : 'Cadastrar'}
        </Button>
      </div>
    </form>
  );
};

export default ClienteForm;
