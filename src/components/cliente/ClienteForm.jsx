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
    
    // Validação para CPF/CNPJ
    const cpfCnpjNumeros = formData.cpf_cnpj.replace(/\D/g, '');
    if (cpfCnpjNumeros.length !== 11 && cpfCnpjNumeros.length !== 14) {
      newErrors.cpf_cnpj = 'CPF/CNPJ inválido';
    }
    
    // Validação para telefone
    const telefoneNumeros = formData.telefone.replace(/\D/g, '');
    if (telefoneNumeros && (telefoneNumeros.length < 10 || telefoneNumeros.length > 11)) {
      newErrors.telefone = 'Telefone inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const formatCpfCnpj = (value) => {
    const numeros = value.replace(/\D/g, '');
    
    if (numeros.length <= 11) {
      // Formatar como CPF: 000.000.000-00
      return numeros
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      // Formatar como CNPJ: 00.000.000/0000-00
      return numeros
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
    }
  };
  
  const formatTelefone = (value) => {
    const numeros = value.replace(/\D/g, '');
    
    if (numeros.length <= 10) {
      // Formato (00) 0000-0000
      return numeros
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    } else {
      // Formato (00) 00000-0000
      return numeros
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'cpf_cnpj') {
      // Limita a 18 caracteres (tamanho máximo do CNPJ formatado)
      if (value.length <= 18) {
        setFormData(prev => ({
          ...prev,
          [name]: formatCpfCnpj(value)
        }));
      }
    } else if (name === 'telefone') {
      // Limita a 15 caracteres (tamanho máximo do telefone formatado)
      if (value.length <= 15) {
        setFormData(prev => ({
          ...prev,
          [name]: formatTelefone(value)
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
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
        error={errors.telefone}
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
          {isLoading ? 'Salvando...' : cliente?.id ? 'Atualizar' : 'Cadastrar'}
        </Button>
      </div>
    </form>
  );
};

export default ClienteForm;