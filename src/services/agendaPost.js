// src/services/agendaPostService.js
import { supabase } from './supabase';

export const agendaPostService = {
  async getAll() {
    const { data, error } = await supabase
      .from('agendamentos')
      .select(`
        *,
        cliente:cliente_id (id, nome),
        agencia:agencia_id (id, nome)
      `)
      .order('data_publicacao', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('agendamentos')
      .select(`
        *,
        cliente:cliente_id (id, nome),
        agencia:agencia_id (id, nome)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(agendamento) {
    const payload = {
      cliente_id: agendamento.cliente_id,
      agencia_id: agendamento.agencia_id || null,
      plataforma: agendamento.plataforma,
      data_publicacao: agendamento.data_publicacao,
      status: agendamento.status || 'agendado',
      descricao: agendamento.descricao || '',
      hashtags: agendamento.hashtags || '',
      imagem: agendamento.imagem || '',
      imagem_nome: agendamento.imagem_nome || ''
    };

    const { data, error } = await supabase
      .from('agendamentos')
      .insert(payload)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async update(id, updateData) {
    const payload = {
      cliente_id: updateData.cliente_id,
      agencia_id: updateData.agencia_id || null,
      plataforma: updateData.plataforma,
      data_publicacao: updateData.data_publicacao,
      status: updateData.status,
      descricao: updateData.descricao || '',
      hashtags: updateData.hashtags || '',
      imagem: updateData.imagem || '',
      imagem_nome: updateData.imagem_nome || ''
    };

    const { data, error } = await supabase
      .from('agendamentos')
      .update(payload)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async delete(id) {
    const { error } = await supabase
      .from('agendamentos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};