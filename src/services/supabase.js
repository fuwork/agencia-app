import { createClient } from '@supabase/supabase-js';

// Prefixo REACT_APP_ necessário para variáveis de ambiente em aplicativos React
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

// Verificando e alertando se as variáveis de ambiente não estão definidas
if (!supabaseUrl || !supabaseKey) {
  console.warn(
    'Variáveis de ambiente do Supabase não encontradas. ' +
    'Verifique se REACT_APP_SUPABASE_URL e REACT_APP_SUPABASE_KEY estão definidas no arquivo .env'
  );
}

// Criar cliente Supabase com valores reais ou fallback
export const supabase = createClient(
  supabaseUrl,
  supabaseKey 
);

// Função para testar a conexão com o Supabase
export const testSupabaseConnection = async () => {
  try {
    console.log('Testando conexão com Supabase...');
    console.log('URL do Supabase:', supabaseUrl);
    
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