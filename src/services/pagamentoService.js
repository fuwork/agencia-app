// src/services/pagamentoService.js - Versão corrigida
import { supabase } from './supabase';

export const pagamentoService = {
  async getAll() {
    const { data, error } = await supabase
      .from('pagamentos')
      .select(`
        *,
        clientes!inner(id, nome)
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
        clientes!inner(id, nome)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async create(pagamento) {
    // Garante que estamos enviando apenas os campos necessários
    const payload = {
      cliente_id: pagamento.cliente_id,
      valor: pagamento.valor,
      data_pagamento: pagamento.data_pagamento,
      metodo_pagamento: pagamento.metodo_pagamento,
      status: pagamento.status,
      descricao: pagamento.descricao
    };

    const { data, error } = await supabase
      .from('pagamentos')
      .insert([payload])
      .select();
    
    if (error) throw error;
    if (!data || data.length === 0) {
      throw new Error('Erro ao criar pagamento: Nenhum dado retornado');
    }
    return data[0];
  },
  
  async update(id, pagamento) {
    // Garante que estamos enviando apenas os campos necessários
    const payload = {
      cliente_id: pagamento.cliente_id,
      valor: pagamento.valor,
      data_pagamento: pagamento.data_pagamento,
      metodo_pagamento: pagamento.metodo_pagamento,
      status: pagamento.status,
      descricao: pagamento.descricao
    };

    const { data, error } = await supabase
      .from('pagamentos')
      .update(payload)
      .eq('id', id)
      .select();
    
    if (error) throw error;
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