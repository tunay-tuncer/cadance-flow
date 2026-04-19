import { createClient } from '@supabase/supabase-js';
import { useAuth0 } from '@auth0/auth0-react';
import { useCallback } from 'react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// DİKKAT: Değişkeni fonksiyonun dışında tanımlıyoruz.
// Böylece component render olsa bile bu değişken hafızada kalır.
let memoizedSupabase = null;

export const useSupabase = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getClient = useCallback(async () => {
    try {
      const token = await getAccessTokenSilently();

      // Eğer daha önce yaratılmadıysa yarat, yaratıldıysa mevcut olanı kullan
      if (!memoizedSupabase) {
        memoizedSupabase = createClient(supabaseUrl, supabaseAnonKey, {
          global: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });
      } else {
        // Mevcut istemcinin sadece header'ını (token) güncelliyoruz
        // Bu sayede "Multiple Instance" uyarısı tetiklenmez
        memoizedSupabase.realtime.setAuth(token); // Realtime kullanıyorsan
        memoizedSupabase.auth.setSession({ access_token: token, refresh_token: '' }); // Auth session güncelleme
      }

      return memoizedSupabase;
    } catch (error) {
      console.error("Supabase client hatası:", error);
      throw error;
    }
  }, [getAccessTokenSilently]);

  return { getClient };
};