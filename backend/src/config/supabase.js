
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseSecretKey);

if (!isSupabaseConfigured) {
  console.warn('[Supabase Config] Missing SUPABASE_URL or SUPABASE_SECRET_KEY environment variables.');
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseSecretKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

export default supabase;
