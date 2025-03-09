// src/services/pagamentoService.js
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
    return data;
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
    return data[0];
  },
  
  async update(id, pagamento) {
    const { data, error } = await supabase
      .from('pagamentos')
      .update(pagamento)
      .eq('id', id)
      .select();
    
    if (error) throw error;
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