import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Validate URL format
let validatedUrl: string;
try {
  // Ensure URL has protocol
  validatedUrl = supabaseUrl.startsWith('http') 
    ? supabaseUrl 
    : `https://${supabaseUrl}`;
  new URL(validatedUrl); // Validate URL format
} catch (error) {
  throw new Error('Invalid Supabase URL format. Please check your .env file.');
}

export const supabase = createClient<Database>(validatedUrl, supabaseKey);