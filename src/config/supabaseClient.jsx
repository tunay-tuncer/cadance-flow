import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// --- YENİ: Standart/Anonim İstemci (Misafir Erişimi İçin) ---
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- MEVCUT: Tokenlı İstemci (Giriş Yapanlar İçin) ---
export const getSupabase = (accessToken) => {
    return createClient(supabaseUrl, supabaseAnonKey, {
        global: {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
    });
};