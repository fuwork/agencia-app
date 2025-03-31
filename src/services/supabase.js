import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

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