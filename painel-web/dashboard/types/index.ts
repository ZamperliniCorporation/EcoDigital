import type { User } from '@supabase/supabase-js';

// Exporta o tipo User do Supabase para que possamos usá-lo em nosso projeto
export type { User };

// Nossa definição de perfil, que será usada em toda a aplicação
export type Profile = {
  full_name: string | null;
  avatar_url: string | null;
} | null;