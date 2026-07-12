import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase URL or Key is missing. Please set SUPABASE_URL and SUPABASE_KEY in your environment variables.');
}

export const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : new Proxy({} as any, {
      get() {
        throw new Error('Supabase client called but SUPABASE_URL or SUPABASE_KEY is missing in environment.');
      }
    });
