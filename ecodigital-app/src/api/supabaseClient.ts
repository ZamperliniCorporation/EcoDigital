import 'react-native-url-polyfill/auto'; // Polyfill para o Supabase funcionar no RN
import { createClient } from '@supabase/supabase-js';

// Pega as variáveis de ambiente que definimos no .env
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Validação para garantir que as chaves foram carregadas
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or Anon Key is missing. Check your .env file.");
}

// Cria e exporta uma instância única do cliente Supabase para ser usada em todo o app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);