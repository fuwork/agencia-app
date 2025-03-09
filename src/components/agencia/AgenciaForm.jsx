// src/components/agencia/AgenciaForm.jsx
import React, { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

const AgenciaForm = ({ agencia = {}, onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    nome: '',
    codigo: '',
    endereco: '',
    telefone: '',
    gerente: '',
    ...agencia
  });
  
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    setFormData({
      nome: '',
      codigo: '',
      endereco: '',
      telefone: '',
      gerente: '',
      ...agencia
    });
  }, [agencia]);
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.codigo.trim()) newErrors.codigo = 'Código é obrigatório';
    
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
        placeholder="Nome da agência"
        required
        error={errors.nome}
      />
      
      <Input
        label="Código"
        id="codigo"
        name="codigo"
        value={formData.codigo}
        onChange={handleChange}
        placeholder="Código da agência"
        required
        error={errors.codigo}
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
        label="Telefone"
        id="telefone"
        name="telefone"
        value={formData.telefone}
        onChange={handleChange}
        placeholder="(00) 0000-0000"
      />
      
      <Input
        label="Gerente"
        id="gerente"
        name="gerente"
        value={formData.gerente}
        onChange={handleChange}
        placeholder="Nome do gerente"
      />
      
      <div className="form-actions">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : agencia.id ? 'Atualizar' : 'Cadastrar'}
        </Button>
      </div>
    </form>
  );
};

export default AgenciaForm;