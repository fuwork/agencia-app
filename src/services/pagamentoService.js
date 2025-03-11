// src/services/pagamentoService.js - Versão corrigida
import { supabase } from './supabase';

export const pagamentoService = {
  async getAll() {
    const { data, error } = await supabase
      .from('pagamentos')
      .select(`
        *,
        clientes (id, nome),
        agencias (id, nome)
      `)
      .order('data_pagamento', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },
  
  async getById(id) {
    const { data, error } = await supabase
      .from('pagamentos')
      .select(`
        *,
        clientes (id, nome),
        agencias (id, nome)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async create(pagamento) {
    const { data, error } = await supabase
      .from('pagamentos')
      .insert([pagamento])
      .select();
    
    if (error) throw error;
    // Verificar se data existe e tem pelo menos um item
    if (!data || data.length === 0) {
      throw new Error('Erro ao criar pagamento: Nenhum dado retornado');
    }
    return data[0];
  },
  
  async update(id, pagamento) {
    const { data, error } = await supabase
      .from('pagamentos')
      .update(pagamento)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    // Verificar se data existe e tem pelo menos um item
    if (!data || data.length === 0) {
      throw new Error('Erro ao atualizar pagamento: Nenhum dado retornado');
    }
    return data[0];
  },
  
  async delete(id) {
    const { error } = await supabase
      .from('pagamentos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};