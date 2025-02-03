import { createClient } from '@supabase/supabase-js';

// Use VITE-prefixed environment variables for Vite compatibility
const supabaseUrl = 'https://thknpfkhkurhbnivoloy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoa25wZmtoa3VyaGJuaXZvbG95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1MzU4NDEsImV4cCI6MjA1NDExMTg0MX0.cU-XRfGMNRolQMKK-Zig4jYU-_oWLG3i7LtxFjTOmek';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


