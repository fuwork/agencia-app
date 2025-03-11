// src/services/clienteService.js - Versão corrigida
import { supabase } from './supabase';

export const clienteService = {
  async getAll() {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('nome');
    
    if (error) throw error;
    return data || [];
  },
  
  async getById(id) {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async create(cliente) {
    const { data, error } = await supabase
      .from('clientes')
      .insert([cliente])
      .select();
    
    if (error) throw error;
    // Verificar se data existe e tem pelo menos um item
    if (!data || data.length === 0) {
      throw new Error('Erro ao criar cliente: Nenhum dado retornado');
    }
    return data[0];
  },
  
  async update(id, cliente) {
    const { data, error } = await supabase
      .from('clientes')
      .update(cliente)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    // Verificar se data existe e tem pelo menos um item
    if (!data || data.length === 0) {
      throw new Error('Erro ao atualizar cliente: Nenhum dado retornado');
    }
    return data[0];
  },
  
  async delete(id) {
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};