// src/services/agendaPostService.js
import { supabase } from './supabase';

export const agendaPostService = {
  async getAll() {
    try {
      let query = supabase
        .from('fila_processamento')
        .select('*')
        .order('created_at', { ascending: false });
      
      // // Aplicar filtros se fornecidos
      // if (filters?.client_id) {

      //   query = query.filter('payload->>client_id', 'eq', filters.client_id);
      // }
      
      // if (filters?.status) {
      //   query = query.filter('payload->>status', 'eq', filters.status);
      // }
      
      // if (filters?.platform) {
      //   query = query.filter('payload->>platform', 'eq', filters.platform);
      // }
      
      const { data, error } = await query;
      
      if (error) throw error;

      return data || 'nao encontrado';
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('fila_processamento')
        .select('*')
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching post by ID:', error);
      throw error;
    }
  },
  
  async delete(id) {
    try {
      const { error } = await supabase
        .from('fila_processamento')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  },
  
};