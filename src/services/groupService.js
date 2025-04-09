import { supabase } from './supabase';

export const groupService = {  

    async getAll() {
    const { data, error } = await supabase
      .from('grupo')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
    }, 

  async getById(id) {
    const { data, error } = await supabase
      .from('grupo_clientes')
      .select('*')
      .eq('usuario_id', id);
    
    if (error) throw error;
    return data;
  },
};