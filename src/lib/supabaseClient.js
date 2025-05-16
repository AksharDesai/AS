import { createClient } from '@supabase/supabase-js';

// In Vite, environment variables need to be prefixed with VITE_
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if the environment variables are defined
if (!supabaseUrl) {
  console.error('VITE_SUPABASE_URL is not defined in your environment');
}

if (!supabaseAnonKey) {
  console.error('VITE_SUPABASE_ANON_KEY is not defined in your environment');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


