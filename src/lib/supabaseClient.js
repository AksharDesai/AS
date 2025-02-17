import { createClient } from '@supabase/supabase-js';

// Use VITE-prefixed environment variables for Vite compatibility
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


