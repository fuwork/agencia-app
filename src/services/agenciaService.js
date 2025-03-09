// src/services/agenciaService.js - Versão corrigida
import { supabase } from './supabase';

export const agenciaService = {
  async getAll() {
    const { data, error } = await supabase
      .from('agencias')
      .select('*')
      .order('nome');
    
    if (error) throw error;
    return data || [];
  },
  
  async getById(id) {
    const { data, error } = await supabase
      .from('agencias')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async create(agencia) {
    const { data, error } = await supabase
      .from('agencias')
      .insert([agencia])
      .select();
    
    if (error) throw error;
    // Verificar se data existe e tem pelo menos um item
    if (!data || data.length === 0) {
      throw new Error('Erro ao criar agência: Nenhum dado retornado');
    }
    return data[0];
  },
  
  async update(id, agencia) {
    const { data, error } = await supabase
      .from('agencias')
      .update(agencia)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    // Verificar se data existe e tem pelo menos um item
    if (!data || data.length === 0) {
      throw new Error('Erro ao atualizar agência: Nenhum dado retornado');
    }
    return data[0];
  },
  
  async delete(id) {
    const { error } = await supabase
      .from('agencias')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};
