import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dxgxsftwwwleddnsthad.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4Z3hzZnR3d3dsZWRkbnN0aGFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1NDQ5NzUsImV4cCI6MjA1NzEyMDk3NX0.JsopNBrxm7BwWTupmuz4Xe3W4opB2eLwT4q0FavQc0M';

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