import { useState, useEffect } from 'react';
import { useSupabase } from './useSupabase'; // hook yolunu kontrol et

export const useFetchProjects = (user) => {
  const { getClient } = useSupabase(); // Yetkili client üreten fonksiyonu alıyoruz
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!user) return;

    const getData = async () => {
      setLoading(true);
      
      try {
        // 0. Her istekte taze bir authorized supabase instance alıyoruz
        const supabase = await getClient();

        // 1. Get the role from the profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.sub) // user.sub'ın "google-oauth2|..." olduğundan eminiz
          .single();

        const userRole = profile?.role || 'client';
        setRole(userRole);

        // 2. Fetch Projects with Role-Based Filter
        let projectQuery = supabase
          .from('cadance_flow') // <--- BURAYI KONTROL ET: 'cadance_flow'
          .select('*');


        // RLS olsa bile güvenli tarafta kalmak için filtreyi koruyoruz
        if (userRole !== 'admin') {
          projectQuery = projectQuery.eq('client_id', user.sub);
        }

        const { data: projectData } = await projectQuery.order('created_at', { ascending: true });
        if (projectData) setProjects(projectData);

        // 3. Fetch Logs with Role-Based Filter
        let logsQuery = supabase
          .from('activity_logs')
          .select('*');

        // SQL'de profile_id olarak kurduğumuz için burayı güncelledik
        if (userRole !== 'admin') {
          logsQuery = logsQuery.eq('profile_id', user.sub); 
        }

        const { data: logData, error: logError } = await logsQuery.order('created_at', { descending: true });
        
        if (!logError) setLogs(logData);

      } catch (err) {
        console.error("Fetch hatası:", err.message);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [user, getClient]); // getClient'ı dependency listesine eklemek güvenlidir

  return { projects, loading, role, logs };
};