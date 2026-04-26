import { createClient } from '@supabase/supabase-js';
import { useAuth0 } from '@auth0/auth0-react';
import { useCallback, useRef } from 'react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const useSupabase = () => {
  const { getAccessTokenSilently } = useAuth0();
  const clientRef = useRef(null);
  const tokenRef = useRef(null);

  const getClient = useCallback(async () => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: supabaseUrl,
        },
      });

      tokenRef.current = token;

      if (!clientRef.current) {
        clientRef.current = createClient(supabaseUrl, supabaseAnonKey, {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
          },
          global: {
            fetch: async (url, options = {}) => {
              const { headers: existingHeaders, ...restOptions } = options;
              
              // Supabase'in set ettiği Content-Type'ı koru,
              // sadece Authorization ve apikey'i ekle/override et
              return fetch(url, {
                ...restOptions,
                headers: {
                  'Content-Type': 'application/json', // default, Supabase override edebilir
                  ...existingHeaders,                  // Supabase'in header'ları (Content-Type dahil) üstten gelir
                  apikey: supabaseAnonKey,
                  Authorization: `Bearer ${tokenRef.current}`,
                },
              });
            },
          },
        });
      } else {
        tokenRef.current = token;
      }

      return clientRef.current;
    } catch (error) {
      console.error("Supabase client hatası:", error);
      throw error;
    }
  }, [getAccessTokenSilently]);

  return { getClient };
};