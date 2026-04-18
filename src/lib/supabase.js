import { createClient } from '@supabase/supabase-js';

// No Cloudflare Pages, o Vite busca variáveis começadas com VITE_
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("ERRO: Variáveis de ambiente do Supabase não detectadas!");
}

export const supabase = createClient(
  supabaseUrl || '', 
  supabaseAnonKey || ''
);