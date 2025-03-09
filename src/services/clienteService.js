// src/services/clienteService.js
import { supabase } from './supabase';

export const clienteService = {
  async getAll() {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('nome');
    
    if (error) throw error;
    return data;
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
    return data[0];
  },
  
  async update(id, cliente) {
    const { data, error } = await supabase
      .from('clientes')
      .update(cliente)
      .eq('id', id)
      .select();
    
    if (error) throw error;
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
