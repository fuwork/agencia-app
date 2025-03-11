import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uvhymqggrunmuxgudljh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2aHltcWdncnVubXV4Z3VkbGpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1NjMyMTIsImV4cCI6MjA1NzEzOTIxMn0.suyRqurwzfrdtqeiXH5nRyxGvPb2alHC7LBIDbv5yaA';

export const supabase = createClient(supabaseUrl, supabaseKey);


// Função de teste para verificar a conexão
export const testSupabaseConnection = async () => {
    try {
      console.log('Testando conexão com Supabase...');
      const { data, error } = await supabase.from('clientes').select('count()', { count: 'exact' });
      
      if (error) {
        console.error('Erro na conexão com Supabase:', error);
        return { success: false, error };
      }
      
      console.log('Conexão com Supabase estabelecida com sucesso!');
      return { success: true, data };
    } catch (e) {
      console.error('Erro ao testar conexão com Supabase:', e);
      return { success: false, error: e };
    }
  };